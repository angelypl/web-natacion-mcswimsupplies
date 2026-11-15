import { MessageCircle, Plus } from "lucide-react";
import { BotonLink } from "@/components/ui/Boton";
import { Section } from "@/components/ui/Section";
import { Titular } from "@/components/ui/Titular";
import { FAQ } from "@/content/faq";
import { whatsappUrl } from "@/lib/contacto";

// <details> nativo: funciona sin JS y `name` hace que se abra una a la vez.
export function Preguntas() {
  return (
    <Section tone="espuma" container="estrecho" id="preguntas" aria-labelledby="preguntas-titulo" className="py-20 md:py-28">
      <Titular
        id="preguntas-titulo"
        titulo="Preguntas frecuentes"
        entradilla="Lo que casi todos nos preguntan antes de la primera clase."
      />

      <div className="mt-12 border-t border-tone-line">
        {FAQ.map((item, i) => (
          <details key={item.pregunta} name="preguntas" open={i === 0} className="group/faq border-b border-tone-line">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-lg font-bold transition-colors duration-(--dur-base) hover:text-piscina-700 sm:text-xl [&::-webkit-details-marker]:hidden">
              {item.pregunta}
              <span className="grid size-10 shrink-0 place-items-center rounded-pill bg-marino-900 text-espuma-50 transition-[transform,background-color] duration-(--dur-base) ease-spring-soft group-open/faq:rotate-45 group-open/faq:bg-piscina-700">
                <Plus aria-hidden className="size-5" />
              </span>
            </summary>
            <p className="faq-respuesta max-w-2xl pb-6 text-lead text-tone-muted">{item.respuesta}</p>
          </details>
        ))}
      </div>

      <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lead font-semibold">¿Te quedó otra duda? Te la respondemos por WhatsApp.</p>
        <BotonLink
          href={whatsappUrl("Hola MC Swim Academy, tengo una pregunta sobre las clases de natación.")}
          externo
          variante="whatsapp"
          icono={<MessageCircle className="size-5" />}
          className="shrink-0"
        >
          Preguntar por WhatsApp
        </BotonLink>
      </div>
    </Section>
  );
}
