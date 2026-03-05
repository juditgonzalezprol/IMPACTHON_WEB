"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect"
import { Button } from "@/components/ui/button"
import { TypewriterText } from "@/components/ui/animated-text"
import { ChevronDown } from "lucide-react"

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  if (!mounted) return null

  return (
    <div className="flex gap-4 sm:gap-8 justify-center">
      {[
        { label: "Dias", value: timeLeft.days },
        { label: "Horas", value: timeLeft.hours },
        { label: "Min", value: timeLeft.minutes },
        { label: "Seg", value: timeLeft.seconds },
      ].map((item, index) => (
        <div
          key={item.label}
          className={`flex flex-col items-center backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-10 min-w-[70px] sm:min-w-[150px] lg:min-w-[180px] transition-all duration-500 hover:border-[#AAFF00]/50 hover:bg-[#AAFF00]/5 group animate-slide-up`}
          style={{ animationDelay: `${index * 100 + 800}ms` }}
        >
          <span className="text-4xl sm:text-6xl lg:text-8xl font-bold text-[#AAFF00] tabular-nums group-hover:scale-110 transition-transform">
            {String(item.value).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-base lg:text-xl text-gray-400 uppercase tracking-wider mt-2 font-semibold">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function HeroSection() {
  const router = useRouter()
  const [isLoaded, setIsLoaded] = useState(false)
  const targetDate = new Date("2026-04-10T09:00:00")

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden p-0 m-0 pt-8 gap-12">
        {/* Canvas Reveal Effect Background */}
        <div className="absolute inset-0">
          <CanvasRevealEffect
            animationSpeed={2}
            containerClassName="bg-black"
            colors={[
              [170, 255, 0],
              [180, 255, 50],
              [200, 255, 100],
            ]}
            dotSize={3}
            opacities={[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1]}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-0 sm:px-0 lg:px-0 max-w-none mx-0 w-full flex flex-col items-center">
          <div
            className={`transition-all duration-700 delay-200 w-full flex justify-center relative ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <div className="relative w-full h-96 sm:h-[40rem] lg:h-[50rem]">
              <Image
                src="/title_logo.svg?v=10"
                alt="Impacthon USC 2025"
                fill
                className="object-contain object-center scale-200"
                priority
              />

              {/* Fecha superpuesta */}
              <div className="absolute top-[20%] left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4">
                <span className="inline-block px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-xl lg:text-2xl font-bold text-[#AAFF00] border border-[#AAFF00]/30 rounded-full backdrop-blur-sm bg-[#AAFF00]/10 animate-glow-pulse whitespace-nowrap">
                  10-12 Abril 2026 | ETSE USC
                </span>
              </div>
            </div>
          </div>

          <div
            className={`hidden sm:block text-2xl sm:text-3xl lg:text-4xl text-gray-300 max-w-3xl -mt-8 sm:-mt-12 lg:-mt-16 mb-16 sm:mb-20 lg:mb-24 h-32 sm:h-16 transition-all duration-700 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <TypewriterText
              texts={[
                "48 horas de codigo e innovacion",
                "Crea soluciones con impacto real",
                "Conecta con los mejores talentos",
                "Transforma ideas en startups",
              ]}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
            />
          </div>

          <div
            className={`mb-12 mt-0 sm:mt-0 -mt-10 transition-all duration-700 delay-600 w-full px-4 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <CountdownTimer targetDate={targetDate} />
          </div>

          <div
            className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-700 delay-800 pb-16 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
          >
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold py-6 px-12 rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(170,255,0,0.4)] group"
            >
              <span className="group-hover:tracking-wider transition-all">Registrate Ahora</span>
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("evento")}
              className="border-2 border-[#AAFF00]/50 text-[#AAFF00] hover:bg-[#AAFF00]/10 hover:border-[#AAFF00] font-bold py-6 px-12 rounded-xl text-lg transition-all duration-300 bg-transparent"
            >
              Descubre mas
            </Button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("evento")}
            className="p-2 rounded-full border border-white/20 hover:border-[#AAFF00]/50 transition-colors"
            aria-label="Scroll down"
          >
            <ChevronDown className="w-6 h-6 text-white/60" />
          </button>
        </div>
      </section>

    </>
  )
}
