'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { submitEvaluation } from '@/app/jurado/actions' // Server Action
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function EvaluationForm({
    teamId,
    existingEvaluation
}: {
    teamId: string,
    existingEvaluation?: any
}) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    // Local state for the inputs
    const [idea, setIdea] = useState(existingEvaluation?.score_idea || 5)
    const [exec, setExec] = useState(existingEvaluation?.score_execution || 5)
    const [pres, setPres] = useState(existingEvaluation?.score_presentation || 5)
    const [feedback, setFeedback] = useState(existingEvaluation?.feedback || "")

    async function handleSubmit() {
        setLoading(true)
        setError(null)
        setSuccess(false)

        const formData = new FormData()
        formData.append('team_id', teamId)
        formData.append('score_idea', idea.toString())
        formData.append('score_execution', exec.toString())
        formData.append('score_presentation', pres.toString())
        formData.append('feedback', feedback)

        const res = await submitEvaluation(formData)

        if (res.error) {
            setError(res.error)
        } else {
            setSuccess(true)
            router.refresh()
            // Hide success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000)
        }
        setLoading(false)
    }

    return (
        <form action={handleSubmit} className="mt-4 pt-4 border-t border-white/10 space-y-4">
            <h4 className="text-[#AAFF00] font-bold text-sm uppercase tracking-wider mb-2">Evaluar Proyecto</h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                    <Label className="text-gray-300 text-xs">Idea / Innovación (1-10)</Label>
                    <Input
                        type="number" min="1" max="10" required
                        value={idea} onChange={(e) => setIdea(parseInt(e.target.value))}
                        className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-gray-300 text-xs">Ejecución Técnica (1-10)</Label>
                    <Input
                        type="number" min="1" max="10" required
                        value={exec} onChange={(e) => setExec(parseInt(e.target.value))}
                        className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-gray-300 text-xs">Presentación / UI (1-10)</Label>
                    <Input
                        type="number" min="1" max="10" required
                        value={pres} onChange={(e) => setPres(parseInt(e.target.value))}
                        className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <Label className="text-gray-300 text-xs">Feedback Privado (opcional)</Label>
                <Textarea
                    value={feedback} onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Escribe comentarios constructivos sobre el proyecto..."
                    className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00] min-h-[60px] text-sm"
                />
            </div>

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            {success && <p className="text-[#AAFF00] text-xs font-medium bg-[#AAFF00]/10 border border-[#AAFF00]/20 px-3 py-1.5 rounded-md inline-block">¡Evaluación guardada correctamente!</p>}

            <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white/10 hover:bg-[#AAFF00] text-white hover:text-black border-none transition-all mt-2"
            >
                {loading ? "Guardando..." : "Guardar Evaluación"}
            </Button>
        </form>
    )
}
