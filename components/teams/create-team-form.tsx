'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTeam } from "@/app/equipos/actions"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CreateTeamForm() {
    const [open, setOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        setError(null)

        const result = await createTeam(formData)

        if (result.error) {
            setError(result.error)
            setLoading(false)
        } else {
            setOpen(false)
            setLoading(false)
            router.refresh()
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold h-12 px-6 shadow-[0_0_20px_rgba(170,255,0,0.1)] hover:shadow-[0_0_30px_rgba(170,255,0,0.3)] transition-all">
                    Crear Nuevo Equipo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-black/90 border-[#AAFF00]/20 text-white backdrop-blur-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl text-[#AAFF00]">Formar Equipo</DialogTitle>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 mt-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">
                            Nombre del Equipo
                        </label>
                        <Input
                            id="name"
                            name="name"
                            required
                            placeholder="Ej: Los Hackers Verdes"
                            className="bg-white/5 border-white/10"
                            maxLength={50}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium text-gray-300">
                            Descripción Corta
                        </label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="¿Qué vais a construir? ¿Qué perfiles buscáis?"
                            className="bg-white/5 border-white/10"
                            maxLength={250}
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold"
                        >
                            {loading ? "Creando..." : "Crear Equipo"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
