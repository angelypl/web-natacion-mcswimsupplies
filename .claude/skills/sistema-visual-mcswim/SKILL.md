---
name: sistema-visual-mcswim
description: Sistema visual de MC Swim Academy (paleta, tipografía, tonos de sección, gráficos de marca, componentes). Úsala al crear o modificar cualquier pantalla, sección, tarjeta, botón, formulario o gráfico, en la web pública o en el panel mcswim-admin.
---

# Sistema visual MC Swim

Antes de escribir clases nuevas, busca el patrón existente (`src/components/*`, `src/components/ui/*`, `src/lib/ui.ts` en el admin) y reutilízalo. Una pantalla nueva debe parecer escrita por la misma mano.

Cada repo usa su sección: la **web pública** tiene identidad propia ("Carril"); el **panel admin** sigue con Inter + `blue-600`. No mezcles.

---

## Web pública — sistema "Carril"

La referencia viva está en `/styleguide` (noindex). Los tokens están en `@theme` de `src/app/globals.css`. **Nunca un hex suelto en un componente.**

### Paleta (medida del logo y de las fotos reales, no inventada)
| Token | Hex | Origen |
|---|---|---|
| `marino-950` | `#001a38` | Sombra del marino del logo (fondos más profundos) |
| `marino-900` | `#002b5c` | Letras "MC" del logo |
| `marino-800` | `#04386a` | Letras "MC" del logo (tono principal) |
| `piscina-400/500/600/700` | `#03a8e8` / `#0297da` / `#0277b5` / `#01659c` | Chapoteo del logo, agua de Utesa |
| `turquesa-400` / `turquesa-700` | `#38d4b8` / `#0b6f66` | Degradado menta del logo |
| `agua-300` | `#7fe9ee` | Agua de VivirMás |
| `boya-400` | `#f4d23c` | Fideos (noodles) amarillos de las fotos |
| `corchera-600` | `#c2304e` | Corcheras rojas de la piscina |
| `espuma-50` / `espuma-100` | `#f3fafc` / `#e2f3f7` | Fondos claros |
| `tinta-600` / `tinta-500` | `#3d5670` / `#56708a` | Texto secundario sobre claro |
| `niebla-300` | `#a9c3d6` | Texto secundario sobre marino |
| `whatsapp` | `#25d366` | Solo botones de WhatsApp |

### Contraste (calculado, WCAG AA)
- Sobre **marino** (800/900/950): texto `espuma-50`/blanco; acentos `turquesa-400`, `agua-300`, `boya-400`; secundario `niebla-300`. `piscina-400` como texto solo sobre 900/950.
- Sobre **espuma/blanco**: texto `marino-950/900`; secundario `tinta-600` (o `tinta-500` ≥ 14 px); acento como texto `piscina-700`, `turquesa-700` o `corchera-600`.
- Sobre **piscina-500**, **turquesa-400**, **boya-400** y **whatsapp**: el texto es `marino-950`, **nunca blanco** (blanco sobre piscina-500 = 3,26 ✗).
- `piscina-400`, `turquesa-400`, `agua-300` y `boya-400` **nunca** como texto sobre claro.

### Tipografía (`next/font`)
- **Saira Extra Condensed** 800 (`font-display`, siempre con `font-extrabold`; solo se carga ese peso): titulares en mayúsculas, condensados, estilo de marcador de competencia. Escala `text-display-2xl … sm` con `clamp()`, line-height 0,86–1.
- **Figtree** variable (`font-sans`): todo el texto. `text-lead` para entradillas.
- Horas y precios: `font-display` + `tabular-nums`.
- No agregues otra familia.

### Forma y movimiento
- Radios: `rounded-pill` (botones, pastillas), `rounded-card` (1,5 rem, tarjetas), `rounded-blob` (2,5 rem, fotos destacadas).
- Sombras teñidas de marino (`shadow-hondo`, `shadow-flota`), nunca negras.
- Easings `ease-out-expo`, `ease-spring-soft`; duraciones 150/250/500/900 ms.

### Tonos de sección
`<Section tone="marino|abismo|espuma|blanco|piscina|boya">` fija `data-tone` y las variables `--tone-bg/-fg/-muted/-accent/-focus/-line`. Los hijos usan `text-tone-fg`, `text-tone-muted`, `text-tone-accent`, `border-tone-line`, etc., así cualquier componente funciona sobre cualquier tono. Alterna oscuro y claro.

### Gráficos de marca (`src/components/brand/*`)
- `Corchera`: divisor con segmentos rojo/blanco/azul, como las corcheras de la piscina. Es el gráfico que identifica la web.
- `LineaDeAgua`: borde ondulado entre secciones.
- `Gotas`: salpicadura del logo.
- `PatronCarriles`: líneas de carril a ~6 % de opacidad en fondos marino.

### Reglas
- Los programas son **carriles** (Carril 1: 2–3 años, Carril 2: 4+ años, Carril 3: adultos). Los números de carril solo se usan ahí y en los pasos de inscripción (secuencias reales).
- Nada de eyebrow en mayúsculas sobre cada título, ni `→` al final de cada botón, ni la misma tarjeta repetida en todas las secciones.
- Datos que no tenemos: `TODO_CLIENTE` en `src/content/*`. Ejemplos solo visibles en dev con la etiqueta "Ejemplo".

---

## Panel mcswim-admin
- Inter (`next/font`), primario `blue-600` (hover `blue-700`), oscuros `blue-900/950`, acento `cyan`, neutros `slate`, estados `emerald`/`red`/`amber`.
- Radios `rounded-xl` botones e inputs, `rounded-2xl` tarjetas, `rounded-3xl` destacadas. Sombras `shadow-sm shadow-blue-900/5`. Bordes `border-slate-200/80`.
- Importa de `src/lib/ui.ts` (`card`, `label`, `input`, `button.*`, `badge.*`). No dupliques esas clases: si falta una variante, agrégala allí.
- Reusa `PageHeader`, `EmptyState`, `SubmitButton`, `CapacityBar`. Densidad funcional; sin framer-motion.
- Toda lista o gráfico necesita estado vacío, de carga y de error con texto en español.

## Contenido (ambos)
- Español de República Dominicana, tuteo, tono cálido y claro. Iconos solo de `lucide-react`.
- Números y fechas con `Intl` (`es-DO`). Nunca "Lorem".
