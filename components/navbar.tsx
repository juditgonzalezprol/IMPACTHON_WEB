"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut, Code, Users, ShieldCheck, Gavel, ShieldAlert, HomeIcon, ArrowLeft, Bell, Target } from "lucide-react"
import RegistrationModal from "@/components/registration-modal"
import { createBrowserClient } from '@supabase/ssr'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinks = [
  { name: "Inicio", href: "/#inicio" },
  { name: "Ganadores", href: "/#ganadores" },
  { name: "Retos", href: "/#retos" },
]

const authNavLinks: { name: string; href: string }[] = []

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("inicio")
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0)
  const router = useRouter()
  const pathname = usePathname()
  const isLanding = pathname === "/"
  const isHomePage = pathname === "/home"

  useEffect(() => {
    // Scroll handling
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
      const sections = navLinks.map((link) => link.href.split('#')[1]).filter(Boolean)
      for (const section of sections.reverse()) {
        const element = document.getElementById(section!)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section!)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Auth handling
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url, role')
          .eq('id', user.id)
          .single()
        setProfile(data)
      }
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        fetchUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Fetch unread announcements count
  useEffect(() => {
    if (!user) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const fetchUnreadCount = async () => {
      const lastSeenStr = localStorage.getItem('announcements_last_seen')
      const lastSeen = lastSeenStr ? new Date(lastSeenStr) : new Date(0)

      const { data: announcements } = await supabase
        .from('announcements')
        .select('id, created_at')
        .gt('created_at', lastSeen.toISOString())

      setUnreadAnnouncements(announcements?.length || 0)
    }

    fetchUnreadCount()

    // Subscribe to new announcements
    const channel = supabase
      .channel('announcements_changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'announcements' }, () => {
        fetchUnreadCount()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  // Mark announcements as seen when on /home
  useEffect(() => {
    if (isHomePage && user) {
      localStorage.setItem('announcements_last_seen', new Date().toISOString())
      setUnreadAnnouncements(0)
    }
  }, [isHomePage, user])

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  // --- RENDERING ---
  const renderAuthLinksDesktop = () => {
    if (user && profile) {
      return (
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={() => router.push('/home')}
            className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Avisos y notificaciones"
          >
            <Bell className="w-5 h-5 text-gray-300 hover:text-white" />
            {unreadAnnouncements > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold bg-red-500 text-white rounded-full animate-pulse">
                {unreadAnnouncements > 9 ? '9+' : unreadAnnouncements}
              </span>
            )}
          </button>

          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-4 flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#AAFF00]">
              <span className="text-sm font-bold text-[#AAFF00]">
                {profile.full_name?.substring(0, 2).toUpperCase() || "U"}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-black/90 border-[#AAFF00]/20 text-white backdrop-blur-xl mt-2 z-50">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-bold text-sm text-[#AAFF00]">{profile.full_name}</p>
                <p className="text-xs text-gray-400">{profile.role}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10" onClick={() => router.push(`/perfil/${user.id}`)}>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#AAFF00]/10 focus:bg-[#AAFF00]/10 text-[#AAFF00]" onClick={() => router.push('/home')}>
              <HomeIcon className="mr-2 h-4 w-4" />
              <span>Panel Principal (Avisos)</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-white/10 focus:bg-white/10" onClick={() => router.push('/equipos')}>
              <Users className="mr-2 h-4 w-4" />
              <span>Dashboard Equipos</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#AAFF00]/10 focus:bg-[#AAFF00]/10 text-[#AAFF00]" onClick={() => router.push('/retos')}>
              <Target className="mr-2 h-4 w-4" />
              <span>Retos y Entregables</span>
            </DropdownMenuItem>

            {/* Role-based Links */}
            {(profile.role === 'Staff' || profile.role === 'Organizador') && (
              <DropdownMenuItem className="cursor-pointer hover:bg-blue-500/20 focus:bg-blue-500/20 text-blue-400" onClick={() => router.push('/staff')}>
                <ShieldAlert className="mr-2 h-4 w-4" />
                <span>Panel de Staff</span>
              </DropdownMenuItem>
            )}

            {profile.role === 'Organizador' && (
              <DropdownMenuItem className="cursor-pointer hover:bg-[#AAFF00]/20 focus:bg-[#AAFF00]/20 text-[#AAFF00]" onClick={() => router.push('/admin')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Panel de Admin</span>
              </DropdownMenuItem>
            )}

            {(profile.role === 'Organizador' || profile.role === 'Jurado') && (
              <DropdownMenuItem className="cursor-pointer hover:bg-purple-500/20 focus:bg-purple-500/20 text-purple-400" onClick={() => router.push('/jurado')}>
                <Gavel className="mr-2 h-4 w-4" />
                <span>Panel de Jurado</span>
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-400" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }

    return (
      <>
        <Button
          variant="outline"
          onClick={() => router.push('/login')}
          className="ml-2 lg:ml-4 border-[#AAFF00] text-[#AAFF00] hover:bg-[#AAFF00]/10 font-bold px-6 transition-all duration-300 bg-transparent"
        >
          Acceso
        </Button>
        <Button
          onClick={() => window.open('https://gdg.community.dev/events/details/google-gdg-santiago-de-compostela-presents-impac-thon-2026/', '_blank')}
          className="ml-2 bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold px-6 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(170,255,0,0.3)]"
        >
          Regístrate
        </Button>
      </>
    )
  }

  const renderAuthLinksMobile = () => {
    if (user && profile) {
      return (
        <div className="pt-4 border-t border-white/10 mt-4">
          <div className="px-4 py-2">
            <p className="font-bold text-sm text-[#AAFF00]">{profile.full_name}</p>
            <p className="text-xs text-gray-400">{profile.role}</p>
          </div>
          <a
            href={`/perfil/${user.id}`}
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white"
          >
            <User className="mr-3 h-5 w-5" /> Mi Perfil
          </a>
          <a
            href="/home"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-3 text-[#AAFF00] hover:bg-[#AAFF00]/10"
          >
            <div className="relative mr-3">
              <Bell className="h-5 w-5" />
              {unreadAnnouncements > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[14px] h-[14px] px-0.5 text-[8px] font-bold bg-red-500 text-white rounded-full">
                  {unreadAnnouncements > 9 ? '9+' : unreadAnnouncements}
                </span>
              )}
            </div>
            Avisos {unreadAnnouncements > 0 && `(${unreadAnnouncements} nuevos)`}
          </a>
          <a
            href="/equipos"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-3 text-gray-300 hover:text-white"
          >
            <Users className="mr-3 h-5 w-5" /> Dashboard Equipos
          </a>
          <a
            href="/retos"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-3 text-[#AAFF00] hover:bg-[#AAFF00]/10"
          >
            <Target className="mr-3 h-5 w-5" /> Retos y Entregables
          </a>

          {profile.role === 'Organizador' && (
            <a
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-[#AAFF00] hover:bg-[#AAFF00]/10"
            >
              <ShieldCheck className="mr-3 h-5 w-5" /> Panel de Admin
            </a>
          )}

          {(profile.role === 'Organizador' || profile.role === 'Jurado') && (
            <a
              href="/jurado"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-3 text-purple-400 hover:bg-purple-500/10"
            >
              <Gavel className="mr-3 h-5 w-5" /> Panel de Jurado
            </a>
          )}

          <button
            onClick={() => {
              setIsOpen(false)
              handleSignOut()
            }}
            className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="mr-3 h-5 w-5" /> Cerrar Sesión
          </button>
        </div>
      )
    }

    return (
      <div className="mt-4 px-4 space-y-2 pb-4">
        <Button
          variant="outline"
          onClick={() => {
            setIsOpen(false)
            router.push('/login')
          }}
          className="w-full border-[#AAFF00] text-[#AAFF00] hover:bg-[#AAFF00]/10 font-bold bg-transparent"
        >
          Acceso Participantes
        </Button>
        <Button
          onClick={() => {
            setIsOpen(false)
            window.open('https://gdg.community.dev/events/details/google-gdg-santiago-de-compostela-presents-impac-thon-2026/', '_blank')
          }}
          className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold"
        >
          Regístrate Ahora
        </Button>
      </div>
    )
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "backdrop-blur-xl bg-black/80 border-b border-white/10 shadow-lg"
          : "backdrop-blur-md bg-black/30"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Desktop Navigation - Center (landing) or Left (user pages) */}
            {isLanding ? (
              <div className="hidden md:flex items-center gap-2 lg:gap-4 flex-1 justify-center">
                {navLinks.map((link) => {
                  const linkAny = link as any
                  const isActive = !linkAny.external && activeSection === link.href.split('#')[1]
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      target={linkAny.external ? "_blank" : undefined}
                      rel={linkAny.external ? "noopener noreferrer" : undefined}
                      className={`relative px-4 py-2 font-medium transition-all duration-300 rounded-lg ${isActive
                        ? "text-[#AAFF00]"
                        : "text-gray-300 hover:text-white hover:text-[#AAFF00]"
                        }`}
                    >
                      {link.name}
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#AAFF00] rounded-full" />
                      )}
                    </a>
                  )
                })}

                {user && authNavLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="relative px-4 py-2 font-medium transition-all duration-300 rounded-lg text-gray-300 hover:text-white hover:text-[#AAFF00]"
                    >
                      {link.name}
                    </a>
                  ))}
              </div>
            ) : (
              <div className="hidden md:flex items-center flex-1">
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-2 font-medium text-gray-300 hover:text-[#AAFF00] transition-all duration-300 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a la landing
                </a>
              </div>
            )}

            {/* Desktop Auth - Right */}
            <div className="hidden md:flex items-center">
              {renderAuthLinksDesktop()}
            </div>

            {/* Mobile register link - only shown when not logged in */}
            {!profile && (
              <a
                href="https://gdg.community.dev/events/details/google-gdg-santiago-de-compostela-presents-impac-thon-2026/"
                target="_blank"
                rel="noopener noreferrer"
                className="md:hidden absolute left-4 text-[#AAFF00] text-sm font-bold hover:underline flex items-center gap-1"
              >
                Regístrate aquí →
              </a>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden absolute right-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-500 ${isOpen ? "max-h-[32rem] opacity-100" : "max-h-0 opacity-0"
              }`}
          >
            <div className="py-4 border-t border-white/10 flex flex-col">
              {isLanding ? (
                <>
                  {navLinks.map((link, index) => {
                    const linkAny = link as any
                    const isActive = !linkAny.external && activeSection === link.href.split('#')[1]
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        target={linkAny.external ? "_blank" : undefined}
                        rel={linkAny.external ? "noopener noreferrer" : undefined}
                        className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${isActive
                          ? "text-[#AAFF00] bg-[#AAFF00]/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                          }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </a>
                    )
                  })}

                  {user && authNavLinks.map((link) => (
                      <a
                        key={link.name}
                        href={link.href}
                        className="block px-4 py-3 rounded-lg font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/5"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </a>
                    ))}
                </>
              ) : (
                <a
                  href="/"
                  className="flex items-center gap-2 px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-[#AAFF00] hover:bg-white/5 transition-all duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Volver a la landing
                </a>
              )}

              {renderAuthLinksMobile()}
            </div>
          </div>
        </div>
      </nav>

      <RegistrationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
