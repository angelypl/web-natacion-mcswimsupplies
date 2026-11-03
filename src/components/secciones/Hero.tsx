import Image from "next/image";
import { Clock, MessageCircle, ShieldCheck, Users, Waves } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { Gotas, LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { FOTOS } from "@/content/fotos";
import { whatsappUrl } from "@/lib/contacto";
import { TitularAgua } from "./TitularAgua";

const DATOS = [
  { icono: Waves, texto: "Desde los 2 años" },
  { icono: Users, texto: "Grupos por nivel" },
  { icono: ShieldCheck, texto: "Instructores certificados" },
];

export function Hero() {
  return (
    <section id="top" data-tone="abismo" className="relative overflow-hidden bg-tone-bg text-tone-fg">
      <PatronCarriles />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 pb-14 pt-32 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pb-20 lg:pt-40">
        <div className="flex flex-col items-start lg:col-span-7">
          <Etiqueta estilo="turquesa" className="mb-6">
            Santo Domingo, sucursales Utesa y VivirMás
          </Etiqueta>

          <TitularAgua lineas={["Aprende", "a nadar"]} />

          <p className="mt-8 max-w-xl text-lead text-tone-muted">
            Clases para niños desde los 2 años y para adultos, en grupos por nivel y con instructores
            certificados. Aquí el miedo se queda en el borde.
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <BotonLink href={whatsappUrl()} externo variante="boya" icono={<MessageCircle className="size-5" />}>
              Reservar mi cupo
            </BotonLink>
            <BotonLink href="#horarios" variante="contorno" icono={<Clock className="size-5" />}>
              Ver horarios
            </BotonLink>
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-7 gap-y-3 border-t border-tone-line pt-6 text-tone-muted">
            {DATOS.map(({ icono: Icono, texto }) => (
              <li key={texto} className="flex items-center gap-2 font-semibold">
                <Icono aria-hidden className="size-5 text-turquesa-400" />
                {texto}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:max-w-none">
          <Gotas className="absolute -right-2 -top-10 z-10 w-24 text-turquesa-400 sm:-right-6 sm:w-32" />
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
