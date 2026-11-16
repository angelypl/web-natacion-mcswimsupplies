import type { CSSProperties } from "react";

// La línea de agua pasa entre las dos líneas del titular, sin cortar letras:
// arriba "Aprende" en espuma; debajo "a nadar" en turquesa, un poco
// desplazada, como refractada. (Antes la ola cruzaba la segunda línea y las
// puntas blancas de las letras se leían como un titular duplicado.) Son dos capas del mismo texto recortadas con máscaras SVG
// (preserveAspectRatio="none" las estira al tamaño del h1). Solo CSS.
// La misma ola en los dos sentidos: de derecha a izquierda para cerrar las
// máscaras y de izquierda a derecha para el trazo que se dibuja encima.
// Ola suave centrada en y=49 (el hueco entre líneas está entre ~43 y ~54).
const OLA = "C83 52 67 52 50 49S17 46 0 49";
const TRAZO = "M0 49C17 46 33 46 50 49S83 52 100 49";
const mascara = (d: string): CSSProperties => {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='${d}'/></svg>`;
  const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  return {
    maskImage: url,
    WebkitMaskImage: url,
    maskSize: "100% 100%",
    WebkitMaskSize: "100% 100%",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
  };
};

const ENCIMA = mascara(`M0 0H100V49${OLA}Z`);
const DEBAJO = mascara(`M0 100H100V49${OLA}Z`);

export function TitularAgua({ lineas }: { lineas: [string, string] }) {
  const texto = (
    <>
      <span className="block">{lineas[0]}</span>
      <span className="block">{lineas[1]}</span>
    </>
  );

  return (
    <h1 className="relative pr-[0.06em] font-display text-[clamp(5.5rem,0.5rem+27.5vw,7.5rem)] font-extrabold leading-[0.84] sm:text-display-2xl lg:text-[clamp(6rem,1.5rem+7vw,10.5rem)] uppercase tracking-[-0.015em] motion-safe:animate-[subir_900ms_var(--ease-out-expo)_both]">
      <span className="block text-espuma-50" style={ENCIMA}>
        {texto}
      </span>
      <span
        aria-hidden
        className="absolute inset-0 block translate-x-[0.04em] translate-y-[0.015em] text-turquesa-400"
        style={DEBAJO}
      >
        {texto}
      </span>
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-agua-300"
      >
        <path
          d={TRAZO}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
          pathLength={1}
          strokeDasharray="1"
          className="motion-safe:animate-[trazar_1600ms_var(--ease-out-expo)_300ms_both]"
        />
      </svg>
    </h1>
  );
}
