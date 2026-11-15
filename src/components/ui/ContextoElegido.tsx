"use client";

import { X } from "lucide-react";
import { decodificarTurno, elegir, useEleccion, type Eleccion } from "@/lib/eleccion";
import { cn } from "@/lib/cn";
import { textoTurno } from "@/lib/horas";

export type OpcionNombre = { id: string; nombre: string };

type Props = {
  programas: OpcionNombre[];
  sedes: OpcionNombre[];
  className?: string;
};

// "Tu elección: Adultos ✕ · Utesa ✕ · lunes, 5:00 p. m. ✕". Cada parte se
// quita por separado; si no hay nada elegido no pinta nada.
export function ContextoElegido({ programas, sedes, className }: Props) {
  const eleccion = useEleccion();
  const turno = decodificarTurno(eleccion.turno);
  const partes: { clave: keyof Eleccion; texto: string }[] = [];
  const programa = programas.find((p) => p.id === eleccion.programa);
  const sede = sedes.find((s) => s.id === eleccion.sucursal);
  if (programa) partes.push({ clave: "programa", texto: programa.nombre });
  if (sede) partes.push({ clave: "sucursal", texto: sede.nombre });
  if (turno) partes.push({ clave: "turno", texto: textoTurno(turno.dia, turno.hora) });
  if (partes.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm font-bold">Tu elección:</span>
      {partes.map(({ clave, texto }) => (
        <button
          key={clave}
          type="button"
          onClick={() => elegir({ [clave]: null })}
          className="group/chip inline-flex min-h-11 items-center gap-1.5 rounded-pill border-2 border-current/25 py-1 pl-3.5 pr-2 text-sm font-semibold transition-[border-color,transform] duration-(--dur-base) ease-spring-soft hover:border-current active:scale-[0.96]"
        >
          <span className="first-letter:uppercase">{texto}</span>
          <span className="grid size-6 place-items-center rounded-full bg-current/12 transition-transform duration-(--dur-base) group-hover/chip:rotate-90">
            <X aria-hidden className="size-3.5" strokeWidth={3} />
          </span>
          <span className="sr-only">(quitar)</span>
        </button>
      ))}
      {partes.length > 1 && (
        <button
          type="button"
          onClick={() => elegir({ programa: null, sucursal: null, turno: null })}
          className="min-h-11 px-2 text-sm font-semibold underline decoration-current/40 underline-offset-4 hover:decoration-current"
        >
          Quitar todo
        </button>
      )}
    </div>
  );
}
