import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/contacto";

export function WhatsAppFlotante() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
      className="wa-flotante group/wa fixed right-4 z-40 inline-flex min-h-14 items-center gap-2 rounded-pill bg-whatsapp pl-4 pr-4 font-bold text-marino-950 shadow-hondo transition-transform duration-(--dur-base) ease-spring-soft hover:-translate-y-1 focus-visible:-translate-y-1 active:scale-[0.96] sm:right-6 sm:pr-5"
    >
      <MessageCircle aria-hidden className="size-6 transition-transform duration-(--dur-base) ease-spring-soft group-hover/wa:-rotate-12" />
      <span className="hidden sm:inline">Escríbenos</span>
    </a>
  );
}
