import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Gavel } from "lucide-react"
import JuryAssignmentMatrix from "@/components/admin/jury-assignment-matrix"

export const dynamic = "force-dynamic"

export default async function AdminJuradosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Organizador') notFound()

    const [{ data: juries }, { data: challenges }, { data: assignments }] = await Promise.all([
        supabase
            .from('profiles')
            .select('id, full_name, contact_email')
            .eq('role', 'Jurado')
            .order('full_name'),
        supabase
            .from('challenges')
            .select('id, title')
            .eq('has_jury', true)
            .order('created_at'),
        supabase
            .from('jury_assignments')
            .select('jury_id, challenge_id'),
    ])

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#AAFF00] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al panel admin
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                        <Gavel className="text-purple-400 w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Asignación de jurados</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Marca a qué retos está asignado cada juez. Cada juez puede estar en uno o varios retos.
                        </p>
                    </div>
                </div>

                {(!juries || juries.length === 0) ? (
                    <div className="p-8 rounded-2xl border border-white/10 bg-white/5 text-center text-gray-400">
                        Aún no hay usuarios con rol "Jurado". Cámbiales el rol desde el panel admin.
                    </div>
                ) : (
                    <JuryAssignmentMatrix
                        juries={juries}
                        challenges={challenges || []}
                        assignments={assignments || []}
                    />
                )}
            </div>
        </main>
    )
}
