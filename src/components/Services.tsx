"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Award } from "lucide-react";

const programs = [
  {
    id: "ninos-2-3",
    title: "Iniciación Niños 2 a 3 años",
    badge: "Estimulación temprana",
    age: "2 a 3 años",
    price: "RD$3,000",
    period: "/mes",
    image: "/GM105963.jpg",
    imagePosition: "object-top",
    description:
      "Programa especial de iniciación con acompañamiento cercano en piscina adaptada para que los más pequeños desarrollen afinidad y seguridad natural en el agua.",
    benefits: [
      "Grupos reducidos y supervisión continua",
      "Iniciación lúdica y estimulación motriz",
      "Piscina con área poco profunda (VivirMás)",
      "Seguimiento personalizado de confianza",
    ],
    whatsappText:
      "Hola MC Swim Academy, me interesa inscribir a mi hijo/a en el programa de Niños 2 a 3 años.",
    popular: true,
  },
  {
    id: "ninos-4-mas",
    title: "Natación Niños 4+ años",
    badge: "Formación continua",
    age: "4 años en adelante",
    price: "RD$2,500",
    period: "/mes",
    image: "/MCB08820.jpg",
    imagePosition: "object-center",
    description:
      "Clases regulares divididas por niveles de aprendizaje para perfeccionar la técnica de brazada, patada, flotabilidad y resistencia cardiovascular.",
    benefits: [
      "Clases mensuales estructuradas",
      "Enseñanza progresiva de estilos",
      "Acompañamiento y motivación constante",
      "Horarios en ambas sucursales (Utesa y VivirMás)",
    ],
    whatsappText:
      "Hola MC Swim Academy, me interesa inscribir a mi hijo/a en las clases de Niños 4+ años.",
    popular: false,
  },
  {
    id: "adultos",
    title: "Natación para Adultos",
    badge: "Todas las destrezas",
    age: "Jóvenes y adultos",
    price: "RD$2,500",
    period: "/mes",
    image: "/91559E05-DA44-45B9-9DB4-EDBE0E1853A8.jpeg",
    imagePosition: "object-center",
    description:
      "Supera el miedo al agua desde cero o perfecciona tu técnica y velocidad en carriles semiolímpicos con planes adaptados a tu ritmo de vida.",
    benefits: [
      "Desde principiante absoluto hasta avanzado",
      "Entrenamiento cardiovascular de bajo impacto",
      "Piscina semiolímpica en Utesa",
      "Horarios flexibles matutinos y vespertinos",
    ],
    whatsappText:
      "Hola MC Swim Academy, quiero información e inscribirme en las clases para Adultos.",
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="clases" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Programas y Clases</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight"
          >
            Clases de natación diseñadas para cada etapa
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-base sm:text-lg text-slate-600 font-normal"
          >
            Enseñamos con metodología moderna basada en la confianza y el disfrute.
            Sin importar tu edad o experiencia, tenemos el grupo ideal para ti.
          </motion.p>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {programs.map((prog, index) => (
            <motion.div
              key={prog.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
              className={`rounded-3xl overflow-hidden bg-white border ${
                prog.popular
                  ? "border-blue-300 ring-2 ring-blue-500/20 shadow-xl shadow-blue-900/10"
                  : "border-slate-200/80 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:shadow-blue-900/10"
              } transition-all duration-300 flex flex-col`}
            >
              {/* Image Frame */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-100">
                <Image
                  src={prog.image}
                  alt={prog.title}
                  fill
                  className={`object-cover ${prog.imagePosition} transition-transform duration-700 hover:scale-105`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />

                {/* Badge overlay */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-blue-900 backdrop-blur-md shadow-sm">
                    {prog.age}
                  </span>
                </div>

                {prog.popular && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md">
                      <Sparkles className="w-3 h-3" />
                      Destacado
                    </span>
                  </div>
                )}

                {/* Price tag on image bottom */}
                <div className="absolute bottom-3 left-4 right-4 flex items-baseline justify-between text-white">
                  <span className="text-xs uppercase tracking-wider font-semibold opacity-90">
                    Mensualidad
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black">{prog.price}</span>
                    <span className="text-xs opacity-80">{prog.period}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 mb-2">
                    {prog.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    {prog.description}
                  </p>

                  <div className="space-y-2.5 mb-8">
                    {prog.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-5 h-5 rounded-full bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600 flex-shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <a
                  href={`https://wa.me/18298830129?text=${encodeURIComponent(
                    prog.whatsappText
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3.5 px-5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                    prog.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/25"
                      : "bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200 hover:border-transparent"
                  }`}
                >
                  <span>Reservar este programa</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Certified Instructors Spotlight Card using GM106103.jpg */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-blue-900 via-blue-950 to-slate-900 text-white p-8 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle water ambient light */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Image Column using GM106103.jpg */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-xl border-2 border-white/20">
                <Image
                  src="/GM106103.jpg"
                  alt="Equipo de instructores certificados MC Swim Academy"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-medium text-cyan-300">
                  Equipo Docente Certificado
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 order-1 lg:order-2 flex flex-col items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-700 text-cyan-300 text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Instructores Certificados</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
                Aprende con profesionales dedicados a tu evolución en el agua
              </h3>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Nuestro equipo cuenta con certificaciones en salvamento acuático, primeros auxilios y metodología pedagógica progresiva. Nos aseguramos de que cada alumno reciba atención cálida, respetando sus tiempos y celebrando cada logro.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <a
                  href="#horarios"
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-md transition-colors"
                >
                  Ver horarios disponibles
                </a>

                <a
                  href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quisiera%20conocer%20m%C3%A1s%20sobre%20los%20instructores."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm border border-white/20 transition-colors"
                >
                  Hablar con un asesor
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
