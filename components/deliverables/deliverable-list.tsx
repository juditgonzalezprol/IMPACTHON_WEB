'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addDeliverable, deleteDeliverable } from "@/app/retos/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Plus, Trash2, X } from "lucide-react"

export default function DeliverableList({
    teamId,
    deliverables,
}: {
    teamId: string
    deliverables: any[]
}) {
    const router = useRouter()
    const [showForm, setShowForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    async function handleAdd(formData: FormData) {
        setLoading(true)
        setError(null)
        formData.append('team_id', teamId)

        const res = await addDeliverable(formData)
        if (res?.error) {
            setError(res.error)
        } else {
            setShowForm(false)
            router.refresh()
        }
        setLoading(false)
    }

    async function handleDelete(id: string) {
        setDeletingId(id)
        const formData = new FormData()
        formData.append('deliverable_id', id)

        await deleteDeliverable(formData)
        router.refresh()
        setDeletingId(null)
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Entregables adicionales</h3>
                {!showForm && (
                    <Button
                        size="sm"
                        onClick={() => setShowForm(true)}
                        className="bg-[#AAFF00]/10 text-[#AAFF00] hover:bg-[#AAFF00]/20 border border-[#AAFF00]/30"
                        variant="outline"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Añadir
                    </Button>
                )}
            </div>

            {/* List */}
            {deliverables.length === 0 && !showForm && (
                <p className="text-gray-500 text-sm py-4">
                    Todavía no habéis añadido entregables.
                </p>
            )}

            <div className="space-y-2">
                {deliverables.map((d) => (
                    <div
                        key={d.id}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white">{d.title}</h4>
                            {d.description && (
                                <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{d.description}</p>
                            )}
                            <a
                                href={d.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-[#AAFF00] hover:text-[#BBFF33] mt-1.5 transition-colors"
                            >
                                <ExternalLink className="w-3 h-3" />
                                <span className="truncate max-w-[300px]">{d.url}</span>
                            </a>
                        </div>
                        <button
                            onClick={() => handleDelete(d.id)}
                            disabled={deletingId === d.id}
                            className="shrink-0 p-1.5 text-gray-500 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Add form */}
            {showForm && (
                <form
                    action={handleAdd}
                    className="mt-4 space-y-3 p-5 rounded-xl border border-[#AAFF00]/20 bg-[#AAFF00]/5"
                >
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Título *</label>
                        <Input
                            name="title"
                            required
                            placeholder="Ej: Presentación, Vídeo demo, Figma..."
                            className="bg-black/50 border-white/20 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Descripción</label>
                        <Input
                            name="description"
                            placeholder="Breve descripción (opcional)"
                            className="bg-black/50 border-white/20 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 mb-1">Enlace *</label>
                        <Input
                            name="url"
                            type="url"
                            required
                            placeholder="https://..."
                            className="bg-black/50 border-white/20 text-sm"
                        />
                    </div>

                    {error && <p className="text-red-400 text-xs">{error}</p>}

                    <div className="flex gap-2 pt-1">
                        <Button
                            type="submit"
                            disabled={loading}
                            size="sm"
                            className="bg-[#AAFF00] text-black hover:bg-[#BBFF33] font-bold"
                        >
                            {loading ? "Guardando..." : "Añadir entregable"}
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => { setShowForm(false); setError(null) }}
                            className="border-white/20 bg-transparent text-gray-300 hover:text-white"
                        >
                            Cancelar
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
