// =============================================================================
// LYZBRI - Modulo de Arquitectura e Inteligencia de Negocio: Linea de Insolvencia
// Normalizacion segun F1 #1 a #9, Decisiones D1 a D12 y Matriz Juridica (Ley 2445/2025 y Ley 1116)
// =============================================================================

const TIEMPOS_ENTREGA = {
  INSOLV_DIAG_NAT: '2 días hábiles',
  INSOLV_MOD_NAT: '3 días hábiles',
  INSOLV_NEG_NAT: '3 días hábiles',
  INSOLV_SEG_NAT: 'Suscripción mensual / seguimiento activo',
  INSOLV_REP_NAT: 'Plazo del encargo según representación',
  INSOLV_DIAG_EMP: '5 días hábiles',
  INSOLV_EXP_EMP: '15 días hábiles',
  INSOLV_REORG_EMP: 'Según propuesta y etapa de reorganización',
  INSOLV_SEG_EMP: 'Suscripción mensual / seguimiento activo'
};

// Listado de documentos por tipo de persona y regimen (fuente: listado de documentos.txt)
const LISTADOS_DOCUMENTOS = {
  PN_NC_CGP: {
    nombreRegimen: 'Persona natural no comerciante (CGP / Ley 2445 de 2025)',
    obligatorios: [
      'Documento de identidad (cedula de ciudadania o extranjeria) y datos completos de notificacion.',
      'Informe detallado de las causas que originaron la situacion de cesacion de pagos o crisis.',
      'Propuesta clara, expresa y objetiva de negociacion de deudas o plan de pagos.',
      'Relacion completa y detallada de acreedores (capital, intereses, mora y garantias).',
      'Inventario completo de bienes muebles e inmuebles (con corte al ultimo dia del mes anterior).',
      'Relacion de procesos judiciales, ejecutivos, de cobro coactivo o cobros privados en curso.',
      'Certificacion o declaracion jurada de ingresos mensuales y fuentes de recursos.',
      'Discriminacion de gastos necesarios de subsistencia y conservacion de bienes.',
      'Informacion conyugal o de sociedad patrimonial (vigente o liquidada en los ultimos 2 anos).',
      'Discriminacion de obligaciones alimentarias a cargo y certificado de no reporte en REDAM.',
      'Manifestacion expresa bajo la gravedad de juramento de no haber transferido bienes de manera fraudulenta.'
    ],
    requeridosAnalisis: [
      'Extractos bancarios o certificaciones de saldo actualizadas de cada obligacion.',
      'Soportes idoneos de propiedad de los bienes relacionados (certificados de tradicion, tarjetas de propiedad).',
      'Soportes o comprobantes de los ingresos mensuales declarados y gastos fijos de subsistencia.'
    ],
    condicionales: [
      'Escritura publica o sentencia de separacion de bienes o disolucion conyugal (si ocurrio en los ultimos 2 anos).',
      'Soporte de autorizaciones de libranzas o descuentos de nomina y abonos efectivamente aplicados.'
    ]
  },
  PN_PC_CGP: {
    nombreRegimen: 'Persona natural pequena comerciante (CGP / Activos < 1.000 SMMLV)',
    obligatorios: [
      'Documento de identidad del titular y datos de contacto y notificacion.',
      'Certificado de matricula mercantil vigente expedido por la Camara de Comercio.',
      'Balance o inventario que acredite que los activos computables son inferiores a 1.000 SMMLV (excluyendo vivienda familiar y vehiculo de trabajo).',
      'Informe explicativo de causas de cesacion de pagos.',
      'Propuesta clara de pago a los acreedores vinculados a la actividad y personales.',
      'Relacion completa de acreedores comerciales y personales.',
      'Inventario de bienes afectos y no afectos al giro comercial.',
      'Relacion de procesos ejecutivos y cobros coactivos.',
      'Certificacion de ingresos personales y del negocio.',
      'Declaracion de alimentos a cargo y certificado REDAM.',
      'Manifestacion juramentada de exactitud y veracidad de la informacion.'
    ],
    requeridosAnalisis: [
      'Copia del RUT con actividad comercial actualizada.',
      'Extractos y comprobantes de obligaciones comerciales y personales.',
      'Estados financieros basicos o balance de prueba de la actividad mercantil.'
    ],
    condicionales: [
      'Soporte de exclusion de vivienda familiar (afectacion a vivienda familiar o patrimonio de familia inembargable).',
      'Soporte de vehiculo utilizado como instrumento de trabajo exclusivo.'
    ]
  },
  PN_C_EMP: {
    nombreRegimen: 'Persona natural comerciante (Regimen Empresarial - Ley 1116)',
    obligatorios: [
      'Cedula del comerciante y certificado de matricula mercantil vigente.',
      'Estados financieros de los tres (3) ultimos ejercicios con sus notas (si esta obligado a llevar contabilidad).',
      'Estados financieros recientes con corte al ultimo dia del mes anterior a la solicitud.',
      'Inventario valorado de activos y pasivos debidamente certificado.',
      'Memoria explicativa de las causas de la crisis economica y cesacion de pagos.',
      'Flujo de caja proyectado para el termino del acuerdo propuesto.',
      'Plan de negocios y de reestructuracion operativa y financiera.',
      'Proyecto de graduacion y calificacion de creditos y derechos de voto.',
      'Soportes de causal de cesacion de pagos (art. 9 Ley 1116).'
    ],
    requeridosAnalisis: [
      'Relacion detallada de acreencias comerciales, financieras, laborales y fiscales.',
      'Copia del RUT y ultimas declaraciones de renta presentadas.',
      'Certificado sobre pasivos pensionales o de seguridad social.'
    ],
    condicionales: [
      'Poder debidamente otorgado a abogado en caso de representacion judicial.'
    ]
  },
  PJ_EMP: {
    nombreRegimen: 'Persona juridica (Regimen Empresarial - Ley 1116)',
    obligatorios: [
      'Certificado de existencia y representacion legal con vigencia no superior a 30 dias.',
      'Documento de identidad del Representante Legal.',
      'Estatutos sociales y acta de autorizacion del maximo organo social para acudir al tramite.',
      'Estados financieros basicos de los tres (3) ultimos ejercicios comerciales dictaminados y con notas.',
      'Estados financieros intermedios al ultimo dia del mes anterior a la radicacion.',
      'Inventario detallado de activos y pasivos certificado por representante legal y contador/revisor fiscal.',
      'Memoria explicativa de las causas de cesacion de pagos o de la incapacidad de pago inminente.',
      'Flujo de caja proyectado durante el periodo de amortizacion de la deuda.',
      'Plan de negocios y viabilidad economica de la empresa.',
      'Proyecto de graduacion de creditos y derechos de voto de los acreedores.',
      'Certificacion sobre el estado de pago de aportes a seguridad social y retenciones fiscales.'
    ],
    requeridosAnalisis: [
      'Estructura de control societario, matriz, subordinadas o partes vinculadas.',
      'Informe sobre litigios, procesos ejecutivos, embargos y medidas cautelares en curso.',
      'Detalle del pasivo laboral, fiscal y con entidades financieras.'
    ],
    condicionales: [
      'Poder otorgado a abogado para la radicacion y actuacion ante Supersociedades o Juez Civil del Circuito.'
    ]
  },
  SEGUIMIENTO: {
    nombreRegimen: 'Control y seguimiento de tramite de insolvencia en curso',
    obligatorios: [
      'Copia completa de la solicitud de insolvencia presentada con su fecha de radicacion y radicado oficial.',
      'Auto o providencia de admision, aceptacion o apertura del tramite.',
      'Actas de audiencias celebradas o requerimientos expedidos por el conciliador o juez.',
      'Acuerdo de pago aprobado (si ya fue celebrado) con su tabla de amortizacion o calendario.',
      'Comprobantes de pagos y abonos realizados a los acreedores en cumplimiento del acuerdo.'
    ],
    requeridosAnalisis: [
      'Estado actual de los procesos ejecutivos o cobros que debieron ser suspendidos.',
      'Canales de notificacion y comunicaciones recibidas de los acreedores.'
    ],
    condicionales: [
      'Escritos de objeciones a creditos o inventarios presentados en el tramite.'
    ]
  }
};

// Calculo server-side de precio escalonado anti-manipulacion (Regla 3-A / D9)
function calcularPrecioInsolvencia(caseType, cantAcreedores) {
  var n = parseInt(cantAcreedores, 10);
  if (isNaN(n) || n < 1) n = 1;

  switch (caseType) {
    case 'INSOLV_DIAG_NAT':
    case 'INSOLV_MOD_NAT':
      if (n <= 2) return 89000;
      if (n <= 5) return 179000;
      var bloquesNat = Math.ceil((n - 5) / 2);
      return 179000 + (bloquesNat * 89000);

    case 'INSOLV_NEG_NAT':
      if (n <= 2) return 249000;
      if (n <= 5) return 499000;
      var bloquesExp = Math.ceil((n - 5) / 2);
      return 499000 + (bloquesExp * 249000);

    case 'INSOLV_SEG_NAT':
      if (n <= 2) return 29000;
      if (n <= 5) return 59000;
      var bloquesSeg = Math.ceil((n - 5) / 2);
      return 59000 + (bloquesSeg * 29000);

    case 'INSOLV_REP_NAT':
      if (n <= 2) return 2000000;
      var bloquesRep = Math.ceil((n - 2) / 2);
      return 2000000 + (bloquesRep * 2000000);

    case 'INSOLV_DIAG_EMP':
      if (n <= 2) return 390000;
      if (n <= 5) return 790000;
      var bloquesDiagEmp = Math.ceil((n - 5) / 2);
      return 790000 + (bloquesDiagEmp * 390000);

    case 'INSOLV_EXP_EMP':
      if (n <= 2) return 1200000;
      if (n <= 5) return 2900000;
      var bloquesExpEmp = Math.ceil((n - 5) / 2);
      return 2900000 + (bloquesExpEmp * 1200000);

    case 'INSOLV_REORG_EMP':
      return 15000000; // Tarifa base referencial / cotizacion asistida

    case 'INSOLV_SEG_EMP':
      if (n <= 2) return 149000;
      var bloquesSegEmp = Math.ceil((n - 2) / 2);
      return 149000 + (bloquesSegEmp * 149000);

    default:
      return null;
  }
}

// Motor de reglas determinista para evaluacion inicial (3 preguntas)
function evaluarEmbudoInsolvencia(respuestas) {
  if (!respuestas || typeof respuestas !== 'object') {
    return { route: 'MANUAL_REVIEW', sku: null, case_type: null, regimen: null, fallocerrado: true };
  }

  var perfil = respuestas.p1_perfil;
  var situacion = respuestas.p2_situacion;
  var objetivo = respuestas.p3_objetivo;

  // 1. Persona juridica o regimen especial -> Tarjeta G / 2º embudo
  if (perfil === 'PERSONA_JURIDICA' || perfil === 'juridica') {
    return {
      route: 'TARJETA_G_EMPRESARIAL',
      sku: 'TARJETA_G',
      case_type: 'EMPRESARIAL_TARJETA_G',
      regimen: 'PJ_EMP',
      esEmpresarial: true
    };
  }

  // 2. Caso existente en tramite -> SEGUIMIENTO
  if (situacion === 'CASO_EXISTENTE' || situacion === 'caso_existente') {
    return {
      route: 'DEUDAS_INSOLV_SEG_NAT',
      sku: 'SEGUIMIENTO',
      case_type: 'INSOLV_SEG_NAT',
      regimen: 'SEGUIMIENTO'
    };
  }

    // Comerciante persona natural que busca representacion directa
  if ((perfil === 'PN_COMERCIANTE' || perfil === 'comercio') &&
      (objetivo === 'representacion' || objetivo === 'abogado' || objetivo === 'REPRESENTACION')) {
    return {
      route: 'DEUDAS_INSOLV_REP_NAT',
      sku: 'REP_NAT',
      case_type: 'INSOLV_REP_NAT',
      regimen: 'PN_PC_CGP'
    };
  }

  // 3. Comerciante persona natural -> DIAG_NATURAL primero (clasificacion)
  if (perfil === 'PN_COMERCIANTE' || perfil === 'comercio') {
    return {
      route: 'DEUDAS_INSOLV_DIAG_NAT',
      sku: 'DIAG_NATURAL',
      case_type: 'INSOLV_DIAG_NAT',
      regimen: 'PN_PC_CGP'
    };
  }

  // 4. No comerciante + mora declarada + propuesta de pago -> EXP_NEG_NATURAL
  if ((perfil === 'PN_NO_COMERCIANTE' || perfil === 'no_comercio') &&
      (situacion === 'MORA_DECLARADA' || situacion === 'mora_cobros') &&
      (objetivo === 'propuesta_pago' || objetivo === 'PROPUESTA_PAGO')) {
    return {
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
      route: 'DEUDAS_INSOLV_MOD_NAT',
      sku: 'DIAG_MODALIDAD_NATURAL',
      case_type: 'INSOLV_MOD_NAT',
      regimen: 'PN_NC_CGP'
    };
  }

  // 6. Dificultad futura o perfil general no comerciante -> DIAG_NATURAL
  if (perfil === 'PN_NO_COMERCIANTE' || perfil === 'no_comercio' ||
      situacion === 'DIFICULTAD_FUTURA' || situacion === 'dificultad_futura') {
    return {
      route: 'DEUDAS_INSOLV_DIAG_NAT',
      sku: 'DIAG_NATURAL',
      case_type: 'INSOLV_DIAG_NAT',
      regimen: 'PN_NC_CGP'
    };
  }

  // 7. Si no se puede reconocer el regimen o situacion -> MANUAL_REVIEW (Regla de Falla Cerrada RC9)
  return {
    route: 'MANUAL_REVIEW',
    sku: null,
    case_type: null,
    regimen: null,
    fallocerrado: true
  };
}

// 2º embudo empresarial (6 preguntas)
function evaluarEmbudoEmpresarial(respuestas) {
  if (!respuestas || typeof respuestas !== 'object') {
    return { route: 'MANUAL_REVIEW', sku: null, case_type: null, fallocerrado: true };
  }

  var crisis = respuestas.emp_crisis;
  var activos = respuestas.emp_activos;
  var operacion = respuestas.emp_operacion;
  var objetivo = respuestas.emp_objetivo;

  if (crisis === 'tramite_en_curso' || objetivo === 'seguimiento' || objetivo === 'seguimiento_control') {
    return { route: 'DEUDAS_INSOLV_SEG_EMP', sku: 'SEG_EMP', case_type: 'INSOLV_SEG_EMP', regimen: 'PJ_EMP' };
  }

  if (objetivo === 'proceso_supersociedades') {
    return { route: 'DEUDAS_INSOLV_REORG_EMP', sku: 'REORG_EMP', case_type: 'INSOLV_REORG_EMP', regimen: 'PJ_EMP' };
  }

  if (crisis === 'mora_90_ejecutivos' && operacion === 'opera_con_ingresos') {
    return { route: 'DEUDAS_INSOLV_EXP_EMP', sku: 'EXP_EMPRESARIAL', case_type: 'INSOLV_EXP_EMP', regimen: 'PJ_EMP' };
  }

  if (crisis === 'dificultad_futura' || operacion === 'sin_operacion' || !crisis) {
    return { route: 'DEUDAS_INSOLV_DIAG_EMP', sku: 'DIAG_EMPRESARIAL', case_type: 'INSOLV_DIAG_EMP', regimen: 'PJ_EMP' };
  }

  return { route: 'DEUDAS_INSOLV_DIAG_EMP', sku: 'DIAG_EMPRESARIAL', case_type: 'INSOLV_DIAG_EMP', regimen: 'PJ_EMP' };
}

// Generador del paquete de documentos y aviso de entrega post-pago (D10 / D11)
function generarNotificacionPostPago(caseTypeOrOpts, regimenClave, nombreCliente) {
  var caseType = (typeof caseTypeOrOpts === 'object' && caseTypeOrOpts !== null) ? caseTypeOrOpts.case_type : caseTypeOrOpts;
  var rKey = (typeof caseTypeOrOpts === 'object' && caseTypeOrOpts !== null) ? (caseTypeOrOpts.regimen || caseTypeOrOpts.regimenClave) : regimenClave;
  var nombre = ((typeof caseTypeOrOpts === 'object' && caseTypeOrOpts !== null) ? (caseTypeOrOpts.nombre || caseTypeOrOpts.nombreCliente) : nombreCliente) || 'Cliente';
  var reg = (rKey && LISTADOS_DOCUMENTOS[rKey]) ? LISTADOS_DOCUMENTOS[rKey] : LISTADOS_DOCUMENTOS.PN_NC_CGP;
  var tiempo = (caseType && TIEMPOS_ENTREGA[caseType]) ? TIEMPOS_ENTREGA[caseType] : '2 a 3 dias habiles';

  var avisoEntrega = 'Al recibir tu documentación completa, entregamos en ' + tiempo + '. El reloj del tiempo de entrega inicia a partir del momento en que recibimos todos tus documentos y soportes completos.';

  var subject = 'Listado de documentos para tu tramite de insolvencia - Lyzbri';

  var bodyHtml = '<p>Hola, <b>' + nombre + '</b>:</p>' +
    '<p>Hemos recibido tu pago y tus datos iniciales. Para avanzar con el estudio y estructuracion de tu caso bajo el regimen <b>' + reg.nombreRegimen + '</b>, requerimos los siguientes documentos:</p>' +
    '<h4>1. Documentos obligatorios:</h4><ul>' +
    reg.obligatorios.map(function(d) { return '<li>' + d + '</li>'; }).join('') +
    '</ul>' +
    '<h4>2. Requeridos para analisis:</h4><ul>' +
    reg.requeridosAnalisis.map(function(d) { return '<li>' + d + '</li>'; }).join('') +
    '</ul>' +
    (reg.condicionales && reg.condicionales.length ? '<h4>3. Documentos condicionales (si aplican a tu caso):</h4><ul>' +
    reg.condicionales.map(function(d) { return '<li>' + d + '</li>'; }).join('') + '</ul>' : '') +
    '<p style="background:#f8f9fa;padding:12px;border-left:4px solid #1a365d;font-weight:bold;">' + avisoEntrega + '</p>' +
    '<p>Puedes remitir tus documentos escaneados o en PDF a este correo electronico o a traves de nuestra linea de atencion.</p>' +
    '<p>Atentamente,<br><b>Equipo Lyzbri Legal</b></p>';

  return {
    asunto: subject,
    bodyHtml: bodyHtml,
    avisoEntrega: avisoEntrega,
    tiempoEntrega: tiempo,
    regimen: reg.nombreRegimen,
    documentos: reg
  };
}

module.exports = {
  TIEMPOS_ENTREGA: TIEMPOS_ENTREGA,
  LISTADOS_DOCUMENTOS: LISTADOS_DOCUMENTOS,
  calcularPrecioInsolvencia: calcularPrecioInsolvencia,
  evaluarEmbudoInsolvencia: evaluarEmbudoInsolvencia,
  evaluarEmbudoEmpresarial: evaluarEmbudoEmpresarial,
  generarNotificacionPostPago: generarNotificacionPostPago
};
