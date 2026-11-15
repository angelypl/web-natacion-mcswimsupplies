import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/contacto";

// Respaldo sin JS en móvil (con JS lo sustituye la barra del pulgar). Desde
// 640 px no aparece: la cabecera ya tiene "Reservar mi cupo" y el flotante
// tapaba filtros, flechas de la galería y el formulario.

export function WhatsAppFlotante() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className="wa-flotante group/wa fixed right-4 z-40 inline-flex sm:hidden min-h-14 items-center gap-2 rounded-pill bg-whatsapp pl-4 pr-4 font-bold text-marino-950 shadow-hondo transition-transform duration-(--dur-base) ease-spring-soft hover:-translate-y-1 focus-visible:-translate-y-1 active:scale-[0.96]"
    >
      <MessageCircle aria-hidden className="size-6 transition-transform duration-(--dur-base) ease-spring-soft group-hover/wa:-rotate-12" />
    </a>
  );
}
