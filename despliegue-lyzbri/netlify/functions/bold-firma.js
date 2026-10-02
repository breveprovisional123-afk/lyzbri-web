// Netlify Function — prepara el pago con el Botón de pagos de Bold.
// Recibe la referencia del caso y el producto elegido; devuelve la llave de
// identidad, el monto (tomado del catálogo del servidor, nunca del navegador)
// y la firma de integridad SHA-256 calculada con la llave secreta, que nunca
// sale del servidor.

const { PRECIOS, REFERENCIA_VALIDA, llaves, firma } = require('./lib/bold-pago');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'method_not_allowed' }) };
  }
  let payload;
  try { payload = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }
  const referencia = String((payload && payload.referencia) || '');
  const clave = String((payload && payload.clave) || '');
  if (!REFERENCIA_VALIDA.test(referencia)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'referencia_invalida' }) };
  }
  const monto = PRECIOS[clave];
  if (!monto) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'producto_no_cobrable' }) };
  }
  const { apiKey, secret, ambiente } = llaves();
  if (!apiKey || !secret) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'bold_no_configurado' }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ ok: true, apiKey, amount: monto, currency: 'COP', signature: firma(referencia, monto, secret), ambiente })
  };
};
