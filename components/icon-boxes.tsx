"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Lightbulb, Code2, Heart, Package, Coffee } from "lucide-react"

const iconBoxes = [
  { icon: Lightbulb, label: "IDEA" },
  { icon: Code2, label: "PROGRAMA" },
  { icon: Heart, label: "COMUNICA" },
  { icon: Package, label: "DESENVOLVE" },
  { icon: Coffee, label: "DISFRUTA" },
]

export default function IconBoxes() {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>({
    threshold: 0.2,
  })

  return (
    <section ref={ref} className="py-16 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
      {/* Binary background pattern */}
      <div className="absolute inset-0 opacity-10 select-none pointer-events-none overflow-hidden">
        <div className="absolute inset-0 text-[#AAFF00] text-xs font-mono leading-tight whitespace-nowrap">
          {Array.from({ length: 20 }).map((_, rowIndex) => (
            <div key={rowIndex} className="animate-scroll-left" style={{ animationDelay: `${rowIndex * 0.5}s` }}>
              {Array.from({ length: 100 }).map((_, i) => (
                <span key={i}>{Math.random() > 0.5 ? "1" : "0"} </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {iconBoxes.map((box, index) => (
            <div
              key={box.label}
              className={`flex flex-col items-center transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="group relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border-2 border-white bg-black flex items-center justify-center transition-all duration-300 hover:border-[#AAFF00] hover:shadow-[0_0_30px_rgba(170,255,0,0.3)] hover:scale-110">
                <box.icon className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 text-white transition-colors duration-300 group-hover:text-[#AAFF00]" strokeWidth={1.5} />
                <div className="absolute inset-0 bg-[#AAFF00]/0 group-hover:bg-[#AAFF00]/5 transition-colors duration-300" />
              </div>
              <span className="mt-3 text-white font-bold text-xs sm:text-sm tracking-wider">
                {box.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
