"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";

export async function createEnrollment(formData: FormData) {
  const studentId = Number(formData.get("studentId"));
  const swimClassId = Number(formData.get("swimClassId"));
  const startDate = String(formData.get("startDate") || todayIsoDate());

  await db.orm.public.Enrollment.create({
    studentId,
    swimClassId,
    startDate,
    isActive: true,
  });

  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
  revalidatePath(`/admin/estudiantes/${studentId}`);
  redirect(`/admin/estudiantes/${studentId}`);
}
