import { z } from "zod";

const carril = z.object({
  numero: z.number().int().positive(),
  id: z.enum(["nino-2-3", "nino-4-mas", "adultos"]),
  nombre: z.string(),
  edad: z.string(),
  mensualidad: z.number().int().positive(),
  descripcion: z.string(),
  incluye: z.array(z.string()).min(2).max(5),
  sucursales: z.string(),
  foto: z.enum(["instructoras", "sonrisaFideo", "adultos"]),
  mensajeWhatsapp: z.string(),
});

export const CARRILES = z.array(carril).length(3).parse([
  {
    numero: 1,
    id: "nino-2-3",
    nombre: "Iniciación",
    edad: "Niños de 2 a 3 años",
    mensualidad: 3000,
    descripcion:
      "Acompañamiento cercano y lúdico para que los más pequeños se sientan seguros en el agua desde el primer día.",
    incluye: [
      "Grupos muy reducidos y supervisión continua",
      "Estimulación acuática temprana",
      "Piscina con área poco profunda",
    ],
    sucursales: "VivirMás",
    foto: "instructoras",
    mensajeWhatsapp:
      "Hola MC Swim Academy, me interesa inscribir a mi hijo/a en Iniciación (2 a 3 años, RD$3,000/mes).",
  },
  {
    numero: 2,
    id: "nino-4-mas",
    nombre: "Formación",
    edad: "Niños de 4 años en adelante",
    mensualidad: 2500,
    descripcion:
      "Clases por niveles para perfeccionar brazada, patada, respiración y resistencia, con un progreso que se nota.",
    incluye: [
      "Enseñanza progresiva de estilos",
      "Flotación y técnicas de autoprotección",
      "Motivación y seguimiento del instructor",
    ],
    sucursales: "Utesa y VivirMás",
    foto: "sonrisaFideo",
    mensajeWhatsapp:
      "Hola MC Swim Academy, me interesa inscribir a mi hijo/a en Formación (4+ años, RD$2,500/mes).",
  },
  {
    numero: 3,
    id: "adultos",
    nombre: "Adultos",
    edad: "Jóvenes y adultos, todos los niveles",
    mensualidad: 2500,
    descripcion:
      "Aprende desde cero sin pena o entrena en carril semiolímpico para mejorar tu técnica y liberar estrés.",
    incluye: [
      "De principiante absoluto a estilo libre",
      "Entrenamiento cardiovascular de bajo impacto",
      "Horarios de mañana y de tarde",
    ],
    sucursales: "Utesa",
    foto: "adultos",
    mensajeWhatsapp:
      "Hola MC Swim Academy, quiero inscribirme en las clases para Adultos (RD$2,500/mes).",
  },
]);

export const INSCRIPCION = z
  .object({
    monto: z.number().int().positive(),
    incluye: z.array(z.string()),
    metodosPago: z.array(z.object({ nombre: z.string(), detalle: z.string() })),
  })
  .parse({
    monto: 1000,
    incluye: [
      "Evaluación inicial en el agua",
      "Asignación de grupo, carril y horario",
      "Acceso a ambas sucursales",
    ],
    metodosPago: [
      {
        nombre: "Transferencia",
        detalle: "Banreservas, Popular, BHD o tu banco. Envías el comprobante por WhatsApp.",
      },
      { nombre: "Link de pago", detalle: "Con tarjeta Visa o Mastercard desde tu celular." },
      { nombre: "Pago recurrente", detalle: "El cobro mensual se hace solo y tu cupo queda asegurado." },
    ],
  });

export type Carril = (typeof CARRILES)[number];
