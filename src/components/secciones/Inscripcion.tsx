import { MessageCircle, Phone } from "lucide-react";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { primerMes, slugPrograma } from "@/content/opciones";
import { PASOS } from "@/content/pasos";
import { CARRILES, INSCRIPCION } from "@/content/programas";
import { SITE } from "@/content/site";
import { cn } from "@/lib/cn";
import { TEL_URL, formatoPesos, whatsappUrl } from "@/lib/contacto";
import FormularioInscripcion from "./FormularioInscripcion";

export function Inscripcion() {
  const programas = CARRILES.map((c) => ({
    id: slugPrograma(c),
    nombre: c.nombre,
    edad: c.edadCorta,
    precio: formatoPesos(c.mensualidad),
    primerMes: formatoPesos(primerMes(c)),
    sucursalIds: c.sucursalIds,
  }));
  const sucursales = SITE.sucursales.map((s) => ({ id: s.id, nombre: s.nombre, zona: s.zona }));
  // Después de enviar: los pasos que siguen al primero ("Nos escribes").
  const despues = PASOS.slice(1);

  const contacto = [
    { href: whatsappUrl(), externo: true, icono: MessageCircle, etiqueta: "WhatsApp", valor: SITE.telefono.visible, wa: true },
    { href: TEL_URL, externo: false, icono: Phone, etiqueta: "Llamada", valor: SITE.telefono.visible, wa: false },
    {
      href: SITE.instagram.url,
      externo: true,
      icono: InstagramIcono,
      etiqueta: "Instagram",
      valor: SITE.instagram.usuario,
      wa: false,
    },
  ];

  return (
    <Section tone="marino" id="inscripcion" aria-labelledby="inscripcion-titulo" className="py-16 md:py-24">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <Titular
              id="inscripcion-titulo"
              titulo="Reserva tu cupo"
              entradilla={`Marca tus opciones y se abre WhatsApp con el mensaje listo. Te respondemos de ${SITE.atencion.toLowerCase()}.`}
            />

            <div className="mt-10 hidden lg:block">
              <p className="font-display text-xl font-extrabold uppercase text-turquesa-400">Después de enviar</p>
              <ol className="mt-4 space-y-4">
                {despues.map((paso, i) => (
                  <li key={paso.titulo} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-3">
                    <span
                      aria-hidden
                      className="font-display text-3xl font-extrabold leading-none tabular-nums text-turquesa-400"
                    >
                      {String(i + 2).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-bold">{paso.titulo}</p>
                      <p className="text-sm text-tone-muted">{paso.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <ul className="mt-8 grid grid-cols-1 divide-y divide-tone-line border-y border-tone-line sm:grid-cols-3 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y">
              {contacto.map(({ href, externo, icono: Icono, etiqueta, valor, wa }) => (
                <li key={etiqueta}>
                  <a
                    href={href}
                    {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group/contacto flex min-h-14 items-center gap-3 py-2.5 sm:px-3 lg:px-0"
                  >
                    <span
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-pill text-marino-950 transition-transform duration-(--dur-base) ease-spring-soft group-hover/contacto:-rotate-12 group-hover/contacto:scale-110",
                        wa ? "bg-whatsapp" : "bg-espuma-50",
                      )}
                    >
                      <Icono aria-hidden className="size-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm text-tone-muted">{etiqueta}</span>
                      <span className="block truncate font-bold">{valor}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          data-tone="blanco"
          data-reveal
          className="rounded-blob bg-tone-bg p-5 text-tone-fg shadow-hondo sm:p-9 lg:col-span-7"
        >
          <FormularioInscripcion
            programas={programas}
            sucursales={sucursales}
            programaInicial={slugPrograma(CARRILES[1])}
            inscripcion={formatoPesos(INSCRIPCION.monto)}
            whatsapp={SITE.whatsapp.numero}
          />
        </div>
      </div>
    </Section>
  );
}
