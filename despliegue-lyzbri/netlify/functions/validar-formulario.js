// Netlify Function — valida en tiempo real que exista un pago APROBADO en Bold
// antes de permitir que se muestre el formulario. Nunca se confia solo en el
// parametro de la URL: siempre se re-verifica contra la API de Bold en el servidor.
//
// Bold redirige a la URL de retorno agregando ?bold-order-id=<referencia>&bold-tx-status=<estado>.
// La landing llama a esta funcion con ?orden=<bold-order-id>.
//
// Requiere HUBSPOT_PRIVATE_APP_TOKEN y las llaves de Bold en las variables de
// entorno de Netlify (ver lib/bold-pago.js). Nada de eso va escrito en el codigo.

const { verificarPago, consultarPago } = require('./lib/bold-pago');

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const referenciaPago = params.orden; // = bold-order-id = referencia del caso

  if (!referenciaPago) {
    return { statusCode: 400, body: JSON.stringify({ valid: false, reason: 'missing_order_id' }) };
  }

  try {
    // 1. Verificar el estado real del pago contra Bold.
    const pago = await consultarPago(referenciaPago);
    if (!pago.ok) {
      return { statusCode: 502, body: JSON.stringify({ valid: false, reason: pago.reason }) };
    }
    if (pago.status !== 'APPROVED') {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: 'payment_not_approved', status: pago.status || null, referenciaPago }) };
    }

    if (!process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      // Sin el token no podemos confirmar el caso en HubSpot. Se devuelve el
      // pago como aprobado (ya verificado contra Bold) pero sin datos de
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
        properties: ['servicio_comprado', 'servicio_lyzbri', 'hechos_completos', 'tipo_solicitud_alimentos',
          'lyzbri_service_code', 'lyzbri_case_type']
      })
    });
    const hsData = await hsRes.json();
    const contact = hsData.results && hsData.results[0];

    if (!contact) {
      return { statusCode: 200, body: JSON.stringify({ valid: false, reason: 'case_not_found_in_hubspot', referenciaPago }) };
    }

    // 3. El valor pagado debe corresponder al producto registrado en el caso.
    const clave = contact.properties.lyzbri_service_code && contact.properties.lyzbri_case_type
      ? `${contact.properties.lyzbri_service_code}|${contact.properties.lyzbri_case_type}` : null;
    if (clave) {
      const v = await verificarPago(referenciaPago, clave);
      if (!v.aprobado) {
        return { statusCode: 200, body: JSON.stringify({ valid: false, reason: v.reason, referenciaPago }) };
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        valid: true,
        referenciaPago,
        servicio: contact.properties.servicio_lyzbri || contact.properties.servicio_comprado,
        tipoAlimentos: contact.properties.tipo_solicitud_alimentos || null,
        // Identificador estable del producto pagado: decide qué formulario se muestra.
        serviceCode: contact.properties.lyzbri_service_code || null,
        caseType: contact.properties.lyzbri_case_type || null,
        hechosCompletos: contact.properties.hechos_completos === 'true'
      })
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ valid: false, reason: 'server_error', message: err.message }) };
  }
};
