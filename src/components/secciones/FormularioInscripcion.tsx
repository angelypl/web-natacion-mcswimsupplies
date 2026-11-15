"use client";

import { useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Programa = {
  id: string;
  nombre: string;
  /** "De 2 a 3 años" */
  edad: string;
  /** "RD$3,000" */
  precio: string;
  /** Sucursales donde se da. */
  sucursalIds: string[];
};
type Sucursal = { id: string; nombre: string; zona: string };

type Props = {
  programas: Programa[];
  sucursales: Sucursal[];
  /** Programa marcado al cargar. */
  programaInicial: string;
  /** Número de WhatsApp (solo dígitos). */
  whatsapp: string;
};

const NIVELES = [
  { id: "principiante", nombre: "Desde cero", detalle: "Principiante" },
  { id: "intermedio", nombre: "Flota y se desplaza", detalle: "Intermedio" },
  { id: "avanzado", nombre: "Domina estilos", detalle: "Avanzado" },
];

type Campo = "nombre" | "telefono";
type Errores = Partial<Record<Campo, string>>;

const campo =
  "mt-2 block w-full rounded-xl border-2 border-espuma-200 bg-white px-4 py-3 text-base text-marino-950 " +
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

/** Opción tipo tarjeta: un radio nativo que cubre toda la tarjeta (teclado y lector de pantalla intactos). */
function Opcion({
  name,
  value,
  marcado,
  deshabilitado = false,
  onElegir,
  children,
}: {
  name: string;
  value: string;
  marcado: boolean;
  deshabilitado?: boolean;
  onElegir: (value: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-14 cursor-pointer flex-col justify-center rounded-xl border-2 px-4 py-2.5 leading-tight",
        "transition-[background-color,border-color,color,transform] duration-(--dur-base) ease-spring-soft active:scale-[0.98]",
        "has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-piscina-700",
        marcado
          ? "border-marino-900 bg-marino-900 text-espuma-50"
          : "border-espuma-200 bg-white text-marino-950 hover:border-piscina-600",
        deshabilitado && "cursor-not-allowed border-dashed bg-espuma-50 text-tinta-500 hover:border-espuma-200",
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

export default function FormularioInscripcion({ programas, sucursales, programaInicial, whatsapp }: Props) {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);
  const [programaId, setProgramaId] = useState(programaInicial);
  const [sucursalElegida, setSucursalElegida] = useState(sucursales[0]?.id ?? "");
  const [nivel, setNivel] = useState(NIVELES[0].id);
  const form = useRef<HTMLFormElement>(null);

  const programa = programas.find((p) => p.id === programaId) ?? programas[0];
  // Si el programa no se da en la sucursal elegida, pasa a la primera donde sí.
  const sucursalId = programa.sucursalIds.includes(sucursalElegida) ? sucursalElegida : programa.sucursalIds[0];
  const sucursal = sucursales.find((s) => s.id === sucursalId);
  const unicaSucursal = programa.sucursalIds.length === 1;

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const nombre = e.target.name as Campo;
    if (nombre === "telefono") e.target.value = formatoTelefono(e.target.value);
    // Al salir del campo solo se avisa si ya se escribió algo: no regañamos por pasar con Tab.
    if (!e.target.value.trim() && !errores[nombre]) return;
    setErrores((previos) => ({ ...previos, [nombre]: validarCampo(nombre, e.target.value) }));
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
      setEnviado(false);
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

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensaje)}`, "_blank", "noopener");
    setEnviado(true);
  };

  return (
    <form ref={form} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2">
      <h3 className="font-display text-display-sm font-extrabold uppercase sm:col-span-2">Datos del alumno</h3>

      <fieldset className="sm:col-span-2">
        <legend className={etiqueta}>¿Qué programa te interesa?</legend>
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {programas.map((p) => (
            <Opcion key={p.id} name="programa" value={p.id} marcado={p.id === programa.id} onElegir={setProgramaId}>
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
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {sucursales.map((s) => {
            const disponible = programa.sucursalIds.includes(s.id);
            return (
              <Opcion
                key={s.id}
                name="sucursal"
                value={s.id}
                marcado={s.id === sucursalId}
                deshabilitado={!disponible}
                onElegir={setSucursalElegida}
              >
                <span className="font-bold">{s.nombre}</span>
                <span className="text-sm opacity-80">{disponible ? s.zona : `No ofrece ${programa.nombre}`}</span>
              </Opcion>
            );
          })}
        </div>
        <p aria-live="polite" className="mt-2 text-sm text-tone-muted empty:hidden">
          {unicaSucursal && sucursal && `${programa.nombre} se da solo en la sucursal ${sucursal.nombre}.`}
        </p>
      </fieldset>

      <fieldset className="sm:col-span-2">
        <legend className={etiqueta}>¿Cómo se lleva con el agua?</legend>
        <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          {NIVELES.map((n) => (
            <Opcion key={n.id} name="nivel" value={n.id} marcado={n.id === nivel} onElegir={setNivel}>
              <span className="font-bold">{n.nombre}</span>
              <span className="text-sm opacity-80">{n.detalle}</span>
            </Opcion>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="nombre" className={etiqueta}>
          Nombre completo de quien va a nadar
        </label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autoComplete="name"
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
          required
          placeholder="Ej. (829) 123-4567…"
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

      <div className="sm:col-span-2">
        <label htmlFor="horario" className={etiqueta}>
          Horario que te sirve <span className="font-normal text-tone-muted">(opcional)</span>
        </label>
        <input
          id="horario"
          name="horario"
          type="text"
          autoComplete="off"
          placeholder="Ej. sábados en la tarde…"
          className={campo}
        />
      </div>

      <div className="sm:col-span-2">
        <label htmlFor="comentarios" className={etiqueta}>
          ¿Alguna nota médica o consulta? <span className="font-normal text-tone-muted">(opcional)</span>
        </label>
        <textarea id="comentarios" name="comentarios" rows={3} autoComplete="off" className={campo} />
      </div>

      <div className="sm:col-span-2">
        <button
          type="submit"
          className={cn(
            "group/enviar inline-flex min-h-14 w-full items-center justify-center gap-2.5 rounded-pill bg-whatsapp px-6 py-3 text-lg font-bold text-marino-950 shadow-flota",
            "transition-[transform,box-shadow] duration-(--dur-base) ease-spring-soft hover:-translate-y-0.5 hover:shadow-hondo focus-visible:-translate-y-0.5 active:scale-[0.97]",
          )}
        >
          <MessageCircle aria-hidden className="size-6 transition-transform duration-(--dur-base) ease-spring-soft group-hover/enviar:-rotate-12" />
          Enviar por WhatsApp
        </button>
        <p className="mt-3 text-center text-sm text-tone-muted">
          Se abre WhatsApp con tus datos. Nada se guarda en esta página.
        </p>
        <p aria-live="polite" className="mt-3 empty:hidden">
          {enviado && (
            <span className="flex items-center gap-2 rounded-xl bg-espuma-100 p-4 font-semibold text-turquesa-700 motion-safe:animate-[aparecer_500ms_var(--ease-out-expo)_both]">
              <CheckCircle2 aria-hidden className="size-5 shrink-0" />
              Listo. Abrimos WhatsApp con tu solicitud: solo falta que la envíes.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
