// Se llama DESDE EL WIZARD, antes de salir hacia Wompi (ver mostrarResultado()
// en landing_lyzbri.html). Es la pieza que faltaba de raiz: hoy el wizard no
// envia nada a HubSpot, asi que cuando el cliente vuelve del pago no existe
// ningun caso que buscar por referencia_pago. Esta funcion crea (o actualiza,
// si el correo ya existia) el contacto ANTES del pago, con la referencia que
// se va a usar despues para encontrarlo.
//
// Requiere la variable de entorno HUBSPOT_PRIVATE_APP_TOKEN configurada en
// Netlify (Site settings -> Environment variables).

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

  // servicio_comprado es una lista cerrada de HubSpot que no se puede ampliar
  // (el editor de HubSpot falla). Solo se escribe cuando el valor existe en la
  // lista; el servicio real (tutela, desacato, alimentos, ...) va siempre en
  // servicio_lyzbri, que es texto libre y es el que usa Make.
  var SERVICIOS_EN_LISTA = ['habeas_data', 'deudas', 'registro_marca', 'tea_discapacidad'];
  const properties = {
    firstname: nombre,
    phone: whatsapp,
    servicio_lyzbri: servicioLyzbri || servicio,
    referencia_pago: referenciaPago,
    pago_confirmado: 'false'
  };
  if (SERVICIOS_EN_LISTA.indexOf(servicio) !== -1) properties.servicio_comprado = servicio;
  if (correo) properties.email = correo;
  // Las respuestas del wizard (p.ej. tea_condicion/tea_area/tea_estado) se guardan
  // tal cual para no volver a preguntarlas en el formulario post-pago -- PERO
  // excluyendo nombre/whatsapp/correo/consiente, que no son nombres de propiedad
  // de HubSpot (ya se mapearon arriba a firstname/phone/email) y que la API de
  // HubSpot rechazaría por completo si se envían como propiedades inexistentes.
  // Solo se envían a HubSpot las respuestas que existen como propiedad: una
  // propiedad desconocida haría que HubSpot rechazara el caso completo.
  var PROPIEDADES_PERMITIDAS = ['hd_problema', 'hd_reclamo', 'hd_entidad', 'deuda_cantidad', 'deuda_cobro',
    'marca_tipo', 'marca_disponibilidad', 'categoria_condicion_tea', 'area_caso_tea', 'area_caso_tea_texto',
    'tea_estado', 'subtipo_no_visible_tea', 'sub_caso', 'nombre_completo', 'tipo_solicitud_alimentos', 'modalidad_servicio'];
  if (respuestasWizard && typeof respuestasWizard === 'object') {
    Object.keys(respuestasWizard).forEach(function (k) {
      if (PROPIEDADES_PERMITIDAS.indexOf(k) !== -1 && respuestasWizard[k] !== undefined && respuestasWizard[k] !== '') {
        properties[k] = respuestasWizard[k];
      }
    });
  }

  try {
    if (correo) {
      // Con correo: upsert por email -- crea el contacto si no existia, o lo
      // actualiza si la persona ya tenia un caso anterior con Lyzbri.
      const upsertRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(correo)}?idProperty=email`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ properties })
        }
      );
      if (upsertRes.status === 404) {
        // No existia contacto con ese email todavia -- se crea uno nuevo.
        const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ properties })
        });
        if (!createRes.ok) {
          const errText = await createRes.text();
          return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
        }
        return { statusCode: 200, body: JSON.stringify({ ok: true, creado: true }) };
      }
      if (!upsertRes.ok) {
        const errText = await upsertRes.text();
        return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true, creado: false }) };
    }

    // Sin correo (el campo es opcional en el wizard hoy): se crea el contacto
    // directo, sin poder deduplicar por email. referencia_pago sigue siendo
    // la llave que guardar-formulario.js usara despues para encontrarlo.
    const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ properties })
    });
    if (!createRes.ok) {
      const errText = await createRes.text();
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
    }
    return { statusCode: 200, body: JSON.stringify({ ok: true, creado: true }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};
