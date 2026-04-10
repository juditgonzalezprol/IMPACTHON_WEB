'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerToChallenge, unregisterFromChallenge } from "@/app/retos/actions"
import { Button } from "@/components/ui/button"
import { FileText, CheckCircle2, Circle } from "lucide-react"

export default function ChallengeCard({
    challenge,
    teamId,
    isRegistered,
    registrationCount,
}: {
    challenge: any
    teamId: string | null
    isRegistered: boolean
    registrationCount: number
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleToggle() {
        setLoading(true)
        setError(null)

        const formData = new FormData()
        formData.append('challenge_id', challenge.id)
        formData.append('team_id', teamId!)

        const res = isRegistered
            ? await unregisterFromChallenge(formData)
            : await registerToChallenge(formData)

        if (res?.error) {
            setError(res.error)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group
            ${isRegistered
                ? "bg-[#AAFF00]/5 border-[#AAFF00]/40 shadow-[0_0_25px_rgba(170,255,0,0.08)]"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
            }`}
        >
            {/* Glow */}
            {isRegistered && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-2xl" />
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-white">{challenge.title}</h3>
                    {isRegistered ? (
                        <CheckCircle2 className="w-6 h-6 text-[#AAFF00] shrink-0" />
                    ) : (
                        <Circle className="w-6 h-6 text-gray-600 shrink-0" />
                    )}
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">
                    {challenge.description}
                </p>

                {/* Document link */}
                <a
                    href={challenge.document_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-[#AAFF00] hover:text-[#BBFF33] font-medium transition-colors mb-4"
                >
                    <FileText className="w-4 h-4" />
                    Ver definición del reto
                </a>

                {/* Inscription count */}
                <div className="text-xs text-gray-500 mb-4">
                    {registrationCount} {registrationCount === 1 ? 'equipo inscrito' : 'equipos inscritos'}
                </div>

                {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

                {/* Action */}
                {teamId ? (
                    <Button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`w-full transition-all ${isRegistered
                            ? "bg-transparent border border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                            : "bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold hover:shadow-[0_0_15px_rgba(170,255,0,0.3)]"
                            }`}
                        variant={isRegistered ? "outline" : "default"}
                    >
                        {loading ? "..." : isRegistered ? "Desapuntar equipo" : "Apuntar a mi equipo"}
                    </Button>
                ) : (
                    <p className="text-xs text-gray-500 text-center py-2">
                        Únete a un equipo para poder inscribirte
                    </p>
                )}
            </div>
        </div>
    )
}
