"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function FloatingArrow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Parallax effect
  const parallaxX = typeof window !== "undefined" ? (mousePosition.x - window.innerWidth / 2) * 0.02 : 0
  const parallaxY = typeof window !== "undefined" ? (mousePosition.y - window.innerHeight / 2) * 0.02 : 0

  return (
    <div
      className={`fixed pointer-events-none transition-opacity duration-1000 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: "15%",
        right: "5%",
        zIndex: 5,
      }}
    >
      <div
        className="relative w-24 h-24 sm:w-32 sm:h-32"
        style={{
          transform: `translate(${parallaxX}px, ${parallaxY}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#AAFF00]/20 to-transparent blur-2xl animate-pulse" />
        
        {/* Arrow SVG */}
        <div className="relative w-full h-full animate-float">
          <Image
            src="/flecha.svg?v=2"
            alt="Flecha decorativa"
            fill
            className="object-contain drop-shadow-[0_0_20px_rgba(170,255,0,0.3)]"
            priority
          />
        </div>
      </div>
    </div>
  )
}
