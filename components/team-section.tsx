"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { ExternalLink } from "lucide-react"

const teamMembers = [
    {
        name: "Judit González Prol",
        role: "President & Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "JG",
        color: "#AAFF00",
    },
    {
        name: "Laura Antelo",
        role: "Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "LA",
        color: "#60A5FA",
    },
    {
        name: "Mateo Bodenlle Villarino",
        role: "Treasurer & Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "MB",
        color: "#34D399",
    },
    {
        name: "Diego Cristóbal",
        role: "Secretary & Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "DC",
        color: "#F472B6",
    },
    {
        name: "Iago Feijóo Rey",
        role: "Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "IF",
        color: "#FB923C",
    },
    {
        name: "Sara Castro",
        role: "Organizer",
        university: "Universidad de Santiago de Compostela",
        gdg: "GDG Santiago de Compostela",
        initials: "SC",
        color: "#A78BFA",
    },
]

const staffMembers = [
    { name: "Oumaima El Omari Ellachgar", initials: "OE", color: "#E879F9" },
    { name: "Elisa García García", initials: "EG", color: "#38BDF8" },
    { name: "María Rañó Myro", initials: "MR", color: "#FCD34D" },
    { name: "Lucas García", initials: "LG", color: "#4ADE80" },
]

const mentorMembers = [
    { name: "Nicolás Corbal", company: "OSIX Tech", initials: "NC", color: "#F97316" },
    { name: "David Gutiérrez", company: "OSIX Tech", initials: "DG", color: "#8B5CF6" },
    { name: "Juan Freire", company: "OSIX Tech", initials: "JF", color: "#06B6D4" },
    { name: "Pablo Pazos", company: "OSIX Tech", initials: "PP", color: "#EC4899" },
    { name: "Nel Raposeiras", company: "OSIX Tech", initials: "NR", color: "#14B8A6" },
    { name: "David Iglesias", company: "Train2Go", initials: "DI", color: "#F59E0B" },
    { name: "Christian Palou", company: "Theirstack", initials: "CP", color: "#3B82F6" },
    { name: "Xoel López", company: "Theirstack", initials: "XL", color: "#EF4444" },
    { name: "Iago Lastra", company: "TimeTime", initials: "IL", color: "#10B981" },
    { name: "Daniel Cerqueiro", company: "Docuten", initials: "DC", color: "#A855F7" },
]

export default function TeamSection() {
    const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })

    return (
        <section
            ref={ref}
            id="equipo"
            className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-black to-black relative overflow-hidden"
        >
            {/* Background dots */}
            <div className="absolute inset-0 opacity-20">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.15) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
                        Organización
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        El{" "}
                        <span className="text-[#AAFF00]">Equipo</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Las personas detrás del Impacthon USC que hacen posible este evento.
                    </p>
                </div>

                {/* Team grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teamMembers.map((member, index) => (
                        <div
                            key={member.name}
                            className={`group relative backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-8 transition-all duration-700 hover:border-[#AAFF00]/40 hover:bg-white/10 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                                }`}
                            style={{ transitionDelay: `${index * 100}ms` }}
                        >
                            {/* Glow on hover */}
                            <div
                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                                style={{ boxShadow: `0 0 40px ${member.color}15` }}
                            />

                            {/* Avatar */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-black font-black text-xl mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ backgroundColor: member.color }}
                            >
                                {member.initials}
                            </div>

                            {/* Info */}
                            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#AAFF00] transition-colors">
                                {member.name}
                            </h3>

                            <p
                                className="text-sm font-semibold mb-3 uppercase tracking-wider"
                                style={{ color: member.color }}
                            >
                                {member.role}
                            </p>

                            <p className="text-xs text-gray-500">{member.university}</p>
                            <p className="text-xs text-gray-500">{member.gdg}</p>
                        </div>
                    ))}
                </div>

                {/* Staff subsection */}
                <div className={`mt-16 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="text-center mb-8">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-white/60 uppercase tracking-widest border border-white/20 rounded-full">
                            Staff
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {staffMembers.map((member) => (
                            <div
                                key={member.name}
                                className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-[#AAFF00]/30 hover:bg-white/10 transition-all duration-300"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-black text-sm mx-auto mb-3 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: member.color }}
                                >
                                    {member.initials}
                                </div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-[#AAFF00] transition-colors leading-tight">
                                    {member.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">Staff</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Mentores subsection */}
                <div className={`mt-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                    <div className="text-center mb-8">
                        <span className="inline-block px-3 py-1 text-xs font-bold text-white/60 uppercase tracking-widest border border-white/20 rounded-full">
                            Mentores
                        </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        {mentorMembers.map((member) => (
                            <div
                                key={member.name}
                                className="group backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:border-[#AAFF00]/30 hover:bg-white/10 transition-all duration-300"
                            >
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-black font-black text-sm mx-auto mb-3 group-hover:scale-110 transition-transform"
                                    style={{ backgroundColor: member.color }}
                                >
                                    {member.initials}
                                </div>
                                <h4 className="text-sm font-semibold text-white group-hover:text-[#AAFF00] transition-colors leading-tight">
                                    {member.name}
                                </h4>
                                <p className="text-xs text-gray-500 mt-1">{member.company}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
