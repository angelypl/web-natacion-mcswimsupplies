// Contexto compartido de la página: qué programa, sucursal y turno eligió el
// visitante. Vive en la URL (?programa=adultos&sucursal=utesa&turno=…), así
// sobrevive a recargar y viaja al compartir el enlace. No se guarda nada en el
// navegador: son elecciones, no datos personales.
//
// Lo escriben los enlaces con `data-elegir` (los intercepta EleccionRoot) y los
// componentes cliente con `elegir()`. Lo leen con `useEleccion()`.

import { useSyncExternalStore } from "react";
import { CLAVES, type Eleccion } from "./eleccion-url";

export { CLAVES, codificarTurno, decodificarTurno, enlaceEleccion, type Eleccion } from "./eleccion-url";

const VACIA: Eleccion = { programa: null, sucursal: null, turno: null };
const EVENTO = "mcswim:eleccion";

let cacheBusqueda = "";
let cache: Eleccion = VACIA;

function leer(): Eleccion {
  const busqueda = window.location.search;
  if (busqueda !== cacheBusqueda) {
    const p = new URLSearchParams(busqueda);
    cacheBusqueda = busqueda;
    cache = { programa: p.get("programa"), sucursal: p.get("sucursal"), turno: p.get("turno") };
  }
  return cache;
}

function suscribir(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("popstate", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("popstate", avisar);
  };
}

/** Elección actual. En el servidor (y al hidratar) está vacía. */
export function useEleccion(): Eleccion {
  return useSyncExternalStore(suscribir, leer, () => VACIA);
}

/**
 * Cambia la elección (null quita esa parte) sin recargar. Si llega un ancla,
 * además lleva a esa sección (cambia el hash: dispara :target y el scroll).
 * `seccion` solo actualiza el ancla de la URL, sin mover la página.
 */
export function elegir(cambios: Partial<Eleccion>, ancla?: string, seccion?: string) {
  const url = new URL(window.location.href);
  // Elegir dentro de una sección deja su ancla en la URL (sin saltar): al
  // recargar o compartir, se vuelve a esa sección y no a la anterior.
  if (seccion && !ancla) url.hash = seccion;
  for (const clave of CLAVES) {
    if (!(clave in cambios)) continue;
    const valor = cambios[clave];
    if (valor) url.searchParams.set(clave, valor);
    else url.searchParams.delete(clave);
  }
  const actual = leer();
  window.history.replaceState(window.history.state, "", url);
  const despues = leer();
  const cambiadas = CLAVES.filter((c) => actual[c] !== despues[c]);
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: { cambiadas } }));

  if (ancla) {
    if (window.location.hash === ancla) {
      document.querySelector(ancla)?.scrollIntoView({ behavior: preferirQuieto() ? "auto" : "smooth" });
    } else {
      window.location.hash = ancla;
    }
  }
}

export function preferirQuieto() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Escucha qué partes cambiaron (para el destello de la fase de movimiento). */
export function alCambiarEleccion(fn: (cambiadas: string[]) => void) {
  const manejador = (e: Event) => fn((e as CustomEvent<{ cambiadas: string[] }>).detail?.cambiadas ?? []);
  window.addEventListener(EVENTO, manejador);
  return () => window.removeEventListener(EVENTO, manejador);
}
