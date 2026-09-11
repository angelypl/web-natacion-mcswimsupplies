"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Check,
  CreditCard,
  Building2,
  RefreshCw,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const pricingTiers = [
  {
    name: "Inscripción",
    badge: "Pago Único",
    price: "1,000",
    period: "una sola vez",
    description:
      "Incluye diagnóstico, prueba de flotabilidad y asignación personalizada al grupo y carril correspondiente.",
    features: [
      "Evaluación inicial de nivel",
      "Asignación de grupo y horario",
      "Acceso a ambas sucursales",
      "Kit digital de bienvenida",
    ],
    highlight: false,
    cta: "Iniciar inscripción",
    whatsappText:
      "Hola MC Swim Academy, quiero iniciar mi inscripción de RD$1,000.",
  },
  {
    name: "Niños 2 a 3 años",
    badge: "Estimulación",
    price: "3,000",
    period: "/ mes",
    description:
      "Acompañamiento cercano y lúdico para que los más chicos sientan seguridad total en el agua.",
    features: [
      "Grupos ultra reducidos",
      "Estimulación acuática temprana",
      "Piscina con zona de baja profundidad",
      "Seguimiento constante de confianza",
    ],
    highlight: false,
    cta: "Elegir este plan",
    whatsappText:
      "Hola MC Swim Academy, deseo el plan mensual para Niños 2 a 3 años (RD$3,000/mes).",
  },
  {
    name: "Niños 4+ años",
    badge: "Más Popular",
    price: "2,500",
    period: "/ mes",
    description:
      "Desarrollo integral de técnica, desplazamientos, respiración rítmica y resistencia acuática.",
    features: [
      "Clases regulares mensuales",
      "Metodología técnica por niveles",
      "Seguridad y técnicas de flotabilidad",
      "Apoyo y supervisión del instructor",
    ],
    highlight: true,
    cta: "Elegir este plan",
    whatsappText:
      "Hola MC Swim Academy, quiero el plan mensual para Niños 4+ años (RD$2,500/mes).",
  },
  {
    name: "Adultos",
    badge: "Todos los Niveles",
    price: "2,500",
    period: "/ mes",
    description:
      "Aprende a nadar desde cero sin pena o entrena en carril semiolímpico para tonificar y liberar estrés.",
    features: [
      "Horarios flexibles matutinos y tarde",
      "De principiante absoluto a estilo libre",
      "Entrenamiento técnico de bajo impacto",
      "Piscina con carriles en Utesa",
    ],
    highlight: false,
    cta: "Elegir este plan",
    whatsappText:
      "Hola MC Swim Academy, quiero el plan mensual para Adultos (RD$2,500/mes).",
  },
];

const paymentMethods = [
  {
    icon: Building2,
    title: "Transferencia bancaria",
    description:
      "Transfiere desde Banreservas, Banco Popular, BHD o tu banco preferido y envía tu comprobante por WhatsApp.",
  },
  {
    icon: CreditCard,
    title: "Link de pago seguro",
    description:
      "Paga al instante con tarjeta de crédito o débito Visa / Mastercard desde tu celular sin comisiones extra.",
  },
  {
    icon: RefreshCw,
    title: "Pago recurrente",
    description:
      "Automatiza el cobro mensual para asegurar tu cupo y desentenderte de fechas de vencimiento.",
  },
];

export default function Pricing() {
  return (
    <section id="precios" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            <span>Tarifas Claras</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight">
            Inversión clara, sin sorpresas ni letras pequeñas
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            La inscripción se abona una sola vez al ingresar. Luego mantienes tu membresía activa con la cuota mensual de tu programa.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, idx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`rounded-3xl p-7 flex flex-col justify-between transition-all duration-300 ${
                tier.highlight
                  ? "bg-gradient-to-b from-blue-900 to-blue-950 text-white shadow-2xl shadow-blue-900/20 ring-4 ring-blue-500/20 relative"
                  : "bg-white border border-slate-200/90 text-slate-800 shadow-lg shadow-blue-900/5 hover:border-blue-300"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-slate-950 text-[11px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Recomendado
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      tier.highlight
                        ? "bg-white/15 text-cyan-300"
                        : "bg-blue-50 text-blue-700"
                    }`}
                  >
                    {tier.badge}
                  </span>
                </div>

                <h3
                  className={`text-xl font-bold mb-3 ${
                    tier.highlight ? "text-white" : "text-blue-900"
                  }`}
                >
                  {tier.name}
                </h3>

                <div className="mb-5 flex items-baseline gap-1">
                  <span
                    className={`text-sm font-semibold ${
                      tier.highlight ? "text-slate-300" : "text-slate-500"
                    }`}
                  >
                    RD$
                  </span>
                  <span
                    className={`text-4xl font-extrabold tracking-tight ${
                      tier.highlight ? "text-white" : "text-blue-950"
                    }`}
                  >
                    {tier.price}
                  </span>
                  <span
                    className={`text-xs ${
                      tier.highlight ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {tier.period}
                  </span>
                </div>

                <p
                  className={`text-xs leading-relaxed mb-6 ${
                    tier.highlight ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  {tier.description}
                </p>

                <div className="space-y-3 mb-8 pt-4 border-t border-slate-100/20">
                  {tier.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          tier.highlight
                            ? "bg-cyan-500/20 text-cyan-300"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span
                        className={
                          tier.highlight ? "text-slate-200" : "text-slate-600"
                        }
                      >
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <a
                href={`https://wa.me/18298830129?text=${encodeURIComponent(
                  tier.whatsappText
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full py-3.5 px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-200 ${
                  tier.highlight
                    ? "bg-cyan-400 hover:bg-cyan-300 text-slate-950 shadow-md font-bold"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                }`}
              >
                <span>{tier.cta}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </motion.div>
          ))}
        </div>

        {/* Payment Facilities Section */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/70">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl font-bold text-blue-900">
              Facilidades y métodos de pago cómodos
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Te brindamos todas las alternativas para que realizar tu pago sea rápido y seguro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method, i) => {
              const Icon = method.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-base mb-1">
                      {method.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {method.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
