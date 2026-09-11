import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mcswimacademy.com"),
  title: "MC Swim Academy | Clases de Natación en Santo Domingo",
  description:
    "Academia de natación en Santo Domingo para niños desde 2 años y adultos. Dos sucursales (Utesa y VivirMás), instructores certificados y horarios flexibles.",
  keywords: [
    "clases de natacion santo domingo",
    "academia de natacion republica dominicana",
    "natacion para ninos",
    "natacion adultos",
    "mc swim academy",
    "piscina semiolimpica utesa",
    "vivirmas natacion",
  ],
  authors: [{ name: "MC Swim Academy" }],
  openGraph: {
    title: "MC Swim Academy | Academia de Natación en Santo Domingo",
    description:
      "Aprende a nadar con instructores certificados en Santo Domingo. Clases para todas las edades en dos sucursales.",
    locale: "es_DO",
    type: "website",
    siteName: "MC Swim Academy",
    images: [
      {
        url: "/MCB08946.jpg",
        width: 1200,
        height: 800,
        alt: "MC Swim Academy - Academia de Natación",
      },
    ],
  },
  icons: {
    icon: "/logo-mc-swim-academy.jpeg",
    apple: "/logo-mc-swim-academy.jpeg",
  },
};

export const viewport: Viewport = {
  themeColor: "#0284c7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} scroll-smooth`}>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
        {children}
      </body>
    </html>
  );
}
