"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Users, UserPlus, Loader2, CheckCircle } from "lucide-react"

interface TeamMember {
  name: string
  email: string
  university: string
}

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [teamName, setTeamName] = useState("")
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: "", email: "", university: "" },
  ])

  const addMember = () => {
    if (teamMembers.length < 4) {
      setTeamMembers([...teamMembers, { name: "", email: "", university: "" }])
    }
  }

  const removeMember = (index: number) => {
    if (teamMembers.length > 1) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index))
    }
  }

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updated = [...teamMembers]
    updated[index][field] = value
    setTeamMembers(updated)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setIsSuccess(true)
  }

  const resetForm = () => {
    setStep(1)
    setIsSuccess(false)
    setTeamName("")
    setTeamMembers([{ name: "", email: "", university: "" }])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl shadow-[#AAFF00]/10 animate-in zoom-in-95 fade-in duration-300">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-[#AAFF00]/10">
              <Users className="w-6 h-6 text-[#AAFF00]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Registro de Equipo</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Completa el formulario para inscribir a tu equipo en Impacthon USC 2025
          </p>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step >= s
                      ? "bg-[#AAFF00] text-black"
                      : "bg-white/10 text-gray-500"
                  }`}
                >
                  {isSuccess && s === 3 ? <CheckCircle className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 rounded-full transition-all duration-500 ${
                      step > s ? "bg-[#AAFF00]" : "bg-white/10"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 rounded-full bg-[#AAFF00]/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-[#AAFF00]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Registro Completado</h3>
              <p className="text-gray-400 mb-6">
                Hemos enviado un email de confirmacion a todos los miembros del equipo.
                Nos vemos en Impacthon USC 2025!
              </p>
              <Button
                onClick={resetForm}
                className="bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-semibold"
              >
                Cerrar
              </Button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <Label htmlFor="teamName" className="text-white mb-2 block">
                  Nombre del Equipo *
                </Label>
                <Input
                  id="teamName"
                  placeholder="Ej: CodeCrusaders"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AAFF00] focus:ring-[#AAFF00]/20"
                />
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!teamName.trim()}
                className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-semibold disabled:opacity-50"
              >
                Continuar
              </Button>
            </div>
          ) : step === 2 ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">
                  Miembros del Equipo ({teamMembers.length}/4)
                </h3>
                {teamMembers.length < 4 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addMember}
                    className="border-[#AAFF00] text-[#AAFF00] hover:bg-[#AAFF00]/10 bg-transparent"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Anadir
                  </Button>
                )}
              </div>

              <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#AAFF00]">
                        Miembro {index + 1} {index === 0 && "(Lider)"}
                      </span>
                      {teamMembers.length > 1 && (
                        <button
                          onClick={() => removeMember(index)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <Input
                      placeholder="Nombre completo"
                      value={member.name}
                      onChange={(e) => updateMember(index, "name", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AAFF00] focus:ring-[#AAFF00]/20"
                    />
                    <Input
                      type="email"
                      placeholder="Email universitario"
                      value={member.email}
                      onChange={(e) => updateMember(index, "email", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AAFF00] focus:ring-[#AAFF00]/20"
                    />
                    <Input
                      placeholder="Universidad"
                      value={member.university}
                      onChange={(e) => updateMember(index, "university", e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#AAFF00] focus:ring-[#AAFF00]/20"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1 border-white/20 text-white hover:bg-white/5 bg-transparent"
                >
                  Atras
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={teamMembers.some((m) => !m.name || !m.email)}
                  className="flex-1 bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-semibold disabled:opacity-50"
                >
                  Revisar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <h4 className="text-sm font-medium text-gray-400 mb-1">Equipo</h4>
                <p className="text-xl font-bold text-white">{teamName}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Miembros</h4>
                <div className="space-y-2">
                  {teamMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#AAFF00]/20 flex items-center justify-center text-[#AAFF00] font-bold text-sm">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                      {index === 0 && (
                        <span className="px-2 py-1 text-xs font-medium bg-[#AAFF00]/20 text-[#AAFF00] rounded">
                          Lider
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1 border-white/20 text-white hover:bg-white/5 bg-transparent"
                >
                  Editar
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Registrando...
                    </>
                  ) : (
                    "Confirmar Registro"
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
