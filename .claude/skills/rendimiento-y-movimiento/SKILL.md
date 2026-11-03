---
name: rendimiento-y-movimiento
description: Rendimiento frontend, imágenes, animaciones y límites de seguridad (CSP). Úsala al agregar imágenes, animaciones, dependencias, componentes cliente o gráficos.
---

# Rendimiento y movimiento

Railway cobra por RAM sostenida. Un solo servicio con fotos sin comprimir llegó a 760 MB. Aquí lo liviano es dinero y velocidad.

## Imágenes (obligatorio)
- Nunca subas originales de cámara. Lado largo ≤ 2048 px, JPEG calidad 75–80, **< 500 KB** (PNG ≤ 1,5 MB; mejor conviértelo a JPEG si no tiene transparencia). Procesa con `sharp` antes de ponerlo en `public/`.
- Al reemplazar una foto, usa un **nombre nuevo** (las variantes optimizadas se cachean una semana).
- Siempre `next/image` en la web, con `sizes` correcto y `fill` dentro de un contenedor con `aspect-ratio`. En Next 16 `priority` está **deprecado**: la imagen principal usa `preload` (o `loading="eager"` + `fetchPriority="high"`). `next.config.ts` debe declarar `images.qualities` (obligatorio desde Next 16).
- Prohibido duplicar archivos con nombres distintos.

## Componentes
- Server Components por defecto; `"use client"` solo donde haya estado o eventos, lo más abajo posible del árbol. Nunca en layouts ni páginas.
- Los componentes cliente reciben el contenido por props; no importan `src/content/*` (que valida con zod) en el cliente.
- Antes de agregar una dependencia: ¿se resuelve con CSS/SVG? En el admin no hay librería de gráficos: SVG a mano, como `CapacityBar`.
- Datos externos con `revalidate` y **timeout + respaldo visible** (como `Schedules.tsx`); la página nunca debe romperse porque falle una API.

## Movimiento (solo web pública)
- Solo `transform` y `opacity` (o `clip-path`, `stroke-dashoffset`). Nada de animar `top/left/width/height/margin`. Nunca `transition: all`.
- Entrada del hero en **CSS puro**; el elemento LCP nunca parte de opacidad 0.
- Reveal al entrar en vista con el patrón static → armed → play (`src/components/ui/Reveal.tsx`): **sin JS todo se ve**.
- Scroll-driven (`animation-timeline: view()`) solo dentro de `@supports`; sin soporte, se queda quieto.
- Hoy todo el movimiento de la web es CSS y no hay librería de animación instalada. Si algún día hace falta (gestos, layout animado), usa `motion` con `LazyMotion` + `m.*` dentro de la hoja interactiva que lo necesite, nunca en el layout.
- Respeta `prefers-reduced-motion` en todo. Animaciones infinitas con pausa y detenidas fuera de pantalla. Inventario en `ANIMACIONES.md`.

## Panel admin: límites de seguridad
- CSP estricta con nonce: evita `style={{...}}` en línea y `next/image` (inyecta `style`); usa clases Tailwind o `<img>`. Mira cómo lo resuelven `AppNav.tsx` y `CapacityBar.tsx`.
- Nunca `dangerouslySetInnerHTML` con texto de usuario. (En la web pública, el JSON-LD con `JSON.stringify` de contenido propio es la excepción documentada por Next.)

## Verifica
- `npm run build` sin advertencias nuevas; revisa el peso de `public/` y del JS de la home antes y después.
- En producción, `railway metrics --all` para comparar la RAM tras un cambio pesado.
