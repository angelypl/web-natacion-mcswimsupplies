import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Sin registrar los tokens propios, tailwind-merge confunde `text-display-xl`
// (tamaño) con un color y descarta una de las dos clases.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-2xl", "display-xl", "display-lg", "display-md", "display-sm", "lead"],
      radius: ["pill", "card", "blob"],
      shadow: ["flota", "hondo"],
      ease: ["out-expo", "spring-soft", "spring"],
      font: ["display"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
