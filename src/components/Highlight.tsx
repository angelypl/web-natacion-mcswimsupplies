"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Waves, ArrowRight, MessageCircle } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Highlight() {
  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="relative grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-6 items-center"
        >
          {/* Asymmetric image block */}
          <motion.div
            variants={item}
            className="lg:col-span-7 relative z-0"
          >
            <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/20">
              <Image
                src="/Archivo_000.png"
                alt="Alumnos entrenando en MC Swim Academy"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/10 to-transparent" />
            </div>

            {/* Floating stat badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="hidden sm:flex absolute -top-6 -left-6 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl px-5 py-4 shadow-xl shadow-blue-900/10 items-center gap-3"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <Waves className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-blue-900">Metodología acuática</div>
                <div className="text-[11px] text-slate-500">Progresiva y personalizada</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Overlapping content card */}
          <motion.div
            variants={item}
            className="lg:col-span-6 lg:-ml-16 xl:-ml-24 relative z-10 mt-6 lg:mt-0"
          >
            <div className="bg-blue-950 text-white rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl shadow-blue-950/30 relative overflow-hidden">
              <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-5">
                  <Waves className="w-3.5 h-3.5" />
                  Vive la experiencia
                </span>

                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-5 leading-[1.15]">
                  Cada clase te acerca un poco más al agua
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal">
                  En MC Swim Academy transformamos el miedo en confianza y la
                  técnica en disfrute. Agenda tu evaluación inicial sin costo
                  y descubre el programa ideal para ti o tu hijo/a.
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20agendar%20mi%20evaluaci%C3%B3n%20inicial%20gratuita."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20 hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Agendar evaluación gratis</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>

                  <a
                    href="#clases"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    <span>Ver todos los programas</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
