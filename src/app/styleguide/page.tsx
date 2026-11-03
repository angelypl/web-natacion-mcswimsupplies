import { MessageCircle, Navigation } from "lucide-react";
import { Corchera } from "@/components/brand/Corchera";
import { Gotas, LineaDeAgua, PatronCarriles } from "@/components/brand/LineaDeAgua";
import { TitularAgua } from "@/components/secciones/TitularAgua";
import { BotonLink } from "@/components/ui/Boton";
import { Etiqueta } from "@/components/ui/Etiqueta";
import { Section, type Tone } from "@/components/ui/Section";
import { crearMetadata } from "@/lib/seo";

export const metadata = crearMetadata({
  titulo: "Styleguide",
  descripcion: "Referencia viva del sistema visual Carril.",
  ruta: "/styleguide",
  indexar: false,
});

const COLORES = [
  ["marino-950", "#001a38"],
  ["marino-900", "#002b5c"],
  ["marino-800", "#04386a"],
  ["piscina-400", "#03a8e8"],
  ["piscina-500", "#0297da"],
  ["piscina-700", "#01659c"],
  ["turquesa-400", "#38d4b8"],
  ["turquesa-700", "#0b6f66"],
  ["agua-300", "#7fe9ee"],
  ["boya-400", "#f4d23c"],
  ["corchera-600", "#c2304e"],
  ["espuma-50", "#f3fafc"],
  ["espuma-100", "#e2f3f7"],
  ["tinta-600", "#3d5670"],
  ["tinta-500", "#56708a"],
  ["niebla-300", "#a9c3d6"],
  ["whatsapp", "#25d366"],
] as const;

const FONDOS = COLORES.filter(([n]) =>
  ["marino-950", "marino-900", "piscina-500", "turquesa-400", "boya-400", "espuma-50", "whatsapp"].includes(n),
);
const TEXTOS = COLORES.filter(([n]) => !["espuma-100", "whatsapp"].includes(n));

function luminancia(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contraste(a: string, b: string) {
  const [x, y] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

const TONOS: Tone[] = ["abismo", "marino", "espuma", "blanco", "piscina", "boya"];

const ESCALA = [
  ["text-display-2xl", "Aprende"],
  ["text-display-xl", "Elige tu carril"],
  ["text-display-lg", "Así empiezas"],
  ["text-display-md", "Formación"],
  ["text-display-sm", "Antes de tu primer carril"],
] as const;

const h2 = "font-display text-display-md font-extrabold uppercase";

export default function Styleguide() {
  return (
    <main>
      <Section tone="abismo" className="py-16">
        <p className="font-semibold text-tone-muted">Sistema visual MC Swim</p>
        <h1 className="font-display text-display-xl font-extrabold uppercase">Carril</h1>
        <p className="mt-4 max-w-2xl text-lead text-tone-muted">
          Referencia viva: tokens en <code>src/app/globals.css</code>, reglas en
          <code> .claude/skills/sistema-visual-mcswim</code>. Esta página no se indexa.
        </p>
      </Section>

      <Section tone="blanco" className="py-16">
        <h2 className={h2}>Colores</h2>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {COLORES.map(([nombre, hex]) => (
            <li key={nombre}>
              <div className="aspect-[4/3] rounded-card border border-tone-line" style={{ background: hex }} />
              <p className="mt-2 font-bold">{nombre}</p>
              <p className="font-mono text-sm text-tone-muted">{hex}</p>
            </li>
          ))}
        </ul>

        <h2 className={`${h2} mt-16`}>Contraste (texto sobre fondo)</h2>
        <p className="mt-3 max-w-2xl text-tone-muted">
          ✓ pasa AA para texto normal (≥ 4,5). ~ solo texto grande o íconos (≥ 3). ✗ no usar.
        </p>
        {/* La tabla muestra a propósito combinaciones que NO pasan: axe las marcará. */}
        <div
          tabIndex={0}
          role="region"
          aria-label="Tabla de contraste"
          data-tabla-contraste
          className="mt-6 overflow-x-auto rounded-card border border-tone-line"
        >
          <table className="w-full min-w-[56rem] border-collapse text-sm tabular-nums">
            <thead>
              <tr>
                <th scope="col" className="p-2 text-left">Texto \ Fondo</th>
                {FONDOS.map(([n, hex]) => (
                  <th key={n} scope="col" className="p-2" style={{ background: hex, color: contraste(hex, "#001a38") > 4.5 ? "#001a38" : "#f3fafc" }}>
                    {n}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TEXTOS.map(([n, fg]) => (
                <tr key={n} className="border-t border-tone-line">
                  <th scope="row" className="p-2 text-left font-semibold">{n}</th>
                  {FONDOS.map(([nb, bg]) => {
                    const c = contraste(fg, bg);
                    return (
                      <td key={nb} className="p-2 text-center font-bold" style={{ background: bg, color: fg }}>
                        {c >= 4.5 ? "✓" : c >= 3 ? "~" : "✗"} {c.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="mt-6 list-disc space-y-1 pl-5 text-tone-muted">
          <li>Sobre piscina-500, turquesa-400, boya-400 y whatsapp el texto es marino-950, nunca blanco.</li>
          <li>piscina-400, turquesa-400, agua-300 y boya-400 como texto solo sobre marino.</li>
          <li>Acentos como texto sobre claro: piscina-700, turquesa-700, corchera-600.</li>
        </ul>
      </Section>

      <Section tone="espuma" className="py-16">
        <h2 className={h2}>Tipografía</h2>
        <p className="mt-3 text-tone-muted">Saira Extra Condensed 800 (display) y Figtree (texto).</p>
        <div className="mt-8 space-y-6">
          {ESCALA.map(([clase, texto]) => (
            <div key={clase} className="border-t border-tone-line pt-4">
              <p className="font-mono text-sm text-tone-muted">{clase}</p>
              <p className={`font-display font-extrabold uppercase ${clase}`}>{texto}</p>
            </div>
          ))}
          <div className="border-t border-tone-line pt-4">
            <p className="font-mono text-sm text-tone-muted">text-lead</p>
            <p className="max-w-2xl text-lead">Clases para niños desde los 2 años y para adultos, en grupos por nivel.</p>
          </div>
          <div className="border-t border-tone-line pt-4">
            <p className="font-mono text-sm text-tone-muted">text-base</p>
            <p className="max-w-2xl">
              Protocolos claros y supervisión en cada sesión, para aprender con confianza.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="abismo" className="py-16">
        <h2 className={h2}>Titular con línea de agua</h2>
        <div className="mt-8">
          <TitularAgua lineas={["Aprende", "a nadar"]} />
        </div>
      </Section>

      {TONOS.map((tono) => (
        <Section key={tono} tone={tono} className="py-12">
          <div className="flex flex-wrap items-center gap-4">
            <p className="w-full font-mono text-sm text-tone-muted">tone=&quot;{tono}&quot;</p>
            <h2 className="w-full font-display text-display-sm font-extrabold uppercase">Botones y etiquetas</h2>
            <BotonLink href="#" variante="boya" icono={<MessageCircle className="size-5" />}>Boya</BotonLink>
            <BotonLink href="#" variante="marino">Marino</BotonLink>
            <BotonLink href="#" variante="whatsapp" icono={<MessageCircle className="size-5" />}>WhatsApp</BotonLink>
            <BotonLink href="#" variante="contorno" icono={<Navigation className="size-5" />}>Contorno</BotonLink>
            <Etiqueta>Suave</Etiqueta>
            <Etiqueta estilo="boya">Boya</Etiqueta>
            <Etiqueta estilo="turquesa">Turquesa</Etiqueta>
            <Etiqueta estilo="corchera">Cupo lleno</Etiqueta>
            <Etiqueta estilo="marino">Marino</Etiqueta>
            <p className="w-full text-tone-muted">Texto secundario (tone-muted) y <span className="font-bold text-tone-accent">acento</span>.</p>
          </div>
        </Section>
      ))}

      <Section tone="marino" container="none" className="relative py-16">
        <PatronCarriles />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className={h2}>Gráficos de marca</h2>
          <p className="mt-6 font-bold">Corchera</p>
          <Corchera className="mt-2" />
          <p className="mt-8 font-bold">Gotas</p>
          <Gotas className="mt-2 w-28 text-turquesa-400" />
          <p className="mt-8 font-bold">Patrón de carriles (fondo de esta sección)</p>
        </div>
        <p className="relative mx-auto mt-8 max-w-7xl px-4 font-bold sm:px-6 lg:px-8">Línea de agua</p>
        <LineaDeAgua className="mt-2 text-espuma-50" />
      </Section>

      <Section tone="espuma" className="py-16">
        <h2 className={h2}>Animaciones</h2>
        <p className="mt-3 max-w-2xl text-tone-muted">
          Inventario completo en <code>ANIMACIONES.md</code>. Pasa el cursor o el foco por los botones para ver las
          micro-interacciones.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {["Aparecer al entrar en vista", "Parallax del sticker", "Corchera con el scroll"].map((t, i) => (
            <div
              key={t}
              data-reveal
              className={`rounded-card bg-white p-6 shadow-flota ${i === 1 ? "parallax [--giro:-2deg] [--parallax:1rem]" : ""}`}
            >
              <p className="font-bold">{t}</p>
            </div>
          ))}
        </div>
        <Corchera animada className="mt-10" />
      </Section>
    </main>
  );
}
