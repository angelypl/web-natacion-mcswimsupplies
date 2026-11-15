// Correspondencia entre las categorías libres que manda mcswim-admin y los tres
// programas de la web. Módulo puro (sin zod ni imports): lo usan también los
// componentes cliente (pizarra de horarios, formulario).
//
// Reglas:
// - Un turno puede servir a más de un programa ("Infantil / Adultos").
// - Se mira primero la categoría y, si no dice nada reconocible, el grupo de
//   edad ("Desde 2 años", "4 años en adelante").
// - Una categoría desconocida devuelve [] : el turno se sigue mostrando con su
//   texto original y solo queda fuera de los filtros por programa.
//
// Categorías vistas en producción (2026-11-14): "Infantil / Adultos",
// "Infantil / Juvenil", "Iniciación Temprana", "Infantil y Grupal", "Adultos".
// En los ejemplos de QA, además, "Formación".

export const PROGRAMAS = ["iniciacion", "formacion", "adultos"] as const;
export type ProgramaSlug = (typeof PROGRAMAS)[number];

/** Sin tildes, en minúscula y sin espacios sobrantes. */
export function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

/** "Iniciación" → "iniciacion", "Prado Oriental" → "prado-oriental". */
export function slug(texto: string) {
  return normalizarTexto(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const POR_CATEGORIA: { programa: ProgramaSlug; patron: RegExp }[] = [
  { programa: "iniciacion", patron: /inicia|temprana|bebe|estimulacion/ },
  { programa: "formacion", patron: /formacion|infantil|juvenil|nino|grupal|competencia/ },
  { programa: "adultos", patron: /adult|mayores/ },
];

const POR_EDAD: { programa: ProgramaSlug; patron: RegExp }[] = [
  { programa: "iniciacion", patron: /\b(2|3)\s*(a|-)\s*3\b|desde\s*(los\s*)?2\b/ },
  { programa: "formacion", patron: /\b(4|5|6|7|8)\s*(anos?)?\s*(en adelante|o mas|\+)|ninos?\b|desde\s*(los\s*)?4\b/ },
  { programa: "adultos", patron: /adult|jovenes y adultos|\+\s*18|mayores/ },
];

function coincidencias(texto: string, reglas: typeof POR_CATEGORIA) {
  const t = normalizarTexto(texto);
  return PROGRAMAS.filter((p) => reglas.some((r) => r.programa === p && r.patron.test(t)));
}

/** Programas de la web a los que sirve un turno de la API. */
export function programasDeTurno(categoria: string, grupoDeEdad = ""): ProgramaSlug[] {
  const porCategoria = coincidencias(categoria, POR_CATEGORIA);
  return porCategoria.length > 0 ? porCategoria : coincidencias(grupoDeEdad, POR_EDAD);
}

/** ¿El nombre de una sucursal de la API es esta sede de la web? ("VivirMás" = "vivirmas"). */
export function mismaSucursal(nombreApi: string, nombreWeb: string) {
  return slug(nombreApi) === slug(nombreWeb);
}
