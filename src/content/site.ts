import { z } from "zod";

// Único lugar para teléfono, redes, sucursales y horarios de atención.
// Un dato inválido aquí rompe el build a propósito.

const dia = z.enum(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]);
export type Dia = z.infer<typeof dia>;
export const SEMANA: Dia[] = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const sucursal = z.object({
  id: z.enum(["utesa", "vivirmas", "prado-oriental", "estadio-olimpico"]),
  nombre: z.string(),
  zona: z.string(),
  direccion: z.string(),
  /** Pastilla destacada de la tarjeta (tipo de piscina o franja de horario). */
  etiqueta: z.string(),
  /** Sede recién abierta: la tarjeta lleva la etiqueta "Nueva". */
  nueva: z.boolean().default(false),
  descripcion: z.string(),
  idealPara: z.string(),
  dias: z.array(dia).min(1),
  rasgos: z.array(z.string()),
  mapsUrl: z.url(),
});

const site = z.object({
  nombre: z.string(),
  descripcionCorta: z.string(),
  url: z.url(),
  telefono: z.object({ visible: z.string(), e164: z.string().regex(/^\+1\d{10}$/) }),
  whatsapp: z.object({ numero: z.string().regex(/^1\d{10}$/), mensajeInscripcion: z.string() }),
  instagram: z.object({ usuario: z.string(), url: z.url() }),
  ciudad: z.string(),
  pais: z.string(),
  ubicacionPrincipal: z.object({ direccion: z.string(), mapsUrl: z.url() }),
  atencion: z.string(),
  sucursales: z.array(sucursal).min(1),
});

export const SITE = site.parse({
  nombre: "MC Swim Academy",
  descripcionCorta:
    "Academia de natación en Santo Domingo para niños desde 2 años y adultos. Cuatro sucursales, instructores certificados y grupos por nivel.",
  url: "https://mcswimacademy.com",
  telefono: { visible: "(829) 883-0129", e164: "+18298830129" },
  whatsapp: {
    numero: "18298830129",
    mensajeInscripcion: "Hola MC Swim Academy, quiero inscribirme en las clases de natación.",
  },
  instagram: {
    usuario: "@mcswim_supplies",
    url: "https://www.instagram.com/mcswim_supplies?igsh=MTBud2UxeWM5YXp0NQ==",
  },
  ciudad: "Santo Domingo",
  pais: "República Dominicana",
  ubicacionPrincipal: {
    direccion: "Av. Isabel Aguiar, Santo Domingo 21243",
    mapsUrl: "https://maps.app.goo.gl/xNzEYNQbVzkTGh3J9?g_st=ic",
  },
  atencion: "Lunes a sábado",
  sucursales: [
    {
      id: "utesa",
      nombre: "Utesa",
      zona: "Santo Domingo Oeste",
      direccion: "UTESA, Av. Isabel Aguiar, Santo Domingo Oeste",
      etiqueta: "Piscina semiolímpica",
      descripcion:
        "Carriles delimitados para trabajar técnica, estilos y resistencia. Es la piscina para crecer en el agua.",
      idealPara: "Niños desde 4 años, jóvenes y adultos",
      dias: ["lunes", "viernes", "sábado", "domingo"],
      rasgos: ["Carriles delimitados y control de profundidad", "Parqueo seguro y gradas para padres"],
      mapsUrl: "https://maps.app.goo.gl/4wHR9aS9CTaBgDpg7",
    },
    {
      id: "vivirmas",
      nombre: "VivirMás",
      zona: "Sector El Millón, Distrito Nacional",
      direccion: "VivirMás, Sector El Millón, Santo Domingo",
      etiqueta: "Iniciación y área poco profunda",
      descripcion:
        "Agua poco profunda para que los más pequeños se familiaricen sin estrés y ganen confianza desde el primer día.",
      idealPara: "Niños de 2 a 3 años y principiantes",
      dias: ["viernes", "sábado"],
      rasgos: ["Especial para estimulación temprana (2 a 3 años)", "Área cómoda de espera para familiares"],
      mapsUrl: "https://maps.app.goo.gl/8kyaetW7CPVoYDPS9",
    },
    // TODO_CLIENTE: dirección exacta y enlace de Google Maps de las dos sedes
    // nuevas. Por ahora el enlace busca el sector o el recinto.
    {
      id: "prado-oriental",
      nombre: "Prado Oriental",
      zona: "Santo Domingo Este",
      direccion: "Prado Oriental, Santo Domingo Este",
      etiqueta: "Sábados por la mañana",
      nueva: true,
      descripcion:
        "Clases los sábados temprano: adultos a las 7:00 a. m. y niños desde 4 años a las 8:00 a. m. Ideal para empezar el fin de semana en el agua.",
      idealPara: "Niños desde 4 años y adultos",
      dias: ["sábado"],
      rasgos: [],
      mapsUrl: "https://www.google.com/maps/search/?api=1&query=Prado%20Oriental%2C%20Santo%20Domingo%20Este",
    },
    {
      id: "estadio-olimpico",
      nombre: "Estadio Olímpico",
      zona: "Centro Olímpico Juan Pablo Duarte, Distrito Nacional",
      direccion: "Estadio Olímpico, Centro Olímpico Juan Pablo Duarte, Santo Domingo",
      etiqueta: "Martes a jueves por la noche",
      nueva: true,
      descripcion:
        "Clases para adultos de martes a jueves, de 8:00 a 9:00 p. m. Para entrenar después del trabajo sin cambiar tu rutina.",
      idealPara: "Jóvenes y adultos",
      dias: ["martes", "miércoles", "jueves"],
      rasgos: [],
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Centro%20Ol%C3%ADmpico%20Juan%20Pablo%20Duarte%2C%20Santo%20Domingo",
    },
  ],
});

export type Sucursal = (typeof SITE.sucursales)[number];
