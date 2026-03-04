import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Github, Linkedin, Mail, ExternalLink, Users, GraduationCap } from "lucide-react"
import EditProfileForm from "@/components/profile-edit-form"

export default async function PerfilPage(
    props: {
        params: Promise<{ id: string }>
    }
) {
    const params = await props.params
    const userId = params.id
    const supabase = await createClient()

    // Am I looking at my own profile?
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    const isMyProfile = currentUser?.id === userId

    // Fetch target user profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

    if (!profile) {
        notFound()
    }

    // Fetch the user's team if any
    const { data: teamInfo } = await supabase
        .from('team_members')
        .select(`
      teams (
        id,
        name,
        description
      )
    `)
        .eq('user_id', userId)
        .single()

    const team = teamInfo?.teams

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

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">

                {/* Profile Card */}
                <div className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(170,255,0,0.05)]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#AAFF00]/10 rounded-full blur-[80px] -z-10" />

                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Avatar block */}
                        <div className="flex-shrink-0">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#121212] bg-gray-800 flex items-center justify-center uppercase font-bold text-4xl text-[#AAFF00] shadow-xl relative group">
                                {profile.full_name?.substring(0, 2)}
                            </div>
                        </div>

                        {/* Info Block */}
                        <div className="flex-1 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
                                        {profile.full_name}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-block px-3 py-1 bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20 rounded-full text-sm font-medium">
                                            {profile.role}
                                        </span>
                                        {profile.needs_credits && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-sm font-medium" title="Solicita créditos ECTS">
                                                <GraduationCap className="w-4 h-4" /> Créditos ECTS
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {isMyProfile && (
                                    <EditProfileForm profile={profile} />
                                )}
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-semibold mb-2">Sobre mí / Bio</h3>
                                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {profile.bio || "Este usuario aún no ha escrito su biografía."}
                                </p>
                            </div>

                            {/* Links & Contact */}
                            <div className="flex flex-wrap gap-4 pt-4">
                                {profile.linkedin_url && (
                                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors">
                                        <Linkedin className="w-5 h-5" /> <span className="text-sm">LinkedIn</span>
                                    </a>
                                )}
                                {profile.github_url && (
                                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                                        <Github className="w-5 h-5" /> <span className="text-sm">GitHub</span>
                                    </a>
                                )}
                                {profile.contact_email && (
                                    <a href={`mailto:${profile.contact_email}`} className="flex items-center gap-2 text-gray-400 hover:text-[#AAFF00] transition-colors">
                                        <Mail className="w-5 h-5" /> <span className="text-sm">Email</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                {team ? (
                    <div className="mt-8 p-6 md:p-8 rounded-3xl border border-[#AAFF00]/20 bg-[#AAFF00]/5 backdrop-blur-sm">
                        <h3 className="text-sm uppercase tracking-widest text-[#AAFF00] font-semibold mb-3 flex items-center gap-2">
                            <Users className="w-4 h-4" /> Equipo Actual
                        </h3>
                        <h4 className="text-2xl font-bold text-white mb-2">{(team as any)?.name || (team as any)?.[0]?.name}</h4>
                        <p className="text-gray-300 text-sm md:text-base">
                            {(team as any)?.description || (team as any)?.[0]?.description || "Sin descripción de equipo"}
                        </p>
                        <a href="/equipos" className="inline-flex mt-4 items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
                            Ver en el directorio <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                ) : (
                    <div className="mt-8 p-6 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm text-center">
                        <p className="text-gray-500 italic">No pertenece a ningún equipo actualmente.</p>
                    </div>
                )}

            </div>
        </main>
    )
}
