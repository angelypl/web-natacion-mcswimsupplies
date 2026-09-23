import Link from "next/link";
import { db } from "@/prisma/db";
import { createSwimClass } from "../actions";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

export default async function NuevaClasePage() {
  const branches = await db.orm.public.Branch.orderBy((b) => b.name.asc()).all();

  return (
    <div className="max-w-xl">
      <Link href="/admin/horarios" className="text-sm text-blue-700 hover:underline">
        ← Volver a horarios
      </Link>
      <h1 className="text-2xl font-bold text-blue-900 mt-2 mb-6">Nueva clase</h1>

      <form action={createSwimClass} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sucursal</label>
          <select name="branchId" required className="w-full border border-slate-300 rounded-lg px-3 py-2">
            {branches.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Día</label>
            <select name="day" required className="w-full border border-slate-300 rounded-lg px-3 py-2">
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
            <input
              type="text"
              name="time"
              required
              placeholder="5:00 PM"
              className="w-full border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Grupo de edad</label>
          <input
            type="text"
            name="ageGroup"
            required
            placeholder="Niños de 4 años en adelante y adultos"
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
          <input
            type="text"
            name="category"
            required
            placeholder="Infantil / Adultos"
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notas (opcional)</label>
          <textarea name="notes" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Cupo</label>
          <input
            type="number"
            name="capacity"
            defaultValue={20}
            min={1}
            className="w-full border border-slate-300 rounded-lg px-3 py-2"
          />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="isActive" defaultChecked className="rounded" />
          Visible en la web pública
        </label>

        <button
          type="submit"
          className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors"
        >
          Crear clase
        </button>
      </form>
    </div>
  );
}
