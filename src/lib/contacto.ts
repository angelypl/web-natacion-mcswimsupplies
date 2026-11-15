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

const NUMEROS = ["cero", "una", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez"];

/** 4 → "cuatro" (en femenino: "una sucursal"). De 11 en adelante, en cifras. */
export function enLetras(n: number) {
  return NUMEROS[n] ?? String(n);
}

/** "Sucursal VivirMás" · "Sucursales Utesa, VivirMás y Prado Oriental" (en el orden de SITE). */
export function textoSucursales(ids: readonly string[]) {
  const nombres = SITE.sucursales.filter((s) => ids.includes(s.id)).map((s) => s.nombre);
  return `${nombres.length > 1 ? "Sucursales" : "Sucursal"} ${listaNatural(nombres)}`;
}

/** Entre todas las sucursales, ¿hay clase los siete días? */
export const CLASES_TODA_LA_SEMANA = new Set(SITE.sucursales.flatMap((s) => s.dias)).size === 7;

/** ["viernes", "sábado"] → "viernes y sábado" */
export function listaNatural(items: string[]) {
  return new Intl.ListFormat("es-DO", { style: "long", type: "conjunction" }).format(items);
}
