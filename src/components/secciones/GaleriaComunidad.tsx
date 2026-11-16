"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import type { Foto } from "@/content/fotos";
import { cn } from "@/lib/cn";
import { transicion } from "@/lib/transicion";

// Tira de fotos de la comunidad.
// - Se desliza con el dedo (scroll-snap) y, con ratón, con las flechas.
// - Cada foto abre un visor a pantalla completa (<dialog> nativo: atrapa el
//   foco, cierra con Escape y devuelve el foco a la foto al cerrar).
// - En el visor: flechas, teclado (← →) y deslizar con el dedo.

const flecha =
  "grid size-12 place-items-center rounded-full bg-white text-marino-900 ring-1 ring-marino-900/10 shadow-flota " +
  "transition-[transform,opacity,box-shadow] duration-(--dur-base) ease-spring-soft " +
  "hover:scale-110 hover:shadow-hondo active:scale-95 disabled:pointer-events-none disabled:opacity-35 disabled:shadow-none";

export function GaleriaComunidad({ fotos }: { fotos: Foto[] }) {
  const tira = useRef<HTMLDivElement>(null);
  const visor = useRef<HTMLDialogElement>(null);
  const toqueX = useRef<number | null>(null);
  const [bordes, setBordes] = useState({ inicio: true, fin: false });
  const [abierta, setAbierta] = useState<number | null>(null);

  // Habilita o esconde cada flecha según lo que queda por recorrer.
  const medir = useCallback(() => {
    const el = tira.current;
    if (!el) return;
    setBordes({
      inicio: el.scrollLeft <= 4,
      fin: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = tira.current;
    if (!el) return;
    medir();
    el.addEventListener("scroll", medir, { passive: true });
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => {
      el.removeEventListener("scroll", medir);
      observador.disconnect();
    };
  }, [medir]);

  const mover = (sentido: 1 | -1) => {
    const el = tira.current;
    if (!el) return;
    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: sentido * el.clientWidth * 0.8, behavior: suave ? "smooth" : "auto" });
  };

  const abrir = (i: number) => {
    setAbierta(i);
    visor.current?.showModal();
  };

  const cerrar = () => visor.current?.close();

  const pasar = useCallback(
    (sentido: 1 | -1) =>
      transicion(() => setAbierta((i) => (i === null ? i : (i + sentido + fotos.length) % fotos.length))),
    [fotos.length],
  );

  const alSoltar = (e: PointerEvent) => {
    if (toqueX.current === null) return;
    const dx = e.clientX - toqueX.current;
    toqueX.current = null;
    if (Math.abs(dx) > 50) pasar(dx < 0 ? 1 : -1);
  };

  const foto = abierta === null ? null : fotos[abierta];

  return (
    <div className="relative mt-8">
      {/* Flechas solo con puntero fino: en táctil se desliza con el dedo.
          Van encima de la tira para no chocar con el botón flotante. */}
      <div className="mb-2 hidden justify-end gap-3 [@media(hover:hover)]:flex">
        <button type="button" onClick={() => mover(-1)} disabled={bordes.inicio} aria-label="Fotos anteriores" className={flecha}>
          <ChevronLeft className="size-6" />
        </button>
        <button type="button" onClick={() => mover(1)} disabled={bordes.fin} aria-label="Fotos siguientes" className={flecha}>
          <ChevronRight className="size-6" />
        </button>
      </div>
      <div
        ref={tira}
        role="region"
        aria-label="Fotos de las clases"
        tabIndex={0}
        className="sin-barra -mx-4 snap-x snap-proximity overflow-x-auto overscroll-x-contain scroll-smooth rounded-card px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
      >
        <ul className="flex w-max gap-4">
          {fotos.map((f, i) => (
            <li
              key={f.alt}
              className={cn(
                "galeria-tira w-[78vw] max-w-80 shrink-0 snap-center sm:w-72",
                i % 2 === 0 ? "-rotate-1" : "rotate-1 translate-y-3",
              )}
            >
              <button
                type="button"
                onClick={() => abrir(i)}
                aria-label={`Ver en grande: ${f.alt}`}
                className="group block w-full cursor-zoom-in rounded-card border-[5px] border-espuma-50 bg-espuma-50 text-left shadow-flota transition-[transform,box-shadow] duration-(--dur-lenta) ease-spring-soft hover:-translate-y-1.5 hover:scale-[1.03] hover:shadow-hondo focus-visible:-translate-y-1.5 active:scale-[0.98]"
              >
                <span className="relative block aspect-[4/3] overflow-hidden rounded-[calc(var(--radius-card)-5px)]">
                  <Image
                    src={f.src}
                    alt=""
                    fill
                    quality={60}
                    placeholder="blur"
                    sizes="(min-width: 640px) 288px, 78vw"
                    className={cn("object-cover transition-transform duration-(--dur-escena) ease-out-expo group-hover:scale-105", f.foco)}
                  />
                  <span
                    aria-hidden
                    className="absolute right-3 bottom-3 grid size-10 place-items-center rounded-full bg-marino-950/60 text-white opacity-0 backdrop-blur-sm transition-[opacity,transform] duration-(--dur-base) ease-spring-soft group-hover:opacity-100 group-focus-visible:opacity-100 scale-90 group-hover:scale-100"
                  >
                    <Expand className="size-4" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={visor}
        aria-label="Foto ampliada"
        onClose={() => setAbierta(null)}
        onClick={(e) => e.target === e.currentTarget && cerrar()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") pasar(1);
          if (e.key === "ArrowLeft") pasar(-1);
        }}
        className="visor m-auto max-h-none max-w-none bg-transparent p-0 text-white backdrop:bg-marino-950/85 backdrop:backdrop-blur-sm"
      >
        {foto && (
          <figure className="flex h-dvh w-screen flex-col items-center justify-center gap-4 px-4 py-16 sm:px-20">
            <div
              className="relative h-full w-full touch-pan-y"
              onPointerDown={(e) => (toqueX.current = e.clientX)}
              onPointerUp={alSoltar}
              onPointerCancel={() => (toqueX.current = null)}
            >
              <Image
                key={abierta}
                src={foto.src}
                alt={foto.alt}
                fill
                quality={75}
                placeholder="blur"
                sizes="100vw"
                className="visor-foto object-contain [view-transition-name:visor-foto]"
              />
            </div>
            <figcaption className="text-center text-sm text-white/80">
              {(abierta ?? 0) + 1} de {fotos.length}
            </figcaption>
          </figure>
        )}

        <button
          type="button"
          onClick={cerrar}
          aria-label="Cerrar"
          autoFocus
          className="absolute top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-white transition-[background-color,transform] duration-(--dur-base) ease-spring-soft hover:scale-110 hover:bg-white/20"
        >
          <X className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => pasar(-1)}
          aria-label="Foto anterior"
          className="absolute top-1/2 left-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition-[background-color,transform] duration-(--dur-base) hover:bg-white/20 sm:grid"
        >
          <ChevronLeft className="size-7" />
        </button>
        <button
          type="button"
          onClick={() => pasar(1)}
          aria-label="Foto siguiente"
          className="absolute top-1/2 right-3 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 transition-[background-color,transform] duration-(--dur-base) hover:bg-white/20 sm:grid"
        >
          <ChevronRight className="size-7" />
        </button>
      </dialog>
    </div>
  );
}
