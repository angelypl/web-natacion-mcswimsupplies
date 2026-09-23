import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteStudent, deactivateEnrollment } from "../actions";

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

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-blue-900">Inscripciones</h2>
        <Link
          href={`/admin/inscribir?studentId=${student.id}`}
          className="text-sm font-semibold text-blue-700 hover:underline"
        >
          + Inscribir en una clase
        </Link>
      </div>

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
            {enrollments.map((e) => (
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
                    <form action={deactivateEnrollment.bind(null, e.id, student.id)}>
                      <button type="submit" className="text-red-600 hover:underline">
                        Desactivar
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
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
