import type { StaticImageData } from "next/image";

// Importación estática: Next calcula ancho, alto y el blur placeholder.
// Solo fotos que también usa la web en producción (mcswimacademy.com).
import clavado from "../../public/MCB08946.jpg";
import sonrisaFideo from "../../public/MCB08820.jpg";
import coachNino from "../../public/GM105963.jpg";
import equipoBorde from "../../public/GM106103.jpg";
import adultos from "../../public/91559E05-DA44-45B9-9DB4-EDBE0E1853A8.jpeg";
import tablaCoach from "../../public/Archivo_000.png";
import comunidad from "../../public/27-de-febrero.png";

export type Foto = { src: StaticImageData; alt: string };

export const FOTOS = {
  clavado: {
    src: clavado,
    alt: "Alumno lanzándose de clavado en un carril de la piscina semiolímpica, con otros nadadores al fondo",
  },
  sonrisaFideo: {
    src: sonrisaFideo,
    alt: "Niña sonriendo en el borde de la piscina con gorro, lentes y un fideo amarillo",
  },
  coachNino: {
    src: coachNino,
    alt: "Niño con lentes nadando hacia el Coach Franklin en el agua",
  },
  equipoBorde: {
    src: equipoBorde,
    alt: "Dos instructores de MC Swim sonriendo en el borde de la piscina con tablas y fideos",
  },
  adultos: {
    src: adultos,
    alt: "Dos alumnos adultos riéndose dentro de la piscina durante la clase",
  },
  tablaCoach: {
    src: tablaCoach,
    alt: "Instructor guiando a una alumna que patalea agarrada a una tabla de colores",
  },
  comunidad: {
    src: comunidad,
    alt: "Grupo de alumnos de todas las edades sentados en el borde de la piscina con tres instructores de pie detrás",
  },
} satisfies Record<string, Foto>;
