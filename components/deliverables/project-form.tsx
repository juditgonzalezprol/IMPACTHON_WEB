'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProjectDescription, updateRepoUrl } from "@/app/retos/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Github, Save, CheckCircle2, Target } from "lucide-react"

type RegisteredChallenge = { id: string; title: string; is_transversal: boolean }
type Registration = { challenge_id: string; github_url: string | null }

export default function ProjectForm({
    teamId,
    initialDescription,
    initialGithubUrl,
    registeredChallenges,
    registrations,
}: {
    teamId: string
    initialDescription: string | null
    initialGithubUrl: string | null
    registeredChallenges: RegisteredChallenge[]
    registrations: Registration[]
}) {
    const router = useRouter()
    const [description, setDescription] = useState(initialDescription ?? "")
    const [savingDesc, setSavingDesc] = useState(false)
    const [savedDesc, setSavedDesc] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const nonTransversal = registeredChallenges.filter(ch => !ch.is_transversal)
    const hasMultipleNonTransversal = nonTransversal.length > 1

    async function handleSaveDescription() {
        setSavingDesc(true)
        setError(null)
        setSavedDesc(false)
        const formData = new FormData()
        formData.append('team_id', teamId)
        formData.append('description', description)

        const res = await updateProjectDescription(formData)
        if (res?.error) setError(res.error)
        else {
            setSavedDesc(true)
            setTimeout(() => setSavedDesc(false), 2000)
            router.refresh()
        }
        setSavingDesc(false)
    }

    return (
        <div className="space-y-6">
            {/* Descripción del proyecto */}
            <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Descripción del proyecto
                </label>
                <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    placeholder="Describe vuestro proyecto: qué problema resuelve, cómo funciona, qué tecnologías usáis..."
                    className="bg-black/50 border-white/20 text-sm resize-y min-h-[150px]"
                />
                <div className="flex items-center gap-2 mt-2">
                    <Button
                        size="sm"
                        onClick={handleSaveDescription}
                        disabled={savingDesc}
                        className="bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold"
                    >
                        {savingDesc ? "Guardando..." : <><Save className="w-3.5 h-3.5 mr-1" /> Guardar descripción</>}
                    </Button>
                    {savedDesc && (
                        <span className="text-xs text-[#AAFF00] flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                        </span>
                    )}
                </div>
            </div>

            {/* Repos por reto */}
            <div>
                <label className="block text-sm font-semibold text-gray-200 mb-1">
                    Repositorio del proyecto <span className="text-red-400 font-bold">*</span>
                    <span className="ml-2 text-xs font-normal text-red-400">Obligatorio</span>
                </label>
                {hasMultipleNonTransversal && (
                    <p className="text-xs text-yellow-400 mb-3">
                        Estáis inscritos a varios retos no compatibles entre sí. Necesitáis un repositorio distinto para cada uno.
                    </p>
                )}

                {nonTransversal.length === 0 ? (
                    // Sin retos no-transversales: repo a nivel de equipo (legacy)
                    <RepoInput
                        teamId={teamId}
                        challengeId={null}
                        initialUrl={initialGithubUrl}
                    />
                ) : nonTransversal.length === 1 && !hasMultipleNonTransversal ? (
                    // Un solo reto no-transversal: un repo, mostramos el nombre pero sin complicar
                    <RepoInput
                        teamId={teamId}
                        challengeId={nonTransversal[0].id}
                        label={nonTransversal[0].title}
                        initialUrl={
                            registrations.find(r => r.challenge_id === nonTransversal[0].id)?.github_url
                            || initialGithubUrl
                        }
                    />
                ) : (
                    // Varios retos no-transversales: un repo por cada uno
                    <div className="space-y-3">
                        {nonTransversal.map(ch => {
                            const reg = registrations.find(r => r.challenge_id === ch.id)
                            return (
                                <RepoInput
                                    key={ch.id}
                                    teamId={teamId}
                                    challengeId={ch.id}
                                    label={ch.title}
                                    initialUrl={reg?.github_url || null}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    )
}

function RepoInput({
    teamId,
    challengeId,
    label,
    initialUrl,
}: {
    teamId: string
    challengeId: string | null
    label?: string
    initialUrl: string | null
}) {
    const router = useRouter()
    const [url, setUrl] = useState(initialUrl ?? "")
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSave() {
        setSaving(true)
        setError(null)
        setSaved(false)
        const formData = new FormData()
        formData.append('team_id', teamId)
        formData.append('github_url', url)
        if (challengeId) formData.append('challenge_id', challengeId)

        const res = await updateRepoUrl(formData)
        if (res?.error) setError(res.error)
        else {
            setSaved(true)
            setTimeout(() => setSaved(false), 2000)
            router.refresh()
        }
        setSaving(false)
    }

    return (
        <div className={`${label ? 'p-3 rounded-xl border border-white/10 bg-black/30' : ''}`}>
            {label && (
                <div className="flex items-center gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-xs font-bold text-purple-400">{label}</span>
                </div>
            )}
            <div className="flex items-center gap-2">
                <Github className="w-5 h-5 text-gray-400 shrink-0" />
                <Input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/tu-usuario/tu-repo"
                    className="bg-black/50 border-white/20 text-sm flex-1"
                />
                <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold shrink-0"
                >
                    {saving ? "..." : <Save className="w-3.5 h-3.5" />}
                </Button>
            </div>
            {saved && (
                <span className="text-xs text-[#AAFF00] flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                </span>
            )}
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>
    )
}
