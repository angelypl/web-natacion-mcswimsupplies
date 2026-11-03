import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type Estilo = "suave" | "boya" | "turquesa" | "corchera" | "marino";

const ESTILOS: Record<Estilo, string> = {
  suave: "bg-tone-fg/8 text-tone-fg",
  boya: "bg-boya-400 text-marino-950",
  turquesa: "bg-turquesa-400 text-marino-950",
  corchera: "bg-corchera-600 text-white",
  marino: "bg-marino-900 text-espuma-50",
};

/** Pastilla tipo etiqueta de marca: esquinas suaves, texto en minúscula. */
export function Etiqueta({
  estilo = "suave",
  className,
  ...props
}: ComponentPropsWithoutRef<"span"> & { estilo?: Estilo }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-sm font-semibold leading-tight",
        ESTILOS[estilo],
        className,
      )}
      {...props}
    />
  );
}
