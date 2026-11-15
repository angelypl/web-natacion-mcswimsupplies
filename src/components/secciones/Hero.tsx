import Image from "next/image";
import { ArrowDown, Clock, MessageCircle } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { Gotas, LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { FOTOS } from "@/content/fotos";
import { CARRILES } from "@/content/programas";
import { SITE } from "@/content/site";
import { enLetras, whatsappUrl } from "@/lib/contacto";
import { TitularAgua } from "./TitularAgua";


export function Hero() {
  return (
    <section id="top" data-tone="abismo" className="relative overflow-hidden bg-tone-bg text-tone-fg">
      <PatronCarriles />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-16 lg:pt-32">
        <div className="flex flex-col items-start lg:col-span-7">
          <Etiqueta estilo="turquesa" className="mb-6">
            Santo Domingo, {enLetras(SITE.sucursales.length)} sucursales
          </Etiqueta>

          <TitularAgua lineas={["Aprende", "a nadar"]} />

          <p className="mt-6 max-w-xl text-lead text-tone-muted lg:mt-7">
            Clases para niños desde los 2 años y para adultos, en grupos por nivel y con instructores
            certificados. Aquí el miedo se queda en el borde.
          </p>

          <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <BotonLink href={whatsappUrl()} externo variante="boya" icono={<MessageCircle className="size-5" />}>
              Reservar mi cupo
            </BotonLink>
            <BotonLink href="#horarios" variante="contorno" icono={<Clock className="size-5" />}>
              Ver horarios
            </BotonLink>
          </div>

          {/* Atajo: quien llega sabiendo la edad va directo a su carril. */}
          <nav aria-labelledby="hero-quien" className="mt-8 w-full border-t border-tone-line pt-5">
            <p id="hero-quien" className="font-bold">
              ¿Quién va a nadar?
            </p>
            <ul className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
              {CARRILES.map((carril) => (
                <li key={carril.id}>
                  <a
                    href={`#carril-${carril.numero}`}
                    className="group/quien flex min-h-14 items-center gap-3 rounded-card border border-tone-line bg-marino-900/60 px-3.5 py-3 transition-[transform,background-color,border-color] duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 hover:border-turquesa-400 hover:bg-marino-800 focus-visible:-translate-y-0.5 focus-visible:border-turquesa-400 active:scale-[0.98]"
                  >
                    <span
                      aria-hidden
                      className="grid size-9 shrink-0 place-items-center rounded-pill bg-turquesa-400 font-display text-2xl font-extrabold tabular-nums text-marino-950"
                    >
                      {carril.numero}
                    </span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block font-bold sm:whitespace-nowrap sm:text-[0.95rem]">{carril.edadCorta}</span>
                      <span className="block text-sm text-tone-muted">{carril.nombre}</span>
                    </span>
                    <ArrowDown
                      aria-hidden
                      className="size-4 shrink-0 text-turquesa-400 transition-transform sm:hidden duration-(--dur-base) ease-spring-soft group-hover/quien:translate-y-1"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <Gotas className="absolute -right-2 -top-10 z-10 w-24 text-turquesa-400 sm:-right-6 sm:w-32" />
          <div className="parallax [--parallax:1.75rem]">
          <div className="relative rotate-[2deg] rounded-blob border-[6px] border-espuma-50 bg-marino-900 shadow-hondo motion-safe:animate-[subir_1100ms_var(--ease-spring-soft)_120ms_both]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-blob)-6px)]">
              <Image
                src={FOTOS.clavado.src}
                alt={FOTOS.clavado.alt}
                fill
                preload
                quality={60}
                placeholder="blur"
                sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, (min-width: 448px) 448px, 92vw"
                className="object-cover object-[50%_60%]"
              />
            </div>
          </div>
          </div>
          <Etiqueta
            estilo="boya"
            className="absolute -bottom-4 left-4 -rotate-3 px-4 py-2 text-base shadow-flota sm:-left-6"
          >
            Piscina semiolímpica en Utesa
          </Etiqueta>
        </div>
      </div>

      <Corchera animada />
      <LineaDeAgua className="-mb-px text-espuma-50" />
    </section>
  );
}
