import Image from "next/image";
import { Clock } from "lucide-react";
import { ACCION_PRINCIPAL } from "@/components/layout/navegacion";
import { Corchera } from "@/components/brand/Corchera";
import { Gotas, LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { FOTOS } from "@/content/fotos";
import { slugPrograma } from "@/content/opciones";
import { CARRILES } from "@/content/programas";
import { SITE } from "@/content/site";
import { enLetras } from "@/lib/contacto";
import { enlaceEleccion } from "@/lib/eleccion-url";
import { TitularAgua } from "./TitularAgua";

// Primera pantalla: en un portátil (1366×768) entran titular, acción principal
// y "¿Quién va a nadar?"; en el celular asoma la foto bajo el selector.
export function Hero() {
  return (
    <section id="top" data-tone="abismo" className="relative overflow-hidden bg-tone-bg text-tone-fg">
      <PatronCarriles />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-12 pt-24 sm:px-6 lg:grid-cols-12 lg:items-center lg:gap-8 lg:px-8 lg:pb-14 lg:pt-28">
        <div className="flex flex-col items-start lg:col-span-7">
          <Etiqueta estilo="turquesa" className="mb-4 lg:mb-5">
            Santo Domingo, {enLetras(SITE.sucursales.length)} sucursales
          </Etiqueta>

          <TitularAgua lineas={["Aprende", "a nadar"]} />

          <p className="mt-5 max-w-xl text-lead text-tone-muted">
            Clases para niños desde los 2 años y para adultos, en grupos por nivel y con instructores
            certificados. Aquí el miedo se queda en el borde.
          </p>

          <div className="mt-6 grid w-full grid-cols-[minmax(0,1fr)_auto] gap-3 sm:flex sm:w-auto">
            <BotonLink href="#inscripcion" variante="boya" className="onda px-5">
              {ACCION_PRINCIPAL}
            </BotonLink>
            <BotonLink href="#horarios" variante="contorno" icono={<Clock className="size-5" />} className="px-5">
              Horarios
            </BotonLink>
          </div>

          {/* Atajo: quien llega sabiendo la edad elige su programa y va a su carril. */}
          <nav aria-labelledby="hero-quien" className="mt-7 w-full">
            <p id="hero-quien" className="font-bold">
              ¿Quién va a nadar?
            </p>
            <ul className="mt-2.5 grid grid-cols-3 gap-2 sm:gap-2.5">
              {CARRILES.map((carril) => (
                <li key={carril.id}>
                  <a
                    href={enlaceEleccion({ programa: slugPrograma(carril) }, `#carril-${carril.numero}`)}
                    data-elegir
                    className="group/quien flex h-full min-h-14 flex-col justify-center gap-0.5 rounded-card border border-tone-line bg-marino-900/60 px-3 py-2.5 transition-[transform,background-color,border-color] duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 hover:border-turquesa-400 hover:bg-marino-800 focus-visible:-translate-y-0.5 focus-visible:border-turquesa-400 active:scale-[0.98] sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:px-3.5"
                  >
                    <span
                      aria-hidden
                      className="hidden size-9 shrink-0 place-items-center rounded-pill bg-turquesa-400 font-display text-2xl font-extrabold tabular-nums text-marino-950 sm:grid"
                    >
                      {carril.numero}
                    </span>
                    <span className="min-w-0 leading-tight">
                      <span className="block text-[0.95rem] font-bold sm:whitespace-nowrap">{carril.edadCorta}</span>
                      <span className="block text-sm text-tone-muted">{carril.nombre}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <Gotas className="absolute -right-2 -top-10 z-10 w-24 text-turquesa-400 sm:-right-6 sm:w-28" />
          <div className="parallax [--parallax:1.75rem]">
            <div className="foto-sticker relative rotate-[2deg] rounded-blob border-[6px] border-espuma-50 bg-marino-900 shadow-hondo motion-safe:animate-[subir_1100ms_var(--ease-spring-soft)_120ms_both]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-blob)-6px)] lg:aspect-[5/6]">
                <Image
                  src={FOTOS.instructoraNino.src}
                  alt={FOTOS.instructoraNino.alt}
                  fill
                  preload
                  quality={60}
                  placeholder="blur"
                  sizes="(min-width: 1280px) 480px, (min-width: 1024px) 38vw, (min-width: 448px) 448px, 92vw"
                  className="object-cover object-[38%_45%]"
                />
              </div>
            </div>
          </div>
          <Etiqueta
            estilo="marino"
            className="absolute -bottom-4 left-4 -rotate-3 px-4 py-2 text-base shadow-flota ring-1 ring-espuma-50/20 sm:-left-6"
          >
            Clases desde los 2 años
          </Etiqueta>
        </div>
      </div>

      <Corchera animada />
      <LineaDeAgua className="capa-agua -mb-px text-espuma-50" />
    </section>
  );
}
