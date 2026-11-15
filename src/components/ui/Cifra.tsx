import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

const DIGITOS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * Cifra que sube dígito a dígito una sola vez al entrar en vista (dentro de un
 * bloque con `data-reveal`). Cada dígito es una rueda 0–9 ya colocada en su
 * número desde el servidor: sin JS, sin soporte o con movimiento reducido se
 * ve la cifra final, quieta. El lector de pantalla oye el texto entero.
 */
export function Cifra({ texto, className }: { texto: string; className?: string }) {
  let n = 0;
  return (
    <span role="img" aria-label={texto} className={cn("cifra-rueda inline-flex tabular-nums", className)}>
      {[...texto].map((c, i) =>
        /\d/.test(c) ? (
          <span key={i} aria-hidden className="digito" style={{ "--d": Number(c), "--i": n++ } as CSSProperties}>
            <span className="digito-rueda">
              {DIGITOS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ) : (
          <span key={i} aria-hidden>
            {c}
          </span>
        ),
      )}
    </span>
  );
}
