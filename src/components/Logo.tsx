"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Logo({
  className = "",
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  return (
    <Link
      href="#top"
      className={`flex items-center gap-3 group shrink-0 ${className}`}
    >
      <div
        className={`relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl overflow-hidden transition-transform duration-300 group-hover:scale-105 ${
          variant === "dark" ? "bg-white p-1 shadow-md" : ""
        }`}
      >
        <Image
          src="/logo-mc-swim-academy.jpeg"
          alt="MC Swim Academy"
          fill
          priority
          className="object-contain"
          sizes="56px"
        />
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`font-extrabold tracking-wide text-lg sm:text-xl leading-none font-sans transition-colors ${
            variant === "dark"
              ? "text-white group-hover:text-cyan-300"
              : "text-blue-950 group-hover:text-blue-600"
          }`}
        >
          MC Swim Academy
        </span>
        <span
          className={`text-[10px] tracking-widest uppercase font-semibold mt-1 ${
            variant === "dark" ? "text-slate-400" : "text-slate-400"
          }`}
        >
          Academia de Natación
        </span>
      </div>
    </Link>
  );
}
