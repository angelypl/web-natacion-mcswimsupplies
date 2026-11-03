// Servidor local con horarios DE EJEMPLO para ver la pizarra sin levantar
// mcswim-admin. Solo para QA: no son los horarios reales.
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
    {
      id: 1,
      name: "Utesa",
      address: "Av. Isabel Aguiar",
      notes: "Ejemplo para QA",
      schedules: [
        clase("Lunes", "5:00 PM", "Niños 4 a 7 años", "Formación"),
        clase("Lunes", "6:00 PM", "Adultos", "Adultos", { full: true }),
        clase("Viernes", "4:00 PM", "Niños 8 a 12 años", "Formación"),
        clase("Sábado", "9:00 AM", "Niños 4 a 7 años", "Formación", { notes: "Traer gorro y lentes" }),
        clase("Sábado", "10:00 AM", "Jóvenes y adultos con nombre de grupo bastante largo", "Adultos"),
        clase("Domingo", "8:00 AM", "Adultos", "Adultos"),
      ],
    },
    {
      id: 2,
      name: "VivirMás",
      address: "Sector El Millón",
      notes: null,
      schedules: [
        clase("Viernes", "4:30 PM", "Niños 2 a 3 años", "Iniciación"),
        clase("Sábado", "9:30 AM", "Niños 2 a 3 años", "Iniciación", { full: true }),
        clase("Sábado", "11:00 AM", "Niños 4+ años", "Formación"),
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
}).listen(PUERTO, () => console.log(`Horarios de ejemplo en http://localhost:${PUERTO}`));
