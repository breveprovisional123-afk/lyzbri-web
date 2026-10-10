// =============================================================================
// LYZBRI - Modulo de Arquitectura e Inteligencia de Negocio: Linea de Insolvencia
// Normalizacion segun F1 #1 a #9, Decisiones D1 a D25, Matriz Juridica y 23 Plantillas
// =============================================================================

const {
  CATALOGO_PLANTILLAS,
  markdownToHtml,
  seleccionarPlantilla,
  renderizarPlantilla
} = require('./plantillas-correos');

const TIEMPOS_ENTREGA = {
  INSOLV_DIAG_NAT: '2 días hábiles',
  INSOLV_MOD_NAT: '3 días hábiles',
  INSOLV_NEG_NAT: '3 días hábiles',
  INSOLV_SEG_NAT: 'Suscripción mensual / seguimiento activo',
  INSOLV_REP_NAT: 'Plazo del encargo según propuesta',
  INSOLV_DIAG_EMP: '5 días hábiles',
  INSOLV_EXP_EMP: '15 días hábiles',
  INSOLV_REORG_EMP: 'Según propuesta y etapa de reorganización',
  INSOLV_SEG_EMP: 'Suscripción mensual / seguimiento activo'
};

// Matriz de precios aprobada por la propietaria (5 tramos oficiales)
const MATRIZ_PRECIOS_INSOLVENCIA = {
  DIAGNOSTICO_MODALIDAD: [
    { min: 1, max: 2, valor: 89000 },
    { min: 3, max: 5, valor: 179000 },
    { min: 6, max: 7, valor: 268000 },
    { min: 8, max: 9, valor: 357000 },
    { min: 10, max: Infinity, valor: 446000 }
  ],
  NEGOCIACION: [
    { min: 1, max: 2, valor: 249000 },
    { min: 3, max: 5, valor: 499000 },
    { min: 6, max: 7, valor: 748000 },
    { min: 8, max: 9, valor: 998000 },
    { min: 10, max: Infinity, valor: 1247000 }
  ],
  SEGUIMIENTO: [
    { min: 1, max: 2, valor: 29000 },
    { min: 3, max: 5, valor: 59000 },
    { min: 6, max: 7, valor: 88000 },
    { min: 8, max: 9, valor: 117000 },
    { min: 10, max: Infinity, valor: 146000 }
  ]
};

// Calculo server-side estricto de precio escalonado (M1 correccion)
// Rechaza valores ausentes, nulos, negativos o no enteros; no confia en defaults
function calcularPrecioInsolvencia(caseType, cantAcreedores) {
  if (cantAcreedores === undefined || cantAcreedores === null || cantAcreedores === '') {
    return null;
  }

  const n = Number(cantAcreedores);
  if (!Number.isInteger(n) || n < 1) {
    return null;
  }

  switch (caseType) {
    case 'INSOLV_DIAG_NAT':
    case 'INSOLV_MOD_NAT':
      if (n <= 2) return 89000;
      if (n <= 5) return 179000;
      if (n <= 7) return 268000;
      if (n <= 9) return 357000;
      return 446000;

    case 'INSOLV_NEG_NAT':
      if (n <= 2) return 249000;
      if (n <= 5) return 499000;
      if (n <= 7) return 748000;
      if (n <= 9) return 998000;
      return 1247000;

    case 'INSOLV_SEG_NAT':
      if (n <= 2) return 29000;
      if (n <= 5) return 59000;
      if (n <= 7) return 88000;
      if (n <= 9) return 117000;
      return 146000;

    case 'INSOLV_REP_NAT':
      return 2000000;

    case 'INSOLV_DIAG_EMP':
      return 390000;

    case 'INSOLV_EXP_EMP':
      return 1200000;

    case 'INSOLV_REORG_EMP':
      return 15000000;

    case 'INSOLV_SEG_EMP':
      return 149000;

    default:
      return null;
  }
}

// Generador de enlace seguro de carga sin registro (Fillout / D13 / D17.7 / H3)
// No inventa URLs ficticias: requiere que FILLOUT_UPLOAD_URL este configurada y activa
function generarEnlaceCargaDocumentos(radicado, email) {
  const baseUrl = process.env.FILLOUT_UPLOAD_URL;
  if (!baseUrl || typeof baseUrl !== 'string' || baseUrl.trim() === '') {
    return null;
  }
  const r = encodeURIComponent(radicado || '');
  const e = encodeURIComponent(email || '');
  const sep = baseUrl.indexOf('?') !== -1 ? '&' : '?';
  return baseUrl + sep + 'radicado=' + r + (email ? '&email=' + e : '');
}

// Canal directo de soporte WhatsApp con radicado obligatorio
function generarEnlaceWhatsapp(radicado) {
  const rad = radicado ? String(radicado) : 'PENDIENTE';
  const msg = encodeURIComponent('Hola Liza, tengo una consulta sobre mi caso de insolvencia con radicado ' + rad);
  return 'https://wa.me/573115872929?text=' + msg;
}

// Generador post-pago unificado con las 23 plantillas de correo (D10 / D11 / D17.7)
function generarNotificacionPostPago(caseTypeOrOpts, regimenClave, nombreCliente) {
  const opts = (typeof caseTypeOrOpts === 'object' && caseTypeOrOpts !== null) ? caseTypeOrOpts : {};
  const caseType = opts.case_type || caseTypeOrOpts;
  const regimen = opts.regimen || opts.regimenClave || regimenClave || 'PN_NC_CGP';
  const nombre = opts.nombre || opts.nombreCliente || nombreCliente || 'Cliente';
  const radicado = opts.radicado || opts.referenciaPago || opts.referencia || 'RAD-PENDIENTE';
  const email = opts.email || opts.correo || '';

  // 1. Seleccion determinista de plantilla
  const sel = seleccionarPlantilla({ case_type: caseType, regimen: regimen });
  if (!sel.ok) {
    return {
      ok: false,
      error: 'MANUAL_REVIEW',
      motivo: sel.motivo || 'sin_plantilla_valida',
      case_type: caseType,
      regimen: regimen
    };
  }

  // 2. Comprobacion de enlace de carga seguro
  const enlaceCarga = opts.enlace_carpeta_cliente || generarEnlaceCargaDocumentos(radicado, email);
  if (!enlaceCarga) {
    // Spec v2.1 §8.2: Si la herramienta de carga no esta lista, no activar envio automatico
    return {
      ok: false,
      error: 'BLOQUEADO_POR_HERRAMIENTA_CARGA',
      motivo: 'fillout_no_configurado_o_inactivo',
      idPlantilla: sel.id,
      radicado: radicado,
      advertencia: 'El correo post-pago contiene la variable enlace_carpeta_cliente que requiere un formulario de carga funcional'
    };
  }

  // 3. Renderizado estricto
  const variables = {
    nombre_cliente: nombre,
    radicado: radicado,
    enlace_carpeta_cliente: enlaceCarga,
    tiempo_entrega: TIEMPOS_ENTREGA[caseType] || '2 a 3 días hábiles'
  };

  const render = renderizarPlantilla(sel.id, variables);
  if (!render.ok) {
    return {
      ok: false,
      error: render.error,
      faltantes: render.faltantes,
      idPlantilla: sel.id
    };
  }

  return {
    ok: true,
    idPlantilla: sel.id,
    asunto: render.asunto,
    bodyHtml: render.cuerpoHtml,
    bodyMarkdown: render.cuerpoMarkdown,
    tiempoEntrega: TIEMPOS_ENTREGA[caseType] || '2 a 3 días hábiles',
    regimen: regimen,
    radicado: radicado,
    enlaceCarga: enlaceCarga
  };
}

// Embudo del frontend es la fuente unica de calificacion (F4.6)
function evaluarEmbudoInsolvencia() {
  return { route: 'MANUAL_REVIEW', sku: null, case_type: null, fallocerrado: true, deprecado: true };
}
function evaluarEmbudoEmpresarial() {
  return { route: 'MANUAL_REVIEW', sku: null, case_type: null, fallocerrado: true, deprecado: true };
}

module.exports = {
  TIEMPOS_ENTREGA,
  MATRIZ_PRECIOS_INSOLVENCIA,
  CATALOGO_PLANTILLAS,
  markdownToHtml,
  seleccionarPlantilla,
  renderizarPlantilla,
  calcularPrecioInsolvencia,
  generarEnlaceCargaDocumentos,
  generarEnlaceWhatsapp,
  generarNotificacionPostPago,
  evaluarEmbudoInsolvencia,
  evaluarEmbudoEmpresarial
};
