"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Calendar, CheckCircle2, MessageCircle, AlertCircle } from "lucide-react";

export default function Schedules() {
  const [selectedBranch, setSelectedBranch] = useState<"utesa" | "vivirmas">("utesa");

  const utesaSchedules = [
    {
      day: "Lunes",
      ageGroup: "4 años en adelante",
      time: "5:00 PM",
      category: "Infantil / Juvenil",
      notes: "Técnica, brazada y respiración",
    },
    {
      day: "Lunes",
      ageGroup: "4 años en adelante",
      time: "6:00 PM",
      category: "Infantil / Adultos",
      notes: "Acondicionamiento y estilos",
    },
    {
      day: "Domingos",
      ageGroup: "4 años en adelante",
      time: "8:00 AM",
      category: "Matutino Intensivo",
      notes: "Piscina semiolímpica en carriles",
    },
  ];

  const vivirmasSchedules = [
    {
      day: "Viernes",
      ageGroup: "4 años en adelante",
      time: "4:00 PM",
      category: "Infantil / Juvenil",
      notes: "Nivel principiante e intermedio",
    },
    {
      day: "Viernes",
      ageGroup: "4 años en adelante",
      time: "5:00 PM",
      category: "Infantil / Juvenil",
      notes: "Técnica y resistencia acuática",
    },
    {
      day: "Sábados",
      ageGroup: "Desde 2 años",
      time: "2:00 PM",
      category: "Iniciación Temprana",
      notes: "Piscina adaptada poco profunda",
    },
    {
      day: "Sábados",
      ageGroup: "Desde 2 años",
      time: "3:00 PM",
      category: "Iniciación Temprana",
      notes: "Estimulación y confianza en el agua",
    },
    {
      day: "Sábados",
      ageGroup: "4 años en adelante",
      time: "4:00 PM",
      category: "Infantil y Grupal",
      notes: "Perfeccionamiento de estilos",
    },
  ];

  const currentSchedules = selectedBranch === "utesa" ? utesaSchedules : vivirmasSchedules;

  return (
    <section id="horarios" className="py-20 md:py-28 bg-slate-50 relative border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100/70 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5 text-cyan-600" />
            <span>Disponibilidad y Turnos</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight">
            Elige el grupo y el horario que se ajuste a tu rutina
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Clases para niños desde los 2 años y adultos organizadas para que aproveches al máximo cada sesión.
          </p>
        </div>

        {/* Branch Selector Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center max-w-md w-full">
            <button
              onClick={() => setSelectedBranch("utesa")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedBranch === "utesa"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:text-blue-900 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sucursal Utesa</span>
            </button>

            <button
              onClick={() => setSelectedBranch("vivirmas")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                selectedBranch === "vivirmas"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                  : "text-slate-600 hover:text-blue-900 hover:bg-slate-50"
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Sucursal VivirMás</span>
            </button>
          </div>
        </div>

        {/* Branch Info Pill */}
        <div className="max-w-3xl mx-auto mb-8 bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-blue-950 text-sm sm:text-base">
                {selectedBranch === "utesa"
                  ? "Sucursal Utesa (Isabela Aguiar)"
                  : "Sucursal VivirMás (Sector El Millón)"}
              </div>
              <div className="text-xs text-slate-600">
                {selectedBranch === "utesa"
                  ? "Piscina semiolímpica con carriles oficiales · Sto. Domingo Oeste"
                  : "Piscina adaptada para iniciación infantil y desarrollo acuático · Sto. Domingo"}
              </div>
            </div>
          </div>

          <span className="text-xs font-semibold px-3 py-1 bg-white text-blue-700 rounded-full border border-blue-200">
            {selectedBranch === "utesa" ? "Lunes y Domingos" : "Viernes y Sábados"}
          </span>
        </div>

        {/* Schedule Cards Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedBranch}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
          >
            {currentSchedules.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md shadow-blue-900/5 hover:shadow-lg hover:shadow-blue-900/10 hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                      {item.day}
                    </span>
                    <span className="text-xs font-medium text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-md">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-2">
                    <Clock className="w-5 h-5 text-blue-600 self-center" />
                    <span className="text-3xl font-black text-blue-950 tracking-tight">
                      {item.time}
                    </span>
                  </div>

                  <div className="text-sm font-semibold text-blue-900 mb-2">
                    {item.ageGroup}
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.notes}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    Cupos reducidos
                  </span>

                  <a
                    href={`https://wa.me/18298830129?text=${encodeURIComponent(
                      `Hola MC Swim Academy, me interesa el horario de ${item.day} a las ${item.time} en ${
                        selectedBranch === "utesa" ? "Utesa" : "VivirMás"
                      }.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  >
                    <span>Consultar cupo</span>
                    <span>→</span>
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Custom Schedule Inquiry Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 to-blue-800 text-white p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300 flex-shrink-0 hidden sm:flex">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                ¿No encuentras tu horario ideal?
              </h3>
              <p className="text-slate-300 text-sm">
                Escríbenos directamente y te orientamos sobre aperturas de nuevos turnos y cupos especiales.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20informaci%C3%B3n%20sobre%20los%20horarios%20disponibles."
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all active:scale-95"
          >
            <MessageCircle className="w-4 h-4 text-green-600" />
            <span>Consultar disponibilidad</span>
          </a>
        </div>
      </div>
    </section>
  );
}
