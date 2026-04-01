"use client"

import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"

type Sponsor = {
  name: string
  logo?: string
  scale?: string
  url?: string
}

const oro: Sponsor[] = [
  { name: "OSIX", logo: "/patrocinadores/osix.png" },
  { name: "Cátedra CAMELIA - Plexus", logo: "/patrocinadores/camelia-bg.png" },
  { name: "Eurostars", logo: "/patrocinadores/eurostars-white.png" },
]

const plata: Sponsor[] = [
  { name: "Dinahosting", logo: "/patrocinadores/dinahosting-white.svg" },
  { name: "Red Bull", logo: "/patrocinadores/redbull-color.svg" },
  { name: "Raiola", logo: "/patrocinadores/raiola.png" },
]

const colaborador: Sponsor[] = [
  { name: "GEM Galicia", logo: "/patrocinadores/gem-galicia-white.png" },
  { name: "Google Developer Groups", logo: "/patrocinadores/Cartel Gallego (5).png", scale: "scale-125" },
  { name: "AVTE", logo: "/patrocinadores/Cartel Gallego (6).png", scale: "scale-125" },
  { name: "ETSE", logo: "/patrocinadores/Cartel Gallego (2).png", scale: "scale-125" },
]

const tiers = [
  {
    label: "Oro",
    sponsors: oro,
    borderColor: "border-yellow-500/60",
    hoverBorder: "hover:border-yellow-400",
    hoverBg: "hover:bg-yellow-500/10",
    labelColor: "text-yellow-400",
    labelBorder: "border-yellow-500/40",
    labelBg: "bg-yellow-500/10",
    gridCols: "grid-cols-1 sm:grid-cols-3",
    cardHeight: "h-40 sm:h-48",
    textSize: "text-xl sm:text-3xl",
    glowColor: "rgba(234, 179, 8, 0.08)",
  },
  {
    label: "Plata",
    sponsors: plata,
    borderColor: "border-gray-400/40",
    hoverBorder: "hover:border-gray-300",
    hoverBg: "hover:bg-gray-400/10",
    labelColor: "text-gray-300",
    labelBorder: "border-gray-400/30",
    labelBg: "bg-gray-400/10",
    gridCols: "grid-cols-1 sm:grid-cols-3",
    cardHeight: "h-32 sm:h-40",
    textSize: "text-lg sm:text-2xl",
    glowColor: "rgba(156, 163, 175, 0.06)",
  },
  {
    label: "Colaborador",
    sponsors: colaborador,
    borderColor: "border-[#AAFF00]/20",
    hoverBorder: "hover:border-[#AAFF00]/50",
    hoverBg: "hover:bg-[#AAFF00]/5",
    labelColor: "text-[#AAFF00]",
    labelBorder: "border-[#AAFF00]/30",
    labelBg: "bg-[#AAFF00]/5",
    gridCols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    cardHeight: "h-24 sm:h-32",
    textSize: "text-sm sm:text-lg",
    glowColor: "rgba(170, 255, 0, 0.04)",
  },
]

function SponsorCard({
  sponsor,
  tier,
  index,
}: {
  sponsor: Sponsor
  tier: (typeof tiers)[number]
  index: number
}) {
  return (
    <div
      className={`group backdrop-blur-md bg-white/5 border ${tier.borderColor} rounded-xl overflow-hidden transition-all duration-500 ${tier.hoverBorder} ${tier.hoverBg} hover:scale-105 ${tier.cardHeight} flex items-center justify-center p-4`}
      style={{
        transitionDelay: `${index * 60}ms`,
        boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 30px ${tier.glowColor}`,
      }}
    >
      {sponsor.logo ? (
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={300}
          height={200}
          className={`w-full h-auto max-h-full object-contain group-hover:brightness-125 transition-all duration-300 ${sponsor.scale || ""}`}
        />
      ) : (
        <span
          className={`${tier.textSize} font-bold tracking-wide text-white group-hover:text-[#AAFF00] transition-colors duration-300 text-center`}
        >
          {sponsor.name}
        </span>
      )}
    </div>
  )
}

export default function SponsorsSection() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/40 to-black relative overflow-hidden"
    >
      {/* Decorative background texture */}
      <div className="absolute inset-0 opacity-20">
        <div
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.15) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
          className="w-full h-full"
        />
      </div>
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
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

        {/* Tiers */}
        <div className="space-y-12 mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.label}
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
            >
              {/* Tier label */}
              <div className="flex items-center gap-4 mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full border ${tier.labelBorder} ${tier.labelColor} ${tier.labelBg}`}
                >
                  {tier.label}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Sponsor grid */}
              <div className={`grid ${tier.gridCols} gap-4 sm:gap-6`}>
                {tier.sponsors.map((sponsor, index) => (
                  <SponsorCard
                    key={sponsor.name}
                    sponsor={sponsor}
                    tier={tier}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
