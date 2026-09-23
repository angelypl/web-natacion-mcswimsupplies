"use client";

import { useMemo, useState } from "react";

export type PickableStudent = { id: number; fullName: string; phone: string | null };

export default function StudentPicker({
  students,
  name,
  defaultStudentId,
  placeholder = "Buscar estudiante por nombre o teléfono...",
}: {
  students: PickableStudent[];
  name: string;
  defaultStudentId?: number;
  placeholder?: string;
}) {
  const defaultStudent = students.find((s) => s.id === defaultStudentId);
  const [query, setQuery] = useState(defaultStudent?.fullName ?? "");
  const [selectedId, setSelectedId] = useState<number | undefined>(defaultStudentId);
  const [open, setOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return students
      .filter(
        (s) => s.fullName.toLowerCase().includes(q) || (s.phone ?? "").toLowerCase().includes(q)
      )
      .slice(0, 8);
  }, [query, students]);

  return (
    <div className="relative">
      <input type="hidden" name={name} value={selectedId ?? ""} />
      <input
        type="text"
        required
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setSelectedId(undefined);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full border border-slate-300 rounded-lg px-3 py-2"
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-56 overflow-auto">
          {results.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setSelectedId(s.id);
                  setQuery(s.fullName);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm hover:bg-blue-50"
              >
                <div className="font-medium text-slate-800">{s.fullName}</div>
                {s.phone && <div className="text-xs text-slate-500">{s.phone}</div>}
              </button>
            </li>
          ))}
        </ul>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-sm text-slate-400">
          Sin resultados
        </div>
      )}
    </div>
  );
}
