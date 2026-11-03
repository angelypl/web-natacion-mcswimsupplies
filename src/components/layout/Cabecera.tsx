import { MessageCircle } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { whatsappUrl } from "@/lib/contacto";
import { Logo } from "./Logo";
import MenuMovil from "./MenuMovil";
import { NAV } from "./navegacion";

// Transparente sobre el hero; el fondo aparece con el scroll por CSS
// scroll-driven (.cabecera-fondo). Sin soporte, el fondo está siempre.
export function Cabecera() {
  return (
    <header data-tone="abismo" className="fixed inset-x-0 top-0 z-50 text-tone-fg">
      <div
        aria-hidden
        className="cabecera-fondo absolute inset-0 border-b border-tone-line bg-marino-950/92 backdrop-blur-md"
      />
      <div className="relative mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="group/nav relative inline-flex min-h-11 items-center px-3.5 text-[0.95rem] font-semibold"
                >
                  {item.nombre}
                  <span
                    aria-hidden
                    className="absolute inset-x-3.5 bottom-2 h-0.5 origin-left scale-x-0 rounded-pill bg-turquesa-400 transition-transform duration-(--dur-base) ease-out-expo group-hover/nav:scale-x-100 group-focus-visible/nav:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <BotonLink
            href={whatsappUrl()}
            externo
            variante="boya"
            icono={<MessageCircle className="size-5" />}
            className="hidden min-h-11 px-5 py-2.5 text-[0.95rem] sm:inline-flex"
          >
            Reservar cupo
          </BotonLink>
          <MenuMovil items={NAV} whatsapp={whatsappUrl()} />
        </div>
      </div>
    </header>
  );
}
