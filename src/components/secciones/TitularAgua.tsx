import type { CSSProperties } from "react";

// La línea de agua cruza la segunda línea del titular. Arriba se lee en
// espuma; debajo, la misma palabra en turquesa y un poco desplazada, como
// refractada. Son dos capas del mismo texto recortadas con máscaras SVG
// (preserveAspectRatio="none" las estira al tamaño del h1). Solo CSS.
// La misma ola en los dos sentidos: de derecha a izquierda para cerrar las
// máscaras y de izquierda a derecha para el trazo que se dibuja encima.
const OLA = "C83 75 67 75 50 68S17 61 0 68";
const TRAZO = "M0 68C17 61 33 61 50 68S83 75 100 68";
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

const ENCIMA = mascara(`M0 0H100V68${OLA}Z`);
const DEBAJO = mascara(`M0 100H100V68${OLA}Z`);

export function TitularAgua({ lineas }: { lineas: [string, string] }) {
  const texto = (
    <>
      <span className="block">{lineas[0]}</span>
      <span className="block">{lineas[1]}</span>
    </>
  );

  return (
    <h1 className="relative pr-[0.06em] font-display text-display-2xl font-extrabold uppercase tracking-[-0.015em] motion-safe:animate-[subir_900ms_var(--ease-out-expo)_both]">
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
