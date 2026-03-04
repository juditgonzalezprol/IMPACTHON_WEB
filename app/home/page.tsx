import Navbar from "@/components/navbar"
import { Calendar, FileText, Info, Clock, AlertTriangle, HomeIcon, CalendarDays, Megaphone } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function HomeInternoPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch announcements (pinned first, then newest)
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })

    // Fetch agenda
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            {/* Background Texture */}
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

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                        <HomeIcon className="text-[#AAFF00] w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Home del Participante</h1>
                        <p className="text-gray-400">Toda la información, anuncios y horarios en tiempo real.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* COLUMNA 1: NOTICIAS / AVISOS */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Megaphone className="text-[#AAFF00] w-6 h-6" /> Avisos y Noticias
                        </h2>

                        <div className="space-y-4">
                            {announcements && announcements.length > 0 ? announcements.map(ann => (
                                <article key={ann.id} className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${ann.is_pinned ? 'bg-[#AAFF00]/10 border-[#AAFF00]/40 shadow-[0_0_15px_rgba(170,255,0,0.1)]' : 'bg-white/5 border-white/10'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {ann.is_pinned && <Info className="text-[#AAFF00] w-4 h-4" />}
                                        <span suppressHydrationWarning className={`text-xs font-bold uppercase tracking-wider ${ann.is_pinned ? 'text-[#AAFF00]' : 'text-gray-500'}`}>
                                            {new Date(ann.created_at).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', dateStyle: 'long', timeStyle: 'short' })}
                                            {ann.is_pinned && " · FIJADO"}
                                        </span>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${ann.is_pinned ? 'text-white' : 'text-gray-300'}`}>{ann.title}</h3>
                                    <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
                                        {ann.content}
                                    </p>
                                </article>
                            )) : (
                                <div className="p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                                    No hay anuncios publicados actualmente.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA 2: AGENDA */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CalendarDays className="text-[#AAFF00] w-6 h-6" /> Agenda del Evento
                        </h2>

                        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">

                                {events && events.length > 0 ? events.map(event => (
                                    <div key={event.id} className="relative flex items-start gap-4 group">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white/20 bg-black text-white shadow shrink-0 shadow-[#AAFF00]/50 z-10 mt-1">
                                            <div className="w-2 h-2 rounded-full bg-[#AAFF00]"></div>
                                        </div>
                                        <div className="w-full">
                                            <div className="text-xs font-bold uppercase text-[#AAFF00] tracking-wider mb-1">
                                                {new Date(event.start_time).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                            <div className="text-white font-bold mb-1">{event.title}</div>
                                            {event.description && <div className="text-gray-400 text-sm mb-1">{event.description}</div>}
                                            {event.location && <div className="text-[#AAFF00]/70 text-xs font-mono bg-[#AAFF00]/10 inline-block px-2 py-1 rounded">📍 {event.location}</div>}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="pl-8 text-gray-400">
                                        La agenda aún no está disponible.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
