"use client";

import { useRef, useState, type ChangeEvent, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, LoaderCircle, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";
import { decodificarTurno, elegir, useEleccion } from "@/lib/eleccion";
import { textoTurno } from "@/lib/horas";
import { transicion } from "@/lib/transicion";

type Programa = {
  /** Slug: "iniciacion" | "formacion" | "adultos". */
  id: string;
  nombre: string;
  /** "2 a 3 años" */
  edad: string;
  /** "RD$3,000" */
  precio: string;
  /** Mensualidad + inscripción, ya formateado. */
  primerMes: string;
  /** Sucursales donde se da. */
  sucursalIds: string[];
};
type Sucursal = { id: string; nombre: string; zona: string };

type Props = {
  programas: Programa[];
  sucursales: Sucursal[];
  /** Programa marcado si el visitante no eligió ninguno. */
  programaInicial: string;
  /** Inscripción única, ya formateada ("RD$1,000"). */
  inscripcion: string;
  /** Número de WhatsApp (solo dígitos). */
  whatsapp: string;
};

const NIVELES = [
  { id: "principiante", nombre: "Desde cero", detalle: "Principiante" },
  { id: "intermedio", nombre: "Flota y avanza", detalle: "Intermedio" },
  { id: "avanzado", nombre: "Domina estilos", detalle: "Avanzado" },
];

type Campo = "nombre" | "telefono";
type Errores = Partial<Record<Campo, string>>;

const campo =
  "mt-1.5 block w-full rounded-xl border-2 border-espuma-200 bg-white px-4 py-3 text-base text-marino-950 " +
  "placeholder:text-tinta-500 transition-[border-color,box-shadow] duration-(--dur-rapida) " +
  "hover:border-piscina-600 focus:border-piscina-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-piscina-500/25 " +
  "aria-invalid:border-corchera-600";
const etiqueta = "block font-bold";

const soloDigitos = (valor: string) => valor.replace(/\D/g, "");

function validarCampo(nombre: Campo, valor: string): string | undefined {
  if (nombre === "nombre" && valor.trim().length < 2) return "Escribe el nombre de quien va a nadar.";
  if (nombre === "telefono") {
    const digitos = soloDigitos(valor).replace(/^1(?=\d{10}$)/, "");
    if (digitos.length !== 10) return "Escribe un teléfono de 10 dígitos, por ejemplo 829 123 4567.";
  }
  return undefined;
}

/** "8291234567" → "(829) 123-4567". Si no son 10 dígitos, deja lo escrito. */
function formatoTelefono(valor: string) {
  const d = soloDigitos(valor).replace(/^1(?=\d{10}$)/, "");
  return d.length === 10 ? `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}` : valor.trim();
}

/** Formato mientras se escribe: "829" → "(829)", "829123" → "(829) 123", hasta "(829) 123-4567". */
function formatoParcial(valor: string) {
  const d = soloDigitos(valor);
  if (d.length > 10 || /[^\d\s()+-]/.test(valor)) return valor;
  if (d.length <= 3) return d.length === 3 ? `(${d})` : d;
  if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`;
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
}

/** Opción tipo tarjeta: un radio nativo que cubre toda la tarjeta (teclado y lector de pantalla intactos). */
function Opcion({
  name,
  value,
  marcado,
  deshabilitado = false,
  onElegir,
  className,
  children,
}: {
  name: string;
  value: string;
  marcado: boolean;
  deshabilitado?: boolean;
  onElegir: (value: string) => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-12 cursor-pointer flex-col justify-center rounded-xl border-2 px-3.5 py-2 leading-tight",
        "transition-[background-color,border-color,color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.98]",
        "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-piscina-700",
        marcado
          ? "border-marino-900 bg-marino-900 text-espuma-50"
          : "border-espuma-200 bg-white text-marino-950 hover:border-piscina-600",
        deshabilitado && "cursor-not-allowed border-dashed bg-espuma-50 text-tinta-500 hover:border-espuma-200",
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={marcado}
        disabled={deshabilitado}
        onChange={() => onElegir(value)}
        className="absolute inset-0 z-10 cursor-[inherit] appearance-none rounded-[inherit] outline-none"
      />
      {children}
    </label>
  );
}

export default function FormularioInscripcion({ programas, sucursales, programaInicial, inscripcion, whatsapp }: Props) {
  const eleccion = useEleccion();
  const [errores, setErrores] = useState<Errores>({});
  const [estado, setEstado] = useState<"editando" | "abriendo" | "enviado">("editando");
  const [enlaceEnviado, setEnlaceEnviado] = useState("");
  const [nivel, setNivel] = useState(NIVELES[0].id);
  // Lo escrito en "Horario", ligado al turno elegido en ese momento: si
  // después se elige otro turno en la pizarra, se muestra el nuevo.
  const [horarioEscrito, setHorarioEscrito] = useState<{ para: string | null; texto: string } | null>(null);
  const form = useRef<HTMLFormElement>(null);

  const programa =
    programas.find((p) => p.id === eleccion.programa) ??
    programas.find((p) => p.id === programaInicial) ??
    programas[0];
  // Si el programa no se da en la sucursal elegida, pasa a la primera donde sí.
  const sucursalId =
    eleccion.sucursal && programa.sucursalIds.includes(eleccion.sucursal) ? eleccion.sucursal : programa.sucursalIds[0];
  const sucursal = sucursales.find((s) => s.id === sucursalId);
  const pidioOtra =
    eleccion.sucursal && eleccion.sucursal !== sucursalId ? sucursales.find((s) => s.id === eleccion.sucursal) : null;
  const unicaSucursal = programa.sucursalIds.length === 1;
  const turno = decodificarTurno(eleccion.turno);
  const textoDelTurno = turno ? textoTurno(turno.dia, turno.hora) : "";
  const horario = horarioEscrito && horarioEscrito.para === eleccion.turno ? horarioEscrito.texto : textoDelTurno;

  const cambiar = (cambios: Parameters<typeof elegir>[0]) => transicion(() => elegir(cambios, undefined, "#inscripcion"));

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const nombre = e.target.name as Campo;
    if (nombre === "telefono") e.target.value = formatoTelefono(e.target.value);
    // Al salir del campo solo se avisa si ya se escribió algo: no regañamos por pasar con Tab.
    if (!e.target.value.trim() && !errores[nombre]) return;
    setErrores((previos) => ({ ...previos, [nombre]: validarCampo(nombre, e.target.value) }));
  };

  const onTelefono = (e: ChangeEvent<HTMLInputElement>) => {
    const borrando = (e.nativeEvent as InputEvent).inputType?.startsWith("delete");
    if (!borrando) e.target.value = formatoParcial(e.target.value);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nuevos: Errores = {};
    for (const nombre of ["nombre", "telefono"] as const) {
      const error = validarCampo(nombre, String(datos.get(nombre) ?? ""));
      if (error) nuevos[nombre] = error;
    }
    setErrores(nuevos);

    const primero = Object.keys(nuevos)[0];
    if (primero) {
      setEstado("editando");
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }

    const comentarios = String(datos.get("comentarios") ?? "").trim();
    const nivelElegido = NIVELES.find((n) => n.id === nivel);
    const mensaje = [
      "*Solicitud de inscripción, MC Swim Academy*",
      `*Nombre:* ${String(datos.get("nombre")).trim()}`,
      `*Teléfono:* ${formatoTelefono(String(datos.get("telefono")))}`,
      `*Programa:* ${programa.nombre}: ${programa.edad.toLowerCase()} (${programa.precio}/mes)`,
      `*Sucursal:* ${sucursal ? `${sucursal.nombre} (${sucursal.zona})` : "A consultar"}`,
      `*Horario preferido:* ${String(datos.get("horario") ?? "").trim() || "A consultar"}`,
      `*Nivel:* ${nivelElegido ? `${nivelElegido.detalle} (${nivelElegido.nombre.toLowerCase()})` : "A evaluar"}`,
      comentarios ? `*Comentarios:* ${comentarios}` : null,
      "",
      "Hola, quiero coordinar mi evaluación inicial y confirmar mi cupo.",
    ]
      .filter((linea) => linea !== null)
      .join("\n");

    const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`;
    setEnlaceEnviado(url);
    setEstado("abriendo");
    window.open(url, "_blank", "noopener");
    // Estado intermedio visible: el botón dice "Abriendo WhatsApp…" un momento.
    window.setTimeout(() => setEstado("enviado"), 700);
  };

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
      <h3 className="font-display text-display-sm font-extrabold uppercase sm:col-span-2">Datos del alumno</h3>

      <fieldset className="sm:col-span-2">
        <legend className={etiqueta}>¿Qué programa te interesa?</legend>
        <div className="mt-1.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {programas.map((p) => (
            <Opcion
              key={p.id}
              name="programa"
              value={p.id}
              marcado={p.id === programa.id}
              onElegir={(id) => cambiar({ programa: id })}
            >
              <span className="flex items-center justify-between gap-3 sm:block">
                <span>
                  <span className="block font-bold">{p.nombre}</span>
                  <span className="block text-sm opacity-80">{p.edad}</span>
                </span>
                <span className="block shrink-0 font-display text-xl font-extrabold tabular-nums sm:mt-1">
                  {p.precio}
                  <span className="font-sans text-sm font-semibold"> al mes</span>
                </span>
              </span>
            </Opcion>
          ))}
        </div>
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className={etiqueta}>Sucursal</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {sucursales.map((s) => {
            const disponible = programa.sucursalIds.includes(s.id);
            return (
              <Opcion
                key={s.id}
                name="sucursal"
                value={s.id}
                marcado={s.id === sucursalId}
                deshabilitado={!disponible}
                onElegir={(id) => cambiar({ sucursal: id })}
              >
                <span className="font-bold">{s.nombre}</span>
                {!disponible && <span className="text-xs">Sin {programa.nombre}</span>}
              </Opcion>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-2 text-sm text-tone-muted empty:hidden">
          {pidioOtra
            ? `${programa.nombre} no se da en ${pidioOtra.nombre}: te proponemos ${sucursal?.nombre}.`
            : unicaSucursal && sucursal
              ? `${programa.nombre} se da solo en la sucursal ${sucursal.nombre}.`
              : ""}
        </p>
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className={etiqueta}>¿Cómo se lleva con el agua?</legend>
        <div className="mt-1.5 grid grid-cols-3 gap-2">
          {NIVELES.map((n) => (
            <Opcion
              key={n.id}
              name="nivel"
              value={n.id}
              marcado={n.id === nivel}
              onElegir={setNivel}
              className="px-2.5 text-center"
            >
              <span className="text-[0.95rem] font-bold">{n.nombre}</span>
              <span className="text-xs opacity-80">{n.detalle}</span>
            </Opcion>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="nombre" className={etiqueta}>
          Nombre de quien va a nadar
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
          enterKeyHint="next"
          required
          placeholder="Ej. Carlos Martínez…"
          onBlur={onBlur}
          aria-invalid={errores.nombre ? true : undefined}
          aria-describedby={errores.nombre ? "nombre-error" : undefined}
          className={campo}
        />
        {errores.nombre && (
          <p id="nombre-error" className="mt-1.5 text-sm font-semibold text-corchera-600">
            {errores.nombre}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="telefono" className={etiqueta}>
          Teléfono o WhatsApp
        </label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          enterKeyHint="next"
          required
          placeholder="Ej. (829) 123-4567…"
          onChange={onTelefono}
          onBlur={onBlur}
          aria-invalid={errores.telefono ? true : undefined}
          aria-describedby={errores.telefono ? "telefono-error" : undefined}
          className={campo}
        />
        {errores.telefono && (
          <p id="telefono-error" className="mt-1.5 text-sm font-semibold text-corchera-600">
            {errores.telefono}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="horario" className={etiqueta}>
          Horario que te sirve <span className="font-normal text-tone-muted">(opcional)</span>
        </label>
        <input
          id="horario"
          name="horario"
          type="text"
          autoComplete="off"
          enterKeyHint="next"
          placeholder="Ej. sábados en la tarde…"
          value={horario}
          onChange={(e) => setHorarioEscrito({ para: eleccion.turno, texto: e.target.value })}
          className={campo}
        />
      </div>

      <div>
        <label htmlFor="comentarios" className={etiqueta}>
          Nota médica o consulta <span className="font-normal text-tone-muted">(opcional)</span>
        </label>
        <textarea
          id="comentarios"
          name="comentarios"
          rows={1}
          autoComplete="off"
          enterKeyHint="done"
          className={cn(campo, "field-sizing-content min-h-[3.25rem]")}
        />
      </div>

      {/* Lo que se va a enviar, antes del botón. */}
      <div className="resumen rounded-card bg-espuma-100 p-4 sm:col-span-2 sm:p-5">
        <p className="text-sm font-bold uppercase tracking-wide text-tinta-600">Vas a enviar</p>
        <dl className="mt-2 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 text-[0.95rem] sm:grid-cols-[auto_minmax(0,1fr)_auto_minmax(0,1fr)]">
          <dt className="text-tinta-600">Programa</dt>
          <dd className="font-semibold">
            {programa.nombre} <span className="font-normal text-tinta-600">({programa.edad})</span>
          </dd>
          <dt className="text-tinta-600">Sucursal</dt>
          <dd className="font-semibold">{sucursal?.nombre ?? "A consultar"}</dd>
          <dt className="text-tinta-600">Turno</dt>
          <dd className="font-semibold first-letter:uppercase">{horario.trim() || "A coordinar"}</dd>
          <dt className="text-tinta-600">Mensualidad</dt>
          <dd className="font-semibold tabular-nums">{programa.precio}</dd>
          <dt className="text-tinta-600">Inscripción</dt>
          <dd className="font-semibold tabular-nums">
            {inscripcion} <span className="font-normal text-tinta-600">(una vez)</span>
          </dd>
          <dt className="text-tinta-600">Primer mes</dt>
          <dd className="font-display text-xl font-extrabold leading-tight tabular-nums">{programa.primerMes}</dd>
        </dl>
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          aria-busy={estado === "abriendo" || undefined}
          className={cn("boton-wa onda min-h-14 w-full text-lg", estado === "abriendo" && "pointer-events-none")}
        >
          {estado === "abriendo" ? (
            <LoaderCircle aria-hidden className="size-6 motion-safe:animate-spin" />
          ) : (
            <MessageCircle aria-hidden className="size-6" />
          )}
          {estado === "abriendo" ? "Abriendo WhatsApp…" : "Enviar por WhatsApp"}
        </button>
        <p className="mt-3 text-center text-sm text-tone-muted">
          Se abre WhatsApp con tus datos. Nada se guarda en esta página.
        </p>
        <div aria-live="polite" className="mt-3 empty:hidden">
          {estado === "enviado" && (
            <div className="rounded-xl bg-espuma-100 p-4 motion-safe:animate-[aparecer_500ms_var(--ease-out-expo)_both]">
              <p className="flex items-center gap-2 font-semibold text-turquesa-700">
                <CheckCircle2 aria-hidden className="size-5 shrink-0" />
                Listo. Abrimos WhatsApp con tu solicitud: solo falta que la envíes.
              </p>
              <p className="mt-1 text-sm text-tinta-600">
                ¿No se abrió?{" "}
                <a
                  href={enlaceEnviado}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center font-bold text-marino-900 underline decoration-2 underline-offset-4"
                >
                  Abrir WhatsApp de nuevo
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
