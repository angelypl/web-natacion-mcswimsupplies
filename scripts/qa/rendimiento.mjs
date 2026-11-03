// LCP, CLS y peso en móvil con Slow 4G + CPU 4× (contra el build de producción).
//   npm run build && npx next start -p 3002
//   node scripts/qa/rendimiento.mjs [url] [repeticiones]
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const VECES = Number(process.argv[3] ?? 3);
// Perfil "Slow 4G" de Chrome DevTools.
const RED = { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 };

const navegador = await chromium.launch();
const corridas = [];

for (let i = 0; i < VECES; i++) {
  const ctx = await navegador.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  });
  const pagina = await ctx.newPage();
  const cdp = await ctx.newCDPSession(pagina);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", RED);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  const bytes = { script: 0, image: 0, font: 0, stylesheet: 0, document: 0, other: 0 };
  const tipos = new Map();
  cdp.on("Network.responseReceived", (e) => tipos.set(e.requestId, e.type.toLowerCase()));
  cdp.on("Network.loadingFinished", (e) => {
    const t = tipos.get(e.requestId);
    bytes[t in bytes ? t : "other"] += e.encodedDataLength;
  });

  await pagina.addInitScript(() => {
    window.__lcp = 0;
    window.__lcpEl = "";
    window.__cls = 0;
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) {
        window.__lcp = e.startTime;
        window.__lcpEl = e.element ? e.element.tagName + (e.element.className ? "." + String(e.element.className).split(" ")[0] : "") : e.url;
      }
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });

  await pagina.goto(URL_BASE, { waitUntil: "load", timeout: 120000 });
  await pagina.waitForTimeout(3000);
  // Recorre la página para medir el CLS de toda la sesión.
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 700) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
  });
  await pagina.waitForTimeout(1500);
  const m = await pagina.evaluate(() => ({ lcp: window.__lcp, lcpEl: window.__lcpEl, cls: window.__cls }));
  corridas.push({ ...m, bytes });
  await ctx.close();
}

await navegador.close();
const mediana = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
const kb = (n) => `${Math.round(n / 1024)} KB`;
for (const c of corridas) console.log(`LCP ${Math.round(c.lcp)} ms (${c.lcpEl})  CLS ${c.cls.toFixed(3)}`);
const b0 = corridas[0].bytes;
console.log(`\nMediana LCP ${Math.round(mediana(corridas.map((c) => c.lcp)))} ms · CLS máx ${Math.max(...corridas.map((c) => c.cls)).toFixed(3)}`);
console.log(`Transferido (1.ª corrida, toda la página): JS ${kb(b0.script)} · imágenes ${kb(b0.image)} · fuentes ${kb(b0.font)} · CSS ${kb(b0.stylesheet)} · HTML ${kb(b0.document)}`);
