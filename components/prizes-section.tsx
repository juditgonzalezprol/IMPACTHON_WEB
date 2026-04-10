"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Trophy, Briefcase, Code, Dna, Hotel, Smartphone, Cloud } from "lucide-react"

export default function PrizesSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section
      ref={ref}
      id="premios"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/40 to-black relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.2) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
          className="w-full h-full"
        />
      </div>
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-[#AAFF00]/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-[#AAFF00]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Premios Generales
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              Premios
            </span>
            {" "}del Hackathon
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg">
            Todos los proyectos, independientemente de los retos a los que se presenten, optan automaticamente a los premios generales de desarrollo y emprendimiento.
          </p>
        </div>

        {/* Two main categories */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12">
          {/* Desarrollo */}
          <div
            className={`backdrop-blur-md bg-gradient-to-br from-[#AAFF00]/10 to-transparent border border-[#AAFF00]/30 rounded-2xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#AAFF00]/20 mb-6">
              <Code className="w-8 h-8 text-[#AAFF00]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Linea <span className="text-[#AAFF00]">/DESARROLLO/</span>
            </h3>
            <p className="text-gray-400 mb-8">
              Se valora la calidad tecnica del proyecto: arquitectura, codigo, funcionalidad, uso de tecnologias y ejecucion.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-5 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#AAFF00]/20">
                    <Trophy className="w-7 h-7 text-[#AAFF00]" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">1er Premio por equipo</p>
                  <p className="text-3xl font-bold text-[#AAFF00]">???€</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-5 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">2do Premio por equipo</p>
                  <p className="text-3xl font-bold text-white">???€</p>
                </div>
              </div>
            </div>
          </div>

          {/* Emprendimiento */}
          <div
            className={`backdrop-blur-md bg-gradient-to-br from-[#AAFF00]/10 to-transparent border border-[#AAFF00]/30 rounded-2xl p-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#AAFF00]/20 mb-6">
              <Briefcase className="w-8 h-8 text-[#AAFF00]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Linea <span className="text-[#AAFF00]">/EMPRENDIMIENTO/</span>
            </h3>
            <p className="text-gray-400 mb-8">
              Se valora el caracter innovador, el potencial empresarial y el impacto social del proyecto.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-6 p-5 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#AAFF00]/20">
                    <Trophy className="w-7 h-7 text-[#AAFF00]" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">1er Premio por equipo</p>
                  <p className="text-3xl font-bold text-[#AAFF00]">???€</p>
                </div>
              </div>
              <div className="flex items-center gap-6 p-5 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/10">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 text-sm mb-1">2do Premio por equipo</p>
                  <p className="text-3xl font-bold text-white">???€</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premios por reto */}
        <div
          className={`mt-8 sm:mt-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#AAFF00]" />
            Premios por Reto
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Camelia */}
            <div className="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Dna className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase text-emerald-400">Camelia</span>
              </div>
              <p className="text-gray-300 text-sm">
                Continuar el desarrollo del proyecto en CiTIUS y el ecosistema de la Cátedra CAMELIA, con acompañamiento de investigadores expertos hacia una aplicación real.
              </p>
            </div>
            {/* Eurostars */}
            <div className="p-5 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Hotel className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold uppercase text-blue-400">Eurostars</span>
              </div>
              <p className="text-gray-300 text-sm">
                Dos noches de hotel por persona del equipo ganador (habitación doble con desayuno incluido).
              </p>
            </div>
            {/* GEM */}
            <div className="p-5 rounded-xl bg-purple-500/5 border border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-bold uppercase text-purple-400">GEM Galicia</span>
              </div>
              <p className="text-gray-300 text-sm">
                Pendiente de anunciar. Vinculado a formación en emprendimiento y competencias transversales.
              </p>
            </div>
            {/* GDG Cloud */}
            <div className="p-5 rounded-xl bg-orange-500/5 border border-orange-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Cloud className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold uppercase text-orange-400">GDG Cloud</span>
              </div>
              <p className="text-gray-300 text-sm">
                Créditos de Google Cloud para todos los participantes + acceso a herramientas de IA y plataforma Antigravity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
