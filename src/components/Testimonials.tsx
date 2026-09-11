"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Heart } from "lucide-react";

const testimonials = [
  {
    name: "Carolina Rosario",
    role: "Madre de Lucas (3 años)",
    sucursal: "Sucursal VivirMás",
    comment:
      "Mi hijo le tenía pavor al agua. En apenas 3 clases con los instructores de MC Swim Academy cambió por completo su actitud. La piscina poco profunda de VivirMás le dio toda la confianza que necesitaba.",
    stars: 5,
  },
  {
    name: "Ing. Manuel Santana",
    role: "Adulto (Entrenamiento)",
    sucursal: "Sucursal Utesa",
    comment:
      "Buscaba una piscina con carriles amplios y un entrenador que corrigiera mi estilo crol y respiración. El horario de los domingos por la mañana en Utesa es perfecto para mi rutina semanal.",
    stars: 5,
  },
  {
    name: "Patricia De León",
    role: "Madre de Sofía y Mateo (5 y 7 años)",
    sucursal: "Sucursal Utesa",
    comment:
      "La paciencia y el cuidado que tienen con los niños es admirable. En pocos meses ambos perdieron el miedo al agua y ya nadan con total seguridad. Totalmente recomendados.",
    stars: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>Testimonios Reales</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
            Lo que dicen nuestras familias y nadadores
          </h2>

          <p className="mt-3 text-base text-slate-600">
            La confianza de cientos de alumnos que aprenden y disfrutan cada semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-lg shadow-blue-900/5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(item.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-blue-100 mb-3" />

                <p className="text-sm text-slate-600 leading-relaxed italic mb-6">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-blue-900 text-base">
                  {item.name}
                </div>
                <div className="text-xs text-slate-500">{item.role}</div>
                <div className="text-[11px] font-medium text-cyan-600 mt-0.5">
                  {item.sucursal}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
