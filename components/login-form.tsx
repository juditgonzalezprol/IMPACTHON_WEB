'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { login } from "@/app/login/actions"

interface LoginFormProps {
    error?: boolean
    message?: string
}

export default function LoginForm({ error, message }: LoginFormProps) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        await login(formData)
        // If login redirects, this won't execute
        // If there's an error, the page will reload with error params
        setLoading(false)
    }

    return (
        <>
            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center mb-4">
                    {message || "Ha ocurrido un error al conectar"}
                </div>
            )}

            <form action={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                        <Input
                            id="login-email"
                            name="email"
                            type="email"
                            placeholder="tu_correo@ejemplo.com"
                            required
                            disabled={loading}
                            className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-[#AAFF00] disabled:opacity-50"
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
                            disabled={loading}
                            className="bg-black/40 border-white/10 text-white focus-visible:ring-[#AAFF00] disabled:opacity-50"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold h-12 rounded-lg transition-all duration-300 hover:shadow-[0_0_20px_rgba(170,255,0,0.3)] disabled:opacity-70"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <Spinner className="size-5" />
                            Accediendo...
                        </span>
                    ) : (
                        "Acceder a tu perfil"
                    )}
                </Button>
            </form>
        </>
    )
}
