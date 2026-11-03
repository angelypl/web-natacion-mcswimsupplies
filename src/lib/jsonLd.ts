import { FAQ } from "@/content/faq";
import { SITE } from "@/content/site";

const DIAS_SCHEMA: Record<string, string> = {
  lunes: "Monday",
  martes: "Tuesday",
  miércoles: "Wednesday",
  jueves: "Thursday",
  viernes: "Friday",
  sábado: "Saturday",
  domingo: "Sunday",
};

export function jsonLdInicio() {
  const organizacion = {
    "@type": "SportsOrganization",
    "@id": `${SITE.url}/#organizacion`,
    name: SITE.nombre,
    url: SITE.url,
    logo: `${SITE.url}/logo-mc-swim-academy-recorte.jpg`,
    telephone: SITE.telefono.e164,
    sport: "Natación",
    sameAs: [SITE.instagram.url],
  };

  const sucursales = SITE.sucursales.map((s) => ({
    "@type": "SportsActivityLocation",
    "@id": `${SITE.url}/#sucursal-${s.id}`,
    name: `${SITE.nombre}, sucursal ${s.nombre}`,
    parentOrganization: { "@id": organizacion["@id"] },
    telephone: SITE.telefono.e164,
    hasMap: s.mapsUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.direccion,
      addressLocality: SITE.ciudad,
      addressCountry: "DO",
    },
    // TODO_CLIENTE: horas de apertura de cada sucursal; por ahora solo los días.
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: s.dias.map((d) => DIAS_SCHEMA[d]),
    },
  }));

  const preguntas = {
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.pregunta,
      acceptedAnswer: { "@type": "Answer", text: f.respuesta },
    })),
  };

  return { "@context": "https://schema.org", "@graph": [organizacion, ...sucursales, preguntas] };
}

/** JSON-LD seguro para <script>: escapa `<` como recomienda la guía de Next. */
export function serializar(datos: unknown) {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}
