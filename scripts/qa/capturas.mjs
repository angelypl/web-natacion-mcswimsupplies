// Capturas por pantalla (no de página completa) para revisar el diseño a ojo.
//   node scripts/qa/capturas.mjs [url] [carpeta] [ancho] [alto]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const SALIDA = process.argv[3] ?? "qa-capturas/pantallas";
const ANCHO = Number(process.argv[4] ?? 1440);
const ALTO = Number(process.argv[5] ?? 900);

await mkdir(SALIDA, { recursive: true });
const navegador = await chromium.launch();
const ctx = await navegador.newContext({
  viewport: { width: ANCHO, height: ALTO },
  deviceScaleFactor: 1,
  isMobile: ANCHO < 600,
  hasTouch: ANCHO < 600,
});
const pagina = await ctx.newPage();
const errores = [];
pagina.on("pageerror", (e) => errores.push(String(e)));
pagina.on("console", (m) => m.type() === "error" && errores.push(m.text()));

await pagina.goto(URL_BASE, { waitUntil: "networkidle" });
await pagina.waitForTimeout(2200);

const total = await pagina.evaluate(() => document.documentElement.scrollHeight);
let n = 0;
for (let y = 0; y < total; y += ALTO - 80) {
  await pagina.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await pagina.waitForTimeout(1100);
  const nombre = `${ANCHO}-${String(n++).padStart(2, "0")}.jpg`;
  await pagina.screenshot({ path: join(SALIDA, nombre), type: "jpeg", quality: 70 });
}

console.log(`${n} capturas en ${SALIDA} (alto total ${total}px)`);
if (errores.length) console.log("Errores:", errores);
await navegador.close();
