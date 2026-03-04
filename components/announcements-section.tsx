"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Info } from "lucide-react"

export default function AnnouncementsSection({ dbAnnouncements }: { dbAnnouncements?: any[] }) {
    const { ref, isVisible } = useScrollAnimation<HTMLElement>({
        threshold: 0.1,
    })

    // Only render if there are announcements
    if (!dbAnnouncements || dbAnnouncements.length === 0) {
        return null;
    }

    return (
        <section ref={ref} id="noticias" className="py-24 px-4 sm:px-6 lg:px-8 bg-black relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
                        Noticias y Avisos
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                        Última hora del evento
                    </h2>
                </div>

                <div className="space-y-6">
                    {dbAnnouncements.map((ann, index) => (
                        <article
                            key={ann.id}
                            className={`backdrop-blur-md p-6 rounded-2xl border transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"} ${ann.is_pinned ? 'bg-[#AAFF00]/5 border-[#AAFF00]/50 shadow-[0_0_30px_rgba(170,255,0,0.1)]' : 'bg-white/5 border-white/10'}`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                {ann.is_pinned && <Info className="text-[#AAFF00] w-5 h-5" />}
                                <span className={`text-xs font-bold uppercase tracking-wider ${ann.is_pinned ? 'text-[#AAFF00]' : 'text-gray-500'}`}>
                                    {new Date(ann.created_at).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}
                                    {ann.is_pinned && " · FIJADO"}
                                </span>
                            </div>
                            <h3 className={`text-2xl font-bold mb-3 ${ann.is_pinned ? 'text-white' : 'text-gray-300'}`}>{ann.title}</h3>
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                                {ann.content}
                            </p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    )
}
