// Documentos Zero Touch que se generan DIRECTO en Make (sin pasar los hechos por
// HubSpot), igual que Alimentos:
//   HABEAS_DATA / SUPLANTACION, DATOS_INCORRECTOS, OBLIGACION_NO_RECONOCIDA, CASO_INCIERTO
//   TEA / DENUNCIA_DEPORTIVA
//
// Reglas (Corrección crítica de arquitectura, 27-sep-2026):
//  - El caso se identifica por service_code + case_type (nunca por textos visibles).
//  - El case_type que manda el formulario debe coincidir con el que quedó en
//    HubSpot al crear el caso (lo que la página ofreció y el cliente pagó).
//  - Si algo no cuadra NO se genera ningún documento: el caso se envía a Make por
//    la ruta MANUAL_REVIEW (alerta a Liza) y queda marcado en HubSpot.
//  - Nunca se usa una ruta "parecida" como sustituto.
//
// Variables de entorno (Netlify): HUBSPOT_PRIVATE_APP_TOKEN,
// MAKE_DOCUMENTOS_WEBHOOK_URL (o, en su defecto, MAKE_ALIMENTOS_WEBHOOK_URL) y
// LYZBRI_NOTIFY_EMAIL. Ninguna va en el código.

// -----------------------------------------------------------------------------
// Catálogo del servidor (debe coincidir con CATALOGO de la landing; la prueba
// automática test-catalogo.js compara ambos y falla si difieren).
// -----------------------------------------------------------------------------
const CATALOGO_DOCUMENTOS = {
  'HABEAS_DATA|SUPLANTACION': {
    make_route: 'DOC_HD_SUPLANTACION', form_key: 'hd-suplantacion', price: 229000,
    titulo: 'Reclamo por suplantación de identidad', con_anexo: false
  },
  'HABEAS_DATA|DATOS_INCORRECTOS': {
    make_route: 'DOC_HD_DATOS_INCORRECTOS', form_key: 'hd-datos-incorrectos', price: 229000,
    titulo: 'Reclamo por datos, fechas o saldos incorrectos', con_anexo: true
  },
  'HABEAS_DATA|OBLIGACION_NO_RECONOCIDA': {
    make_route: 'DOC_HD_OBLIGACION_NO_RECONOCIDA', form_key: 'hd-no-reconocida', price: 229000,
    titulo: 'Reclamo por obligación no reconocida', con_anexo: true
  },
  'HABEAS_DATA|CASO_INCIERTO': {
    make_route: 'DOC_HD_CASO_INCIERTO', form_key: 'hd-caso-incierto', price: 229000,
    titulo: 'Solicitud de verificación de obligación', con_anexo: true
  },
  'TEA|DENUNCIA_DEPORTIVA': {
    make_route: 'DOC_TEA_DENUNCIA_DEPORTIVA', form_key: 'tea-denuncia-deportiva', price: 229000,
    titulo: 'Escrito de denuncia por discriminación, burlas o exclusión en espacio deportivo', con_anexo: true
  }
};

const TIPO_DOC = {
  cc: 'cédula de ciudadanía', ce: 'cédula de extranjería', pasaporte: 'pasaporte',
  ppt: 'Permiso por Protección Temporal (PPT)', pep: 'Permiso Especial de Permanencia (PEP)',
  ti: 'tarjeta de identidad', rc: 'registro civil de nacimiento'
};
const TIPO_DOC_CORTO = { cc: 'C.C.', ce: 'C.E.', pasaporte: 'Pasaporte', ppt: 'PPT', pep: 'PEP', ti: 'T.I.', rc: 'R.C.' };

const OPERADOR = {
  datacredito: 'Experian Colombia S.A. (Datacrédito)',
  transunion: 'TransUnion Colombia (CIFIN S.A.S.)',
  ambos: 'Experian Colombia S.A. (Datacrédito) y TransUnion Colombia (CIFIN S.A.S.)'
};
const PRODUCTO = {
  credito_consumo: 'un crédito de consumo', tarjeta_credito: 'una tarjeta de crédito',
  libre_inversion: 'un crédito de libre inversión', telefonia: 'un servicio de telefonía o internet',
  otro: null
};
const CAUSA_NO_RECONOCIDA = {
  error_administrativo: 'ERROR ADMINISTRATIVO DE LA ENTIDAD: la entidad reportó la obligación a mi nombre por confusión de documentos, número de identificación similar o error en el ingreso de datos.',
  tercero_nombre_similar: 'OBLIGACIÓN DE UN TERCERO CON NOMBRE SIMILAR: la obligación pertenece a otra persona con nombre o número de documento similar al mío.',
  codeudoria: 'CODEUDORÍA NO INFORMADA: aparezco como codeudor o tercero obligado en una obligación que no contraté directamente, sin que hubiera sido notificado de esta responsabilidad.',
  cancelada_prescrita: 'OBLIGACIÓN YA CANCELADA O PRESCRITA: la obligación fue pagada, cancelada o prescrita, pero continúa reportada como vigente.',
  fraude_sin_suplantacion: 'FRAUDE DE TERCERO SIN SUPLANTACIÓN DOCUMENTAL: un tercero adquirió la obligación usando información mía de forma engañosa, pero sin falsificar documentos de identidad.',
  otra: null
};
const CALIDAD_DENUNCIANTE = {
  madre: 'en calidad de madre', padre: 'en calidad de padre',
  representante: 'en calidad de representante legal', acudiente: 'en calidad de acudiente o persona a cargo',
  familiar: 'en calidad de familiar', otro: 'en calidad de persona que acompaña el caso'
};
const CONDICION = {
  tea: 'persona con trastorno del espectro autista (TEA)',
  neuro: 'persona con un trastorno del neurodesarrollo',
  intelectual: 'persona con discapacidad intelectual',
  fisica: 'persona con discapacidad física',
  visual: 'persona con discapacidad visual',
  sordera: 'persona sorda o con sordoceguera',
  mudez: 'persona con discapacidad',
  no_visible: 'persona con discapacidad',
  no_informa: 'persona con discapacidad'
};
const TIPO_CONDUCTA = {
  burlas: 'burlas', exclusion: 'exclusión', discriminacion: 'discriminación',
  impedimento: 'impedimento de participación'
};
const PARTICIPACION = {
  deportista: 'deportista inscrito(a)', entrenamiento: 'participante en entrenamientos',
  competencia: 'participante en competencia', aspirante: 'aspirante a participar', otro: 'participante'
};
const ANEXOS_DENUNCIA = {
  mensajes: 'Mensajes', correos: 'Correos electrónicos', fotografias: 'Fotografías', videos: 'Videos',
  audios: 'Audios', reglamentos: 'Reglamentos', convocatorias: 'Convocatorias',
  certificados: 'Certificados o conceptos relevantes', testigos: 'Datos de testigos'
};

// Errores que se pueden señalar en "Datos, fechas o saldos incorrectos":
// cada uno exige su par (dato reportado / dato real).
const ERRORES_HD = {
  saldo: { etiqueta: 'SALDO INCORRECTO', rep: 'saldo_reportado', real: 'saldo_real', dinero: true,
           frase: (r, v) => `El saldo reportado es de ${r}, pero el saldo real es de ${v}.` },
  fecha_mora: { etiqueta: 'FECHA DE MORA INCORRECTA', rep: 'fecha_mora_reportada', real: 'fecha_mora_real',
           frase: (r, v) => `La fecha de inicio de mora reportada es ${r}, pero la fecha correcta es ${v}.` },
  fecha_pago: { etiqueta: 'FECHA DE PAGO INCORRECTA', rep: 'fecha_pago_reportada', real: 'fecha_pago_real',
           frase: (r, v) => `La fecha de pago reportada es ${r}, pero la fecha correcta es ${v}.` },
  estado: { etiqueta: 'ESTADO DE LA OBLIGACIÓN INCORRECTO', rep: 'estado_reportado', real: 'estado_real',
           frase: (r, v) => `El estado reportado es ${r}, pero el estado correcto es ${v}.` },
  numero: { etiqueta: 'NÚMERO DE CUENTA O CONTRATO INCORRECTO', rep: 'numero_reportado', real: 'numero_real',
           frase: (r, v) => `El número reportado es ${r}, pero el número correcto es ${v}.` },
  otro: { etiqueta: 'OTRO ERROR', rep: 'otro_error', real: null, frase: (r) => r }
};

function txt(v) { return v === undefined || v === null ? '' : String(v).trim(); }
function porCompletar(desc) { return `[Por completar: ${desc}]`; }
function cop(v) {
  const n = Number(String(v).replace(/[^\d]/g, ''));
  return isFinite(n) && n > 0 ? '$' + n.toLocaleString('es-CO') : txt(v);
}
function fecha(v) {
  const s = txt(v);
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : s;
}
function hoy() {
  const d = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}
function lista(v) { return txt(v).split(';').map((x) => x.trim()).filter(Boolean); }
function enumerar(items) {
  if (items.length <= 1) return items.join('');
  return items.slice(0, -1).join(', ') + ' y ' + items[items.length - 1];
}

// -----------------------------------------------------------------------------
// Campos obligatorios por case_type (el formulario pide solo los que faltan).
// -----------------------------------------------------------------------------
const COMUNES = ['address', 'city', 'state'];
const HD_BASE = ['nombre_titular', 'numero_documento', 'ciudad_expedicion', 'correo_titular', 'celular_titular',
  'fuente_nombre', 'producto_obligacion', 'numero_obligacion'].concat(COMUNES);
const REQUERIDOS = {
  SUPLANTACION: HD_BASE,
  DATOS_INCORRECTOS: HD_BASE.concat(['tipo_documento', 'operador_nombre', 'errores', 'soportes']),
  OBLIGACION_NO_RECONOCIDA: HD_BASE.concat(['tipo_documento', 'operador_nombre', 'causa_no_reconocimiento']),
  CASO_INCIERTO: HD_BASE.concat(['tipo_documento', 'operador_nombre']),
  DENUNCIA_DEPORTIVA: ['nombre_persona_afectada', 'nombre_denunciante', 'institucion_deportiva', 'relacion_hechos',
    'fecha_evento', 'correo_notificaciones', 'celular_denunciante'].concat(COMUNES)
};

function faltantes(caseType, c) {
  const req = REQUERIDOS[caseType];
  if (!req) return ['case_type'];
  const falta = req.filter((k) => !txt(c[k]));
  if (c.producto_obligacion === 'otro' && !txt(c.producto_otro)) falta.push('producto_otro');
  if (caseType === 'DATOS_INCORRECTOS') {
    lista(c.errores).forEach((e) => {
      const def = ERRORES_HD[e];
      if (!def) { falta.push('errores'); return; }
      if (!txt(c[def.rep])) falta.push(def.rep);
      if (def.real && !txt(c[def.real])) falta.push(def.real);
    });
  }
  if (caseType === 'OBLIGACION_NO_RECONOCIDA' && c.causa_no_reconocimiento === 'otra' && !txt(c.causa_otra)) {
    falta.push('causa_otra');
  }
  return Array.from(new Set(falta));
}

// -----------------------------------------------------------------------------
// Construcción de las variables {{...}} de cada plantilla maestro.
// No se inventan hechos: lo que el usuario no dio queda "[Por completar: ...]"
// (el anexo de instrucciones le pide completarlo antes de firmar).
// -----------------------------------------------------------------------------
function construirHD(caseType, c) {
  const producto = c.producto_obligacion === 'otro' ? txt(c.producto_otro) : (PRODUCTO[c.producto_obligacion] || txt(c.producto_obligacion));
  const doc = {
    ciudad: txt(c.city),
    fecha_envio: hoy(),
    fuente_nombre: txt(c.fuente_nombre),
    operador_nombre: OPERADOR[c.operador_nombre] || txt(c.operador_nombre),
    nombre_titular: txt(c.nombre_titular),
    tipo_documento: TIPO_DOC[c.tipo_documento] || 'cédula de ciudadanía',
    cedula_titular: txt(c.numero_documento),
    ciudad_expedicion: txt(c.ciudad_expedicion),
    direccion_titular: txt(c.address),
    departamento: txt(c.state),
    correo_titular: txt(c.correo_titular),
    celular_titular: txt(c.celular_titular),
    producto_obligacion: producto,
    numero_obligacion: txt(c.numero_obligacion),
    hechos_adicionales: txt(c.hechos_adicionales)
  };
  const soportes = txt(c.soportes);
  if (caseType === 'SUPLANTACION') {
    if (!doc.hechos_adicionales) doc.hechos_adicionales = 'El titular no reporta hechos adicionales.';
    doc.prueba_documental_adicional = soportes || 'El titular no relaciona soportes adicionales.';
  }
  if (caseType === 'DATOS_INCORRECTOS') {
    doc.detalle_errores = lista(c.errores).map((e) => {
      const d = ERRORES_HD[e];
      const rep = d.dinero ? cop(c[d.rep]) : fecha(c[d.rep]);
      const real = d.real ? (d.dinero ? cop(c[d.real]) : fecha(c[d.real])) : '';
      return `☑ ${d.etiqueta}: ${d.frase(rep, real)}`;
    }).join('\n');
    doc.anexos_lista = soportes;
  }
  if (caseType === 'OBLIGACION_NO_RECONOCIDA') {
    const causa = CAUSA_NO_RECONOCIDA[c.causa_no_reconocimiento];
    doc.causa_no_reconocimiento = causa ? '☑ ' + causa : '☑ OTRA CAUSA: ' + txt(c.causa_otra);
    doc.anexos_lista = ['• Copia de mi documento de identidad.'].concat(soportes ? ['• ' + soportes] : []).join('\n');
  }
  if (caseType === 'CASO_INCIERTO') {
    doc.anexos_lista = ['• Copia de mi documento de identidad.'].concat(soportes ? ['• ' + soportes] : []).join('\n');
  }
  return doc;
}

function construirDenuncia(c) {
  const nombreAf = txt(c.nombre_persona_afectada);
  const condicion = CONDICION[c.condicion_afectada] || 'persona con discapacidad';
  const partesAf = [nombreAf];
  if (txt(c.documento_afectado)) {
    partesAf.push(`identificado(a) con ${TIPO_DOC[c.tipo_documento_afectado] || 'documento'} No. ${txt(c.documento_afectado)}`);
  }
  if (txt(c.edad)) partesAf.push(`de ${txt(c.edad)} años de edad`);
  partesAf.push(condicion);
  const clausula = c.calidad_denunciante === 'misma_persona'
    ? `actuando en nombre propio, ${[txt(c.edad) ? `de ${txt(c.edad)} años de edad` : '', condicion].filter(Boolean).join(', ')}`
    : `actuando ${CALIDAD_DENUNCIANTE[c.calidad_denunciante] || 'en calidad de persona que acompaña el caso'} de ${partesAf.join(', ')}`;

  const actividad = [txt(c.nombre_actividad), txt(c.disciplina) ? `(disciplina: ${txt(c.disciplina)})` : ''].filter(Boolean).join(' ')
    || porCompletar('nombre del entrenamiento, competencia o evento');
  const detalle = [
    txt(c.hora_evento) ? `Hora: ${txt(c.hora_evento)}.` : '',
    PARTICIPACION[c.tipo_participacion] ? `Tipo de participación de ${nombreAf}: ${PARTICIPACION[c.tipo_participacion]}.` : ''
  ].filter(Boolean).join(' ');

  const tipos = lista(c.tipo_conducta).map((t) => TIPO_CONDUCTA[t]).filter(Boolean);
  const conducta = [
    tipos.length ? `Se denuncian conductas de ${enumerar(tipos)}.` : '',
    txt(c.conducta_denunciada),
    txt(c.expresiones_utilizadas) ? `Expresiones utilizadas: ${txt(c.expresiones_utilizadas)}` : ''
  ].filter(Boolean).join('\n') || porCompletar('describa la conducta de burlas, discriminación, exclusión o impedimento de participación');

  const personas = [
    txt(c.personas_involucradas) ? `Personas involucradas: ${txt(c.personas_involucradas)}` : '',
    txt(c.testigos) ? `Testigos: ${txt(c.testigos)}` : ''
  ].filter(Boolean).join('\n') || porCompletar('personas involucradas y testigos, si se conocen');

  const anexos = lista(c.documentos_anexos).map((a) => ANEXOS_DENUNCIA[a]).filter(Boolean);
  if (txt(c.otros_anexos)) anexos.push(txt(c.otros_anexos));

  const ajuste = txt(c.ajuste_requerido);
  return {
    ciudad: txt(c.city),
    fecha_envio: hoy(),
    institucion_deportiva: txt(c.institucion_deportiva),
    destinatario_responsable: txt(c.destinatario_responsable) ? `Atención: ${txt(c.destinatario_responsable)}` : '',
    destinatario_contacto: txt(c.destinatario_contacto),
    nombre_denunciante: txt(c.nombre_denunciante),
    tipo_documento_denunciante: TIPO_DOC_CORTO[c.tipo_documento_denunciante] || 'C.C.',
    documento_denunciante: txt(c.documento_denunciante) || porCompletar('número de documento'),
    correo_notificaciones: txt(c.correo_notificaciones),
    celular_denunciante: txt(c.celular_denunciante),
    direccion_denunciante: [txt(c.address), txt(c.city), txt(c.state)].filter(Boolean).join(', '),
    clausula_actuacion: clausula,
    nombre_persona_afectada: nombreAf,
    actividad_evento: actividad,
    lugar_evento: txt(c.lugar_evento) || porCompletar('lugar o escenario'),
    fecha_evento: txt(c.fecha_evento),
    detalle_actividad: detalle,
    relacion_hechos: txt(c.relacion_hechos),
    conducta_denunciada: conducta,
    personas_involucradas: personas,
    comunicaciones_previas: txt(c.respuesta_institucion) || porCompletar('comunicaciones o actuaciones previas y la respuesta de la institución, si las hubo'),
    consecuencias: txt(c.consecuencias) || porCompletar('consecuencias de los hechos para la persona afectada'),
    solicitud_ajustes: ajuste
      ? `Evaluar y adoptar los ajustes razonables que ${nombreAf} requiere para participar en igualdad de condiciones, en particular: ${ajuste}`
      : `Evaluar si ${nombreAf} requiere ajustes razonables para participar en igualdad de condiciones, según la barrera y su necesidad concreta.`,
    documentos_anexos: anexos.length ? anexos.map((a) => '• ' + a).join('\n') : porCompletar('relacione los documentos que anexa')
  };
}

function construirDocumento(caseType, c) {
  return caseType === 'DENUNCIA_DEPORTIVA' ? construirDenuncia(c) : construirHD(caseType, c);
}

// Textos libres que la IA de Make corrige (solo ortografía y gramática).
function textosLibres(caseType, doc) {
  const k = caseType === 'DENUNCIA_DEPORTIVA'
    ? ['relacion_hechos', 'conducta_denunciada', 'consecuencias', 'comunicaciones_previas']
    : ['hechos_adicionales'];
  const o = {};
  k.forEach((x) => { if (doc[x] && doc[x].indexOf('[Por completar') !== 0) o[x] = doc[x]; });
  return o;
}

// -----------------------------------------------------------------------------
async function marcarRevision(H, contactId, estado, error) {
  if (!contactId) return;
  try {
    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH', headers: H,
      body: JSON.stringify({ properties: { estado_revision: estado, error_ruta: String(error).slice(0, 900) } })
    });
  } catch (e) { /* el registro en Make sigue siendo la alerta principal */ }
}

// El escenario de Make "Documentos directos" es el mismo de Alimentos (el plan de
// Make permite 2 escenarios activos). Se usa MAKE_DOCUMENTOS_WEBHOOK_URL si existe.
function urlMake() { return process.env.MAKE_DOCUMENTOS_WEBHOOK_URL || process.env.MAKE_ALIMENTOS_WEBHOOK_URL; }

async function enviarAMake(body) {
  const r = await fetch(urlMake(), {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  return r.ok;
}

// La búsqueda de HubSpot es "eventualmente consistente": un contacto recién
// creado por crear-caso.js puede tardar varios segundos en aparecer en /search
// (hallazgo de la prueba E2E del 28-sep-2026). Se reintenta y, si aún no
// aparece, se lee directo por correo (lectura consistente), aceptándolo SOLO si
// su referencia_pago coincide. Si el caso no aparece, NUNCA se descarta en
// silencio: se alerta a Liza (ruta MANUAL_REVIEW, sin generar documento).
async function buscarCaso(H, referenciaPago, correos, propiedades) {
  const pausa = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let i = 0; i < 3; i++) {
    if (i) await pausa(1500);
    const sr = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers: H,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
        properties: propiedades
      })
    });
    const sd = await sr.json();
    if (sd.results && sd.results[0]) return sd.results[0];
  }
  const vistos = {};
  for (const correo of (correos || [])) {
    if (!correo || vistos[correo] || String(correo).indexOf('@') === -1) continue;
    vistos[correo] = true;
    const r = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(correo)}?idProperty=email&properties=${encodeURIComponent(propiedades.concat('referencia_pago').join(','))}`, { headers: H });
    if (r.ok) {
      const c = await r.json();
      if (c && c.properties && c.properties.referencia_pago === referenciaPago) return c;
    }
  }
  return null;
}

const { verificarPago } = require('./lib/bold-pago');

// MODO PRUEBA (solo Deploy Preview de Netlify): permite probar la cadena completa
// sin cobrar. Exige LYZBRI_MODO_PRUEBA=true (variable definida SOLO para el
// contexto deploy-preview) y que la petición NO venga del dominio de producción.
function modoPrueba(event) {
  const host = String((event && event.headers && (event.headers.host || event.headers.Host)) || '');
  return process.env.LYZBRI_MODO_PRUEBA === 'true' && process.env.CONTEXT !== 'production' && host.indexOf('lyzbri.com') === -1;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'method_not_allowed' }) };
  }
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN || !urlMake()) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'configuracion_incompleta' }) };
  }
  let payload;
  try { payload = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }
  const { referenciaPago, serviceCode, caseType, campos } = payload;
  if (!referenciaPago || !serviceCode || !caseType || !campos || typeof campos !== 'object') {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'missing_fields' }) };
  }
  const H = { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, 'Content-Type': 'application/json' };
  const notificar = process.env.LYZBRI_NOTIFY_EMAIL || 'contacto@lyzbri.com';

  try {
    // 1. Pago aprobado en Bold para esa referencia, por el valor del producto.
    if (!modoPrueba(event)) {
      const pago = await verificarPago(referenciaPago, `${serviceCode}|${caseType}`);
      if (!pago.aprobado) {
        const code = (pago.reason === 'bold_unreachable' || pago.reason === 'bold_no_configurado') ? 502 : 403;
        return { statusCode: code, body: JSON.stringify({ ok: false, reason: pago.reason || 'payment_not_approved_for_reference' }) };
      }
    }

    // 2. Caso en HubSpot (creado por crear-caso.js antes del pago).
    const contact = await buscarCaso(H, referenciaPago, [campos.correo_titular, campos.correo_notificaciones],
      ['email', 'firstname', 'nombre_completo', 'phone', 'hechos_completos',
        'lyzbri_service_code', 'lyzbri_case_type', 'lyzbri_make_route']);
    if (!contact) {
      // Caso pagado que no aparece en HubSpot: alerta a Liza, sin documento.
      await enviarAMake({
        ruta: 'MANUAL_REVIEW', ruta_intentada: (CATALOGO_DOCUMENTOS[`${serviceCode}|${caseType}`] || {}).make_route || '',
        service_code: serviceCode, case_type: caseType, referencia: referenciaPago,
        error: 'Formulario recibido pero el caso no se encontró en HubSpot (ni por referencia ni por correo). Contactar al cliente.',
        correo_notificacion: notificar,
        nombre_cliente: txt(campos.nombre_titular) || txt(campos.nombre_denunciante),
        correo_cliente: txt(campos.correo_titular) || txt(campos.correo_notificaciones)
      }).catch(() => false);
      return { statusCode: 404, body: JSON.stringify({ ok: false, reason: 'case_not_found_in_hubspot', alertaEnviada: true }) };
    }
    const p = contact.properties || {};
    if (p.hechos_completos === 'true') {
      return { statusCode: 200, body: JSON.stringify({ ok: true, yaEnviado: true }) };
    }

    // 3. Correspondencia: lo que se pagó (HubSpot) = lo que llega del formulario = catálogo.
    const clave = `${serviceCode}|${caseType}`;
    const producto = CATALOGO_DOCUMENTOS[clave];
    const pagado = p.lyzbri_service_code && p.lyzbri_case_type ? `${p.lyzbri_service_code}|${p.lyzbri_case_type}` : null;
    const errorRuta = !producto ? `case_type sin ruta de documento: ${clave}`
      : (pagado && pagado !== clave) ? `El formulario (${clave}) no coincide con el producto pagado (${pagado})`
      : (p.lyzbri_make_route && p.lyzbri_make_route !== producto.make_route) ? `Ruta registrada ${p.lyzbri_make_route} ≠ ruta del catálogo ${producto.make_route}`
      : null;
    const cliente = { nombre: p.nombre_completo || p.firstname || '', correo: p.email || '', telefono: p.phone || '' };

    if (errorRuta) {
      // Se conserva el caso, se marca y se alerta. NO se genera ningún documento.
      await enviarAMake({
        ruta: 'MANUAL_REVIEW', ruta_intentada: (producto && producto.make_route) || p.lyzbri_make_route || '',
        service_code: serviceCode, case_type: caseType, referencia: referenciaPago, contact_id: contact.id,
        error: errorRuta, correo_notificacion: notificar, cliente: cliente
      });
      await marcarRevision(H, contact.id, 'PENDIENTE_REVISION', errorRuta);
      return { statusCode: 200, body: JSON.stringify({ ok: true, revisionManual: true }) };
    }

    const falta = faltantes(caseType, campos);
    if (falta.length) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'campos_obligatorios', faltantes: falta }) };
    }

    const doc = construirDocumento(caseType, campos);
    const radicado = 'LYZBRI-' + caseType.replace(/_/g, '').slice(0, 10) + '-' + contact.id;
    const correo = p.email || txt(campos.correo_titular) || txt(campos.correo_notificaciones);
    const ok = await enviarAMake({
      ruta: producto.make_route, service_code: serviceCode, case_type: caseType,
      referencia: referenciaPago, radicado: radicado, contact_id: contact.id,
      correo_cliente: correo, correo_notificacion: notificar,
      nombre_cliente: cliente.nombre || doc.nombre_titular || doc.nombre_denunciante,
      titulo_documento: producto.titulo,
      nombre_archivo: producto.titulo.replace(/[^\wÁÉÍÓÚáéíóúÑñ]+/g, '_') + '_' + radicado + '.docx',
      nombre_anexo: 'Anexo_de_instrucciones_' + radicado + '.docx',
      con_anexo: producto.con_anexo,
      textos_json: JSON.stringify(textosLibres(caseType, doc)),
      doc: doc
    });
    if (!ok) {
      await marcarRevision(H, contact.id, 'ERROR_ENTREGA', `Make no recibió el caso (${producto.make_route})`);
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'make_no_disponible' }) };
    }

    // 4. En HubSpot solo quedan datos del propio cliente (sin datos de terceros).
    const props = { hechos_completos: 'true', fecha_hechos_completos: new Date().toISOString().slice(0, 10), estado_revision: 'ENVIADO_A_MAKE' };
    ['address', 'city', 'state'].forEach((k) => { if (campos[k]) props[k] = campos[k]; });
    if (serviceCode === 'HABEAS_DATA') {
      if (campos.numero_documento) props.numero_documento = campos.numero_documento;
      if (TIPO_DOC_CORTO[campos.tipo_documento] && campos.tipo_documento !== 'ti' && campos.tipo_documento !== 'rc') props.tipo_documento = campos.tipo_documento;
    }
    await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contact.id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ properties: props })
    });
    return { statusCode: 200, body: JSON.stringify({ ok: true, radicado: radicado }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};

// Exportados solo para pruebas locales.
exports._CATALOGO_DOCUMENTOS = CATALOGO_DOCUMENTOS;
exports._construirDocumento = construirDocumento;
exports._faltantes = faltantes;
exports._textosLibres = textosLibres;
