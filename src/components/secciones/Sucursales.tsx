import { Check, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { SEMANA, SITE, type Sucursal } from "@/content/site";
import { cn } from "@/lib/cn";
import { enlaceEleccion } from "@/lib/eleccion-url";
import { CLASES_TODA_LA_SEMANA, TEL_URL, enLetras, listaNatural, whatsappUrl } from "@/lib/contacto";

/** Tira de la semana con los días de clase marcados. La lista accesible va aparte. */
function Semana({ dias }: { dias: Sucursal["dias"] }) {
  return (
    <>
      <p className="sr-only">Días de clase: {listaNatural(dias)}.</p>
      <ol aria-hidden className="grid grid-cols-7 gap-1.5">
        {SEMANA.map((dia) => {
          const activo = dias.includes(dia);
          return (
            <li
              key={dia}
              className={cn(
                "flex aspect-square flex-col items-center justify-center rounded-xl font-display text-xl font-extrabold uppercase sm:text-2xl",
                activo ? "bg-turquesa-400 text-marino-950" : "border border-tone-line text-tone-muted",
              )}
            >
              {dia.slice(0, 1)}
              {activo && <Check className="size-3.5" strokeWidth={4} />}
            </li>
          );
        })}
      </ol>
    </>
  );
}

export function Sucursales() {
  return (
    <Section tone="abismo" container="none" id="sucursales" aria-labelledby="sucursales-titulo">
      <LineaDeAgua invertida className="-mt-px text-espuma-50" />
      <PatronCarriles />
      <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pb-28 lg:px-8">
        <Titular
          id="sucursales-titulo"
          titulo={`${enLetras(SITE.sucursales.length)} sucursales, una para cada horario`}
          entradilla={`Elige la que te quede más cerca o la que encaje con tu semana.${
            CLASES_TODA_LA_SEMANA ? " Entre todas hay clases de lunes a domingo en Santo Domingo." : ""
          }`}
        />

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SITE.sucursales.map((s, i) => (
            <article
              key={s.id}
              data-reveal
              style={{ "--reveal-i": i } as React.CSSProperties}
              aria-labelledby={`sucursal-${s.id}`}
              className="flex flex-col rounded-blob border border-tone-line bg-marino-900/70 p-7 sm:p-10"
            >
              <div className="flex flex-wrap gap-2">
                <Etiqueta estilo="turquesa">{s.etiqueta}</Etiqueta>
                {s.nueva && <Etiqueta estilo="boya">Nueva</Etiqueta>}
              </div>
              <h3 id={`sucursal-${s.id}`} className="mt-5 font-display text-display-md font-extrabold uppercase">
                Sucursal {s.nombre}
              </h3>
              <p className="mt-1 font-semibold text-tone-muted">{s.zona}</p>
              <p className="mt-5">{s.descripcion}</p>
              <p className="mt-2 text-tone-muted">
                <span className="font-semibold text-tone-fg">Ideal para:</span> {s.idealPara}.
              </p>

              <div className="mt-7">
                <p className="mb-3 text-sm font-bold text-tone-muted">Días de clase</p>
                <Semana dias={s.dias} />
              </div>

              <ul className="mt-7 space-y-2 text-tone-muted">
                {s.rasgos.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-turquesa-400" strokeWidth={3} />
                    {r}
                  </li>
                ))}
                <li className="flex items-start gap-2.5">
                  <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-turquesa-400" />
                  {s.direccion}
                </li>
              </ul>

              <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-8">
                <a
                  href={enlaceEleccion({ sucursal: s.id }, "#horarios")}
                  data-elegir
                  className="inline-flex min-h-11 items-center font-bold text-turquesa-400 underline decoration-2 underline-offset-4"
                >
                  Ver horarios de esta sucursal
                </a>
                <BotonLink
                  href={s.mapsUrl}
                  externo
                  variante="contorno"
                  icono={<Navigation className="size-5" />}
                  className="w-full sm:w-auto"
                  aria-label={`Cómo llegar a la Sucursal ${s.nombre} (Google Maps)`}
                >
                  Cómo llegar
                </BotonLink>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 border-t border-tone-line pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <p className="text-lead text-tone-muted">
            Punto principal:{" "}
            <a
              href={SITE.ubicacionPrincipal.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-tone-fg underline decoration-turquesa-400 decoration-2 underline-offset-4 hover:decoration-boya-400"
            >
              {SITE.ubicacionPrincipal.direccion}
            </a>
          </p>
          <div className="flex flex-wrap gap-3">
            <BotonLink href={whatsappUrl()} externo variante="whatsapp" icono={<MessageCircle className="size-5" />}>
              WhatsApp
            </BotonLink>
            <BotonLink href={TEL_URL} variante="contorno" icono={<Phone className="size-5" />}>
              {SITE.telefono.visible}
            </BotonLink>
            <BotonLink
              href={SITE.instagram.url}
              externo
              variante="contorno"
              icono={<InstagramIcono className="size-5" />}
              aria-label={`Instagram ${SITE.instagram.usuario}`}
            >
              Instagram
            </BotonLink>
          </div>
        </div>
      </div>
      <LineaDeAgua className="-mb-px text-white" />
    </Section>
  );
}
