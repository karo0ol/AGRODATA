// Todas las fechas de la app se guardan como texto "AAAA-MM-DD" (igual que
// el <input type="date">) y las horas como "HH:MM". Estas funciones evitan el
// error típico de new Date("2026-11-17"), que interpreta la fecha en UTC y puede
// mostrar el día anterior en Colombia.

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

const DIAS_SEMANA = [
  "domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado",
];

function dosDigitos(numero) {
  return String(numero).padStart(2, "0");
}

// Date -> "AAAA-MM-DD" (hora local)
export function aISO(fecha) {
  return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(
    fecha.getDate()
  )}`;
}

// "AAAA-MM-DD" -> Date (hora local, sin desfase)
export function deISO(iso) {
  if (!iso) return null;
  const [anio, mes, dia] = iso.split("-").map(Number);
  return new Date(anio, mes - 1, dia);
}

// Fecha de hoy en formato "AAAA-MM-DD"
export function hoyISO() {
  return aISO(new Date());
}

// "2026-11-17" -> "17/11/2026"
export function formatearFecha(iso) {
  if (!iso) return "—";
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

// "2026-11-17" -> "martes 17 de noviembre de 2026"
export function formatearFechaLarga(iso) {
  const fecha = deISO(iso);
  if (!fecha) return "—";
  return `${DIAS_SEMANA[fecha.getDay()]} ${fecha.getDate()} de ${
    MESES[fecha.getMonth()]
  } de ${fecha.getFullYear()}`;
}

// "14:30" -> "2:30 p. m."
export function formatearHora(hora) {
  if (!hora) return "";
  const [h, m] = hora.split(":").map(Number);
  const sufijo = h >= 12 ? "p. m." : "a. m.";
  const hora12 = h % 12 === 0 ? 12 : h % 12;
  return `${hora12}:${dosDigitos(m)} ${sufijo}`;
}

// Días de diferencia entre dos fechas (positivo si "hasta" es posterior)
export function diasEntre(desdeISO, hastaISO) {
  const [a1, m1, d1] = desdeISO.split("-").map(Number);
  const [a2, m2, d2] = hastaISO.split("-").map(Number);
  const ms = Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1);
  return Math.round(ms / 86400000);
}

// Suma (o resta, con negativos) días a una fecha "AAAA-MM-DD"
export function agregarDias(iso, dias) {
  const fecha = deISO(iso);
  fecha.setDate(fecha.getDate() + dias);
  return aISO(fecha);
}

// true si la fecha ya pasó (antes de hoy)
export function esPasada(iso) {
  return Boolean(iso) && iso < hoyISO();
}

// "Hoy", "Mañana", "Ayer", "En 3 días", "Hace 2 días"
export function etiquetaRelativa(iso) {
  if (!iso) return "";
  const diferencia = diasEntre(hoyISO(), iso);
  if (diferencia === 0) return "Hoy";
  if (diferencia === 1) return "Mañana";
  if (diferencia === -1) return "Ayer";
  if (diferencia > 1) return `En ${diferencia} días`;
  return `Hace ${-diferencia} días`;
}

/* ---------------- Semana (la semana empieza el lunes) ---------------- */

export function inicioSemana(iso) {
  const fecha = deISO(iso);
  const desdeLunes = (fecha.getDay() + 6) % 7; // lunes = 0 ... domingo = 6
  fecha.setDate(fecha.getDate() - desdeLunes);
  return aISO(fecha);
}

export function finSemana(iso) {
  return agregarDias(inicioSemana(iso), 6);
}

// Los 7 días (lunes a domingo) de la semana que contiene la fecha
export function diasDeLaSemana(iso) {
  const lunes = inicioSemana(iso);
  return Array.from({ length: 7 }, (_, i) => agregarDias(lunes, i));
}

// Número de semana del año (ISO 8601)
export function numeroSemana(iso) {
  const fecha = deISO(iso);
  const d = new Date(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()));
  const dia = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dia);
  const inicioAnio = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - inicioAnio) / 86400000 + 1) / 7);
}

/* ---------------- Calendario por mes (sección de alertas) ---------------- */

// mes: 0 = enero ... 11 = diciembre
export function nombreMes(mes) {
  return MESES[mes];
}

// Mueve el mes hacia adelante (+1) o atrás (-1) ajustando el año
export function cambiarMes(anio, mes, delta) {
  const fecha = new Date(anio, mes + delta, 1);
  return { anio: fecha.getFullYear(), mes: fecha.getMonth() };
}

// Celdas del calendario de un mes, de lunes a domingo, completando las
// semanas con días del mes anterior y siguiente.
// Devuelve [{ iso, dia, delMes }] (la cantidad siempre es múltiplo de 7).
export function diasDelMes(anio, mes) {
  const primero = aISO(new Date(anio, mes, 1));
  const ultimo = aISO(new Date(anio, mes + 1, 0));
  const fin = finSemana(ultimo);

  const celdas = [];
  let cursor = inicioSemana(primero);
  while (cursor <= fin) {
    const fecha = deISO(cursor);
    celdas.push({
      iso: cursor,
      dia: fecha.getDate(),
      delMes: fecha.getMonth() === mes,
    });
    cursor = agregarDias(cursor, 1);
  }
  return celdas;
}

/* ---------------- Nombres que usan las páginas ----------------
   Son los mismos de arriba con otro nombre, para no tocar cada página:
     sumarDias(fecha, n)   = agregarDias
     lunesDe(fecha)        = inicioSemana
     semanaDelAnio(fecha)  = numeroSemana
     formatoFecha(fecha)   = formatearFecha  ("2026-11-17" -> "17/11/2026")
------------------------------------------------------------- */
export const sumarDias = agregarDias;
export const lunesDe = inicioSemana;
export const semanaDelAnio = numeroSemana;
export const formatoFecha = formatearFecha;
