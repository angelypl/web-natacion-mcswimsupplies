"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Phone,
  CheckCircle2,
  User,
  ShieldCheck,
} from "lucide-react";

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

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    categoria: "nino-4-mas",
    sucursal: "utesa",
    horario: "",
    experiencia: "principiante",
    comentarios: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const categoriaText =
      formData.categoria === "nino-2-3"
        ? "Niño/a de 2 a 3 años"
        : formData.categoria === "nino-4-mas"
        ? "Niño/a de 4 años en adelante"
        : "Adulto";

    const sucursalText =
      formData.sucursal === "utesa"
        ? "Sucursal Utesa (Isabela Aguiar)"
        : "Sucursal VivirMás (Sector El Millón)";

    const experienciaText =
      formData.experiencia === "principiante"
        ? "Principiante (desde cero)"
        : formData.experiencia === "intermedio"
        ? "Intermedio (flota y se desplaza)"
        : "Avanzado (conoce estilos)";

    const message = `*SOLICITUD DE INSCRIPCIÓN - MC Swim Academy*
---------------------------------------
*Nombre:* ${formData.nombre}
*Teléfono:* ${formData.telefono}
*Categoría:* ${categoriaText}
*Sucursal elegida:* ${sucursalText}
*Horario preferido:* ${formData.horario || "A consultar disponibilidad"}
*Nivel de experiencia:* ${experienciaText}
${formData.comentarios ? `*Comentarios:* ${formData.comentarios}` : ""}
---------------------------------------
Hola, deseo coordinar mi evaluación inicial y confirmar mi cupo.`;

    const whatsappUrl = `https://wa.me/18298830129?text=${encodeURIComponent(
      message
    )}`;

    setSubmitted(true);
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="inscripcion"
      className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
            <span>Paso a paso fácil</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight">
            Completa tu registro y asegura tu cupo
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Llena tus datos para coordinar tu evaluación diagnóstica, horario y grupo adecuado.
          </p>
        </div>

        {/* 3 Steps Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center flex-shrink-0 text-base">
              1
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-base mb-1">
                Envía tus datos
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Completa el formulario en menos de 1 minuto con la información del alumno.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 text-slate-950 font-extrabold flex items-center justify-center flex-shrink-0 text-base">
              2
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-base mb-1">
                Confirmamos por WhatsApp
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verificamos disponibilidad de cupo en la sucursal y horario de tu conveniencia.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-900 text-white font-extrabold flex items-center justify-center flex-shrink-0 text-base">
              3
            </div>
            <div>
              <h4 className="font-bold text-blue-900 text-base mb-1">
                Evaluación e inicio
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pagas la inscripción, asistes a la evaluación inicial y comienzas tus clases.
              </p>
            </div>
          </div>
        </div>

        {/* Form and Contact Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Form Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-blue-900/5">
            <h3 className="text-2xl font-bold text-blue-900 mb-6">
              Formulario de Inscripción
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Nombre completo del alumno *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Carlos Martínez"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Teléfono / WhatsApp *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="Ej. (829) 123-4567"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Programa / Edad
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={(e) =>
                      setFormData({ ...formData, categoria: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 bg-white transition-all"
                  >
                    <option value="nino-2-3">Niños 2 a 3 años</option>
                    <option value="nino-4-mas">Niños 4+ años</option>
                    <option value="adultos">Adultos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Sucursal de Preferencia
                  </label>
                  <select
                    value={formData.sucursal}
                    onChange={(e) =>
                      setFormData({ ...formData, sucursal: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 bg-white transition-all"
                  >
                    <option value="utesa">Sucursal Utesa (Isabela Aguiar)</option>
                    <option value="vivirmas">Sucursal VivirMás (El Millón)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Horario de Interés
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sábados 3:00 PM o Lunes 5:00 PM"
                    value={formData.horario}
                    onChange={(e) =>
                      setFormData({ ...formData, horario: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Nivel Actual de Natación
                  </label>
                  <select
                    value={formData.experiencia}
                    onChange={(e) =>
                      setFormData({ ...formData, experiencia: e.target.value })
                    }
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 bg-white transition-all"
                  >
                    <option value="principiante">Principiante (Desde cero)</option>
                    <option value="intermedio">Intermedio (Sabe flotar y desplazarse)</option>
                    <option value="avanzado">Avanzado (Domina técnica y estilos)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  ¿Alguna nota médica o consulta especial?
                </label>
                <textarea
                  rows={3}
                  placeholder="Escribe aquí cualquier consulta o detalle..."
                  value={formData.comentarios}
                  onChange={(e) =>
                    setFormData({ ...formData, comentarios: e.target.value })
                  }
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 text-sm text-slate-800 transition-all"
                />
              </div>

              {submitted && (
                <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <span>¡Datos preparados! Hemos abierto WhatsApp para confirmar tu evaluación y cupo.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <MessageCircle className="w-5 h-5 text-cyan-300" />
                <span>Enviar y Continuar por WhatsApp</span>
              </button>

              <p className="text-[11px] text-center text-slate-400">
                Al presionar, se abrirá WhatsApp con tus datos pre-llenados para completar tu solicitud con nuestro equipo.
              </p>
            </form>
          </div>

          {/* Contact Direct Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-2xl" />

              <h4 className="text-xl font-bold mb-4">
                Atención directa personalizada
              </h4>
              <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                ¿Prefieres conversar o necesitas una respuesta inmediata? Nuestro equipo de atención está disponible de lunes a sábado.
              </p>

              <div className="space-y-4">
                <a
                  href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">WhatsApp Oficial</div>
                    <div className="text-sm font-bold text-white">
                      (829) 883-0129
                    </div>
                  </div>
                </a>

                <a
                  href="tel:+18298830129"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Llamada Telefónica</div>
                    <div className="text-sm font-bold text-white">
                      (829) 883-0129
                    </div>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/mcswim_supplies?igsh=MTBud2UxeWM5YXp0NQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-500 text-white flex items-center justify-center flex-shrink-0">
                    <InstagramIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-300">Instagram</div>
                    <div className="text-sm font-bold text-white">
                      @mcswim_supplies
                    </div>
                  </div>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <h5 className="font-bold text-blue-900 text-sm mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-600" />
                <span>¿Por qué inscribirse hoy?</span>
              </h5>
              <ul className="text-xs text-slate-600 space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Plazas limitadas por carril para garantizar seguridad.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Evaluación inicial personalizada sin costo extra.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                  Seguimiento cercano de tu progreso desde la primera semana.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
