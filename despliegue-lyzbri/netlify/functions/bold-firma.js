// Netlify Function — prepara el pago con el Botón de pagos de Bold.
// Recibe la referencia del caso y el producto elegido; devuelve la llave de
// identidad, el monto (tomado del catálogo del servidor, nunca del navegador)
// y la firma de integridad SHA-256 calculada con la llave secreta, que nunca
// sale del servidor.

const { PRECIOS, REFERENCIA_VALIDA, llaves, firma } = require('./lib/bold-pago');
const { calcularPrecioInsolvencia } = require('./lib/insolvencia');

// Restricción estricta de checkout en línea v1 (D19 / Sección 4).
// El checkout en línea de insolvencia autoriza ÚNICAMENTE los cuatro (4) SKUs naturales:
// 1. DIAG_NAT ($89.000)
// 2. DIAG_MOD ($89.000)
// 3. EXP_NEG ($249.000)
// 4. SEGUIMIENTO ($29.000)
// (más los servicios preexistentes E1–E9).
// La Carta de negociación se conserva en catálogo y precios para casos de transición (D8/D20),
// pero NO se habilita para checkout automático en línea, respetando la regla de los cuatro SKU.
const SKUS_CHECKOUT_ONLINE_DEUDAS = new Set([
  'DEUDAS|INSOLV_DIAG_NAT',
  'DEUDAS|INSOLV_MOD_NAT',
  'DEUDAS|INSOLV_NEG_NAT',
  'DEUDAS|INSOLV_SEG_NAT'
]);

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

  // Rechazo en el servidor de servicios empresariales y de representación si intentan pago automático (D19)
  if (clave.startsWith('DEUDAS|') && !SKUS_CHECKOUT_ONLINE_DEUDAS.has(clave)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        reason: 'producto_requiere_contacto_manual',
        message: 'Los servicios empresariales y de representación no admiten checkout automático; requieren evaluación y contacto legal.'
      })
    };
  }

  // Cálculo del monto desde la configuración confiable del servidor (D9 / D19)
  let monto = PRECIOS[clave];
  if (clave.startsWith('DEUDAS|INSOLV_') && payload.cantAcreedores) {
    const caseType = clave.split('|')[1];
    const calculado = calcularPrecioInsolvencia(caseType, payload.cantAcreedores);
    if (calculado) monto = calculado;
  }

  if (!monto || typeof monto !== 'number' || monto <= 0) {
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
