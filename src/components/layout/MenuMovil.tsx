"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight, Menu, MessageCircle, Phone, X } from "lucide-react";
import { claseBoton } from "@/components/ui/Boton";
import { cn } from "@/lib/cn";
import { ACCION_PRINCIPAL } from "./navegacion";

type Props = {
  items: readonly { nombre: string; href: string }[];
  whatsapp: string;
  telefono: { href: string; visible: string };
};

// Panel a pantalla completa bajo la cabecera. Mientras está abierto la página
// no se desplaza (html[data-menu]) y Tab no sale del menú.
export default function MenuMovil({ items, whatsapp, telefono }: Props) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const raiz = document.documentElement;
    raiz.dataset.menu = "";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false);
        boton.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      // Ciclo de foco: botón de cerrar + enlaces del panel.
      const focos = [boton.current, ...(panel.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      );
      const primero = focos[0];
      const ultimo = focos[focos.length - 1];
      if (e.shiftKey && document.activeElement === primero) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && document.activeElement === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    // Si la pantalla crece hasta el menú de escritorio, se cierra solo.
    const escritorio = window.matchMedia("(min-width: 1024px)");
    const onCambio = () => {
      if (escritorio.matches) setAbierto(false);
    };

    document.addEventListener("keydown", onKey);
    escritorio.addEventListener("change", onCambio);
    return () => {
      delete raiz.dataset.menu;
      document.removeEventListener("keydown", onKey);
      escritorio.removeEventListener("change", onCambio);
    };
  }, [abierto]);

  const cerrar = () => setAbierto(false);

  return (
    <div className="lg:hidden">
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto((v) => !v)}
        className="relative grid size-12 place-items-center rounded-pill border border-tone-line bg-marino-950/40 transition-transform duration-(--dur-rapida) active:scale-[0.94]"
      >
        <Menu
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 size-6 transition-[opacity,transform] duration-(--dur-base) ease-out-expo",
            abierto && "rotate-90 scale-50 opacity-0",
          )}
        />
        <X
          aria-hidden
          className={cn(
            "col-start-1 row-start-1 size-6 transition-[opacity,transform] duration-(--dur-base) ease-out-expo",
            !abierto && "-rotate-90 scale-50 opacity-0",
          )}
        />
      </button>

      <div
        ref={panel}
        id="menu-movil"
        hidden={!abierto}
        className="menu-panel absolute inset-x-0 top-full flex h-[calc(100dvh-5rem)] flex-col overflow-y-auto overscroll-contain bg-marino-950 px-4 pb-8 pt-2 sm:px-6"
      >
        <nav aria-label="Menú móvil">
          <ul className="divide-y divide-tone-line border-b border-tone-line">
            {items.map((item, i) => (
              <li key={item.href} className="menu-item" style={{ "--i": i } as CSSProperties}>
                <a
                  href={item.href}
                  onClick={cerrar}
                  className="flex min-h-14 items-center justify-between gap-4 font-display text-display-md font-extrabold uppercase active:text-turquesa-400"
                >
                  {item.nombre}
                  <ArrowRight aria-hidden className="size-6 text-turquesa-400" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="menu-item mt-auto grid gap-3 pt-8" style={{ "--i": items.length } as CSSProperties}>
          <a href="#inscripcion" onClick={cerrar} className={claseBoton("boya", "w-full")}>
            {ACCION_PRINCIPAL}
          </a>
          <div className="grid grid-cols-2 gap-3">
            <a href={whatsapp} target="_blank" rel="noopener noreferrer" onClick={cerrar} className="boton-wa px-4">
              <MessageCircle aria-hidden className="size-5" />
              WhatsApp
            </a>
            <a href={telefono.href} onClick={cerrar} className={claseBoton("contorno", "px-4")}>
              <Phone aria-hidden className="size-5" />
              Llamar
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
