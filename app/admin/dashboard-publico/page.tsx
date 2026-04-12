import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Monitor } from "lucide-react"
import DashboardSettingsForm from "@/components/admin/dashboard-settings-form"

export const dynamic = "force-dynamic"

export default async function AdminDashboardPublicoPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Organizador') notFound()

    const { data: settings } = await supabase
        .from('public_dashboard_settings')
        .select('pin, is_open')
        .eq('id', 1)
        .single()

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

            <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#AAFF00] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" /> Volver al panel admin
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Monitor className="text-cyan-400 w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Dashboard público</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Configura el PIN de acceso a <code className="text-cyan-400">/dashboard-publico</code>.
                        </p>
                    </div>
                </div>

                <DashboardSettingsForm
                    initialPin={settings?.pin || ''}
                    initialIsOpen={settings?.is_open ?? true}
                />
            </div>
        </main>
    )
}
