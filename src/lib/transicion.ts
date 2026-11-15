import { flushSync } from "react-dom";

// View Transitions del mismo documento: lo que sigue en pantalla se desplaza a
// su sitio en vez de reaparecer. Sin soporte (Firefox y Safari antiguos) o con
// `prefers-reduced-motion`, el cambio se aplica al instante, sin animación.
// `flushSync` hace que React pinte el estado nuevo dentro de la transición.
export function transicion(cambio: () => void) {
  const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
  const quieto = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || quieto) {
    cambio();
    return;
  }
  doc.startViewTransition(() => flushSync(cambio));
}
