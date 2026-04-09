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

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                        <HomeIcon className="text-[#AAFF00] w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Home del Participante</h1>
                        <p className="text-gray-400">Toda la información, anuncios y horarios en tiempo real.</p>
                    </div>
                </div>

                {/* AVISOS - Ancho completo arriba */}
                <div className="space-y-4 mb-10">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Megaphone className="text-[#AAFF00] w-6 h-6" /> Avisos y Noticias
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed line-clamp-3">
                                    {ann.content}
                                </p>
                            </article>
                        )) : (
                            <div className="col-span-full p-8 text-center rounded-2xl bg-white/5 border border-white/10 text-gray-400">
                                No hay anuncios publicados actualmente.
                            </div>
                        )}
                    </div>
                </div>

                {/* AGENDA - Ancho completo abajo */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarDays className="text-[#AAFF00] w-6 h-6" /> Agenda del Evento
                    </h2>

                    {/* Barra constante de HACKING */}
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-[#AAFF00]/20 via-[#AAFF00]/10 to-[#AAFF00]/20 border border-[#AAFF00]/40 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNzAsMjU1LDAsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
                        <div className="relative flex items-center gap-4">
                            <div className="w-4 h-4 rounded-full bg-[#AAFF00] animate-pulse"></div>
                            <div>
                                <div className="text-[#AAFF00] font-bold text-xl">HACKING EN CURSO</div>
                                <div className="text-[#AAFF00]/70 text-sm">Trabajo continuo en tu proyecto · 48h non-stop</div>
                            </div>
                        </div>
                    </div>

                    {/* Leyenda */}
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                            <span className="text-gray-400">Pausas / Comidas</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            <span className="text-gray-400">Formación Emprendimiento</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            <span className="text-gray-400">Formación Programación</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-[#AAFF00]"></div>
                            <span className="text-gray-400">Eventos clave</span>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md relative overflow-hidden">
                        {/* Línea vertical continua de hacking */}
                        <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-[#AAFF00]/60 via-[#AAFF00]/30 to-[#AAFF00]/60"></div>

                        <div className="p-8 space-y-6">
                            {events && events.length > 0 ? (() => {
                                // Agrupar eventos por hora de inicio
                                const groupedByTime: Record<string, typeof events> = {}
                                events.forEach(event => {
                                    const timeKey = new Date(event.start_time).toISOString()
                                    if (!groupedByTime[timeKey]) groupedByTime[timeKey] = []
                                    groupedByTime[timeKey].push(event)
                                })

                                return Object.entries(groupedByTime).map(([timeKey, timeEvents]) => {
                                    const emprendimientoEvents = timeEvents.filter(e => e.track === 'emprendimiento')
                                    const programacionEvents = timeEvents.filter(e => e.track === 'programacion')
                                    const generalEvents = timeEvents.filter(e => !e.track || e.track === 'todos')

                                    // Detectar si es una pausa/comida
                                    const isPause = generalEvents.some(e =>
                                        e.title.toLowerCase().includes('comida') ||
                                        e.title.toLowerCase().includes('cena') ||
                                        e.title.toLowerCase().includes('desayuno') ||
                                        e.title.toLowerCase().includes('kebab') ||
                                        e.title.toLowerCase().includes('pizza')
                                    )

                                    const hasParallelTracks = emprendimientoEvents.length > 0 || programacionEvents.length > 0

                                    return (
                                        <div key={timeKey} className="relative pl-12">
                                            {/* Nodo en la línea */}
                                            <div className={`absolute left-[26px] w-5 h-5 rounded-full border-2 ${
                                                isPause
                                                    ? 'bg-orange-500/20 border-orange-500'
                                                    : hasParallelTracks
                                                        ? 'bg-white/10 border-white/40'
                                                        : 'bg-[#AAFF00]/20 border-[#AAFF00]'
                                            } -translate-x-1/2 mt-1 z-10`}>
                                                <div className={`absolute inset-1 rounded-full ${
                                                    isPause ? 'bg-orange-500' : hasParallelTracks ? 'bg-white/60' : 'bg-[#AAFF00]'
                                                }`}></div>
                                            </div>

                                            {/* Hora */}
                                            <div className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-3">
                                                {new Date(timeKey).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', hour: '2-digit', minute: '2-digit' })}
                                            </div>

                                            {/* Eventos generales (pausas o eventos clave) */}
                                            {generalEvents.map(event => (
                                                <div key={event.id} className={`mb-3 p-4 rounded-xl ${
                                                    isPause
                                                        ? 'bg-orange-500/10 border border-orange-500/30'
                                                        : 'bg-[#AAFF00]/10 border border-[#AAFF00]/30'
                                                }`}>
                                                    <div className={`font-bold text-lg ${isPause ? 'text-orange-300' : 'text-white'}`}>{event.title}</div>
                                                    {event.description && <div className="text-gray-400 text-sm mt-1">{event.description}</div>}
                                                    {event.location && <div className={`text-sm font-mono mt-2 inline-block px-3 py-1 rounded ${
                                                        isPause ? 'bg-orange-500/10 text-orange-300/70' : 'bg-[#AAFF00]/10 text-[#AAFF00]/70'
                                                    }`}>📍 {event.location}</div>}
                                                </div>
                                            ))}

                                            {/* Tracks paralelos */}
                                            {hasParallelTracks && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {/* Emprendimiento */}
                                                    <div>
                                                        {emprendimientoEvents.map(event => (
                                                            <div key={event.id} className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                                                                    <span className="text-xs font-bold uppercase text-purple-400">Emprendimiento</span>
                                                                </div>
                                                                <div className="text-white font-bold">{event.title}</div>
                                                                {event.description && <div className="text-gray-400 text-sm mt-1">{event.description}</div>}
                                                                {event.location && <div className="text-purple-300/60 text-sm mt-2">📍 {event.location}</div>}
                                                            </div>
                                                        ))}
                                                        {emprendimientoEvents.length === 0 && (
                                                            <div className="p-4 rounded-xl border border-dashed border-purple-500/30 text-center bg-purple-500/5">
                                                                <span className="text-purple-400/60 text-sm">Hacking en proyecto 💻</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {/* Programación */}
                                                    <div>
                                                        {programacionEvents.map(event => (
                                                            <div key={event.id} className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                                                                    <span className="text-xs font-bold uppercase text-blue-400">Programación</span>
                                                                </div>
                                                                <div className="text-white font-bold">{event.title}</div>
                                                                {event.description && <div className="text-gray-400 text-sm mt-1">{event.description}</div>}
                                                                {event.location && <div className="text-blue-300/60 text-sm mt-2">📍 {event.location}</div>}
                                                            </div>
                                                        ))}
                                                        {programacionEvents.length === 0 && (
                                                            <div className="p-4 rounded-xl border border-dashed border-blue-500/30 text-center bg-blue-500/5">
                                                                <span className="text-blue-400/60 text-sm">Hacking en proyecto 💻</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })
                            })() : (
                                <div className="text-gray-400 text-center py-8">
                                    La agenda aún no está disponible.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
