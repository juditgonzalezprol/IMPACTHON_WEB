import React from "react"
import type { Metadata } from 'next'
import { Poppins, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import FloatingContactButtons from '@/components/floating-contact-buttons'

const poppins = Poppins({ weight: ['400', '700', '900'], subsets: ["latin"], variable: "--font-sans" });
const playfairDisplay = Playfair_Display({ weight: ['700', '900'], subsets: ["latin"], variable: "--font-heading" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: 'Impacthon USC 2025 | Hackathon de Innovación Sostenible',
  description: 'Desarrolla soluciones reales para un futuro sostenible. 48 horas de código, innovación e impacto en la Universidad de Santiago de Compostela.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <FloatingContactButtons />
        <Analytics />
      </body>
    </html>
  )
}
