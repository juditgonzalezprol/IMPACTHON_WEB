import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Github, ExternalLink, Package } from "lucide-react"
import CriteriaEvaluationForm from "@/components/jurado/criteria-evaluation-form"
import type { Criterion } from "@/lib/scoring"

export const dynamic = "force-dynamic"

export default async function JuradoEvaluatePage({
    params,
}: {
    params: Promise<{ challengeId: string; teamId: string }>
}) {
    const { challengeId, teamId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Jurado' && profile?.role !== 'Organizador') notFound()

    if (profile.role === 'Jurado') {
        const { data: assignment } = await supabase
            .from('jury_assignments')
            .select('challenge_id')
            .eq('jury_id', user.id)
            .eq('challenge_id', challengeId)
            .maybeSingle()
        if (!assignment) notFound()
    }

    // Reto y equipo
    const [{ data: challenge }, { data: team }] = await Promise.all([
        supabase.from('challenges').select('id, title').eq('id', challengeId).single(),
        supabase
            .from('teams')
            .select('id, name, description, github_url, demo_url')
            .eq('id', teamId)
            .single(),
    ])
    if (!challenge || !team) notFound()

    // Confirmar que el equipo está inscrito al reto
    const { data: registration } = await supabase
        .from('challenge_registrations')
        .select('team_id')
        .eq('challenge_id', challengeId)
        .eq('team_id', teamId)
        .maybeSingle()
    if (!registration) notFound()

    // Entregables
    const { data: deliverables } = await supabase
        .from('deliverables')
        .select('id, title, description, url')
        .eq('team_id', teamId)
        .order('created_at')

    // Criterios aplicables
    const { data: criteriaRaw } = await supabase
        .from('evaluation_criteria')
        .select('id, name, description, weight, kind, challenge_id, order_index')
        .or(`challenge_id.eq.${challengeId},kind.eq.general`)
        .order('kind')
        .order('order_index')

    const criteria: (Criterion & { description: string | null; order_index: number })[] =
        (criteriaRaw as any) || []

    // Evaluación previa de este juez para este (team, challenge)
    const { data: existingEval } = await supabase
        .from('evaluations')
        .select('id, feedback')
        .eq('team_id', teamId)
        .eq('jury_id', user.id)
        .eq('challenge_id', challengeId)
        .maybeSingle()

    let existingScores: Record<string, number> = {}
    if (existingEval) {
        const { data: scoresData } = await supabase
            .from('evaluation_scores')
            .select('criterion_id, score')
            .eq('evaluation_id', existingEval.id)
        existingScores = Object.fromEntries(
            (scoresData || []).map(s => [s.criterion_id, Number(s.score)])
        )
    }

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            <BackgroundGrid />
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <Link
                    href={`/jurado/${challengeId}`}
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a {challenge.title}
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Columna izquierda: info del proyecto */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <p className="text-sm text-purple-400 font-medium mb-1">{challenge.title}</p>
                            <h1 className="text-3xl md:text-4xl font-bold">{team.name}</h1>
                        </div>

                        <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                            <h2 className="font-bold text-white mb-2">Descripción del proyecto</h2>
                            <p className="text-gray-300 text-sm whitespace-pre-wrap">
                                {team.description || <span className="italic text-gray-500">El equipo no ha añadido descripción.</span>}
                            </p>
                        </div>

                        {(team.github_url || team.demo_url) && (
                            <div className="flex flex-wrap gap-3">
                                {team.github_url && (
                                    <a
                                        href={team.github_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm bg-black hover:bg-white/10 px-4 py-2 rounded-lg text-gray-300 border border-white/10 transition-colors"
                                    >
                                        <Github size={16} /> Ver Repositorio
                                    </a>
                                )}
                                {team.demo_url && (
                                    <a
                                        href={team.demo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm bg-[#00E5FF]/10 border border-[#00E5FF]/20 hover:bg-[#00E5FF]/20 px-4 py-2 rounded-lg text-[#00E5FF] transition-colors"
                                    >
                                        <ExternalLink size={16} /> Demo / Presentación
                                    </a>
                                )}
                            </div>
                        )}

                        {deliverables && deliverables.length > 0 && (
                            <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                                <div className="flex items-center gap-2 mb-3">
                                    <Package className="w-4 h-4 text-[#AAFF00]" />
                                    <h2 className="font-bold text-white">Entregables ({deliverables.length})</h2>
                                </div>
                                <ul className="space-y-2">
                                    {deliverables.map((d: any) => (
                                        <li key={d.id}>
                                            <a
                                                href={d.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-3 rounded-lg bg-black/40 border border-white/5 hover:border-[#AAFF00]/30 transition-colors"
                                            >
                                                <p className="text-sm font-medium text-white">{d.title}</p>
                                                {d.description && (
                                                    <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
                                                )}
                                                <p className="text-xs text-[#AAFF00] mt-1 truncate">{d.url}</p>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: formulario */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CriteriaEvaluationForm
                                teamId={teamId}
                                challengeId={challengeId}
                                criteria={criteria}
                                existingScores={existingScores}
                                existingFeedback={existingEval?.feedback || ""}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

function BackgroundGrid() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    )
}
