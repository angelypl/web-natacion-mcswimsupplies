import Image from "next/image";
import { MessageCircle, MoveRight } from "lucide-react";
import { ACCION_PRINCIPAL } from "@/components/layout/navegacion";
import { PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS, type Foto } from "@/content/fotos";
import { PASOS } from "@/content/pasos";
import { whatsappUrl } from "@/lib/contacto";

// Cuatro pasos, cada uno con su foto. En el celular es un carrusel con
// scroll-snap y barra de progreso; en escritorio, una fila de cuatro.
export function PrimeraClase() {
  return (
    <Section tone="marino" id="primera-clase" aria-labelledby="primera-titulo" className="overflow-clip py-16 md:py-20">
      <PatronCarriles />
      <div className="pasos relative min-w-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <Titular
            id="primera-titulo"
            titulo="Así empiezas"
            entradilla="Cuatro pasos entre tu primer mensaje y tu primera brazada. Sin papeleo ni vueltas."
          />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
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
        </div>

        <ol
          tabIndex={0}
          aria-label="Los cuatro pasos para empezar"
          className="pasos-lista sin-barra -mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-4 px-4 pb-2 sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:mt-10 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible lg:p-0">
          {PASOS.map((paso, i) => {
            const foto: Foto = FOTOS[paso.foto];
            return (
              <li
                key={paso.titulo}
                data-paso={i}
                className="flex w-[80%] max-w-sm shrink-0 snap-start flex-col lg:w-auto lg:max-w-none"
              >
                <div className="foto-agua relative aspect-[4/3] overflow-hidden rounded-t-card bg-marino-800">
                  <Image
                    src={foto.src}
                    alt={foto.alt}
                    fill
                    quality={60}
                    placeholder="blur"
                    sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 640px) 384px, 80vw"
                    className={`object-cover ${foto.foco ?? ""}`}
                  />
                </div>
                <div className="flex flex-1 flex-col pt-4">
                  <p aria-hidden className="font-display text-display-sm font-extrabold tabular-nums text-turquesa-400">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-1 font-display text-2xl font-extrabold uppercase leading-none lg:text-[1.75rem]">
                    <span className="sr-only">Paso {i + 1}: </span>
                    {paso.titulo}
                  </h3>
                  <p className="mt-2 text-tone-muted">{paso.texto}</p>
                </div>
              </li>
            );
          })}
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
    </Section>
  );
}
