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

## No verificado
- Lighthouse oficial (no está instalado); se midió con Playwright + `PerformanceObserver`.
- Safari/iOS real y Firefox: los efectos scroll-driven no corren allí y deberían quedarse quietos (diseñado así, sin probar en esos navegadores).
- Lector de pantalla real (NVDA/VoiceOver): solo axe y pruebas de teclado.
- Horarios reales de mcswim-admin: se usaron datos de ejemplo.
