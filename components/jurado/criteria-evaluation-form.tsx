'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { submitEvaluation } from '@/app/jurado/actions'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

type FormCriterion = {
    id: string
    name: string
    description: string | null
    weight: number
    kind: 'specific' | 'general'
}

export default function CriteriaEvaluationForm({
    teamId,
    challengeId,
    criteria,
    existingScores,
    existingFeedback,
}: {
    teamId: string
    challengeId: string
    criteria: FormCriterion[]
    existingScores: Record<string, number>
    existingFeedback: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [scores, setScores] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {}
        for (const c of criteria) {
            init[c.id] = existingScores[c.id] ?? 5
        }
        return init
    })
    const [feedback, setFeedback] = useState(existingFeedback || "")

    const specific = criteria.filter(c => c.kind === 'specific')
    const general = criteria.filter(c => c.kind === 'general')

    const totalSpecificWeight = specific.reduce((acc, c) => acc + c.weight, 0)
    const totalGeneralWeight = general.reduce((acc, c) => acc + c.weight, 0)

    const handleSubmit = () => {
        setError(null)
        setSuccess(false)

        const formData = new FormData()
        formData.append('team_id', teamId)
        formData.append('challenge_id', challengeId)
        formData.append('feedback', feedback)
        for (const [criterionId, val] of Object.entries(scores)) {
            formData.append(`score_${criterionId}`, val.toString())
        }

        startTransition(async () => {
            const res = await submitEvaluation(formData)
            if ((res as any)?.error) {
                setError((res as any).error)
            } else {
                setSuccess(true)
                router.refresh()
                setTimeout(() => setSuccess(false), 3000)
            }
        })
    }

    return (
        <form
            action={handleSubmit}
            className="p-5 rounded-2xl border border-white/10 bg-black/60 backdrop-blur-sm space-y-6"
        >
            <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400">
                    Evaluación
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Notas del 0 al 10. Se guardan al pulsar "Guardar".</p>
            </div>

            {/* Criterios específicos del reto */}
            {specific.length > 0 && (
                <CriteriaGroup
                    title="Criterios del reto"
                    subtitle={`Definen el ganador del reto. Pesos: ${formatWeights(specific, totalSpecificWeight)}`}
                    criteria={specific}
                    scores={scores}
                    setScore={(id, v) => setScores(prev => ({ ...prev, [id]: v }))}
                />
            )}

            {/* Criterios generales */}
            {general.length > 0 && (
                <CriteriaGroup
                    title="Criterios generales"
                    subtitle="Definen la clasificación a la final. Comunes a todos los retos."
                    criteria={general}
                    scores={scores}
                    setScore={(id, v) => setScores(prev => ({ ...prev, [id]: v }))}
                />
            )}

            <div className="space-y-1">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">Feedback (opcional)</Label>
                <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Comentarios constructivos para el equipo..."
                    className="bg-black/40 border-white/10 text-white focus-visible:ring-purple-500 min-h-[80px] text-sm"
                />
            </div>

            {error && <p className="text-red-400 text-xs font-medium">{error}</p>}
            {success && (
                <p className="text-[#AAFF00] text-xs font-medium bg-[#AAFF00]/10 border border-[#AAFF00]/20 px-3 py-2 rounded-md">
                    ¡Evaluación guardada correctamente!
                </p>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-purple-500 hover:bg-purple-400 text-white font-bold transition-all"
            >
                {isPending ? "Guardando..." : "Guardar evaluación"}
            </Button>
        </form>
    )
}

function CriteriaGroup({
    title,
    subtitle,
    criteria,
    scores,
    setScore,
}: {
    title: string
    subtitle: string
    criteria: FormCriterion[]
    scores: Record<string, number>
    setScore: (id: string, v: number) => void
}) {
    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-bold text-white">{title}</h4>
                <p className="text-[10px] text-gray-500 mt-0.5">{subtitle}</p>
            </div>
            {criteria.map(c => (
                <div key={c.id} className="space-y-1.5">
                    <div className="flex items-baseline justify-between gap-2">
                        <Label className="text-gray-200 text-xs font-medium leading-tight">
                            {c.name}
                        </Label>
                        <span className="text-sm font-bold text-purple-400 tabular-nums">
                            {scores[c.id]?.toFixed(1)}
                        </span>
                    </div>
                    {c.description && (
                        <p className="text-[10px] text-gray-500 leading-snug">{c.description}</p>
                    )}
                    <Slider
                        min={0}
                        max={10}
                        step={0.5}
                        value={[scores[c.id] ?? 5]}
                        onValueChange={(v) => setScore(c.id, v[0])}
                        className="py-1"
                    />
                </div>
            ))}
        </div>
    )
}

function formatWeights(criteria: FormCriterion[], total: number): string {
    if (criteria.length === 0) return ""
    const allEqual = criteria.every(c => c.weight === criteria[0].weight)
    if (allEqual) return "iguales"
    return criteria
        .map(c => `${c.name.split(' ')[0]} ${Math.round((c.weight / total) * 100)}%`)
        .join(' · ')
}
