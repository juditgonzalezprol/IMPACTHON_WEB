import { useEffect, useRef, useState } from "react"

export function useScrollColor() {
  const [colorProgress, setColorProgress] = useState(0)
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const element = containerRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Calculate progress: 0 when element bottom enters viewport, 1 when top leaves
      // Element enters when its bottom (rect.bottom) is at windowHeight
      // Element fully visible when its top (rect.top) is at 0
      
      const elementTop = rect.top
      const elementBottom = rect.bottom

      // If element hasn't entered viewport yet
      if (elementBottom < 0) {
        setColorProgress(0)
        return
      }

      // If element has passed viewport
      if (elementTop > windowHeight) {
        setColorProgress(0)
        return
      }

      // Calculate progress from when element enters to when it's centered in viewport
      // Progress: 0 at windowHeight (bottom entering), 1 at windowHeight/2 (centered)
      const progress = Math.max(0, Math.min(1, (windowHeight - elementTop) / (windowHeight * 0.75)))

      setColorProgress(progress)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Call once on mount

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Returns color progress from 0 to 100
  const colorValue = Math.floor(Math.min(100, colorProgress * 100))

  return { containerRef, colorProgress: colorValue }
}
