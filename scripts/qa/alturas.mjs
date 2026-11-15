// Alto de cada sección en "pantallas" (alto de la sección / alto del viewport).
//   node scripts/qa/alturas.mjs [url] [salida.json]
// También se usa desde medir.mjs (export `medirAlturas`).
import { writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

export const VIEWPORTS = [
  { nombre: "movil", width: 390, height: 844, isMobile: true, hasTouch: true },
  { nombre: "portatil", width: 1366, height: 768 },
  { nombre: "escritorio", width: 1440, height: 900 },
];

// Nombre legible por sección, en el orden de la página.
const NOMBRES = {
  top: "hero",
  "porque-titulo": "por qué",
  carriles: "carriles",
  "primera-clase": "así empiezas",
  horarios: "horarios",
  sucursales: "sucursales",
  "comunidad-titulo": "comunidad",
  inscripcion: "inscripción",
  preguntas: "preguntas",
  pie: "pie",
};

// Línea de base de la ronda 3 (build de producción, 2026-11-15, commit 0bd216b).
export const LINEA_BASE = {
  movil: { hero: 1.9, "por qué": 1.5, carriles: 4.0, "así empiezas": 1.0, horarios: 2.4, sucursales: 3.9, comunidad: 1.2, "inscripción": 2.7, preguntas: 1.3, pie: 2.0, TOTAL: 21.9 },
  portatil: { hero: 1.3, "por qué": 1.1, carriles: 3.0, "así empiezas": 3.0, horarios: 1.7, sucursales: 2.6, comunidad: 2.2, "inscripción": 1.7, preguntas: 1.3, pie: 1.4, TOTAL: 19.3 },
};

export function compararConLineaBase(informe) {
  console.log("sección".padEnd(14), "390×844".padStart(14), "1366×768".padStart(14));
  const secciones = informe.movil.filas.map((f) => f.seccion);
  const celda = (vp, s) => {
    const ahora = s === "TOTAL" ? informe[vp].totalPantallas : informe[vp].filas.find((f) => f.seccion === s)?.pantallas;
    return `${LINEA_BASE[vp][s] ?? "—"} → ${ahora ?? "—"}`.padStart(14);
  };
  for (const s of [...secciones, "TOTAL"]) console.log(s.padEnd(14), celda("movil", s), celda("portatil", s));
}

export async function medirAlturas(pagina) {
  return pagina.evaluate((nombres) => {
    const vh = window.innerHeight;
    const bloques = [...document.querySelectorAll("main > section, main > div > section, footer")];
    const filas = bloques.map((el) => {
      const clave = el.tagName === "FOOTER" ? "pie" : el.id || el.getAttribute("aria-labelledby") || "?";
      const alto = el.getBoundingClientRect().height;
      return { seccion: nombres[clave] ?? clave, px: Math.round(alto), pantallas: Math.round((alto / vh) * 10) / 10 };
    });
    const total = document.documentElement.scrollHeight;
    return { filas, totalPx: total, totalPantallas: Math.round((total / vh) * 10) / 10 };
  }, NOMBRES);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
  const SALIDA = process.argv[3];
  const b = await chromium.launch();
  const informe = {};
  for (const { nombre, ...vp } of VIEWPORTS) {
    const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(URL_BASE, { waitUntil: "networkidle" });
    informe[nombre] = await medirAlturas(p);
    await ctx.close();
  }
  await b.close();
  const secciones = informe.movil.filas.map((f) => f.seccion);
  console.log("sección".padEnd(14), ...VIEWPORTS.map((v) => `${v.width}×${v.height}`.padStart(11)));
  for (const s of secciones) {
    console.log(s.padEnd(14), ...VIEWPORTS.map((v) => String(informe[v.nombre].filas.find((f) => f.seccion === s)?.pantallas ?? "—").padStart(11)));
  }
  console.log("TOTAL".padEnd(14), ...VIEWPORTS.map((v) => `${informe[v.nombre].totalPantallas} (${informe[v.nombre].totalPx})`.padStart(11)));
  if (SALIDA) await writeFile(SALIDA, JSON.stringify(informe, null, 2));
}
