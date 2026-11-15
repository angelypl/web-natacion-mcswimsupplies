import { Clock, MessageCircle } from "lucide-react";
import { claseBoton } from "@/components/ui/Boton";
import { whatsappUrl } from "@/lib/contacto";

// Las dos acciones que más se buscan desde el celular, siempre al alcance del
// pulgar. La muestra ScrollEspia (html[data-barra]); sin JS no aparece y queda
// el botón flotante de WhatsApp.
export function BarraMovil() {
  return (
    <div
      data-tone="abismo"
      className="barra-movil fixed inset-x-0 bottom-0 z-40 border-t border-tone-line bg-marino-950/94 px-4 pt-3 text-tone-fg backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-2.5">
        <a href="#horarios" className={claseBoton("contorno", "px-5")}>
          <Clock aria-hidden className="size-5" />
          Horarios
        </a>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={claseBoton("whatsapp")}>
          <MessageCircle aria-hidden className="size-5" />
          Reservar mi cupo
        </a>
      </div>
    </div>
  );
}
