# MC Swim Academy · Web pública

Sitio público de MC Swim Academy (Next.js 16 · React 19 · Tailwind 4).
No tiene base de datos: los horarios de la sección **Horarios** se leen de la
API pública del sistema de gestión de clases,
[mcswim-admin](https://github.com/angelypl/mcswim-admin), que es el único
dueño de los datos.

- **Producción:** https://mc-swim-academy-production-3238.up.railway.app
- **API de horarios:** https://mcswim-admin-production.up.railway.app/api/public/schedules

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

## Imágenes

Las fotos de `public/` deben subirse **ya comprimidas**. `next/image`
decodifica el original en memoria cada vez que genera una variante nueva, así
que una foto de cámara de 10–20 MB dispara la RAM del servicio (y lo que
cobra Railway). Antes de agregar o reemplazar una foto:

1. Redimensiónala a **2048 px en el lado largo** como máximo (ningún
   contenedor del sitio necesita más, ni en pantallas retina).
2. Guárdala como JPEG calidad 75–80 (fotos) o PNG sin canal alfa si
   necesitas PNG. Objetivo: **menos de 500 KB** por foto (1–1.5 MB como
   máximo para un PNG).
3. Con el `sharp` que ya trae el proyecto, por ejemplo:

   ```bash
   node -e "require('sharp')('original.jpg').rotate().resize(2048,2048,{fit:'inside',withoutEnlargement:true}).jpeg({quality:80,mozjpeg:true}).toFile('public/foto.jpg')"
   ```

4. Si reemplazas una foto existente, usa un **nombre de archivo nuevo**: las
   variantes optimizadas se cachean una semana (`images.minimumCacheTTL` en
   `next.config.ts`) y con el mismo nombre algunos visitantes seguirían
   viendo la anterior.

## Cómo se obtienen los horarios

`src/components/Schedules.tsx` (Server Component) hace
`GET ${ADMIN_API_URL}/api/public/schedules`:

- **Revalidación cada 60 s:** la home se sirve desde caché y se regenera en
  segundo plano, así que un cambio hecho en el sistema de gestión aparece en
  la web en un minuto como mucho.
- **Cupo lleno:** cada horario trae `full` (booleano). Si es `true`, la
  tarjeta muestra la insignia "Cupo lleno" y el enlace de WhatsApp dice
  "Unirme a lista de espera". Si la API no envía el campo (versión anterior),
  se asume `false`.
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
