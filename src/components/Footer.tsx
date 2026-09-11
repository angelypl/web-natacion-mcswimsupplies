"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  MapPin,
  ArrowUp,
} from "lucide-react";
import Logo from "./Logo";

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-12 border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Brand info */}
          <div className="lg:col-span-4 space-y-4">
            <Logo variant="dark" />

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Academia de natación para niños desde los 2 años y adultos, con instructores certificados y dos sucursales en Santo Domingo, R.D.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://www.instagram.com/mcswim_supplies?igsh=MTBud2UxeWM5YXp0NQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-gradient-to-tr hover:from-yellow-500 hover:via-pink-500 hover:to-purple-500 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5" />
              </a>

              <a
                href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-green-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <a
                href="tel:+18298830129"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-blue-600 flex items-center justify-center text-slate-300 hover:text-white transition-all"
                aria-label="Teléfono"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4">
              Navegación
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link href="#top" className="hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="#clases" className="hover:text-white transition-colors">
                  Clases & Programas
                </Link>
              </li>
              <li>
                <Link href="#horarios" className="hover:text-white transition-colors">
                  Horarios y Turnos
                </Link>
              </li>
              <li>
                <Link href="#precios" className="hover:text-white transition-colors">
                  Precios & Mensualidad
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="hover:text-white transition-colors">
                  Sucursales & Contacto
                </Link>
              </li>
              <li>
                <Link href="#inscripcion" className="hover:text-white transition-colors">
                  Inscripción
                </Link>
              </li>
            </ul>
          </div>

          {/* Sedes */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4">
              Sucursales
            </h4>
            <div className="space-y-4 text-xs text-slate-400">
              <div className="border-l-2 border-blue-500 pl-3">
                <div className="font-bold text-white text-sm">
                  Sucursal Utesa
                </div>
                <p className="mt-0.5">Av. Isabel Aguiar, Sto. Dgo. Oeste</p>
                <p className="text-cyan-400 text-[11px] mt-1">Lunes, viernes y domingos</p>
              </div>

              <div className="border-l-2 border-cyan-400 pl-3">
                <div className="font-bold text-white text-sm">
                  Sucursal VivirMás
                </div>
                <p className="mt-0.5">Sector El Millón, Santo Domingo</p>
                <p className="text-cyan-400 text-[11px] mt-1">Viernes y sábados</p>
              </div>
            </div>
          </div>

          {/* Contact Direct */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-cyan-400 mb-4">
              Contacto Rápido
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <a
                href="tel:+18298830129"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>(829) 883-0129</span>
              </a>

              <a
                href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors text-green-400"
              >
                <MessageCircle className="w-4 h-4 flex-shrink-0" />
                <span>WhatsApp: (829) 883-0129</span>
              </a>

              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>Santo Domingo, República Dominicana</span>
              </div>
            </div>

            <div className="mt-6">
              <a
                href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-600/30"
              >
                Escríbenos por WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1 text-center sm:text-left">
            <span>© {new Date().getFullYear()} MC Swim Academy. Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
            >
              <span>Subir al inicio</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
