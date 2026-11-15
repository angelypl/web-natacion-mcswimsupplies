// Menú en palabras del visitante: quien busca precios no piensa en "carriles".
// El ancla #carriles se conserva (el concepto sigue dentro de la sección).
export const NAV = [
  { nombre: "Clases y precios", href: "#carriles" },
  { nombre: "Cómo empezar", href: "#primera-clase" },
  { nombre: "Horarios", href: "#horarios" },
  { nombre: "Sucursales", href: "#sucursales" },
  { nombre: "Preguntas", href: "#preguntas" },
  { nombre: "Inscripción", href: "#inscripcion" },
] as const;

/** En la cabecera de escritorio, "Inscripción" ya es el botón "Reservar mi cupo". */
export const NAV_CABECERA = NAV.filter((n) => n.href !== "#inscripcion");

/** Texto único de la acción principal (boya, lleva al formulario). */
export const ACCION_PRINCIPAL = "Reservar mi cupo";
