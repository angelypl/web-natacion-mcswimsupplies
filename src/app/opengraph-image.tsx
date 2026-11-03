import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "MC Swim Academy: clases de natación en Santo Domingo para niños desde 2 años y adultos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/logo-mc-swim-academy-recorte.jpg"));
  const logoSrc = `data:image/jpeg;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#001a38",
          color: "#f3fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={168} height={140} alt="" style={{ background: "#fff", borderRadius: 24, padding: 8 }} />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 34, color: "#a9c3d6" }}>
            <span style={{ color: "#f3fafc", fontSize: 44, fontWeight: 700 }}>MC Swim Academy</span>
            Santo Domingo, República Dominicana
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 128, fontWeight: 800, lineHeight: 0.95, letterSpacing: -3 }}>
          <span>APRENDE</span>
          <span style={{ color: "#38d4b8" }}>A NADAR</span>
        </div>
        <div style={{ display: "flex", height: 18, gap: 6 }}>
          {Array.from({ length: 40 }, (_, i) => (
            <div
              key={i}
              style={{ flex: 1, borderRadius: 6, background: i % 10 < 4 ? "#c2304e" : i % 10 === 4 || i % 10 === 9 ? "#f3fafc" : "#0277b5" }}
            />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
