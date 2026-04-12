'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateDashboardSettings } from '@/app/admin/dashboard-publico/actions'

export default function DashboardSettingsForm({
    initialPin,
    initialIsOpen,
}: {
    initialPin: string
    initialIsOpen: boolean
}) {
    const router = useRouter()
    const [pin, setPin] = useState(initialPin)
    const [isOpen, setIsOpen] = useState(initialIsOpen)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const handleSubmit = () => {
        setError(null)
        setSuccess(false)
        const fd = new FormData()
        fd.append('pin', pin)
        if (isOpen) fd.append('is_open', 'on')
        startTransition(async () => {
            const res = await updateDashboardSettings(fd)
            if ((res as any)?.error) {
                setError((res as any).error)
            } else {
                setSuccess(true)
                router.refresh()
                setTimeout(() => setSuccess(false), 3000)
            }
        })
    }

    return (
        <form
            action={handleSubmit}
            className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-5"
        >
            <div className="space-y-1.5">
                <Label className="text-gray-300 text-xs uppercase tracking-wider">PIN de acceso</Label>
                <Input
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="0000"
                    minLength={4}
                    required
                    className="bg-black/40 border-white/10 text-white text-2xl tracking-[0.4em] font-mono text-center"
                />
                <p className="text-[10px] text-gray-500">
                    Mínimo 4 caracteres. Compártelo con quien quieras que vea el ranking.
                </p>
            </div>

            <label className="flex items-center gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isOpen}
                    onChange={(e) => setIsOpen(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400"
                />
                <div>
                    <p className="text-sm font-medium text-white">Dashboard activo</p>
                    <p className="text-[10px] text-gray-500">
                        Si lo desmarcas, el PIN deja de ser válido aunque sea correcto.
                    </p>
                </div>
            </label>

            {error && <p className="text-red-400 text-xs">{error}</p>}
            {success && (
                <p className="text-[#AAFF00] text-xs bg-[#AAFF00]/10 border border-[#AAFF00]/20 px-3 py-2 rounded-md">
                    Guardado correctamente.
                </p>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold"
            >
                {isPending ? "Guardando..." : "Guardar"}
            </Button>
        </form>
    )
}
