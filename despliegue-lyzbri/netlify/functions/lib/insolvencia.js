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
// Formula de precios de los F1 (referencia; el calculo real esta en calcularPrecioInsolvencia).
// hasta2 = hasta 2 acreedores; hasta5 = de 3 a 5; bloque = suma por cada 2 acreedores desde el 6.o, sin tope.
const MATRIZ_PRECIOS_INSOLVENCIA = {
  DIAGNOSTICO_MODALIDAD: { hasta2: 89000, hasta5: 179000, bloque: 89000 },
  NEGOCIACION: { hasta2: 249000, hasta5: 499000, bloque: 249000 },
  SEGUIMIENTO: { hasta2: 29000, hasta5: 59000, bloque: 29000 },
  DIAGNOSTICO_EMPRESARIAL: { hasta2: 390000, hasta5: 790000, bloque: 390000 },
  BLINDAJE_EMPRESARIAL: { hasta2: 1200000, hasta5: 2900000, bloque: 1200000 },
  REPRESENTACION_NATURAL: { fijo: 2000000 }
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

  // Formula de los F1 aprobados por Liza (COR-INS-02, H-F4-4):
  // hasta 2 acreedores = base; de 3 a 5 = segundo tramo; desde el 6.o se suma
  // un bloque por cada 2 acreedores adicionales, redondeando hacia arriba, SIN tope.
  function escalonado(base2, base5, bloque) {
    if (n <= 2) return base2;
    if (n <= 5) return base5;
    return base5 + Math.ceil((n - 5) / 2) * bloque;
  }

  switch (caseType) {
    case 'INSOLV_DIAG_NAT':
    case 'INSOLV_MOD_NAT':
      return escalonado(89000, 179000, 89000);

    case 'INSOLV_NEG_NAT':
      return escalonado(249000, 499000, 249000);

    case 'INSOLV_SEG_NAT':
      // F1: 29.000 / 59.000 y bloques desde el 6.o; valor del bloque (29.000) por confirmar con Liza.
      return escalonado(29000, 59000, 29000);

    case 'INSOLV_REP_NAT':
      // Decision de Liza (12 oct 2026): se mantiene en 2.000.000 (hasta 2 acreedores);
      // con mas de 2 acreedores el caso entra como lead (D-REP-1).
      return 2000000;

    case 'INSOLV_DIAG_EMP':
      return escalonado(390000, 790000, 390000);

    case 'INSOLV_EXP_EMP':
      return escalonado(1200000, 2900000, 1200000);

    case 'INSOLV_REORG_EMP':
      return 15000000; // "desde": cotizacion por complejidad (F1)

    case 'INSOLV_SEG_EMP':
      return 149000; // "desde": 149.000 a 630.000 al mes (F1)

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

// Motor de evaluacion de embudo determinista (3 preguntas de calificacion)
function evaluarEmbudoInsolvencia(respuestas) {
  if (!respuestas || typeof respuestas !== 'object') {
    return { ok: false, error: 'MANUAL_REVIEW', route: 'MANUAL_REVIEW', sku: null, case_type: null, regimen: null, fallocerrado: true };
  }

  const perfil = respuestas.p1_perfil;
  const situacion = respuestas.p2_situacion;
  const objetivo = respuestas.p3_objetivo;

  // 1. Persona jurídica -> Tarjeta G empresarial
  if (perfil === 'PERSONA_JURIDICA' || perfil === 'juridica' || perfil === 'empresa') {
    return {
      ok: true,
      route: 'TARJETA_G_EMPRESARIAL',
      sku: 'TARJETA_G',
      case_type: 'EMPRESARIAL_TARJETA_G',
      regimen: 'PJ_EMP',
      esEmpresarial: true
    };
  }

  // 2. Caso existente en trámite -> SEGUIMIENTO
  if (situacion === 'CASO_EXISTENTE' || situacion === 'caso_existente' || situacion === 'etapa_negociacion') {
    return {
      ok: true,
      route: 'DEUDAS_INSOLV_SEG_NAT',
      sku: 'SEGUIMIENTO',
      case_type: 'INSOLV_SEG_NAT',
      regimen: 'SEGUIMIENTO'
    };
  }

  // 3. Comerciante persona natural -> DIAG_NATURAL primero
  if (perfil === 'PN_COMERCIANTE' || perfil === 'comercio' || perfil === 'comerciante_pequeno') {
    return {
      ok: true,
      route: 'DEUDAS_INSOLV_DIAG_NAT',
      sku: 'DIAG_NATURAL',
      case_type: 'INSOLV_DIAG_NAT',
      regimen: 'PN_PC_CGP'
    };
  }

  // 4. No comerciante + mora declarada + propuesta de pago -> EXP_NEG_NATURAL
  if ((perfil === 'PN_NO_COMERCIANTE' || perfil === 'no_comercio' || perfil === 'empleado_pensionado') &&
      (situacion === 'MORA_DECLARADA' || situacion === 'mora_cobros') &&
      (objetivo === 'propuesta_pago' || objetivo === 'PROPUESTA_PAGO')) {
    return {
      ok: true,
      route: 'DEUDAS_INSOLV_NEG_NAT',
      sku: 'EXP_NEG_NATURAL',
      case_type: 'INSOLV_NEG_NAT',
      regimen: 'PN_NC_CGP'
    };
  }

  // 5. Mora declarada + liquidacion o acuerdo privado -> DIAG_MODALIDAD_NATURAL
  if ((situacion === 'MORA_DECLARADA' || situacion === 'mora_cobros') &&
      (objetivo === 'liquidacion' || objetivo === 'revisar_acuerdo' || objetivo === 'LIQUIDACION')) {
    return {
      ok: true,
      route: 'DEUDAS_INSOLV_MOD_NAT',
      sku: 'DIAG_MODALIDAD_NATURAL',
      case_type: 'INSOLV_MOD_NAT',
      regimen: 'PN_NC_CGP'
    };
  }

  // 6. Dificultad futura, frenar embargos o perfil general no comerciante -> DIAG_NATURAL
  if (perfil === 'PN_NO_COMERCIANTE' || perfil === 'no_comercio' || perfil === 'empleado_pensionado' ||
      situacion === 'DIFICULTAD_FUTURA' || situacion === 'dificultad_futura' ||
      objetivo === 'frenar_embargos') {
    return {
      ok: true,
      route: 'DEUDAS_INSOLV_DIAG_NAT',
      sku: 'DIAG_NATURAL',
      case_type: 'INSOLV_DIAG_NAT',
      regimen: 'PN_NC_CGP'
    };
  }

  // 7. Si no se puede reconocer el regimen -> MANUAL_REVIEW (falla cerrada)
  return {
    ok: false,
    error: 'MANUAL_REVIEW',
    route: 'MANUAL_REVIEW',
    sku: null,
    case_type: null,
    regimen: null,
    fallocerrado: true
  };
}

// Embudo empresarial (preguntas complementarias)
function evaluarEmbudoEmpresarial(respuestas) {
  if (!respuestas || typeof respuestas !== 'object') {
    return { ok: false, error: 'MANUAL_REVIEW', route: 'MANUAL_REVIEW', sku: null, case_type: null, fallocerrado: true };
  }

  const crisis = respuestas.emp_crisis;
  const activos = respuestas.emp_activos;
  const operacion = respuestas.emp_operacion;
  const objetivo = respuestas.emp_objetivo;

  if (objetivo === 'proceso_supersociedades') {
    return { ok: true, route: 'DEUDAS_INSOLV_REORG_EMP', sku: 'REORG_EMP', case_type: 'INSOLV_REORG_EMP', regimen: 'PJ_EMP' };
  }

  if (crisis === 'mora_90_ejecutivos' && operacion === 'opera_con_ingresos') {
    return { ok: true, route: 'DEUDAS_INSOLV_EXP_EMP', sku: 'EXP_EMPRESARIAL', case_type: 'INSOLV_EXP_EMP', regimen: 'PJ_EMP' };
  }

  if (crisis === 'dificultad_futura' || operacion === 'sin_operacion' || !crisis) {
    return { ok: true, route: 'DEUDAS_INSOLV_DIAG_EMP', sku: 'DIAG_EMPRESARIAL', case_type: 'INSOLV_DIAG_EMP', regimen: 'PJ_EMP' };
  }

  return { ok: true, route: 'DEUDAS_INSOLV_DIAG_EMP', sku: 'DIAG_EMPRESARIAL', case_type: 'INSOLV_DIAG_EMP', regimen: 'PJ_EMP' };
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
