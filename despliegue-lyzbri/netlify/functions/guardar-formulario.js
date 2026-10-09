const { calcularPrecioInsolvencia, generarNotificacionPostPago } = require('./lib/insolvencia');

// =============================================================================
// LISTA BLANCA DE CAMPOS POR SERVICIO (Condición C9 / Hallazgo B4)
// Protege HubSpot contra inyección de propiedades no autorizadas o reservadas.
// =============================================================================
const CAMPOS_RESERVADOS = [
  'pago_confirmado', 'referencia_pago', 'hechos_completos',
  'estado_revision', 'email', 'fecha_hechos_completos'
];

const CAMPOS_COMUNES = ['address', 'city', 'state'];

const WHITELIST_POR_SERVICIO = {
  'habeas-data': [
    'tipo_documento', 'numero_documento', 'entidad_reportante',
    'fecha_hecho', 'numero_obligaciones', 'monto_obligacion',
    'hechos_adicionales_hd', ...CAMPOS_COMUNES
  ],
  'deudas': [
    'tipo_documento', 'numero_documento', 'acreedores',
    'numero_obligaciones', 'monto_total_adeudado', 'objetivo_negociacion',
    'observaciones_deudas', 'nombre_deudor', 'tipo_sujeto', 'cant_acreedores',
    'fecha_vencimiento_antigua', 'porcentaje_pasivo_mora', 'tiene_libranzas',
    'soporte_abonos_libranza', 'es_comerciante', 'matricula_mercantil',
    'activos_computables_smmlv', 'sociedad_relacionada', 'grupo_empresarial',
    'regimen_especial', 'domicilio_ciudad', 'domicilio_departamento',
    'tiene_bienes', 'vivienda_familiar_vehiculo_trabajo', 'bienes_con_gravamen',
    'discusion_bienes', 'obligaciones_alimentarias', 'sociedad_conyugal_vigente',
    'operaciones_recientes_bienes', 'otros_procesos_cobros',
    'tramite_anterior_insolvencia', 'acuerdo_privado_vigente',
    'ingreso_mensual_promedio', 'gasto_mensual_subsistencia',
    'objetivo_evaluacion', 'acepta_alcance_preliminar', 'hechos_adicionales_deudas',
    'regimen_insolvencia', 'emp_tipo_entidad', 'emp_crisis', 'emp_materialidad',
    'emp_activos', 'emp_operacion', 'emp_objetivo', ...CAMPOS_COMUNES
  ],
  'marca': [
    'nombre_marca', 'denominacion_signo', 'tipo_signo_especial',
    'incluye_elementos_graficos', 'archivo_logo_url', 'descripcion_productos_servicios',
    'titular_tipo', 'razon_social', 'nit_titular', ...CAMPOS_COMUNES
  ],
  'tea': [
    'tipo_documento', 'numero_documento', 'entidad_involucrada_tea',
    'nombre_beneficiario_tea', 'tipo_documento_beneficiario_tea',
    'documento_beneficiario_tea', 'ajuste_solicitado_tea', 'hechos_incumplimiento_tea',
    'nombre_acudiente_tea',
    'fecha_envio_dpeticion_tea', 'juzgado_fallo_tea', 'radicado_tutela_tea',
    'fecha_fallo_tutela', 'fecha_notificacion_fallo_tea', 'plazo_cumplimiento_fallo_tea',
    'orden_incumplida_tea', 'evidencia_incumplimiento_tea', ...CAMPOS_COMUNES
  ],
  'alimentos': [
    'tipo_solicitud_alimentos', 'correo_entrega', 'tipo_documento', 'numero_documento',
    'calidad_solicitante_alimentos', 'autoridad_destino', 'municipio_autoridad',
    'nombre_alimentario', 'documento_alimentario', 'fecha_nacimiento_alimentario',
    'nombre_otra_parte', 'parentesco_otra_parte', 'documento_otra_parte',
    'direccion_otra_parte', 'telefono_otra_parte', 'correo_otra_parte', 'trabajo_otra_parte',
    'aporte_estado', 'aporte_desde', 'aporte_valor', 'ingresos_conocidos', 'ingresos_valor',
    'documento_fijacion', 'fecha_fijacion', 'autoridad_que_fijo', 'cuota_vigente',
    'gasto_vivienda', 'gasto_alimentacion', 'gasto_educacion', 'gasto_salud',
    'gasto_vestuario_recreacion', 'gasto_otros', 'motivos_aumento', 'mejora_patrimonial',
    'causa_disminucion', 'motivos_disminucion', 'causal_exoneracion', 'motivos_exoneracion',
    'cuota_solicitada', 'hechos_adicionales', ...CAMPOS_COMUNES
  ]
};

// Aliases para mapear service_code o claves de catalogo
WHITELIST_POR_SERVICIO['TEA'] = WHITELIST_POR_SERVICIO['tea'];
WHITELIST_POR_SERVICIO['HABEAS_DATA'] = WHITELIST_POR_SERVICIO['habeas-data'];
WHITELIST_POR_SERVICIO['DEUDAS'] = WHITELIST_POR_SERVICIO['deudas'];
WHITELIST_POR_SERVICIO['MARCA'] = WHITELIST_POR_SERVICIO['marca'];
WHITELIST_POR_SERVICIO['ALIMENTOS'] = WHITELIST_POR_SERVICIO['alimentos'];
WHITELIST_POR_SERVICIO['tea-tutela'] = WHITELIST_POR_SERVICIO['tea'];
WHITELIST_POR_SERVICIO['tea-desacato'] = WHITELIST_POR_SERVICIO['tea'];

function validarCamposFormulario(campos, servicio) {
  if (!campos || typeof campos !== 'object') {
    return { ok: false, error: 'campos_no_objeto' };
  }
  const keys = Object.keys(campos);
  if (keys.length === 0) {
    return { ok: false, error: 'campos_vacios' };
  }

  // Obtener lista blanca del servicio o conjunto global si el servicio no viene especificado
  const permitidos = (servicio && WHITELIST_POR_SERVICIO[servicio]) 
    ? new Set(WHITELIST_POR_SERVICIO[servicio])
    : new Set(Object.values(WHITELIST_POR_SERVICIO).flat());

  for (const k of keys) {
    // 1. Rechazo de campos reservados
    if (CAMPOS_RESERVADOS.includes(k) || k.startsWith('lyzbri_') || k.startsWith('servicio_')) {
      return { ok: false, error: `campo_reservado_no_permitido: ${k}` };
    }
    // 2. Rechazo de claves no presentes en la lista blanca
    if (!permitidos.has(k)) {
      return { ok: false, error: `campo_no_permitido: ${k}` };
    }
  }
  return { ok: true };
}

// Recibe el envio del formulario detallado (despues de que el cliente ya paso por
// la validacion de pago) y escribe los campos en el MISMO contacto de HubSpot,
// identificado por referencia_pago. Nunca crea un contacto nuevo. Marca
// hechos_completos=true al final -- ese es el campo que el escenario de Make ya
// esta esperando por reintento/polling despues del webhook de pago aprobado.
//
// Requiere la variable de entorno HUBSPOT_PRIVATE_APP_TOKEN configurada en
// Netlify (Site settings -> Environment variables). Esta funcion NO la trae
// escrita en el codigo -- se lee del entorno en tiempo de ejecucion.

// Avisa a Make que el caso ya tiene los hechos completos, para que genere y
// envie el documento en ese momento (y no al aprobarse el pago, cuando el
// formulario todavia esta vacio). La URL del webhook de Make se lee de la
// variable de entorno MAKE_WEBHOOK_URL -- no va escrita en el codigo porque
// el repositorio es publico. Si falla, no se bloquea el guardado del cliente.
const { verificarPago, PRECIOS } = require('./lib/bold-pago');

async function avisarAMake(email, referenciaPago) {
  if (!process.env.MAKE_WEBHOOK_URL || !email) return false;
  try {
    const r = await fetch(process.env.MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origen: 'formulario_completo',
        data: { transaction: { status: 'APPROVED', customer_email: email, reference: referenciaPago } }
      })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

// Alerta a Liza (ruta MANUAL_REVIEW del escenario de documentos de Make: solo
// correo de alerta, nunca genera documento) cuando un caso pagado no se puede ubicar.
async function alertarRevision(referenciaPago, servicio, error) {
  const url = process.env.MAKE_DOCUMENTOS_WEBHOOK_URL || process.env.MAKE_ALIMENTOS_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ruta: 'MANUAL_REVIEW', service_code: String(servicio || ''), referencia: referenciaPago, error: error })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
}

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

  if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'hubspot_token_not_configured' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }

  const { referenciaPago, correo, campos, servicio } = payload;
  if (!referenciaPago || !campos || typeof campos !== 'object') {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'missing_fields' }) };
  }

  // Validación estricta B4 / C9
  const checkCampos = validarCamposFormulario(campos, servicio || payload.service_code);
  if (!checkCampos.ok) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'campo_no_permitido', detail: checkCampos.error }) };
  }

  // X1: Eliminación defensiva de campos no existentes en HubSpot
  delete campos.parentesco_beneficiario_tea;
  delete campos.lugar_sede_entidad;
  delete campos.fecha_barrera_tea;

  try {
    // 1. Verificar de nuevo, del lado del servidor, que el pago con esa
    //    referencia SI esta aprobado en Bold -- nunca confiar en que quien
    //    llama a este endpoint ya paso por validar-formulario.js.
    let pago = null;
    if (!modoPrueba(event)) {
      pago = await verificarPago(referenciaPago, null);
      if (!pago.aprobado) {
        if (pago.reason === 'bold_unreachable' || pago.reason === 'bold_no_configurado') {
          const alertaEnviada = await alertarRevision(referenciaPago, payload.servicio,
            'Formulario recibido pero no se pudo confirmar el pago en Bold (' + pago.reason + '). Revisar el pago y contactar al cliente.');
          return { statusCode: 502, body: JSON.stringify({ ok: false, reason: pago.reason, alertaEnviada }) };
        }
        return { statusCode: 403, body: JSON.stringify({ ok: false, reason: pago.reason || 'payment_not_approved_for_reference' }) };
      }
    }

    // 2. Buscar el contacto por referencia_pago (mismo caso ya creado antes del pago).
    // La búsqueda de HubSpot es eventualmente consistente (un contacto recién
    // creado puede tardar en aparecer): se reintenta antes de rendirse.
    var contact = null;
    for (var intento = 0; intento < 3 && !contact; intento++) {
      if (intento) await new Promise(function (r) { setTimeout(r, 1500); });
      const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
          properties: ['hs_object_id', 'email', 'lyzbri_service_code', 'lyzbri_case_type']
        })
      });
      const searchData = await searchRes.json();
      contact = searchData.results && searchData.results[0];
    }

    // 2b. Respaldo: si no se encontró por referencia_pago (p. ej. crear-caso.js
    //     falló antes del pago, o es un caso previo a esta integración), se
    //     intenta por correo -- y si tampoco existe con ese correo, se crea
    //     el contacto aquí mismo en vez de perder la información del cliente.
    if (!contact && correo) {
      const byEmailRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(correo)}?idProperty=email&properties=email,lyzbri_service_code,lyzbri_case_type`,
        { headers: { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}` } }
      );
      if (byEmailRes.ok) {
        contact = await byEmailRes.json();
      }
    }

    if (!contact) {
      if (!correo) {
        // Caso pagado que no aparece y sin correo para respaldo: NUNCA en silencio.
        const alertaEnviada = await alertarRevision(referenciaPago, payload.servicio,
          'Formulario recibido pero el caso no se encontró en HubSpot y no llegó correo para respaldo. Contactar al cliente (datos del formulario no guardados).');
        return { statusCode: 404, body: JSON.stringify({ ok: false, reason: 'case_not_found_in_hubspot_and_no_email', alertaEnviada }) };
      }
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ properties: { email: correo, referencia_pago: referenciaPago, ...campos, hechos_completos: 'true', fecha_hechos_completos: new Date().toISOString().slice(0, 10) } })
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
      }
      const avisoMakeRespaldo = await avisarAMake(correo, referenciaPago);
      let notifInsolvencia = null;
      const esDeudasRespaldo = payload.servicio === 'deudas' || (campos && (campos.regimen_insolvencia || campos.monto_total_adeudado));
      if (esDeudasRespaldo) {
        const caseType = (campos && campos.lyzbri_case_type) || 'INSOLV_DIAG_NAT';
        const regimen = (campos && campos.regimen_insolvencia) || 'PN_NC_CGP';
        const nombreCliente = (campos && campos.nombre_deudor) || 'Cliente';
        notifInsolvencia = generarNotificacionPostPago({
          case_type: caseType,
          regimen: regimen,
          nombre: nombreCliente,
          radicado: referenciaPago,
          email: correo
        });
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true, creadoComoRespaldo: true, avisoMake: avisoMakeRespaldo, notifInsolvencia }) };
    }

    // 2c. El valor pagado en Bold debe corresponder al producto registrado en el caso.
    const pc = contact.properties || {};
    const clave = pc.lyzbri_service_code && pc.lyzbri_case_type ? `${pc.lyzbri_service_code}|${pc.lyzbri_case_type}` : null;
    if (pago && clave && PRECIOS[clave] && !(pago.total >= PRECIOS[clave])) {
      const alertaEnviada = await alertarRevision(referenciaPago, payload.servicio,
        'El valor pagado en Bold (' + pago.total + ') no corresponde al producto del caso ' + clave + ' (' + PRECIOS[clave] + '). Revisar antes de entregar.');
      return { statusCode: 403, body: JSON.stringify({ ok: false, reason: 'monto_no_coincide', alertaEnviada }) };
    }

    // 3. Actualizar el contacto con los campos del formulario + marcar hechos_completos.
    const updateRes = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contact.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        properties: {
          ...campos,
          hechos_completos: 'true',
          fecha_hechos_completos: new Date().toISOString().slice(0, 10)
        }
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
    }

    const emailContacto = correo || (contact.properties && contact.properties.email) || null;
    const avisoMake = await avisarAMake(emailContacto, referenciaPago);
    let notifInsolvencia = null;
    const esDeudas = payload.servicio === 'deudas' || (clave && clave.startsWith('DEUDAS|')) || (pc.lyzbri_service_code === 'deudas') || (campos && campos.regimen_insolvencia);
    if (esDeudas) {
      const caseType = pc.lyzbri_case_type || (campos && campos.lyzbri_case_type) || 'INSOLV_DIAG_NAT';
      const regimen = pc.regimen_insolvencia || (campos && campos.regimen_insolvencia) || 'PN_NC_CGP';
      const nombreCliente = pc.firstname || pc.nombre_deudor || (campos && (campos.nombre_deudor || campos.firstname)) || 'Cliente';
      notifInsolvencia = generarNotificacionPostPago({
        case_type: caseType,
        regimen: regimen,
        nombre: nombreCliente,
        radicado: referenciaPago,
        email: emailContacto
      });
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, avisoMake, notifInsolvencia }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};

exports._validarCamposFormulario = validarCamposFormulario;
