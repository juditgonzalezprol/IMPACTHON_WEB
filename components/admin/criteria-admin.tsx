'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { createCriterion, updateCriterion, deleteCriterion } from '@/app/admin/criterios/actions'

type Challenge = { id: string; title: string }
type Criterion = {
    id: string
    name: string
    description: string | null
    weight: number
    kind: 'specific' | 'general'
    challenge_id: string | null
    order_index: number
}

export default function CriteriaAdmin({
    challenges,
    criteria,
}: {
    challenges: Challenge[]
    criteria: Criterion[]
}) {
    const general = criteria.filter(c => c.kind === 'general')

    return (
        <div className="space-y-10">
            {/* Generales */}
            <Section
                title="Criterios generales"
                subtitle="Comunes a todos los retos. Definen la clasificación a la final."
                challengeId={null}
                criteria={general}
            />

            {/* Por reto */}
            {challenges.map(ch => {
                const list = criteria.filter(c => c.kind === 'specific' && c.challenge_id === ch.id)
                return (
                    <Section
                        key={ch.id}
                        title={ch.title}
                        subtitle="Criterios específicos del reto. Definen el ganador del reto."
                        challengeId={ch.id}
                        criteria={list}
                    />
                )
            })}
        </div>
    )
}

function Section({
    title,
    subtitle,
    challengeId,
    criteria,
}: {
    title: string
    subtitle: string
    challengeId: string | null
    criteria: Criterion[]
}) {
    const router = useRouter()
    const [showAdd, setShowAdd] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    const totalWeight = criteria.reduce((acc, c) => acc + c.weight, 0)

    const handleCreate = (formData: FormData) => {
        setError(null)
        formData.append('kind', challengeId ? 'specific' : 'general')
        if (challengeId) formData.append('challenge_id', challengeId)
        startTransition(async () => {
            const res = await createCriterion(formData)
            if ((res as any)?.error) {
                setError((res as any).error)
            } else {
                setShowAdd(false)
                router.refresh()
            }
        })
    }

    return (
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="flex items-start justify-between mb-4 gap-4">
                <div>
                    <h2 className="text-xl font-bold text-white">{title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
                </div>
                <Button
                    type="button"
                    onClick={() => setShowAdd(s => !s)}
                    className="bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold text-xs"
                    size="sm"
                >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Añadir
                </Button>
            </div>

            {showAdd && (
                <form
                    action={handleCreate}
                    className="mb-4 p-4 rounded-xl bg-black/40 border border-[#AAFF00]/20 space-y-3"
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1">
                            <Label className="text-xs text-gray-300">Nombre</Label>
                            <Input
                                name="name"
                                required
                                className="bg-black/40 border-white/10 text-white text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-300">Peso</Label>
                            <Input
                                name="weight"
                                type="number"
                                step="0.1"
                                defaultValue={1}
                                required
                                className="bg-black/40 border-white/10 text-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-300">Descripción</Label>
                        <Textarea
                            name="description"
                            className="bg-black/40 border-white/10 text-white text-sm min-h-[60px]"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-300">Orden</Label>
                        <Input
                            name="order_index"
                            type="number"
                            defaultValue={criteria.length + 1}
                            className="bg-black/40 border-white/10 text-white text-sm w-24"
                        />
                    </div>
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <Button type="submit" disabled={isPending} className="bg-[#AAFF00] text-black hover:bg-[#BBFF33]">
                        {isPending ? "Creando..." : "Crear criterio"}
                    </Button>
                </form>
            )}

            {criteria.length === 0 ? (
                <p className="text-sm text-gray-500 italic">Sin criterios todavía.</p>
            ) : (
                <ul className="space-y-3">
                    {criteria.map(c => (
                        <CriterionRow key={c.id} criterion={c} totalWeight={totalWeight} />
                    ))}
                </ul>
            )}
        </section>
    )
}

function CriterionRow({ criterion, totalWeight }: { criterion: Criterion; totalWeight: number }) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [editing, setEditing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const pct = totalWeight > 0 ? Math.round((criterion.weight / totalWeight) * 100) : 0

    const handleUpdate = (formData: FormData) => {
        setError(null)
        formData.append('id', criterion.id)
        startTransition(async () => {
            const res = await updateCriterion(formData)
            if ((res as any)?.error) {
                setError((res as any).error)
            } else {
                setEditing(false)
                router.refresh()
            }
        })
    }

    const handleDelete = () => {
        if (!confirm(`¿Borrar el criterio "${criterion.name}"?`)) return
        const fd = new FormData()
        fd.append('id', criterion.id)
        startTransition(async () => {
            const res = await deleteCriterion(fd)
            if ((res as any)?.error) {
                setError((res as any).error)
            } else {
                router.refresh()
            }
        })
    }

    if (editing) {
        return (
            <li className="p-4 rounded-xl border border-purple-500/30 bg-black/40">
                <form action={handleUpdate} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="md:col-span-2 space-y-1">
                            <Label className="text-xs text-gray-300">Nombre</Label>
                            <Input
                                name="name"
                                defaultValue={criterion.name}
                                required
                                className="bg-black/40 border-white/10 text-white text-sm"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-300">Peso</Label>
                            <Input
                                name="weight"
                                type="number"
                                step="0.1"
                                defaultValue={criterion.weight}
                                required
                                className="bg-black/40 border-white/10 text-white text-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-300">Descripción</Label>
                        <Textarea
                            name="description"
                            defaultValue={criterion.description || ""}
                            className="bg-black/40 border-white/10 text-white text-sm min-h-[60px]"
                        />
                    </div>
                    <Input
                        name="order_index"
                        type="hidden"
                        defaultValue={criterion.order_index}
                    />
                    {error && <p className="text-red-400 text-xs">{error}</p>}
                    <div className="flex gap-2">
                        <Button type="submit" disabled={isPending} size="sm" className="bg-purple-500 hover:bg-purple-400">
                            <Save className="w-3.5 h-3.5 mr-1" /> Guardar
                        </Button>
                        <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                            Cancelar
                        </Button>
                    </div>
                </form>
            </li>
        )
    }

    return (
        <li className="flex items-start justify-between gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex-1">
                <div className="flex items-baseline gap-3">
                    <h4 className="text-sm font-bold text-white">{criterion.name}</h4>
                    <span className="text-[10px] text-purple-400 font-bold">
                        peso {criterion.weight} ({pct}%)
                    </span>
                </div>
                {criterion.description && (
                    <p className="text-xs text-gray-400 mt-1">{criterion.description}</p>
                )}
                {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
            </div>
            <div className="flex gap-1">
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(true)}>
                    Editar
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    disabled={isPending}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </Button>
            </div>
        </li>
    )
}
