import { CalendarDays, Clock, Navigation } from "lucide-react";
import { LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { SEMANA, SITE, type Sucursal } from "@/content/site";
import { CLASES_TODA_LA_SEMANA, enLetras } from "@/lib/contacto";
import { enlaceEleccion } from "@/lib/eleccion-url";

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/**
 * La zona es lo que decide (se elige por cercanía): "Santo Domingo Oeste" →
 * "Oeste"; "Sector El Millón, Distrito Nacional" → "Distrito Nacional" con el
 * sector como detalle.
 */
function zona(s: Sucursal) {
  const partes = s.zona.split(",").map((p) => p.trim());
  const principal = partes.at(-1) ?? s.zona;
  const detalle = partes.slice(0, -1).join(", ");
  const corto = principal.replace(/^Santo Domingo\s+/, "");
  return {
    grande: corto,
    pequeno: [corto !== principal ? "Santo Domingo" : null, detalle || null].filter(Boolean).join(" · "),
  };
}

/** Días en orden de la semana: "lun · vie · sáb · dom". */
const diasCortos = (dias: Sucursal["dias"]) =>
  SEMANA.filter((d) => dias.includes(d))
    .map((d) => d.slice(0, 3))
    .join(" · ");

export function Sucursales() {
  return (
    <Section tone="abismo" container="none" id="sucursales" aria-labelledby="sucursales-titulo">
      <LineaDeAgua invertida className="capa-agua -mt-px text-espuma-50" />
      <PatronCarriles />
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 md:pb-20 lg:px-8">
        <Titular
          id="sucursales-titulo"
          titulo={`${mayuscula(enLetras(SITE.sucursales.length))} sucursales, una para cada horario`}
          entradilla={`Elige la que te quede más cerca o la que encaje con tu semana.${
            CLASES_TODA_LA_SEMANA ? " Entre todas hay clases de lunes a domingo." : ""
          }`}
        />

        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SITE.sucursales.map((s, i) => {
            const z = zona(s);
            return (
              <li
                key={s.id}
                data-reveal
                data-sede={s.id}
                style={{ "--reveal-i": i } as React.CSSProperties}
                className="sede flex"
              >
                <article
                  aria-labelledby={`sucursal-${s.id}`}
                  className="sede-tarjeta flex w-full flex-col rounded-card border border-tone-line bg-marino-900/70 p-5 sm:p-6"
                >
                  <p className="font-display text-display-sm font-extrabold uppercase leading-none text-turquesa-400">
                    {z.grande}
                  </p>
                  {z.pequeno && <p className="mt-1 text-sm text-tone-muted">{z.pequeno}</p>}
                  <h3 id={`sucursal-${s.id}`} className="mt-3 flex flex-wrap items-center gap-2 text-xl font-bold">
                    Sucursal {s.nombre}
                    {s.nueva && <Etiqueta estilo="turquesa">Nueva</Etiqueta>}
                  </h3>

                  <dl className="mt-3 space-y-1.5 text-[0.95rem]">
                    <div className="flex items-start gap-2">
                      <dt>
                        <CalendarDays aria-hidden className="mt-0.5 size-4 text-turquesa-400" />
                        <span className="sr-only">Días de clase</span>
                      </dt>
                      <dd className="font-semibold">{diasCortos(s.dias)}</dd>
                    </div>
                    <div className="flex items-start gap-2">
                      <dt>
                        <Clock aria-hidden className="mt-0.5 size-4 text-turquesa-400" />
                        <span className="sr-only">Destaca por</span>
                      </dt>
                      <dd>{s.etiqueta}</dd>
                    </div>
                  </dl>
                  <p className="mt-3 text-sm text-tone-muted">
                    <span className="font-semibold text-tone-fg">Ideal para:</span> {s.idealPara}.
                    <span className="hidden sm:inline"> {s.descripcion}</span>
                  </p>
                  {s.rasgos.length > 0 && <p className="mt-2 text-sm text-tone-muted">{s.rasgos.join(" · ")}.</p>}

                  <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-4">
                    <a
                      href={enlaceEleccion({ sucursal: s.id }, "#horarios")}
                      data-elegir
                      className="inline-flex min-h-11 items-center font-bold text-turquesa-400 underline decoration-2 underline-offset-4"
                    >
                      Ver horarios<span className="sr-only"> de la sucursal {s.nombre}</span>
                    </a>
                    <BotonLink
                      href={s.mapsUrl}
                      externo
                      variante="contorno"
                      icono={<Navigation className="size-4" />}
                      className="min-h-11 px-4 py-2 text-[0.95rem]"
                      aria-label={`Cómo llegar a la Sucursal ${s.nombre} (Google Maps)`}
                    >
                      Cómo llegar
                    </BotonLink>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
      <LineaDeAgua className="capa-agua -mb-px text-white" />
    </Section>
  );
}
