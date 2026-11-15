// QA visual: capturas, desbordes, titulares cortados y axe en varios anchos.
//   node scripts/qa/medir.mjs [url] [carpeta-de-capturas] [motores]
// motores: lista separada por comas (chromium,webkit,firefox). Por defecto los
// tres: chromium mide los nueve anchos con axe; webkit y firefox, 375 y 1280
// (los efectos scroll-driven y las View Transitions deben degradar a quieto).
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { compararConLineaBase, medirAlturas, VIEWPORTS } from "./alturas.mjs";
import { AxeBuilder } from "@axe-core/playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const SALIDA = process.argv[3] ?? "qa-capturas";
// 640 = 1280 px con zoom al 200 %.
const ANCHOS = [360, 375, 640, 768, 1024, 1280, 1366, 1440, 1920];
const AXE_EN = new Set([375, 1280]);
const MOTORES = { chromium, webkit, firefox };
const ELEGIDOS = (process.argv[4] ?? "chromium,webkit,firefox").split(",").map((m) => m.trim()).filter((m) => m in MOTORES);

await mkdir(SALIDA, { recursive: true });
const informe = [];

for (const motor of ELEGIDOS) {
const navegador = await MOTORES[motor].launch();
const anchos = motor === "chromium" ? ANCHOS : [375, 1280];
for (const ancho of anchos) {
  // reducedMotion: todo visible y quieto para medir y capturar.
  const ctx = await navegador.newContext({ viewport: { width: ancho, height: 900 }, reducedMotion: "reduce" });
  const pagina = await ctx.newPage();
  const errores = [];
  pagina.on("pageerror", (e) => errores.push(String(e)));
  pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));

  await pagina.goto(URL_BASE, { waitUntil: "networkidle" });
  // Recorre la página para que carguen las imágenes diferidas.
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await pagina.waitForTimeout(400);

  const medidas = await pagina.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const recortado = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        const o = getComputedStyle(p);
        // Los carruseles (overflow-x: auto) recortan a propósito lo que queda fuera.
        if (/(hidden|clip|auto|scroll)/.test(o.overflowX) || /(hidden|clip)/.test(o.overflow)) return true;
      }
      return false;
    };
    const nombre = (el) =>
      el.tagName.toLowerCase() + (el.id ? `#${el.id}` : "") + ` "${(el.textContent ?? "").trim().slice(0, 40)}"`;

    const desbordes = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest("[aria-hidden='true']")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      if ((r.left < -1 || r.right > vw + 1) && !recortado(el)) {
        desbordes.push(`${nombre(el)} left=${Math.round(r.left)} right=${Math.round(r.right)}`);
      }
    }

    // Titular cortado: su texto visible (sin capas aria-hidden ni sr-only)
    // se sale de la columna que lo contiene.
    const titularesCortados = [];
    const enCarrusel = (el) => {
      for (let p = el.parentElement; p; p = p.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(p).overflowX)) return true;
      }
      return false;
    };
    for (const h of document.querySelectorAll("h1, h2, h3")) {
      // Las tarjetas de un carrusel quedan fuera de pantalla hasta deslizar.
      if (enCarrusel(h)) continue;
      const columna = h.parentElement.getBoundingClientRect();
      const recorrido = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      let derecha = -Infinity;
      let izquierda = Infinity;
      for (let n = recorrido.nextNode(); n; n = recorrido.nextNode()) {
        if (n.parentElement.closest("[aria-hidden='true'], .sr-only")) continue;
        const rango = document.createRange();
        rango.selectNodeContents(n);
        for (const r of rango.getClientRects()) {
          derecha = Math.max(derecha, r.right);
          izquierda = Math.min(izquierda, r.left);
        }
      }
      if (derecha > Math.min(columna.right, vw) + 1 || izquierda < Math.max(columna.left, 0) - 1) {
        titularesCortados.push(`${nombre(h)} texto=${Math.round(izquierda)}..${Math.round(derecha)} columna=${Math.round(columna.left)}..${Math.round(columna.right)}`);
      }
    }

    const tactiles = [];
    for (const el of document.querySelectorAll("a[href], button, summary, select, input, textarea")) {
      if (el.closest("[hidden]") || el.closest("[aria-hidden='true']")) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const enLinea = el.tagName === "A" && getComputedStyle(el).display === "inline";
      if (!enLinea && (r.height < 44 || r.width < 44)) tactiles.push(`${nombre(el)} ${Math.round(r.width)}x${Math.round(r.height)}`);
    }

    return {
      scrollHorizontal: document.documentElement.scrollWidth - vw,
      h1: document.querySelectorAll("h1").length,
      desbordes: desbordes.slice(0, 12),
      titularesCortados: titularesCortados.slice(0, 12),
      tactilesPequenos: tactiles.slice(0, 12),
    };
  });

  let axe = null;
  if (motor === "chromium" && AXE_EN.has(ancho)) {
    const resultado = await new AxeBuilder({ page: pagina }).withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"]).analyze();
    axe = resultado.violations.map((v) => ({
      id: v.id,
      impacto: v.impact,
      nodos: v.nodes.length,
      ejemplo: v.nodes[0]?.target.join(" "),
      resumen: v.nodes[0]?.failureSummary?.split("\n").slice(0, 3).join(" "),
    }));
  }

  await pagina.screenshot({ path: join(SALIDA, `pagina-${motor}-${ancho}.png`), fullPage: true });
  informe.push({ motor, ancho, ...medidas, axe, errores });
  await ctx.close();
}
await navegador.close();
}

// Alto por sección en pantallas (Chromium), contra la línea de base de la ronda 3.
const nav = await chromium.launch();
const alturas = {};
for (const { nombre, ...vp } of VIEWPORTS) {
  const ctx = await nav.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  alturas[nombre] = await medirAlturas(p);
  await ctx.close();
}
await nav.close();
await writeFile(join(SALIDA, "informe.json"), JSON.stringify({ informe, alturas }, null, 2));
for (const fila of informe) {
  const marca = fila.scrollHorizontal === 0 && fila.desbordes.length === 0 && fila.titularesCortados.length === 0 ? "OK " : "REV";
  console.log(
    `${marca} ${fila.motor.padEnd(8)} ${String(fila.ancho).padStart(4)}px  scrollX=${fila.scrollHorizontal}  h1=${fila.h1}  desbordes=${fila.desbordes.length}  titulares=${fila.titularesCortados.length}  tactiles<44=${fila.tactilesPequenos.length}` +
      (fila.axe ? `  axe=${fila.axe.length}` : "") +
      (fila.errores.length ? `  errores=${fila.errores.length}` : ""),
  );
}

console.log("\nAlto por sección (pantallas), antes → ahora:");
compararConLineaBase(alturas);
