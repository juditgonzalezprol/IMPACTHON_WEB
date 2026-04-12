import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Users, CheckCircle2, Circle, CircleDashed } from "lucide-react"
import { evaluationStatus, type Criterion, type Score, type Evaluation } from "@/lib/scoring"

export const dynamic = "force-dynamic"

export default async function JuradoChallengePage({
    params,
}: {
    params: Promise<{ challengeId: string }>
}) {
    const { challengeId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Jurado' && profile?.role !== 'Organizador') notFound()

    // Verificar acceso al reto si es Jurado
    if (profile.role === 'Jurado') {
        const { data: assignment } = await supabase
            .from('jury_assignments')
            .select('challenge_id')
            .eq('jury_id', user.id)
            .eq('challenge_id', challengeId)
            .maybeSingle()
        if (!assignment) notFound()
    }

    // Reto
    const { data: challenge } = await supabase
        .from('challenges')
        .select('id, title, description')
        .eq('id', challengeId)
        .single()
    if (!challenge) notFound()

    // Equipos inscritos
    const { data: registrations } = await supabase
        .from('challenge_registrations')
        .select(`
            team_id,
            teams (
                id,
                name,
                description,
                github_url,
                demo_url
            )
        `)
        .eq('challenge_id', challengeId)

    const teams = (registrations || [])
        .map((r: any) => r.teams)
        .filter(Boolean)

    // Mis evaluaciones existentes para este reto
    const { data: myEvalsRaw } = await supabase
        .from('evaluations')
        .select('id, team_id, jury_id, challenge_id')
        .eq('challenge_id', challengeId)
        .eq('jury_id', user.id)

    const myEvals: Evaluation[] = myEvalsRaw || []

    // Notas asociadas a mis evaluaciones
    const evalIds = myEvals.map(e => e.id)
    let myScores: Score[] = []
    if (evalIds.length > 0) {
        const { data } = await supabase
            .from('evaluation_scores')
            .select('evaluation_id, criterion_id, score')
            .in('evaluation_id', evalIds)
        myScores = data || []
    }

    // Criterios aplicables (específicos del reto + generales)
    const { data: criteriaRaw } = await supabase
        .from('evaluation_criteria')
        .select('id, name, weight, kind, challenge_id')
        .or(`challenge_id.eq.${challengeId},kind.eq.general`)

    const criteria: Criterion[] = criteriaRaw || []

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            <BackgroundGrid />
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <Link
                    href="/jurado"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver a mis retos
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{challenge.title}</h1>
                    <p className="text-gray-400 max-w-3xl">{challenge.description}</p>
                </div>

                <div className="flex items-center gap-2 mb-4 text-purple-400">
                    <Users className="w-5 h-5" />
                    <h2 className="text-xl font-bold">Equipos inscritos ({teams.length})</h2>
                </div>

                {teams.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center text-gray-400">
                        Aún no hay equipos inscritos a este reto.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3">
                        {teams.map((team: any) => {
                            const myEval = myEvals.find(e => e.team_id === team.id)
                            const status = evaluationStatus({
                                evaluation: myEval,
                                challengeId,
                                criteria,
                                scores: myScores,
                            })

                            return (
                                <Link
                                    key={team.id}
                                    href={`/jurado/${challengeId}/${team.id}`}
                                    className="group flex items-center justify-between p-5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold mb-1">{team.name}</h3>
                                        <p className="text-gray-400 text-sm line-clamp-1">
                                            {team.description || 'Sin descripción'}
                                        </p>
                                    </div>
                                    <StatusBadge status={status} />
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}

function StatusBadge({ status }: { status: 'completa' | 'parcial' | 'vacia' }) {
    if (status === 'completa') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-[#AAFF00]/10 border border-[#AAFF00]/30 text-[#AAFF00]">
                <CheckCircle2 className="w-3.5 h-3.5" /> Evaluado
            </span>
        )
    }
    if (status === 'parcial') {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-yellow-500/10 border border-yellow-500/30 text-yellow-400">
                <CircleDashed className="w-3.5 h-3.5" /> Parcial
            </span>
        )
    }
    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full bg-white/5 border border-white/10 text-gray-400">
            <Circle className="w-3.5 h-3.5" /> Pendiente
        </span>
    )
}

function BackgroundGrid() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0">
            <div
                className="w-full h-full"
                style={{
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px)
          `,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    )
}
