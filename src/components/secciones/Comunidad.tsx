import Image from "next/image";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { testimoniosVisibles } from "@/content/testimonios";
import { GaleriaComunidad } from "./GaleriaComunidad";

const GALERIA = ["sonrisaFideo", "coachNino", "clavado", "tablaCoach", "adultos", "equipoBorde"] as const;

export function Comunidad() {
  const testimonios = testimoniosVisibles();

  return (
    <Section tone="blanco" aria-labelledby="comunidad-titulo" className="py-20 md:py-28">
      <Titular
        id="comunidad-titulo"
        titulo="Todas las edades, un mismo equipo"
        entradilla="Niños que pierden el miedo, jóvenes que afinan la técnica y adultos que por fin se animan. Cada uno en su carril."
      />

      <div className="mt-12" data-reveal="foto">
        {/* La foto de grupo se muestra entera, con su proporción original:
            cualquier marco más panorámico corta cabezas o pies. Al entrar en
            pantalla se aleja un poco (zoom suave ligado al scroll). */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-blob shadow-hondo">
          <Image
            src={FOTOS.comunidad.src}
            alt={FOTOS.comunidad.alt}
            quality={60}
            placeholder="blur"
            sizes="(min-width: 1088px) 1024px, 94vw"
            className="foto-alejar block h-auto w-full"
          />
        </div>
      </div>

      {/* En escritorio la tira también avanza sola con el scroll de la página. */}
      <GaleriaComunidad fotos={GALERIA.map((clave) => FOTOS[clave])} />

      {testimonios.length > 0 && (
        <ul className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {testimonios.map((t, i) => (
            <li
              key={t.nombre}
              data-reveal
              style={{ "--reveal-i": i } as React.CSSProperties}
              className="border-t-4 border-piscina-500 pt-6"
            >
              <figure>
                {t.esEjemplo && (
                  <Etiqueta estilo="boya" className="mb-4">
                    Ejemplo, falta confirmar
                  </Etiqueta>
                )}
                <blockquote className="text-lg font-medium leading-relaxed">“{t.texto}”</blockquote>
                <figcaption className="mt-5">
                  <span className="block font-bold">{t.nombre}</span>
                  <span className="block text-sm text-tone-muted">
                    {t.relacion}, sucursal {t.sucursal}
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
