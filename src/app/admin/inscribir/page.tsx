import Link from "next/link";
import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";
import { createEnrollment } from "./actions";

export default async function InscribirPage({
  searchParams,
}: {
  searchParams: Promise<{ studentId?: string; swimClassId?: string }>;
}) {
  const { studentId, swimClassId } = await searchParams;

  const [students, classes] = await Promise.all([
    db.orm.public.Student.orderBy((s) => s.fullName.asc()).all(),
    db.orm.public.SwimClass.where({ isActive: true })
      .include("branch")
      .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc()])
      .all(),
  ]);

  return (
    <div className="max-w-xl">
      <Link href="/admin/estudiantes" className="text-sm text-blue-700 hover:underline">
        ← Volver
      </Link>
      <h1 className="text-2xl font-bold text-blue-900 mt-2 mb-6">Inscribir estudiante en una clase</h1>

      <form action={createEnrollment} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Estudiante</label>
          <select
            name="studentId"
            required
            defaultValue={studentId ?? ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="" disabled>
              Selecciona un estudiante
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.fullName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Clase</label>
          <select
            name="swimClassId"
            required
            defaultValue={swimClassId ?? ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          >
            <option value="" disabled>
              Selecciona una clase
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.branch.name} · {c.day} {c.time} — {c.ageGroup}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de inicio</label>
          <input
            type="date"
            name="startDate"
            defaultValue={todayIsoDate()}
            required
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Inscribir
        </button>
      </form>
    </div>
  );
}
