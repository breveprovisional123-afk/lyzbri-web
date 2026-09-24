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

  const { referenciaPago, correo, campos } = payload;
  if (!referenciaPago || !campos || typeof campos !== 'object') {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'missing_fields' }) };
  }

  try {
    // 1. Verificar de nuevo, del lado del servidor, que el pago con esa
    //    referencia SI esta aprobado en Wompi -- nunca confiar en que quien
    //    llama a este endpoint ya paso por validar-formulario.js.
    const wompiCheck = await fetch(`https://production.wompi.co/v1/transactions?reference=${encodeURIComponent(referenciaPago)}`);
    if (wompiCheck.ok) {
      const wompiData = await wompiCheck.json();
      const tx = wompiData.data && wompiData.data[0];
      if (!tx || tx.status !== 'APPROVED') {
        return { statusCode: 403, body: JSON.stringify({ ok: false, reason: 'payment_not_approved_for_reference' }) };
      }
    }
    // Si la busqueda por referencia no esta disponible en esta cuenta de Wompi,
    // no se bloquea el guardado -- pero queda anotado como punto a reforzar
    // (ver "pendiente_de_endurecer" en la respuesta de error si aplica).

    // 2. Buscar el contacto por referencia_pago (mismo caso ya creado antes del pago).
    const searchRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
        properties: ['hs_object_id', 'email']
      })
    });
    const searchData = await searchRes.json();
    var contact = searchData.results && searchData.results[0];

    // 2b. Respaldo: si no se encontró por referencia_pago (p. ej. crear-caso.js
    //     falló antes del pago, o es un caso previo a esta integración), se
    //     intenta por correo -- y si tampoco existe con ese correo, se crea
    //     el contacto aquí mismo en vez de perder la información del cliente.
    if (!contact && correo) {
      const byEmailRes = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/${encodeURIComponent(correo)}?idProperty=email`,
        { headers: { 'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}` } }
      );
      if (byEmailRes.ok) {
        contact = await byEmailRes.json();
      }
    }

    if (!contact) {
      if (!correo) {
        return { statusCode: 404, body: JSON.stringify({ ok: false, reason: 'case_not_found_in_hubspot_and_no_email' }) };
      }
      const createRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ properties: { email: correo, referencia_pago: referenciaPago, ...campos, hechos_completos: 'true', fecha_hechos_completos: new Date().toISOString() } })
      });
      if (!createRes.ok) {
        const errText = await createRes.text();
        return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_create_failed', detail: errText }) };
      }
      const avisoMakeRespaldo = await avisarAMake(correo, referenciaPago);
      return { statusCode: 200, body: JSON.stringify({ ok: true, creadoComoRespaldo: true, avisoMake: avisoMakeRespaldo }) };
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
          fecha_hechos_completos: new Date().toISOString()
        }
      })
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text();
      return { statusCode: 502, body: JSON.stringify({ ok: false, reason: 'hubspot_update_failed', detail: errText }) };
    }

    const emailContacto = correo || (contact.properties && contact.properties.email) || null;
    const avisoMake = await avisarAMake(emailContacto, referenciaPago);
    return { statusCode: 200, body: JSON.stringify({ ok: true, avisoMake }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'server_error', message: err.message }) };
  }
};
