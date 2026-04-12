import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Sliders } from "lucide-react"
import CriteriaAdmin from "@/components/admin/criteria-admin"

export const dynamic = "force-dynamic"

export default async function AdminCriteriosPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Organizador') notFound()

    const [{ data: challenges }, { data: criteria }] = await Promise.all([
        supabase.from('challenges').select('id, title').eq('has_jury', true).order('created_at'),
        supabase
            .from('evaluation_criteria')
            .select('id, name, description, weight, kind, challenge_id, order_index')
            .order('kind')
            .order('order_index'),
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

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#AAFF00] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al panel admin
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                        <Sliders className="text-[#AAFF00] w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Criterios de evaluación</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Gestiona los criterios específicos por reto y los criterios generales comunes.
                        </p>
                    </div>
                </div>

                <CriteriaAdmin
                    challenges={challenges || []}
                    criteria={criteria || []}
                />
            </div>
        </main>
    )
}
