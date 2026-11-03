"use client";

import { useEffect } from "react";

// Patrón static → armed → play. El HTML del servidor no trae estado, así que
// sin JS (o si este archivo falla) todo el contenido se ve. Solo se arma lo que
// está por debajo de la pantalla: lo visible al cargar nunca parpadea.
export default function RevealRoot() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elementos = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealState = "play";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    const alto = window.innerHeight;
    for (const el of elementos) {
      if (el.getBoundingClientRect().top < alto) continue;
      el.dataset.revealState = "armed";
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
