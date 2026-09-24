// Servicio de Alimentos (fijación, aumento, disminución y exoneración de cuota).
//
// Recibe el formulario post-pago y lo envía DIRECTO a Make para generar el
// documento Word. Por minimización de datos (Ley 1581 de 2012), los datos del
// menor/alimentario y de la otra parte NO se guardan en HubSpot: en HubSpot
// solo queda el cliente, el servicio, el tipo de solicitud y que ya completó
// el formulario.
//
// Variables de entorno (Netlify): HUBSPOT_PRIVATE_APP_TOKEN,
// MAKE_ALIMENTOS_WEBHOOK_URL y LYZBRI_NOTIFY_EMAIL (correo que recibe los casos
// "con acompañamiento"). Ninguna va escrita en el código (repositorio público).

const TIPOS = {
  fijacion: 'Solicitud de conciliación para la fijación de cuota alimentaria',
  aumento: 'Solicitud de conciliación para el aumento de cuota alimentaria',
  disminucion: 'Solicitud de conciliación para la disminución de cuota alimentaria',
  exoneracion: 'Solicitud de conciliación para la exoneración de cuota alimentaria'
};

const TIPO_DOC = {
  cc: 'cédula de ciudadanía', ce: 'cédula de extranjería', pasaporte: 'pasaporte',
  ppt: 'Permiso por Protección Temporal (PPT)', pep: 'Permiso Especial de Permanencia (PEP)'
};

const CALIDAD = {
  madre: 'madre del (de la) alimentario(a)',
  padre: 'padre del (de la) alimentario(a)',
  representante: 'representante legal o persona que tiene a cargo al (a la) alimentario(a)',
  alimentario: 'alimentario(a) mayor de edad',
  obligado: 'persona obligada al pago de la cuota alimentaria'
};

const PARENTESCO = {
  padre: 'el padre', madre: 'la madre', conyuge: 'cónyuge o compañero(a) permanente',
  hijo: 'hijo(a)', otro: 'pariente obligado(a) a suministrar alimentos'
};

const AUTORIDAD = {
  comisaria: 'COMISARIO(A) DE FAMILIA',
  icbf: 'DEFENSOR(A) DE FAMILIA — INSTITUTO COLOMBIANO DE BIENESTAR FAMILIAR (ICBF)',
  centro: 'CENTRO DE CONCILIACIÓN'
};

const DOC_FIJACION = { acta: 'acta de conciliación', sentencia: 'sentencia judicial' };

const CAUSA_DISMINUCION = {
  perdida_ingresos: 'la pérdida del empleo o la reducción de los ingresos del (de la) obligado(a)',
  nuevas_cargas: 'el surgimiento de nuevas cargas familiares a cargo del (de la) obligado(a)',
  enfermedad: 'una enfermedad o incapacidad del (de la) obligado(a) que reduce su capacidad de pago',
  menores_gastos: 'la disminución real de los gastos del (de la) alimentario(a)',
  ingresos_propios: 'que el (la) alimentario(a) cuenta ahora con ingresos propios'
};

const FUND_EDAD = 'Conforme a la jurisprudencia constitucional, la obligación alimentaria de los padres respecto de los hijos mayores de edad subsiste, por regla general, mientras estos adelanten estudios y hasta los veinticinco (25) años de edad, o mientras no puedan proveer su propia subsistencia; cesadas esas circunstancias, procede la exoneración.';
const FUND_NECESIDAD = 'La obligación alimentaria supone la necesidad del alimentario y la capacidad económica del alimentante; desaparecida la necesidad, procede la exoneración.';
const CAUSAL_EXONERACION = {
  mayor_sin_estudio: ['el (la) alimentario(a) es mayor de edad, no adelanta estudios y está en capacidad de proveer su propia subsistencia', FUND_EDAD],
  cumplio_25: ['el (la) alimentario(a) cumplió veinticinco (25) años de edad', FUND_EDAD],
  titulo: ['el (la) alimentario(a) obtuvo un título profesional, tecnológico o técnico que le permite proveer su propia subsistencia', FUND_EDAD],
  capacidad_recuperada: ['el (la) alimentario(a) recuperó la capacidad de proveer su propia subsistencia', FUND_NECESIDAD],
  mejora_economica: ['el (la) alimentario(a) mejoró sustancialmente su situación económica y ya no requiere los alimentos', FUND_NECESIDAD],
  maltrato: ['el (la) solicitante, hijo(a) del (de la) alimentario(a), fue víctima de maltrato físico o psicológico grave o de violencia intrafamiliar por parte de este(a)',
    'Parágrafo del artículo 9 de la Ley 2388 de 2024, que modificó el artículo 411 del Código Civil, en los términos de la Sentencia C-412 de 2025 de la Corte Constitucional, según los cuales los hijos, cualquiera que sea el origen del vínculo filial (biológico, adoptivo o de crianza), quedan exonerados de la obligación alimentaria respecto de los padres que los sometieron a maltrato físico o psicológico grave o a violencia intrafamiliar.']
};

const NI = 'No informado';

function txt(v) {
  return (v === undefined || v === null || String(v).trim() === '') ? NI : String(v).trim();
}
function num(v) {
  const n = Number(String(v || '').replace(/[^0-9]/g, ''));
  return isFinite(n) ? n : 0;
}
function cop(v) {
  const n = num(v);
  return n ? '$' + n.toLocaleString('es-CO') : NI;
}
function fecha(v) {
  if (!v) return NI;
  const m = String(v).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(v);
}
function hoy() {
  const d = new Date(Date.now() - 5 * 3600 * 1000); // hora de Colombia
  return `${String(d.getUTCDate()).padStart(2, '0')}/${String(d.getUTCMonth() + 1).padStart(2, '0')}/${d.getUTCFullYear()}`;
}

function construirDocumento(tipo, c, cliente, radicado, modalidad) {
  const esObligadoSolicitante = (tipo === 'disminucion' || tipo === 'exoneracion');
  const d = {
    radicado_lyzbri: radicado,
    fecha_documento: hoy(),
    modalidad: modalidad === 'acompanamiento' ? 'Con acompañamiento' : 'Autogestión',
    autoridad_destino: AUTORIDAD[c.autoridad_destino] || NI,
    municipio_autoridad: txt(c.municipio_autoridad),
    nombre_solicitante: txt(cliente.nombre).toUpperCase(),
    tipo_documento_solicitante: TIPO_DOC[c.tipo_documento] || NI,
    documento_solicitante: txt(c.numero_documento),
    direccion_solicitante: txt(c.address),
    ciudad_solicitante: txt(c.city),
    departamento_solicitante: txt(c.state),
    correo_solicitante: txt(cliente.correo),
    celular_solicitante: txt(cliente.telefono),
    calidad_solicitante: CALIDAD[c.calidad_solicitante_alimentos] || NI,
    nombre_alimentario: txt(c.nombre_alimentario).toUpperCase(),
    documento_alimentario: txt(c.documento_alimentario),
    fecha_nacimiento_alimentario: fecha(c.fecha_nacimiento_alimentario),
    parentesco: PARENTESCO[c.parentesco_otra_parte] || NI,
    nombre_otra_parte: txt(c.nombre_otra_parte).toUpperCase(),
    documento_otra_parte: txt(c.documento_otra_parte),
    direccion_otra_parte: txt(c.direccion_otra_parte),
    telefono_otra_parte: txt(c.telefono_otra_parte),
    correo_otra_parte: txt(c.correo_otra_parte),
    trabajo_otra_parte: txt(c.trabajo_otra_parte),
    hechos_adicionales: txt(c.hechos_adicionales) === NI ? 'No se reportan hechos adicionales.' : txt(c.hechos_adicionales),
    situacion_aporte: NI, ingresos_obligado: NI,
    gasto_total: NI, gasto_vivienda: NI, gasto_alimentacion: NI, gasto_educacion: NI,
    gasto_salud: NI, gasto_vestuario_recreacion: NI, gasto_otros: NI,
    cuota_solicitada: 'el valor que se determine en la audiencia', cuota_vigente: NI,
    documento_fijacion: NI, fecha_fijacion: NI, autoridad_que_fijo: NI,
    motivos: NI, mejora_patrimonial: NI, causa: NI, causal: NI, fundamento_causal: ''
  };
  d.nombre_obligado = esObligadoSolicitante ? d.nombre_solicitante : d.nombre_otra_parte;

  if (tipo === 'fijacion' || tipo === 'aumento') {
    const g = ['gasto_vivienda', 'gasto_alimentacion', 'gasto_educacion', 'gasto_salud', 'gasto_vestuario_recreacion', 'gasto_otros'];
    let total = 0;
    g.forEach(function (k) { total += num(c[k]); d[k] = cop(c[k]); });
    d.gasto_total = total ? cop(total) : NI;
  }
  if (tipo === 'fijacion') {
    if (c.aporte_estado === 'no_aporta') {
      d.situacion_aporte = `Desde ${txt(c.aporte_desde)}, ${d.nombre_otra_parte} no aporta suma alguna para el sostenimiento de ${d.nombre_alimentario}.`;
    } else if (c.aporte_estado === 'insuficiente') {
      d.situacion_aporte = `${d.nombre_otra_parte} aporta la suma de ${cop(c.aporte_valor)} mensuales, que resulta insuficiente para cubrir las necesidades de ${d.nombre_alimentario}.`;
    } else if (c.aporte_estado === 'irregular') {
      d.situacion_aporte = `${d.nombre_otra_parte} realiza aportes de manera irregular, sin una periodicidad ni un valor que permitan cubrir las necesidades de ${d.nombre_alimentario}.`;
    }
    d.ingresos_obligado = c.ingresos_conocidos === 'si'
      ? `devenga aproximadamente ${cop(c.ingresos_valor)} mensuales.`
      : 'se desconocen sus ingresos; en consecuencia, se solicita tener en cuenta la presunción prevista en el artículo 129 de la Ley 1098 de 2006, según la cual, a falta de prueba, se presume que el obligado devenga al menos el salario mínimo legal mensual vigente.';
  }
  if (tipo !== 'fijacion') {
    d.documento_fijacion = DOC_FIJACION[c.documento_fijacion] || NI;
    d.fecha_fijacion = fecha(c.fecha_fijacion);
    d.autoridad_que_fijo = txt(c.autoridad_que_fijo);
    d.cuota_vigente = cop(c.cuota_vigente);
  }
  if (tipo !== 'exoneracion' && num(c.cuota_solicitada)) d.cuota_solicitada = cop(c.cuota_solicitada);
  if (tipo === 'aumento') {
    d.motivos = txt(c.motivos_aumento);
    d.mejora_patrimonial = txt(c.mejora_patrimonial) === NI ? 'no se cuenta por ahora con prueba de su mejora patrimonial.' : txt(c.mejora_patrimonial);
  }
  if (tipo === 'disminucion') {
    d.causa = CAUSA_DISMINUCION[c.causa_disminucion] || NI;
    d.motivos = txt(c.motivos_disminucion);
  }
  if (tipo === 'exoneracion') {
    const ce = CAUSAL_EXONERACION[c.causal_exoneracion];
    d.causal = ce ? ce[0] : NI;
    d.fundamento_causal = ce ? ce[1] : '';
    d.motivos = txt(c.motivos_exoneracion);
  }
  return d;
}

function faltantes(tipo, c) {
  const req = ['tipo_documento', 'numero_documento', 'address', 'city', 'state', 'calidad_solicitante_alimentos',
    'autoridad_destino', 'municipio_autoridad', 'nombre_alimentario', 'nombre_otra_parte'];
  if (tipo === 'fijacion') req.push('parentesco_otra_parte', 'aporte_estado', 'ingresos_conocidos');
  if (tipo !== 'fijacion') req.push('documento_fijacion', 'fecha_fijacion', 'autoridad_que_fijo', 'cuota_vigente');
  if (tipo === 'aumento') req.push('motivos_aumento');
  if (tipo === 'disminucion') req.push('causa_disminucion', 'motivos_disminucion');
  if (tipo === 'exoneracion') req.push('causal_exoneracion', 'motivos_exoneracion');
  return req.filter(function (k) { return !c[k] || String(c[k]).trim() === ''; });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'method_not_allowed' }) };
  }
  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN || !process.env.MAKE_ALIMENTOS_WEBHOOK_URL) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'configuracion_incompleta' }) };
  }
  let payload;
  try { payload = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }
  const { referenciaPago, campos } = payload;
  if (!referenciaPago || !campos || typeof campos !== 'object') {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'missing_fields' }) };
  }
  const H = { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`, 'Content-Type': 'application/json' };

  try {
    // 1. El pago con esa referencia debe estar aprobado en Wompi.
    const wompiCheck = await fetch(`https://production.wompi.co/v1/transactions?reference=${encodeURIComponent(referenciaPago)}`);
    if (wompiCheck.ok) {
      const w = await wompiCheck.json();
      const tx = w.data && w.data[0];
      if (!tx || tx.status !== 'APPROVED') {
        return { statusCode: 403, body: JSON.stringify({ ok: false, reason: 'payment_not_approved_for_reference' }) };
      }
    }

    // 2. Caso en HubSpot (creado antes del pago por crear-caso.js).
    const sr = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST', headers: H,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
        properties: ['email', 'firstname', 'nombre_completo', 'phone', 'tipo_solicitud_alimentos', 'modalidad_servicio', 'hechos_completos']
      })
    });
    const sd = await sr.json();
    const contact = sd.results && sd.results[0];
    if (!contact) {
      return { statusCode: 404, body: JSON.stringify({ ok: false, reason: 'case_not_found_in_hubspot' }) };
    }
    const p = contact.properties || {};
    if (p.hechos_completos === 'true') {
      return { statusCode: 200, body: JSON.stringify({ ok: true, yaEnviado: true }) };
    }

    const tipo = p.tipo_solicitud_alimentos || campos.tipo_solicitud_alimentos;
    if (!TIPOS[tipo]) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'tipo_invalido' }) };
    }
    const falta = faltantes(tipo, campos);
    if (falta.length) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'campos_obligatorios', faltantes: falta }) };
    }
    const correo = p.email || campos.correo_entrega;
    if (!correo) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'sin_correo', faltantes: ['correo_entrega'] }) };
    }
    const modalidad = p.modalidad_servicio || 'autogestion';
    const cliente = { nombre: p.nombre_completo || p.firstname, correo: correo, telefono: p.phone };
    const radicado = 'LYZBRI-ALI-' + contact.id;
    const doc = construirDocumento(tipo, campos, cliente, radicado, modalidad);

    // 3. Enviar a Make (genera el Word y lo manda por correo).
    const mk = await fetch(process.env.MAKE_ALIMENTOS_WEBHOOK_URL, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: tipo, modalidad: modalidad, radicado: radicado, correo_cliente: correo,
        correo_notificacion: process.env.LYZBRI_NOTIFY_EMAIL || 'contacto@lyzbri.com',
        titulo_documento: TIPOS[tipo],
        nombre_archivo: TIPOS[tipo].replace(/ /g, '_') + '_' + radicado + '.docx',
        doc: doc
      })
    });
    if (!mk.ok) {
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'make_no_disponible' }) };
    }

    // 4. En HubSpot solo queda lo del propio cliente (sin datos de terceros).
    const props = { hechos_completos: 'true', fecha_hechos_completos: new Date().toISOString() };
    ['address', 'city', 'state', 'numero_documento'].forEach(function (k) { if (campos[k]) props[k] = campos[k]; });
    if (TIPO_DOC[campos.tipo_documento]) props.tipo_documento = campos.tipo_documento;
    if (!p.email && campos.correo_entrega) props.email = campos.correo_entrega;
    const up = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contact.id}`, {
      method: 'PATCH', headers: H, body: JSON.stringify({ properties: props })
    });
    if (!up.ok && props.email) {
      // Si el correo ya existe en otro contacto, se reintenta sin tocar el correo.
      delete props.email;
      await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contact.id}`, {
        method: 'PATCH', headers: H, body: JSON.stringify({ properties: props })
      });
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, radicado: radicado }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};

// Exportado solo para pruebas locales.
exports._construirDocumento = construirDocumento;
exports._faltantes = faltantes;
