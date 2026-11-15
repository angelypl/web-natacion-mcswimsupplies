import type { StaticImageData } from "next/image";

// Importación estática: Next calcula ancho, alto y el blur placeholder.
// Reparto (ronda 3): ninguna foto se repite en secciones contiguas.
//   Hero: instructoraNino · Por qué: equipoBorde (la misma que producción) ·
//   Carriles: coachNino, sonrisaFideo, adultos · Cómo empezar: equipo,
//   tablaCoach, alumnosBorde, clavado · Comunidad: comunidad + galería.
import clavado from "../../public/MCB08946.jpg";
import sonrisaFideo from "../../public/MCB08820.jpg";
import coachNino from "../../public/GM105963.jpg";
import equipoBorde from "../../public/GM106103.jpg";
import adultos from "../../public/91559E05-DA44-45B9-9DB4-EDBE0E1853A8.jpeg";
import tablaCoach from "../../public/Archivo_000.png";
import comunidad from "../../public/27-de-febrero.png";
import instructoraNino from "../../public/MCB07464.jpg";
import equipo from "../../public/GM106022.jpg";
import alumnosBorde from "../../public/02488C2A-AB9C-4083-8F8E-4AD95FCAA249.jpeg";

export type Foto = { src: StaticImageData; alt: string };

export const FOTOS = {
  instructoraNino: {
    src: instructoraNino,
    alt: "Instructora con gorra sosteniendo en el agua a un niño con lentes mientras aprende a flotar",
  },
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
  equipo: {
    src: equipo,
    alt: "Cuatro instructores de MC Swim de pie, sonriendo, con la camiseta blanca de la academia",
  },
  alumnosBorde: {
    src: alumnosBorde,
    alt: "Tres alumnos con lentes apoyados en el borde de la piscina, con las corcheras de los carriles detrás",
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
