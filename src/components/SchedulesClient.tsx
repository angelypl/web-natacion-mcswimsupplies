"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { Clock, MapPin, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

export type ScheduleItem = {
  day: string;
  ageGroup: string;
  time: string;
  category: string;
  notes: string | null;
  /** Clase marcada como llena en el sistema de gestión. */
  full: boolean;
};

export type BranchSchedule = {
  id: number;
  name: string;
  address: string | null;
  notes: string | null;
  schedules: ScheduleItem[];
};

type Props = {
  branches: BranchSchedule[];
  /** La API de horarios no respondió: se muestra el respaldo por WhatsApp. */
  unavailable?: boolean;
  /** Número de WhatsApp (solo dígitos). Llega por props: este componente no importa contenido validado. */
  whatsapp: string;
};

const wa = (numero: string, texto: string) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

const botonWhatsapp =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill bg-whatsapp px-6 py-3 font-bold text-marino-950 shadow-flota transition-transform duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:scale-[0.97]";

/** Agrupa por día respetando el orden en que llegan de la API. */
function porDia(items: ScheduleItem[]) {
  const grupos = new Map<string, ScheduleItem[]>();
  for (const item of items) grupos.set(item.day, [...(grupos.get(item.day) ?? []), item]);
  return Array.from(grupos, ([dia, clases]) => ({ dia, clases }));
}

export default function SchedulesClient({ branches, unavailable = false, whatsapp }: Props) {
  const [seleccion, setSeleccion] = useState(0);
  // La grilla solo se anima al cambiar de sucursal, nunca en la primera carga.
  const [cambio, setCambio] = useState(false);
  const base = useId();
  const elegir = (i: number) => {
    setSeleccion(i);
    setCambio(true);
  };
  const sucursal = branches[seleccion] ?? branches[0];
  const dias = porDia(sucursal?.schedules ?? []);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const siguiente = (seleccion + delta + branches.length) % branches.length;
    elegir(siguiente);
    document.getElementById(`${base}-tab-${siguiente}`)?.focus();
  };

  return (
    <section id="horarios" data-tone="espuma" aria-labelledby="horarios-titulo" className="bg-tone-bg py-20 text-tone-fg md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-3xl" data-reveal>
            <h2 id="horarios-titulo" className="font-display text-display-lg font-extrabold uppercase">
              La pizarra de horarios
            </h2>
            <p className="mt-5 max-w-2xl text-lead text-tone-muted">
              {unavailable
                ? "Los turnos cambian cada semana. Escríbenos y te pasamos los que tienen cupo."
                : "Turnos al día, directo del sistema de la academia. Elige la sucursal y escríbenos por el que te sirva."}
            </p>
          </header>

          {branches.length > 1 && (
            <div
              role="tablist"
              aria-label="Sucursal"
              className="flex w-full max-w-md rounded-pill border border-tone-line bg-white p-1.5 shadow-flota lg:w-auto"
            >
              {branches.map((b, i) => (
                <button
                  key={b.id}
                  id={`${base}-tab-${i}`}
                  type="button"
                  role="tab"
                  aria-selected={i === seleccion}
                  aria-controls={`${base}-panel`}
                  tabIndex={i === seleccion ? 0 : -1}
                  onClick={() => elegir(i)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-pill px-5 font-bold transition-[background-color,color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.97] lg:flex-none",
                    i === seleccion ? "bg-marino-900 text-espuma-50" : "text-tinta-600 hover:bg-espuma-100 hover:text-marino-950",
                  )}
                >
                  <MapPin aria-hidden className="size-4" />
                  {b.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {unavailable && (
          <div data-tone="blanco" className="mt-12 max-w-2xl rounded-blob bg-tone-bg p-8 shadow-flota sm:p-10">
            <Clock aria-hidden className="size-8 text-piscina-700" />
            <h3 className="mt-4 font-display text-display-sm font-extrabold uppercase">
              Consulta los horarios por WhatsApp
            </h3>
            <p className="mt-3 text-tone-muted">
              No pudimos cargar los horarios en este momento. Escríbenos y te pasamos los turnos y cupos de Utesa
              y VivirMás.
            </p>
            <a
              href={wa(whatsapp, "Hola MC Swim Academy, quiero información sobre los horarios disponibles.")}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(botonWhatsapp, "mt-6")}
            >
              <MessageCircle aria-hidden className="size-5" />
              Pedir horarios por WhatsApp
            </a>
          </div>
        )}

        {sucursal && (
          <div
            id={`${base}-panel`}
            role={branches.length > 1 ? "tabpanel" : undefined}
            aria-labelledby={branches.length > 1 ? `${base}-tab-${seleccion}` : undefined}
            className="mt-12"
          >
            {(sucursal.address || sucursal.notes) && (
              <p className="mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-tone-muted">
                <MapPin aria-hidden className="size-5 text-piscina-700" />
                <span className="font-bold text-tone-fg">Sucursal {sucursal.name}</span>
                {sucursal.address && <span>{sucursal.address}</span>}
                {sucursal.notes && <span className="w-full sm:w-auto">{sucursal.notes}</span>}
              </p>
            )}

            {dias.length === 0 ? (
              <p className="rounded-card border border-dashed border-tone-line bg-white p-8 text-tone-muted">
                Por ahora no hay horarios publicados en esta sucursal. Escríbenos para saber cuándo abren nuevos
                turnos.
              </p>
            ) : (
              <div
                key={sucursal.id}
                className={cn(
                  "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]",
                  cambio && "motion-safe:animate-[aparecer_500ms_var(--ease-out-expo)_both]",
                )}
              >
                {dias.map(({ dia, clases }) => (
                  <div key={dia} className="overflow-hidden rounded-card bg-white shadow-flota">
                    <h3 className="bg-marino-900 px-5 py-3 font-display text-2xl font-extrabold uppercase text-espuma-50">
                      {dia}
                    </h3>
                    <ul className="divide-y divide-tone-line">
                      {clases.map((clase, i) => (
                        <li key={`${clase.time}-${i}`} className="px-5 py-4">
                          <div className="flex items-baseline justify-between gap-3">
                            <span className="font-display text-display-sm font-extrabold tabular-nums">{clase.time}</span>
                            {clase.full ? (
                              <span className="rounded-pill bg-corchera-600 px-2.5 py-0.5 text-sm font-bold text-white">
                                Cupo lleno
                              </span>
                            ) : (
                              <span className="rounded-pill bg-espuma-100 px-2.5 py-0.5 text-sm font-semibold text-turquesa-700">
                                {clase.category}
                              </span>
                            )}
                          </div>
                          <p className="mt-1 font-semibold">{clase.ageGroup}</p>
                          {clase.full && <p className="text-sm text-tone-muted">{clase.category}</p>}
                          {clase.notes && <p className="mt-1 text-sm text-tone-muted">{clase.notes}</p>}
                          <a
                            href={wa(
                              whatsapp,
                              `Hola MC Swim Academy, me interesa el horario del ${clase.day} a las ${clase.time} en ${sucursal.name}.`,
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group/cupo mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-piscina-700"
                          >
                            <span className="relative">
                              {clase.full ? "Unirme a la lista de espera" : "Consultar cupo"}
                              <span
                                aria-hidden
                                className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-(--dur-base) ease-out-expo group-hover/cupo:scale-x-100 group-focus-visible/cupo:scale-x-100"
                              />
                            </span>
                            <span className="sr-only">
                              {" "}
                              ({clase.day}, {clase.time})
                            </span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div
          data-tone="boya"
          className="mt-14 flex flex-col gap-6 rounded-blob bg-tone-bg p-8 sm:p-10 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <h3 className="font-display text-display-sm font-extrabold uppercase">¿No encuentras tu horario?</h3>
            <p className="mt-2 max-w-xl font-medium text-tone-muted">
              Escríbenos y te contamos cuándo abren turnos nuevos o si hay cupos especiales.
            </p>
          </div>
          <a
            href={wa(whatsapp, "Hola MC Swim Academy, quiero información sobre los horarios disponibles.")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2.5 rounded-pill bg-marino-900 px-6 py-3 font-bold text-espuma-50 shadow-flota transition-transform duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:scale-[0.97]"
          >
            <MessageCircle aria-hidden className="size-5" />
            Consultar disponibilidad
          </a>
        </div>
      </div>
    </section>
  );
}
