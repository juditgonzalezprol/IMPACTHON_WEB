"use client"

import { useState } from "react"
import { Twitter, Instagram, Linkedin, Mail, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import RegistrationModal from "@/components/registration-modal"

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [email, setEmail] = useState("")

  return (
    <>
      <footer className="relative overflow-hidden">
        {/* CTA Section */}
        <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-zinc-950">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6">
              Preparado para el <span className="text-[#AAFF00]">desafio</span>?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Unete a mas de 200 participantes y crea soluciones con impacto real. Las plazas son limitadas!
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              size="lg"
              className="bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold py-4 px-10 rounded-xl text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(170,255,0,0.4)] group"
            >
              <span className="group-hover:tracking-wider transition-all">Registrar Equipo</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* Footer content */}
        <div className="py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Branding */}
              <div className="md:col-span-2">
                <a href="#inicio" className="text-3xl font-black tracking-tighter inline-block mb-4">
                  <span className="text-white">IMPACT</span>
                  <span className="text-[#AAFF00]">HON</span>
                </a>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                  El mayor hackathon de la Universidad de Santiago de Compostela. 
                  Transformando ideas en soluciones con impacto real desde 2023.
                </p>
                {/* Newsletter */}
                <div className="flex gap-2 max-w-sm">
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AAFF00] focus:ring-[#AAFF00]/20"
                  />
                  <Button className="bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-semibold px-4">
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-bold mb-4">Enlaces</h4>
                <div className="space-y-2">
                  {["Inicio", "Retos", "Premios", "Agenda", "FAQ"].map((link) => (
                    <a
                      key={link}
                      href={`#${link.toLowerCase()}`}
                      className="block text-gray-400 hover:text-[#AAFF00] transition-colors text-sm"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-white font-bold mb-4">Contacto</h4>
                <div className="space-y-3">
                  <a
                    href="mailto:impacthon@usc.es"
                    className="flex items-center gap-2 text-gray-400 hover:text-[#AAFF00] transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    impacthon@usc.es
                  </a>
                  <div className="flex items-start gap-2 text-gray-400 text-sm">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                      ETSE - Escuela Tecnica Superior de Ingenieria
                      <br />
                      Universidad de Santiago de Compostela
                    </span>
                  </div>
                </div>

                {/* Social */}
                <div className="flex gap-3 mt-6">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:border-[#AAFF00]/50 hover:bg-[#AAFF00]/10 transition-all duration-300 group"
                    >
                      <social.icon className="w-5 h-5 text-gray-400 group-hover:text-[#AAFF00] transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                2025 Impacthon USC. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-6 text-gray-500 text-sm">
                <a href="#" className="hover:text-[#AAFF00] transition-colors">Privacidad</a>
                <a href="#" className="hover:text-[#AAFF00] transition-colors">Terminos</a>
                <a href="#" className="hover:text-[#AAFF00] transition-colors">Codigo de Conducta</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
