import { BotonLink } from "@/components/ui/Boton";
import { SITE } from "@/content/site";
import { TEL_URL, whatsappUrl } from "@/lib/contacto";
import { Logo } from "./Logo";
import MenuMovil from "./MenuMovil";
import { ACCION_PRINCIPAL, NAV, NAV_CABECERA } from "./navegacion";

// Transparente sobre el hero; el fondo aparece con el scroll por CSS
// scroll-driven (.cabecera-fondo). Sin soporte, el fondo está siempre.
export function Cabecera() {
  return (
    <header data-tone="abismo" className="cabecera fixed inset-x-0 top-0 z-50 text-tone-fg">
      <div
        aria-hidden
        className="cabecera-fondo absolute inset-0 border-b border-tone-line bg-marino-950/92 backdrop-blur-md"
      />
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-3 px-4 xl:gap-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_CABECERA.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  data-nav
                  className="group/nav relative inline-flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.95rem] xl:px-3.5 font-semibold text-tone-fg/80 transition-colors duration-(--dur-base) hover:text-tone-fg aria-[current]:text-tone-fg"
                >
                  {item.nombre}
                  <span
                    aria-hidden
                    className="absolute inset-x-2.5 bottom-2 xl:inset-x-3.5 h-0.5 origin-left scale-x-0 rounded-pill bg-turquesa-400 transition-transform duration-(--dur-base) ease-out-expo group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100 group-aria-[current]/nav:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BotonLink
            href="#inscripcion"
            data-nav
            variante="boya"
            className="onda hidden min-h-11 whitespace-nowrap px-4 py-2.5 text-[0.95rem] sm:inline-flex xl:px-5"
          >
            {ACCION_PRINCIPAL}
          </BotonLink>
          <MenuMovil
            items={NAV}
            whatsapp={whatsappUrl()}
            telefono={{ href: TEL_URL, visible: SITE.telefono.visible }}
          />
        </div>
      </div>
      {/* Progreso de lectura (scroll-driven; oculto sin soporte). */}
      <div
        aria-hidden
        className="progreso-scroll absolute inset-x-0 bottom-0 h-[3px] bg-linear-to-r from-turquesa-400 to-agua-300"
      />
    </header>
  );
}
