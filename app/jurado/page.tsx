import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Gavel, Github, ExternalLink, Trophy } from "lucide-react"
import EvaluationForm from "@/components/evaluation-form"

export const dynamic = "force-dynamic"

export default async function JuradoDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify Jurado or Organizador Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Jurado' && profile?.role !== 'Organizador') {
        notFound() // Show 404 to unauthorized users
    }

    // Fetch all teams that have either a GitHub URL or a Demo URL
    const { data: teamsWithProjects } = await supabase
        .from('teams')
        .select(`
            id,
            name,
            description,
            github_url,
            demo_url,
            evaluations (
                id,
                jury_id,
                score_idea,
                score_execution,
                score_presentation,
                feedback
            )
        `)
        .or('github_url.not.is.null,demo_url.not.is.null') // Only teams with submissions
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            {/* Background */}
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

            <Navbar />

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Gavel className="text-purple-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard del Jurado</h1>
                        <p className="text-gray-400">Revisa y evalúa los proyectos entregados por los equipos.</p>
                    </div>
                </div>

                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <Trophy className="text-[#AAFF00] w-6 h-6" />
                        <h2 className="text-2xl font-bold">Proyectos a Evaluar ({teamsWithProjects?.length || 0})</h2>
                    </div>

                    {teamsWithProjects?.length === 0 ? (
                        <div className="p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm text-center">
                            <p className="text-gray-500 italic">Todavía no hay ningún proyecto entregado para evaluar.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-8">
                            {teamsWithProjects?.map((team) => {
                                // Find if current user has already evaluated this team
                                const myEvaluation = team.evaluations?.find(e => e.jury_id === user.id)

                                return (
                                    <div key={team.id} className="p-6 md:p-8 rounded-3xl border border-white/10 bg-white/5 shadow-lg flex flex-col md:flex-row gap-8">

                                        {/* Project Info */}
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-white mb-2">{team.name}</h3>
                                                {myEvaluation && (
                                                    <span className="px-2 py-1 bg-[#AAFF00]/10 border border-[#AAFF00]/20 text-[#AAFF00] text-xs font-bold rounded-md whitespace-nowrap">
                                                        Ya Evaluado ✅
                                                    </span>
                                                )}
                                            </div>

                                            <p className="text-gray-400 text-sm mb-6 whitespace-pre-wrap">{team.description}</p>

                                            <div className="flex flex-wrap gap-3">
                                                {team.github_url && (
                                                    <a href={team.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-black hover:bg-white/10 px-4 py-2 rounded-lg text-gray-300 border border-white/10 transition-colors">
                                                        <Github size={16} /> Ver Repositorio
                                                    </a>
                                                )}
                                                {team.demo_url && (
                                                    <a href={team.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm bg-[#00E5FF]/10 border border-[#00E5FF]/20 hover:bg-[#00E5FF]/20 px-4 py-2 rounded-lg text-[#00E5FF] transition-colors">
                                                        <ExternalLink size={16} /> Ver Presentación/Demo
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        {/* Evaluation Form */}
                                        <div className="w-full md:w-80 flex-shrink-0 bg-black/40 p-5 rounded-2xl border border-white/5">
                                            <EvaluationForm teamId={team.id} existingEvaluation={myEvaluation} />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

            </div>
        </main>
    )
}
