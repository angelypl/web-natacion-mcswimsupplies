// Capturas puntuales de estados interactivos (menú móvil, carrusel, galería, formulario).
//   node scripts/qa/detalle.mjs [url] [carpeta]
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const SALIDA = process.argv[3] ?? "qa-capturas/detalle";
await mkdir(SALIDA, { recursive: true });
const b = await chromium.launch();
const foto = (p, nombre) => p.screenshot({ path: join(SALIDA, `${nombre}.jpg`), type: "jpeg", quality: 70 });
const ir = async (p, selector, bloque = "start") => {
  await p.locator(selector).first().evaluate((el, block) => el.scrollIntoView({ block, behavior: "instant" }), bloque);
  await p.waitForTimeout(1300);
};

{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  await p.getByRole("button", { name: "Abrir menú" }).click();
  await p.waitForTimeout(900);
  await foto(p, "movil-menu");
  await p.keyboard.press("Escape");
  await ir(p, "#primera-clase");
  await foto(p, "movil-pasos");
  await ir(p, "[aria-label='Fotos de las clases']", "center");
  await foto(p, "movil-galeria");
  await ir(p, "#inscripcion form");
  await foto(p, "movil-formulario");
  await ir(p, "#sucursales");
  await foto(p, "movil-sucursales");
  await ctx.close();
}
{
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(1500);
  await foto(p, "escritorio-hero");
  await p.locator("a[href='#carril-2']").first().click();
  await p.waitForTimeout(1600);
  await foto(p, "escritorio-carril-elegido");
  await ir(p, "[aria-label='Fotos de las clases']", "center");
  await foto(p, "escritorio-galeria");
  await ir(p, "#inscripcion");
  await p.getByRole("radio", { name: /Iniciación/ }).check();
  await p.waitForTimeout(500);
  await foto(p, "escritorio-formulario");
  await ir(p, "#horarios");
  await p.getByRole("tab").nth(1).click();
  await p.waitForTimeout(900);
  await foto(p, "escritorio-horarios-2");
  await ctx.close();
}
await b.close();
console.log("listo");
