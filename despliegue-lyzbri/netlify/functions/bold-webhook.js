// Netlify Function — recibe las notificaciones (webhook) de Bold.
// Valida x-bold-signature de forma segura (sin llaves vacias, correccion M4).
// Verifica monto exacto contra caso en HubSpot (correccion M3).
// Idempotente: previene re-procesamiento duplicado.

const crypto = require('crypto');
const { PRECIOS } = require('./lib/bold-pago');
const { calcularPrecioInsolvencia } = require('./lib/insolvencia');

function firmaValida(body, firma) {
  if (!firma) return false;
  const b64 = Buffer.from(body || '', 'utf8').toString('base64');
  // Correccion M4: NUNCA aceptar clave vacia en ningun entorno
  const secret = process.env.BOLD_SECRET_KEY_PRODUCCION || process.env.BOLD_SECRET_KEY_PRUEBAS;
  if (!secret || typeof secret !== 'string' || secret.trim() === '') {
    return false;
  }
  const esperado = crypto.createHmac('sha256', secret).update(b64).digest('hex');
  const a = Buffer.from(esperado, 'utf8');
  const b = Buffer.from(String(firma).trim().toLowerCase(), 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Ejecuta una llamada HTTP a HubSpot con degradación controlada:
 * Si HubSpot devuelve HTTP 400 por propiedades no existentes o inválidas en el portal,
 * identifica las propiedades rechazadas, las retira del payload y reintenta la operación.
 * Asegura que pago_confirmado nunca falle por inconsistencias en campos complementarios.
 */
async function fetchHubSpotConDegradacion(url, options, props) {
  let res = await fetch(url, options);
  if (res.status === 400) {
    const errText = await res.text();
    const rechazadas = [];
    try {
      const j = JSON.parse(errText);
      if (j.context && j.context.propertyName) {
        (Array.isArray(j.context.propertyName) ? j.context.propertyName : [j.context.propertyName]).forEach(p => {
          if (p && !rechazadas.includes(p)) rechazadas.push(p);
        });
      }
      if (Array.isArray(j.propertiesNotFound)) {
        j.propertiesNotFound.forEach(p => {
          if (p && !rechazadas.includes(p)) rechazadas.push(p);
        });
      }
      if (Array.isArray(j.errors)) {
        j.errors.forEach(e => {
          if (e.context && e.context.propertyName) {
            (Array.isArray(e.context.propertyName) ? e.context.propertyName : [e.context.propertyName]).forEach(p => {
              if (p && !rechazadas.includes(p)) rechazadas.push(p);
            });
          }
          if (e.message) {
            const m = e.message.match(/Property ["']?([a-zA-Z0-9_]+)["']? does not exist/i);
            if (m && m[1] && !rechazadas.includes(m[1])) rechazadas.push(m[1]);
          }
        });
      }
      if (j.message) {
        const matches = j.message.match(/Property ["']?([a-zA-Z0-9_]+)["']? does not exist/gi);
        if (matches) {
          matches.forEach(m => {
            const clean = m.replace(/Property ["']?/i, '').replace(/["']? does not exist/i, '').trim();
            if (clean && !rechazadas.includes(clean)) rechazadas.push(clean);
          });
        }
      }
    } catch (_) {}

    if (rechazadas.length > 0) {
      console.warn('[HubSpot Degradación Controlada - Webhook] Propiedades no reconocidas por el CRM:', rechazadas);
      const propsDepuradas = { ...props };
      rechazadas.forEach(p => delete propsDepuradas[p]);
      const nuevoBody = JSON.parse(options.body);
      nuevoBody.properties = propsDepuradas;
      const reintento = await fetch(url, { ...options, body: JSON.stringify(nuevoBody) });
      return { res: reintento, degradado: true, rechazadas, errText: null };
    }
    return { res, degradado: false, rechazadas: [], errText };
  }
  return { res, degradado: false, rechazadas: [], errText: null };
}

async function alertar(referencia, error) {
  const url = process.env.MAKE_DOCUMENTOS_WEBHOOK_URL || process.env.MAKE_ALIMENTOS_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ruta: 'MANUAL_REVIEW',
        service_code: 'BOLD',
        referencia: referencia,
        error: error,
        correo_notificacion: process.env.LYZBRI_NOTIFY_EMAIL || 'contacto@lyzbri.com'
      })
    });
    return r.ok;
  } catch (e) { return false; }
}

async function leerRespuestaHubSpot(response) {
  const body = await response.text();
  let json = null;
  try { json = JSON.parse(body); } catch (_) {}
  return { status: response.status, ok: response.ok, body, json };
}

function clasificarErrorHubSpot(status, body) {
  if (status === 401) return 'credenciales';
  if (status === 403 && /cloudflare|<!doctype\s+html|<html/i.test(body || '')) return 'bloqueo_intermediario';
  if (status === 403) return 'credenciales/permisos';
  if (status === 400 || status === 422) return 'validación/payload';
  if (status === 404) return 'not-found';
  if (status === 429) return 'límite_de_solicitudes';
  if (status >= 500) return 'error_servidor';
  return 'error_http';
}

function cuerpoSeguroHubSpot(respuesta) {
  if (respuesta.json && typeof respuesta.json === 'object') {
    const j = respuesta.json;
    const seguro = {
      status: j.status,
      category: j.category,
      message: j.message,
      correlationId: j.correlationId,
      errors: Array.isArray(j.errors) ? j.errors.map(function (e) {
        return { code: e.code, category: e.category, message: e.message };
      }) : undefined
    };
    return JSON.stringify(seguro);
  }
  return String(respuesta.body || '').slice(0, 1500);
}

async function procesarPago(ev, referencia) {
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    await alertar(referencia, 'Bold aprobó un pago pero falta HUBSPOT_PRIVATE_APP_TOKEN para registrarlo.');
    return false;
  }

  const H = { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, 'Content-Type': 'application/json' };
  try {
    const s = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers: H,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referencia }] }],
        properties: ['referencia_pago', 'pago_confirmado', 'lyzbri_service_code', 'lyzbri_case_type', 'cant_acreedores'],
        limit: 2
      })
    });
    const search = await leerRespuestaHubSpot(s);
    if (!search.ok || !search.json || !Array.isArray(search.json.results)) {
      await alertar(referencia, JSON.stringify({
        etapa: 'SEARCH', clasificación: 'error_busqueda_hubspot',
        status: search.status, body: cuerpoSeguroHubSpot(search)
      }));
      return false;
    }

    const contactos = search.json.results;
    if (contactos.length === 0) {
      await alertar(referencia, 'Bold aprobó un pago pero la búsqueda de HubSpot no encontró el caso (' + referencia + ').');
      return false;
    }
    if (contactos.length !== 1 || !contactos[0].id || !contactos[0].properties ||
        contactos[0].properties.referencia_pago !== referencia) {
      await alertar(referencia, JSON.stringify({
        etapa: 'SEARCH', clasificación: 'busqueda_ambigua_o_referencia_no_coincidente',
        status: search.status, coincidencias: contactos.length
      }));
      return false;
    }

    const contacto = contactos[0];
    const props = contacto.properties || {};

    // Idempotencia estricta: si ya fue confirmado, retornar exito sin duplicar operaciones
    if (props.pago_confirmado === 'true' || props.pago_confirmado === true) {
      return true;
    }

    // Correccion M3: Validacion obligatoria de monto pagado vs monto esperado
    const totalPagado = Number(ev.data && ev.data.amount && ev.data.amount.total);
    const serviceCode = props.lyzbri_service_code;
    const caseType = props.lyzbri_case_type;
    let esperado = null;

    if (serviceCode === 'DEUDAS' || (caseType && caseType.startsWith('INSOLV_'))) {
      esperado = calcularPrecioInsolvencia(caseType, props.cant_acreedores);
    } else if (serviceCode && caseType) {
      esperado = PRECIOS[`${serviceCode}|${caseType}`];
    }

    if (esperado && (!totalPagado || totalPagado < esperado)) {
      await alertar(referencia, `Bold aprobó transacción pero el monto pagado (${totalPagado} COP) es menor al esperado (${esperado} COP). Caso retenido en MANUAL_REVIEW.`);
      const propsManual = {
        estado_revision: 'MANUAL_REVIEW',
        monto_pagado_verificado: String(totalPagado),
        monto_esperado_verificado: String(esperado)
      };
      await fetchHubSpotConDegradacion(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contacto.id)}`,
        {
          method: 'PATCH', headers: H,
          body: JSON.stringify({ properties: propsManual })
        },
        propsManual
      );
      // O-1: Retener en MANUAL_REVIEW y retornar éxito para que el webhook responda 200 (sin reintentos ni spam)
      return { retenido: true, motivo: 'monto_menor_al_esperado' };
    }

    // Confirmacion del pago en HubSpot (H-01 y H-08)
    const propertiesToUpdate = {
      pago_confirmado: 'true',
      fecha_pago_confirmado: new Date().toISOString().slice(0, 10)
    };
    // H-08: estado_caso_insolvencia se escribe SOLO si el caso corresponde a insolvencia
    if (caseType && caseType.startsWith('INSOLV_')) {
      propertiesToUpdate.estado_caso_insolvencia = 'PAGADO_SIN_DOCS';
    }

    const patchResult = await fetchHubSpotConDegradacion(
      `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contacto.id)}`,
      {
        method: 'PATCH', headers: H,
        body: JSON.stringify({ properties: propertiesToUpdate })
      },
      propertiesToUpdate
    );
    const patch = await leerRespuestaHubSpot(patchResult.res);
    const confirmado = patch.json && patch.json.properties &&
      (patch.json.properties.pago_confirmado === 'true' || patch.json.properties.pago_confirmado === true);
    if (!patch.ok || !confirmado) {
      await alertar(referencia, JSON.stringify({
        etapa: 'PATCH',
        clasificación: patch.ok ? 'respuesta_invalida_de_PATCH' : clasificarErrorHubSpot(patch.status, patch.body),
        status: patch.status,
        body: cuerpoSeguroHubSpot(patch),
        degradado: patchResult.degradado,
        rechazadas: patchResult.rechazadas
      }));
      return false;
    }
    return true;
  } catch (e) {
    await alertar(referencia, 'Bold aprobó un pago pero falló el registro en HubSpot: ' + e.message);
    return false;
  }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'method_not_allowed' }) };
  }
  const headers = event.headers || {};
  const body = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
  const firma = headers['x-bold-signature'] || headers['X-Bold-Signature'];
  if (!firmaValida(body, firma)) {
    return { statusCode: 401, body: JSON.stringify({ ok: false, reason: 'firma_invalida' }) };
  }

  let ev;
  try { ev = JSON.parse(body); } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }
  const tipo = ev && ev.type;
  const data = (ev && ev.data) || {};
  const referencia = (data.metadata && data.metadata.reference) || data.reference;

  // Solo procesar pagos aprobados autenticos (ignorar pendientes, cancelados o rechazados)
  if (tipo !== 'SALE_APPROVED' || (data.payment_status && data.payment_status !== 'APPROVED') || !referencia) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, ignorado: tipo || 'sin_tipo' }) };
  }

  const procesado = await procesarPago(ev, referencia);
  if (!procesado) {
    return { statusCode: 503, body: JSON.stringify({ ok: false, recibido: true, reintento: true }) };
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true, recibido: true, retenido: Boolean(procesado && procesado.retenido) }) };
};
