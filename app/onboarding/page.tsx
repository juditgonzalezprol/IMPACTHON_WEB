import Navbar from "@/components/navbar"
import { saveProfile } from "./actions"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

export default async function OnboardingPage(
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) {
    const searchParams = await props.searchParams
    const error = searchParams?.error === 'true'
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
                    <div className="w-full max-w-xl space-y-8 bg-white/5 p-8 sm:p-10 rounded-2xl backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(170,255,0,0.1)] relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#AAFF00]/10 rounded-full blur-3xl -z-10" />

                        <div className="text-center">
                            <h2 className="text-3xl font-bold mb-2">Completa tu perfil</h2>
                            <p className="text-gray-400 text-sm">Necesitamos algunos datos antes de que puedas unirte a un equipo.</p>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                                {message || "Ha ocurrido un error al guardar tu perfil"}
                            </div>
                        )}

                        <form action={saveProfile} className="mt-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-gray-300">Nombre Completo <span className="text-[#AAFF00]">*</span></Label>
                                    <Input
                                        id="full_name"
                                        name="full_name"
                                        type="text"
                                        placeholder="Ada Lovelace"
                                        required
                                        className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="text-gray-300">Bio / Habilidades</Label>
                                    <Textarea
                                        id="bio"
                                        name="bio"
                                        placeholder="Ej: Soy desarrollador frontend con experiencia en React y Tailwind..."
                                        className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00] min-h-[100px]"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="linkedin_url" className="text-gray-300">LinkedIn URL</Label>
                                        <Input
                                            id="linkedin_url"
                                            name="linkedin_url"
                                            type="url"
                                            placeholder="https://linkedin.com/in/..."
                                            className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="github_url" className="text-gray-300">GitHub URL</Label>
                                        <Input
                                            id="github_url"
                                            name="github_url"
                                            type="url"
                                            placeholder="https://github.com/..."
                                            className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00]"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Checkbox
                                        id="needs_credits"
                                        name="needs_credits"
                                        className="border-white/20 data-[state=checked]:bg-[#AAFF00] data-[state=checked]:text-black"
                                    />
                                    <Label htmlFor="needs_credits" className="text-gray-300 font-normal cursor-pointer">
                                        Necesito créditos universitarios ECTS por participar en el evento
                                    </Label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold h-12 rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(170,255,0,0.3)]"
                                >
                                    Guardar y Continuar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}
