import { z } from "zod";

// TODO_CLIENTE: confirmar que estos testimonios son reales y que las familias
// autorizan publicar su nombre. Mientras `esEjemplo` sea true solo se ven en
// desarrollo (o con NEXT_PUBLIC_MOSTRAR_EJEMPLOS=1), siempre con la etiqueta
// "Ejemplo".
const testimonio = z.object({
  nombre: z.string(),
  relacion: z.string(),
  sucursal: z.string(),
  texto: z.string(),
  esEjemplo: z.boolean(),
});

export const TESTIMONIOS = z.array(testimonio).parse([
  {
    nombre: "Carolina Rosario",
    relacion: "Madre de Lucas, 3 años",
    sucursal: "VivirMás",
    texto:
      "Mi hijo le tenía pavor al agua. En apenas 3 clases cambió por completo. La piscina poco profunda le dio toda la confianza que necesitaba.",
    esEjemplo: true,
  },
  {
    nombre: "Manuel Santana",
    relacion: "Alumno adulto",
    sucursal: "Utesa",
    texto:
      "Buscaba carriles amplios y un entrenador que corrigiera mi crol y mi respiración. El horario de los domingos en la mañana me cuadra perfecto.",
    esEjemplo: true,
  },
  {
    nombre: "Patricia De León",
    relacion: "Madre de Sofía y Mateo, 5 y 7 años",
    sucursal: "Utesa",
    texto:
      "La paciencia que tienen con los niños es admirable. En pocos meses los dos perdieron el miedo y ya nadan con seguridad.",
    esEjemplo: true,
  },
]);

export const MOSTRAR_EJEMPLOS =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_MOSTRAR_EJEMPLOS === "1";

export function testimoniosVisibles() {
  return TESTIMONIOS.filter((t) => !t.esEjemplo || MOSTRAR_EJEMPLOS);
}
