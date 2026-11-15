import Image from "next/image";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { CARRILES } from "@/content/programas";
import { SITE } from "@/content/site";
import { testimoniosVisibles } from "@/content/testimonios";
import { GaleriaComunidad } from "./GaleriaComunidad";

const GALERIA = ["sonrisaFideo", "coachNino", "adultos", "clavado", "tablaCoach"] as const;

// Hechos verificables, sacados de los datos (nada inventado).
function hechos() {
  const dias = new Set(SITE.sucursales.flatMap((s) => s.dias)).size;
  const edadMinima = Math.min(...CARRILES.map((c) => Number(c.edad.match(/\d+/)?.[0] ?? 99)));
  return [
    { cifra: String(SITE.sucursales.length), texto: "sucursales en Santo Domingo" },
    { cifra: String(dias), texto: dias === 7 ? "días a la semana con clase" : "días de la semana con clase" },
    { cifra: String(edadMinima), texto: "años, la edad para empezar" },
    { cifra: String(CARRILES.length), texto: "programas por edad y nivel" },
  ];
}

export function Comunidad() {
  const testimonios = testimoniosVisibles();

  return (
    <Section tone="blanco" aria-labelledby="comunidad-titulo" className="py-16 md:py-20">
      <Titular
        id="comunidad-titulo"
        titulo="Todas las edades, un mismo equipo"
        entradilla="Niños que pierden el miedo, jóvenes que afinan la técnica y adultos que por fin se animan. Cada uno en su carril."
      />

      <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:mt-10 lg:grid-cols-12 lg:gap-10">
        {/* La foto de grupo se muestra entera, con su proporción original:
            cualquier marco más panorámico corta cabezas o pies. */}
        <div className="lg:col-span-7" data-reveal="foto">
          <div className="foto-plana overflow-hidden rounded-blob shadow-hondo">
            <Image
              src={FOTOS.comunidad.src}
              alt={FOTOS.comunidad.alt}
              quality={60}
              placeholder="blur"
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 94vw"
              className="foto-alejar block h-auto w-full"
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-5">
            {hechos().map((h, i) => (
              <li
                key={h.texto}
                data-reveal
                style={{ "--reveal-i": i } as React.CSSProperties}
                className="border-t-4 border-piscina-500 pt-3"
              >
                <span className="cifra block font-display text-display-lg font-extrabold leading-none tabular-nums text-marino-900">
                  {h.cifra}
                </span>
                <span className="mt-1 block font-semibold text-tone-muted">{h.texto}</span>
              </li>
            ))}
          </ul>
          <a
            href={SITE.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/ig mt-7 flex min-h-16 items-center gap-4 rounded-card border-2 border-tone-line p-3 pr-5 transition-[border-color,transform] duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 hover:border-marino-900"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-card bg-marino-900 text-espuma-50 transition-transform duration-(--dur-base) ease-spring-soft group-hover/ig:-rotate-6">
              <InstagramIcono className="size-6" />
            </span>
            <span>
              <span className="block font-bold">Mira las clases en Instagram</span>
              <span className="block text-sm text-tone-muted">{SITE.instagram.usuario}</span>
            </span>
          </a>
        </div>
      </div>

      <GaleriaComunidad fotos={GALERIA.map((clave) => FOTOS[clave])} />

      {/* TODO_CLIENTE: testimonios reales con permiso de las familias. El hueco
          ya está diseñado: en cuanto un testimonio tenga `esEjemplo: false`
          en src/content/testimonios.ts, aparece aquí también en producción. */}
      {testimonios.length > 0 && (
        <ul className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonios.map((t, i) => (
            <li
              key={t.nombre}
              data-reveal
              style={{ "--reveal-i": i } as React.CSSProperties}
              className="border-t-4 border-piscina-500 pt-5"
            >
              <figure>
                {t.esEjemplo && (
                  <Etiqueta estilo="corchera" className="mb-3">
                    Ejemplo, falta confirmar
                  </Etiqueta>
                )}
                <blockquote className="text-lg font-medium leading-relaxed">“{t.texto}”</blockquote>
                <figcaption className="mt-4">
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
