import { createClient } from "@/lib/supabase/server"
import { hasValidPin } from "./actions"
import { Trophy } from "lucide-react"
import PublicLeaderboard from "@/components/dashboard-publico/public-leaderboard"
import PinForm from "@/components/dashboard-publico/pin-form"
import type { Criterion, Score, Evaluation } from "@/lib/scoring"

export const dynamic = "force-dynamic"

export default async function DashboardPublicoPage() {
    const ok = await hasValidPin()
    if (!ok) {
        return <PinGate />
    }

    const supabase = await createClient()

    // Cargar todo lo necesario para el leaderboard.
    // El cliente realtime se suscribe luego para actualizaciones en vivo.
    const [
        { data: challenges },
        { data: teams },
        { data: registrations },
        { data: criteria },
        { data: evaluations },
        { data: scores },
    ] = await Promise.all([
        supabase.from('challenges').select('id, title, has_jury').eq('has_jury', true).order('created_at'),
        supabase.from('teams').select('id, name'),
        supabase.from('challenge_registrations').select('team_id, challenge_id'),
        supabase
            .from('evaluation_criteria')
            .select('id, name, weight, kind, challenge_id, order_index'),
        supabase
            .from('evaluations')
            .select('id, team_id, jury_id, challenge_id'),
        supabase
            .from('evaluation_scores')
            .select('evaluation_id, criterion_id, score'),
    ])

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div
                    className="w-full h-full"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(170, 255, 0, 0.08) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#AAFF00]/10 border border-[#AAFF00]/20 flex items-center justify-center">
                        <Trophy className="text-[#AAFF00] w-7 h-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold">Leaderboard en directo</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Notas en tiempo real. Las notas se actualizan según los jueces van guardando.
                        </p>
                    </div>
                </div>

                <PublicLeaderboard
                    challenges={(challenges as any) || []}
                    teams={(teams as any) || []}
                    registrations={(registrations as any) || []}
                    criteria={(criteria as Criterion[]) || []}
                    evaluations={(evaluations as Evaluation[]) || []}
                    scores={(scores as Score[]) || []}
                />
            </div>
        </main>
    )
}

function PinGate() {
    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
            <PinForm />
        </main>
    )
}
