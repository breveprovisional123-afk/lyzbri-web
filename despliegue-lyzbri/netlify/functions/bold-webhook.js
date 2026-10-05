// Netlify Function — recibe las notificaciones (webhook) de Bold.
// URL para registrar en el panel de Bold (Integraciones → Webhooks):
//   https://lyzbri.com/.netlify/functions/bold-webhook
//
// Valida x-bold-signature y procesa SALE_APPROVED antes de confirmar la recepción.
// Si falla el registro en HubSpot, devuelve un error HTTP para permitir reintentos de Bold.
// Repetir una notificación es seguro: pago_confirmado evita actualizar dos veces.

const crypto = require('crypto');

function firmaValida(body, firma) {
  if (!firma) return false;
  const b64 = Buffer.from(body || '', 'utf8').toString('base64');
  const llaves = [];
  if (process.env.BOLD_SECRET_KEY_PRODUCCION) llaves.push(process.env.BOLD_SECRET_KEY_PRODUCCION);
  if (process.env.CONTEXT !== 'production') llaves.push(''); // ambiente de pruebas de Bold
  return llaves.some(function (k) {
    const esperado = crypto.createHmac('sha256', k).update(b64).digest('hex');
    const a = Buffer.from(esperado, 'utf8');
    const b = Buffer.from(String(firma).trim().toLowerCase(), 'utf8');
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

async function alertar(referencia, error) {
  const url = process.env.MAKE_DOCUMENTOS_WEBHOOK_URL || process.env.MAKE_ALIMENTOS_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta: 'MANUAL_REVIEW', service_code: 'BOLD', referencia: referencia, error: error,
        correo_notificacion: process.env.LYZBRI_NOTIFY_EMAIL || 'contacto@lyzbri.com' })
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
  // En errores JSON conserva el diagnóstico útil sin reenviar propiedades completas del contacto.
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
        properties: ['referencia_pago', 'pago_confirmado'],
        limit: 2
      })
    });
    const search = await leerRespuestaHubSpot(s);
    if (!search.ok) {
      await alertar(referencia, JSON.stringify({
        etapa: 'SEARCH',
        clasificación: clasificarErrorHubSpot(search.status, search.body),
        status: search.status,
        body: cuerpoSeguroHubSpot(search)
      }));
      return false;
    }
    if (!search.json || !Array.isArray(search.json.results)) {
      await alertar(referencia, JSON.stringify({
        etapa: 'SEARCH', clasificación: 'respuesta_inválida_de_búsqueda',
        status: search.status, body: cuerpoSeguroHubSpot(search)
      }));
      return false;
    }

    const contactos = search.json.results;
    if (contactos.length === 0) {
      await alertar(referencia, 'Bold aprobó un pago (' + ((ev.data.amount && ev.data.amount.total) || '?') +
        ' COP, transacción ' + (ev.data.payment_id || ev.subject || '?') + ') pero la búsqueda de HubSpot no encontró el caso. ' +
        JSON.stringify({ etapa: 'SEARCH', status: search.status, total: 0 }));
      return false;
    }
    if (contactos.length !== 1 || !contactos[0].id || !contactos[0].properties ||
        contactos[0].properties.referencia_pago !== referencia) {
      await alertar(referencia, JSON.stringify({
        etapa: 'SEARCH', clasificación: 'búsqueda_ambigua_o_referencia_no_coincidente',
        status: search.status, coincidencias: contactos.length
      }));
      return false;
    }

    const contacto = contactos[0];
    if (contacto.properties.pago_confirmado === 'true' || contacto.properties.pago_confirmado === true) return true;

    const actualizacion = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contacto.id)}`, {
      method: 'PATCH', headers: H,
      body: JSON.stringify({ properties: { pago_confirmado: 'true' } })
    });
    const patch = await leerRespuestaHubSpot(actualizacion);
    const confirmado = patch.json && patch.json.properties &&
      (patch.json.properties.pago_confirmado === 'true' || patch.json.properties.pago_confirmado === true);
    if (!patch.ok || !confirmado) {
      await alertar(referencia, JSON.stringify({
        etapa: 'PATCH',
        clasificación: patch.ok ? 'respuesta_inválida_de_PATCH' : clasificarErrorHubSpot(patch.status, patch.body),
        status: patch.status,
        body: cuerpoSeguroHubSpot(patch)
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
  const referencia = data.metadata && data.metadata.reference;

  if (tipo !== 'SALE_APPROVED' || !referencia) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, ignorado: tipo || 'sin_tipo' }) };
  }

  const procesado = await procesarPago(ev, referencia);
  if (!procesado) {
    return { statusCode: 503, body: JSON.stringify({ ok: false, recibido: true, reintento: true }) };
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true, recibido: true }) };
};
