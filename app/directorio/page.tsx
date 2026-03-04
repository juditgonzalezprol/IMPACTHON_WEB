import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { Mail, ShieldCheck, Star, Users } from "lucide-react"

export default async function DirectorioPage() {
    const supabase = await createClient()

    // Fetch all non-attendee profiles
    const { data: contacts, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, avatar_url, contact_email, bio')
        .in('role', ['Staff', 'Organizador', 'Jurado'])
        .order('role')

    // Group by role for display
    const groupedContacts = contacts?.reduce((acc: any, person: any) => {
        if (!acc[person.role]) acc[person.role] = []
        acc[person.role].push(person)
        return acc
    }, {}) || {}

    const getRoleIcon = (role: string) => {
        if (role === 'Organizador') return <Star className="w-5 h-5 text-yellow-400" />
        if (role === 'Jurado') return <ShieldCheck className="w-5 h-5 text-purple-400" />
        return <Users className="w-5 h-5 text-blue-400" />
    }

    const roleOrder = ['Organizador', 'Jurado', 'Staff']

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
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
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[#AAFF00]">
                        Directorio de Contacto
                    </h1>
                    <p className="text-gray-300 max-w-2xl text-lg mx-auto md:mx-0">
                        Conoce al equipo detrás del hackathon, organizadores y los miembros del jurado.
                    </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 mb-8">
                        Error cargando los perfiles: {error.message}
                    </div>
                )}

                {roleOrder.map(role => {
                    const group = groupedContacts[role]
                    if (!group || group.length === 0) return null

                    return (
                        <div key={role} className="mb-16">
                            <h2 className="text-2xl font-bold text-white border-b border-white/20 pb-2 mb-6 flex items-center gap-3">
                                {getRoleIcon(role)} {role}s
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {group.map((person: any) => (
                                    <div key={person.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors group">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-full bg-gray-800 border-2 border-transparent group-hover:border-[#AAFF00] transition-colors flex items-center justify-center font-bold text-xl text-[#AAFF00] uppercase cursor-pointer"
                                                title={person.full_name}
                                            >
                                                <a href={`/perfil/${person.id}`}>{person.full_name.substring(0, 2)}</a>
                                            </div>
                                            <div>
                                                <a href={`/perfil/${person.id}`} className="hover:text-[#AAFF00] transition-colors">
                                                    <h3 className="text-lg font-bold text-white">{person.full_name}</h3>
                                                </a>
                                                <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                                                    {person.role}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
                                            {person.bio || "Sin biografía definida."}
                                        </p>

                                        {person.contact_email && (
                                            <a
                                                href={`mailto:${person.contact_email}`}
                                                className="inline-flex items-center gap-2 text-sm text-[#AAFF00] hover:text-[#BBFF33] transition-colors bg-[#AAFF00]/10 px-3 py-1.5 rounded-lg border border-[#AAFF00]/20"
                                            >
                                                <Mail className="w-4 h-4" /> Contactar
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })}

                {Object.keys(groupedContacts).length === 0 && !error && (
                    <div className="p-12 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                        <p className="text-gray-400">Aún no hay organizadores o jurado registrados.</p>
                    </div>
                )}
            </div>
        </main>
    )
}
