"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  ExternalLink,
  Calendar,
  Check,
  Compass,
  Phone,
  MessageCircle,
} from "lucide-react";

export default function Locations() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-100">
            <Compass className="w-3.5 h-3.5 text-cyan-600" />
            <span>Sucursales & Contacto</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-blue-900 tracking-tight">
            Dos lugares ideales para entrenar en Santo Domingo
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 font-normal">
            Piscinas higiénicas, tratadas bajo estándares rigurosos de calidad de agua, vestidores cómodos y ubicaciones de rápido acceso con enlaces directos en Google Maps.
          </p>
        </div>

        {/* Location Map / Croquis Card using 27-de-febrero.png */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/80 shadow-2xl relative group"
        >
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full min-h-[320px]">
            <Image
              src="/27-de-febrero.png"
              alt="Croquis de ubicación de MC Swim Academy en Santo Domingo"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-950/30 to-black/10" />

            {/* Content overlay */}
            <div className="absolute bottom-6 sm:bottom-10 left-6 sm:left-10 right-6 sm:right-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-cyan-400 text-slate-950 mb-2">
                  <MapPin className="w-3.5 h-3.5" />
                  Santo Domingo, R.D.
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Encuéntranos en Av. 27 de Febrero
                </h3>
                <p className="text-slate-200 text-xs sm:text-sm max-w-xl mt-1">
                  Referencia de ubicación central para llegar fácilmente a cualquiera de nuestras dos sucursales.
                </p>
              </div>

              <a
                href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20que%20me%20ayuden%20a%20ubicar%20la%20sucursal%20m%C3%A1s%20cercana."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white text-blue-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all self-start sm:self-end flex-shrink-0"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </motion.div>

        {/* Direct Contact Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          <a
            href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20informaci%C3%B3n%20sobre%20las%20clases%20de%20nataci%C3%B3n."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-2xl p-5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-green-500 text-white flex items-center justify-center flex-shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">WhatsApp</div>
              <div className="text-sm font-bold text-blue-900">(829) 883-0129</div>
            </div>
          </a>

          <a
            href="tel:+18298830129"
            className="flex items-center gap-3.5 bg-slate-50 hover:bg-blue-50 border border-slate-200/80 rounded-2xl p-5 transition-colors"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Teléfono</div>
              <div className="text-sm font-bold text-blue-900">(829) 883-0129</div>
            </div>
          </a>

          <div className="flex items-center gap-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
            <div className="w-11 h-11 rounded-xl bg-cyan-500 text-white flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500">Cobertura</div>
              <div className="text-sm font-bold text-blue-900">Santo Domingo, R.D.</div>
            </div>
          </div>
        </div>

        {/* Branch Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Branch 1: Utesa */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-10 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  Piscina Semiolímpica
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Santo Domingo Oeste
                </span>
              </div>

              <h3 className="text-2xl font-black text-blue-900 mb-2">
                Sucursal Utesa (Isabela Aguiar)
              </h3>

              <div className="flex items-start gap-2.5 text-sm text-slate-600 mb-4">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  UTESA, Av. Isabel Aguiar, Santo Domingo Oeste.
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Instalación con carriles para natación técnica, estilos y resistencia. Excelente para niños a partir de 4 años, jóvenes y adultos.
              </p>

              <div className="space-y-2.5 mb-8 bg-white p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>Días de clase: <strong>Lunes, viernes y domingos</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Carriles delimitados y control de profundidad</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Parqueo seguro y gradas para padres</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/4wHR9aS9CTaBgDpg7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-600/20 hover:shadow-lg transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Ver ubicación en Google Maps</span>
              <ExternalLink className="w-4 h-4 opacity-75 ml-1" />
            </a>
          </motion.div>

          {/* Branch 2: VivirMás */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="rounded-3xl bg-slate-50 border border-slate-200/80 p-8 sm:p-10 shadow-lg shadow-blue-900/5 hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-100 text-cyan-800">
                  Iniciación & Climatizada
                </span>
                <span className="text-xs font-medium text-slate-500">
                  Distrito Nacional
                </span>
              </div>

              <h3 className="text-2xl font-black text-blue-900 mb-2">
                Sucursal VivirMás (Sector El Millón)
              </h3>

              <div className="flex items-start gap-2.5 text-sm text-slate-600 mb-4">
                <MapPin className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                <span>
                  VivirMás, Sector El Millón, Santo Domingo.
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Piscina con área poco profunda, ideal para niños pequeños desde los 2 años en etapa de familiarización y aprendizaje sin estrés.
              </p>

              <div className="space-y-2.5 mb-8 bg-white p-5 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
                  <Calendar className="w-4 h-4 text-cyan-600" />
                  <span>Días de clase: <strong>Viernes y sábados</strong></span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Especial para estimulación temprana (2-3 años)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Área cómoda de espera para familiares</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/8kyaetW7CPVoYDPS9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all"
            >
              <Navigation className="w-4 h-4 text-cyan-400" />
              <span>Ver ubicación en Google Maps</span>
              <ExternalLink className="w-4 h-4 opacity-75 ml-1" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
