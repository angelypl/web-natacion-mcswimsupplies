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

export async function createSwimClass(formData: FormData) {
  await db.orm.public.SwimClass.create({
    branchId: Number(formData.get("branchId")),
    day: str(formData, "day"),
    time: str(formData, "time"),
    ageGroup: str(formData, "ageGroup"),
    category: str(formData, "category"),
    notes: optionalStr(formData, "notes"),
    capacity: Number(formData.get("capacity")) || 20,
    isActive: formData.get("isActive") === "on",
  });

  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/horarios");
}

export async function updateSwimClass(id: number, formData: FormData) {
  await db.orm.public.SwimClass.where({ id }).update({
    branchId: Number(formData.get("branchId")),
    day: str(formData, "day"),
    time: str(formData, "time"),
    ageGroup: str(formData, "ageGroup"),
    category: str(formData, "category"),
    notes: optionalStr(formData, "notes"),
    capacity: Number(formData.get("capacity")) || 20,
    isActive: formData.get("isActive") === "on",
  });

  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
  revalidatePath("/");
  redirect("/admin/horarios");
}

export async function toggleSwimClassActive(id: number, nextValue: boolean) {
  await db.orm.public.SwimClass.where({ id }).update({ isActive: nextValue });
  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function deleteSwimClass(id: number) {
  await db.orm.public.SwimClass.where({ id }).delete();
  revalidatePath("/admin/horarios");
  revalidatePath("/admin");
  revalidatePath("/");
}
