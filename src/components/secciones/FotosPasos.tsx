"use client";

import { useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { cn } from "@/lib/cn";

type Props = { fotos: { src: StaticImageData; alt: string }[] };

// Sigue qué paso (li[data-paso]) está en el centro de la pantalla y muestra
// su foto. Sin JS se ve la primera.
export default function FotosPasos({ fotos }: Props) {
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const pasos = document.querySelectorAll<HTMLElement>("[data-paso]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActivo(Number(entry.target.getAttribute("data-paso")));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    pasos.forEach((p) => observer.observe(p));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative rotate-[-1.5deg] rounded-blob border-[6px] border-espuma-50 bg-espuma-50 shadow-hondo">
      <div className="relative aspect-[4/5] overflow-hidden rounded-[calc(var(--radius-blob)-6px)] bg-marino-800">
        {fotos.map((foto, i) => (
          <Image
            key={foto.alt}
            src={foto.src}
            alt={i === activo ? foto.alt : ""}
            aria-hidden={i !== activo}
            fill
            quality={60}
            placeholder="blur"
            sizes="(min-width: 1280px) 500px, 40vw"
            className={cn(
              "object-cover transition-[opacity,transform] duration-(--dur-lenta) ease-out-expo",
              i === activo ? "opacity-100" : "scale-105 opacity-0",
            )}
          />
        ))}
      </div>
      <p className="absolute -bottom-4 right-6 rounded-pill bg-boya-400 px-4 py-2 font-display text-xl font-extrabold uppercase tabular-nums text-marino-950 shadow-flota">
        Paso {activo + 1} de {fotos.length}
      </p>
    </div>
  );
}
