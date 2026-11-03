import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  titulo: ReactNode;
  entradilla?: ReactNode;
  tamano?: "xl" | "lg";
  className?: string;
};

/** Encabezado de sección: titular condensado en mayúsculas + entradilla. */
export function Titular({ id, titulo, entradilla, tamano = "lg", className }: Props) {
  return (
    <header className={cn("max-w-3xl", className)} data-reveal>
      <h2
        id={id}
        className={cn(
          "font-display font-extrabold uppercase tracking-[-0.01em]",
          tamano === "xl" ? "text-display-xl" : "text-display-lg",
        )}
      >
        {titulo}
      </h2>
      {entradilla && <p className="mt-5 max-w-2xl text-lead text-tone-muted">{entradilla}</p>}
    </header>
  );
}
