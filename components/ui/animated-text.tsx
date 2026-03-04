"use client"

import React from "react"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
  staggerDelay?: number
  isVisible?: boolean
}

export function AnimatedText({
  text,
  className,
  delay = 0,
  staggerDelay = 30,
  isVisible = true,
}: AnimatedTextProps) {
  const [displayedChars, setDisplayedChars] = useState(0)

  useEffect(() => {
    if (!isVisible) {
      setDisplayedChars(0)
      return
    }

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedChars((prev) => {
          if (prev >= text.length) {
            clearInterval(interval)
            return prev
          }
          return prev + 1
        })
      }, staggerDelay)

      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timeout)
  }, [text, delay, staggerDelay, isVisible])

  return (
    <span className={cn("inline-block", className)}>
      {text.split("").map((char, index) => (
        <span
          key={index}
          className={cn(
            "inline-block transition-all duration-300",
            index < displayedChars
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
          style={{ transitionDelay: `${index * 10}ms` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  )
}

interface GlowingTextProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
}

export function GlowingText({
  children,
  className,
  glowColor = "#AAFF00",
}: GlowingTextProps) {
  return (
    <span
      className={cn(
        "relative inline-block animate-pulse",
        className
      )}
      style={{
        textShadow: `0 0 20px ${glowColor}40, 0 0 40px ${glowColor}20`,
      }}
    >
      {children}
    </span>
  )
}

interface TypewriterTextProps {
  texts: string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
}

export function TypewriterText({
  texts,
  className,
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterTextProps) {
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentFullText = texts[currentTextIndex]

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayText.length < currentFullText.length) {
            setDisplayText(currentFullText.slice(0, displayText.length + 1))
          } else {
            setTimeout(() => setIsDeleting(true), pauseDuration)
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText(displayText.slice(0, -1))
          } else {
            setIsDeleting(false)
            setCurrentTextIndex((prev) => (prev + 1) % texts.length)
          }
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentTextIndex, texts, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className={cn("inline-block", className)}>
      {displayText}
      <span className="animate-blink ml-0.5 inline-block w-[3px] h-[1em] bg-[#AAFF00] align-middle" />
    </span>
  )
}
