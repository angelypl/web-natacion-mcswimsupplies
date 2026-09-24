import Link from "next/link";
import { connection } from "next/server";
import { db } from "@/prisma/db";
import { dayMatchesWeekday, todayIsoDate, todayWeekdayName } from "@/lib/weekday";

export default async function AdminDashboardPage() {
  // Los conteos y "hoy" deben calcularse por request, no en el build.
  await connection();
  const [activeClasses, activeEnrollments] = await Promise.all([
    db.orm.public.SwimClass.where({ isActive: true }).all(),
    db.orm.public.Enrollment.where({ isActive: true }).select("studentId").all(),
  ]);

  const activeStudentsCount = new Set(activeEnrollments.map((e) => e.studentId)).size;
  const today = todayWeekdayName();
  const todayIso = todayIsoDate();
  const todaysClasses = activeClasses.filter((c) => dayMatchesWeekday(c.day, today));

  let attendanceTaken = 0;
  for (const swimClass of todaysClasses) {
    const enrollments = await db.orm.public.Enrollment.where({
      swimClassId: swimClass.id,
      isActive: true,
    })
      .select("id")
      .all();
    if (enrollments.length === 0) continue;
    const records = await db.orm.public.AttendanceRecord.where({ date: todayIso })
      .where((a) => a.enrollmentId.in(enrollments.map((e) => e.id)))
      .all();
    if (records.length > 0) attendanceTaken += 1;
  }
  const attendancePending = todaysClasses.length - attendanceTaken;

  const cards = [
    { label: "Estudiantes activos", value: activeStudentsCount, href: "/admin/estudiantes" },
    { label: "Clases activas", value: activeClasses.length, href: "/admin/horarios" },
    {
      label: `Asistencia de hoy (${today})`,
      value: todaysClasses.length === 0 ? "Sin clases hoy" : `${attendanceTaken} tomada(s) / ${attendancePending} pendiente(s)`,
      href: "/admin/asistencia",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-blue-900 mb-6">Resumen</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              {card.label}
            </div>
            <div className="text-2xl font-black text-blue-900">{card.value}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/horarios"
          className="bg-blue-900 text-white rounded-2xl p-5 font-semibold hover:bg-blue-800 transition-colors"
        >
          Gestionar horarios →
        </Link>
        <Link
          href="/admin/estudiantes"
          className="bg-slate-900 text-white rounded-2xl p-5 font-semibold hover:bg-slate-800 transition-colors"
        >
          Gestionar estudiantes →
        </Link>
        <Link
          href="/admin/asistencia"
          className="bg-cyan-700 text-white rounded-2xl p-5 font-semibold hover:bg-cyan-800 transition-colors"
        >
          Pasar asistencia →
        </Link>
      </div>
    </div>
  );
}
