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
- `tailwind-merge` necesita registrar `text-display-*`, `rounded-pill/card/blob`, `shadow-flota/hondo` y `font-display` (`src/lib/cn.ts`).
