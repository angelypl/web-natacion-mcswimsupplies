"use client";

import { useEffect } from "react";
import { CLAVES, elegir, useEleccion } from "@/lib/eleccion";

// Enlaces del servidor con `data-elegir` (hero, carriles, sucursales):
//   <a href="?programa=adultos#horarios" data-elegir>
// Sin JS, el navegador recarga con esa URL y la página lee la elección igual.
// Con JS, se aplica sin recargar y se lleva al ancla.
//
// Además copia la elección a <html data-programa data-sucursal> para que las
// secciones del servidor marquen lo elegido solo con CSS.
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
    document.addEventListener("click", alPulsar);
    return () => document.removeEventListener("click", alPulsar);
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
