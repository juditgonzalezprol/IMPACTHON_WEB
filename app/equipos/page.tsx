import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import TeamCard from "@/components/teams/team-card"
import CreateTeamForm from "@/components/teams/create-team-form"
import { Button } from "@/components/ui/button"

export default async function EquiposPage() {
    const supabase = await createClient()

    // 1. Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. Fetch User Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.full_name === 'Usuario Nuevo') {
        redirect('/onboarding')
    }

    // 3. Fetch all teams along with their members
    const { data: teams, error } = await supabase
        .from('teams')
        .select(`
      id,
      name,
      description,
      team_members (
        profiles (
          id,
          full_name,
          role,
          avatar_url
        )
      )
    `)
        .order('created_at', { ascending: false })

    // 4. Find if the current user is in a team
    let myTeamId = null
    if (teams) {
        for (const team of teams) {
            const isMember = team.team_members.some((tm: any) => tm.profiles?.id === user.id)
            if (isMember) {
                myTeamId = team.id
                break
            }
        }
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

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#AAFF00]">
                            Equipos
                        </h1>
                        <p className="text-gray-300 max-w-2xl text-lg">
                            Únete a un equipo existente o crea el tuyo propio para participar en el hackathon.
                        </p>
                    </div>

                    {!myTeamId && (
                        <CreateTeamForm />
                    )}
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-8">
                        Error cargando los equipos: {error.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teams?.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            isMyTeam={myTeamId === team.id}
                            userIsInAnotherTeam={myTeamId !== null && myTeamId !== team.id}
                        />
                    ))}

                    {teams?.length === 0 && (
                        <div className="col-span-full py-20 text-center border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm">
                            <p className="text-gray-400 text-lg">Aún no hay equipos creados. ¡Sé el primero!</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}
