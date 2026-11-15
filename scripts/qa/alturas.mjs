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
