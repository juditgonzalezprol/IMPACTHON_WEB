'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { updateProjectDescription, updateRepoUrl } from "@/app/retos/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Github, Save, CheckCircle2 } from "lucide-react"

export default function ProjectForm({
    teamId,
    initialDescription,
    initialGithubUrl,
}: {
    teamId: string
    initialDescription: string | null
    initialGithubUrl: string | null
}) {
    const router = useRouter()
    const [description, setDescription] = useState(initialDescription ?? "")
    const [githubUrl, setGithubUrl] = useState(initialGithubUrl ?? "")
    const [savingDesc, setSavingDesc] = useState(false)
    const [savingRepo, setSavingRepo] = useState(false)
    const [savedDesc, setSavedDesc] = useState(false)
    const [savedRepo, setSavedRepo] = useState(false)
    const [error, setError] = useState<string | null>(null)

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

    async function handleSaveRepo() {
        setSavingRepo(true)
        setError(null)
        setSavedRepo(false)
        const formData = new FormData()
        formData.append('team_id', teamId)
        formData.append('github_url', githubUrl)

        const res = await updateRepoUrl(formData)
        if (res?.error) setError(res.error)
        else {
            setSavedRepo(true)
            setTimeout(() => setSavedRepo(false), 2000)
            router.refresh()
        }
        setSavingRepo(false)
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

            {/* Repo URL */}
            <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                    Repositorio del proyecto <span className="text-red-400 font-bold">*</span>
                    <span className="ml-2 text-xs font-normal text-red-400">Obligatorio</span>
                </label>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 flex-1">
                        <Github className="w-5 h-5 text-gray-400 shrink-0" />
                        <Input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="https://github.com/tu-usuario/tu-repo"
                            className="bg-black/50 border-white/20 text-sm flex-1"
                        />
                    </div>
                    <Button
                        size="sm"
                        onClick={handleSaveRepo}
                        disabled={savingRepo}
                        className="bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold shrink-0"
                    >
                        {savingRepo ? "..." : <Save className="w-3.5 h-3.5" />}
                    </Button>
                </div>
                {savedRepo && (
                    <span className="text-xs text-[#AAFF00] flex items-center gap-1 mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                    </span>
                )}
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
    )
}
