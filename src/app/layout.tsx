import type { Metadata, Viewport } from "next";
import { Figtree, Saira_Extra_Condensed } from "next/font/google";
import { metadataBase } from "@/lib/seo";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-figtree",
});

const saira = Saira_Extra_Condensed({
  subsets: ["latin"],
  // Solo 800: es el único peso que usa el sistema y es un archivo menos en el LCP.
  weight: "800",
  display: "swap",
  variable: "--font-saira",
});

export const metadata: Metadata = metadataBase;

export const viewport: Viewport = {
  themeColor: "#001a38",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-DO" className={`${figtree.variable} ${saira.variable}`}>
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
