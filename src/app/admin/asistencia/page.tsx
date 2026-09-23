import { db } from "@/prisma/db";
import { todayIsoDate } from "@/lib/weekday";
import { saveAttendance } from "./actions";

export default async function AsistenciaPage({
  searchParams,
}: {
  searchParams: Promise<{ swimClassId?: string; date?: string }>;
}) {
  const params = await searchParams;
  const date = params.date || todayIsoDate();
  const swimClassId = params.swimClassId ? Number(params.swimClassId) : undefined;

  const classes = await db.orm.public.SwimClass.include("branch")
    .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc()])
    .all();

  let roster: Array<{
    enrollmentId: number;
    studentName: string;
    present: boolean;
  }> = [];

  if (swimClassId) {
    const enrollments = await db.orm.public.Enrollment.where({
      swimClassId,
      isActive: true,
    })
      .include("student")
      .all();

    const existingRecords = await db.orm.public.AttendanceRecord.where({ date })
      .where((a) => a.enrollmentId.in(enrollments.map((e) => e.id)))
      .all();
    const presentByEnrollment = new Map(existingRecords.map((r) => [r.enrollmentId, r.present]));

    roster = enrollments
      .map((e) => ({
        enrollmentId: e.id,
        studentName: e.student.fullName,
        present: presentByEnrollment.get(e.id) ?? false,
      }))
      .sort((a, b) => a.studentName.localeCompare(b.studentName));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Asistencia</h1>

      <form method="GET" className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Clase</label>
          <select
            name="swimClassId"
            defaultValue={swimClassId ?? ""}
            required
            className="border border-slate-300 rounded-lg px-3 py-2 min-w-[16rem]"
          >
            <option value="" disabled>
              Selecciona una clase
            </option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.branch.name} · {c.day} {c.time} — {c.ageGroup}
                {!c.isActive ? " (inactiva)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
          <input
            type="date"
            name="date"
            defaultValue={date}
            className="border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-slate-800 text-white text-sm font-semibold hover:bg-slate-900 transition-colors"
        >
          Ver clase
        </button>
      </form>

      {swimClassId && (
        <form action={saveAttendance} className="bg-white rounded-2xl border border-slate-200 p-5">
          <input type="hidden" name="date" value={date} />
          <input type="hidden" name="swimClassId" value={swimClassId} />

          {roster.length === 0 ? (
            <p className="text-slate-400 text-sm py-6 text-center">
              No hay estudiantes inscritos (activos) en esta clase.
            </p>
          ) : (
            <>
              <ul className="divide-y divide-slate-100 mb-4">
                {roster.map((r) => (
                  <li key={r.enrollmentId} className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-slate-800">{r.studentName}</span>
                    <label className="flex items-center gap-2 text-sm text-slate-600">
                      <input type="hidden" name="enrollmentId" value={r.enrollmentId} />
                      <input
                        type="checkbox"
                        name={`present_${r.enrollmentId}`}
                        defaultChecked={r.present}
                        className="rounded w-4 h-4"
                      />
                      Presente
                    </label>
                  </li>
                ))}
              </ul>
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
              >
                Guardar asistencia
              </button>
            </>
          )}
        </form>
      )}
    </div>
  );
}
