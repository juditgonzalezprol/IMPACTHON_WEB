"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Users, Lightbulb, Code, Send } from "lucide-react"

const steps = [
  {
    icon: Users,
    title: "Paso 1: El Equipo",
    description:
      "Forma tu equipo de 2 a 6 miembros, diviértete y colabora efectivamente. Puedes traer tu propio equipo o unirte a uno en el evento.",
  },
  {
    icon: Lightbulb,
    title: "Paso 2: La Idea",
    description:
      "Inspírate con los retos propuestos por patrocinadores y la organización para crear una solución original.",
  },
  {
    icon: Code,
    title: "Paso 3: Codifica",
    description:
      "Tienes 36 horas para dar vida a tu idea: Usa tu lenguaje de programación favorito, ¡o prueba algo nuevo!",
  },
  {
    icon: Send,
    title: "Paso 4: Envía",
    description:
      "Incluye documentación y una demostración convincente para mostrar el potencial y aplicabilidad de tu proyecto.",
  },
]

export default function HowToSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section ref={ref} id="como-participar" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950/50 via-black to-zinc-950/50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div 
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, rgba(170, 255, 0, 0.03) 0px, rgba(170, 255, 0, 0.03) 2px, transparent 2px, transparent 10px)`,
          }}
          className="w-full h-full"
        />
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Lo que necesitas saber
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Cómo{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              Participar
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-700 hover:border-[#AAFF00]/50 hover:bg-[#AAFF00]/5 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#AAFF00]/10 mb-6 group-hover:bg-[#AAFF00]/20 group-hover:scale-110 transition-all duration-300">
                <step.icon className="w-8 h-8 text-[#AAFF00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-[#AAFF00] transition-colors">
                {step.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
