// Parte pura del contexto compartido (sin React): la usan también los
// componentes del servidor para construir enlaces.

export type Eleccion = {
  /** Slug del programa: "iniciacion" | "formacion" | "adultos". */
  programa: string | null;
  /** Id de la sede de la web ("utesa") o slug del nombre que manda la API. */
  sucursal: string | null;
  /** Turno tal como lo manda la API: "Lunes|5:00 PM". */
  turno: string | null;
};

export const CLAVES = ["programa", "sucursal", "turno"] as const;

/** Query string con la elección: `?programa=adultos#horarios`. Para enlaces del servidor. */
export function enlaceEleccion(cambios: Partial<Eleccion>, ancla: string) {
  const p = new URLSearchParams();
  for (const clave of CLAVES) {
    const valor = cambios[clave];
    if (valor) p.set(clave, valor);
  }
  const q = p.toString();
  return `${q ? `?${q}` : ""}${ancla}`;
}

/** Turno serializado para la URL: "Lunes|5:00 PM". */
export const codificarTurno = (dia: string, hora: string) => `${dia}|${hora}`;
export function decodificarTurno(turno: string | null) {
  if (!turno) return null;
  const [dia, hora] = turno.split("|");
  return dia && hora ? { dia, hora } : null;
}
