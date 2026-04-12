'use client'

import { useState, useTransition } from 'react'
import { Lock } from 'lucide-react'
import { validatePin } from '@/app/dashboard-publico/actions'

export default function PinForm() {
    const [pin, setPin] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isPending, startTransition] = useTransition()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        const fd = new FormData()
        fd.append('pin', pin)
        startTransition(async () => {
            const res = await validatePin(fd)
            if ((res as any)?.error) {
                setError((res as any).error)
            }
            // Si todo va bien, validatePin hace redirect() y no volvemos.
        })
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl space-y-6"
        >
            <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center mb-4">
                    <Lock className="w-7 h-7 text-[#AAFF00]" />
                </div>
                <h1 className="text-2xl font-bold">Dashboard público</h1>
                <p className="text-sm text-gray-400 mt-1">Introduce el PIN para ver las notas en directo.</p>
            </div>
            <input
                type="text"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                inputMode="numeric"
                autoFocus
                placeholder="PIN"
                className="w-full text-center text-2xl tracking-[0.5em] font-mono bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#AAFF00]"
            />
            {error && (
                <p className="text-red-400 text-xs text-center font-medium">{error}</p>
            )}
            <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 rounded-xl bg-[#AAFF00] hover:bg-[#BBFF33] text-black font-bold transition-all disabled:opacity-50"
            >
                {isPending ? 'Comprobando...' : 'Entrar'}
            </button>
        </form>
    )
}
