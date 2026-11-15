"use client";

import { useId, useState, useSyncExternalStore, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, Clock, MapPin, MessageCircle } from "lucide-react";
import { ContextoElegido, type OpcionNombre } from "@/components/ui/ContextoElegido";
import { mismaSucursal, normalizarTexto, programasDeTurno, slug, type ProgramaSlug } from "@/content/categorias";
import { cn } from "@/lib/cn";
import { codificarTurno, elegir, enlaceEleccion, useEleccion } from "@/lib/eleccion";
import { diaEnMinuscula, diaTitulo, formatoHora, indiceDia, indiceHoy, minutos } from "@/lib/horas";
import { transicion } from "@/lib/transicion";

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
  /** Programas de la web (slug + nombre), para el filtro y el contexto. */
  programas?: OpcionNombre[];
  /** Sedes de la web (id + nombre), para emparejarlas con las de la API. */
  sedes?: OpcionNombre[];
};

const TODOS = "todos";

const wa = (numero: string, texto: string) => `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;

type Turno = ScheduleItem & { programas: ProgramaSlug[]; indice: number };

/** Agrupa por día de la semana (une "Sábado" y "Sábados") y ordena por día y hora. */
function porDia(items: Turno[]) {
  const grupos = new Map<string, Turno[]>();
  for (const t of [...items].sort((a, b) => a.indice - b.indice || minutos(a.time) - minutos(b.time))) {
    const clave = t.indice < 7 ? String(t.indice) : normalizarTexto(t.day);
    grupos.set(clave, [...(grupos.get(clave) ?? []), t]);
  }
  return Array.from(grupos.values(), (clases) => ({ dia: clases[0].day, indice: clases[0].indice, clases }));
}

/** Quita lo repetido entre grupo de edad, nota y programa ("Adultos" · "Adultos"). */
function detalles(t: Turno, nombresProgramas: string[]) {
  const n = normalizarTexto;
  const edad = t.ageGroup.trim();
  const nota = t.notes?.trim() ?? "";
  const mostrarEdad = Boolean(edad) && !nombresProgramas.some((p) => n(p) === n(edad));
  const mostrarNota =
    Boolean(nota) && n(nota) !== n(edad) && n(nota) !== n(t.category) && !(mostrarEdad && n(edad).includes(n(nota)));
  return { edad: mostrarEdad ? edad : null, nota: mostrarNota ? nota : null };
}

// "Hoy" depende del reloj del visitante: en el servidor (y al hidratar) no se
// marca ningún día; se calcula en el navegador con la hora de RD.
const sinSuscripcion = () => () => {};

/** La hora en grande y "a. m." / "p. m." más pequeño, sin partirse en dos líneas. */
function Hora({ texto, className }: { texto: string; className?: string }) {
  const partes = formatoHora(texto).split(/([ap]\. m\.)/);
  return (
    <span className={className}>
      {partes.map((parte, i) =>
        /^[ap]\. m\.$/.test(parte) ? (
          <span key={i} className="whitespace-nowrap text-[0.5em] tracking-normal">
            {parte}
          </span>
        ) : (
          parte
        ),
      )}
    </span>
  );
}

export default function SchedulesClient({ branches, unavailable = false, whatsapp, programas = [], sedes = [] }: Props) {
  const eleccion = useEleccion();
  // La grilla solo se anima al cambiar de sucursal o de filtro, nunca en la primera carga.
  const [cambio, setCambio] = useState(false);
  const base = useId();
  const hoy = useSyncExternalStore(sinSuscripcion, () => indiceHoy(), () => null);

  // Cada sucursal de la API, con el id de su sede en la web si se pudo emparejar.
  const ids = branches.map((b) => sedes.find((s) => mismaSucursal(b.name, s.nombre))?.id ?? slug(b.name));
  const elegida = ids.indexOf(eleccion.sucursal ?? "");
  const seleccion = elegida === -1 ? 0 : elegida;
  const sucursal = branches[seleccion];
  const nombresProgramas = programas.map((p) => p.nombre);

  const clases: Turno[] = (sucursal?.schedules ?? []).map((c) => ({
    ...c,
    programas: programasDeTurno(c.category, c.ageGroup),
    indice: indiceDia(c.day),
  }));
  const presentes = programas.filter((p) => clases.some((c) => c.programas.includes(p.id as ProgramaSlug)));
  const pedido = programas.find((p) => p.id === eleccion.programa);
  const filtroActivo = pedido && presentes.includes(pedido) ? pedido.id : TODOS;
  const visibles =
    filtroActivo === TODOS ? clases : clases.filter((c) => c.programas.includes(filtroActivo as ProgramaSlug));
  const dias = porDia(visibles);
  const conCupo = visibles.filter((c) => !c.full).length;

  // Si hoy no hay clase en esta sucursal, cuál es la próxima.
  const diasConClase = new Set(clases.filter((c) => c.indice < 7).map((c) => c.indice));
  const proximoDia =
    hoy === null || diasConClase.size === 0 || diasConClase.has(hoy)
      ? undefined
      : [1, 2, 3, 4, 5, 6].map((d) => (hoy + d) % 7).find((d) => diasConClase.has(d));
  const proxima =
    proximoDia === undefined
      ? null
      : clases.filter((c) => c.indice === proximoDia).sort((a, b) => minutos(a.time) - minutos(b.time))[0];

  const cambiar = (cambios: Parameters<typeof elegir>[0]) =>
    transicion(() => {
      elegir(cambios, undefined, "#horarios");
      setCambio(true);
    });
  const elegirSucursal = (i: number) => cambiar({ sucursal: ids[i] });

  const columnasMovil = Math.min(branches.length, 2);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const siguiente = (seleccion + delta + branches.length) % branches.length;
    elegirSucursal(siguiente);
    document.getElementById(`${base}-tab-${siguiente}`)?.focus();
  };

  const nombrePrograma = (id: string) => programas.find((p) => p.id === id)?.nombre ?? id;

  return (
    <section
      id="horarios"
      data-tone="espuma"
      aria-labelledby="horarios-titulo"
      className="bg-tone-bg py-16 text-tone-fg md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <header className="max-w-2xl" data-reveal>
            <h2 id="horarios-titulo" className="font-display text-display-lg font-extrabold uppercase xl:whitespace-nowrap">
              La pizarra de horarios
            </h2>
            <p className="mt-4 text-lead text-tone-muted">
              {unavailable
                ? "Los turnos cambian cada semana. Escríbenos y te pasamos los que tienen cupo."
                : "Turnos al día, directo del sistema de la academia. Elige sucursal y programa, y reserva el que te sirva."}
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
                "tabs-sucursal relative grid w-full shrink-0 border border-tone-line bg-white p-1.5 shadow-flota sm:w-fit sm:min-w-md",
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
                  onClick={() => elegirSucursal(i)}
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
          <div data-tone="blanco" className="mt-10 max-w-2xl rounded-blob bg-tone-bg p-8 shadow-flota sm:p-10">
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
              className="boton-wa mt-6"
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
            className="mt-8"
          >
            <ContextoElegido programas={programas} sedes={sedes} className="mb-5" />

            <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              {presentes.length > 1 ? (
                <div
                  role="group"
                  aria-label="Filtrar por programa"
                  className="sin-barra -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
                >
                  {[{ id: TODOS, nombre: "Todos" }, ...presentes].map((p) => {
                    const activo = p.id === filtroActivo;
                    const cuantos =
                      p.id === TODOS
                        ? clases.length
                        : clases.filter((c) => c.programas.includes(p.id as ProgramaSlug)).length;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        aria-pressed={activo}
                        onClick={() => cambiar({ programa: p.id === TODOS ? null : p.id })}
                        className={cn(
                          "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-pill border-2 px-4 font-bold transition-[background-color,border-color,color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.96]",
                          activo
                            ? "border-marino-900 bg-marino-900 text-espuma-50"
                            : "border-espuma-200 bg-white text-tinta-600 hover:border-marino-900 hover:text-marino-950",
                        )}
                      >
                        {p.nombre}
                        <span className={cn("text-sm tabular-nums", activo ? "text-niebla-300" : "text-tinta-500")}>
                          {cuantos}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <span />
              )}
              {(sucursal.address || sucursal.notes) && (
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-tone-muted lg:justify-end lg:text-right">
                  <MapPin aria-hidden className="size-4 text-piscina-700" />
                  {sucursal.address && <span>{sucursal.address}</span>}
                  {sucursal.notes && <span>· {sucursal.notes}</span>}
                </p>
              )}
            </div>

            {pedido && !presentes.includes(pedido) && clases.length > 0 && (
              <p className="mb-4 font-semibold text-tone-muted">
                {pedido.nombre} no tiene turnos en {sucursal.name}: te mostramos todos.
              </p>
            )}

            <p aria-live="polite" className="sr-only">
              {visibles.length} turnos en {sucursal.name}
              {filtroActivo === TODOS ? "" : ` de ${nombrePrograma(filtroActivo)}`}, {conCupo} con cupo.
            </p>

            {dias.length === 0 ? (
              <p className="rounded-card border border-dashed border-tone-line bg-white p-8 text-tone-muted">
                Por ahora no hay horarios publicados en esta sucursal. Escríbenos para saber cuándo abren nuevos
                turnos.
              </p>
            ) : (
              // Marcador de piscina: una fila por día y las horas en columnas alineadas.
              <div
                data-tone="abismo"
                data-destello="programa sucursal"
                className="pizarra overflow-hidden rounded-blob bg-tone-bg text-tone-fg shadow-hondo"
              >
                {proxima && (
                  <p className="flex flex-wrap items-center gap-x-2 border-b border-tone-line px-5 py-3 text-sm text-tone-muted sm:px-7">
                    <Clock aria-hidden className="size-4 text-turquesa-400" />
                    Hoy no hay clases en {sucursal.name}. La próxima:
                    <strong className="font-bold text-tone-fg">
                      {diaEnMinuscula(proxima.day)}, {formatoHora(proxima.time)}
                    </strong>
                  </p>
                )}
                <ol key={`${seleccion}-${filtroActivo}`} className="divide-y divide-tone-line">
                  {dias.map(({ dia, indice, clases: delDia }, n) => {
                    const esHoy = hoy !== null && indice === hoy;
                    return (
                      <li
                        key={dia}
                        style={{ animationDelay: `${n * 50}ms` } as CSSProperties}
                        className={cn(
                          "fila-dia grid grid-cols-1 lg:grid-cols-[10rem_minmax(0,1fr)]",
                          esHoy && "bg-marino-900",
                          cambio && "motion-safe:animate-[aparecer_450ms_var(--ease-out-expo)_both]",
                        )}
                      >
                        <h3 className="flex items-center gap-3 px-5 pt-4 font-display text-2xl font-extrabold uppercase text-turquesa-400 sm:px-7 lg:flex-col lg:items-start lg:gap-1.5 lg:py-5 lg:text-3xl">
                          {diaTitulo(dia)}
                          {esHoy && (
                            <span className="rounded-pill bg-boya-400 px-2.5 py-0.5 font-sans text-sm font-bold normal-case tracking-normal text-marino-950">
                              Hoy
                            </span>
                          )}
                        </h3>
                        <ul className="divide-y divide-tone-line">
                          {delDia.map((clase, i) => {
                            const { edad, nota } = detalles(clase, nombresProgramas);
                            const etiquetas =
                              clase.programas.length > 0 ? clase.programas.map(nombrePrograma) : [clase.category];
                            const turno = codificarTurno(clase.day, clase.time);
                            const sede = ids[seleccion];
                            const programaTurno =
                              eleccion.programa && clase.programas.includes(eleccion.programa as ProgramaSlug)
                                ? eleccion.programa
                                : (clase.programas[0] ?? null);
                            const reservar = { programa: programaTurno, sucursal: sede, turno };
                            return (
                              <li
                                key={`${clase.time}-${i}`}
                                // View Transition: el turno que sigue en pantalla se desplaza a su sitio.
                                style={{ viewTransitionName: `turno-${clase.indice}-${minutos(clase.time)}-${i}` } as CSSProperties}
                                className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4 gap-y-1 px-5 py-3.5 sm:px-7 lg:grid-cols-[9rem_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6 lg:py-4"
                              >
                                <Hora
                                  texto={clase.time}
                                  className={cn(
                                    "font-display text-[2.5rem] font-extrabold leading-none tabular-nums tracking-tight",
                                    clase.full && "text-niebla-300 line-through decoration-corchera-600 decoration-[3px]",
                                  )}
                                />
                                <div className="min-w-0">
                                  <p className="flex flex-wrap items-center gap-1.5">
                                    {clase.full && (
                                      <span className="rounded-pill bg-corchera-600 px-2.5 py-0.5 text-sm font-bold text-white">
                                        Cupo lleno
                                      </span>
                                    )}
                                    {etiquetas.map((e) => (
                                      <span
                                        key={e}
                                        className="rounded-pill border border-tone-line px-2.5 py-0.5 text-sm font-semibold text-agua-300"
                                      >
                                        {e}
                                      </span>
                                    ))}
                                  </p>
                                  {(edad || nota) && (
                                    <p className="mt-1 text-[0.95rem] leading-snug">
                                      {edad && <span className="font-semibold">{edad}</span>}
                                      {edad && nota && <span className="text-tone-muted"> · </span>}
                                      {nota && <span className="text-tone-muted">{nota}</span>}
                                    </p>
                                  )}
                                </div>
                                <div className="col-span-2 flex flex-wrap items-center gap-x-5 lg:col-span-1 lg:justify-end">
                                  {!clase.full && (
                                    <a
                                      href={enlaceEleccion(reservar, "#inscripcion")}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        elegir(reservar, "#inscripcion");
                                      }}
                                      className="group/turno inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap font-bold text-boya-400"
                                    >
                                      Reservar este turno
                                      <ArrowRight
                                        aria-hidden
                                        className="size-4 transition-transform duration-(--dur-base) ease-spring-soft group-hover/turno:translate-x-1"
                                      />
                                      <span className="sr-only">
                                        {" "}
                                        ({diaEnMinuscula(clase.day)}, {formatoHora(clase.time)})
                                      </span>
                                    </a>
                                  )}
                                  <a
                                    href={wa(
                                      whatsapp,
                                      clase.full
                                        ? `Hola MC Swim Academy, quiero entrar a la lista de espera del ${diaEnMinuscula(clase.day)} (${formatoHora(clase.time)}) en ${sucursal.name}.`
                                        : `Hola MC Swim Academy, me interesa el horario del ${diaEnMinuscula(clase.day)} (${formatoHora(clase.time)}) en ${sucursal.name}.`,
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group/wa inline-flex min-h-11 items-center gap-2 whitespace-nowrap font-semibold text-tone-fg"
                                  >
                                    <span className="grid size-7 place-items-center rounded-full bg-whatsapp text-marino-950 transition-transform duration-(--dur-base) ease-spring-soft group-hover/wa:-rotate-12">
                                      <MessageCircle aria-hidden className="size-4" />
                                    </span>
                                    {clase.full ? "Lista de espera" : "Preguntar"}
                                    <span className="sr-only">
                                      {" "}
                                      por WhatsApp ({diaEnMinuscula(clase.day)}, {formatoHora(clase.time)})
                                    </span>
                                  </a>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        )}

        <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
          <p className="text-tone-muted">
            <span className="font-semibold text-tone-fg">¿Ninguno te cuadra?</span> Te contamos cuándo abren turnos
            nuevos o si hay cupos especiales.
          </p>
          <a
            href={wa(whatsapp, "Hola MC Swim Academy, quiero información sobre los horarios disponibles.")}
            target="_blank"
            rel="noopener noreferrer"
            className="boton-wa shrink-0 self-start sm:ml-auto sm:self-auto"
          >
            <MessageCircle aria-hidden className="size-5" />
            Preguntar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
