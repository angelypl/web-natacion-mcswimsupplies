// Días y horas tal como llegan del panel (mcswim-admin), mostrados con la norma
// del español. Módulo puro: lo usan la pizarra, el formulario y el resumen.

export const DIAS_SEMANA = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"] as const;

const sinTildes = (t: string) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Posición 0 (lunes) … 6 (domingo) de un día escrito a mano. Tolera plurales,
 * tildes y mayúsculas ("Sábados" = "sabado"), igual que weekdayIndex en
 * mcswim-admin. 7 si no se reconoce.
 */
export function indiceDia(dia: string) {
  const clave = sinTildes(dia).slice(0, 5);
  const i = DIAS_SEMANA.findIndex((d) => sinTildes(d).slice(0, 5) === clave);
  return i === -1 ? 7 : i;
}

/** "Sábados" → "sábado", "LUNES" → "lunes". Si no se reconoce, lo deja en minúscula. */
export function diaEnMinuscula(dia: string) {
  const i = indiceDia(dia);
  return i < 7 ? DIAS_SEMANA[i] : dia.trim().toLocaleLowerCase("es");
}

/** "Sábados" → "Sábado": para cabeceras. */
export function diaTitulo(dia: string) {
  const d = diaEnMinuscula(dia);
  return d.charAt(0).toLocaleUpperCase("es") + d.slice(1);
}

/** Índice de hoy (0 = lunes) con la hora de República Dominicana. */
export function indiceHoy(fecha = new Date()) {
  const nombre = new Intl.DateTimeFormat("es-DO", { weekday: "long", timeZone: "America/Santo_Domingo" }).format(fecha);
  return indiceDia(nombre);
}

/**
 * "7:00 AM" → "7:00 a. m."; "8:00 PM - 9:00 PM" → "8:00 a 9:00 p. m.".
 * Si el texto no tiene la forma esperada, lo devuelve tal cual.
 */
export function formatoHora(texto: string) {
  const hora = texto.replace(
    /(\d{1,2}(?::\d{2})?)\s*([ap])\.?\s*m\.?/gi,
    (_, h: string, m: string) => `${h} ${m.toLowerCase()}. m.`,
  );
  const rango = hora.match(/^\s*(\S+) ([ap]\. m\.)\s*(?:-|–|—|a|hasta)\s*(\S+) ([ap]\. m\.)\s*$/);
  if (!rango) return hora.trim();
  const [, desde, franjaDesde, hasta, franjaHasta] = rango;
  return franjaDesde === franjaHasta
    ? `${desde} a ${hasta} ${franjaHasta}`
    : `${desde} ${franjaDesde} a ${hasta} ${franjaHasta}`;
}

/** Minutos desde medianoche de "5:00 PM" / "17:00" (para ordenar). Infinity si no se reconoce. */
export function minutos(texto: string) {
  const m = texto.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*([ap])?/i);
  if (!m) return Number.POSITIVE_INFINITY;
  let h = Number(m[1]) % 12;
  if (m[3]?.toLowerCase() === "p") h += 12;
  if (!m[3] && Number(m[1]) >= 12) h = Number(m[1]);
  return h * 60 + Number(m[2] ?? 0);
}

/** "Lunes" + "5:00 PM" → "lunes, 5:00 p. m." */
export function textoTurno(dia: string, hora: string) {
  return `${diaEnMinuscula(dia)}, ${formatoHora(hora)}`;
}
