import { z } from "zod";

const paso = z.object({
  titulo: z.string(),
  texto: z.string(),
  foto: z.enum(["equipoBorde", "tablaCoach", "clavado", "coachNino"]),
});

// Es una secuencia real (así se entra a MC Swim), por eso va numerada.
export const PASOS = z.array(paso).length(4).parse([
  {
    titulo: "Nos escribes",
    texto:
      "Por WhatsApp o con el formulario de esta página. Nos dices quién va a nadar, su edad y qué sucursal te queda mejor.",
    foto: "equipoBorde",
  },
  {
    titulo: "Evaluación en el agua",
    texto:
      "El instructor observa la flotación, la respiración y la confianza en el agua. Va incluida en la inscripción.",
    foto: "tablaCoach",
  },
  {
    titulo: "Tu grupo y tu horario",
    texto:
      "Con la evaluación te asignamos el nivel, el carril y un horario que te funcione. Sin mezclar a quien empieza con quien ya nada.",
    foto: "clavado",
  },
  {
    titulo: "A nadar",
    texto:
      "Clases cada semana y seguimiento cercano desde la primera. Celebramos cada avance, por pequeño que parezca.",
    foto: "coachNino",
  },
]);
