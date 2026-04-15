'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { joinTeam, leaveTeam, updateTeam } from "@/app/equipos/actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Edit2, Users, ArrowRight, Github, ExternalLink, Target, CheckCircle2, Circle } from "lucide-react"

export default function TeamCard({
    team,
    isMyTeam,
    userIsInAnotherTeam,
    challenges = [],
    registeredChallengeIds = [],
    challengeRepos = [],
}: {
    team: any
    isMyTeam: boolean
    userIsInAnotherTeam: boolean
    challenges?: { id: string; title: string }[]
    registeredChallengeIds?: string[]
    challengeRepos?: { challenge_id: string; github_url: string | null }[]
}) {
    const challengeTitleById = new Map(challenges.map(c => [c.id, c.title]))
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [description, setDescription] = useState(team.description || "")
    const [githubUrl, setGithubUrl] = useState(team.github_url || "")
    const [demoUrl, setDemoUrl] = useState(team.demo_url || "")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const members = team.team_members || []
    const memberCount = members.length

    // MAX 6 MEMBERS PER TEAM, except for "staff" which allows 18
    const isStaffTeam = team.name?.toLowerCase() === 'staff'
    const maxMembers = isStaffTeam ? 18 : 6
    const isFull = memberCount >= maxMembers

    async function handleJoin() {
        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append("team_id", team.id)

        const res = await joinTeam(formData)
        if (res.error) {
            setError(res.error)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    async function handleLeave() {
        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append("team_id", team.id)

        const res = await leaveTeam(formData)
        if (res.error) {
            setError(res.error)
        } else {
            router.refresh()
        }
        setLoading(false)
    }

    async function handleSaveDescription() {
        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append("team_id", team.id)
        formData.append("description", description)
        if (githubUrl) formData.append("github_url", githubUrl)
        if (demoUrl) formData.append("demo_url", demoUrl)

        const res = await updateTeam(formData)
        if (res.error) {
            setError(res.error)
        } else {
            setIsEditing(false)
            router.refresh()
        }
        setLoading(false)
    }

    return (
        <div className={`p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group 
      ${isMyTeam
                ? "bg-white/10 border-[#AAFF00]/50 shadow-[0_0_30px_rgba(170,255,0,0.1)]"
                : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"
            }`}
        >
            {/* Decors */}
            {isMyTeam && (
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-2xl" />
            )}

            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white">{team.name}</h3>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-black/40 rounded-full border border-white/5 text-sm">
                    <Users size={14} className="text-[#AAFF00]" />
                    <span className={isFull ? "text-red-400 font-bold" : "text-gray-300"}>
                        {memberCount}/{maxMembers}
                    </span>
                </div>
            </div>

            {/* Retos */}
            {challenges.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                    {challenges.map((c) => {
                        const isActive = registeredChallengeIds.includes(c.id)
                        return (
                            <div
                                key={c.id}
                                title={c.title}
                                className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                                    isActive
                                        ? "bg-[#AAFF00]/15 border-[#AAFF00]/40 text-[#AAFF00]"
                                        : "bg-white/5 border-white/10 text-gray-600"
                                }`}
                            >
                                {isActive
                                    ? <CheckCircle2 size={10} />
                                    : <Circle size={10} />
                                }
                                <span className="truncate max-w-[80px]">{c.title}</span>
                            </div>
                        )
                    })}
                </div>
            )}

            {isEditing ? (
                <div className="space-y-3 mb-6">
                    <Textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-black/50 border-white/20 text-sm h-24"
                        placeholder="Añade una descripción para tu equipo..."
                    />
                    <div className="space-y-2">
                        <Input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => setGithubUrl(e.target.value)}
                            placeholder="Enlace del repositorio (GitHub, GitLab...)"
                            className="bg-black/50 border-white/20 text-sm h-10"
                        />
                        <Input
                            type="url"
                            value={demoUrl}
                            onChange={(e) => setDemoUrl(e.target.value)}
                            placeholder="Enlace de la demo (Figma, Vercel, YouTube...)"
                            className="bg-black/50 border-white/20 text-sm h-10"
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button
                            size="sm"
                            onClick={handleSaveDescription}
                            disabled={loading}
                            className="bg-[#AAFF00] text-black hover:bg-[#BBFF33]"
                        >
                            Guardar
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setDescription(team.description || "")
                                setGithubUrl(team.github_url || "")
                                setDemoUrl(team.demo_url || "")
                                setIsEditing(false)
                            }}
                            className="border-white/20 bg-transparent text-gray-300 hover:text-white"
                        >
                            Cancelar
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="mb-6 group space-y-4">
                    <p className="text-gray-400 text-sm line-clamp-3 min-h-[3rem]">
                        {team.description || <span className="italic text-gray-600">Sin descripción</span>}
                    </p>

                    {/* Render Links if they exist */}
                    {(team.github_url || team.demo_url || challengeRepos.length > 0) && (
                        <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
                            {/* Repos por reto */}
                            {challengeRepos.map((r) => (
                                <a
                                    key={r.challenge_id}
                                    href={r.github_url!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 rounded-md text-sm text-gray-300 transition-colors min-w-0"
                                >
                                    <Github size={14} className="shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 shrink-0">
                                        {challengeTitleById.get(r.challenge_id)?.split(' - ')[0] || 'Reto'}
                                    </span>
                                    <span className="truncate text-xs text-gray-400">
                                        {r.github_url!.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                                    </span>
                                </a>
                            ))}
                            {/* Repo de equipo (legacy o si no hay por reto) */}
                            {team.github_url && (
                                <a href={team.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 rounded-md text-sm text-gray-300 transition-colors">
                                    <Github size={14} /> Repositorio del equipo
                                </a>
                            )}
                            {team.demo_url && (
                                <a href={team.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 rounded-md text-sm text-[#00E5FF] transition-colors">
                                    <ExternalLink size={14} /> Demo / Drive
                                </a>
                            )}
                        </div>
                    )}

                    {isMyTeam && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-xs text-[#AAFF00]/70 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity uppercase tracking-wider font-bold"
                        >
                            <Edit2 size={12} /> Editar Proyecto
                        </button>
                    )}
                </div>
            )}

            {/* Members Avatars Stack */}
            <div className="flex flex-col gap-2 mb-6">
                <span className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-1">Miembros</span>
                <div className="flex items-center">
                    {members.map((member: any, i: number) => {
                        const p = member.profiles
                        return (
                            <div
                                key={p.id}
                                className="w-10 h-10 rounded-full border-2 border-[#121212] bg-gray-800 flex items-center justify-center -mr-3 last:mr-0 z-10 transition-transform hover:z-20 hover:scale-110 cursor-pointer group/avatar"
                                title={`${p.full_name} - ${p.role}`}
                                onClick={() => router.push(`/perfil/${p.id}`)}
                            >
                                {/* Normally an img if avatar_url exists, else Initials */}
                                <span className="text-xs font-bold text-[#AAFF00]">
                                    {p.full_name.substring(0, 2).toUpperCase()}
                                </span>
                            </div>
                        )
                    })}
                    {members.length === 0 && (
                        <span className="text-xs text-gray-500 italic">Equipo vacío</span>
                    )}
                </div>
            </div>

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            {/* Actions */}
            <div className="pt-4 border-t border-white/5">
                {isMyTeam ? (
                    <Button
                        variant="outline"
                        onClick={handleLeave}
                        disabled={loading}
                        className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                    >
                        Abandonar Equipo
                    </Button>
                ) : (
                    <Button
                        className="w-full bg-white/10 hover:bg-[#AAFF00] text-white hover:text-black border-none group-hover:shadow-[0_0_15px_rgba(170,255,0,0.2)] transition-all"
                        disabled={loading || isFull || userIsInAnotherTeam}
                        onClick={handleJoin}
                    >
                        {isFull
                            ? "Equipo Lleno"
                            : userIsInAnotherTeam
                                ? "Ya estás en otro equipo"
                                : "Unirme a este equipo"
                        }
                    </Button>
                )}
            </div>
        </div>
    )
}
