"use client";

import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { cn } from "@/lib/cn";

type Opcion = { id: string; etiqueta: string };

type Props = {
  programas: Opcion[];
  sucursales: Opcion[];
  /** Número de WhatsApp (solo dígitos). */
  whatsapp: string;
};

const NIVELES: Opcion[] = [
  { id: "principiante", etiqueta: "Principiante (desde cero)" },
  { id: "intermedio", etiqueta: "Intermedio (flota y se desplaza)" },
  { id: "avanzado", etiqueta: "Avanzado (domina técnica y estilos)" },
];

type Errores = Partial<Record<"nombre" | "telefono", string>>;

const campo =
  "mt-2 block w-full rounded-xl border-2 border-espuma-200 bg-white px-4 py-3 text-base text-marino-950 " +
  "placeholder:text-tinta-500 transition-[border-color,box-shadow] duration-(--dur-rapida) " +
  "hover:border-piscina-600 focus:border-piscina-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-piscina-500/25 " +
  "aria-invalid:border-corchera-600";
const etiqueta = "block font-bold";

function validar(datos: FormData): Errores {
  const errores: Errores = {};
  const nombre = String(datos.get("nombre") ?? "").trim();
  const telefono = String(datos.get("telefono") ?? "").replace(/\D/g, "");
  if (nombre.length < 2) errores.nombre = "Escribe el nombre de quien va a nadar.";
  if (telefono.length < 10) errores.telefono = "Escribe un teléfono de 10 dígitos, por ejemplo 829 123 4567.";
  return errores;
}

export default function FormularioInscripcion({ programas, sucursales, whatsapp }: Props) {
  const [errores, setErrores] = useState<Errores>({});
  const [enviado, setEnviado] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const etiquetaDe = (opciones: Opcion[], id: FormDataEntryValue | null) =>
    opciones.find((o) => o.id === id)?.etiqueta ?? "";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const datos = new FormData(e.currentTarget);
    const nuevos = validar(datos);
    setErrores(nuevos);

    const primero = Object.keys(nuevos)[0];
    if (primero) {
      setEnviado(false);
      form.current?.querySelector<HTMLElement>(`[name="${primero}"]`)?.focus();
      return;
    }

    const comentarios = String(datos.get("comentarios") ?? "").trim();
    const mensaje = [
      "*Solicitud de inscripción, MC Swim Academy*",
      `*Nombre:* ${String(datos.get("nombre")).trim()}`,
      `*Teléfono:* ${String(datos.get("telefono")).trim()}`,
      `*Programa:* ${etiquetaDe(programas, datos.get("programa"))}`,
      `*Sucursal:* ${etiquetaDe(sucursales, datos.get("sucursal"))}`,
      `*Horario preferido:* ${String(datos.get("horario") ?? "").trim() || "A consultar"}`,
      `*Nivel:* ${etiquetaDe(NIVELES, datos.get("nivel"))}`,
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
    <form ref={form} onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <h3 className="font-display text-display-sm font-extrabold uppercase sm:col-span-2">Datos del alumno</h3>

      <div className="sm:col-span-2">
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

      <div className="sm:col-span-2">
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
        <label htmlFor="programa" className={etiqueta}>
          Programa
        </label>
        <select id="programa" name="programa" defaultValue={programas[1]?.id} className={campo}>
          {programas.map((p) => (
            <option key={p.id} value={p.id}>
              {p.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sucursal" className={etiqueta}>
          Sucursal
        </label>
        <select id="sucursal" name="sucursal" defaultValue={sucursales[0]?.id} className={campo}>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.etiqueta}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="horario" className={etiqueta}>
          Horario que te sirve
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

      <div>
        <label htmlFor="nivel" className={etiqueta}>
          Nivel actual
        </label>
        <select id="nivel" name="nivel" defaultValue="principiante" className={campo}>
          {NIVELES.map((n) => (
            <option key={n.id} value={n.id}>
              {n.etiqueta}
            </option>
          ))}
        </select>
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
            <span className="flex items-center gap-2 rounded-xl bg-espuma-100 p-4 font-semibold text-turquesa-700">
              <CheckCircle2 aria-hidden className="size-5 shrink-0" />
              Listo. Abrimos WhatsApp con tu solicitud: solo falta que la envíes.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
