import { z } from "zod";

export const FAQ = z
  .array(z.object({ pregunta: z.string(), respuesta: z.string() }))
  .min(1)
  .parse([
    {
      pregunta: "¿Desde qué edad pueden inscribirse los niños?",
      respuesta:
        "Desde los 2 años. Para los más pequeños (2 a 3 años) tenemos Iniciación en la sucursal VivirMás, cuya piscina tiene un área poco profunda especialmente segura.",
    },
    {
      pregunta: "¿Qué hay que llevar a la clase?",
      respuesta:
        "Traje de baño de natación (resistente al cloro), gorro de silicona y lentes antiniebla. Si no sabes qué modelo o talla elegir, te orientamos antes de la primera clase.",
    },
    {
      pregunta: "¿En qué consiste la evaluación inicial?",
      respuesta:
        "Viene con la inscripción. En el agua, el instructor observa la flotación, la respiración y la familiaridad con el medio. Con eso te asignamos el nivel y el carril adecuados.",
    },
    {
      pregunta: "¿Puedo cambiar de horario o recuperar una clase?",
      respuesta:
        "Sí. Si no puedes asistir, avísanos con anticipación por WhatsApp y coordinamos la reposición dentro del mismo mes, según los cupos disponibles.",
    },
    {
      pregunta: "¿Cómo se paga?",
      respuesta:
        "Por transferencia bancaria (Banreservas, Popular, BHD u otro banco), con link de pago con tarjeta de crédito o débito, o con cobro recurrente mensual.",
    },
  ]);
