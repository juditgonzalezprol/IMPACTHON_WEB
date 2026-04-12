'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

/**
 * Guarda (o actualiza) las notas que un juez le pone a un equipo en un reto
 * concreto. Crea la fila `evaluations` si no existe y hace upsert de las
 * filas en `evaluation_scores` (una por criterio).
 *
 * Espera en `formData`:
 *   - team_id, challenge_id
 *   - feedback (opcional)
 *   - score_<criterion_id>: número 0-10  (una entrada por criterio aplicable)
 */
export async function submitEvaluation(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const challengeId = formData.get('challenge_id') as string
    const feedback = (formData.get('feedback') as string) || null

    if (!teamId || !challengeId) {
        return { error: 'Faltan team_id o challenge_id' }
    }

    // Verificar que el juez está asignado a ese reto (defensa en profundidad,
    // las RLS también lo bloquean).
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Organizador') {
        const { data: assignment } = await supabase
            .from('jury_assignments')
            .select('challenge_id')
            .eq('jury_id', user.id)
            .eq('challenge_id', challengeId)
            .maybeSingle()

        if (!assignment) {
            return { error: 'No estás asignado a este reto.' }
        }
    }

    // Upsert evaluation
    const { data: evaluation, error: evalErr } = await supabase
        .from('evaluations')
        .upsert(
            {
                team_id: teamId,
                jury_id: user.id,
                challenge_id: challengeId,
                feedback,
                submitted_at: new Date().toISOString(),
            },
            { onConflict: 'team_id,jury_id,challenge_id' }
        )
        .select('id')
        .single()

    if (evalErr || !evaluation) {
        return { error: evalErr?.message || 'No se pudo guardar la evaluación' }
    }

    // Recoger todas las entradas score_<id>
    const scoreRows: { evaluation_id: string; criterion_id: string; score: number }[] = []
    for (const [key, value] of formData.entries()) {
        if (!key.startsWith('score_')) continue
        const criterionId = key.replace('score_', '')
        const num = parseFloat(value as string)
        if (!Number.isFinite(num)) continue
        scoreRows.push({
            evaluation_id: evaluation.id,
            criterion_id: criterionId,
            score: Math.max(0, Math.min(10, num)),
        })
    }

    if (scoreRows.length > 0) {
        const { error: scoreErr } = await supabase
            .from('evaluation_scores')
            .upsert(scoreRows, { onConflict: 'evaluation_id,criterion_id' })

        if (scoreErr) {
            return { error: scoreErr.message }
        }
    }

    revalidatePath('/jurado')
    revalidatePath(`/jurado/${challengeId}`)
    revalidatePath(`/jurado/${challengeId}/${teamId}`)
    return { success: true }
}
