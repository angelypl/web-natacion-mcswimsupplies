import { SITE } from "@/content/site";

export function whatsappUrl(mensaje: string = SITE.whatsapp.mensajeInscripcion) {
  return `https://wa.me/${SITE.whatsapp.numero}?text=${encodeURIComponent(mensaje)}`;
}

export const TEL_URL = `tel:${SITE.telefono.e164}`;

const pesos = new Intl.NumberFormat("es-DO", {
  style: "currency",
  currency: "DOP",
  currencyDisplay: "symbol",
  maximumFractionDigits: 0,
});

/** 2500 → "RD$2,500" */
export function formatoPesos(monto: number) {
  return pesos.format(monto);
}

/** ["viernes", "sábado"] → "viernes y sábado" */
export function listaNatural(items: string[]) {
  return new Intl.ListFormat("es-DO", { style: "long", type: "conjunction" }).format(items);
}
