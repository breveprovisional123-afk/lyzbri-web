// Netlify Function — valida en tiempo real que exista un pago APROBADO en Wompi
// antes de permitir que se muestre el formulario. Nunca se confia solo en el
// parametro de la URL: siempre se re-verifica contra la API de Wompi en el servidor.
//
// Requiere la variable de entorno HUBSPOT_PRIVATE_APP_TOKEN configurada en
// Netlify (Site settings -> Environment variables). Esta funcion NO la trae
// escrita en el codigo -- se lee del entorno en tiempo de ejecucion.

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const transactionId = params.id; // Wompi redirige con ?id=<transactionId>

  if (!transactionId) {
    return { statusCode: 400, body: JSON.stringify({ valid: false, reason: 'missing_transaction_id' }) };
  }

  try {
    // 1. Verificar el estado real del pago contra Wompi.
    //    GET /v1/transactions/:id es un endpoint publico de Wompi (no requiere llave privada).
    const wompiRes = await fetch(`https://production.wompi.co/v1/transactions/${transactionId}`);
    if (!wompiRes.ok) {
      return { statusCode: 502, body: JSON.stringify({ valid: false, reason: 'wompi_unreachable' }) };
    }
    const wompiData = await wompiRes.json();
    const tx = wompiData.data;

    if (!tx || tx.status !== 'APPROVED') {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: 'payment_not_approved', status: tx ? tx.status : null }) };
    }

    const referenciaPago = tx.reference;

    if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      // Sin el token no podemos confirmar el caso en HubSpot. Se devuelve el
      // pago como aprobado (ya verificado contra Wompi) pero sin datos de
      // servicio -- el front-end debe manejar este caso con el ?servicio= de
      // respaldo que ya viaja en la URL.
      return { statusCode: 200, body: JSON.stringify({ valid: true, referenciaPago, servicio: null, warning: 'hubspot_token_not_configured' }) };
    }

    // 2. Buscar el caso en HubSpot por referencia_pago para saber que servicio mostrar.
    const hsRes = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referenciaPago }] }],
        properties: ['servicio_comprado', 'servicio_lyzbri', 'hechos_completos', 'tipo_solicitud_alimentos']
      })
    });
    const hsData = await hsRes.json();
    const contact = hsData.results && hsData.results[0];

    if (!contact) {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: 'case_not_found_in_hubspot', referenciaPago }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        referenciaPago,
        servicio: contact.properties.servicio_lyzbri || contact.properties.servicio_comprado,
        tipoAlimentos: contact.properties.tipo_solicitud_alimentos || null,
        hechosCompletos: contact.properties.hechos_completos === 'true'
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ valid: false, reason: 'server_error', message: err.message }) };
  }
};
