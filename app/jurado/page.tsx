import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { Gavel, Target, ChevronRight } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function JuradoDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Jurado' && profile?.role !== 'Organizador') {
        notFound()
    }

    // Retos asignados al juez. Si es Organizador, ve todos los que tengan jurado.
    let assignedChallenges: { id: string; title: string; description: string }[] = []

    if (profile?.role === 'Organizador') {
        const { data } = await supabase
            .from('challenges')
            .select('id, title, description')
            .eq('has_jury', true)
            .order('created_at')
        assignedChallenges = data || []
    } else {
        const { data } = await supabase
            .from('jury_assignments')
            .select('challenges (id, title, description)')
            .eq('jury_id', user.id)
        assignedChallenges = (data || [])
            .map((row: any) => row.challenges)
            .filter(Boolean)
    }

    // Para cada reto, contar equipos inscritos y evaluaciones ya hechas por mí
    const challengeStats = await Promise.all(
        assignedChallenges.map(async (ch) => {
            const { count: teamsCount } = await supabase
                .from('challenge_registrations')
                .select('team_id', { count: 'exact', head: true })
                .eq('challenge_id', ch.id)

            const { count: myEvalsCount } = await supabase
                .from('evaluations')
                .select('id', { count: 'exact', head: true })
                .eq('challenge_id', ch.id)
                .eq('jury_id', user.id)

            return { ...ch, teamsCount: teamsCount || 0, myEvalsCount: myEvalsCount || 0 }
        })
    )

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            <BackgroundGrid />
            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Gavel className="text-purple-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard del Jurado</h1>
                        <p className="text-gray-400">
                            Hola, {profile?.full_name}. Selecciona un reto para evaluar a sus equipos.
                        </p>
                    </div>
                </div>

                {challengeStats.length === 0 ? (
                    <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center">
                        <p className="text-gray-400">
                            Aún no estás asignado a ningún reto. Habla con un Organizador.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {challengeStats.map((ch) => {
                            const completed = ch.myEvalsCount
                            const total = ch.teamsCount
                            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

                            return (
                                <Link
                                    key={ch.id}
                                    href={`/jurado/${ch.id}`}
                                    className="group p-6 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-purple-500/30 transition-all"
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <Target className="w-5 h-5 text-purple-400" />
                                            <h3 className="text-xl font-bold">{ch.title}</h3>
                                        </div>
                                        <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                    </div>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{ch.description}</p>

                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-gray-400">
                                            <strong className="text-white">{completed}</strong> / {total} equipos evaluados
                                        </span>
                                        <span className="text-purple-400 font-bold">{pct}%</span>
                                    </div>
                                    <div className="mt-2 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500 transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
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
                    backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px),
            linear-gradient(45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(170, 255, 0, 0.02) 25%, transparent 25%)
          `,
                    backgroundSize: '50px 50px, 100px 100px, 100px 100px',
                    backgroundPosition: '0 0, 0 0, 10px 10px',
                    opacity: 1,
                }}
            />
        </div>
    )
}
