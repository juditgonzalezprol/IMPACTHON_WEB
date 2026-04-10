"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Dna, Hotel, Smartphone, Cloud } from "lucide-react"

const challenges = [
  {
    icon: Dna,
    sponsor: "Cátedra Camelia",
    title: "LocalFold",
    description: "Crea una interfaz web intuitiva para predicción de estructuras de proteínas con AlphaFold2, conectada al supercomputador CESGA Finis Terrae III.",
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    tagColor: "text-emerald-400 border-emerald-400/30",
  },
  {
    icon: Hotel,
    sponsor: "Eurostars Hotel Company",
    title: "Make Me Want to Travel",
    description: "Transforma datos reales de clientes y reservas hoteleras en decisiones de marketing accionables mediante IA y análisis de datos.",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    tagColor: "text-blue-400 border-blue-400/30",
  },
  {
    icon: Smartphone,
    sponsor: "Observatorio GEM Galicia",
    title: "Por un uso responsable del móvil",
    description: "Diseña una solución que ayude a jóvenes de 10 a 25 años a reducir el uso improductivo del móvil y sus consecuencias en salud y rendimiento.",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
    tagColor: "text-purple-400 border-purple-400/30",
  },
  {
    icon: Cloud,
    sponsor: "GDG Santiago",
    title: "Herramientas Cloud",
    description: "Reto transversal: aprovecha créditos de Google Cloud, herramientas de IA de Google y la plataforma Antigravity para potenciar tu proyecto.",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
    tagColor: "text-orange-400 border-orange-400/30",
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
            Empresas, cátedras y organizaciones proponen retos reales con premios, tecnologías y mentoría propios.
          </p>
          <p className="text-gray-500 max-w-3xl mx-auto text-base">
            Cada equipo puede presentarse a tantos retos como desee con el mismo proyecto, optando <span className="text-white font-semibold">siempre</span> a los premios generales de desarrollo y emprendimiento.
          </p>
        </div>

        {/* Challenge cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {challenges.map((c, i) => {
            const Icon = c.icon
            return (
              <div
                key={i}
                className={`relative backdrop-blur-md bg-gradient-to-br ${c.color} border ${c.borderColor} rounded-2xl p-7 transition-all duration-700 flex flex-col min-h-[280px] hover:scale-[1.02] hover:shadow-lg ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                  }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 mb-5">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className={`inline-block self-start px-3 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-full mb-3 ${c.tagColor}`}>
                  {c.sponsor}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-1">
                  {c.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
