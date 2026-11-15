"use client";

import { useEffect } from "react";

type Props = {
  /** Ids de las secciones que se marcan en la navegación. */
  secciones: readonly string[];
  /** Ids donde la barra de acciones móvil se retira (formulario). */
  sinBarra?: readonly string[];
};

// Un solo observador para toda la página. No pinta nada: deja atributos en
// <html> y `aria-current` en los enlaces [data-nav], y el CSS hace el resto.
//   data-espia        → hay JS (el botón flotante cede el sitio a la barra móvil)
//   data-scroll-dir   → "abajo" | "arriba" (la cabecera se esconde en móvil)
//   data-barra        → la barra de acciones móvil está visible
//   data-seccion      → id de la sección que se lee (la barra móvil se adapta)
export default function ScrollEspia({ secciones, sinBarra = [] }: Props) {
  useEffect(() => {
    const raiz = document.documentElement;
    raiz.dataset.espia = "";

    let ultimoY = window.scrollY;
    let seccion = "";
    let cercaDelPie = false;
    let pendiente = false;

    const pintarBarra = () => {
      const pasoElHero = window.scrollY > window.innerHeight * 0.7;
      const visible = pasoElHero && !sinBarra.includes(seccion) && !cercaDelPie;
      if (visible) raiz.dataset.barra = "";
      else delete raiz.dataset.barra;
    };

    const alScroll = () => {
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(() => {
        pendiente = false;
        const y = window.scrollY;
        if (y < 120) raiz.dataset.scrollDir = "arriba";
        else if (Math.abs(y - ultimoY) > 8) raiz.dataset.scrollDir = y > ultimoY ? "abajo" : "arriba";
        ultimoY = y;
        pintarBarra();
      });
    };

    const enlaces = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[data-nav]"));
    const marcar = (id: string) => {
      seccion = id;
      if (id) raiz.dataset.seccion = id;
      else delete raiz.dataset.seccion;
      for (const a of enlaces) {
        if (a.getAttribute("href") === `#${id}`) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      }
      pintarBarra();
    };

    // Activa la sección que cruza la franja central de la pantalla.
    const observador = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (e.isIntersecting) marcar(e.target.id);
          else if (e.target.id === seccion) marcar("");
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    for (const id of new Set([...secciones, ...sinBarra])) {
      const el = document.getElementById(id);
      if (el) observador.observe(el);
    }

    const pie = document.querySelector("footer");
    const observadorPie = new IntersectionObserver(([e]) => {
      cercaDelPie = e.isIntersecting;
      pintarBarra();
    });
    if (pie) observadorPie.observe(pie);

    window.addEventListener("scroll", alScroll, { passive: true });
    alScroll();

    return () => {
      window.removeEventListener("scroll", alScroll);
      observador.disconnect();
      observadorPie.disconnect();
      delete raiz.dataset.espia;
      delete raiz.dataset.barra;
      delete raiz.dataset.scrollDir;
      delete raiz.dataset.seccion;
    };
  }, [secciones, sinBarra]);

  return null;
}
