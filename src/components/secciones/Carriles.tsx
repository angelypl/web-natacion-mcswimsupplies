import type { CSSProperties } from "react";
import Image from "next/image";
import { Check, CreditCard, MapPin, MessageCircle } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { LineaDeAgua } from "@/components/brand/LineaDeAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FOTOS } from "@/content/fotos";
import { CARRILES, INSCRIPCION } from "@/content/programas";
import { cn } from "@/lib/cn";
import { formatoPesos, textoSucursales, whatsappUrl } from "@/lib/contacto";

// Los programas son carriles de la piscina: la sección es agua (azul
// piscina) y cada programa está separado por una corchera.
export function Carriles() {
  return (
    <Section tone="piscina" container="none" id="carriles" aria-labelledby="carriles-titulo">
      <LineaDeAgua invertida className="-mt-px text-espuma-50" />

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 md:pb-28 lg:px-8">
        <Titular
          id="carriles-titulo"
          tamano="xl"
          titulo="Elige tu carril"
          entradilla="Tres programas según la edad y el nivel. Una mensualidad fija, sin letras pequeñas."
        />

        <ol className="mt-14">
          {CARRILES.map((carril, i) => {
            const foto = FOTOS[carril.foto];
            return (
              <li key={carril.id} id={`carril-${carril.numero}`} className="carril scroll-mt-20">
                <Corchera />
                <article
                  aria-labelledby={`carril-${carril.id}`}
                  className="-mx-3 grid grid-cols-1 gap-6 rounded-card px-3 py-9 md:grid-cols-12 md:items-center md:gap-8 lg:py-14"
                >
                  {/* En escritorio el número ocupa su columna; en móvil va como chapa sobre la foto. */}
                  <p
                    className="hidden font-display font-extrabold uppercase leading-none lg:col-span-2 lg:block"
                    data-reveal
                  >
                    <span className="block text-xl">Carril</span>
                    <span className="block text-display-2xl tabular-nums">{carril.numero}</span>
                  </p>

                  <div className="relative md:col-span-5 lg:col-span-4">
                    <p className="absolute -left-1 -top-4 z-10 -rotate-3 rounded-pill bg-marino-950 px-4 py-1.5 font-display text-2xl font-extrabold uppercase tabular-nums text-espuma-50 shadow-flota lg:hidden">
                      Carril {carril.numero}
                    </p>
                    <div
                      data-reveal="foto"
                      className={cn(
                        "rounded-card border-[5px] border-espuma-50 bg-espuma-50 shadow-hondo transition-transform duration-(--dur-lenta) ease-spring-soft hover:rotate-0",
                        i % 2 === 0 ? "-rotate-[1.5deg]" : "rotate-[1.5deg]",
                      )}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[calc(var(--radius-card)-5px)] sm:aspect-[4/3]">
                        <Image
                          src={foto.src}
                          alt={foto.alt}
                          fill
                          quality={60}
                          placeholder="blur"
                          sizes="(min-width: 1024px) 30vw, (min-width: 768px) 40vw, 92vw"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-7 lg:col-span-4" data-reveal style={{ "--reveal-i": 1 } as CSSProperties}>
                    <h3
                      id={`carril-${carril.id}`}
                      className="font-display text-display-md font-extrabold uppercase"
                    >
                      {carril.nombre}
                    </h3>
                    <p className="mt-1 text-lg font-bold">{carril.edad}</p>
                    <p className="mt-3 font-medium">{carril.descripcion}</p>
                    <ul className="mt-5 space-y-2">
                      {carril.incluye.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 font-medium">
                          <Check aria-hidden className="mt-0.5 size-5 shrink-0" strokeWidth={3} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 flex items-start gap-2 font-semibold">
                      <MapPin aria-hidden className="mt-0.5 size-5 shrink-0" />
                      {textoSucursales(carril.sucursalIds)}
                    </p>
                  </div>

                  <div
                    className="flex items-end justify-between gap-4 md:col-span-12 lg:col-span-2 lg:flex-col lg:items-stretch"
                    data-reveal
                    style={{ "--reveal-i": 2 } as CSSProperties}
                  >
                    <p>
                      <span className="block text-sm font-bold">Mensualidad</span>
                      <span className="font-display text-display-md font-extrabold tabular-nums">
                        {formatoPesos(carril.mensualidad)}
                      </span>
                    </p>
                    <BotonLink
                      href={whatsappUrl(carril.mensajeWhatsapp)}
                      externo
                      variante="marino"
                      icono={<MessageCircle className="size-5" />}
                      aria-label={`Reservar ${carril.nombre} por WhatsApp`}
                    >
                      Reservar
                    </BotonLink>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
        <Corchera />

        <div
          data-tone="blanco"
          data-reveal
          className="mt-14 grid grid-cols-1 gap-10 rounded-blob bg-tone-bg p-7 text-tone-fg shadow-hondo sm:p-10 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <h3 className="font-display text-display-sm font-extrabold uppercase">Antes de tu primer carril</h3>
            <p className="mt-3 text-tone-muted">
              La inscripción se paga una sola vez, al entrar:
            </p>
            <p className="mt-2 font-display text-display-md font-extrabold tabular-nums">
              {formatoPesos(INSCRIPCION.monto)}
            </p>
            <ul className="mt-4 space-y-2">
              {INSCRIPCION.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-turquesa-700" strokeWidth={3} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-7">
            <h3 className="flex items-center gap-2 text-xl font-bold">
              <CreditCard aria-hidden className="size-6 text-piscina-700" />
              Formas de pago
            </h3>
            <dl className="mt-4 divide-y divide-tone-line border-y border-tone-line">
              {INSCRIPCION.metodosPago.map((m) => (
                <div key={m.nombre} className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-bold">{m.nombre}</dt>
                  <dd className="text-tone-muted">{m.detalle}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <LineaDeAgua className="-mb-px text-marino-900" />
    </Section>
  );
}
