# MC Swim Academy · Web pública

Sitio público de MC Swim Academy (Next.js 16 · React 19 · Tailwind 4).
No tiene base de datos: los horarios de la sección **Horarios** se leen de la
API pública del sistema de gestión de clases,
[mcswim-admin](https://github.com/angelypl/mcswim-admin), que es el único
dueño de los datos.

## Desarrollo local

```bash
cp .env.example .env.local   # ADMIN_API_URL=http://localhost:3001
npm install
npm run dev                  # http://localhost:3000
```

Para ver horarios reales en local, levanta también `mcswim-admin` en el
puerto 3001 (ver su README). Sin él, la sección de horarios muestra el
respaldo "Consulta nuestros horarios por WhatsApp". El resto de la página
funciona igual.

## Cómo se obtienen los horarios

`src/components/Schedules.tsx` (Server Component) hace
`GET ${ADMIN_API_URL}/api/public/schedules`:

- **Revalidación cada 60 s:** la home se sirve desde caché y se regenera en
  segundo plano, así que un cambio hecho en el sistema de gestión aparece en
  la web en un minuto como mucho.
- **Timeout de 4 s:** si la API falla, tarda o `ADMIN_API_URL` no está
  definida, la sección muestra el respaldo con el botón de WhatsApp. La home
  nunca se cae por esto.

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `ADMIN_API_URL` | URL base del sistema de gestión (sin `/` final). En producción, la URL pública del servicio `mcswim-admin` en Railway. Tiene que estar también durante el build. |

## Despliegue

Es el servicio `mc-swim-academy` del proyecto **mc-swim-academy** en
Railway, conectado a este repo con **auto-deploy en cada push a `main`**. No
hace falta `railway up`. La configuración de los servicios del proyecto
vive en el repo `mcswim-admin` (`.railway/railway.ts`).
