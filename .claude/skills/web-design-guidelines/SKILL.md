---
name: web-design-guidelines
description: Revisa código de UI contra las Web Interface Guidelines de Vercel (accesibilidad, foco, formularios, animación, tipografía, rendimiento). Úsala al pedir "revisa mi UI", "audita accesibilidad", "revisa UX" o antes de dar por cerrada una pantalla.
metadata:
  author: vercel (adaptada para MC Swim)
  version: "1.0.0-mcswim"
  argument-hint: <archivo-o-patrón>
---

# Web Interface Guidelines

Revisa los archivos indicados contra las reglas de `reglas.md` (en esta misma carpeta).

## Cambio respecto al original

La skill original de Vercel descarga las reglas en vivo desde
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
en cada uso. Aquí **no se descargan**: `reglas.md` es una copia revisada y fija
(commit `434b7f9`, 2026-10-05). Así nadie puede cambiar estas instrucciones sin
pasar por git. Para actualizar, descarga la versión nueva, revísala y reemplaza el archivo en un commit.

## Cómo funciona

1. Lee `reglas.md`.
2. Lee los archivos indicados (si no se indican, pregunta cuáles).
3. Aplica todas las reglas y entrega los hallazgos en formato `archivo:línea`.

## Ajustes para este proyecto (ganan sobre `reglas.md`)

- El sitio está en español de República Dominicana: títulos y botones en
  **mayúscula inicial** (no "Title Case" del inglés).
- La regla "segunda persona" aplica como tuteo ("Reserva tu cupo").
- Si una regla choca con `sistema-visual-mcswim` o con `AGENTS.md`, ganan ellos.
