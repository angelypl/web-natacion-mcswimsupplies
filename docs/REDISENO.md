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
