import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { CARRILES } from "@/content/programas";
import { SITE } from "@/content/site";
import { TEL_URL, formatoPesos, whatsappUrl } from "@/lib/contacto";
import FormularioInscripcion from "./FormularioInscripcion";

export function Inscripcion() {
  const programas = CARRILES.map((c) => ({
    id: c.id,
    nombre: c.nombre,
    edad: c.edadCorta,
    precio: formatoPesos(c.mensualidad),
    sucursalIds: c.sucursalIds,
  }));
  const sucursales = SITE.sucursales.map((s) => ({ id: s.id, nombre: s.nombre, zona: s.zona }));

  const contacto = [
    { href: whatsappUrl(), externo: true, icono: MessageCircle, etiqueta: "WhatsApp", valor: SITE.telefono.visible },
    { href: TEL_URL, externo: false, icono: Phone, etiqueta: "Llamada", valor: SITE.telefono.visible },
    { href: SITE.instagram.url, externo: true, icono: InstagramIcono, etiqueta: "Instagram", valor: SITE.instagram.usuario },
  ];

  return (
    <Section tone="marino" id="inscripcion" aria-labelledby="inscripcion-titulo" className="py-20 md:py-28">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Titular
            id="inscripcion-titulo"
            titulo="Reserva tu cupo"
            entradilla={`Marca tus opciones y se abre WhatsApp con el mensaje listo para enviar. Toma menos de un minuto y te respondemos de ${SITE.atencion.toLowerCase()}.`}
          />

          <ul className="mt-10 divide-y divide-tone-line border-y border-tone-line">
            {contacto.map(({ href, externo, icono: Icono, etiqueta, valor }) => (
              <li key={etiqueta}>
                <a
                  href={href}
                  {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group/contacto flex min-h-16 items-center gap-4 py-3"
                >
                  <span className="grid size-11 place-items-center rounded-pill bg-turquesa-400 text-marino-950 transition-transform duration-(--dur-base) ease-spring-soft group-hover/contacto:-rotate-12 group-hover/contacto:scale-110">
                    <Icono aria-hidden className="size-5" />
                  </span>
                  <span>
                    <span className="block text-sm text-tone-muted">{etiqueta}</span>
                    <span className="block text-lg font-bold">{valor}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-tone="blanco" data-reveal className="rounded-blob bg-tone-bg p-6 text-tone-fg shadow-hondo sm:p-10 lg:col-span-7">
          <FormularioInscripcion
            programas={programas}
            sucursales={sucursales}
            programaInicial={CARRILES[1].id}
            whatsapp={SITE.whatsapp.numero}
          />
        </div>
      </div>
    </Section>
  );
}
