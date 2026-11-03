import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type Tone = "espuma" | "blanco" | "marino" | "abismo" | "piscina" | "boya";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  tone: Tone;
  /** Ancho del contenedor interno; `none` para secciones a sangre. */
  container?: "base" | "estrecho" | "none";
};

export function Section({ tone, container = "base", className, children, ...props }: SectionProps) {
  return (
    <section data-tone={tone} className={cn("relative bg-tone-bg text-tone-fg", className)} {...props}>
      {container === "none" ? (
        children
      ) : (
        <div className={cn("mx-auto px-4 sm:px-6 lg:px-8", container === "base" ? "max-w-7xl" : "max-w-4xl")}>
          {children}
        </div>
      )}
    </section>
  );
}

export function Contenedor({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
