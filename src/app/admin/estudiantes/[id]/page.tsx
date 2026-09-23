import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteStudent } from "../actions";
import { createEnrollment, deactivateEnrollment, moveEnrollment } from "@/lib/actions/enrollments";

export default async function EstudianteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const studentId = Number(id);
  const student = await db.orm.public.Student.first({ id: studentId });
  if (!student) notFound();

  const allEnrollments = await db.orm.public.Enrollment.where({ studentId })
    .include("swimClass", (c) => c.include("branch"))
    .all();
  const enrollments = allEnrollments.sort((a, b) => Number(b.isActive) - Number(a.isActive));

  const activeClassIds = new Set(
    enrollments.filter((e) => e.isActive).map((e) => e.swimClassId)
  );

  const activeClasses = await db.orm.public.SwimClass.where({ isActive: true })
    .include("branch")
    .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc()])
    .all();
  const enrollableClasses = activeClasses.filter((c) => !activeClassIds.has(c.id));

  const redirectTo = `/admin/estudiantes/${studentId}`;

  return (
    <div className="max-w-3xl">
      <Link href="/admin/estudiantes" className="text-sm text-blue-700 hover:underline">
        ← Volver a estudiantes
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mt-2 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">{student.fullName}</h1>
          <p className="text-sm text-slate-600 mt-1">
            {student.phone && <span>{student.phone}</span>}
            {student.phone && student.parentName && <span> · </span>}
            {student.parentName && <span>Padre/madre: {student.parentName}</span>}
          </p>
          {student.notes && <p className="text-sm text-slate-500 mt-1">{student.notes}</p>}
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/admin/estudiantes/${student.id}/editar`}
            className="px-3 py-2 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Editar
          </Link>
          <form action={deleteStudent.bind(null, student.id)}>
            <ConfirmSubmitButton
              confirmMessage="¿Eliminar este estudiante? También se eliminarán sus inscripciones y asistencias."
              className="px-3 py-2 rounded-lg text-sm font-semibold bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
            >
              Eliminar
            </ConfirmSubmitButton>
          </form>
        </div>
      </div>

      <h2 className="text-lg font-bold text-blue-900 mb-3">Inscribir en otra clase</h2>
      {enrollableClasses.length === 0 ? (
        <p className="text-sm text-slate-500 mb-8">
          Ya está inscrito (activo) en todas las clases activas disponibles.
        </p>
      ) : (
        <form
          action={createEnrollment}
          className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-end gap-4 mb-8"
        >
          <input type="hidden" name="studentId" value={studentId} />
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="flex-1 min-w-[14rem]">
            <label className="block text-sm font-medium text-slate-700 mb-1">Clase</label>
            <select
              name="swimClassId"
              required
              defaultValue=""
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            >
              <option value="" disabled>
                Selecciona una clase
              </option>
              {enrollableClasses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.branch.name} · {c.day} {c.time} — {c.ageGroup}
                </option>
              ))}
            </select>
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
            Inscribir
          </button>
        </form>
      )}

      <h2 className="text-lg font-bold text-blue-900 mb-3">Inscripciones</h2>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Sucursal</th>
              <th className="text-left px-4 py-3">Clase</th>
              <th className="text-left px-4 py-3">Desde</th>
              <th className="text-left px-4 py-3">Estado</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {enrollments.map((e) => {
              const moveTargets = activeClasses.filter((c) => c.id !== e.swimClassId);
              return (
                <tr key={e.id} className={e.isActive ? "" : "opacity-50"}>
                  <td className="px-4 py-3">{e.swimClass!.branch.name}</td>
                  <td className="px-4 py-3">
                    {e.swimClass!.day} {e.swimClass!.time} — {e.swimClass!.ageGroup}
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
              );
            })}
            {enrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  Sin inscripciones todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
