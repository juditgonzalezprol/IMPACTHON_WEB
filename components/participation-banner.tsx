"use client"

import { useEffect, useRef, useState } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

export default function ParticipationBanner() {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.3,
  })
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const element = containerRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress: 0 when element is at bottom of screen, 1 when at top
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (windowHeight + rect.height))
      )

      setScrollProgress(progress)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const colorProgress = Math.floor(scrollProgress * 300) // Más rápido

  return (
    <section
      ref={ref}
      className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div
        ref={containerRef}
        className={`w-full mx-auto relative z-10 transition-all duration-700 text-center ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        <div className="space-y-6 px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            <span className="text-white block">No importa si</span>
            <span
              className="block transition-all duration-300 pb-2 xl:pb-4"
              style={{
                background: `linear-gradient(90deg, 
                  #AAFF00 0%, 
                  #AAFF00 ${Math.min(100, colorProgress)}%, 
                  rgba(255, 255, 255, 0.5) ${Math.min(100, colorProgress)}%, 
                  rgba(255, 255, 255, 0.5) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              no sabes programar.
            </span>
          </h2>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            <span className="text-[#AAFF00] block">Puedes participar</span>
            <span className="text-white block">como equipo de</span>
            <span
              className="block transition-all duration-300 pb-2 xl:pb-4"
              style={{
                background: `linear-gradient(90deg, 
                  #AAFF00 0%, 
                  #AAFF00 ${Math.min(100, colorProgress - 50)}%, 
                  rgba(255, 255, 255, 0.5) ${Math.min(100, colorProgress - 50)}%, 
                  rgba(255, 255, 255, 0.5) 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              emprendimiento o de desarrollo.
            </span>
          </h2>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
            <span className="text-[#AAFF00] block">Da igual tu carrera.</span>
          </h2>
        </div>
      </div>
    </section>
  )
}
