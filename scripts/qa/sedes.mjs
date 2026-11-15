// Capturas de las partes que dependen de las sucursales: pizarra de horarios
// (cada pestaña), tarjetas de sucursales, carriles y formulario.
//   node scripts/qa/sedes.mjs [url] [carpeta]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const SALIDA = process.argv[3] ?? "qa-capturas/sedes";
await mkdir(SALIDA, { recursive: true });
const b = await chromium.launch();

for (const [ancho, alto, movil] of [
  [390, 844, true],
  [1440, 900, false],
]) {
  const ctx = await b.newContext({ viewport: { width: ancho, height: alto }, isMobile: movil, hasTouch: movil });
  const p = await ctx.newPage();
  const foto = (nombre) => p.screenshot({ path: join(SALIDA, `${ancho}-${nombre}.jpg`), type: "jpeg", quality: 70 });
  const ir = async (selector, block = "start") => {
    await p.locator(selector).first().evaluate((el, b) => el.scrollIntoView({ block: b, behavior: "instant" }), block);
    await p.waitForTimeout(1300);
  };
  await p.goto(URL_BASE, { waitUntil: "networkidle" });

  await ir("[role='tablist']", "start");
  await p.evaluate(() => window.scrollBy(0, -110));
  await p.waitForTimeout(400);
  const pestanas = p.getByRole("tab");
  for (let i = 0; i < (await pestanas.count()); i++) {
    await pestanas.nth(i).click();
    await p.waitForTimeout(800);
    await foto(`horarios-${i}`);
  }
  await ir("#sucursales h2");
  await foto("sucursales-titulo");
  await ir("#sucursal-prado-oriental", "center");
  await foto("sucursal-prado");
  await ir("#carril-2", "start");
  await foto("carril-2");
  await ir("#inscripcion form fieldset:nth-of-type(2)", "center");
  await foto("formulario-sucursal");
  await ctx.close();
}
await b.close();
console.log("listo");
