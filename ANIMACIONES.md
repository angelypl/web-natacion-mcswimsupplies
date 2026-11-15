# Inventario de animaciones

Todo el movimiento es CSS y APIs nativas (no hay librería de animación). Se anima `transform`, `opacity` y `stroke-dashoffset`; las dos excepciones medidas están abajo (destello con `box-shadow` y la altura de las preguntas). No hay animaciones infinitas, así que no hace falta botón de pausa (WCAG 2.2.2).

| Dónde | Qué | Duración / disparador | Con `prefers-reduced-motion` |
|---|---|---|---|
| Hero, titular (`TitularAgua`) | Sube 0,35 em (solo `transform`; nunca parte de opacidad 0, es el LCP) | 900 ms, al cargar | Quieto |
| Hero, línea de agua | El trazo de la ola se dibuja (`stroke-dashoffset`) | 1,6 s, retraso 300 ms, al cargar | Trazo completo, quieto |
| Hero, foto | Sube con rebote suave | 1,1 s, retraso 120 ms, al cargar | Quieta |
| Cabecera | El fondo aparece al bajar (`opacity`, scroll-driven `scroll(root)`, 0–22 rem) | Ligado al scroll | Fondo siempre visible |
| Corchera del hero | Se desliza un 25 % a lo ancho (scroll-driven `view()`) | Ligado al scroll | Quieta |
| Fotos tipo sticker (`.parallax`) | Parallax vertical ±1,5 rem conservando el giro | Ligado al scroll | Quietas con su giro |
| Titulares de sección (`Titular`, `data-reveal="titular"`) | Cada palabra sube desde su línea de base, escalonadas 55 ms; la entradilla aparece después | 900 ms al entrar en vista | Visibles desde el inicio |
| Fotos con `data-reveal="foto"` (carriles, foto de comunidad) | Entran creciendo de 0,92 a 1 | 900 ms al entrar en vista | Visibles desde el inicio |
| Cabecera, progreso de lectura (`.progreso-scroll`) | Línea de 3 px que se llena con el scroll (`scaleX`, `scroll(root)`) | Ligado al scroll | Oculta |
| Cabecera en móvil | Se esconde al bajar y vuelve al subir (`translateY`, lo decide `ScrollEspia`) | 400 ms | Siempre visible |
| Navegación, sección activa | El subrayado queda fijo y pasa a boya en la sección que se lee (`aria-current`) | 250 ms | Instantáneo |
| Menú móvil | El panel baja 0,75 rem con fundido y los enlaces entran escalonados 50 ms; el ícono gira entre ☰ y ✕ | 350–600 ms al abrir | Instantáneo |
| Barra de acciones móvil (`.barra-movil`) | Sube desde abajo al pasar el hero; se retira en el formulario y en el pie | 450 ms | Instantáneo |
| Hero, foto | Parallax vertical ±1,75 rem (además de la entrada) | Ligado al scroll | Quieta |
| Carril elegido desde el hero (`:target`) | Destello boya que se apaga | 1,8 s, una vez | Instantáneo |
| "Así empiezas" en móvil | Carrusel con scroll-snap nativo; la barra de progreso se llena con el desplazamiento (`scroll-timeline`) | Ligado al gesto | Barra quieta |
| Horarios, pestañas de sucursal | La pastilla marino se desliza a la pestaña elegida | 500 ms | Instantáneo |
| Horarios, filtro de programa | Las tarjetas de día reaparecen escalonadas 60 ms | 500 ms al filtrar | Sin animación |
| Galería de comunidad | Tira con scroll-snap; en escritorio además se desliza −14 rem con el scroll de la página | Ligado al scroll | Quieta |
| Preguntas, respuesta | Fundido y subida corta al abrir (sin animar la altura) | 500 ms | Instantáneo |
| Formulario, opciones | Las tarjetas cambian de color al marcarse; `active` escala 0,98 | 250 ms | Instantáneo |
| Bloques con `data-reveal` | Aparecen y suben 1,25 rem; escalonados 90 ms con `--reveal-i` | 900 ms al entrar en vista (`RevealRoot`) | Visibles desde el inicio |
| Pizarra de horarios | La grilla aparece al **cambiar** de sucursal (nunca en la primera carga) | 500 ms | Sin animación |
| Botones | Suben 2 px al hover/foco; `active` escala 0,97; el ícono gira −12° | 250 ms, `spring-soft` | Instantáneo |
| Navegación y enlaces | Subrayado que crece con `scaleX` | 250 ms | Instantáneo |
| Preguntas frecuentes | El "+" gira 45° al abrir | 250 ms | Instantáneo |
| Fotos de carriles | Vuelven a 0° al hover | 500 ms | Instantáneo |

### Ronda 3: movimiento que responde a lo que hace el visitante
| Dónde | Qué explica | Cómo | Con `prefers-reduced-motion` / sin soporte |
|---|---|---|---|
| Horarios: cambiar de sucursal o de filtro | Qué turnos siguen: se desplazan a su sitio en vez de reaparecer | View Transition del mismo documento (`src/lib/transicion.ts`) con `view-transition-name` por turno; 380 ms | Cambio instantáneo (sin `startViewTransition` se aplica directo) |
| Formulario: elegir programa o sucursal | Qué cambió en el resumen y en las opciones | View Transition | Instantáneo |
| Visor de la galería: pasar de foto | La foto nueva ocupa el sitio de la anterior | View Transition (`visor-foto`) | Instantáneo |
| Contexto compartido | Que una elección hecha en otra sección cambió la pizarra o el resumen | Destello de borde boya (`box-shadow`, 1,2 s, una vez) en `[data-destello]` | Sin destello |
| Líneas de agua entre secciones | Dónde estoy: el agua se mueve con el scroll | Dos capas de la ola a distinta velocidad (`view-timeline`, solo `transform`) | Quietas |
| Botones de acción principal (`.onda`) | Qué toqué | Onda corta desde el punto de toque (600 ms) | Sin onda |
| Formulario: enviar | Que algo está pasando | El botón dice "Abriendo WhatsApp…" con el ícono girando 1,2 s, luego la confirmación | El ícono no gira |
| Preguntas: abrir | Dónde aparece la respuesta | `::details-content` + `interpolate-size` (Chrome 131+). Rompe la regla de "solo transform y opacity": medido, el titular de la sección no se mueve (crece hacia abajo) | Sin soporte, el fundido anterior; con reduced-motion, instantáneo |
| Precios, inscripción y hechos de Comunidad | Llamar la atención sobre la cifra una vez | Cada dígito es una rueda 0–9 que rueda hasta su número al entrar en vista (`Cifra`, `tabular-nums`) | La cifra final, quieta (también sin JS) |

**Descartado:** la máscara de ola que sube al entrar las fotos a sangre (punto 22 de la ronda). Animar una máscara repinta en el hilo principal en cada fotograma y en el carrusel de pasos entrarían cuatro fotos a la vez; no se podía garantizar fluidez en móvil con CPU 4×, así que esas fotos tienen la máscara quieta.

## Garantías
- **Sin JS todo se ve.** `RevealRoot` solo arma (`data-reveal-state="armed"`) lo que está por debajo de la pantalla al cargar. Comprobado en `scripts/qa/flujos.mjs`.
- Scroll-driven solo dentro de `@supports (animation-timeline: view())`. Sin soporte (Firefox y Safari antiguos) los elementos se quedan quietos y visibles.
- `ScrollEspia` no anima nada: solo escribe atributos en `<html>` (`data-scroll-dir`, `data-barra`, `data-espia`) y `aria-current` en la navegación. Sin JS no hay barra móvil y queda el botón flotante de WhatsApp.
- La altura de las preguntas se anima solo donde hay `interpolate-size`; es la excepción medida a "solo transform y opacity".
- View Transitions solo del mismo documento, para cambios de estado (no hay navegación entre rutas). Sin soporte o con movimiento reducido el cambio es instantáneo.
