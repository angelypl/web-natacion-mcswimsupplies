"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, MessageCircle, X } from "lucide-react";
import { claseBoton } from "@/components/ui/Boton";

type Props = {
  items: readonly { nombre: string; href: string }[];
  whatsapp: string;
};

export default function MenuMovil({ items, whatsapp }: Props) {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setAbierto(false);
      boton.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [abierto]);

  return (
    <div className="lg:hidden">
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto((v) => !v)}
        className="grid size-12 place-items-center rounded-pill border border-tone-line bg-marino-950/40 transition-transform duration-(--dur-rapida) active:scale-[0.94]"
      >
        {abierto ? <X aria-hidden className="size-6" /> : <Menu aria-hidden className="size-6" />}
      </button>

      <div
        id="menu-movil"
        hidden={!abierto}
        className="absolute inset-x-0 top-full border-b border-tone-line bg-marino-950 px-4 pb-6 pt-2 shadow-hondo sm:px-6"
      >
        <nav aria-label="Menú móvil">
          <ul className="divide-y divide-tone-line">
            {items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setAbierto(false)}
                  className="flex min-h-14 items-center font-display text-3xl font-extrabold uppercase"
                >
                  {item.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAbierto(false)}
          className={claseBoton("boya", "mt-4 w-full")}
        >
          <MessageCircle aria-hidden className="size-5" />
          Reservar mi cupo por WhatsApp
        </a>
      </div>
    </div>
  );
}
