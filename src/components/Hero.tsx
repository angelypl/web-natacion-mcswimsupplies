"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ShieldCheck,
  Users,
  Clock,
} from "lucide-react";

export default function Hero() {
  const [activeImage, setActiveImage] = useState<"dive" | "learn">("dive");

  return (
    <section
      id="top"
      className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:pt-40 lg:pb-32 overflow-hidden bg-white"
    >
      {/* Subtle organic water glow backdrop */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] bg-cyan-100/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-0 -ml-20 w-[450px] h-[450px] bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-6 flex flex-col items-start"
          >
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100/80 text-blue-800 text-xs sm:text-sm font-medium mb-6 shadow-sm shadow-blue-900/5"
            >
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              <span>Academia de Natación en Santo Domingo</span>
              <span className="text-slate-400 font-normal">·</span>
              <span className="text-blue-600 font-semibold">Utesa & VivirMás</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-900 tracking-tight leading-[1.12] mb-6">
              Aprende a nadar con{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500">
                confianza
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-cyan-400/40"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,0 Q50,12 100,0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </span>
              , técnica y seguridad.
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8 font-normal">
              Academia de natación para niños desde los 2 años y adultos. Dos
              sucursales estratégicas en Santo Domingo, instructores
              certificados y grupos reducidos por nivel para un progreso
              seguro en el agua.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto mb-10">
              <a
                href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
              >
                <span>Reservar mi cupo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="#horarios"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-blue-900 font-semibold text-base border border-slate-200/80 transition-all duration-200"
              >
                <Clock className="w-4 h-4 text-cyan-600" />
                <span>Ver horarios</span>
              </a>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-100 w-full">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                  2
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">
                  Sedes en Sto. Dgo.
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                  +2 Años
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">
                  Niños y Adultos
                </div>
              </div>

              <div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-900">
                  100%
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium">
                  Certificados
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 xl:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Image Frame with soft aquatic shadow & rounded-3xl */}
              <div className="relative aspect-[4/5] sm:aspect-[4/3] lg:aspect-[5/4] rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/15 border-4 border-white">
                <Image
                  src={
                    activeImage === "dive"
                      ? "/MCB08946.jpg"
                      : "/MCB08820.jpg"
                  }
                  alt="Clases de natación MC Swim Academy"
                  fill
                  priority
                  className="object-cover transition-all duration-700 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-black/10 pointer-events-none" />

                {/* Image switcher toggle pills */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 shadow-md flex items-center gap-2">
                    <button
                      onClick={() => setActiveImage("dive")}
                      className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                        activeImage === "dive"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-blue-900"
                      }`}
                    >
                      Piscina Semi-olímpica
                    </button>
                    <button
                      onClick={() => setActiveImage("learn")}
                      className={`text-xs px-3 py-1 rounded-xl font-medium transition-all ${
                        activeImage === "learn"
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-slate-600 hover:text-blue-900"
                      }`}
                    >
                      Iniciación & Confianza
                    </button>
                  </div>
                </div>
              </div>

              {/* Floating Glassmorphism Badge 1: Safety / Certified */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-3.5 shadow-xl shadow-blue-900/10 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    Seguridad Total
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Protocolos y salvavidas
                  </div>
                </div>
              </motion.div>

              {/* Floating Glassmorphism Badge 2: Small groups */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{
                  duration: 4.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="absolute -bottom-6 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-xl shadow-blue-900/10 flex items-center gap-3.5"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    Grupos Reducidos
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Atención personalizada
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
