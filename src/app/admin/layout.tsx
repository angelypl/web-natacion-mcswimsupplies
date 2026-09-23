import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Panel Admin | MC Swim Academy",
  robots: { index: false, follow: false },
};

const NAV_LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/horarios", label: "Horarios" },
  { href: "/admin/estudiantes", label: "Estudiantes" },
  { href: "/admin/asistencia", label: "Asistencia" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="bg-blue-900 text-amber-100 text-xs sm:text-sm text-center py-2 px-4">
        Panel interno sin autenticación — cualquiera con este enlace puede ver y editar los
        datos. Uso temporal mientras se agrega el login.
      </div>

      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
          <Link href="/admin" className="font-black text-blue-900 tracking-tight">
            MC Swim Academy · Admin
          </Link>
          <nav className="flex flex-wrap gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-900 hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="sm:ml-auto text-xs text-slate-500 hover:text-blue-700 hover:underline"
          >
            Ver sitio público →
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
