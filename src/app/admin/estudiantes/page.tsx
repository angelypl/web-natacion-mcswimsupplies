import Link from "next/link";
import { db } from "@/prisma/db";

export default async function EstudiantesPage() {
  const students = await db.orm.public.Student
    .orderBy((s) => s.fullName.asc())
    .include("enrollments", (e) => e.where({ isActive: true }).count())
    .all();

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
                  No hay estudiantes registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
