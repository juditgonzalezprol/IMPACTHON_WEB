"use client"

import { useState } from "react"
import { Instagram, Linkedin, Mail, MapPin } from "lucide-react"
import RegistrationModal from "@/components/registration-modal"

const socialLinks = [
  { icon: Instagram, href: "https://www.instagram.com/gdgsantiagoes/?hl=es", label: "Instagram" },
  { icon: Linkedin, href: "https://www.linkedin.com/company/11843951/admin/dashboard/", label: "LinkedIn" },
]

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <footer className="relative overflow-hidden">

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
                    href="mailto:judit.gonzalez@gdg-sdc.org"
                    className="flex items-center gap-2 text-gray-400 hover:text-[#AAFF00] transition-colors text-sm"
                  >
                    <Mail className="w-4 h-4" />
                    judit.gonzalez@gdg-sdc.org
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
                2026 Impacthon USC. Todos los derechos reservados.
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
