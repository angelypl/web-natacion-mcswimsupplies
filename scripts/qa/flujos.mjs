// QA de flujos: sin JS, reveal, formulario, pestañas y menú móvil.
//   node scripts/qa/flujos.mjs [url]
import { chromium } from "playwright";

const URL_BASE = process.argv[2] ?? "http://localhost:3002/";
const b = await chromium.launch();
let fallas = 0;
const ok = (condicion, mensaje) => {
  if (!condicion) fallas++;
  console.log(`${condicion ? "OK   " : "FALLA"} ${mensaje}`);
};

// 1. Sin JS: nada queda oculto esperando a JavaScript.
{
  const ctx = await b.newContext({ javaScriptEnabled: false, viewport: { width: 375, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(URL_BASE);
  await p.waitForTimeout(1500); // deja terminar las animaciones CSS de entrada
  const ocultos = await p.evaluate(() =>
    [...document.querySelectorAll("main *")]
      .filter(
        (e) =>
          getComputedStyle(e).opacity === "0" &&
          !e.closest("[aria-hidden='true']") &&
          e.getBoundingClientRect().height > 0,
      )
      .map((e) => e.outerHTML.slice(0, 120)),
  );
  ok(ocultos.length === 0, `sin JS: elementos con opacidad 0 = ${ocultos.length} ${ocultos.join(" | ")}`);
  await ctx.close();
}

// 2. Con animaciones: lo de abajo se arma y, al recorrer, todo termina visible.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  const errores = [];
  p.on("pageerror", (e) => errores.push(String(e)));
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  await p.waitForTimeout(800);
  const armadosAlInicio = await p.locator("[data-reveal-state='armed']").count();
  for (let y = 0; y < 16000; y += 500) {
    await p.mouse.wheel(0, 500);
    await p.waitForTimeout(80);
  }
  await p.waitForTimeout(1500);
  const armados = await p.locator("[data-reveal-state='armed']").count();
  ok(armadosAlInicio > 0 && armados === 0, `reveal: armados al inicio ${armadosAlInicio}, tras recorrer ${armados}`);
  const opacidadH1 = await p.evaluate(() => getComputedStyle(document.querySelector("h1")).opacity);
  ok(opacidadH1 === "1", `h1 (LCP) nunca en opacidad 0: ${opacidadH1}`);
  ok(errores.length === 0, `errores de JS: ${errores.length} ${errores.join(" | ")}`);
  await ctx.close();
}

// 3. Foto sticky de "Así empiezas" sigue al paso que se lee.
{
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  const contador = p.locator("p", { hasText: /^Paso \d de 4$/ });
  await p.locator("[data-paso='2']").scrollIntoViewIfNeeded();
  await p.locator("[data-paso='2']").evaluate((el) => el.scrollIntoView({ block: "center" }));
  await p.waitForTimeout(600);
  ok((await contador.textContent()) === "Paso 3 de 4", `al leer el paso 3 la foto dice "${await contador.textContent()}"`);
  await ctx.close();
}

// 4. Formulario: vacío muestra errores y enfoca; válido abre WhatsApp con el mensaje.
{
  const ctx = await b.newContext({ viewport: { width: 375, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(`${URL_BASE}#inscripcion`, { waitUntil: "networkidle" });
  const enviar = p.getByRole("button", { name: "Enviar por WhatsApp" });
  await enviar.click();
  const foco = await p.evaluate(() => document.activeElement?.id);
  const errorVisible = await p.locator("#nombre-error").isVisible();
  ok(foco === "nombre" && errorVisible, `vacío: foco en "${foco}", error visible ${errorVisible}`);
  await p.fill("#nombre", "Ana Pérez");
  await p.fill("#telefono", "829 555 1234");
  await p.fill("#comentarios", "Asma leve");
  const [popup] = await Promise.all([ctx.waitForEvent("page"), enviar.click()]);
  // wa.me redirige a api.whatsapp.com, que codifica los espacios como "+".
  const destino = new URL(popup.url());
  const texto = destino.searchParams.get("text") ?? "";
  const telefono = destino.searchParams.get("phone") ?? destino.pathname;
  ok(telefono.includes("18298830129"), `abre WhatsApp al 18298830129 (${destino.host})`);
  ok(texto.includes("Ana Pérez") && texto.includes("Asma leve") && texto.includes("Formación"), "el mensaje lleva nombre, comentario y programa");
  ok(await p.getByText("Listo. Abrimos WhatsApp").isVisible(), "confirmación visible (aria-live)");
  await ctx.close();
}

// 5. Pestañas de horarios con teclado y menú móvil con Esc.
{
  const ctx = await b.newContext({ viewport: { width: 375, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  const pestanas = p.getByRole("tab");
  if ((await pestanas.count()) > 1) {
    await pestanas.first().focus();
    await p.keyboard.press("ArrowRight");
    const elegida = (await p.getByRole("tab", { selected: true }).textContent())?.trim();
    const foco = await p.evaluate(() => document.activeElement?.textContent?.trim());
    ok(elegida === foco && elegida !== (await pestanas.first().textContent())?.trim(), `flecha derecha cambia y enfoca "${elegida}"`);
  } else {
    ok(true, "horarios sin pestañas (API caída o una sola sucursal): se omite");
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.getByRole("button", { name: "Abrir menú" }).click();
  ok(await p.locator("#menu-movil").isVisible(), "menú móvil abre");
  await p.keyboard.press("Escape");
  const foco = await p.evaluate(() => document.activeElement?.getAttribute("aria-label"));
  ok(!(await p.locator("#menu-movil").isVisible()) && foco === "Abrir menú", `Esc cierra y devuelve el foco ("${foco}")`);
  await ctx.close();
}

// 6. Mejoras de uso: selector del hero, filtro de horarios, sucursal según programa y barra móvil.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });

  ok(!(await p.locator(".barra-movil").isVisible()), "barra móvil oculta sobre el hero");
  await p.locator("a[href='#carril-3']").first().click();
  await p.waitForTimeout(1500);
  const arriba = await p.locator("#carril-3").evaluate((el) => Math.round(el.getBoundingClientRect().top));
  ok(arriba >= 0 && arriba < 200, `"¿Quién va a nadar?" lleva al carril 3 (top=${arriba})`);
  ok(await p.locator(".barra-movil").isVisible(), "barra móvil visible al pasar el hero");

  const filtros = p.getByRole("group", { name: "Filtrar por programa" }).getByRole("button");
  if ((await filtros.count()) > 1) {
    await p.locator("#horarios").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    const antes = await p.locator("#horarios a[href*='wa.me']").count();
    await filtros.nth(1).click();
    await p.waitForTimeout(700);
    const despues = await p.locator("#horarios a[href*='wa.me']").count();
    ok((await filtros.nth(1).getAttribute("aria-pressed")) === "true" && despues < antes, `filtro de programa reduce los turnos (${antes} → ${despues})`);
  } else {
    ok(true, "horarios sin filtro (un solo programa o API caída): se omite");
  }

  await p.locator("#inscripcion form").evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
  await p.waitForTimeout(1200);
  ok(!(await p.locator(".barra-movil").isVisible()), "barra móvil se retira en el formulario");
  await p.getByRole("radio", { name: /Adultos/ }).check();
  const utesa = p.getByRole("radio", { name: /Utesa/ });
  const vivirmas = p.getByRole("radio", { name: /VivirMás/ });
  ok((await utesa.isChecked()) && (await vivirmas.isDisabled()), "Adultos: marca Utesa y deshabilita VivirMás");
  await p.getByRole("radio", { name: /Iniciación/ }).check();
  ok((await vivirmas.isChecked()) && (await utesa.isDisabled()), "Iniciación: pasa sola a VivirMás");
  await p.fill("#telefono", "8295551234");
  await p.locator("#nombre").focus();
  ok((await p.inputValue("#telefono")) === "(829) 555-1234", `teléfono se formatea al salir: ${await p.inputValue("#telefono")}`);
  await ctx.close();
}

await b.close();
console.log(fallas ? `\n${fallas} falla(s)` : "\nTodo en verde");
process.exit(fallas ? 1 : 0);
