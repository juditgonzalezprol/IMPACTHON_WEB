import Navbar from "@/components/navbar"
import { login, signup } from "./actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function LoginPage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) {
    const searchParams = await props.searchParams
    const error = searchParams?.error === 'true'
    const signupError = searchParams?.signupError === 'true'
    const message = searchParams?.message

    return (
        <main className="min-h-screen bg-black overflow-hidden relative font-sans text-white">
            <div className="fixed inset-0 pointer-events-none">
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

            <div className="relative z-10">
                <Navbar />

                <div className="flex min-h-[calc(100vh-80px)] mt-20 items-center justify-center p-4">
                    <div className="w-full max-w-md space-y-6 bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(170,255,0,0.1)] relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-3xl -z-10" />
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-3xl -z-10" />

                        <div className="text-center mb-6">
                            <h2 className="text-3xl font-bold mb-2">Portal Hackathon</h2>
                            <p className="text-gray-400 text-sm">Organiza tu equipo y participa.</p>
                        </div>

                        {(error || signupError) && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center mb-4">
                                {message || "Ha ocurrido un error al conectar"}
                            </div>
                        )}

                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-8 bg-black/40 border border-white/10 p-1 rounded-xl">
                                <TabsTrigger
                                    value="login"
                                    className="rounded-lg data-[state=active]:bg-[#AAFF00] data-[state=active]:text-black transition-all font-bold"
                                >
                                    Iniciar Sesión
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="rounded-lg data-[state=active]:bg-[#AAFF00] data-[state=active]:text-black transition-all font-bold"
                                >
                                    Nuevo Registro
                                </TabsTrigger>
                            </TabsList>

                            {/* Pestaña de Iniciar Sesión */}
                            <TabsContent value="login" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <form className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                                            <Input
                                                id="login-email"
                                                name="email"
                                                type="email"
                                                placeholder="tu_correo@ejemplo.com"
                                                required
                                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#AAFF00]"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor="login-password" className="text-gray-300">Contraseña</Label>
                                                <a href="#" className="text-xs text-[#AAFF00] hover:underline">¿Olvidaste tu contraseña?</a>
                                            </div>
                                            <Input
                                                id="login-password"
                                                name="password"
                                                type="password"
                                                required
                                                className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                                            />
                                        </div>
                                    </div>

                                    <Button
                                        formAction={login}
                                        className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold h-12 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(170,255,0,0.3)]"
                                    >
                                        Acceder a tu perfil
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Pestaña de Crear Cuenta (Registro) */}
                            <TabsContent value="register" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                                <form className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="register-email" className="text-gray-300">Correo Electrónico</Label>
                                            <Input
                                                id="register-email"
                                                name="email"
                                                type="email"
                                                placeholder="tu_correo@ejemplo.com"
                                                required
                                                className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#AAFF00]"
                                            />
                                            <p className="text-xs text-gray-500">Usaremos este email para contactarte sobre el hackathon.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="register-password" className="text-gray-300">Crea una contraseña</Label>
                                            <Input
                                                id="register-password"
                                                name="password"
                                                type="password"
                                                required
                                                minLength={6}
                                                className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                                            />
                                            <p className="text-xs text-gray-500">Mínimo 6 caracteres.</p>
                                        </div>
                                    </div>

                                    <Button
                                        formAction={signup}
                                        className="w-full bg-white text-black hover:bg-gray-200 font-bold h-12 rounded-lg transition-all duration-300"
                                    >
                                        Completar Registro
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>

                    </div>
                </div>
            </div>
        </main>
    )
}
