"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useScrollColor } from "@/hooks/use-scroll-color"
import { ClipboardList, PartyPopper, Code2, Users, Presentation, Award, CalendarDays, Gamepad2 } from "lucide-react"

const timelineEvents = [
  {
    icon: ClipboardList,
    title: "Registro",
    time: "Viernes 17:00",
    description: "Check-in de equipos y entrega de credenciales",
    day: "DIA 1",
  },
  {
    icon: PartyPopper,
    title: "Inauguracion",
    time: "Viernes 18:00",
    description: "Bienvenida oficial y presentacion de los retos",
    day: "DIA 1",
  },
  {
    icon: Code2,
    title: "Hacking",
    time: "Viernes 19:00 - Domingo 10:00",
    description: "36 horas de desarrollo intensivo",
    day: "DIA 1-3",
    featured: true,
  },
  {
    icon: Gamepad2,
    title: "Minijuego sorpresa",
    time: "Sabado 02:00",
    description: "Actividad sorpresa para los mas nocturnos",
    day: "DIA 2",
  },
  {
    icon: Users,
    title: "Mentoring",
    time: "Sabado 10:00 - 20:00",
    description: "Sesiones con mentores expertos de la industria",
    day: "DIA 2",
  },
  {
    icon: Gamepad2,
    title: "Minijuego sorpresa",
    time: "Sabado 16:00",
    description: "Desconecta un momento con una actividad divertida",
    day: "DIA 2",
  },
  {
    icon: Gamepad2,
    title: "Minijuego sorpresa",
    time: "Sabado 23:30",
    description: "Ultima actividad sorpresa del dia",
    day: "DIA 2",
  },
  {
    icon: Presentation,
    title: "Demos",
    time: "Domingo 10:00",
    description: "Presentacion de proyectos ante el jurado",
    day: "DIA 3",
  },
  {
    icon: Award,
    title: "Premios",
    time: "Domingo 13:20 - 14:00",
    description: "Ceremonia de clausura y entrega de premios",
    day: "DIA 3",
    featured: true,
  },
]

export default function TimelineSection({ dbEvents }: { dbEvents?: any[] }) {
  const { ref, isVisible } = useScrollAnimation<HTMLElement>({
    threshold: 0.1,
  })
  const { containerRef, colorProgress } = useScrollColor()

  const eventsToRender = dbEvents && dbEvents.length > 0
    ? dbEvents.map(e => ({
      icon: CalendarDays,
      title: e.title,
      time: new Date(e.start_time).toLocaleString('es-ES', { timeZone: 'Europe/Madrid', weekday: 'long', hour: '2-digit', minute: '2-digit' }),
      description: e.description || e.location,
      day: new Date(e.start_time).toLocaleDateString('es-ES', { timeZone: 'Europe/Madrid', day: 'numeric', month: 'short' }),
      featured: false
    }))
    : timelineEvents;

  return (
    <section ref={ref} id="agenda" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-zinc-950 via-black to-zinc-950 relative overflow-hidden">
      {/* Decorative line */}
      <div className="absolute inset-0 opacity-30">
        <div
          style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(170, 255, 0, 0.05) 0px, rgba(170, 255, 0, 0.05) 1px, transparent 1px, transparent 20px)`,
          }}
          className="w-full h-full"
        />
      </div>
      {/* Background decoration */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#AAFF00]/30 to-transparent hidden sm:block" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div
          ref={containerRef as any}
          className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <span className="inline-block px-3 py-1 text-xs font-bold text-[#AAFF00] uppercase tracking-widest mb-4 border border-[#AAFF00]/30 rounded-full">
            Programa
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            36 horas de{" "}
            <span
              className="transition-all duration-300"
              style={{
                opacity: Math.min(1, colorProgress / 50),
                color: `rgba(170, 255, 0, ${colorProgress / 100})`,
              }}
            >
              innovacion
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Un fin de semana intenso lleno de codigo, aprendizaje y networking.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line for mobile */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#AAFF00] via-[#AAFF00]/50 to-[#AAFF00]/20 sm:hidden" />

          <div className="space-y-6">
            {eventsToRender.map((event, index) => (
              <div
                key={event.title + index}
                className={`relative flex items-start gap-6 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
                  } ${index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Timeline dot */}
                <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 z-10">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${event.featured
                      ? "bg-[#AAFF00] shadow-[0_0_30px_rgba(170,255,0,0.5)]"
                      : "bg-zinc-800 border-2 border-[#AAFF00]/50"
                      }`}
                  >
                    <event.icon className={`w-5 h-5 ${event.featured ? "text-black" : "text-[#AAFF00]"}`} />
                  </div>
                </div>

                {/* Content card */}
                <div
                  className={`w-full sm:w-[calc(50%-3rem)] ml-16 sm:ml-0 ${index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8 sm:text-left"
                    }`}
                >
                  <div
                    className={`group backdrop-blur-md bg-white/5 border rounded-xl p-5 transition-all duration-300 hover:scale-105 ${event.featured
                      ? "border-[#AAFF00]/50 bg-[#AAFF00]/5"
                      : "border-white/10 hover:border-[#AAFF00]/30"
                      }`}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${index % 2 === 0 ? "sm:justify-end" : ""}`}>
                      <span suppressHydrationWarning className="text-[10px] font-bold text-[#AAFF00]/60 uppercase tracking-widest">
                        {event.day}
                      </span>
                    </div>
                    <span suppressHydrationWarning className="text-[#AAFF00] text-sm font-semibold">{event.time}</span>
                    <h3 className="text-xl font-bold text-white mt-1 group-hover:text-[#AAFF00] transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-2">{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
