"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "¿Desde qué edad pueden inscribirse los niños?",
    answer:
      "Aceptamos niños desde los 2 años de edad. Para los más pequeños (2 a 3 años) contamos con un programa de iniciación acuática en nuestra sucursal VivirMás (Sector El Millón), cuya piscina cuenta con un área poco profunda especialmente segura y adaptada.",
  },
  {
    question: "¿Qué indumentaria o artículos se necesitan para la clase?",
    answer:
      "Para las clases regulares es obligatorio: traje de baño de natación (resistente al cloro), gorro de silicona y lentes de natación antiniebla. Si tienes dudas sobre qué modelo o talla elegir, nuestro equipo te orienta con gusto antes de tu primera clase.",
  },
  {
    question: "¿En qué consiste la evaluación inicial de nivel?",
    answer:
      "La inscripción incluye una evaluación diagnóstica en el agua donde el instructor observa la flotación, la respiración y la familiaridad con el medio acuático. Con base en esto, se te asigna el nivel y carril adecuado para un avance seguro.",
  },
  {
    question: "¿Puedo cambiar de horario o recuperar una clase?",
    answer:
      "Sí. Si por motivos de fuerza mayor no puedes asistir a una sesión programada, puedes notificarnos con anticipación por WhatsApp para coordinar la reposición dentro del mismo mes sujeto a disponibilidad de cupos.",
  },
  {
    question: "¿Qué facilidades de pago ofrecen?",
    answer:
      "Puedes pagar mediante transferencia bancaria (Banreservas, Popular, BHD, etc.), mediante link de pago digital con tarjeta de crédito o débito de forma inmediata, o solicitar la suscripción de cobro recurrente mensual.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 md:py-28 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-600" />
            <span>Respuestas Claras</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-900 tracking-tight">
            Preguntas Frecuentes
          </h2>

          <p className="mt-3 text-base text-slate-600">
            Todo lo que necesitas saber antes de tu primera clase de natación.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-blue-300 bg-blue-50/30 shadow-md shadow-blue-900/5"
                    : "border-slate-200/80 bg-white hover:border-slate-300"
                }`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-blue-950 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-blue-600 flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-blue-100/50 pt-3">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
