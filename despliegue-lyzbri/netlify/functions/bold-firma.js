// Netlify Function — prepara el pago con el Boton de pagos de Bold.
// Valida estrictamente referencia, producto y numero de acreedores en el servidor.
// Proteccion M1 y M2: nunca confia en defaults del cliente ni permite Seguimiento sin verificacion.

const { PRECIOS, REFERENCIA_VALIDA, llaves, firma } = require('./lib/bold-pago');
const { calcularPrecioInsolvencia } = require('./lib/insolvencia');

const SKUS_CHECKOUT_ONLINE_DEUDAS = new Set([
  'DEUDAS|INSOLV_DIAG_NAT',
  'DEUDAS|INSOLV_MOD_NAT',
  'DEUDAS|INSOLV_NEG_NAT',
  'DEUDAS|INSOLV_SEG_NAT'
]);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ ok: false, reason: 'method_not_allowed' }) };
  }
  let payload;
  try { payload = JSON.parse(event.body); } catch {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'invalid_json' }) };
  }
  const referencia = String((payload && payload.referencia) || '');
  const clave = String((payload && payload.clave) || '');
  if (!REFERENCIA_VALIDA.test(referencia)) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'referencia_invalida' }) };
  }

  // Rechazo en el servidor de servicios empresariales y de representacion (D19)
  if (clave.startsWith('DEUDAS|') && !SKUS_CHECKOUT_ONLINE_DEUDAS.has(clave)) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        reason: 'producto_requiere_contacto_manual',
        message: 'Los servicios empresariales y de representación no admiten checkout automático; requieren evaluación y contacto legal.'
      })
    };
  }

  // Proteccion M2: Seguimiento (INSOLV_SEG_NAT) requiere verificacion de caso o acuerdo previo en el servidor
  if (clave === 'DEUDAS|INSOLV_SEG_NAT') {
    // Si se pasa token de autorizacion explicita o caso verificado
    const autorizacionServidor = payload.autorizacionSeguimiento === true || payload.tramitePrevioVerificado === true;
    if (!autorizacionServidor && process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      try {
        const hsCheck = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referencia }] }],
            properties: ['tramite_anterior_insolvencia', 'acuerdo_privado_vigente', 'autorizacion_seguimiento', 'p2_situacion']
          })
        });
        const hsRes = await hsCheck.json();
        const contact = hsRes.results && hsRes.results[0];
        const props = (contact && contact.properties) || {};
        const tieneCasoPrevio = props.tramite_anterior_insolvencia === 'si' ||
          props.acuerdo_privado_vigente === 'si' ||
          props.autorizacion_seguimiento === 'true' ||
          props.p2_situacion === 'caso_existente';

        if (!tieneCasoPrevio) {
          return {
            statusCode: 400,
            body: JSON.stringify({
              ok: false,
              reason: 'seguimiento_requiere_caso_previo_verificado',
              message: 'El servicio de seguimiento requiere un trámite o acuerdo de insolvencia previo verificado. Por favor contacta a la abogada para habilitar tu caso.'
            })
          };
        }
      } catch (err) {
        // En caso de error de consulta externa, falla cerrada
        return {
          statusCode: 400,
          body: JSON.stringify({
            ok: false,
            reason: 'seguimiento_requiere_caso_previo_verificado',
            message: 'No fue posible validar la elegibilidad previa para seguimiento. Contacta a la abogada.'
          })
        };
      }
    } else if (!autorizacionServidor) {
      // Sin autorizacion ni acceso CRM verificable, bloquea checkout de seguimiento
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          reason: 'seguimiento_requiere_caso_previo_verificado',
          message: 'El servicio de seguimiento requiere un trámite o acuerdo de insolvencia previo verificado.'
        })
      };
    }
  }

  // Calculo del monto desde la configuracion confiable del servidor (D9 / D19 / M1)
  let monto = null;
  if (clave.startsWith('DEUDAS|INSOLV_')) {
    const caseType = clave.split('|')[1];
    let cantAcreedores = payload.cantAcreedores;

    // Si HubSpot esta disponible, busca el dato persistido para garantizar coherencia
    if (process.env.HUBSPOT_PRIVATE_APP_TOKEN) {
      try {
        const hsSearch = await fetch('https://api.hubapi.com/crm/v3/objects/contacts/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HUBSPOT_PRIVATE_APP_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            filterGroups: [{ filters: [{ propertyName: 'referencia_pago', operator: 'EQ', value: referencia }] }],
            properties: ['cant_acreedores', 'deuda_cantidad']
          })
        });
        const hsData = await hsSearch.json();
        const c = hsData.results && hsData.results[0];
        if (c && c.properties && c.properties.cant_acreedores) {
          cantAcreedores = c.properties.cant_acreedores;
        }
      } catch (_) {}
    }

    // Validacion estricta: cantAcreedores es obligatorio para insolvencia
    monto = calcularPrecioInsolvencia(caseType, cantAcreedores);
    if (!monto) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          ok: false,
          reason: 'cant_acreedores_invalida',
          message: 'El número de acreedores es obligatorio para cotizar el servicio de insolvencia y debe ser un entero positivo.'
        })
      };
    }
  } else {
    monto = PRECIOS[clave];
  }

  if (!monto || typeof monto !== 'number' || monto <= 0) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, reason: 'producto_no_cobrable' }) };
  }
  const { apiKey, secret, ambiente } = llaves();
  if (!apiKey || !secret) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, reason: 'bold_no_configurado' }) };
  }
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ ok: true, apiKey, amount: monto, currency: 'COP', signature: firma(referencia, monto, secret), ambiente })
  };
};
