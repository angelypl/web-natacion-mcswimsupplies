import { slug } from "./categorias";
import { CARRILES, INSCRIPCION, type Carril } from "./programas";
import { SITE } from "./site";

// Listas ligeras para pasar por props a los componentes cliente (que no
// importan el contenido validado con zod).

/** Slug del programa en la URL: "iniciacion" | "formacion" | "adultos". */
export const slugPrograma = (c: Carril) => slug(c.nombre);

export const OPCIONES_PROGRAMAS = CARRILES.map((c) => ({ id: slugPrograma(c), nombre: c.nombre }));
export const OPCIONES_SEDES = SITE.sucursales.map((s) => ({ id: s.id, nombre: s.nombre }));

/** Mensualidad + inscripción: lo que se paga el primer mes. */
export const primerMes = (c: Carril) => c.mensualidad + INSCRIPCION.monto;
