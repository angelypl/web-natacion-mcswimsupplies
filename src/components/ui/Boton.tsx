import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Variante = "boya" | "marino" | "whatsapp" | "contorno";

const base =
  "group/boton inline-flex min-h-12 items-center justify-center gap-2.5 rounded-pill px-6 py-3 text-base font-bold " +
  "transition-[transform,box-shadow,background-color] duration-(--dur-base) ease-spring-soft " +
  "hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] " +
  "disabled:pointer-events-none disabled:opacity-60";

// Texto oscuro sobre boya y WhatsApp: el blanco no pasa contraste AA.
export const VARIANTES: Record<Variante, string> = {
  boya: "bg-boya-400 text-marino-950 shadow-flota hover:bg-boya-300 hover:shadow-hondo focus-visible:bg-boya-300",
  marino: "bg-marino-900 text-espuma-50 shadow-flota hover:bg-marino-800 hover:shadow-hondo focus-visible:bg-marino-800",
  whatsapp: "bg-whatsapp text-marino-950 shadow-flota hover:shadow-hondo hover:brightness-105 focus-visible:brightness-105",
  contorno:
    "border-2 border-current text-tone-fg hover:bg-tone-fg/8 focus-visible:bg-tone-fg/8",
};

type BotonLinkProps = ComponentPropsWithoutRef<"a"> & {
  variante?: Variante;
  icono?: ReactNode;
  /** Abre en otra pestaña (WhatsApp, Maps, Instagram). */
  externo?: boolean;
};

export function BotonLink({ variante = "boya", icono, externo, className, children, ...props }: BotonLinkProps) {
  return (
    <a
      className={cn(base, VARIANTES[variante], className)}
      {...(externo ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...props}
    >
      {icono && (
        <span aria-hidden className="transition-transform duration-(--dur-base) ease-spring-soft group-hover/boton:-rotate-12 group-hover/boton:scale-110">
          {icono}
        </span>
      )}
      <span>{children}</span>
    </a>
  );
}

export function claseBoton(variante: Variante = "boya", className?: string) {
  return cn(base, VARIANTES[variante], className);
}
