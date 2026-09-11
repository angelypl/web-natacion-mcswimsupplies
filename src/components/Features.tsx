"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Users, MapPin, Award, Waves } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Seguridad primero",
    description:
      "Protocolos claros de seguridad y supervisión en cada sesión para que aprendas con total confianza y serenidad en el agua.",
    badge: "Prioridad #1",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: Users,
    title: "Grupos por nivel",
    description:
      "Atención individualizada clasificada por edad, destreza previa y ritmo particular de aprendizaje desde los 2 años hasta adultos.",
    badge: "Personalizado",
    color: "from-cyan-500 to-teal-400",
  },
  {
    icon: MapPin,
    title: "Dos sucursales",
    description:
      "Ubicaciones accesibles en Santo Domingo: Sucursal Utesa (Isabela Aguiar) y Sucursal VivirMás (Sector El Millón).",
    badge: "Fácil Acceso",
    color: "from-blue-700 to-blue-500",
  },
  {
    icon: Award,
    title: "Instructores certificados",
    description:
      "Coaches con amplia trayectoria formativa y pasión pedagógica, enfocados en técnica correcta, flotación y autoprotección.",
    badge: "Profesionales",
    color: "from-indigo-600 to-blue-500",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-24 bg-slate-50 relative overflow-hidden border-y border-slate-100">
      {/* Subtle background ripples */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/60 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4"
          >
            <Waves className="w-3.5 h-3.5 text-cyan-600" />
            <span>Por qué elegirnos</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight"
          >
            La mejor experiencia de natación en Santo Domingo
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-slate-600 font-normal"
          >
            Diseñamos cada detalle pedagógico para que niños y adultos ganen destreza, seguridad y resistencia en un entorno estimulante.
          </motion.p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100/60 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:text-blue-700 transition-all duration-300">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold tracking-wide uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-blue-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-cyan-600 group-hover:translate-x-1 transition-transform">
                  <span>Conocer más</span>
                  <span className="ml-1">→</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
