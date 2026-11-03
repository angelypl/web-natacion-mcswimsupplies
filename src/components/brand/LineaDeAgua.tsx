import { cn } from "@/lib/cn";

/**
 * Borde ondulado entre secciones. Se pinta con `currentColor`: dale el color
 * de la sección siguiente (`text-espuma-50`, `text-piscina-500`…).
 */
export function LineaDeAgua({ className, invertida = false }: { className?: string; invertida?: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      className={cn("block h-8 w-full sm:h-12 lg:h-16", invertida && "rotate-180", className)}
    >
      <path
        fill="currentColor"
        d="M0 38C120 18 240 8 360 14s240 34 360 38 240-22 360-34 240-2 360 12v34H0Z"
      />
    </svg>
  );
}

/** Salpicadura del logo (gotas). Decorativa. */
export function Gotas({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 120" className={cn("block", className)} fill="currentColor">
      <path d="M58 6c10 14 16 26 16 36a16 16 0 0 1-32 0c0-10 6-22 16-36Z" />
      <path d="M96 40c6 8 9 15 9 20a9 9 0 0 1-18 0c0-5 3-12 9-20Z" opacity=".7" />
      <path d="M24 52c5 7 8 12 8 16a8 8 0 0 1-16 0c0-4 3-9 8-16Z" opacity=".55" />
      <path d="M8 96c22 10 52 14 104-6-18 22-46 30-70 26S12 104 8 96Z" opacity=".85" />
    </svg>
  );
}

/** Líneas de carril a ~6 % de opacidad para fondos oscuros. */
export function PatronCarriles({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, transparent 0 calc(12.5% - 2px), rgb(243 250 252 / 0.06) calc(12.5% - 2px) 12.5%)",
      }}
    />
  );
}
