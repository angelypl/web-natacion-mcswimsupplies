---
name: responsive-accesible
description: Verificación de layout responsive y accesibilidad. Úsala tras cualquier cambio visual, al corregir desalineaciones o cortes, y antes de dar por terminada una pantalla.
---

# Responsive y accesibilidad: se mide, no se adivina

Una captura que "se ve bien" no basta. Un bug real de este proyecto (tarjeta cortada a 1280 px) solo apareció al medir.

## Reglas de layout
- Mobile-first. Diseña a 360–390 px y luego escala. Las pantallas de staff (admin) se usan desde el celular.
- Grids con columnas explícitas `minmax(0,1fr)`. En grids de N columnas, la suma de `col-span-*` de los hijos directos debe ser **≤ N** (7+6 en un grid de 12 mandó una tarjeta a otra fila).
- Margen negativo + `overflow-hidden` recorta contenido sin avisar y sin scroll. Si usas superposición, comprueba que nada quede con `left < 0`.
- Sin scroll horizontal: `document.documentElement.scrollWidth - clientWidth === 0`.
- Inputs con `text-base` en móvil (iOS hace zoom si es menor). Respeta `safe-area-inset-*`.
- Titulares gigantes (`text-display-*`): comprueba que ninguna palabra se corte ni desborde a 360 px y con zoom al 200 %.

## Verificación obligatoria
1. Levanta la app (`npm run dev`).
2. Mide en 375, 768, 1024, 1280, 1366, 1440 y 1920. Herramientas, en orden de preferencia:
   - Navegador integrado o Claude in Chrome (`resize_window` + `javascript_tool`), si están disponibles.
   - Si no, el script de Playwright `scripts/qa/medir.mjs` (capturas + mediciones + axe).
3. Mide con `getBoundingClientRect()` los elementos críticos; ninguno con `left < 0` ni `right > innerWidth`.
4. Confirma que no hay scroll horizontal en ningún ancho.
5. Si no puedes ver capturas, mide por JS: la medición manda.
6. Restaura el viewport al terminar.

## Accesibilidad (mínimo WCAG 2.2 AA)
- Contraste: usa la tabla de `sistema-visual-mcswim`. En la web, sobre azul piscina, turquesa o boya el texto es marino, nunca blanco. En el admin, `slate-400` sobre blanco NO cumple para texto informativo; usa `slate-600` (cuerpo) o `slate-500` (secundario, ≥ 14 px).
- Objetivos táctiles ≥ 44×44 px. Foco visible (`focus-visible:ring-2`, mismo efecto en hover y foco); jamás `outline-none` sin reemplazo.
- Un `<label>` por input; errores asociados con `aria-describedby`. Iconos decorativos con `aria-hidden`.
- Toda `<img>` con `alt` útil y verdadero (vacío si es decorativa). Jerarquía h1 → h2 → h3 sin saltos; un solo h1; `lang="es"`.
- No transmitir información solo con color: gráficos y estados ("Cupo lleno") con texto visible.
- Navegable con teclado: Tab recorre todo en orden lógico, Esc cierra menús y modales. Enlace "Saltar al contenido".
- Animaciones infinitas con botón de pausa (WCAG 2.2.2) y versión quieta con `prefers-reduced-motion`.
