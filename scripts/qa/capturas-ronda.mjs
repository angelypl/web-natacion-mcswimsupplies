// Capturas de página completa en los tres viewports de la ronda 3.
//   node scripts/qa/capturas-ronda.mjs [url] [carpeta]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";
import { VIEWPORTS } from "./alturas.mjs";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const SALIDA = process.argv[3] ?? "qa-capturas/ronda-3";
await mkdir(SALIDA, { recursive: true });
const b = await chromium.launch();
for (const vp of VIEWPORTS) {
  const ctx = await b.newContext({ viewport: { width: vp.width, height: vp.height }, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(500);
  await p.screenshot({ path: join(SALIDA, `${vp.width}x${vp.height}-primera.png`) });
  await p.screenshot({ path: join(SALIDA, `${vp.width}x${vp.height}-completa.png`), fullPage: true });
  await ctx.close();
}
await b.close();
console.log("capturas en", SALIDA);
