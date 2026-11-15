import { Clock, MessageCircle } from "lucide-react";
import { claseBoton } from "@/components/ui/Boton";
import { whatsappUrl } from "@/lib/contacto";
import { ACCION_PRINCIPAL } from "./navegacion";

// Barra del pulgar en móvil: a la derecha, siempre la acción principal (boya,
// al formulario). A la izquierda, un acceso que cambia con la sección que se
// lee (html[data-seccion], lo escribe ScrollEspia):
//   - en Horarios sobra "Horarios": pasa a preguntar por WhatsApp;
//   - en el resto, "Horarios".
// Sin JS no aparece y queda el botón flotante de WhatsApp.
export function BarraMovil() {
  return (
    <div
      data-tone="abismo"
      className="barra-movil fixed inset-x-0 bottom-0 z-40 border-t border-tone-line bg-marino-950/94 px-4 pt-3 text-tone-fg backdrop-blur-md sm:hidden"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[8.75rem_minmax(0,1fr)] gap-2.5">
        <a href="#horarios" className={claseBoton("contorno", "barra-horarios h-12 whitespace-nowrap px-4")}>
          <Clock aria-hidden className="size-5" />
          Horarios
        </a>
        <a
          href={whatsappUrl("Hola MC Swim Academy, quiero preguntar por un horario.")}
          target="_blank"
          rel="noopener noreferrer"
          className="boton-wa barra-preguntar hidden h-12 whitespace-nowrap px-4"
        >
          <MessageCircle aria-hidden className="size-5" />
          Preguntar
        </a>
        <a href="#inscripcion" className={claseBoton("boya", "onda h-12 whitespace-nowrap px-4")}>
          {ACCION_PRINCIPAL}
        </a>
      </div>
    </div>
  );
}
