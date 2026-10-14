// Netlify Function — registra el caso antes de pasar al checkout o canal de contacto.
// Previene registros duplicados buscando primero por referencia_pago.
// Si el registro en HubSpot falla, responde 502 explícito; nunca simula éxito.
// Incorpora Degradación Controlada: si HubSpot rechaza propiedades personalizadas
// aún no creadas en el portal CRM, las retira y reintenta para asegurar que
// el contacto y el radicado NUNCA se pierdan.

/**
 * Ejecuta una llamada HTTP a HubSpot con degradación controlada:
 * Si HubSpot devuelve HTTP 400 por propiedades no existentes o inválidas en el portal,
 * identifica las propiedades rechazadas, las retira del payload y reintenta la operación.
 */
async function fetchHubSpotConDegradacion(url, options, props) {
  let res = await fetch(url, options);
  if (res.status === 400) {
    const errText = await res.text();
    const rechazadas = [];
    try {
      const j = JSON.parse(errText);
      if (j.context && j.context.propertyName) {
        (Array.isArray(j.context.propertyName) ? j.context.propertyName : [j.context.propertyName]).forEach(p => rechazadas.push(p));
      }
      if (j.message) {
        const matches = j.message.match(/Property ["']?([a-zA-Z0-9_]+)["']? does not exist/gi);
        if (matches) {
          matches.forEach(m => {
            const clean = m.replace(/Property ["']?/i, '').replace(/["']? does not exist/i, '').trim();
            if (clean && !rechazadas.includes(clean)) rechazadas.push(clean);
          });
        }
      }
    } catch (_) {}

    if (rechazadas.length > 0) {
      console.warn('[HubSpot Degradación Controlada] Propiedades no reconocidas por el CRM:', rechazadas);
      const propsDepuradas = { ...props };
      rechazadas.forEach(p => delete propsDepuradas[p]);
      const nuevoBody = JSON.parse(options.body);
      nuevoBody.properties = propsDepuradas;
      const reintento = await fetch(url, { ...options, body: JSON.stringify(nuevoBody) });
      return { res: reintento, degradado: true, rechazadas, errText: null };
    }
    return { res, degradado: false, rechazadas: [], errText };
  }
  return { res, degradado: false, rechazadas: [], errText: null };
}

async function alertar(referencia, error, datosAdicionales) {
  const url = process.env.MAKE_DOCUMENTOS_WEBHOOK_URL || process.env.MAKE_ALIMENTOS_WEBHOOK_URL || process.env.MAKE_WEBHOOK_URL;
  if (!url) return false;
  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ruta: 'MANUAL_REVIEW',
        service_code: 'CREAR_CASO',
        referencia: referencia,
        error: error,
        datos: datosAdicionales,
        correo_notificacion: process.env.LYZBRI_NOTIFY_EMAIL || 'contacto@lyzbri.com'
      })
    });
    return r.ok;
  } catch (e) {
    return false;
  }
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

  const { nombre, whatsapp, correo, servicio, servicioLyzbri, referenciaPago, respuestasWizard } = payload;
  if (!nombre || !whatsapp || !servicio || !referenciaPago) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'missing_fields' }) };
  }

  const SERVICIOS_EN_LISTA = ['habeas_data', 'deudas', 'registro_marca', 'tea_discapacidad'];
  const properties = {
    firstname: nombre,
    phone: whatsapp,
    servicio_lyzbri: servicioLyzbri || servicio,
    referencia_pago: referenciaPago,
    pago_confirmado: 'false',
    hechos_completos: 'false'
  };
  if (SERVICIOS_EN_LISTA.indexOf(servicio) !== -1) properties.servicio_comprado = servicio;
  if (correo) properties.email = correo;

  // Lista de propiedades permitidas verificadas en el esquema de HubSpot
  const PROPIEDADES_PERMITIDAS = [
    'hd_problema', 'hd_reclamo', 'hd_entidad', 'deuda_cantidad', 'deuda_cobro',
    'marca_tipo', 'marca_disponibilidad', 'categoria_condicion_tea', 'area_caso_tea', 'area_caso_tea_texto',
    'tea_estado', 'subtipo_no_visible_tea', 'sub_caso', 'nombre_completo', 'tipo_solicitud_alimentos', 'modalidad_servicio',
    'lyzbri_service_code', 'lyzbri_case_type', 'lyzbri_processing_mode', 'lyzbri_delivery_type',
    'lyzbri_make_route', 'cant_acreedores', 'p1_perfil', 'p2_situacion', 'p3_objetivo', 'regimen_insolvencia',
    'relacion_acreedores_insolvencia', 'estado_caso_insolvencia', 'acepta_alcance_preliminar'
  ];

  if (respuestasWizard && typeof respuestasWizard === 'object') {
    if (respuestasWizard.tutela_previa === 'si' || respuestasWizard.tutela_previa === true) {
      properties.estado_revision = 'MANUAL_REVIEW';
    } else if (respuestasWizard.tutela_previa === 'no' || respuestasWizard.tutela_previa === false) {
      properties.estado_revision = '';
    }

    Object.keys(respuestasWizard).forEach(function (k) {
      if (PROPIEDADES_PERMITIDAS.indexOf(k) !== -1 && respuestasWizard[k] !== undefined && respuestasWizard[k] !== '') {
        properties[k] = String(respuestasWizard[k]);
      }
    });
  }

  // Si es producto de contacto/lead (Flujo B), marcar estado inicial
  const esLeadContacto = properties.lyzbri_delivery_type === 'LEAD_CONTACTO' ||
    ['INSOLV_REP_NAT', 'INSOLV_DIAG_EMP', 'INSOLV_EXP_EMP', 'INSOLV_REORG_EMP', 'INSOLV_SEG_EMP'].includes(properties.lyzbri_case_type);
  if (esLeadContacto) {
    properties.estado_caso_insolvencia = 'LEAD_PENDIENTE_REVISION';
  }

  const H = {
    'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
    'Content-Type': 'application/json'
  };

  try {
    // 1. DEDUPLICACION: Buscar si ya existe contacto con esta referencia_pago
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: H,
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
        properties: ['hs_object_id', 'email', 'referencia_pago']
      })
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const existing = searchData.results && searchData.results[0];
      if (existing && existing.id) {
        // Contacto existente con este radicado -> Actualizar con degradación controlada
        const patchRet = await fetchHubSpotConDegradacion(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(existing.id)}`,
          {
            method: 'PATCH',
            headers: H,
            body: JSON.stringify({ properties })
          },
          properties
        );
        if (!patchRet.res.ok) {
          const errText = patchRet.errText || await patchRet.res.text();
          return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
            ok: true,
            creado: false,
            deduplicado: true,
            id: existing.id,
            degradado: patchRet.degradado,
            propiedades_omitidas: patchRet.rechazadas
          })
        };
      }
    }

    // 2. Si hay correo, verificar si ya existe un contacto y si tiene un caso abierto
    if (correo) {
      const getContactRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(correo)}?idProperty=email&properties=email,firstname,lastname,referencia_pago,pago_confirmado,estado_caso_insolvencia,estado_revision,servicio_lyzbri,servicio_comprado,lyzbri_case_type,hechos_completos`,
        { method: 'GET', headers: H }
      );

      if (getContactRes.ok) {
        const contactData = await getContactRes.json();
        const prevProps = contactData.properties || {};
        const prevRef = prevProps.referencia_pago;

        // Si ya tiene este mismo radicado, es el mismo caso (idempotencia)
        if (prevRef && prevRef === referenciaPago) {
          const patchRet = await fetchHubSpotConDegradacion(
            `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactData.id)}`,
            {
              method: 'PATCH',
              headers: H,
              body: JSON.stringify({ properties })
            },
            properties
          );
          if (!patchRet.res.ok) {
            const errText = patchRet.errText || await patchRet.res.text();
            return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
          }
          return {
            statusCode: 200,
            body: JSON.stringify({
              ok: true,
              creado: false,
              deduplicado: true,
              id: contactData.id,
              degradado: patchRet.degradado,
              propiedades_omitidas: patchRet.rechazadas
            })
          };
        }

        // Si existe un radicado previo DIFERENTE, verificar si el caso anterior está pagado y aún en curso
        if (prevRef && prevRef !== referenciaPago) {
          const pagoConfirmado = String(prevProps.pago_confirmado).toLowerCase() === 'true';

          if (pagoConfirmado) {
            // Criterios de reauditoría Cowork (13 oct 2026):
            // 1. Identificar insolvencia exclusivamente cuando lyzbri_case_type empieza por INSOLV_ (no por servicio_lyzbri = deudas).
            const esInsolvenciaPrev = Boolean(prevProps.lyzbri_case_type && String(prevProps.lyzbri_case_type).startsWith('INSOLV_'));

            let casoEnCurso = false;
            if (esInsolvenciaPrev) {
              // 2. Para insolvencia, considerar entregado un caso cuyo estado_caso_insolvencia sea ENTREGADO o CERRADO
              const entregado = ['ENTREGADO', 'CERRADO', 'ENTREGA_SERVICIO'].includes(prevProps.estado_caso_insolvencia);
              casoEnCurso = !entregado;
            } else {
              // 3. Para servicios automáticos, considerar en curso únicamente cuando hechos_completos no sea 'true',
              // o estado_revision sea MANUAL_REVIEW o ERROR_ENTREGA. Un caso con hechos_completos = true y
              // ENVIADO_A_MAKE o estado vacío permite una nueva compra.
              const hechosIncompletos = String(prevProps.hechos_completos).toLowerCase() !== 'true';
              const enRevisionCritica = ['MANUAL_REVIEW', 'ERROR_ENTREGA'].includes(prevProps.estado_revision);
              casoEnCurso = hechosIncompletos || enRevisionCritica;
            }

            if (casoEnCurso) {
              const detalleAlerta = `Intento de nueva compra (${servicio || properties.servicio_lyzbri}, nuevo radicado: ${referenciaPago}) para correo con caso anterior en curso no entregado (radicado anterior: ${prevRef}, servicio anterior: ${prevProps.servicio_lyzbri || prevProps.servicio_comprado || 'N/A'}, tipo: ${esInsolvenciaPrev ? 'insolvencia' : 'automatico'}, estado_insolv: ${prevProps.estado_caso_insolvencia || 'N/A'}, estado_rev: ${prevProps.estado_revision || 'N/A'}, hechos_completos: ${prevProps.hechos_completos}). Se bloqueó la sobrescritura y se derivó a MANUAL_REVIEW.`;

              await alertar(referenciaPago, detalleAlerta, {
                correo,
                radicado_anterior: prevRef,
                radicado_nuevo: referenciaPago,
                servicio_anterior: prevProps.servicio_lyzbri || prevProps.servicio_comprado,
                servicio_nuevo: servicio || properties.servicio_lyzbri,
                contacto_id: contactData.id,
                pago_confirmado_anterior: prevProps.pago_confirmado,
                hechos_completos_anterior: prevProps.hechos_completos,
                estado_revision_anterior: prevProps.estado_revision,
                estado_insolv_anterior: prevProps.estado_caso_insolvencia
              });

              return {
                statusCode: 409,
                body: JSON.stringify({
                  ok: false,
                  reason: 'caso_abierto_existente',
                  bloqueado_por_caso_abierto: true,
                  mensaje: 'Existe un caso en curso con pago confirmado asociado a este correo electrónico. Por favor contáctanos por WhatsApp para gestionar tu nuevo requerimiento sin afectar tu caso actual.',
                  whatsapp_url: 'https://wa.me/573115872929',
                  contacto_id: contactData.id,
                  radicado_anterior: prevRef,
                  radicado_nuevo: referenciaPago
                })
              };
            }
          }
          // Si el caso anterior no está pagado, o ya fue entregado efectivamente, permitir
          // que la nueva cotización/compra actualice el caso conforme al comportamiento esperado.
        }

        // Si el contacto existe pero NO tiene un caso abierto previo (p. ej. lead sin pagar o radicado vacío),
        // se actualiza de forma segura
        const patchRet = await fetchHubSpotConDegradacion(
          `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(contactData.id)}`,
          {
            method: 'PATCH',
            headers: H,
            body: JSON.stringify({ properties })
          },
          properties
        );
        if (!patchRet.res.ok) {
          const errText = patchRet.errText || await patchRet.res.text();
          return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
            ok: true,
            creado: false,
            degradado: patchRet.degradado,
            propiedades_omitidas: patchRet.rechazadas
          })
        };
      }

      if (getContactRes.status === 404) {
        // Contacto nuevo: creación con POST
        const createRet = await fetchHubSpotConDegradacion(
          'https://api.hubapi.com/crm/v3/objects/contacts',
          {
            method: 'POST',
            headers: H,
            body: JSON.stringify({ properties })
          },
          properties
        );
        if (!createRet.res.ok) {
          const errText = createRet.errText || await createRet.res.text();
          return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
        }
        return {
          statusCode: 200,
          body: JSON.stringify({
            ok: true,
            creado: true,
            degradado: createRet.degradado,
            propiedades_omitidas: createRet.rechazadas
          })
        };
      }

      const errText = await getContactRes.text();
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_lookup_failed', detail: errText }) };
    }

    // 3. Sin correo: creacion directa asegurando referencia_pago unica con degradacion controlada
    const createRet = await fetchHubSpotConDegradacion(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: H,
        body: JSON.stringify({ properties })
      },
      properties
    );
    if (!createRet.res.ok) {
      const errText = createRet.errText || await createRet.res.text();
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
    }
    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        creado: true,
        degradado: createRet.degradado,
        propiedades_omitidas: createRet.rechazadas
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};
