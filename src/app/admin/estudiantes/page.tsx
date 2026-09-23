import Link from "next/link";
import { db } from "@/prisma/db";
import { or } from "@prisma/orm-postgres/orm-client";

export default async function EstudiantesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; branchId?: string; swimClassId?: string }>;
}) {
  const { q, branchId, swimClassId } = await searchParams;

  const [branches, classes] = await Promise.all([
    db.orm.public.Branch.orderBy((b) => b.name.asc()).all(),
    db.orm.public.SwimClass.include("branch")
      .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc()])
      .all(),
  ]);

  let studentIdFilter: number[] | undefined;
  if (swimClassId || branchId) {
    let enrollmentQuery = db.orm.public.Enrollment.where({ isActive: true });
    if (swimClassId) {
      enrollmentQuery = enrollmentQuery.where({ swimClassId: Number(swimClassId) });
    } else if (branchId) {
      const branchClassIds = classes
        .filter((c) => c.branchId === Number(branchId))
        .map((c) => c.id);
      enrollmentQuery = enrollmentQuery.where((e) =>
        e.swimClassId.in(branchClassIds.length ? branchClassIds : [-1])
      );
    }
    const matches = await enrollmentQuery.select("studentId").all();
    studentIdFilter = Array.from(new Set(matches.map((m) => m.studentId)));
  }

  let studentsQuery = db.orm.public.Student.orderBy((s) => s.fullName.asc()).include(
    "enrollments",
    (e) => e.where({ isActive: true }).count()
  );

  if (q && q.trim()) {
    const like = `%${q.trim()}%`;
    studentsQuery = studentsQuery.where((s) => or(s.fullName.ilike(like), s.phone.ilike(like)));
  }
  if (studentIdFilter) {
    studentsQuery = studentsQuery.where((s) => s.id.in(studentIdFilter!.length ? studentIdFilter! : [-1]));
  }

  const students = await studentsQuery.all();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Estudiantes</h1>
        <Link
          href="/admin/estudiantes/nuevo"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + Nuevo estudiante
        </Link>
      </div>

      <form className="mb-4 flex flex-wrap items-center gap-2" method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q ?? ""}
          placeholder="Buscar por nombre o teléfono..."
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm min-w-[14rem]"
        />

        <label htmlFor="branchId" className="text-sm text-slate-600">
          Sucursal:
        </label>
        <select
          id="branchId"
          name="branchId"
          defaultValue={branchId ?? ""}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">Todas</option>
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>

        <label htmlFor="swimClassId" className="text-sm text-slate-600">
          Clase:
        </label>
        <select
          id="swimClassId"
          name="swimClassId"
          defaultValue={swimClassId ?? ""}
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">Todas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.branch.name} · {c.day} {c.time}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-sm bg-slate-200 hover:bg-slate-300 transition-colors"
        >
          Filtrar
        </button>
        {(q || branchId || swimClassId) && (
          <Link href="/admin/estudiantes" className="text-sm text-blue-700 hover:underline">
            Limpiar
          </Link>
        )}
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Nombre</th>
              <th className="text-left px-4 py-3">Teléfono</th>
              <th className="text-left px-4 py-3">Padre/Madre</th>
              <th className="text-left px-4 py-3">Clases activas</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-medium text-blue-900">{s.fullName}</td>
                <td className="px-4 py-3">{s.phone ?? "—"}</td>
                <td className="px-4 py-3">{s.parentName ?? "—"}</td>
                <td className="px-4 py-3">{s.enrollments}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/estudiantes/${s.id}`} className="text-blue-700 hover:underline">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                  No hay estudiantes que coincidan con la búsqueda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
