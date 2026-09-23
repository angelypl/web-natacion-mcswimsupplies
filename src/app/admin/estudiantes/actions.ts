"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/prisma/db";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function optionalStr(formData: FormData, key: string) {
  const value = str(formData, key);
  return value.length > 0 ? value : null;
}

export async function createStudent(formData: FormData) {
  const student = await db.orm.public.Student.create({
    fullName: str(formData, "fullName"),
    phone: optionalStr(formData, "phone"),
    parentName: optionalStr(formData, "parentName"),
    notes: optionalStr(formData, "notes"),
  });

  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin");
  redirect(`/admin/estudiantes/${student.id}`);
}

export async function updateStudent(id: number, formData: FormData) {
  await db.orm.public.Student.where({ id }).update({
    fullName: str(formData, "fullName"),
    phone: optionalStr(formData, "phone"),
    parentName: optionalStr(formData, "parentName"),
    notes: optionalStr(formData, "notes"),
  });

  revalidatePath("/admin/estudiantes");
  revalidatePath(`/admin/estudiantes/${id}`);
  redirect(`/admin/estudiantes/${id}`);
}

export async function deleteStudent(id: number) {
  await db.orm.public.Student.where({ id }).delete();
  revalidatePath("/admin/estudiantes");
  revalidatePath("/admin");
  redirect("/admin/estudiantes");
}

export async function deactivateEnrollment(enrollmentId: number, studentId: number) {
  await db.orm.public.Enrollment.where({ id: enrollmentId }).update({ isActive: false });
  revalidatePath(`/admin/estudiantes/${studentId}`);
  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
}
