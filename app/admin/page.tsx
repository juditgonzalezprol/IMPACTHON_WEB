import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Users, LayoutDashboard, ShieldCheck, Github, ExternalLink, Sliders, Gavel, Monitor } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify Organizer Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Organizador') {
        notFound() // Show 404 to non-admins for security
    }

    // Fetch All Users
    const { data: allUsers } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    // Fetch All Teams with Members
    const { data: allTeams } = await supabase
        .from('teams')
        .select(`
            id,
            name,
            description,
            github_url,
            demo_url,
            team_members (
                profiles (
                    id,
                    full_name
                )
            )
        `)
        .order('created_at', { ascending: false })

    const totalUsers = allUsers?.length || 0
    const totalTeams = allTeams?.length || 0
    const totalProjects = allTeams?.filter(t => t.github_url || t.demo_url).length || 0

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
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                        <ShieldCheck className="text-[#AAFF00] w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="text-gray-400">Moderación y gestión de usuarios y equipos.</p>
                    </div>
                </div>

                {/* Quick links to new admin sections */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <Link
                        href="/admin/jurados"
                        className="group flex items-center gap-3 p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 hover:bg-purple-500/10 transition-all"
                    >
                        <div className="w-11 h-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
                            <Gavel className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Jurados</p>
                            <p className="text-xs text-gray-400">Asignar jueces a retos</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/criterios"
                        className="group flex items-center gap-3 p-5 rounded-2xl border border-[#AAFF00]/20 bg-[#AAFF00]/5 hover:bg-[#AAFF00]/10 transition-all"
                    >
                        <div className="w-11 h-11 rounded-xl bg-[#AAFF00]/20 flex items-center justify-center">
                            <Sliders className="w-5 h-5 text-[#AAFF00]" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Criterios</p>
                            <p className="text-xs text-gray-400">Editar criterios y pesos</p>
                        </div>
                    </Link>
                    <Link
                        href="/admin/dashboard-publico"
                        className="group flex items-center gap-3 p-5 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all"
                    >
                        <div className="w-11 h-11 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                            <Monitor className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                            <p className="font-bold text-white">Dashboard público</p>
                            <p className="text-xs text-gray-400">PIN y visibilidad</p>
                        </div>
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-gray-400 font-medium mb-1">Total Usuarios</h3>
                        <p className="text-4xl font-bold text-white">{totalUsers}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                        <h3 className="text-gray-400 font-medium mb-1">Total Equipos</h3>
                        <p className="text-4xl font-bold text-white">{totalTeams}</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-[#AAFF00]/5 border border-[#AAFF00]/20">
                        <h3 className="text-[#AAFF00] font-medium mb-1">Proyectos Entregados</h3>
                        <p className="text-4xl font-bold text-[#AAFF00]">{totalProjects}</p>
                    </div>
                </div>

                {/* Teams List */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <LayoutDashboard className="w-6 h-6 text-[#AAFF00]" /> Todos los Equipos
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {allTeams?.map(team => (
                        <div key={team.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold">{team.name}</h3>
                                <span className="text-xs bg-white/10 px-2 py-1 rounded-md text-gray-300">
                                    {team.team_members?.length || 0} / 6 ints.
                                </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2">{team.description || "Sin descripción"}</p>

                            <div className="flex flex-col gap-2">
                                {team.github_url && (
                                    <a href={team.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-[#121212] py-2 px-3 rounded-md hover:bg-white/10 text-gray-300 border border-white/5">
                                        <Github size={14} /> Repositorio
                                    </a>
                                )}
                                {team.demo_url && (
                                    <a href={team.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs bg-[#121212] py-2 px-3 rounded-md hover:bg-white/10 text-[#00E5FF] border border-white/5">
                                        <ExternalLink size={14} /> Link Presentación
                                    </a>
                                )}
                                {(!team.github_url && !team.demo_url) && (
                                    <span className="text-xs text-red-400 italic">Sin entregas por ahora</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Users List */}
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Users className="w-6 h-6 text-[#AAFF00]" /> Todos los Usuarios
                </h2>

                <div className="rounded-2xl border border-white/10 overflow-hidden bg-black/50 backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-300">
                            <thead className="bg-white/5 text-xs uppercase font-semibold text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Nombre Completo</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">Email Contacto</th>
                                    <th className="px-6 py-4 border-l border-white/10 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {allUsers?.map(u => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{u.full_name}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.role === 'Organizador' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    u.role === 'Jurado' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' :
                                                        u.role === 'Staff' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                            'bg-[#AAFF00]/10 text-[#AAFF00] border border-[#AAFF00]/20'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-400">{u.contact_email || '-'}</td>
                                        <td className="px-6 py-4 border-l border-white/10 text-center">
                                            <a href={`/perfil/${u.id}`} target="_blank" className="text-[#AAFF00] hover:underline text-xs">
                                                Ver Perfil
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </main>
    )
}
