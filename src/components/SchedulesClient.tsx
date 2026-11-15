"use client";

import { useId, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
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

const TODOS = "todos";

const wa = (numero: string, texto: string) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

const botonWhatsapp =
  "inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill bg-whatsapp px-6 py-3 font-bold text-marino-950 shadow-flota transition-transform duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:scale-[0.97]";

/** Agrupa por día respetando el orden en que llegan de la API. */
function porDia(items: ScheduleItem[]) {
  const grupos = new Map<string, ScheduleItem[]>();
  for (const item of items) grupos.set(item.day, [...(grupos.get(item.day) ?? []), item]);
  return Array.from(grupos, ([dia, clases]) => ({ dia, clases }));
}

// "Hoy" depende del reloj del visitante: en el servidor (y al hidratar) no se
// marca ningún día, y se calcula solo en el navegador, con la hora de RD.
const sinSuscripcion = () => () => {};
const diaDeHoy = () =>
  new Intl.DateTimeFormat("es-DO", { weekday: "long", timeZone: "America/Santo_Domingo" }).format(new Date());
/** "Sábados" → "sábado": el panel a veces escribe el día en plural. */
const normalizar = (texto: string) =>
  texto.trim().toLocaleLowerCase("es").replace(/^(sábado|domingo)s$/, "$1");
/** Clave para comparar días como lo hace mcswim-admin (weekdayIndex): sin
 *  tildes ni mayúsculas y por las 5 primeras letras ("Sábados" = "sabado"). */
const claveDia = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim().slice(0, 5);

/**
 * La API manda las horas como se escriben en el panel ("7:00 AM",
 * "8:00 PM - 9:00 PM"). Aquí se muestran con la norma del español:
 * "7:00 a. m." y, si el rango cae en la misma franja, "8:00 a 9:00 p. m.".
 */
export function formatoHora(texto: string) {
  const hora = texto.replace(
    /(\d{1,2}(?::\d{2})?)\s*([ap])\.?\s*m\.?/gi,
    (_, h: string, m: string) => `${h} ${m.toLowerCase()}. m.`,
  );
  const rango = hora.match(/^\s*(\S+) ([ap]\. m\.)\s*(?:-|–|—|a|hasta)\s*(\S+) ([ap]\. m\.)\s*$/);
  if (!rango) return hora.trim();
  const [, desde, franjaDesde, hasta, franjaHasta] = rango;
  return franjaDesde === franjaHasta
    ? `${desde} a ${hasta} ${franjaHasta}`
    : `${desde} ${franjaDesde} a ${hasta} ${franjaHasta}`;
}

/** La hora en grande y "a. m." / "p. m." más pequeño, sin partirse en dos líneas. */
function Hora({ texto, className }: { texto: string; className?: string }) {
  const partes = formatoHora(texto).split(/([ap]\. m\.)/);
  return (
    <span className={className}>
      {partes.map((parte, i) =>
        /^[ap]\. m\.$/.test(parte) ? (
          <span key={i} className="whitespace-nowrap text-[0.55em]">
            {parte}
          </span>
        ) : (
          parte
        ),
      )}
    </span>
  );
}

export default function SchedulesClient({ branches, unavailable = false, whatsapp }: Props) {
  const [seleccion, setSeleccion] = useState(0);
  const [filtro, setFiltro] = useState(TODOS);
  // La grilla solo se anima al cambiar de sucursal o de filtro, nunca en la primera carga.
  const [cambio, setCambio] = useState(false);
  const base = useId();
  const hoy = useSyncExternalStore(sinSuscripcion, diaDeHoy, () => null);

  const sucursal = branches[seleccion] ?? branches[0];
  const clases = sucursal?.schedules ?? [];
  const programas = Array.from(new Set(clases.map((c) => c.category)));
  // Si la sucursal elegida no da ese programa, se muestran todos.
  const filtroActivo = programas.includes(filtro) ? filtro : TODOS;
  const visibles = filtroActivo === TODOS ? clases : clases.filter((c) => c.category === filtroActivo);
  const dias = porDia(visibles);
  const conCupo = visibles.filter((c) => !c.full).length;

  const elegir = (i: number) => {
    setSeleccion(i);
    setCambio(true);
  };
  const filtrar = (programa: string) => {
    setFiltro(programa);
    setCambio(true);
  };

  const columnasMovil = Math.min(branches.length, 2);

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
        <div className="flex flex-col gap-8">
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
              // En móvil, dos columnas (con cuatro sucursales, 2 × 2); desde sm, una sola fila.
              style={
                {
                  "--n": branches.length,
                  "--mc": columnasMovil,
                  "--mr": Math.ceil(branches.length / columnasMovil),
                } as CSSProperties
              }
              className={cn(
                "tabs-sucursal relative grid w-full border border-tone-line bg-white p-1.5 shadow-flota sm:w-fit sm:min-w-md",
                branches.length > 2 ? "rounded-card sm:rounded-pill" : "rounded-pill",
              )}
            >
              {/* Pastilla que se desliza bajo la pestaña elegida. */}
              <span
                aria-hidden
                className="tab-indicador pointer-events-none absolute left-1.5 top-1.5 rounded-pill bg-marino-900"
                style={
                  {
                    "--i": seleccion,
                    "--col": seleccion % columnasMovil,
                    "--row": Math.floor(seleccion / columnasMovil),
                  } as CSSProperties
                }
              />
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
                    "relative flex min-h-12 items-center justify-center gap-2 rounded-pill px-3 text-center font-bold leading-tight transition-[color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.97] sm:whitespace-nowrap sm:px-5",
                    i === seleccion ? "text-espuma-50" : "text-tinta-600 hover:text-marino-950",
                  )}
                >
                  <MapPin aria-hidden className="size-4 shrink-0" />
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
              No pudimos cargar los horarios en este momento. Escríbenos y te pasamos los turnos y cupos de todas
              nuestras sucursales.
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
            className="mt-10"
          >
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              {(sucursal.address || sucursal.notes) && (
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-tone-muted">
                  <MapPin aria-hidden className="size-5 text-piscina-700" />
                  <span className="font-bold text-tone-fg">Sucursal {sucursal.name}</span>
                  {sucursal.address && <span>{sucursal.address}</span>}
                  {sucursal.notes && <span className="w-full sm:w-auto">{sucursal.notes}</span>}
                </p>
              )}

              {programas.length > 1 && (
                <div
                  role="group"
                  aria-label="Filtrar por programa"
                  className="sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                >
                  {[TODOS, ...programas].map((programa) => {
                    const activo = programa === filtroActivo;
                    return (
                      <button
                        key={programa}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => filtrar(programa)}
                        className={cn(
                          "min-h-11 shrink-0 rounded-pill border-2 px-4 font-bold transition-[background-color,border-color,color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.96]",
                          activo
                            ? "border-piscina-700 bg-piscina-700 text-white"
                            : "border-espuma-200 bg-white text-tinta-600 hover:border-piscina-700 hover:text-marino-950",
                        )}
                      >
                        {programa === TODOS ? "Todos" : programa}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <p aria-live="polite" className="sr-only">
              {visibles.length} turnos en {sucursal.name}
              {filtroActivo === TODOS ? "" : ` de ${filtroActivo}`}, {conCupo} con cupo.
            </p>

            {dias.length === 0 ? (
              <p className="rounded-card border border-dashed border-tone-line bg-white p-8 text-tone-muted">
                Por ahora no hay horarios publicados en esta sucursal. Escríbenos para saber cuándo abren nuevos
                turnos.
              </p>
            ) : (
              <div
                key={`${sucursal.id}-${filtroActivo}`}
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(15rem,1fr))]"
              >
                {dias.map(({ dia, clases: delDia }, n) => {
                  const esHoy = hoy !== null && claveDia(dia) === claveDia(hoy);
                  return (
                    <div
                      key={dia}
                      style={{ animationDelay: `${n * 60}ms` } as CSSProperties}
                      className={cn(
                        "overflow-hidden rounded-card bg-white shadow-flota",
                        esHoy && "ring-3 ring-boya-400",
                        cambio && "motion-safe:animate-[aparecer_500ms_var(--ease-out-expo)_both]",
                      )}
                    >
                      <h3 className="flex items-center justify-between gap-3 bg-marino-900 px-5 py-3 font-display text-2xl font-extrabold uppercase text-espuma-50">
                        {dia}
                        {esHoy && (
                          <span className="rounded-pill bg-boya-400 px-2.5 py-0.5 font-sans text-sm font-bold normal-case text-marino-950">
                            Hoy
                          </span>
                        )}
                      </h3>
                      <ul className="divide-y divide-tone-line">
                        {delDia.map((clase, i) => (
                          <li key={`${clase.time}-${i}`} className="px-5 py-4">
                            <div className="flex items-baseline justify-between gap-3">
                              <Hora
                                texto={clase.time}
                                className={cn(
                                  "font-display text-display-sm font-extrabold tabular-nums",
                                  clase.full && "text-tinta-500",
                                )}
                              />
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
                                clase.full
                                  ? `Hola MC Swim Academy, quiero entrar a la lista de espera del ${normalizar(clase.day)} (${formatoHora(clase.time)}) en ${sucursal.name}.`
                                  : `Hola MC Swim Academy, me interesa el horario del ${normalizar(clase.day)} (${formatoHora(clase.time)}) en ${sucursal.name}.`,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group/cupo mt-2 inline-flex min-h-11 items-center gap-1.5 font-bold text-piscina-700"
                            >
                              <MessageCircle
                                aria-hidden
                                className="size-4 transition-transform duration-(--dur-base) ease-spring-soft group-hover/cupo:-rotate-12 group-hover/cupo:scale-110"
                              />
                              <span className="relative">
                                {clase.full ? "Unirme a la lista de espera" : "Consultar cupo"}
                                <span
                                  aria-hidden
                                  className="absolute inset-x-0 -bottom-0.5 h-0.5 origin-left scale-x-0 bg-current transition-transform duration-(--dur-base) ease-out-expo group-hover/cupo:scale-x-100 group-focus-visible/cupo:scale-x-100"
                                />
                              </span>
                              <span className="sr-only">
                                {" "}
                                ({clase.day}, {formatoHora(clase.time)})
                              </span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <div
          data-tone="boya"
          data-reveal
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
