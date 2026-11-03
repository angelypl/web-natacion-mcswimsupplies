import Image from "next/image";
import { Award, MapPin, ShieldCheck, Users } from "lucide-react";
import { Gotas } from "@/components/brand/LineaDeAgua";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";

const RAZONES = [
  {
    icono: ShieldCheck,
    titulo: "Seguridad primero",
    texto: "Protocolos claros y supervisión en cada sesión, para aprender con confianza.",
  },
  {
    icono: Users,
    titulo: "Grupos por nivel",
    texto: "Por edad, destreza y ritmo. Quien empieza no comparte carril con quien ya domina los estilos.",
  },
  {
    icono: Award,
    titulo: "Instructores certificados",
    texto: "Formados en salvamento acuático, primeros auxilios y enseñanza progresiva.",
  },
  {
    icono: MapPin,
    titulo: "Dos sucursales",
    texto: "Utesa, con piscina semiolímpica, y VivirMás, con área poco profunda para los más chicos.",
  },
];

export function PorQue() {
  return (
    <Section tone="espuma" aria-labelledby="porque-titulo" className="py-20 md:py-28">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="relative order-2 mx-auto w-full max-w-lg lg:order-1 lg:col-span-5">
          <div className="parallax relative rounded-blob border-[6px] border-white bg-white shadow-hondo [--giro:-2.5deg] [--parallax:1.5rem]">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[calc(var(--radius-blob)-6px)]">
              <Image
                src={FOTOS.equipo.src}
                alt={FOTOS.equipo.alt}
                fill
                quality={60}
                placeholder="blur"
                sizes="(min-width: 1024px) 40vw, (min-width: 512px) 512px, 92vw"
                className="object-cover"
              />
            </div>
          </div>
          <Etiqueta estilo="marino" className="absolute -bottom-5 right-6 rotate-2 px-4 py-2 text-base shadow-flota">
            El equipo MC Swim
          </Etiqueta>
          <Gotas className="absolute -left-4 -top-12 w-24 text-piscina-500/80" />
        </div>

        <div className="order-1 lg:order-2 lg:col-span-7">
          <Titular
            id="porque-titulo"
            titulo="Aquí nadie se queda en el borde"
            entradilla="Grupos por nivel, instructores certificados y dos piscinas pensadas para cada etapa. Así el miedo se va y la técnica llega."
          />

          <ul className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {RAZONES.map(({ icono: Icono, titulo, texto }, i) => (
              <li
                key={titulo}
                data-reveal
                style={{ "--reveal-i": i } as React.CSSProperties}
                className="flex gap-4 border-t border-tone-line py-6"
              >
                <Icono aria-hidden className="mt-1 size-7 shrink-0 text-piscina-700" />
                <div>
                  <h3 className="text-xl font-bold">{titulo}</h3>
                  <p className="mt-1.5 text-tone-muted">{texto}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
