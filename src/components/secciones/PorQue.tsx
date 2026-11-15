import Image from "next/image";
import { Award, MapPin, ShieldCheck, Users } from "lucide-react";
import { Gotas } from "@/components/brand/LineaDeAgua";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { SITE } from "@/content/site";
import { CLASES_TODA_LA_SEMANA, enLetras, listaNatural } from "@/lib/contacto";

const mayuscula = (texto: string) => texto.charAt(0).toUpperCase() + texto.slice(1);

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
    titulo: `${mayuscula(enLetras(SITE.sucursales.length))} sucursales`,
    texto: `${listaNatural(SITE.sucursales.map((s) => s.nombre))}${
      CLASES_TODA_LA_SEMANA ? ": entre todas hay clases los siete días de la semana" : ""
    }.`,
  },
];

export function PorQue() {
  return (
    <Section tone="espuma" aria-labelledby="porque-titulo" className="py-14 md:py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <div className="relative order-2 mx-auto w-full max-w-lg lg:order-1 lg:col-span-5">
          <div className="foto-sticker parallax relative rounded-blob border-[6px] border-white bg-white shadow-hondo [--giro:-2.5deg] [--parallax:1.5rem]">
            <div className="relative aspect-[16/10] overflow-hidden sm:aspect-[5/4] rounded-[calc(var(--radius-blob)-6px)]">
              <Image
                src={FOTOS.equipoBorde.src}
                alt={FOTOS.equipoBorde.alt}
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
            entradilla={`Grupos por nivel, instructores certificados y ${enLetras(SITE.sucursales.length)} sucursales para cada etapa y cada horario. Así el miedo se va y la técnica llega.`}
          />

          <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {RAZONES.map(({ icono: Icono, titulo, texto }, i) => (
              <li
                key={titulo}
                data-reveal
                style={{ "--reveal-i": i } as React.CSSProperties}
                className="flex gap-4 border-t border-tone-line py-4 sm:py-5"
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
