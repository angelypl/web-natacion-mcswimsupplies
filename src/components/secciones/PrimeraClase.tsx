import Image from "next/image";
import { MessageCircle, MoveRight } from "lucide-react";
import { PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { PASOS } from "@/content/pasos";
import { ACCION_PRINCIPAL } from "@/components/layout/navegacion";
import { whatsappUrl } from "@/lib/contacto";
import FotosPasos from "./FotosPasos";

// Historia con scroll: en escritorio la foto queda fija a la izquierda y
// cambia con el paso que estás leyendo. En móvil los pasos son tarjetas que se
// deslizan de lado (scroll-snap nativo), con una barra de progreso.
export function PrimeraClase() {
  const fotos = PASOS.map((p) => FOTOS[p.foto]);

  return (
    <Section tone="marino" id="primera-clase" aria-labelledby="primera-titulo" className="overflow-clip py-20 md:py-28">
      <PatronCarriles />
      <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="hidden lg:col-span-5 lg:block">
          <div className="sticky top-28">
            <FotosPasos fotos={fotos} />
          </div>
        </div>

        <div className="pasos min-w-0 lg:col-span-7">
          <Titular
            id="primera-titulo"
            titulo="Así empiezas"
            entradilla="Cuatro pasos entre tu primer mensaje y tu primera brazada. Sin papeleo ni vueltas."
          />

          <ol className="pasos-lista sin-barra -mx-4 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:mt-12 lg:block lg:overflow-visible lg:p-0">
            {PASOS.map((paso, i) => (
              <li
                key={paso.titulo}
                data-paso={i}
                className="paso-foco flex w-[84%] max-w-sm shrink-0 snap-start flex-col rounded-card border border-tone-line bg-marino-800/70 p-5 lg:w-auto lg:max-w-none lg:min-h-[62vh] lg:justify-center lg:rounded-none lg:border-x-0 lg:border-b-0 lg:bg-transparent lg:px-0 lg:py-16"
              >
                <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)] lg:hidden">
                  <Image
                    src={fotos[i].src}
                    alt={fotos[i].alt}
                    fill
                    quality={60}
                    placeholder="blur"
                    sizes="(min-width: 640px) 384px, 84vw"
                    className="object-cover"
                  />
                </div>

                <p
                  aria-hidden
                  className="font-display text-display-md font-extrabold tabular-nums text-turquesa-400 lg:text-display-lg"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 font-display text-display-sm font-extrabold uppercase lg:mt-2 lg:text-display-md">
                  <span className="sr-only">Paso {i + 1}: </span>
                  {paso.titulo}
                </h3>
                <p className="mt-3 max-w-xl text-tone-muted lg:mt-4 lg:text-lead">{paso.texto}</p>

                {i === 0 && (
                  <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mt-8">
                    <BotonLink href="#inscripcion" variante="boya" className="onda">
                      {ACCION_PRINCIPAL}
                    </BotonLink>
                    <a
                      href={whatsappUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/wa inline-flex min-h-11 items-center gap-2 font-semibold"
                    >
                      <span className="grid size-8 place-items-center rounded-full bg-whatsapp text-marino-950 transition-transform duration-(--dur-base) ease-spring-soft group-hover/wa:-rotate-12">
                        <MessageCircle aria-hidden className="size-4" />
                      </span>
                      o escríbenos por WhatsApp
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-5 flex items-center gap-4 lg:hidden">
            <div aria-hidden className="pasos-progreso h-1 flex-1 overflow-hidden rounded-pill bg-tone-fg/15">
              <span className="block h-full rounded-pill bg-turquesa-400" />
            </div>
            <p className="flex items-center gap-2 text-sm font-semibold text-tone-muted">
              Desliza para ver los 4 pasos
              <MoveRight aria-hidden className="size-4 text-turquesa-400" />
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}
