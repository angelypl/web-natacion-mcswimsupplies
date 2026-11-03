import { ArrowUp, MapPin, MessageCircle, Phone } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { InstagramIcono } from "@/components/ui/InstagramIcono";
import { SITE } from "@/content/site";
import { TEL_URL, listaNatural, whatsappUrl } from "@/lib/contacto";
import { NAV } from "./navegacion";

const enlace =
  "group/enlace relative inline-flex min-h-11 items-center gap-2 hover:text-tone-fg focus-visible:text-tone-fg";

export function Pie() {
  return (
    <footer data-tone="abismo" className="relative bg-tone-bg pb-28 text-tone-fg sm:pb-12">
      <Corchera />
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 lg:px-8">
        <p
          aria-hidden
          className="font-display text-display-xl font-extrabold uppercase text-espuma-50/90 sm:text-display-2xl"
        >
          MC Swim
          <span className="block text-turquesa-400">Academy</span>
        </p>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-tone-line pt-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
          <div>
            <p className="max-w-sm text-tone-muted">{SITE.descripcionCorta}</p>
          </div>

          <nav aria-label="Pie de página">
            <h2 className="font-display text-xl font-extrabold uppercase text-turquesa-400">La web</h2>
            <ul className="mt-3 text-tone-muted">
              {NAV.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={enlace}>
                    {item.nombre}
                  </a>
                </li>
              ))}
              <li>
                <a href="#inscripcion" className={enlace}>
                  Inscripción
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-display text-xl font-extrabold uppercase text-turquesa-400">Sucursales</h2>
            <ul className="mt-4 space-y-5">
              {SITE.sucursales.map((s) => (
                <li key={s.id} className="border-l-2 border-turquesa-400 pl-3">
                  <p className="font-bold">Sucursal {s.nombre}</p>
                  <p className="text-sm text-tone-muted">{s.zona}</p>
                  <p className="mt-1 text-sm text-tone-muted first-letter:uppercase">{listaNatural(s.dias)}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-display text-xl font-extrabold uppercase text-turquesa-400">Contacto</h2>
            <ul className="mt-3 text-tone-muted">
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={enlace}>
                  <MessageCircle aria-hidden className="size-4 text-turquesa-400" />
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
              <li className="flex min-h-11 items-center gap-2">
                <MapPin aria-hidden className="size-4 shrink-0 text-turquesa-400" />
                {SITE.ciudad}, {SITE.pais}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-tone-line pt-6 text-sm text-tone-muted sm:flex-row sm:items-center sm:justify-between">
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
