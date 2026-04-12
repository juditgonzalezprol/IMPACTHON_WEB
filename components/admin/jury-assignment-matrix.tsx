'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check } from 'lucide-react'
import { assignJury, unassignJury } from '@/app/admin/jurados/actions'

type Jury = { id: string; full_name: string; contact_email: string | null }
type Challenge = { id: string; title: string }
type Assignment = { jury_id: string; challenge_id: string }

export default function JuryAssignmentMatrix({
    juries,
    challenges,
    assignments,
}: {
    juries: Jury[]
    challenges: Challenge[]
    assignments: Assignment[]
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const isAssigned = (juryId: string, challengeId: string) =>
        assignments.some(a => a.jury_id === juryId && a.challenge_id === challengeId)

    const toggle = (juryId: string, challengeId: string) => {
        const fd = new FormData()
        fd.append('jury_id', juryId)
        fd.append('challenge_id', challengeId)
        const action = isAssigned(juryId, challengeId) ? unassignJury : assignJury
        startTransition(async () => {
            await action(fd)
            router.refresh()
        })
    }

    const judgesPerChallenge = (chId: string) =>
        assignments.filter(a => a.challenge_id === chId).length

    return (
        <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead className="bg-white/5">
                        <tr>
                            <th className="text-left px-4 py-3 font-semibold text-gray-400 sticky left-0 bg-white/5">
                                Juez
                            </th>
                            {challenges.map(ch => (
                                <th key={ch.id} className="px-3 py-3 font-semibold text-gray-400 text-center min-w-[120px]">
                                    <div className="text-xs">{ch.title}</div>
                                    <div className="text-[10px] font-normal text-purple-400 mt-0.5">
                                        {judgesPerChallenge(ch.id)} jueces
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {juries.map(j => (
                            <tr key={j.id} className="hover:bg-white/5">
                                <td className="px-4 py-3 sticky left-0 bg-black/60">
                                    <p className="font-medium text-white">{j.full_name}</p>
                                    {j.contact_email && (
                                        <p className="text-[10px] text-gray-500">{j.contact_email}</p>
                                    )}
                                </td>
                                {challenges.map(ch => {
                                    const on = isAssigned(j.id, ch.id)
                                    return (
                                        <td key={ch.id} className="px-3 py-3 text-center">
                                            <button
                                                type="button"
                                                disabled={isPending}
                                                onClick={() => toggle(j.id, ch.id)}
                                                className={`w-7 h-7 rounded-md border transition-all flex items-center justify-center mx-auto ${
                                                    on
                                                        ? 'bg-purple-500 border-purple-400 text-white'
                                                        : 'bg-transparent border-white/20 hover:border-purple-400 text-transparent hover:bg-purple-500/10'
                                                }`}
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
