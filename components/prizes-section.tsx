"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { Trophy, Medal, Award, Gift, Sparkles, Briefcase, Code, Headphones, Battery, Package, Plane } from "lucide-react"

const entrepreneurshipPrizes = [
  {
    quantity: "x4",
    amount: "50€",
    title: "en tarjeta regalo",
    icon: Gift,
    gradient: "from-yellow-400 to-amber-600",
  },
]

const developmentPrizes = [
  {
    quantity: "x1",
    amount: "600€",
    title: "en metálico",
    icon: Trophy,
    gradient: "from-yellow-400 to-amber-600",
  },
]

const generalPrizes = [
  { title: "Auriculares inalámbricos", quantity: "x2", icon: Headphones },
  { title: "Baterías portátiles", quantity: "x2", icon: Battery },
  { title: "Regalos de artesanía de Galicia", quantity: "x18", icon: Package },
]

const bestTeamPrize = {
  title: "Viaje al Encuentro Internacional de Jóvenes Emprendedores",
  location: "(Coimbra)",
  icon: Plane,
}

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
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
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
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Recompensas increíbles para los mejores proyectos de emprendimiento y desarrollo.
          </p>
        </div>

        {/* Two main categories */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Entrepreneurship Category */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="backdrop-blur-md bg-gradient-to-br from-[#AAFF00]/10 to-transparent border border-[#AAFF00]/30 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#AAFF00]/20 mb-6">
                <Briefcase className="w-8 h-8 text-[#AAFF00]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-8">
                Categoría <span className="text-[#AAFF00]">/EMPRENDIMIENTO/</span>
              </h3>
              <div className="space-y-6">
                {entrepreneurshipPrizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl hover:border-[#AAFF00]/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#AAFF00]/20">
                        <span className="text-2xl font-bold text-[#AAFF00]">{prize.quantity}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{prize.title}</p>
                      <p className="text-3xl font-bold text-[#AAFF00]">{prize.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Development Category */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="backdrop-blur-md bg-gradient-to-br from-[#AAFF00]/10 to-transparent border border-[#AAFF00]/30 rounded-2xl p-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-[#AAFF00]/20 mb-6">
                <Code className="w-8 h-8 text-[#AAFF00]" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-8">
                Categoría <span className="text-[#AAFF00]">/DESARROLLO/</span>
              </h3>
              <div className="space-y-6">
                {developmentPrizes.map((prize, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-6 p-6 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl hover:border-[#AAFF00]/30 transition-all duration-300"
                  >
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#AAFF00]/20">
                        <span className="text-2xl font-bold text-[#AAFF00]">{prize.quantity}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{prize.title}</p>
                      <p className="text-3xl font-bold text-[#AAFF00]">{prize.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* General Prizes */}
        <div
          className={`transition-all duration-700 mb-16 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
          <h3 className="text-center text-2xl font-bold text-white mb-8">
            <span className="text-[#AAFF00]">+PREMIOS/</span> para Todos
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {generalPrizes.map((prize, index) => (
              <div
                key={prize.title}
                className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-6 text-center hover:border-[#AAFF00]/30 transition-all duration-300 hover:scale-105 group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-[#AAFF00]/10 mb-4 group-hover:bg-[#AAFF00]/20 transition-colors">
                  <prize.icon className="w-7 h-7 text-[#AAFF00]" />
                </div>
                <div className="inline-block px-3 py-1 bg-[#AAFF00]/20 rounded-full mb-3">
                  <p className="text-[#AAFF00] font-bold text-lg">{prize.quantity}</p>
                </div>
                <h4 className="text-white font-semibold">{prize.title}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Best Team Prize */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "400ms" }}
        >
          <div className="backdrop-blur-md bg-gradient-to-r from-[#AAFF00]/15 to-transparent border border-[#AAFF00]/30 rounded-2xl p-10 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#AAFF00]/20 mb-6">
              <bestTeamPrize.icon className="w-10 h-10 text-[#AAFF00]" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              <span className="text-[#AAFF00]">MEJORES EQUIPOS</span>
            </h3>
            <p className="text-gray-300 text-lg font-semibold">
              {bestTeamPrize.title}
            </p>
            <p className="text-gray-400 text-sm mt-2">{bestTeamPrize.location}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
