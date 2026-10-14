// Cálculo de días hábiles y términos de impugnación de tutela en Colombia (Ley 51 de 1983 y Decreto 2591 de 1991).
// Válido para 2026 y 2027. Alerta de mantenimiento programada para diciembre de 2027 (A-5).

const FESTIVOS_COLOMBIA = new Set([
  // 2026
  '2026-01-01', '2026-01-12', '2026-03-23', '2026-04-02', '2026-04-03',
  '2026-05-01', '2026-05-18', '2026-06-08', '2026-06-15', '2026-06-29',
  '2026-07-20', '2026-08-07', '2026-08-17', '2026-10-12', '2026-11-02',
  '2026-11-16', '2026-12-08', '2026-12-25',
  // 2027
  '2027-01-01', '2027-01-11', '2027-03-22', '2027-03-25', '2027-03-26',
  '2027-05-01', '2027-05-10', '2027-05-31', '2027-06-07', '2027-07-05',
  '2027-07-20', '2027-08-07', '2027-08-16', '2027-10-18', '2027-11-01',
  '2027-11-15', '2027-12-08', '2027-12-25'
]);

function formatearFechaISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dia}`;
}

function esDiaHabil(d) {
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false; // Domingo o Sábado
  const iso = formatearFechaISO(d);
  if (FESTIVOS_COLOMBIA.has(iso)) return false;
  return true;
}

function siguienteDiaHabil(d) {
  const cur = new Date(d.getTime());
  do {
    cur.setDate(cur.getDate() + 1);
  } while (!esDiaHabil(cur));
  return cur;
}

// Obtiene la fecha actual en zona horaria de Colombia (UTC-5)
function fechaActualColombia(dateObj = new Date()) {
  const utc = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
  const colTime = new Date(utc - (5 * 3600000));
  return colTime;
}

/**
 * Calcula el término legal de 3 días hábiles para impugnar un fallo de tutela.
 * @param {string} fechaNotifStr - 'YYYY-MM-DD'
 * @param {Date} [fechaConsulta] - Fecha para evaluar (por defecto ahora en Colombia)
 */
function calcularTerminoImpugnacion(fechaNotifStr, fechaConsulta = new Date()) {
  if (!fechaNotifStr || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNotifStr)) {
    return { ok: false, estado: 'FECHA_INVALIDA' };
  }

  const [ny, nm, nd] = fechaNotifStr.split('-').map(Number);
  const notifDate = new Date(ny, nm - 1, nd, 12, 0, 0);
  if (isNaN(notifDate.getTime())) {
    return { ok: false, estado: 'FECHA_INVALIDA' };
  }

  // 3 días hábiles siguientes a la notificación
  let dia1 = siguienteDiaHabil(notifDate);
  let dia2 = siguienteDiaHabil(dia1);
  let dia3 = siguienteDiaHabil(dia2); // Fecha de vencimiento fatal

  const fechaVencimientoISO = formatearFechaISO(dia3);

  // Fecha actual evaluada
  const colDate = fechaActualColombia(fechaConsulta);
  const colDateMid = new Date(colDate.getFullYear(), colDate.getMonth(), colDate.getDate(), 12, 0, 0);

  // Si la compra se hace en sábado, domingo o festivo, cuenta como el día hábil siguiente
  let fechaEfectivaCompra = colDateMid;
  if (!esDiaHabil(fechaEfectivaCompra)) {
    fechaEfectivaCompra = siguienteDiaHabil(fechaEfectivaCompra);
  }

  const fechaEfectivaISO = formatearFechaISO(fechaEfectivaCompra);
  const dia1ISO = formatearFechaISO(dia1);
  const dia2ISO = formatearFechaISO(dia2);
  const dia3ISO = formatearFechaISO(dia3);

  // Si la fecha efectiva de compra es anterior o igual a la fecha de notificación (ej. mismo día)
  // o hasta el 2do día hábil: se puede vender impugnación.
  if (fechaEfectivaISO <= dia2ISO) {
    return {
      ok: true,
      estado: 'IMPUGNACION_DISPONIBLE',
      aptoImpugnacion: true,
      fechaNotificacion: fechaNotifStr,
      fechaVencimiento: fechaVencimientoISO,
      diasHabilesRestantesMinimo: 1
    };
  } else if (fechaEfectivaISO === dia3ISO) {
    // Vence hoy: término insuficiente para Lyzbri (mínimo 24 horas hábiles requeridas)
    return {
      ok: true,
      estado: 'VENCE_HOY',
      aptoImpugnacion: false,
      fechaNotificacion: fechaNotifStr,
      fechaVencimiento: fechaVencimientoISO,
      diasHabilesRestantesMinimo: 0
    };
  } else {
    // Término vencido
    return {
      ok: true,
      estado: 'VENCIDO',
      aptoImpugnacion: false,
      fechaNotificacion: fechaNotifStr,
      fechaVencimiento: fechaVencimientoISO
    };
  }
}

module.exports = {
  FESTIVOS_COLOMBIA,
  esDiaHabil,
  siguienteDiaHabil,
  formatearFechaISO,
  calcularTerminoImpugnacion
};
