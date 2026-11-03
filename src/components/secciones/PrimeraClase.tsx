import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { PASOS } from "@/content/pasos";
import { whatsappUrl } from "@/lib/contacto";
import FotosPasos from "./FotosPasos";

// Historia con scroll: en escritorio la foto queda fija a la izquierda y
// cambia con el paso que estás leyendo; en móvil cada paso lleva su foto.
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

        <div className="lg:col-span-7">
          <Titular
            id="primera-titulo"
            titulo="Así empiezas"
            entradilla="Cuatro pasos entre tu primer mensaje y tu primera brazada. Sin papeleo ni vueltas."
          />

          <ol className="mt-12">
            {PASOS.map((paso, i) => (
              <li
                key={paso.titulo}
                data-paso={i}
                className="border-t border-tone-line py-10 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:py-16"
              >
                <p
                  aria-hidden
                  className="font-display text-display-lg font-extrabold tabular-nums text-turquesa-400"
                >
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-display-md font-extrabold uppercase">
                  <span className="sr-only">Paso {i + 1}: </span>
                  {paso.titulo}
                </h3>
                <p className="mt-4 max-w-xl text-lead text-tone-muted">{paso.texto}</p>

                <div className="mt-7 rounded-card border-[5px] border-espuma-50 bg-espuma-50 shadow-hondo lg:hidden">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-5px)]">
                    <Image
                      src={fotos[i].src}
                      alt={fotos[i].alt}
                      fill
                      quality={60}
                      placeholder="blur"
                      sizes="92vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                {i === 0 && (
                  <BotonLink
                    href={whatsappUrl()}
                    externo
                    variante="boya"
                    icono={<MessageCircle className="size-5" />}
                    className="mt-8 self-start"
                  >
                    Escribir por WhatsApp
                  </BotonLink>
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
