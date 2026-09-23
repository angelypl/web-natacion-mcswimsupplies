const WEEKDAYS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
] as const;

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function todayWeekdayName(date = new Date()) {
  return WEEKDAYS[date.getDay()];
}

export function todayIsoDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Loosely matches free-text `day` values (e.g. "Sábados") against a canonical weekday. */
export function dayMatchesWeekday(classDay: string, weekday: string) {
  const a = normalize(classDay);
  const b = normalize(weekday);
  const stem = b.slice(0, 5);
  return a.startsWith(stem);
}
