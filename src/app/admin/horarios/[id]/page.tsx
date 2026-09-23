import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import StudentPicker from "@/components/admin/StudentPicker";
import { createEnrollment, deactivateEnrollment, moveEnrollment } from "@/lib/actions/enrollments";
import { deleteSwimClass } from "../actions";

export default async function ClaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const swimClassId = Number(id);

  const swimClass = await db.orm.public.SwimClass.include("branch").first({ id: swimClassId });
  if (!swimClass) notFound();

  const allEnrollments = await db.orm.public.Enrollment.where({ swimClassId })
    .include("student")
    .all();
  const roster = allEnrollments.sort((a, b) => Number(b.isActive) - Number(a.isActive));
  const activeCount = roster.filter((e) => e.isActive).length;
  const isFull = activeCount >= swimClass.capacity;

  const [otherActiveClasses, allStudents] = await Promise.all([
    db.orm.public.SwimClass.where({ isActive: true })
      .include("branch")
      .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc()])
      .all(),
    db.orm.public.Student.orderBy((s) => s.fullName.asc()).all(),
  ]);
  const moveTargets = otherActiveClasses.filter((c) => c.id !== swimClassId);

  const activeStudentIds = new Set(roster.filter((e) => e.isActive).map((e) => e.studentId));
  const pickableStudents = allStudents
    .filter((s) => !activeStudentIds.has(s.id))
    .map((s) => ({ id: s.id, fullName: s.fullName, phone: s.phone }));

  const redirectTo = `/admin/horarios/${swimClassId}`;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/horarios" className="text-sm text-blue-700 hover:underline">
        ← Volver a horarios
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">
            {swimClass.branch.name} · {swimClass.day} {swimClass.time}
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            {swimClass.ageGroup} — {swimClass.category}
          </p>
          {swimClass.notes && <p className="text-sm text-slate-500 mt-1">{swimClass.notes}</p>}
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                swimClass.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-slate-200 text-slate-600"
              }`}
            >
              {swimClass.isActive ? "Activa" : "Inactiva"}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                isFull ? "bg-red-100 text-red-700" : "bg-blue-50 text-blue-700"
              }`}
            >
              Cupo: {activeCount} / {swimClass.capacity} {isFull ? "(lleno)" : ""}
            </span>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/admin/horarios/${swimClass.id}/editar`}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Editar
          </Link>
          <form action={deleteSwimClass.bind(null, swimClass.id)}>
            <ConfirmSubmitButton
              confirmMessage="¿Eliminar esta clase? También se eliminarán sus inscripciones y asistencias."
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Eliminar
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <h2 className="text-lg font-bold text-blue-900 mb-3">Agregar estudiante al roster</h2>
      <form
        action={createEnrollment}
        className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-end gap-4 mb-8"
      >
        <input type="hidden" name="swimClassId" value={swimClassId} />
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <div className="flex-1 min-w-[14rem]">
          <label className="block text-sm font-medium text-slate-700 mb-1">Estudiante</label>
          <StudentPicker students={pickableStudents} name="studentId" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Desde</label>
          <input
            type="date"
            name="startDate"
            defaultValue={todayIsoDate()}
            className="border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          Agregar
        </button>
      </form>

      <h2 className="text-lg font-bold text-blue-900 mb-3">Roster</h2>
      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Estudiante</th>
              <th className="text-left px-4 py-3">Desde</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {roster.map((e) => (
              <tr key={e.id} className={e.isActive ? "" : "opacity-50"}>
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800">{e.student.fullName}</div>
                  {e.student.phone && (
                    <div className="text-xs text-slate-500">{e.student.phone}</div>
                  )}
                </td>
                <td className="px-4 py-3">{e.startDate}</td>
                <td className="px-4 py-3">
                  {e.isActive ? (
                    <span className="text-green-700 font-medium">Activa</span>
                  ) : (
                    <span className="text-slate-400">Inactiva</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  {e.isActive && (
                    <div className="flex items-center justify-end gap-3">
                      {moveTargets.length > 0 && (
                        <form
                          action={moveEnrollment.bind(null, e.id)}
                          className="flex items-center gap-1.5"
                        >
                          <input type="hidden" name="redirectTo" value={redirectTo} />
                          <select
                            name="targetSwimClassId"
                            className="border border-slate-300 rounded-lg px-2 py-1 text-xs"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Mover a...
                            </option>
                            {moveTargets.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.branch.name} · {c.day} {c.time}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            className="text-blue-700 hover:underline text-xs font-semibold"
                          >
                            Mover
                          </button>
                        </form>
                      )}
                      <form action={deactivateEnrollment.bind(null, e.id)}>
                        <input type="hidden" name="redirectTo" value={redirectTo} />
                        <button type="submit" className="text-red-600 hover:underline">
                          Quitar
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {roster.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                  Sin estudiantes en este horario todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
