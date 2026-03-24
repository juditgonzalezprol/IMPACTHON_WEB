"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Quien puede participar?",
    answer:
      "Cualquier estudiante universitario, ya sea de grado, master o doctorado. Tambien pueden participar recien graduados (hasta 1 ano desde la finalizacion de sus estudios).",
  },
  {
    question: "Es gratuito?",
    answer:
      "Si, la participacion es completamente gratuita. Ademas, proporcionamos comida, bebidas y snacks durante todo el evento.",
  },
  {
    question: "Necesito un equipo?",
    answer:
      "Puedes registrarte solo o con un equipo de hasta 8 personas. Si vienes solo, te ayudaremos a encontrar companeros durante la sesion de formacion de equipos.",
  },
  {
    question: "Que debo llevar?",
    answer:
      "Tu portatil, cargador, y muchas ganas de crear. Recomendamos traer tambien ropa comoda y articulos de aseo personal si planeas quedarte a dormir.",
  },
  {
    question: "Hay premios?",
    answer:
      "Si, hay premios por valor de 2,000 euros distribuidos entre los mejores proyectos de cada categoria, ademas de premios especiales de nuestros sponsors.",
  },
  {
    question: "Puedo participar de forma remota?",
    answer:
      "Este evento es presencial para fomentar la colaboracion y el networking. Sin embargo, si tienes alguna necesidad especial, contactanos y buscaremos una solucion.",
  },
]

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section ref={ref} id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950/50 via-black to-black relative">
      {/* Decorative background texture */}
      <div className="absolute inset-0 opacity-20">
        <div
          style={{
            backgroundImage: `linear-gradient(135deg, rgba(170, 255, 0, 0.05) 25%, transparent 25%, transparent 50%, rgba(170, 255, 0, 0.05) 50%, rgba(170, 255, 0, 0.05) 75%, transparent 75%, transparent)`,
            backgroundSize: '40px 40px',
          }}
          className="w-full h-full"
        />
      </div>
      <div className="max-w-3xl mx-auto relative z-10">
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Preguntas{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              Frecuentes
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Resolvemos tus dudas sobre el evento.
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-6 data-[state=open]:border-[#AAFF00]/50 data-[state=open]:bg-[#AAFF00]/5 transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AccordionTrigger className="text-white hover:text-[#AAFF00] text-left py-5 hover:no-underline font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-400 pb-5 leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
