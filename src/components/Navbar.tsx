"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone, MessageCircle, ChevronRight } from "lucide-react";
import Logo from "./Logo";

const navLinks = [
  { name: "Inicio", href: "#top" },
  { name: "Clases", href: "#clases" },
  { name: "Horarios", href: "#horarios" },
  { name: "Precios", href: "#precios" },
  { name: "Contacto", href: "#contacto" },
  { name: "Inscripción", href: "#inscripcion" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm shadow-blue-900/5 py-3.5 border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Logo />

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-blue-900 hover:bg-slate-50 rounded-full transition-all duration-200"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:+18298830129"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-900 px-3 py-2 rounded-full hover:bg-slate-50 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-cyan-500" />
              <span>(829) 883-0129</span>
            </a>

            <a
              href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-95 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Reservar cupo</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <a
              href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6 text-slate-900" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-100 overflow-hidden shadow-xl"
          >
            <div className="px-6 pt-4 pb-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 px-4 rounded-xl text-base font-medium text-slate-700 hover:text-blue-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href="tel:+18298830129"
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-500" />
                  <span>Llamar: (829) 883-0129</span>
                </a>

                <a
                  href="https://wa.me/18298830129?text=Hola%20MC%20Swim%20Academy%2C%20quiero%20inscribirme%20en%20las%20clases%20de%20nataci%C3%B3n."
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-blue-600 text-white font-semibold text-sm shadow-md shadow-blue-600/25 hover:bg-blue-700 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Reservar mi cupo por WhatsApp</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
