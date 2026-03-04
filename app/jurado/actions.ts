'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function submitEvaluation(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const scoreIdea = parseInt(formData.get('score_idea') as string)
    const scoreExecution = parseInt(formData.get('score_execution') as string)
    const scorePresentation = parseInt(formData.get('score_presentation') as string)
    const feedback = formData.get('feedback') as string

    // Insert or update evaluation
    const { error } = await supabase
        .from('evaluations')
        .upsert({
            jury_id: user.id,
            team_id: teamId,
            score_idea: scoreIdea,
            score_execution: scoreExecution,
            score_presentation: scorePresentation,
            feedback: feedback
        }, {
            onConflict: 'team_id,jury_id'
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/jurado')
    return { success: true }
}
