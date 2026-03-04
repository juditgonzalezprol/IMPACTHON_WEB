import { SiDiscord, SiWhatsapp, SiGoogle } from "@icons-pack/react-simple-icons"

export default function FloatingContactButtons() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
            {/* Google Button */}
            <a
                href="https://google.com" // Replace with actual Google form/drive link
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-white hover:bg-gray-100 text-black rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]"
                aria-label="Enlaces y Recursos (Google)"
            >
                <SiGoogle size={24} />

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Recursos y Enlaces
                </span>
            </a>

            {/* Devpost Button */}
            <a
                href="https://devpost.com" // Replace with actual Devpost link
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-[#003E54] hover:bg-[#002D3D] text-[#00E5FF] rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(0,229,255,0.6)]"
                aria-label="Plataforma Devpost"
            >
                <span className="font-mono text-2xl font-black mt-[-2px]">{`{}`}</span>

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Proyectos en Devpost
                </span>
            </a>

            {/* Discord Button */}
            <a
                href="https://discord.com" // Replace with actual Discord invite link
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center w-14 h-14 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(88,101,242,0.6)]"
                aria-label="Únete a nuestro Discord"
            >
                <SiDiscord size={28} />

                {/* Tooltip */}
                <span className="absolute right-full mr-4 px-3 py-1.5 bg-black/90 text-white text-sm font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-white/10">
                    Discord Oficial
                </span>
            </a>

            {/* WhatsApp Button */}
            <a
                href="https://whatsapp.com" // Replace with actual WhatsApp group link
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
