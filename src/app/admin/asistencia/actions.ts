"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";

export async function saveAttendance(formData: FormData) {
  const date = String(formData.get("date") ?? "");
  const enrollmentIds = formData.getAll("enrollmentId").map((v) => Number(v));

  for (const enrollmentId of enrollmentIds) {
    const present = formData.get(`present_${enrollmentId}`) === "on";
    await db.orm.public.AttendanceRecord.upsert({
      create: { enrollmentId, date, present },
      update: { present },
      conflictOn: { enrollmentId, date },
    });
  }

  revalidatePath("/admin/asistencia");
  revalidatePath("/admin");
}
