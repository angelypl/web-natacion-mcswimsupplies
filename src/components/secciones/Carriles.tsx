import type { CSSProperties } from "react";
import Image from "next/image";
import { Check, Clock, CreditCard, MapPin } from "lucide-react";
import { ACCION_PRINCIPAL } from "@/components/layout/navegacion";
import { Corchera, CorcheraVertical } from "@/components/brand/Corchera";
import { LineaDeAgua } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Cifra } from "@/components/ui/Cifra";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS, type Foto } from "@/content/fotos";
import { primerMes, slugPrograma } from "@/content/opciones";
import { CARRILES, INSCRIPCION } from "@/content/programas";
import { cn } from "@/lib/cn";
import { formatoPesos, textoSucursales } from "@/lib/contacto";
import { enlaceEleccion } from "@/lib/eleccion-url";

// Los programas son carriles de la piscina. En escritorio van lado a lado,
// separados por corcheras verticales, para comparar edad, precio y sucursales
// de un vistazo. En el celular se apilan, compactos, con corchera horizontal.
export function Carriles() {
  return (
    <Section tone="piscina" container="none" id="carriles" aria-labelledby="carriles-titulo">
      <LineaDeAgua invertida className="capa-agua -mt-px text-espuma-50" />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 md:pb-16 lg:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <Titular
            id="carriles-titulo"
            titulo="Elige tu carril"
            entradilla="Tres programas según la edad y el nivel. Una mensualidad fija, sin letras pequeñas."
          />
          <div
            data-tone="blanco"
            data-reveal
            className="rounded-card bg-tone-bg px-5 py-4 text-tone-fg shadow-flota lg:max-w-sm"
          >
            <p className="flex items-baseline justify-between gap-4">
              <span className="font-display text-xl font-extrabold uppercase">Inscripción única</span>
              <span className="cifra font-display text-display-sm font-extrabold tabular-nums">
                <Cifra texto={formatoPesos(INSCRIPCION.monto)} />
              </span>
            </p>
            <p className="mt-1 text-sm text-tone-muted">
              Se paga una vez, al entrar. Incluye: {INSCRIPCION.incluye.map((t) => t.toLowerCase()).join(", ")}.
            </p>
          </div>
        </div>

        <ol className="mt-8 grid grid-cols-1 lg:mt-10 lg:grid-cols-[minmax(0,1fr)_1.5rem_minmax(0,1fr)_1.5rem_minmax(0,1fr)] lg:gap-x-5">
          {CARRILES.map((carril, i) => {
            const foto: Foto = FOTOS[carril.foto];
            const slug = slugPrograma(carril);
            return (
              <li key={carril.id} className="contents">
                {i > 0 && <CorcheraVertical className="hidden lg:block" />}
                <div id={`carril-${carril.numero}`} data-carril={slug} className="carril scroll-mt-24">
                  <Corchera className={cn("lg:hidden", i === 0 && "hidden")} />
                  <article
                    aria-labelledby={`carril-${carril.id}`}
                    className="carril-tarjeta relative -mx-3 flex h-full flex-col rounded-card px-3 py-6 lg:mx-0 lg:px-0 lg:py-0"
                  >
                    <span className="eleccion-marca absolute right-3 top-6 z-10 hidden rounded-pill bg-marino-950 px-3 py-1 text-sm font-bold text-espuma-50 lg:right-2 lg:top-2">
                      Tu elección
                    </span>
                    <div className="relative" data-reveal="foto">
                      <p className="absolute -left-1 -top-3 z-10 -rotate-3 rounded-pill bg-marino-950 px-3.5 py-1 font-display text-xl font-extrabold uppercase tabular-nums text-espuma-50 shadow-flota">
                        Carril {carril.numero}
                      </p>
                      <div
                        className={cn(
                          "foto-sticker rounded-card border-[5px] border-espuma-50 bg-espuma-50 shadow-hondo transition-transform duration-(--dur-lenta) ease-spring-soft hover:rotate-0",
                          i % 2 === 0 ? "-rotate-[1.2deg]" : "rotate-[1.2deg]",
                        )}
                      >
                        <div className="relative aspect-[3/2] overflow-hidden rounded-[calc(var(--radius-card)-5px)]">
                          <Image
                            src={foto.src}
                            alt={foto.alt}
                            fill
                            quality={60}
                            placeholder="blur"
                            sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, 92vw"
                            className={cn("object-cover", foto.foco)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 flex items-start justify-between gap-4" data-reveal style={{ "--reveal-i": 1 } as CSSProperties}>
                      <div>
                        <h3 id={`carril-${carril.id}`} className="font-display text-display-md font-extrabold uppercase">
                          {carril.nombre}
                        </h3>
                        <p className="mt-0.5 font-bold">{carril.edad}</p>
                      </div>
                      <p className="shrink-0 text-right">
                        <span className="cifra block font-display text-display-sm font-extrabold tabular-nums">
                          <Cifra texto={formatoPesos(carril.mensualidad)} />
                        </span>
                        <span className="block text-sm font-bold">al mes</span>
                      </p>
                    </div>

                    <ul className="mt-3 space-y-1.5">
                      {carril.incluye.map((item) => (
                        <li key={item} className="flex items-start gap-2 font-medium">
                          <Check aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={3} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-3 flex items-start gap-2 font-semibold">
                      <MapPin aria-hidden className="mt-0.5 size-5 shrink-0" />
                      {textoSucursales(carril.sucursalIds)}
                    </p>

                    <div className="mt-auto pt-5">
                      <p data-reveal className="mb-3 flex items-baseline justify-between gap-3 border-t border-tone-line pt-3 text-sm font-bold">
                        Primer mes
                        <span className="cifra font-display text-xl font-extrabold tabular-nums">
                          <Cifra texto={formatoPesos(primerMes(carril))} />
                        </span>
                      </p>
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 lg:grid-cols-1">
                        <BotonLink
                          href={enlaceEleccion({ programa: slug }, "#inscripcion")}
                          data-elegir
                          variante="boya"
                          className="onda px-5"
                          aria-label={`${ACCION_PRINCIPAL} en ${carril.nombre}`}
                        >
                          {ACCION_PRINCIPAL}
                        </BotonLink>
                        <a
                          href={enlaceEleccion({ programa: slug }, "#horarios")}
                          data-elegir
                          className="inline-flex min-h-11 items-center justify-center gap-1.5 font-bold underline decoration-2 underline-offset-4"
                        >
                          <Clock aria-hidden className="size-4" />
                          <span>
                            Ver horarios<span className="sr-only lg:not-sr-only"> de {carril.nombre}</span>
                          </span>
                        </a>
                      </div>
                    </div>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>

        <div data-reveal className="mt-8 border-t-2 border-tone-line pt-5 lg:mt-10">
          <h3 className="flex items-center gap-2 text-lg font-bold">
            <CreditCard aria-hidden className="size-5" />
            Formas de pago
          </h3>
          <dl className="mt-2 grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-3">
            {INSCRIPCION.metodosPago.map((m) => (
              <div key={m.nombre}>
                <dt className="font-bold">{m.nombre}</dt>
                <dd className="text-[0.95rem]">{m.detalle}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <LineaDeAgua className="capa-agua -mb-px text-marino-900" />
    </Section>
  );
}
