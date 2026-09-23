import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/prisma/db";
import { updateStudent } from "../../actions";

export default async function EditarEstudiantePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = await db.orm.public.Student.first({ id: Number(id) });
  if (!student) notFound();

  const updateAction = updateStudent.bind(null, student.id);

  return (
    <div className="max-w-xl">
      <Link href={`/admin/estudiantes/${student.id}`} className="text-sm text-blue-700 hover:underline">
        ← Volver al detalle
      </Link>
      <h1 className="text-2xl font-bold text-blue-900 mt-2 mb-6">Editar estudiante</h1>

      <form action={updateAction} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
          <input
            type="text"
            name="fullName"
            required
            defaultValue={student.fullName}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono (opcional)</label>
          <input
            type="text"
            name="phone"
            defaultValue={student.phone ?? ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Nombre del padre/madre (opcional, para niños)
          </label>
          <input
            type="text"
            name="parentName"
            defaultValue={student.parentName ?? ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notas (opcional)</label>
          <textarea
            name="notes"
            rows={2}
            defaultValue={student.notes ?? ""}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
