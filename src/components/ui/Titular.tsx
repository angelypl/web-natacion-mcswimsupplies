import { Fragment, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Parte el texto en palabras para que cada una suba por separado al entrar en
 * vista (ver `.palabra` en globals.css). Los espacios quedan fuera de los
 * spans: el salto de línea y `text-wrap: balance` siguen funcionando.
 */
export function Palabras({ texto }: { texto: string }) {
  return texto.split(" ").map((palabra, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="palabra" style={{ "--i": i } as CSSProperties}>
        <span>{palabra}</span>
      </span>
    </Fragment>
  ));
}

type Props = {
  id?: string;
  titulo: string;
  entradilla?: ReactNode;
  tamano?: "xl" | "lg";
  className?: string;
};

/** Encabezado de sección: titular condensado en mayúsculas + entradilla. */
export function Titular({ id, titulo, entradilla, tamano = "lg", className }: Props) {
  return (
    <header className={cn("max-w-3xl", className)} data-reveal="titular">
      <h2
        id={id}
        className={cn(
          "font-display font-extrabold uppercase tracking-[-0.01em]",
          tamano === "xl" ? "text-display-xl" : "text-display-lg",
        )}
      >
        <Palabras texto={titulo} />
      </h2>
      {entradilla && <p className="entradilla mt-5 max-w-2xl text-lead text-tone-muted">{entradilla}</p>}
    </header>
  );
}
