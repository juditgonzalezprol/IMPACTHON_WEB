"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"

const sponsors = [
  { name: "Sponsor 1", logo: "/patrocinadores/Cartel Gallego.png" },
  { name: "Sponsor 2", logo: "/patrocinadores/Cartel Gallego (2).png" },
  { name: "Sponsor 3", logo: "/patrocinadores/Cartel Gallego (3).png" },
  { name: "Sponsor 4", logo: "/patrocinadores/Cartel Gallego (4).png" },
  { name: "Sponsor 5", logo: "/patrocinadores/Cartel Gallego (5).png" },
  { name: "Sponsor 6", logo: "/patrocinadores/Cartel Gallego (6).png" },
  { name: "Sponsor 7", logo: "/patrocinadores/Cartel Gallego (7).png" },
  { name: "Sponsor 8", logo: "/patrocinadores/Cartel Gallego (8).png" },
]

const collaborators = [
  { name: "USC" },
  { name: "ETSE" },
  { name: "Xunta de Galicia" },
  { name: "Concello de Santiago" },
  { name: "CESGA" },
  { name: "Hub Emprendimiento" },
]

export default function SponsorsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section ref={ref} className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/40 to-black relative overflow-hidden">
      {/* Decorative background texture */}
      <div className="absolute inset-0 opacity-20">
        <div 
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.15) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
          className="w-full h-full"
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Sponsors */}
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Partners
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Nuestros{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              Patrocinadores
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Empresas lideres que apuestan por la innovacion y el talento joven.
          </p>
        </div>

        <div
          className={`transition-all duration-700 mb-20 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sponsors.map((sponsor, index) => (
              <div
                key={sponsor.name}
                className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-xl overflow-hidden transition-all duration-500 hover:border-[#AAFF00]/50 hover:bg-[#AAFF00]/5 hover:scale-105 h-32 sm:h-40 flex items-center justify-center p-4"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <Image
                  src={sponsor.logo}
                  alt={sponsor.name}
                  width={300}
                  height={200}
                  className="w-full h-auto object-contain group-hover:brightness-125 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Collaborators */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
        </div>
      </div>
    </section>
  )
}
