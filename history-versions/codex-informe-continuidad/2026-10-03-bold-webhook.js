// Netlify Function — recibe las notificaciones (webhook) de Bold.
// URL para registrar en el panel de Bold (Integraciones → Webhooks):
//   https://lyzbri.com/.netlify/functions/bold-webhook
//
// Valida x-bold-signature y responde 200 inmediatamente a notificaciones válidas.
// El registro en HubSpot y las alertas MANUAL_REVIEW continúan con waitUntil.
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

async function procesarPago(ev, referencia) {
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    await alertar(referencia, 'Bold aprobó un pago pero falta HUBSPOT_PRIVATE_APP_TOKEN para registrarlo.');
    return;
  }

  const H = { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, 'Content-Type': 'application/json' };
  try {
    const s = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers: H,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referencia }] }],
        properties: ['pago_confirmado'] })
    });
    if (!s.ok) throw new Error('HubSpot search respondió HTTP ' + s.status);
    const sd = await s.json();
    const contacto = sd.results && sd.results[0];
    if (!contacto) {
      await alertar(referencia, 'Bold aprobó un pago (' + ((ev.data.amount && ev.data.amount.total) || '?') + ' COP, transacción ' + (ev.data.payment_id || ev.subject || '?') + ') pero el caso no aparece en HubSpot. Contactar al cliente.');
      return;
    }
    if (contacto.properties && contacto.properties.pago_confirmado === 'true') return;

    const actualizacion = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contacto.id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ properties: { pago_confirmado: 'true' } })
    });
    if (!actualizacion.ok) throw new Error('HubSpot update respondió HTTP ' + actualizacion.status);
  } catch (e) {
    await alertar(referencia, 'Bold aprobó un pago pero falló el registro en HubSpot: ' + e.message);
  }
}

exports.handler = async (event, context) => {
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

  const tarea = procesarPago(ev, referencia);
  if (context && typeof context.waitUntil === 'function') {
    context.waitUntil(tarea);
  } else {
    tarea.catch(function (e) { console.error('Error procesando notificación Bold:', e); });
  }
  return { statusCode: 200, body: JSON.stringify({ ok: true, recibido: true }) };
};
