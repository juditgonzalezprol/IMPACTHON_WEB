"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Users, Clock, Trophy, Zap } from "lucide-react"

const stats = [
  {
    icon: Users,
    value: "140",
    label: "Participantes",
    suffix: "",
  },
  {
    icon: Clock,
    value: "36",
    label: "Horas sin parar",
    suffix: "h",
  },
  {
    icon: Trophy,
    value: "4",
    label: "Equipos premiados",
    suffix: "",
  },
  {
    icon: Zap,
    value: "4",
    label: "Retos planteados",
    suffix: "",
  },
]

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.2,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section ref={ref} id="evento" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/30 to-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div 
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(170, 255, 0, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 80% 80%, rgba(170, 255, 0, 0.05) 0%, transparent 50%)`,
          }}
          className="w-full h-full"
        />
      </div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Resumen del Evento
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Una primera edición{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              inolvidable
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Impacthon 2026 fue un éxito rotundo. 36 horas en la ETSE de la USC,
            140 participantes apretados al teclado, un ambientazo brutal y proyectos
            que sorprendieron a todo el jurado. Gracias a todos los que vinisteis,
            programasteis, dormisteis poco y nos ayudasteis a montar algo único.
            Nos vemos en la próxima edición.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 text-center transition-all duration-700 hover:border-[#AAFF00]/50 hover:bg-[#AAFF00]/5 group ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#AAFF00]/10 mb-4 group-hover:bg-[#AAFF00]/20 group-hover:scale-110 transition-all duration-300">
                <stat.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[#AAFF00]" />
              </div>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 group-hover:text-[#AAFF00] transition-colors">
                {stat.value}
                {stat.suffix && <span className="text-[#AAFF00] text-2xl">{stat.suffix}</span>}
              </div>
              <div className="text-gray-400 text-sm sm:text-base font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
