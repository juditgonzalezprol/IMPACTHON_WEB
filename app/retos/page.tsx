import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Target, Package, Users } from "lucide-react"
import ChallengeCard from "@/components/challenges/challenge-card"
import ProjectForm from "@/components/deliverables/project-form"
import DeliverableList from "@/components/deliverables/deliverable-list"

export const dynamic = "force-dynamic"

export default async function RetosPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.full_name === 'Usuario Nuevo') {
        redirect('/onboarding')
    }

    // Fetch challenges
    const { data: challenges } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at')

    // Fetch user's team membership first (needed for challenge registrations)
    const { data: membership } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id)
        .single()

    const myTeamId = membership?.team_id || null

    // Fetch team's registrations
    let myRegisteredIds = new Set<string>()
    if (myTeamId) {
        const { data: myRegistrations } = await supabase
            .from('challenge_registrations')
            .select('challenge_id')
            .eq('team_id', myTeamId)

        myRegisteredIds = new Set(myRegistrations?.map(r => r.challenge_id) || [])
    }

    // Fetch all registrations for counts (count teams, not users)
    const { data: allRegistrations } = await supabase
        .from('challenge_registrations')
        .select('challenge_id')

    const registrationCounts: Record<string, number> = {}
    allRegistrations?.forEach(r => {
        registrationCounts[r.challenge_id] = (registrationCounts[r.challenge_id] || 0) + 1
    })

    // Fetch team details, members, and deliverables
    let team = null
    let teamMembers: any[] = []
    let deliverables: any[] = []

    if (myTeamId) {
        const { data: teamData } = await supabase
            .from('teams')
            .select('*')
            .eq('id', myTeamId)
            .single()
        team = teamData

        const { data: members } = await supabase
            .from('team_members')
            .select('profiles (id, full_name, avatar_url, role)')
            .eq('team_id', myTeamId)

        teamMembers = members || []

        const { data: dels } = await supabase
            .from('deliverables')
            .select('*')
            .eq('team_id', myTeamId)
            .order('created_at')

        deliverables = dels || []
    }

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

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 space-y-16">

                {/* ============ SECCIÓN 1: RETOS ============ */}
                <section>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                            <Target className="text-[#AAFF00] w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-[#AAFF00]">Retos</h1>
                            <p className="text-gray-400 mt-1">
                                Apúntate a los retos en los que quieras participar. Puedes inscribirte en tantos como quieras.
                            </p>
                        </div>
                    </div>

                    {challenges && challenges.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {challenges.map((challenge) => (
                                <ChallengeCard
                                    key={challenge.id}
                                    challenge={challenge}
                                    teamId={myTeamId}
                                    isRegistered={myRegisteredIds.has(challenge.id)}
                                    registrationCount={registrationCounts[challenge.id] || 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                            Los retos aún no están disponibles.
                        </div>
                    )}
                </section>

                {/* ============ SECCIÓN 2: MI EQUIPO ============ */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                            <Users className="text-[#AAFF00] w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Mi equipo</h2>
                        </div>
                    </div>

                    {team ? (
                        <div className="p-6 rounded-2xl border border-[#AAFF00]/30 bg-white/5 backdrop-blur-sm">
                            <h3 className="text-xl font-bold text-white mb-3">{team.name}</h3>
                            <div className="flex flex-wrap gap-2">
                                {teamMembers.map((tm: any) => {
                                    const p = tm.profiles
                                    return (
                                        <span
                                            key={p.id}
                                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ${p.id === user.id
                                                ? "bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/30 font-medium"
                                                : "bg-white/10 text-gray-300 border border-white/10"
                                                }`}
                                        >
                                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold">
                                                {p.full_name.substring(0, 2).toUpperCase()}
                                            </span>
                                            {p.full_name}
                                            {p.id === user.id && " (tú)"}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-white/10 text-gray-400">
                            <p>No perteneces a ningún equipo todavía.</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Ve a <a href="/equipos" className="text-[#AAFF00] hover:underline">Equipos</a> para unirte o crear uno.
                            </p>
                        </div>
                    )}
                </section>

                {/* ============ SECCIÓN 3: ENTREGABLES ============ */}
                <section>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                            <Package className="text-[#AAFF00] w-7 h-7" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Entregables</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                El repositorio es <strong className="text-red-400">obligatorio</strong>. Después, podéis presentar todo lo que
                                consideréis relevante o útil para el jurado: presentaciones, vídeos, prototipos, documentación...
                            </p>
                        </div>
                    </div>

                    {team ? (
                        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 space-y-8">
                            <ProjectForm
                                teamId={team.id}
                                initialDescription={team.description}
                                initialGithubUrl={team.github_url}
                            />
                            <hr className="border-white/10" />
                            <DeliverableList
                                teamId={team.id}
                                deliverables={deliverables}
                            />
                        </div>
                    ) : (
                        <div className="p-8 text-center rounded-2xl border-2 border-dashed border-white/10 text-gray-400">
                            <p>Necesitas pertenecer a un equipo para gestionar entregables.</p>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}
