// Servidor local con los horarios reales para ver la pizarra sin levantar
// mcswim-admin. Utesa y VivirMás copian producción; Prado Oriental y Estadio
// Olímpico aún no están cargadas en mcswim-admin.
//   node scripts/qa/mock-horarios.mjs            (puerto 3011)
//   ADMIN_API_URL=http://localhost:3011 npx next dev -p 3002
import { createServer } from "node:http";

const PUERTO = Number(process.env.PUERTO ?? 3011);

const clase = (day, time, ageGroup, category, extra = {}) => ({
  day,
  time,
  ageGroup,
  category,
  notes: null,
  full: false,
  ...extra,
});

const datos = {
  branches: [
    // Utesa y VivirMás: copia de producción (mcswim-admin en Railway,
    // /api/public/schedules) al 2026-11-14. Se respeta "Sábados" en plural
    // tal como lo manda la API.
    {
      id: 1,
      name: "Utesa",
      address: "UTESA, Av. Isabel Aguiar, Santo Domingo Oeste",
      notes: "Piscina semiolímpica con carriles oficiales",
      schedules: [
        clase("Lunes", "5:00 PM", "Niños de 4 años en adelante y adultos", "Infantil / Adultos", { notes: "Grupo mixto de niños y adultos" }),
        clase("Lunes", "6:00 PM", "Niños de 4 años en adelante y adultos", "Infantil / Adultos", { notes: "Grupo mixto de niños y adultos" }),
        clase("Viernes", "8:00 PM", "Adultos", "Adultos", { notes: "Turno nocturno exclusivo para adultos" }),
        clase("Sábados", "2:00 PM", "Adultos", "Adultos", { notes: "Turno vespertino exclusivo para adultos" }),
        clase("Domingo", "8:00 AM", "Niños de 4 años en adelante y adultos", "Infantil / Adultos", { notes: "Grupo mixto de niños y adultos" }),
      ],
    },
    {
      id: 2,
      name: "VivirMás",
      address: "VivirMás, Sector El Millón, Santo Domingo",
      notes: "Piscina adaptada para iniciación infantil y desarrollo acuático",
      schedules: [
        clase("Viernes", "4:00 PM", "4 años en adelante", "Infantil / Juvenil", { notes: "Nivel principiante e intermedio" }),
        clase("Viernes", "5:00 PM", "4 años en adelante", "Infantil / Juvenil", { notes: "Técnica y resistencia acuática" }),
        clase("Sábados", "2:00 PM", "Desde 2 años", "Iniciación Temprana", { notes: "Piscina adaptada poco profunda" }),
        clase("Sábados", "3:00 PM", "Desde 2 años", "Iniciación Temprana", { notes: "Estimulación y confianza en el agua" }),
        clase("Sábados", "4:00 PM", "4 años en adelante", "Infantil y Grupal", { notes: "Perfeccionamiento de estilos" }),
      ],
    },
    // Estas dos sí son reales (enviadas por la academia el 2026-11-09).
    {
      id: 3,
      name: "Prado Oriental",
      address: "Santo Domingo Este",
      notes: null,
      schedules: [
        clase("Sábado", "7:00 AM", "Adultos", "Adultos"),
        clase("Sábado", "8:00 AM", "Niños desde 4 años", "Formación"),
      ],
    },
    {
      id: 4,
      name: "Estadio Olímpico",
      address: "Centro Olímpico Juan Pablo Duarte",
      notes: null,
      schedules: [
        clase("Martes", "8:00 PM - 9:00 PM", "Adultos", "Adultos"),
        clase("Miércoles", "8:00 PM - 9:00 PM", "Adultos", "Adultos"),
        clase("Jueves", "8:00 PM - 9:00 PM", "Adultos", "Adultos"),
      ],
    },
  ],
};

createServer((req, res) => {
  if (req.url?.startsWith("/api/public/schedules")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify(datos));
    return;
  }
  res.writeHead(404).end();
}).listen(PUERTO, () => console.log(`Horarios en http://localhost:${PUERTO}`));
