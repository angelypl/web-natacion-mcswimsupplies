# Panel de administración (`/admin`)

## ⚠️ Sin autenticación (intencional, por ahora)

`/admin` y todas sus subrutas están completamente abiertas: cualquiera con la
URL puede ver y editar horarios, estudiantes y asistencia. **No hay login,
sesiones ni cookies de credenciales.** Esta es una decisión consciente para
esta fase del proyecto — el login se agregará en una iteración posterior. No
uses este panel con datos sensibles reales hasta que se agregue
autenticación, y no expongas la URL de producción públicamente.

## Qué hace

- **`/admin`** — resumen: estudiantes activos, clases activas, asistencia de
  hoy (tomada/pendiente).
- **`/admin/horarios`** — CRUD de clases (`SwimClass`). El interruptor
  "Activa/Inactiva" controla si la clase aparece en la web pública
  (`src/components/Schedules.tsx`, que lee `SwimClass` con `isActive: true`).
- **`/admin/estudiantes`** — CRUD de estudiantes, con vista de detalle que
  muestra sus inscripciones (`Enrollment`).
- **`/admin/asistencia`** — selecciona una clase y una fecha (por defecto
  hoy, pero se puede elegir cualquier fecha pasada), marca presente/ausente
  por estudiante inscrito y guarda. Guardar es idempotente: volver a marcar
  el mismo día no crea registros duplicados (`AttendanceRecord` tiene un
  `@@unique([enrollmentId, date])` y el guardado usa `upsert`).
- **`/admin/inscribir`** — inscribe un estudiante existente en una clase
  existente (enlazado desde `/admin/estudiantes` y `/admin/horarios`).

## Stack de datos

- **ORM**: Prisma 8 (`@prisma/orm-postgres`). **Importante**: esta versión de
  Prisma es muy distinta a la clásica (`schema.prisma` + `@prisma/client`).
  No hay `prisma migrate dev`; el flujo es `contract.prisma` →
  `prisma contract emit` → `prisma migration plan` → `prisma db migrate`.
  Antes de tocar el esquema o las queries, lee
  `node_modules/@prisma/orm-postgres/skills/prisma-8/SKILL.md` y sus
  referencias — la API (`db.orm.public.<Model>`) no se parece a Prisma
  clásico.
- **Contrato de datos**: `src/prisma/contract.prisma` (equivalente a
  `schema.prisma`).
- **Cliente**: `src/prisma/db.ts` exporta `db`, usado en Server Components y
  Server Actions vía `import { db } from '@/prisma/db'`.
- **Migraciones**: `migrations/app/` (comitear a git). Cada cambio de
  esquema sigue el flujo:
  ```bash
  # 1. Edita src/prisma/contract.prisma
  npx prisma contract emit
  npx prisma migration plan --name mi_cambio
  npx prisma db migrate
  ```

## Levantar Postgres en local

Necesitas Postgres ≥ 15 accesible en `DATABASE_URL` (ver `.env.example`).

**Con Docker** (recomendado):

```bash
docker run --name mcswim-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mcswim \
  -p 55432:5432 \
  -d postgres:16
```

> Si ya tienes un Postgres local instalado (nativo o en Docker) usando el
> puerto 5432 o 5433, este comando usa 55432 para evitar el choque. Ajusta
> el puerto si hace falta — en Windows puedes verificar qué proceso usa un
> puerto con
> `Get-NetTCPConnection -LocalPort <puerto> | Select OwningProcess` en
> PowerShell.

Copia `.env.example` a `.env` y ajusta `DATABASE_URL` si cambiaste el
puerto/usuario/contraseña:

```bash
cp .env.example .env
```

## Migraciones y seed

Con `DATABASE_URL` apuntando a una base vacía:

```bash
npx prisma contract emit     # genera contract.json / contract.d.ts
npx prisma db migrate        # aplica migrations/app/*
npm run db:seed              # siembra las 2 sucursales y los 10 horarios actuales
```

`npm run dev` funciona normalmente después de esto — no hace falta nada
adicional en desarrollo.

## Despliegue en Railway

1. Agrega el plugin de Postgres al proyecto de Railway (esto provee
   `DATABASE_URL` automáticamente como variable de entorno) y confirma que
   quedó enlazada al servicio web (no solo creada como recurso suelto).
2. `package.json` tiene `"postinstall": "prisma contract emit"` — regenera
   `contract.json`/`contract.d.ts` en cada `npm install` del build. No
   necesita `DATABASE_URL` (no toca la base de datos).
3. `railway.toml` corre las migraciones antes de arrancar el servidor:
   ```toml
   [deploy]
   startCommand = "npx prisma db migrate && npm run start"
   ```
   `prisma db migrate` es la versión de Prisma 8 de lo que en Prisma
   clásico sería `prisma migrate deploy` — aplica `migrations/app/*`
   pendientes contra `DATABASE_URL` y no hace nada si ya está al día
   (seguro de correr en cada deploy).
4. El seed (`npm run db:seed`) **no** corre automáticamente en el deploy.
   Es idempotente (usa `upsert` en `Branch` y se salta los horarios si
   `SwimClass` ya tiene filas), así que es seguro re-ejecutarlo, pero
   está pensado como paso manual único la primera vez:
   ```bash
   railway run npm run db:seed
   ```
5. Ninguna página consulta la base durante `next build`: `/` y `/admin` se
   renderizan por request (`Schedules.tsx` y el dashboard llaman a
   `connection()`). Esto es necesario porque en el build de Railway la red
   privada hacia Postgres no está disponible, y en el primer deploy las
   tablas todavía no existen (las migraciones corren en el start). El
   build sí necesita que `DATABASE_URL` esté definida (el cliente valida la
   URL al importarse), aunque no se conecte.
