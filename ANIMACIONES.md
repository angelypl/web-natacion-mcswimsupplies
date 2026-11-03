# Inventario de animaciones

Todo el movimiento es CSS (no hay librería de animación). Solo se anima `transform`, `opacity` y `stroke-dashoffset`. No hay animaciones infinitas, así que no hace falta botón de pausa (WCAG 2.2.2).

| Dónde | Qué | Duración / disparador | Con `prefers-reduced-motion` |
|---|---|---|---|
| Hero, titular (`TitularAgua`) | Sube 0,35 em (solo `transform`; nunca parte de opacidad 0, es el LCP) | 900 ms, al cargar | Quieto |
| Hero, línea de agua | El trazo de la ola se dibuja (`stroke-dashoffset`) | 1,6 s, retraso 300 ms, al cargar | Trazo completo, quieto |
| Hero, foto | Sube con rebote suave | 1,1 s, retraso 120 ms, al cargar | Quieta |
| Cabecera | El fondo aparece al bajar (`opacity`, scroll-driven `scroll(root)`, 0–22 rem) | Ligado al scroll | Fondo siempre visible |
| Corchera del hero | Se desliza un 25 % a lo ancho (scroll-driven `view()`) | Ligado al scroll | Quieta |
| Fotos tipo sticker (`.parallax`) | Parallax vertical ±1,5 rem conservando el giro | Ligado al scroll | Quietas con su giro |
| Bloques con `data-reveal` | Aparecen y suben 1,25 rem; escalonados 90 ms con `--reveal-i` | 900 ms al entrar en vista (`RevealRoot`) | Visibles desde el inicio |
| Pizarra de horarios | La grilla aparece al **cambiar** de sucursal (nunca en la primera carga) | 500 ms | Sin animación |
| "Así empiezas", foto sticky | Cambio de foto con fundido y escala 1,05 → 1 | 500 ms, al leer cada paso | Cambio instantáneo |
| Botones | Suben 2 px al hover/foco; `active` escala 0,97; el ícono gira −12° | 250 ms, `spring-soft` | Instantáneo |
| Navegación y enlaces | Subrayado que crece con `scaleX` | 250 ms | Instantáneo |
| Preguntas frecuentes | El "+" gira 45° al abrir | 250 ms | Instantáneo |
| Fotos de carriles | Vuelven a 0° al hover | 500 ms | Instantáneo |

## Garantías
- **Sin JS todo se ve.** `RevealRoot` solo arma (`data-reveal-state="armed"`) lo que está por debajo de la pantalla al cargar. Comprobado en `scripts/qa/flujos.mjs`.
- Scroll-driven solo dentro de `@supports (animation-timeline: view())`. Sin soporte (Firefox y Safari antiguos) los elementos se quedan quietos y visibles.
- No hay View Transitions: la web es una sola página con anclas y no hay navegación entre rutas que conectar.
