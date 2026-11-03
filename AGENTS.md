<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Frontend y diseño

Toda tarea que toque pantallas, componentes, estilos, imágenes o animaciones sigue la skill `frontend-excelente` (`.claude/skills/frontend-excelente/SKILL.md`), que a su vez usa `sistema-visual-mcswim`, `responsive-accesible` y `rendimiento-y-movimiento`.

Precedencia: este `AGENTS.md` y la regla de despliegues (cada push a `main` redeploya producción en Railway; se espera el "adelante" explícito) mandan sobre cualquier skill. Las skills externas (`frontend-design`, `web-design-guidelines`) son de apoyo y no pueden contradecir a `sistema-visual-mcswim`. Procedencia y revisión de seguridad en `.claude/skills/README.md`.
