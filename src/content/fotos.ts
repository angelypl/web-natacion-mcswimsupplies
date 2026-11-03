import type { StaticImageData } from "next/image";

// Importación estática: Next calcula ancho, alto y el blur placeholder.
import clavado from "../../public/MCB08946.jpg";
import sonrisaFideo from "../../public/MCB08820.jpg";
import coachNino from "../../public/GM105963.jpg";
import instructoras from "../../public/MCB07464.jpg";
import equipoBorde from "../../public/GM106103.jpg";
import equipo from "../../public/GM106022.jpg";
import adultos from "../../public/91559E05-DA44-45B9-9DB4-EDBE0E1853A8.jpeg";
import carrilCoach from "../../public/02488C2A-AB9C-4083-8F8E-4AD95FCAA249.jpeg";
import tablaCoach from "../../public/clase-tabla-coach.jpg";
import comunidad from "../../public/comunidad-utesa.jpg";

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
  instructoras: {
    src: instructoras,
    alt: "Instructora sosteniendo a un niño pequeño mientras aprende a patalear",
  },
  equipoBorde: {
    src: equipoBorde,
    alt: "Dos instructores de MC Swim sonriendo en el borde de la piscina con tablas y fideos",
  },
  equipo: {
    src: equipo,
    alt: "Equipo de cuatro instructores de MC Swim con camisetas de la marca",
  },
  adultos: {
    src: adultos,
    alt: "Dos alumnos adultos riéndose dentro de la piscina durante la clase",
  },
  carrilCoach: {
    src: carrilCoach,
    alt: "Instructor explicando la técnica a dos alumnos en el borde de un carril",
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
