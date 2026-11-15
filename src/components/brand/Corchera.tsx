import { cn } from "@/lib/cn";

// Corchera de piscina: flotadores rojos y azules separados por blancos, como
// las de Utesa. Se dibuja como un tile SVG repetido (sin ids ni JS).
const ROJO = "#c2304e";
const AZUL = "#0277b5";
const BLANCO = "#f3fafc";
const SECUENCIA = [ROJO, ROJO, ROJO, ROJO, BLANCO, AZUL, AZUL, AZUL, AZUL, BLANCO];
const PASO = 15;
const ALTO = 24;

function tile(vertical = false) {
  // En vertical se intercambian x/y: los flotadores se apilan hacia abajo.
  const r = (x: number, y: number, w: number, h: number, extra: string) =>
    vertical
      ? `<rect x='${y}' y='${x}' width='${h}' height='${w}' ${extra}/>`
      : `<rect x='${x}' y='${y}' width='${w}' height='${h}' ${extra}/>`;
  const discos = SECUENCIA.map(
    (color, i) =>
      r(i * PASO + 1, 2, PASO - 2, ALTO - 4, `rx='5' fill='${color}'`) +
      r(i * PASO + 3, 5, 3, ALTO - 10, "rx='1.5' fill='white' fill-opacity='.28'"),
  ).join("");
  const cuerda = r(0, ALTO / 2 - 1, SECUENCIA.length * PASO, 2, "fill='#001a38' fill-opacity='.35'");
  const [w, h] = vertical ? [ALTO, SECUENCIA.length * PASO] : [SECUENCIA.length * PASO, ALTO];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'>${cuerda}${discos}</svg>`;
  return `url("data:image/svg+xml,${svg.replaceAll("#", "%23")}")`;
}

const FONDO = tile();
const FONDO_VERTICAL = tile(true);

/** Corchera vertical: separa carriles puestos lado a lado. Ocupa el alto del padre. */
export function CorcheraVertical({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none w-6", className)}
      style={{ backgroundImage: FONDO_VERTICAL, backgroundRepeat: "repeat-y", backgroundSize: "100% auto" }}
    />
  );
}

type Props = {
  className?: string;
  /** Se desliza con el scroll (CSS scroll-driven; quieta sin soporte o con reduced-motion). */
  animada?: boolean;
};

export function Corchera({ className, animada = false }: Props) {
  return (
    <div aria-hidden className={cn("pointer-events-none overflow-hidden", className)}>
      <div
        className={cn("h-6", animada ? "corchera-scroll w-[133%]" : "w-full")}
        style={{ backgroundImage: FONDO, backgroundRepeat: "repeat-x", backgroundSize: "auto 100%" }}
      />
    </div>
  );
}
