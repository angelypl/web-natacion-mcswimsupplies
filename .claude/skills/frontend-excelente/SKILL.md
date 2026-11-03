---
name: frontend-excelente
description: Flujo maestro para TODO trabajo de frontend, visual o de UI en MC Swim (web pública y panel mcswim-admin): diseñar, implementar, verificar y reportar. Úsala siempre que la tarea toque pantallas, componentes, estilos, imágenes o animaciones.
---

# Frontend excelente: del diseño a "terminado y verificado"

Esta skill coordina las complementarias; léelas cuando apliquen:
`sistema-visual-mcswim` (cómo se ve) · `responsive-accesible` (que funcione en todo ancho y para todos) · `rendimiento-y-movimiento` (que sea liviano y seguro). Apóyate también en `frontend-design` (criterio estético) y `web-design-guidelines` (auditoría), sin que contradigan al sistema visual del proyecto.

## 0. Antes de tocar código
1. Lee `AGENTS.md`. Este Next.js tiene cambios de ruptura: consulta `node_modules/next/dist/docs/` antes de usar una API.
2. Identifica el repo: **web pública** (landing, animaciones, SEO) o **mcswim-admin** (herramienta de trabajo: densa, rápida, con permisos y CSP estricta).
3. Busca el componente o patrón más parecido y parte de él. No inventes un estilo nuevo.
4. Si el pedido es ambiguo en lo visual, propón en 2–3 líneas cómo se verá y sigue; no interrogues.

## 1. Diseñar
- Jerarquía clara: una cosa principal por pantalla, acción primaria evidente, el resto secundario.
- Espacio y alineación consistentes con la escala existente; nada de valores arbitrarios sueltos (`w-[437px]`).
- Diseña los 4 estados: normal, vacío, cargando, error. Y el caso extremo (nombres largos, 0 y 200 elementos).
- Admin: pensar en el celular del staff pasando lista. Web: pensar en el padre que llega desde WhatsApp en un móvil con datos.

## 2. Implementar
- Reutiliza (`src/components/ui/*` en la web, `ui.ts` en el admin); agrega variantes en el origen, no copias locales.
- Server Component por defecto, TypeScript estricto, sin `any`, sin comentarios que expliquen lo obvio.
- Texto visible en español. Datos del negocio en `src/content/*` (web): teléfono, horarios, precios y direcciones viven en un solo lugar.

## 3. Verificar (no se salta)
1. `npm run lint` y `npm run build` limpios.
2. Medición responsive en 375, 768, 1024, 1280, 1366, 1440 y 1920 (ver `responsive-accesible`): sin `left < 0`, sin scroll horizontal.
3. Contraste, foco visible y navegación por teclado en lo nuevo.
4. Si hay imágenes nuevas: peso < 500 KB, nombres sin duplicar.
5. Si tocaste el admin: probar con cada rol que la pantalla muestre u oculte lo correcto (la UI nunca sustituye al permiso del servidor).
6. Probar el flujo real en el navegador, no solo el build. Si no puedes probar la UI, dilo explícitamente.

## 4. Entregar
- Despliegues: seguir la regla de `AGENTS.md`. Cada push a `main` redeploya producción: espera el "adelante" explícito.
- Reporte final en pocas líneas: qué cambió, medidas de verificación (anchos probados), qué NO pudiste verificar y por qué.

## Definition of Done
- [ ] Se ve igual de bien en móvil y escritorio, medido
- [ ] Estados vacío/carga/error cubiertos
- [ ] Accesible (contraste, foco, teclado, alt)
- [ ] Sin regresión de peso o de RAM
- [ ] Reutiliza el sistema visual; no introduce estilos huérfanos
- [ ] Lint, build y pruebas en verde
