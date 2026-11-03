import { cn } from "@/lib/cn";

// Corchera de piscina: flotadores rojos y azules separados por blancos, como
// las de Utesa. Se dibuja como un tile SVG repetido (sin ids ni JS).
const ROJO = "#c2304e";
const AZUL = "#0277b5";
const BLANCO = "#f3fafc";
const SECUENCIA = [ROJO, ROJO, ROJO, ROJO, BLANCO, AZUL, AZUL, AZUL, AZUL, BLANCO];
const PASO = 15;
const ALTO = 24;

function tile() {
  const discos = SECUENCIA.map(
    (color, i) =>
      `<rect x='${i * PASO + 1}' y='2' width='${PASO - 2}' height='${ALTO - 4}' rx='5' fill='${color}'/>` +
      `<rect x='${i * PASO + 3}' y='5' width='3' height='${ALTO - 10}' rx='1.5' fill='white' fill-opacity='.28'/>`,
  ).join("");
  const cuerda = `<rect x='0' y='${ALTO / 2 - 1}' width='${SECUENCIA.length * PASO}' height='2' fill='#001a38' fill-opacity='.35'/>`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${SECUENCIA.length * PASO}' height='${ALTO}'>${cuerda}${discos}</svg>`;
  return `url("data:image/svg+xml,${svg.replaceAll("#", "%23")}")`;
}

const FONDO = tile();

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
