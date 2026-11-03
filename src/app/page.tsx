import Schedules from "@/components/Schedules";
import { Cabecera } from "@/components/layout/Cabecera";
import { Pie } from "@/components/layout/Pie";
import { WhatsAppFlotante } from "@/components/layout/WhatsAppFlotante";
import { Carriles } from "@/components/secciones/Carriles";
import { Comunidad } from "@/components/secciones/Comunidad";
import { Hero } from "@/components/secciones/Hero";
import { Inscripcion } from "@/components/secciones/Inscripcion";
import { PorQue } from "@/components/secciones/PorQue";
import { Preguntas } from "@/components/secciones/Preguntas";
import { PrimeraClase } from "@/components/secciones/PrimeraClase";
import { Sucursales } from "@/components/secciones/Sucursales";
import RevealRoot from "@/components/ui/RevealRoot";
import { jsonLdInicio, serializar } from "@/lib/jsonLd";

export default function Home() {
  return (
    <>
      <a
        href="#contenido"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-pill bg-boya-400 px-5 py-3 font-bold text-marino-950 shadow-hondo transition-transform focus-visible:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Cabecera />
      <main id="contenido">
        <Hero />
        <PorQue />
        <Carriles />
        <PrimeraClase />
        <Schedules />
        <Sucursales />
        <Comunidad />
        <Inscripcion />
        <Preguntas />
      </main>
      <Pie />
      <WhatsAppFlotante />
      <RevealRoot />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializar(jsonLdInicio()) }} />
    </>
  );
}
