import Image from "next/image";
import { cn } from "@/lib/cn";
import logo from "../../../public/logo-mc-swim-academy-recorte.jpg";

// TODO_CLIENTE: pedir el logo oficial en SVG (o PNG transparente). El JPEG
// tiene fondo blanco, por eso va sobre una chapa blanca.
export function Logo({ className, tamano = "md" }: { className?: string; tamano?: "md" | "lg" }) {
  return (
    <a
      href="#top"
      className={cn(
        "group/logo inline-flex shrink-0 items-center gap-3 rounded-card",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-[0.9rem] bg-white p-1 shadow-flota transition-transform duration-(--dur-base) ease-spring-soft group-hover/logo:-rotate-3 group-hover/logo:scale-105",
          tamano === "md" ? "h-12 w-14" : "h-20 w-24",
        )}
      >
        <Image src={logo} alt="" sizes={tamano === "md" ? "56px" : "96px"} className="h-full w-full object-contain" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-extrabold uppercase tracking-wide">MC Swim</span>
        <span className="text-xs font-semibold text-tone-muted">Academia de natación</span>
      </span>
    </a>
  );
}
