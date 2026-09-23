"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";

function optionalStr(formData: FormData, key: string) {
  const value = String(formData.get(key) ?? "").trim();
  return value.length > 0 ? value : undefined;
}

function revalidateEnrollmentPaths(studentId: number, swimClassId: number, extraClassId?: number) {
  revalidatePath("/admin");
  revalidatePath("/admin/horarios");
  revalidatePath(`/admin/horarios/${swimClassId}`);
  if (extraClassId) revalidatePath(`/admin/horarios/${extraClassId}`);
  revalidatePath("/admin/estudiantes");
  revalidatePath(`/admin/estudiantes/${studentId}`);
}

/** Enrolls an existing student in a class. No-ops if already actively enrolled there. */
export async function createEnrollment(formData: FormData) {
  const studentId = Number(formData.get("studentId"));
  const swimClassId = Number(formData.get("swimClassId"));
  const startDate = String(formData.get("startDate") || todayIsoDate());
  const redirectTo = optionalStr(formData, "redirectTo");

  if (studentId && swimClassId) {
    const existing = await db.orm.public.Enrollment.first({
      studentId,
      swimClassId,
      isActive: true,
    });
    if (!existing) {
      await db.orm.public.Enrollment.create({ studentId, swimClassId, startDate, isActive: true });
    }
    revalidateEnrollmentPaths(studentId, swimClassId);
  }

  redirect(redirectTo || `/admin/estudiantes/${studentId}`);
}

/** Removes a student from a class's roster without losing attendance history. */
export async function deactivateEnrollment(enrollmentId: number, formData: FormData) {
  const redirectTo = optionalStr(formData, "redirectTo");
  const enrollment = await db.orm.public.Enrollment.first({ id: enrollmentId });
  if (!enrollment) return;

  await db.orm.public.Enrollment.where({ id: enrollmentId }).update({ isActive: false });
  revalidateEnrollmentPaths(enrollment.studentId, enrollment.swimClassId);
  if (redirectTo) redirect(redirectTo);
}

/** Moves a student from their current class to another one in a single step. */
export async function moveEnrollment(enrollmentId: number, formData: FormData) {
  const targetSwimClassId = Number(formData.get("targetSwimClassId"));
  const redirectTo = optionalStr(formData, "redirectTo");
  if (!targetSwimClassId) return;

  const enrollment = await db.orm.public.Enrollment.first({ id: enrollmentId });
  if (!enrollment || enrollment.swimClassId === targetSwimClassId) return;

  await db.transaction(async (tx) => {
    await tx.orm.public.Enrollment.where({ id: enrollmentId }).update({ isActive: false });
    const existing = await tx.orm.public.Enrollment.first({
      studentId: enrollment.studentId,
      swimClassId: targetSwimClassId,
      isActive: true,
    });
    if (!existing) {
      await tx.orm.public.Enrollment.create({
        studentId: enrollment.studentId,
        swimClassId: targetSwimClassId,
        startDate: todayIsoDate(),
        isActive: true,
      });
    }
  });

  revalidateEnrollmentPaths(enrollment.studentId, enrollment.swimClassId, targetSwimClassId);
  if (redirectTo) redirect(redirectTo);
}
