"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Leaf, HeartPulse, Building2, ArrowRight } from "lucide-react"

const tracks = [
  {
    icon: Leaf,
    title: "Sostenibilidad",
    description:
      "Crea soluciones para combatir el cambio climatico, reducir residuos y promover un consumo responsable.",
    color: "#22C55E",
    challenges: ["Economia circular", "Energia limpia", "Biodiversidad"],
  },
  {
    icon: HeartPulse,
    title: "Salud Digital",
    description:
      "Desarrolla herramientas que mejoren el acceso a la salud, el bienestar mental y la calidad de vida.",
    color: "#EF4444",
    challenges: ["Telemedicina", "Salud mental", "Accesibilidad"],
  },
  {
    icon: Building2,
    title: "Smart Campus",
    description:
      "Diseña tecnologias para hacer nuestra universidad mas inteligente, eficiente y conectada.",
    color: "#3B82F6",
    challenges: ["Movilidad", "Gestion de espacios", "Comunidad"],
  },
]

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
            Categorias
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
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Tres areas de impacto, infinitas posibilidades de innovacion.
          </p>
        </div>

        {/* Grid + TBA overlay wrapper */}
        <div className="relative">
          {/* Tracks grid (blurred behind overlay) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none pointer-events-none">
            {tracks.map((track, index) => (
              <div
                key={track.title}
                className={`relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ backgroundColor: `${track.color}20` }}
                >
                  <track.icon className="w-8 h-8" style={{ color: track.color }} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{track.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{track.description}</p>
                <div className="space-y-2">
                  {track.challenges.map((challenge) => (
                    <div key={challenge} className="flex items-center gap-2 text-sm text-gray-500">
                      <ArrowRight className="w-4 h-4 text-[#AAFF00]" />
                      {challenge}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* TO BE ANNOUNCED overlay */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-2xl backdrop-blur-md bg-black/60">
            <div className="text-center px-6">
              <span className="inline-block px-4 py-1.5 text-xs font-bold text-[#AAFF00] uppercase tracking-widest border border-[#AAFF00]/40 rounded-full mb-6 bg-[#AAFF00]/10">
                Próximamente
              </span>
              <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-lg">
                TO BE ANNOUNCED
              </h3>
              <p className="text-gray-400 text-base max-w-sm mx-auto">
                Los retos del Impacthon se revelarán muy pronto. ¡Estáte atento!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
