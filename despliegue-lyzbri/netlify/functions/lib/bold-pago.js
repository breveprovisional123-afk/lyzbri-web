const { calcularPrecioInsolvencia } = require('./insolvencia');
// Utilidades de pago con Bold (Botón de pagos, integración manual).
// Lo usan bold-firma.js, validar-formulario.js, guardar-formulario.js,
// enviar-alimentos.js y enviar-documento.js.
//
// Llaves (variables de entorno de Netlify, nunca en el código porque el
// repositorio es público):
//   BOLD_API_KEY_PRODUCCION / BOLD_SECRET_KEY_PRODUCCION  -> cobro real
//   BOLD_API_KEY_PRUEBAS    / BOLD_SECRET_KEY_PRUEBAS     -> ambiente de pruebas
// Si existen las de producción se usan esas; si no, las de pruebas.
//
// Documentación Bold:
//   Firma de integridad: SHA-256 de {referencia}{monto}{divisa}{llave secreta}.
//   Consulta del pago:   GET https://payments.api.bold.co/v2/payment-voucher/{referencia}
//                        cabecera Authorization: x-api-key {llave de identidad}

const crypto = require('crypto');

// Precios en COP por producto (service_code|case_type). Deben coincidir con el
// CATALOGO de la landing (index.html). El servidor firma y verifica SOLO con
// estos valores: el navegador nunca decide cuánto se cobra.
const PRECIOS = {
  'HABEAS_DATA|PAGO_HISTORICO': 229000,
  'HABEAS_DATA|SUPLANTACION': 229000,
  'HABEAS_DATA|DATOS_INCORRECTOS': 229000,
  'HABEAS_DATA|OBLIGACION_NO_RECONOCIDA': 229000,
  'HABEAS_DATA|CASO_INCIERTO': 229000,
  'DEUDAS|INSOLV_DIAG_NAT': 89000,
  'DEUDAS|INSOLV_MOD_NAT': 89000,
  'DEUDAS|INSOLV_NEG_NAT': 249000,
  'DEUDAS|INSOLV_SEG_NAT': 29000,
  'DEUDAS|INSOLV_REP_NAT': 2000000,
  'DEUDAS|INSOLV_DIAG_EMP': 390000,
  'DEUDAS|INSOLV_EXP_EMP': 1200000,
  'DEUDAS|INSOLV_REORG_EMP': 15000000,
  'DEUDAS|INSOLV_SEG_EMP': 149000,
  'MARCA|FORMULARIO_REGISTRO': 199000,
  'TEA|DERECHO_PETICION': 149000,
  'TEA|TUTELA': 420000,
  'TEA|DESACATO_AUTOGESTION': 99000,
  'TEA|DESACATO_ACOMPANAMIENTO': 600000,
  'TEA|DENUNCIA_DEPORTIVA': 229000,
  'ALIMENTOS|FIJACION_AUTOGESTION': 49000,
  'ALIMENTOS|AUMENTO_AUTOGESTION': 49000,
  'ALIMENTOS|DISMINUCION_AUTOGESTION': 59000,
  'ALIMENTOS|EXONERACION_AUTOGESTION': 59000,
  'ALIMENTOS|FIJACION_ACOMPANAMIENTO': 129000,
  'ALIMENTOS|AUMENTO_ACOMPANAMIENTO': 129000,
  'ALIMENTOS|DISMINUCION_ACOMPANAMIENTO': 149000,
  'ALIMENTOS|EXONERACION_ACOMPANAMIENTO': 149000
};

// Bold: identificador único de la venta, máx. 60 caracteres (letras, números, - y _).
const REFERENCIA_VALIDA = /^[A-Za-z0-9_-]{1,60}$/;

function llaves() {
  return {
    apiKey: process.env.BOLD_API_KEY_PRODUCCION || process.env.BOLD_API_KEY_PRUEBAS || '',
    secret: process.env.BOLD_SECRET_KEY_PRODUCCION || process.env.BOLD_SECRET_KEY_PRUEBAS || '',
    ambiente: process.env.BOLD_API_KEY_PRODUCCION ? 'produccion' : 'pruebas'
  };
}

function firma(referencia, monto, secret) {
  return crypto.createHash('sha256').update(`${referencia}${monto}COP${secret}`).digest('hex');
}

const espera = (ms) => new Promise((r) => setTimeout(r, ms));

// Consulta el estado del pago en Bold. Bold avisa que la transacción puede
// tardar en aparecer después del checkout, así que se reintenta mientras
// responda NO_TRANSACTION_FOUND o PROCESSING.
async function consultarPago(referencia, intentos) {
  const { apiKey } = llaves();
  if (!apiKey) return { ok: false, reason: 'bold_no_configurado' };
  if (!REFERENCIA_VALIDA.test(String(referencia || ''))) return { ok: false, reason: 'referencia_invalida' };
  const max = intentos || 3;
  let ultimo = null;
  for (let i = 0; i < max; i++) {
    if (i) await espera(2000);
    let r;
    try {
      r = await fetch(`https://payments.api.bold.co/v2/payment-voucher/${encodeURIComponent(referencia)}`, {
        headers: { Authorization: `x-api-key ${apiKey}` }
      });
    } catch (e) {
      ultimo = { ok: false, reason: 'bold_unreachable' };
      continue;
    }
    if (!r.ok) { ultimo = { ok: false, reason: 'bold_unreachable', http: r.status }; continue; }
    const d = await r.json();
    ultimo = { ok: true, status: d.payment_status, total: Number(d.total), transaccion: d.transaction_id || null, medio: d.payment_method || null };
    if (d.payment_status !== 'NO_TRANSACTION_FOUND' && d.payment_status !== 'PROCESSING') break;
  }
  return ultimo || { ok: false, reason: 'bold_unreachable' };
}

// Pago aprobado y, si se conoce el producto, por el valor completo.
async function verificarPago(referencia, clave, cantAcreedores) {
  const c = await consultarPago(referencia);
  if (!c.ok) return { aprobado: false, reason: c.reason };
  if (c.status !== 'APPROVED') return { aprobado: false, reason: 'payment_not_approved', status: c.status };
  let esperado = clave ? PRECIOS[clave] : null;
  if (clave && clave.startsWith('DEUDAS|INSOLV_') && cantAcreedores) {
    const caseType = clave.split('|')[1];
    esperado = calcularPrecioInsolvencia(caseType, cantAcreedores);
  }
  if (esperado && !(c.total >= esperado)) {
    return { aprobado: false, reason: 'monto_no_coincide', total: c.total, esperado };
  }
  return { aprobado: true, total: c.total, transaccion: c.transaccion, medio: c.medio, esperado };
}

module.exports = { PRECIOS, REFERENCIA_VALIDA, llaves, firma, consultarPago, verificarPago };
