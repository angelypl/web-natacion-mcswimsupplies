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
  ok(await p.getByRole("button", { name: /Abriendo WhatsApp/ }).isVisible(), "estado intermedio: el botón dice \"Abriendo WhatsApp…\"");
  await p.getByText("Listo. Abrimos WhatsApp").waitFor({ timeout: 3000 }).catch(() => {});
  ok(await p.getByText("Listo. Abrimos WhatsApp").isVisible(), "confirmación visible (aria-live)");
  ok(await p.getByRole("link", { name: "Abrir WhatsApp de nuevo" }).isVisible(), "enlace de respaldo por si WhatsApp no se abrió");
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
  await p.locator("a[href$='#carril-3']").first().click();
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
  await p.getByRole("radio", { name: /Adultos/ }).click();
  await p.waitForTimeout(400);
  const utesa = p.getByRole("radio", { name: /Utesa/ });
  const vivirmas = p.getByRole("radio", { name: /VivirMás/ });
  ok((await utesa.isChecked()) && (await vivirmas.isDisabled()), "Adultos: marca Utesa y deshabilita VivirMás");
  await p.getByRole("radio", { name: /Iniciación/ }).click();
  await p.waitForTimeout(400);
  ok((await vivirmas.isChecked()) && (await utesa.isDisabled()), "Iniciación: pasa sola a VivirMás");
  await p.fill("#telefono", "8295551234");
  await p.locator("#nombre").focus();
  ok((await p.inputValue("#telefono")) === "(829) 555-1234", `teléfono se formatea al salir: ${await p.inputValue("#telefono")}`);
  await ctx.close();
}

// 7. Un solo recorrido: el contexto compartido (programa, sucursal, turno) viaja
//    del hero a horarios y al formulario; los colores de las acciones siguen la regla.
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  await p.goto(URL_BASE, { waitUntil: "networkidle" });
  await p.getByRole("link", { name: /Jóvenes y adultos/ }).first().click();
  await p.waitForTimeout(900);
  ok(new URL(p.url()).searchParams.get("programa") === "adultos", `hero → URL con programa=adultos (${new URL(p.url()).search})`);
  const filtro = p.getByRole("group", { name: "Filtrar por programa" }).locator("[aria-pressed='true']");
  ok(/^Adultos/.test((await filtro.textContent()) ?? ""), `hero → horarios filtrados en Adultos (${await filtro.textContent()})`);
  ok((await p.locator("input[name=programa]:checked").inputValue()) === "adultos", "hero → formulario marcado en Adultos");

  // Correspondencia de categorías: el filtro habla en los programas de la web.
  const nombres = await p.getByRole("group", { name: "Filtrar por programa" }).getByRole("button").allTextContents();
  const permitidos = /^(Todos|Iniciación|Formación|Adultos)\d+$/;
  ok(nombres.every((n) => permitidos.test(n.trim())), `filtros = programas de la web: ${nombres.join(", ")}`);

  // Del turno al formulario con día, hora y sucursal puestos.
  await p.getByRole("tab", { name: "Prado Oriental" }).click();
  await p.waitForTimeout(400);
  await p.getByRole("link", { name: /Reservar este turno/ }).first().click();
  await p.waitForTimeout(1200);
  const sucursal = await p.locator("input[name=sucursal]:checked").inputValue();
  const horario = await p.inputValue("#horario");
  ok(sucursal === "prado-oriental" && /sábado, 7:00 a\. m\./.test(horario), `turno → formulario (${sucursal}, "${horario}")`);
  const resumen = (await p.locator(".resumen").innerText()).replace(/\s+/g, " ");
  ok(/Prado Oriental/.test(resumen) && /RD\$3,500/.test(resumen), "resumen con sucursal y primer mes (RD$2,500 + RD$1,000)");

  // Recargar conserva la elección.
  await p.reload({ waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  ok(/sábado/.test(await p.inputValue("#horario")), "al recargar se conserva el turno");

  // Regla de colores: verde solo para WhatsApp; boya solo para lo que se queda en la página.
  const reglas = await p.evaluate(() => {
    const verde = "rgb(37, 211, 102)";
    const boya = "rgb(244, 210, 60)";
    const malos = [];
    for (const a of document.querySelectorAll("a, button")) {
      // "Saltar al contenido" es un atajo de teclado, no una acción.
      if (a.closest("[aria-hidden='true']") || a.getAttribute("href") === "#contenido") continue;
      const fondo = getComputedStyle(a).backgroundColor;
      const href = a.getAttribute("href") ?? "";
      const esWa = /wa\.me|whatsapp/.test(href) || a.type === "submit";
      if (fondo === verde && !esWa) malos.push(`verde sin WhatsApp: ${a.textContent.trim().slice(0, 30)}`);
      if (fondo === boya && esWa) malos.push(`boya hacia WhatsApp: ${a.textContent.trim().slice(0, 30)}`);
      if (esWa && a.tagName === "A" && fondo !== verde && !a.querySelector(".bg-whatsapp") && getComputedStyle(a).display !== "inline")
        malos.push(`WhatsApp sin verde: ${a.textContent.trim().slice(0, 30)}`);
    }
    const principales = [...document.querySelectorAll("a")].filter(
      (a) => getComputedStyle(a).backgroundColor === boya && a.getAttribute("href") !== "#contenido",
    );
    const textos = [...new Set(principales.map((a) => a.textContent.trim()))];
    return { malos, textos };
  });
  ok(reglas.malos.length === 0, `colores de acciones: ${reglas.malos.length} fuera de regla ${reglas.malos.slice(0, 4).join(" | ")}`);
  ok(reglas.textos.length === 1 && reglas.textos[0] === "Reservar mi cupo", `acción principal con un solo texto: ${reglas.textos.join(" / ")}`);
  await ctx.close();
}

await b.close();
console.log(fallas ? `\n${fallas} falla(s)` : "\nTodo en verde");
process.exit(fallas ? 1 : 0);
