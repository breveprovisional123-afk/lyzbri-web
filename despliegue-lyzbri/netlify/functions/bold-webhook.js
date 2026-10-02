// Netlify Function — recibe las notificaciones (webhook) de Bold.
// URL para registrar en el panel de Bold (Integraciones → Webhooks):
//   https://lyzbri.com/.netlify/functions/bold-webhook
//
// Qué hace:
//  - Verifica la firma x-bold-signature: HMAC-SHA256 (hex) del cuerpo codificado
//    en Base64, con la llave secreta de producción. En ambiente de pruebas Bold
//    firma con llave vacía; eso solo se acepta fuera de producción.
//  - SALE_APPROVED: marca pago_confirmado = true en el caso de HubSpot cuya
//    referencia_pago coincide con data.metadata.reference. Así queda constancia
//    del pago aunque el cliente cierre la ventana antes de volver a la página.
//    Si el caso no existe, alerta a Liza (ruta MANUAL_REVIEW, sin documento).
//  - Otros eventos (SALE_REJECTED, VOID_*): se reciben y se ignoran.
//  - Responde 200 rápido (Bold espera respuesta en menos de 2 s y reintenta
//    a los 15 min, 1 h, 4 h, 8 h y 24 h). Es idempotente: repetir no daña nada.

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
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    await alertar(referencia, 'Bold aprobó un pago pero falta HUBSPOT_PRIVATE_APP_TOKEN para registrarlo.');
    return { statusCode: 200, body: JSON.stringify({ ok: true, registrado: false }) };
  }

  const H = { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, 'Content-Type': 'application/json' };
  try {
    const s = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers: H,
      body: JSON.stringify({ filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referencia }] }],
        properties: ['pago_confirmado'] })
    });
    const sd = await s.json();
    const contacto = sd.results && sd.results[0];
    if (!contacto) {
      await alertar(referencia, 'Bold aprobó un pago (' + ((data.amount && data.amount.total) || '?') + ' COP, transacción ' + (data.payment_id || ev.subject || '?') + ') pero el caso no aparece en HubSpot. Contactar al cliente.');
      return { statusCode: 200, body: JSON.stringify({ ok: true, registrado: false, alerta: true }) };
    }
    if (contacto.properties && contacto.properties.pago_confirmado === 'true') {
      return { statusCode: 200, body: JSON.stringify({ ok: true, yaRegistrado: true }) };
    }
    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contacto.id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ properties: { pago_confirmado: 'true' } })
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true, registrado: true }) };
  } catch (e) {
    // Se responde 200 igual para que Bold no reintente en bucle; queda la alerta.
    await alertar(referencia, 'Bold aprobó un pago pero falló el registro en HubSpot: ' + e.message);
    return { statusCode: 200, body: JSON.stringify({ ok: true, registrado: false, error: true }) };
  }
};
