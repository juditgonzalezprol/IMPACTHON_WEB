'use client'

import { useEffect, useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Trophy, Star } from 'lucide-react'
import {
    teamScoreForChallenge,
    teamGeneralScore,
    teamCriterionAverage,
    type Criterion,
    type Score,
    type Evaluation,
} from '@/lib/scoring'

type Challenge = { id: string; title: string; has_jury: boolean }
type Team = { id: string; name: string }
type Registration = { team_id: string; challenge_id: string }

type LeaderboardRow = {
    team: Team
    total: number | null
    juryCount: number
    perCriterion: { criterion: Criterion; value: number | null }[]
}

export default function PublicLeaderboard({
    challenges,
    teams,
    registrations,
    criteria,
    evaluations: initialEvaluations,
    scores: initialScores,
}: {
    challenges: Challenge[]
    teams: Team[]
    registrations: Registration[]
    criteria: Criterion[]
    evaluations: Evaluation[]
    scores: Score[]
}) {
    const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations)
    const [scores, setScores] = useState<Score[]>(initialScores)

    // Suscripción realtime: cuando cambia evaluations o evaluation_scores, recargamos.
    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const refresh = async () => {
            const [{ data: evs }, { data: scs }] = await Promise.all([
                supabase.from('evaluations').select('id, team_id, jury_id, challenge_id'),
                supabase.from('evaluation_scores').select('evaluation_id, criterion_id, score'),
            ])
            if (evs) setEvaluations(evs as Evaluation[])
            if (scs) setScores(scs as Score[])
        }

        const channel = supabase
            .channel('public_leaderboard')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluations' }, refresh)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'evaluation_scores' }, refresh)
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    const teamsById = useMemo(() => {
        const m = new Map<string, Team>()
        for (const t of teams) m.set(t.id, t)
        return m
    }, [teams])

    const generalCriteria = useMemo(
        () =>
            criteria
                .filter(c => c.kind === 'general')
                .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0)),
        [criteria]
    )

    // Por reto: ranking detallado de equipos inscritos
    const perChallenge = useMemo(() => {
        return challenges.map(ch => {
            const specificCriteria = criteria
                .filter(c => c.kind === 'specific' && c.challenge_id === ch.id)
                .sort((a: any, b: any) => (a.order_index ?? 0) - (b.order_index ?? 0))

            const teamIds = registrations
                .filter(r => r.challenge_id === ch.id)
                .map(r => r.team_id)

            const rows: LeaderboardRow[] = teamIds
                .map(tid => {
                    const team = teamsById.get(tid)
                    if (!team) return null
                    const { value: total, juryCount } = teamScoreForChallenge({
                        teamId: tid,
                        challengeId: ch.id,
                        criteria,
                        evaluations,
                        scores,
                    })
                    const perCriterion = specificCriteria.map(crit => ({
                        criterion: crit,
                        value: teamCriterionAverage({
                            teamId: tid,
                            criterion: crit,
                            evaluations,
                            scores,
                        }).value,
                    }))
                    return { team, total, juryCount, perCriterion }
                })
                .filter((r): r is LeaderboardRow => r !== null)

            rows.sort((a, b) => (b.total ?? -1) - (a.total ?? -1))
            return { challenge: ch, criteria: specificCriteria, rows }
        })
    }, [challenges, registrations, criteria, evaluations, scores, teamsById])

    // Ranking general detallado
    const generalRanking = useMemo(() => {
        const teamIds = Array.from(new Set(evaluations.map(e => e.team_id)))
        const rows: LeaderboardRow[] = teamIds
            .map(tid => {
                const team = teamsById.get(tid)
                if (!team) return null
                const { value: total, juryCount } = teamGeneralScore({
                    teamId: tid,
                    criteria,
                    evaluations,
                    scores,
                })
                const perCriterion = generalCriteria.map(crit => ({
                    criterion: crit,
                    value: teamCriterionAverage({
                        teamId: tid,
                        criterion: crit,
                        evaluations,
                        scores,
                    }).value,
                }))
                return { team, total, juryCount, perCriterion }
            })
            .filter((r): r is LeaderboardRow => r !== null)
        rows.sort((a, b) => (b.total ?? -1) - (a.total ?? -1))
        return rows
    }, [evaluations, criteria, scores, teamsById, generalCriteria])

    return (
        <div className="space-y-10">
            {/* Ranking general */}
            <section className="rounded-3xl border border-[#AAFF00]/30 bg-[#AAFF00]/5 p-6">
                <div className="flex items-center gap-2 mb-2">
                    <Star className="w-5 h-5 text-[#AAFF00]" />
                    <h2 className="text-xl font-bold text-[#AAFF00]">Clasificación general (final)</h2>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                    Media por criterio general en todas las evaluaciones del equipo.
                    {/* TODO(fairness): media simple sin normalización entre jueces. */}
                </p>
                <DetailedTable
                    rows={generalRanking}
                    criteriaCols={generalCriteria}
                    highlightTop
                />
            </section>

            {/* Por reto */}
            <div className="space-y-6">
                {perChallenge.map(({ challenge, criteria: critCols, rows }) => (
                    <section
                        key={challenge.id}
                        className="rounded-3xl border border-white/10 bg-white/5 p-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy className="w-5 h-5 text-purple-400" />
                            <h2 className="text-lg font-bold">{challenge.title}</h2>
                        </div>
                        <DetailedTable rows={rows} criteriaCols={critCols} />
                    </section>
                ))}
            </div>
        </div>
    )
}

function DetailedTable({
    rows,
    criteriaCols,
    highlightTop = false,
}: {
    rows: LeaderboardRow[]
    criteriaCols: Criterion[]
    highlightTop?: boolean
}) {
    if (rows.length === 0) {
        return <p className="text-sm text-gray-500 italic">Sin datos todavía.</p>
    }
    if (criteriaCols.length === 0) {
        return <p className="text-sm text-gray-500 italic">Este reto aún no tiene criterios definidos.</p>
    }

    const totalWeight = criteriaCols.reduce((acc, c) => acc + c.weight, 0)

    return (
        <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm border-separate border-spacing-y-1 px-2">
                <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-gray-500">
                        <th className="text-left font-semibold px-3 py-2 w-12">#</th>
                        <th className="text-left font-semibold px-3 py-2">Equipo</th>
                        {criteriaCols.map(c => {
                            const pct = totalWeight > 0 ? Math.round((c.weight / totalWeight) * 100) : 0
                            const showPct = !criteriaCols.every(x => x.weight === criteriaCols[0].weight)
                            return (
                                <th
                                    key={c.id}
                                    className="text-center font-semibold px-2 py-2 min-w-[88px]"
                                    title={c.name}
                                >
                                    <div className="leading-tight">{c.name}</div>
                                    {showPct && (
                                        <div className="text-[9px] text-purple-400 mt-0.5 normal-case">
                                            {pct}%
                                        </div>
                                    )}
                                </th>
                            )
                        })}
                        <th className="text-right font-semibold px-3 py-2 min-w-[80px]">Total</th>
                        <th className="text-right font-semibold px-3 py-2 min-w-[60px]">Jueces</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, idx) => {
                        const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`
                        const isTop = idx === 0 && highlightTop
                        return (
                            <tr
                                key={r.team.id}
                                className={`${
                                    isTop
                                        ? 'bg-[#AAFF00]/10 outline outline-1 outline-[#AAFF00]/40'
                                        : 'bg-black/30 hover:bg-white/5'
                                } rounded-xl transition-colors`}
                            >
                                <td className="px-3 py-3 font-bold tabular-nums rounded-l-xl">
                                    {medal}
                                </td>
                                <td className="px-3 py-3 font-medium text-white truncate max-w-[220px]">
                                    {r.team.name}
                                </td>
                                {r.perCriterion.map(({ criterion, value }) => (
                                    <td
                                        key={criterion.id}
                                        className="px-2 py-3 text-center tabular-nums"
                                    >
                                        <ScoreCell value={value} />
                                    </td>
                                ))}
                                <td className="px-3 py-3 text-right tabular-nums font-bold text-base">
                                    {r.total !== null ? r.total.toFixed(2) : '—'}
                                </td>
                                <td className="px-3 py-3 text-right text-xs text-gray-400 rounded-r-xl">
                                    {r.juryCount}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

function ScoreCell({ value }: { value: number | null }) {
    if (value === null) {
        return <span className="text-gray-600">—</span>
    }
    const color =
        value >= 8
            ? 'text-[#AAFF00]'
            : value >= 6
              ? 'text-white'
              : value >= 4
                ? 'text-yellow-400'
                : 'text-red-400'
    return <span className={`font-medium ${color}`}>{value.toFixed(1)}</span>
}
