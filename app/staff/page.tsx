import Navbar from "@/components/navbar"
import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { CalendarDays, Megaphone, Trash2, ShieldAlert } from "lucide-react"
import { createEvent, deleteEvent, createAnnouncement, deleteAnnouncement } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const dynamic = "force-dynamic"

export default async function StaffDashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Verify Staff or Organizador Role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Staff' && profile?.role !== 'Organizador') {
        notFound() // Show 404 to non-staff
    }

    // Fetch Events (Agenda)
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true })

    // Fetch Announcements
    const { data: announcements } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white pb-20">
            <Navbar />

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <ShieldAlert className="text-blue-400 w-8 h-8" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold">Panel de Staff</h1>
                        <p className="text-gray-400">Gestiona la agenda pública del evento y publica avisos o noticias en directo.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* COLUMNA 1: AGENDA */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <CalendarDays className="text-[#AAFF00] w-6 h-6" /> Gestión de Agenda
                        </h2>

                        {/* Event Creation Form */}
                        <form action={async (fd) => { "use server"; await createEvent(fd); }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-lg font-semibold text-[#AAFF00]">Añadir Nuevo Evento</h3>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Título de la Charla / Actividad *</label>
                                <Input name="title" required className="bg-black/50 border-white/20" placeholder="Ej: Ceremonia de Clausura" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Descripción (Opcional)</label>
                                <Textarea name="description" className="bg-black/50 border-white/20" placeholder="Detalles de la actividad..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Fecha/Hora Inicio *</label>
                                    <Input name="start_time" type="datetime-local" required className="bg-black/50 border-white/20" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-gray-400">Fecha/Hora Fin *</label>
                                    <Input name="end_time" type="datetime-local" required className="bg-black/50 border-white/20" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Ubicación *</label>
                                <Input name="location" required className="bg-black/50 border-white/20" placeholder="Ej: Auditorio Principal" />
                            </div>
                            <Button type="submit" className="w-full bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold">
                                Publicar Evento en Agenda
                            </Button>
                        </form>

                        {/* Events List */}
                        <div className="space-y-3">
                            {events?.map(event => (
                                <div key={event.id} className="p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition flex justify-between items-center group">
                                    <div>
                                        <h4 className="font-bold">{event.title}</h4>
                                        <p className="text-xs text-[#AAFF00]">{new Date(event.start_time).toLocaleString('es-ES')} - {event.location}</p>
                                    </div>
                                    <form action={async (fd) => { "use server"; await deleteEvent(fd); }}>
                                        <input type="hidden" name="id" value={event.id} />
                                        <button type="submit" className="p-2 text-red-400 hover:bg-red-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* COLUMNA 2: NOTICIAS / AVISOS */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Megaphone className="text-[#AAFF00] w-6 h-6" /> Avisos y Noticias (Megáfono)
                        </h2>

                        {/* Announcement Creation Form */}
                        <form action={async (fd) => { "use server"; await createAnnouncement(fd); }} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-lg font-semibold text-[#AAFF00]">Publicar Aviso</h3>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Titular del Aviso *</label>
                                <Input name="title" required className="bg-black/50 border-white/20" placeholder="Ej: ¡La comida ya está servida!" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs text-gray-400">Mensaje *</label>
                                <Textarea name="content" required className="bg-black/50 border-white/20 min-h-[100px]" placeholder="Escribe el anuncio para todos los participantes..." />
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" name="is_pinned" id="is_pinned" value="true" className="w-4 h-4 rounded text-[#AAFF00] focus:ring-[#AAFF00] bg-black/50 border-white/20" />
                                <label htmlFor="is_pinned" className="text-sm text-gray-300 cursor-pointer">Destacar con chincheta (Fijar arriba)</label>
                            </div>
                            <Button type="submit" className="w-full bg-[#00E5FF] text-black hover:bg-[#00BBDD] font-bold">
                                Enviar Aviso Inmediato
                            </Button>
                        </form>

                        {/* Announcements List */}
                        <div className="space-y-3">
                            {announcements?.map(ann => (
                                <div key={ann.id} className={`p-4 rounded-xl border transition flex justify-between items-start group ${ann.is_pinned ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30' : 'bg-white/5 hover:bg-white/10 border-white/10'}`}>
                                    <div className="pr-4">
                                        <div className="flex gap-2 items-center mb-1">
                                            {ann.is_pinned && <span className="text-xs bg-[#00E5FF]/20 text-[#00E5FF] px-2 py-0.5 rounded-full font-bold">Fijado</span>}
                                            <h4 className="font-bold">{ann.title}</h4>
                                        </div>
                                        <p className="text-sm text-gray-400 line-clamp-2">{ann.content}</p>
                                        <p className="text-xs text-gray-500 mt-2">{new Date(ann.created_at).toLocaleString('es-ES')}</p>
                                    </div>
                                    <form action={async (fd) => { "use server"; await deleteAnnouncement(fd); }}>
                                        <input type="hidden" name="id" value={ann.id} />
                                        <button type="submit" className="p-2 text-red-400 hover:bg-red-500/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-1">
                                            <Trash2 size={18} />
                                        </button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </main>
    )
}
