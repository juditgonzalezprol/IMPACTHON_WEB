"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { HelpCircle } from "lucide-react"

export default function TracksSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section ref={ref} id="retos" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/30 to-zinc-950 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(170, 255, 0, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(170, 255, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Retos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Elige tu{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              reto
            </span>
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg mb-4">
            Diversas catedras, empresas, organizaciones y grupos de investigacion proponen lineas de trabajo especificas con premios, tecnologias y mentoria personalizados.
          </p>
          <p className="text-gray-500 max-w-3xl mx-auto text-base">
            Cada equipo puede presentarse a tantos retos como desee con el mismo proyecto, optando <span className="text-white font-semibold">siempre</span> a los premios generales de desarrollo y emprendimiento. Cuando los anunciemos, cada reto incluira una descripcion, el nombre y logo de la entidad que lo propone, y sus premios.
          </p>
        </div>

        {/* 3 Placeholder cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`relative backdrop-blur-md bg-white/5 border border-dashed border-[#AAFF00]/30 rounded-2xl p-8 transition-all duration-700 flex flex-col items-center justify-center min-h-[280px] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#AAFF00]/10 mb-6">
                <HelpCircle className="w-8 h-8 text-[#AAFF00]/50" />
              </div>
              <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00]/60 uppercase tracking-widest border border-[#AAFF00]/20 rounded-full mb-4">
                Reto {i}
              </span>
              <h3 className="text-2xl font-bold text-white/30 mb-2">To Be Announced</h3>
              <p className="text-gray-600 text-sm text-center">
                Proximamente se revelara la entidad y los detalles de este reto.
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
