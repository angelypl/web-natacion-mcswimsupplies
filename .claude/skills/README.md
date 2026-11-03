# Skills de Claude Code de este repo

| Skill | Tipo | Procedencia |
|---|---|---|
| `frontend-excelente` | Propia | Flujo maestro. Coordina las demás. |
| `sistema-visual-mcswim` | Propia | Tokens y reglas visuales (web "Carril" + admin). |
| `responsive-accesible` | Propia | Medición responsive y WCAG 2.2 AA. |
| `rendimiento-y-movimiento` | Propia | Imágenes, motion, RAM, CSP. |
| `frontend-design` | Externa, copia sin cambios | https://github.com/anthropics/skills/tree/main/skills/frontend-design — commit `ca45fc4` (2026-10-28), revisada el 2026-11-03. Idéntica a la del plugin oficial `claude-plugins-official/frontend-design`. |
| `web-design-guidelines` | Externa, **modificada** | https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines — commit `1a2c79d` (2026-10-27). Reglas de https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md — commit `434b7f9` (2026-10-05). Revisada el 2026-11-03. |

## Revisión de seguridad (2026-11-03)

- **frontend-design**: solo texto (`SKILL.md` + licencia). Sin scripts, sin `allowed-tools`, sin red. Da criterio estético y evita el diseño genérico. Nada sospechoso.
- **web-design-guidelines**: solo texto, sin scripts. **Punto delicado**: el original manda descargar sus reglas en vivo con WebFetch en cada uso, desde una rama `main` que puede cambiar sin aviso. Son instrucciones remotas sin versión fija. Por eso se copiaron las reglas a `reglas.md` en un commit fijo y se quitó la descarga. Además se ajustó una regla para el español (mayúscula solo al inicio, no "Title Case").
- No se instaló nada de `wilwaldon/Claude-Code-Frontend-Design-Toolkit` ni de `finfin/awesome-frontend-skills`: el encargo las marcaba como "solo lectura de ideas, no instalar sin aprobación".

## Precedencia

`AGENTS.md` y la regla de despliegues > `sistema-visual-mcswim` > demás skills propias > skills externas.
