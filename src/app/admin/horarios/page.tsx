import Link from "next/link";
import { db } from "@/prisma/db";
import ConfirmSubmitButton from "@/components/admin/ConfirmSubmitButton";
import { deleteSwimClass, toggleSwimClassActive } from "./actions";

export default async function HorariosPage({
  searchParams,
}: {
  searchParams: Promise<{ branchId?: string }>;
}) {
  const { branchId } = await searchParams;
  const branches = await db.orm.public.Branch.orderBy((b) => b.name.asc()).all();

  let classesQuery = db.orm.public.SwimClass.include("branch");
  if (branchId) {
    classesQuery = classesQuery.where({ branchId: Number(branchId) });
  }
  const classes = await classesQuery
    .orderBy([(c) => c.branchId.asc(), (c) => c.day.asc(), (c) => c.time.asc()])
    .all();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-900">Horarios</h1>
        <Link
          href="/admin/horarios/nueva"
          className="inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          + Nueva clase
        </Link>
      </div>

      <form className="mb-4 flex items-center gap-2" method="GET">
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
        <button
          type="submit"
          className="px-3 py-1.5 rounded-lg text-sm bg-slate-200 hover:bg-slate-300 transition-colors"
        >
          Filtrar
        </button>
      </form>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Sucursal</th>
              <th className="text-left px-4 py-3">Día</th>
              <th className="text-left px-4 py-3">Hora</th>
              <th className="text-left px-4 py-3">Grupo</th>
              <th className="text-left px-4 py-3">Cupo</th>
              <th className="text-left px-4 py-3">Activa</th>
              <th className="text-right px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {classes.map((c) => (
              <tr key={c.id} className={c.isActive ? "" : "opacity-50"}>
                <td className="px-4 py-3 font-medium text-blue-900">{c.branch.name}</td>
                <td className="px-4 py-3">{c.day}</td>
                <td className="px-4 py-3">{c.time}</td>
                <td className="px-4 py-3">
                  <div>{c.ageGroup}</div>
                  <div className="text-xs text-slate-500">{c.category}</div>
                </td>
                <td className="px-4 py-3">{c.capacity}</td>
                <td className="px-4 py-3">
                  <form action={toggleSwimClassActive.bind(null, c.id, !c.isActive)}>
                    <button
                      type="submit"
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        c.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                      }`}
                    >
                      {c.isActive ? "Activa" : "Inactiva"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <Link
                    href={`/admin/inscribir?swimClassId=${c.id}`}
                    className="text-cyan-700 hover:underline mr-3"
                  >
                    Inscribir
                  </Link>
                  <Link
                    href={`/admin/horarios/${c.id}/editar`}
                    className="text-blue-700 hover:underline mr-3"
                  >
                    Editar
                  </Link>
                  <form action={deleteSwimClass.bind(null, c.id)} className="inline">
                    <ConfirmSubmitButton
                      confirmMessage="¿Eliminar esta clase? También se eliminarán sus inscripciones y asistencias."
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </ConfirmSubmitButton>
                  </form>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                  No hay clases registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
