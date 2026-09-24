import { connection } from "next/server";
import { db } from "@/prisma/db";
import SchedulesClient from "./SchedulesClient";

export default async function Schedules() {
  // Sin esto la home se prerenderiza en `next build`, que en Railway no
  // tiene acceso a Postgres (ni tablas, en el primer deploy).
  await connection();
  const branches = await db.orm.public.Branch.orderBy((b) => b.id.asc())
    .include("swimClasses", (c) =>
      c.where({ isActive: true }).orderBy([(sc) => sc.day.asc(), (sc) => sc.time.asc()])
    )
    .all();

  const branchSchedules = branches.map((branch) => ({
    id: branch.id,
    name: branch.name,
    address: branch.address,
    notes: branch.notes,
    schedules: branch.swimClasses.map((sc) => ({
      day: sc.day,
      ageGroup: sc.ageGroup,
      time: sc.time,
      category: sc.category,
      notes: sc.notes,
    })),
  }));

  return <SchedulesClient branches={branchSchedules} />;
}
