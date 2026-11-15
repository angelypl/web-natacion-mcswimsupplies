# Rediseño "Carril" (rama `experimento/rediseno`)

Versión experimental y **solo local**. No se ha hecho push ni despliegue. `main` y producción no cambian.

## Ver, quedarse o revertir
- **Ver**: en `D:\Escritorio\Repos\web-natacion-mcswimsupplies-rediseno`: `npm run dev -- -p 3002` y abrir http://localhost:3002 (y `/styleguide`).
- **Revertir sin dejar rastro** (desde la carpeta original del repo):
  ```bash
  git worktree remove ../web-natacion-mcswimsupplies-rediseno --force
  git branch -D experimento/rediseno
  ```
- **Quedárselo**: merge de la rama a `main` y push. Eso despliega en Railway, así que solo con "adelante" explícito.

## Decisiones
- **Identidad propia, medida del logo y de las fotos** (paleta en `.claude/skills/sistema-visual-mcswim`). Saira Extra Condensed 800 para titulares y Figtree para texto.
- **Concepto "Carril"**: los programas son carriles; las corcheras dividen; el titular del hero cruza una línea de agua y se refracta debajo de la ola (CSS puro, dos capas con máscara SVG).
- **Clases y Precios se unieron en "Elige tu carril"**: antes los mismos precios estaban en dos secciones.
- **Tonos de sección** (`<Section tone>`): abismo → espuma → piscina → marino → espuma → abismo → blanco → marino → espuma → abismo.
- **Contraste calculado**: sobre azul piscina, turquesa, boya y WhatsApp el texto es marino. El blanco sobre azul piscina (3,26) no pasa AA. En la web actual, el ícono blanco sobre el verde de WhatsApp (`bg-green-500`, 2,28) y el texto `slate-400` sobre blanco (2,56, por ejemplo la nota bajo el botón del formulario) no pasan; aquí se corrigieron. Los botones `bg-blue-600 text-white` actuales sí pasan (5,17).
- **Sin `framer-motion`**: todo el movimiento es CSS. Ver `ANIMACIONES.md`.
- **Contenido tipado y validado con zod** en `src/content/*`: un dato inválido rompe el build. Teléfono, WhatsApp, sucursales y días en un solo lugar (`site.ts`).
- **Sin Lenis**: el scroll nativo es más liviano y accesible.
- **Imágenes**: las dos PNG de ~1 MB (que eran fotos) pasaron a JPEG con nombre nuevo (`clase-tabla-coach.jpg`, `comunidad-utesa.jpg`). Se borraron los SVG de la plantilla de Next que no se usaban. `images.qualities` declarado (obligatorio en Next 16); las fotos usan calidad 60 y blur placeholder.
- **SEO**: OG generada (`opengraph-image.tsx`), JSON-LD (SportsOrganization + 2 SportsActivityLocation + FAQPage), `sitemap.xml`, `robots.txt` (bloquea `/styleguide`).
- **Horarios**: la lógica de la API no se tocó (revalidate 60 s, timeout 4 s, respaldo). Solo se rediseñó `SchedulesClient.tsx` (mismo archivo, mismos tipos), que ahora agrupa por día.

## Segunda ronda: usabilidad y transiciones (2026-11-09)

Sin commit todavía: los cambios están en el árbol de trabajo de esta rama.

- **Selector "¿Quién va a nadar?" en el hero**: tres enlaces por edad que llevan al carril correcto (`#carril-1…3`). Sustituye a la lista de tres datos, que repetía la entradilla.
- **Navegación**: sección activa marcada en el menú, progreso de lectura bajo la cabecera, y en móvil la cabecera se esconde al bajar. Todo lo coordina `src/components/ui/ScrollEspia.tsx`.
- **Menú móvil a pantalla completa**, con bloqueo de scroll, ciclo de foco y un acceso a llamar.
- **Barra de acciones en móvil** (`BarraMovil`): "Horarios" y "Reservar mi cupo" fijos abajo. Reemplaza al botón flotante en móvil y se retira sobre el formulario.
- **Carriles más compactos en móvil**: el número pasa a ser una chapa sobre la foto, y precio y botón comparten fila.
- **"Así empiezas" en móvil es un carrusel** de tarjetas (antes eran cuatro bloques apilados con foto).
- **Horarios**: filtro por programa (sale de las categorías que envía la API), marca "Hoy" calculada con la hora de RD, y un mensaje de WhatsApp distinto para la lista de espera. La lógica de la API sigue intacta.
- **Formulario**: programa, sucursal y nivel son tarjetas para marcar en vez de desplegables. La sucursal se ajusta sola al programa (Iniciación solo en VivirMás, Adultos solo en Utesa; sale de `sucursalIds` en `programas.ts`). El teléfono se valida y se formatea al salir del campo.
- **Galería de fotos** en "Todas las edades" y cierre de las preguntas con un botón de WhatsApp.
- `devIndicators: false` en `next.config.ts` para revisar el diseño sin la insignia de Next.

## Sucursales nuevas: Prado Oriental y Estadio Olímpico (2026-11-09)

Horarios enviados por la academia:

| Sucursal | Día | Hora | Grupo |
|---|---|---|---|
| Prado Oriental | Sábado | 7:00 a. m. | Adultos |
| Prado Oriental | Sábado | 8:00 a. m. | Niños desde 4 años (Formación) |
| Estadio Olímpico | Martes, miércoles y jueves | 8:00 a 9:00 p. m. | Adultos |

- Se agregaron a `src/content/site.ts` con la etiqueta "Nueva". Todo lo que decía "dos sucursales" (hero, "Por qué", título de Sucursales, descripción, SEO) ahora sale del número de sucursales, y la frase "clases de lunes a domingo" solo aparece si entre todas cubren los siete días.
- Programas: Formación se da en Utesa, VivirMás y Prado Oriental; Adultos en Utesa, Prado Oriental y Estadio Olímpico (`sucursalIds` en `programas.ts`). El texto "Sucursales …" de cada carril y las opciones del formulario salen de ahí.
- Pizarra de horarios: con cuatro sucursales las pestañas van en 2 × 2 en el celular y en una fila desde 640 px. Las horas se muestran con la norma del español ("7:00 a. m.", "8:00 a 9:00 p. m."), aunque el panel las guarde como "7:00 AM".
- **En producción estos horarios hay que cargarlos en mcswim-admin**: la web los lee de su API. En local están en `scripts/qa/mock-horarios.mjs`, junto a los de ejemplo de Utesa y VivirMás. Para el Estadio, escribir la hora como `8:00 PM - 9:00 PM`.
- `TODO_CLIENTE`: dirección exacta y enlace de Google Maps de las dos sedes (hoy el enlace busca el sector o el recinto), y confirmar que la inscripción vale en las cuatro ("Acceso a todas las sucursales").

## Tercera ronda: recorrido, jerarquía, pulido y movimiento (2026-11-15)

Un commit local por fase sobre el punto de partida `0bd216b`. Medidas antes/después en `QA.md`.

### Fase 1: un solo recorrido
- **Contexto compartido** (`src/lib/eleccion.ts`): programa, sucursal y turno viven en la URL (`?programa=adultos&sucursal=utesa&turno=Lunes|5:00 PM`). Sobrevive a recargar y viaja al compartir el enlace; no se guarda nada en el navegador. Los enlaces del servidor llevan `data-elegir` y los aplica `EleccionRoot` sin recargar (sin JS, el navegador carga esa URL y funciona igual). Hero, carriles, pestañas y filtro de horarios, tarjetas de sucursal y formulario leen y escriben lo mismo. En Horarios, "Tu elección" muestra lo elegido y deja quitar cada parte.
- **Programas contra categorías de la API** (`src/content/categorias.ts`): reglas tolerantes que traducen "Infantil / Adultos", "Iniciación Temprana"… a Iniciación, Formación y Adultos. Un turno puede servir a dos programas; una categoría desconocida se muestra con su texto y solo queda fuera de los filtros. La API no cambia.
- **Del turno a la reserva**: cada turno tiene "Reservar este turno" (lleva al formulario con programa, sucursal, día y hora puestos) y "Preguntar" por WhatsApp. El formulario muestra antes del botón un resumen: programa, sucursal, turno, mensualidad, inscripción y primer mes.
- **Acción principal = el formulario** ("Reservar mi cupo", boya, a `#inscripcion`). Justificación: el formulario termina en el mismo WhatsApp, pero con nombre, teléfono, programa, sucursal, turno y nivel en un solo mensaje, así la academia puede confirmar en una respuesta en vez de preguntar dato por dato. Quien prefiere escribir directo tiene el verde de WhatsApp en cada sección.
- **Regla de colores de las acciones** (en `sistema-visual-mcswim`): verde = sale a WhatsApp, siempre y solo eso; boya = la acción principal dentro de la página, siempre con el texto "Reservar mi cupo". Verbos distintos solo para acciones distintas: "Preguntar", "Lista de espera", "Cómo llegar", "Ver horarios de…". `qa:flujos` lo comprueba.
- **Navegación**: "Carriles" → "Clases y precios" (el ancla `#carriles` y el concepto de carril siguen dentro), "Primera clase" → "Cómo empezar", y se añade "Inscripción" al menú móvil y al pie (en la cabecera de escritorio ya es el botón). El menú móvil pierde los números (el sistema los reserva para carriles y pasos).
- **Un acceso persistente por ancho**: desde 640 px, solo "Reservar mi cupo" en la cabecera; el botón flotante de WhatsApp queda como respaldo en móvil sin JS. En móvil, la barra del pulgar tiene siempre "Reservar mi cupo" y a la izquierda un acceso que cambia con la sección (`html[data-seccion]`): "Horarios" en general y "Preguntar" (WhatsApp) mientras se está en Horarios.
- **Sucursales y pizarra**: no se fundieron las fichas dentro de las pestañas de Horarios. En producción la API solo tiene hoy Utesa y VivirMás: si la ficha viviera en la pestaña, Prado Oriental y Estadio Olímpico desaparecerían de la página hasta que se carguen en mcswim-admin, y también con la API caída.

### Fase 2: menos scroll, misma información
- **Hero**: titular más bajo en portátil y en móvil, botones en una fila y "¿Quién va a nadar?" en tres columnas. En 1366×768 entran titular, acción principal y selector; en 390×844 asoma la foto. Foto nueva: `MCB07464.jpg` (instructora con un niño en el agua): plano cercano en vez del plano general con figuras pequeñas. El LCP sigue siendo el titular (no parte de opacidad 0) y la foto conserva `preload` y `sizes`.
- **Carriles**: en escritorio, tres carriles lado a lado separados por corcheras verticales (`CorcheraVertical`), para comparar edad, precio y sucursales. Se quitó la descripción (repetía la lista "incluye"), cada carril dice su **primer mes** (mensualidad + inscripción, calculado) y tiene "Reservar mi cupo" y "Ver horarios de…". La inscripción pasa junto al titular y las formas de pago a una fila. "Tu elección" marca el carril elegido.
- **Así empiezas**: los cuatro pasos en una fila, cada uno con su foto (antes: foto fija y cuatro bloques a `62vh`, con los no activos al 40 % de opacidad, unas 3 pantallas). En móvil sigue el carrusel. Se eliminó `FotosPasos`.
- **Horarios**: marcador de piscina: una fila por día y una línea por turno con la hora en `font-display` + `tabular-nums`, columnas alineadas, "Hoy" bajo el día y "Cupo lleno" tachando la hora. Días normalizados ("Sábados" → "Sábado"), turnos ordenados por día y hora, grupo de edad y nota sin repetirse, y "Hoy no hay clases en X. La próxima: …" cuando toca.
- **Sucursales**: tarjetas compactas en 4 columnas (2 en tableta, 1 en móvil) con la **zona** como dato más visible ("Oeste", "Distrito Nacional", "Este"), días como texto ("lun · vie · sáb · dom", sin las fichas que parecían botones), la etiqueta de la sede como rasgo común (las sedes nuevas ya no quedan cojas), "Ver horarios" (activa su pestaña) y "Cómo llegar". Se quitó "Punto principal": con cuatro sedes ya no aplica y su dirección es la de Utesa. El `h2` empieza en mayúscula.
- **Inscripción**: en escritorio la columna izquierda queda fija y cuenta "Después de enviar" (pasos 2 a 4 de `pasos.ts`). En móvil: contacto en una fila de tres, sucursales en dos columnas, nivel en tres, nombre y teléfono en una fila desde 640 px. El teléfono se formatea mientras se escribe, los campos tienen `enterkeyhint` y, tras enviar, hay un enlace "Abrir WhatsApp de nuevo". Los mensajes de error no cambiaron.
- **Prueba social**: franja de hechos sacados de los datos (sucursales, días con clase, edad mínima, programas) y acceso a Instagram junto a la foto de grupo. `TODO_CLIENTE`: el hueco de testimonios está diseñado y aparece en cuanto haya uno con `esEjemplo: false`.
- **Pie**: una pantalla como mucho; navegación en una fila, contacto en una columna, rótulo más pequeño en móvil y sin repetir las sucursales.

### Fase 3: pulido visual
- **Fotos**: se incorporan las tres que no se usaban, cada una con un `alt` de lo que se ve: `MCB07464.jpg` (hero), `GM106022.jpg` (paso 1, los cuatro instructores) y `02488C2A-….jpeg` (paso 3, tres alumnos en el borde). Ninguna foto se repite en secciones contiguas. "Por qué" mantiene `GM106103.jpg` (dos instructores en el borde), que es la que usa producción para el equipo: así lo pidió el cliente el 2026-11-14, por eso la de los cuatro instructores no va ahí.
- **Tres tratamientos con criterio de uso** (`globals.css`, `/styleguide`): sticker para personas, agua (a sangre con borde en ola) para los planos de piscina de los pasos, y plana para la foto de grupo, que nunca se recorta.
- **Boya** reservado para "Reservar mi cupo" y el aviso "Hoy". Salen de boya: la etiqueta "Nueva" (turquesa), el paso activo (ya no existe), el bloque "¿No encuentras tu horario?" (ahora una línea con el botón de WhatsApp), el subrayado de la sección activa y el final de la barra de progreso.
- **Ritmo**: secuencia de tonos abismo → espuma → piscina → marino → espuma (pizarra abismo) → abismo → blanco → marino → espuma → abismo. El tramo azul de Carriles bajó de 3 a 1,6 pantallas en 1366; los rellenos verticales pasaron de `py-20/28` a `py-14/20` o `py-16/24`.

## Cambios de contenido que conviene revisar
- `TODO_CLIENTE` **Testimonios**: no consta que sean reales. Están marcados `esEjemplo` y solo se ven en desarrollo, con la etiqueta "Ejemplo, falta confirmar". En producción no saldrían.
- `TODO_CLIENTE` **Logo**: pedir SVG o PNG transparente. El JPEG tiene fondo blanco (va sobre una chapa blanca).
- `TODO_CLIENTE` **Horas de apertura** por sucursal, para el JSON-LD (hoy solo los días).
- **"Evaluación gratis"**: la web actual dice "Agendar evaluación gratis" y a la vez "la inscripción de RD$1,000 incluye la evaluación". Aquí se dice "va incluida en la inscripción". Confirmar cuál es cierto.
- **Badges "Más popular" / "Destacado"**: la web actual marca un programa distinto en cada sección. Se quitaron por contradictorios.
- **Foto de grupo** (`27-de-febrero.png`): su `alt` decía "Croquis de ubicación", pero es una foto de grupo. Se corrigió el `alt` y no se afirma en qué sucursal se tomó.
- Programas renombrados por carril: **Iniciación** (2–3 años), **Formación** (4+ años; tomado del badge "Formación continua"), **Adultos**.
- Frase nueva de marca en el hero: "Aquí el miedo se queda en el borde".

## Trampas encontradas
- `TaskStop`/cerrar `npx next dev` puede dejar vivo el `start-server.js` hijo y ocupar el puerto. Al medir rendimiento, comprueba que respondes al build de producción (el JS de dev pesa ~820 KB).
- `wa.me` redirige a `api.whatsapp.com` y codifica los espacios como `+`. Para leer el mensaje en un test usa `URLSearchParams`.
- Un `node_modules` enlazado (junction) desde fuera de la raíz rompe Turbopack.
- No corras `next build` con `next dev` abierto: el CSS de desarrollo se queda con clases viejas aunque reinicies. Se arregla cerrando dev, borrando `.next/dev` y volviendo a abrir.
- `tailwind-merge` necesita registrar `text-display-*`, `rounded-pill/card/blob`, `shadow-flota/hondo` y `font-display` (`src/lib/cn.ts`).
