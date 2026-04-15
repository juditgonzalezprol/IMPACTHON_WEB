"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { Trophy, Github, Award, Dna, Hotel, Smartphone, Cloud } from "lucide-react"

type Member = { name: string }
type WinnerTeam = {
    name: string
    members: Member[]
    repos: { label?: string; url: string }[]
}

type Podium = {
    challenge: string
    icon: any
    color: string  // tailwind color base, e.g. "blue", "emerald"
    teams: WinnerTeam[]   // [1º, 2º, 3º]
}

// ========== DATOS GANADORES IMPACTHON 2026 ==========

const GENERAL_WINNERS: WinnerTeam[] = [
    {
        name: "5.Gracias",
        members: [
            { name: "Diego Suárez Castro" },
            { name: "Martín Díaz Fernández" },
            { name: "Álvaro Schwiedop Souto" },
            { name: "Martín Rodríguez Penedo" },
            { name: "Lucas Andrea Martínez Calveiro" },
            { name: "Santiago Pereira Olmeda" },
        ],
        repos: [
            { url: "https://github.com/marrtinpenedo/Eurostars---Cheese.Gracias" },
        ],
    },
    {
        name: "Maimiño",
        members: [
            { name: "Martín González" },
            { name: "Sabela Pérez" },
            { name: "Izan Monterroso" },
            { name: "Asier Cabo" },
        ],
        repos: [
            { label: "Camelia", url: "https://github.com/martindios/fi" },
            { label: "Eurostars / GDG", url: "https://github.com/AsierCL/gamma" },
        ],
    },
]

const PODIUMS: Podium[] = [
    {
        challenge: "Eurostars — Make Me Want to Travel",
        icon: Hotel,
        color: "blue",
        teams: [
            {
                name: "SA",
                members: [
                    { name: "Alicia Roldán Cordeiro" },
                    { name: "Sergio Pérez Gómez" },
                    { name: "Adriana Alonso Bravo" },
                    { name: "Amirhossein Saeidifar" },
                ],
                repos: [{ url: "https://github.com/amirhossein-sf/grupo-sa" }],
            },
            {
                name: "Cazola de barro",
                members: [
                    { name: "Xabier Nóvoa Gómez" },
                    { name: "Adrián Quiroga Linares" },
                    { name: "Andrés Daparte Cabo" },
                    { name: "Hugo" },
                    { name: "Martín Casais Blanco" },
                    { name: "Antonio Vilares Salgueiro" },
                ],
                repos: [{ url: "https://github.com/xabiernovoa/eurostarsAD" }],
            },
            {
                name: "Deltoya",
                members: [
                    { name: "Abraham Leiro Fernández" },
                    { name: "Anne Saavedra Otero" },
                ],
                repos: [{ url: "https://github.com/abrahampo1/roomie" }],
            },
        ],
    },
    {
        challenge: "Camelia — LocalFold",
        icon: Dna,
        color: "emerald",
        teams: [
            {
                name: "Penny",
                members: [
                    { name: "Pablo Pardo Cotos" },
                    { name: "Javier Outeiriño" },
                    { name: "Brais Rodríguez Serodio" },
                    { name: "Hugo Gómez-Randulfe Tallón" },
                ],
                repos: [{ url: "https://github.com/PabloPC05/gara/tree/main" }],
            },
            {
                name: "Teis",
                members: [
                    { name: "Jose Estévez Saborido" },
                    { name: "Anxo Campos Castro" },
                    { name: "Ángel Enrique Caballero Alonso" },
                    { name: "Daniela Paredes Barbosa" },
                    { name: "Álvaro Estévez Pazos" },
                    { name: "Javier Guisande Moreira" },
                ],
                repos: [{ url: "https://github.com/Varo-27/Impacthon_investigacion" }],
            },
            {
                name: "Maimiño",
                members: [
                    { name: "Martín González" },
                    { name: "Sabela Pérez" },
                    { name: "Izan Monterroso" },
                    { name: "Asier Cabo" },
                ],
                repos: [{ url: "https://github.com/martindios/fi" }],
            },
        ],
    },
    {
        challenge: "GDG — Herramientas Cloud",
        icon: Cloud,
        color: "orange",
        teams: [
            {
                name: "OSG",
                members: [
                    { name: "Javier Carballal Morgade" },
                    { name: "Ana Barrera Novas" },
                    { name: "Xian Lens Vales" },
                    { name: "Hugo Vilariño" },
                    { name: "Naiara Manteiga Cendón" },
                ],
                repos: [{ url: "https://github.com/HugoVilr/ImpactThon2026-CAMELIA" }],
            },
            {
                name: "MXPNJD",
                members: [
                    { name: "Xoel García Maestu" },
                    { name: "Jacobo Núñez Álvarez" },
                    { name: "Miguel Planas Díaz" },
                    { name: "Pablo Fernández" },
                    { name: "Diego Veiga Pereiro" },
                    { name: "Nicolás Aller Ponte" },
                ],
                repos: [{ url: "https://github.com/miguelplanas/impacthon2026-MXPNJD/" }],
            },
            {
                name: "Interpolación Polinomial",
                members: [
                    { name: "Manuel Gómez Viña" },
                    { name: "David Lubián Muñiz" },
                    { name: "Adan Maroñas Calvelo" },
                    { name: "Diego Iglesias Fraga" },
                ],
                repos: [{ url: "https://github.com/DavidLubianMuniz/IMPACTHON" }],
            },
        ],
    },
    {
        challenge: "GEM Galicia — Uso responsable del móvil",
        icon: Smartphone,
        color: "purple",
        teams: [
            {
                name: "5.Gracias",
                members: [
                    { name: "Diego Suárez Castro" },
                    { name: "Martín Díaz Fernández" },
                    { name: "Álvaro Schwiedop Souto" },
                    { name: "Martín Rodríguez Penedo" },
                    { name: "Lucas Andrea Martínez Calveiro" },
                    { name: "Santiago Pereira Olmeda" },
                ],
                repos: [{ url: "https://github.com/marrtinpenedo/Eurostars---Cheese.Gracias" }],
            },
            {
                name: "Pulgar en Pausa",
                members: [
                    { name: "Breogán Piñeiro Gey" },
                    { name: "Jesús Cacheda Fernández" },
                    { name: "Sergio Sande Cendán" },
                    { name: "Jordi Reichelt Mujico" },
                ],
                repos: [],
            },
            {
                name: "Segmentation Fault",
                members: [
                    { name: "Iago Leis Fernández" },
                    { name: "Carolina Silva Rey" },
                    { name: "Martín García Cebeiro" },
                    { name: "Nuria Guerra Casal" },
                ],
                repos: [{ url: "https://github.com/nuriaguerra/Impacthon" }],
            },
        ],
    },
]

// ===================================================

const POSITION_LABEL = ["1º", "2º", "3º"]
const POSITION_MEDAL = ["🥇", "🥈", "🥉"]

const COLOR_MAP: Record<string, { border: string; bg: string; text: string; gradient: string }> = {
    blue: {
        border: "border-blue-500/30",
        bg: "bg-blue-500/5",
        text: "text-blue-400",
        gradient: "from-blue-500/10",
    },
    emerald: {
        border: "border-emerald-500/30",
        bg: "bg-emerald-500/5",
        text: "text-emerald-400",
        gradient: "from-emerald-500/10",
    },
    purple: {
        border: "border-purple-500/30",
        bg: "bg-purple-500/5",
        text: "text-purple-400",
        gradient: "from-purple-500/10",
    },
    orange: {
        border: "border-orange-500/30",
        bg: "bg-orange-500/5",
        text: "text-orange-400",
        gradient: "from-orange-500/10",
    },
}

export default function WinnersSection() {
    const { ref, isVisible } = useScrollAnimation<HTMLElement>({ threshold: 0.1 })

    return (
        <section
            ref={ref}
            id="ganadores"
            className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black via-zinc-900/40 to-black relative overflow-hidden"
        >
            {/* Background decor */}
            <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#AAFF00]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div
                    className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                        }`}
                >
                    <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
                        Edición 2026
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        <span className="text-[#AAFF00]">Ganadores</span> Impacthon 2026
                    </h2>
                    <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                        Estos son los equipos premiados en la primera edición del Impacthon. ¡Enhorabuena a todos los participantes!
                    </p>
                </div>

                {/* Premio General ALAS */}
                <div
                    className={`backdrop-blur-md bg-gradient-to-br from-[#AAFF00]/15 to-transparent border-2 border-[#AAFF00]/40 rounded-3xl p-8 sm:p-10 mb-12 transition-all duration-700 max-w-5xl mx-auto ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                    style={{ transitionDelay: "100ms" }}
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#AAFF00]/20 mb-4">
                            <Award className="w-10 h-10 text-[#AAFF00]" />
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                            Premio <span className="text-[#AAFF00]">ALAS</span>
                        </h3>
                        <p className="text-gray-400 text-sm">Los dos mejores proyectos en conjunto del hackathon.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        {GENERAL_WINNERS.map((team) => (
                            <WinnerCard key={team.name} team={team} highlightColor="#AAFF00" />
                        ))}
                    </div>
                </div>

                {/* Podios por reto */}
                <div className="space-y-10">
                    {PODIUMS.map((podium, pIdx) => {
                        const Icon = podium.icon
                        const colors = COLOR_MAP[podium.color]
                        return (
                            <div
                                key={podium.challenge}
                                className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                                style={{ transitionDelay: `${200 + pIdx * 100}ms` }}
                            >
                                <div className="flex items-center gap-3 mb-5">
                                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center`}>
                                        <Icon className={`w-5 h-5 ${colors.text}`} />
                                    </div>
                                    <h3 className="text-xl sm:text-2xl font-bold text-white">
                                        {podium.challenge}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                    {podium.teams.map((team, tIdx) => (
                                        <PodiumCard
                                            key={team.name + tIdx}
                                            team={team}
                                            position={tIdx}
                                            colors={colors}
                                        />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

function WinnerCard({ team, highlightColor }: { team: WinnerTeam; highlightColor: string }) {
    return (
        <div className="p-5 bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6" style={{ color: highlightColor }} />
                <h4 className="text-xl font-bold text-white">{team.name}</h4>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Equipo</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
                {team.members.map((m) => (
                    <span
                        key={m.name}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300"
                    >
                        {m.name}
                    </span>
                ))}
            </div>
            {team.repos.length > 0 && (
                <div className="space-y-1.5">
                    {team.repos.map((r) => (
                        <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 rounded-md text-xs text-gray-300 transition-colors min-w-0"
                        >
                            <Github size={12} className="shrink-0" />
                            {r.label && (
                                <span className="text-[10px] font-bold uppercase tracking-wider shrink-0" style={{ color: highlightColor }}>
                                    {r.label}
                                </span>
                            )}
                            <span className="truncate">
                                {r.url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}

function PodiumCard({
    team,
    position,
    colors,
}: {
    team: WinnerTeam
    position: number
    colors: { border: string; bg: string; text: string; gradient: string }
}) {
    const isFirst = position === 0
    return (
        <div
            className={`p-5 backdrop-blur-md rounded-2xl border ${
                isFirst
                    ? `bg-gradient-to-br ${colors.gradient} to-transparent ${colors.border} border-2`
                    : "bg-white/5 border-white/10"
            }`}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="text-2xl">{POSITION_MEDAL[position]}</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isFirst ? colors.text : "text-gray-500"}`}>
                        {POSITION_LABEL[position]} puesto
                    </span>
                </div>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">{team.name}</h4>

            <p className="text-[10px] uppercase tracking-wider text-gray-500 mb-1.5">Equipo</p>
            <div className="flex flex-wrap gap-1 mb-4">
                {team.members.map((m) => (
                    <span
                        key={m.name}
                        className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-gray-300"
                    >
                        {m.name}
                    </span>
                ))}
            </div>

            {team.repos.length > 0 && (
                <div className="space-y-1.5">
                    {team.repos.map((r) => (
                        <a
                            key={r.url}
                            href={r.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#121212] hover:bg-white/10 border border-white/10 rounded-md text-xs text-gray-300 transition-colors min-w-0"
                        >
                            <Github size={12} className="shrink-0" />
                            <span className="truncate">
                                {r.url.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                            </span>
                        </a>
                    ))}
                </div>
            )}
        </div>
    )
}
