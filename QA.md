# QA del rediseño "Carril" (2026-11-03)

Todo se midió en local contra el **build de producción** (`next build` + `next start`), con horarios de ejemplo (`npm run qa:horarios`).

## Cómo repetirlo
```bash
npm run qa:horarios                          # API de horarios de ejemplo en :3011
ADMIN_API_URL=http://localhost:3011 npm run build
ADMIN_API_URL=http://localhost:3011 npx next start -p 3002
npm run qa:medir -- http://localhost:3002/   # capturas + desbordes + axe
npm run qa:flujos -- http://localhost:3002/  # sin JS, reveal, formulario, teclado
npm run qa:rendimiento -- http://localhost:3002/ 5
```

## Responsive y accesibilidad (`qa:medir`)
| Ancho | Scroll horizontal | Desbordes | Titulares cortados | Táctiles < 44 px | axe (WCAG 2.2 AA) |
|---|---|---|---|---|---|
| 360 | 0 | 0 | 0 | 0 | — |
| 375 | 0 | 0 | 0 | 0 | 0 violaciones |
| 640 (1280 al 200 %) | 0 | 0 | 0 | 0 | — |
| 768 / 1024 | 0 | 0 | 0 | 0 | — |
| 1280 | 0 | 0 | 0 | 0 | 0 violaciones |
| 1366 / 1440 / 1920 | 0 | 0 | 0 | 0 | — |

Un solo `h1` en todos los anchos. `/styleguide`: 0 violaciones fuera de la tabla de contraste. La tabla muestra a propósito combinaciones prohibidas, así que axe las marca.

## Flujos (`qa:flujos`): 12/12 en verde
- Sin JavaScript: ningún contenido queda con opacidad 0.
- Reveal: 19–22 bloques armados al cargar y 0 después de recorrer la página. El h1 (LCP) nunca parte de opacidad 0. Sin errores de JS.
- La foto sticky de "Así empiezas" sigue al paso que se lee.
- Formulario vacío: error junto al campo y foco en el primero. Formulario válido: abre WhatsApp al 18298830129 con nombre, programa y comentario, y muestra una confirmación con `aria-live`.
- Pestañas de horarios con flechas del teclado. El menú móvil se cierra con Esc y devuelve el foco.
- API de horarios caída (`ADMIN_API_URL` sin servidor): se muestra el respaldo por WhatsApp y la página no se rompe.

## Rendimiento (`qa:rendimiento`): móvil 390 px, Slow 4G, CPU 4×
Corridas alternadas, 6 de cada una:

| | `main` (web actual) | Rediseño |
|---|---|---|
| LCP | 2,51–2,60 s | **1,31–1,39 s** |
| CLS | 0 | 0 |
| JS transferido | 202 KB | 155 KB |
| Imágenes (toda la página) | 999 KB | 513–569 KB |
| Fuentes | 48 KB | 32 KB |

Las mediciones consecutivas en esta máquina dieron mucho ruido (2–7 s en ambas versiones). Las alternadas fueron estables y son las que valen.

## Segunda ronda (2026-11-09)

Medido contra `next dev` (no contra el build de producción; el build compila sin errores, pero el rendimiento no se volvió a medir).

- `qa:medir`: 0 scroll horizontal, 0 desbordes, 0 titulares cortados y 0 táctiles < 44 px en los nueve anchos; axe con 0 violaciones en 375 y 1280.
- `qa:flujos`: 20/20 en verde. Se agregaron ocho comprobaciones: barra móvil (oculta en el hero, visible después, retirada en el formulario), selector del hero, filtro de horarios, sucursal según programa y formato del teléfono.
- Alto de la página en móvil (390 px): de 19.253 px a 17.901 px, aun con la galería nueva.
- `scripts/qa/capturas.mjs` y `scripts/qa/detalle.mjs` sacan capturas por pantalla y de estados interactivos.

### Sucursales nuevas (2026-11-09)
- `qa:flujos` 20/20 y `qa:medir` sin problemas en los nueve anchos (axe: 0) con cuatro sucursales.
- `scripts/qa/sedes.mjs` saca capturas de cada pestaña de horarios, las tarjetas de sucursales, un carril y el formulario.

## Tercera ronda (2026-11-15)

Todo contra el **build de producción** con los horarios de `mock-horarios.mjs` (copia de producción para Utesa y VivirMás).

```bash
npm run qa:medir -- http://localhost:3002/ [carpeta] [chromium,webkit,firefox]   # + alto por sección
npm run qa:flujos -- http://localhost:3002/                                     # 37 comprobaciones, 3 motores
node scripts/qa/alturas.mjs http://localhost:3002/                              # solo el alto por sección
node scripts/qa/capturas-ronda.mjs http://localhost:3002/ qa-capturas/ronda-3/x # 390×844, 1366×768, 1440×900
```

### Alto por sección, en pantallas (390×844 / 1366×768)
| Sección | Antes | Después |
|---|---|---|
| Hero | 1,9 / 1,3 | 1,3 / 1,1 |
| Por qué | 1,5 / 1,1 | 1,3 / 0,9 |
| Carriles | 4,0 / 3,0 | 3,0 / 1,6 |
| Así empiezas | 1,0 / 3,0 | 1,0 / 1,0 |
| Horarios | 2,4 / 1,7 | 2,1 / 1,4 |
| Sucursales | 3,9 / 2,6 | 2,0 / 1,3 |
| Comunidad | 1,2 / 2,2 | 1,6 / 1,7 |
| Inscripción | 2,7 / 1,7 | 2,2 / 1,5 |
| Preguntas | 1,3 / 1,3 | 1,1 / 1,2 |
| Pie | 2,0 / 1,4 | 0,9 / 0,6 |
| **Total** | **21,9 / 19,3** (18.461 px / 14.805 px) | **16,4 / 12,4** (13.855 px / 9.499 px) |

Meta (≤ 17 / ≤ 14) cumplida. Por encima de su meta propia: Carriles en 1366 (1,6, meta 1,5). Comunidad crece en móvil (1,2 → 1,6) por la franja de hechos e Instagram, que sustituyen a los testimonios ocultos.

### Responsive, accesibilidad y flujos
- `qa:medir`: Chromium en los nueve anchos y WebKit y Firefox en 375 y 1280: 0 scroll horizontal, 0 desbordes, 0 titulares cortados, 0 táctiles < 44 px, un `h1`. axe (WCAG 2.2 AA) 0 violaciones en 375 y 1280.
- `qa:flujos`: 37/37. Nuevas: pasos en fila con foto, estado intermedio y enlace de respaldo al enviar, contexto compartido hero → horarios → formulario, filtros que hablan en los tres programas, turno → formulario con sucursal y hora, resumen con primer mes, la elección sobrevive a recargar, regla de colores de las acciones y texto único de la acción principal, y en WebKit y Firefox: nada queda con opacidad 0 tras recorrer, contexto y pestañas funcionan, sin errores de JS.

### Rendimiento (`qa:rendimiento`, 390 px, Slow 4G, CPU 4×, 5 corridas)
| | Antes (0bd216b) | Después |
|---|---|---|
| LCP (mediana) | 1.184 ms (titular) | 1.232 ms (titular) |
| CLS | 0 | 0 |
| JS | 159 KB | 162 KB |
| Imágenes | 653 KB | 485 KB |
| CSS | 13 KB | 15 KB |

- El LCP llegó a 1,48 s cuando la foto del hero asomaba más que el titular en móvil (pasó a ser el elemento LCP). Se ajustó el tamaño del titular y la distancia a la foto: vuelve a ser el titular y la foto sigue asomando. La diferencia restante (+48 ms) está dentro del ruido de corridas consecutivas en esta máquina.
- CLS: la barra del pulgar cambiaba 3–6 px de alto o ancho al adaptarse a la sección; se fijaron alto y columnas.
- JS +3 KB: código del recorrido (contexto compartido, correspondencia de categorías, horas, transiciones). Pendiente de visto bueno.

## No verificado
- Rendimiento (LCP, peso) después de la segunda ronda: las cifras de la tabla de arriba son de la primera.
- Lighthouse oficial (no está instalado); se midió con Playwright + `PerformanceObserver`.
- Safari/iOS real: se probó con el WebKit de Playwright (no es un iPhone). Firefox, con el de Playwright.
- Lector de pantalla real (NVDA/VoiceOver): solo axe y pruebas de teclado.
- Horarios reales de mcswim-admin: se usaron datos de ejemplo.
