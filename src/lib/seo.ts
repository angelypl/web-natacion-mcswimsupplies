import type { Metadata } from "next";
import { SITE } from "@/content/site";

export const metadataBase: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "MC Swim Academy | Clases de natación en Santo Domingo",
    template: "%s | MC Swim Academy",
  },
  description: SITE.descripcionCorta,
  keywords: [
    "clases de natacion santo domingo",
    "academia de natacion republica dominicana",
    "natacion para ninos",
    "natacion adultos",
    "mc swim academy",
    "piscina semiolimpica utesa",
    "vivirmas natacion",
    "natacion prado oriental",
    "natacion estadio olimpico",
  ],
  authors: [{ name: SITE.nombre }],
  openGraph: {
    title: "MC Swim Academy | Academia de natación en Santo Domingo",
    description:
      "Aprende a nadar con instructores certificados en Santo Domingo. Clases para todas las edades en cuatro sucursales.",
    locale: "es_DO",
    type: "website",
    siteName: SITE.nombre,
  },
  icons: {
    icon: "/logo-mc-swim-academy-recorte.jpg",
    apple: "/logo-mc-swim-academy-recorte.jpg",
  },
};

/** Metadata de una página interna, heredando la base. */
export function crearMetadata({
  titulo,
  descripcion,
  ruta,
  indexar = true,
}: {
  titulo: string;
  descripcion: string;
  ruta: string;
  indexar?: boolean;
}): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    robots: indexar ? undefined : { index: false, follow: false },
  };
}
