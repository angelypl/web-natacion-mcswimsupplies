"use client";

import { useEffect } from "react";
import { CLAVES, alCambiarEleccion, elegir, useEleccion } from "@/lib/eleccion";

// Enlaces del servidor con `data-elegir` (hero, carriles, sucursales):
//   <a href="?programa=adultos#horarios" data-elegir>
// Sin JS, el navegador recarga con esa URL y la página lee la elección igual.
// Con JS, se aplica sin recargar y se lleva al ancla.
//
// Además:
// - copia la elección a <html data-programa data-sucursal> para que las
//   secciones del servidor marquen lo elegido solo con CSS;
// - destello: cuando cambia una parte de la elección, parpadea una vez lo que
//   depende de ella ([data-destello~="programa"], etc.);
// - onda: en los botones `.onda`, una onda corta nace del punto de toque.
export default function EleccionRoot() {
  const eleccion = useEleccion();

  useEffect(() => {
    const alPulsar = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const enlace = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-elegir]");
      if (!enlace) return;
      const url = new URL(enlace.href);
      if (url.pathname !== window.location.pathname) return;
      e.preventDefault();
      const cambios = Object.fromEntries(
        CLAVES.filter((c) => url.searchParams.has(c)).map((c) => [c, url.searchParams.get(c) || null]),
      );
      elegir(cambios, url.hash || undefined);
    };

    const alTocar = (e: PointerEvent) => {
      const boton = (e.target as Element | null)?.closest<HTMLElement>(".onda");
      if (!boton) return;
      const r = boton.getBoundingClientRect();
      boton.style.setProperty("--onda-x", `${e.clientX - r.left}px`);
      boton.style.setProperty("--onda-y", `${e.clientY - r.top}px`);
      boton.removeAttribute("data-onda");
      void boton.offsetWidth; // reinicia la animación si se toca dos veces seguidas
      boton.setAttribute("data-onda", "");
    };

    const quitarDestello = (e: AnimationEvent) => {
      if (e.animationName.startsWith("destello")) (e.target as HTMLElement).removeAttribute("data-destellando");
    };

    const dejarDeEscuchar = alCambiarEleccion((cambiadas) => {
      if (cambiadas.length === 0) return;
      const selector = cambiadas.map((c) => `[data-destello~="${c}"]`).join(",");
      for (const el of document.querySelectorAll<HTMLElement>(selector)) {
        el.removeAttribute("data-destellando");
        void el.offsetWidth;
        el.setAttribute("data-destellando", "");
      }
    });

    document.addEventListener("click", alPulsar);
    document.addEventListener("pointerdown", alTocar, { passive: true });
    document.addEventListener("animationend", quitarDestello);
    return () => {
      document.removeEventListener("click", alPulsar);
      document.removeEventListener("pointerdown", alTocar);
      document.removeEventListener("animationend", quitarDestello);
      dejarDeEscuchar();
    };
  }, []);

  useEffect(() => {
    const raiz = document.documentElement;
    for (const clave of ["programa", "sucursal"] as const) {
      const valor = eleccion[clave];
      if (valor) raiz.dataset[clave] = valor;
      else delete raiz.dataset[clave];
    }
  }, [eleccion]);

  return null;
}
