import { SiWhatsapp, SiGoogle, SiRedbull } from "@icons-pack/react-simple-icons"

export default function FloatingContactButtons() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
            {/* Red Bull Basement Button */}
            <a
                href="https://www.redbull.com/es-es/events/red-bull-basement-spain-2026"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-[#DB0A40] hover:bg-[#c0093a] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(219,10,64,0.6)]"
                aria-label="Red Bull Basement"
            >
                <SiRedbull size={28} />

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Red Bull Basement
                </span>
            </a>

            {/* Google Button */}
            <a
                href="https://gdg.community.dev/events/details/google-gdg-santiago-de-compostela-presents-impac-thon-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-100 text-black rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                aria-label="Evento en GDG"
            >
                <SiGoogle size={24} />

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Evento en GDG
                </span>
            </a>

            {/* WhatsApp Button */}
            <a
                href="https://chat.whatsapp.com/HxNhRxF5pjZKiE3TBqwzTO"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-[#25D366] hover:bg-[#20BE5A] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,211,102,0.6)]"
                aria-label="Únete a nuestro grupo de WhatsApp"
            >
                <SiWhatsapp size={28} />

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Grupo de WhatsApp
                </span>
            </a>
        </div>
    )
}
