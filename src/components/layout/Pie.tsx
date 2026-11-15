import { ArrowUp, MessageCircle, Phone } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { SITE } from "@/content/site";
import { TEL_URL, listaNatural, whatsappUrl } from "@/lib/contacto";
import { NAV } from "./navegacion";

const enlace =
  "group/enlace relative inline-flex min-h-11 items-center gap-2 hover:text-tone-fg focus-visible:text-tone-fg";

// Compacto: rótulo, navegación en una fila, contacto y sucursales en una línea.
// El detalle de cada sucursal ya está en su sección.
export function Pie() {
  return (
    <footer data-tone="abismo" className="relative bg-tone-bg pb-28 text-tone-fg sm:pb-10">
      <Corchera />
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p
              aria-hidden
              className="font-display text-[clamp(3.5rem,1rem+12vw,8rem)] font-extrabold uppercase leading-[0.86] text-espuma-50/90"
            >
              MC Swim <span className="text-turquesa-400">Academy</span>
            </p>
            <p className="mt-4 max-w-xl text-tone-muted">
              Sucursales {listaNatural(SITE.sucursales.map((s) => s.nombre))}. {SITE.ciudad}, {SITE.pais}.
            </p>
          </div>

          <ul className="grid grid-cols-1 text-tone-muted sm:grid-cols-3 lg:grid-cols-1">
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={enlace}>
                <span className="grid size-6 place-items-center rounded-full bg-whatsapp text-marino-950">
                  <MessageCircle aria-hidden className="size-3.5" />
                </span>
                WhatsApp {SITE.telefono.visible}
              </a>
            </li>
            <li>
              <a href={TEL_URL} className={enlace}>
                <Phone aria-hidden className="size-4 text-turquesa-400" />
                Llamar al {SITE.telefono.visible}
              </a>
            </li>
            <li>
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className={enlace}>
                <InstagramIcono className="size-4 text-turquesa-400" />
                {SITE.instagram.usuario}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Pie de página" className="mt-8 border-t border-tone-line pt-4">
          <ul className="flex flex-wrap gap-x-5 text-tone-muted">
            {NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={enlace}>
                  {item.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-4 flex flex-col gap-1 border-t border-tone-line pt-4 text-sm text-tone-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE.nombre}. Todos los derechos reservados.
          </p>
          <a href="#top" className={enlace}>
            Subir al inicio
            <ArrowUp
              aria-hidden
              className="size-4 transition-transform duration-(--dur-base) ease-spring-soft group-hover/enlace:-translate-y-1"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
