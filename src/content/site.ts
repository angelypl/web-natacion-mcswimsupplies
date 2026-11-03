import { z } from "zod";

// Único lugar para teléfono, redes, sucursales y horarios de atención.
// Un dato inválido aquí rompe el build a propósito.

const dia = z.enum(["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"]);
export type Dia = z.infer<typeof dia>;
export const SEMANA: Dia[] = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

const sucursal = z.object({
  id: z.enum(["utesa", "vivirmas"]),
  nombre: z.string(),
  zona: z.string(),
  direccion: z.string(),
  piscina: z.string(),
  descripcion: z.string(),
  idealPara: z.string(),
  dias: z.array(dia).min(1),
  rasgos: z.array(z.string()).min(1),
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
  sucursales: z.array(sucursal).length(2),
});

export const SITE = site.parse({
  nombre: "MC Swim Academy",
  descripcionCorta:
    "Academia de natación en Santo Domingo para niños desde 2 años y adultos. Dos sucursales, instructores certificados y grupos por nivel.",
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
      piscina: "Piscina semiolímpica",
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
      piscina: "Iniciación y área poco profunda",
      descripcion:
        "Agua poco profunda para que los más pequeños se familiaricen sin estrés y ganen confianza desde el primer día.",
      idealPara: "Niños de 2 a 3 años y principiantes",
      dias: ["viernes", "sábado"],
      rasgos: ["Especial para estimulación temprana (2 a 3 años)", "Área cómoda de espera para familiares"],
      mapsUrl: "https://maps.app.goo.gl/8kyaetW7CPVoYDPS9",
    },
  ],
});

export type Sucursal = (typeof SITE.sucursales)[number];
