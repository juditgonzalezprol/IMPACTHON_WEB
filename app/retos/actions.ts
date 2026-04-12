'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function registerToChallenge(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const challengeId = formData.get('challenge_id') as string
    const teamId = formData.get('team_id') as string

    const { error } = await supabase
        .from('challenge_registrations')
        .insert({ team_id: teamId, challenge_id: challengeId })

    if (error) {
        return { error: 'Error al inscribirse: ' + error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}

export async function unregisterFromChallenge(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const challengeId = formData.get('challenge_id') as string
    const teamId = formData.get('team_id') as string

    const { error } = await supabase
        .from('challenge_registrations')
        .delete()
        .eq('team_id', teamId)
        .eq('challenge_id', challengeId)

    if (error) {
        return { error: 'Error al desapuntarse: ' + error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}

export async function addDeliverable(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const url = formData.get('url') as string
    const challengeId = (formData.get('challenge_id') as string) || null

    const { error } = await supabase
        .from('deliverables')
        .insert({
            team_id: teamId,
            title,
            description: description || null,
            url,
            challenge_id: challengeId,
        })

    if (error) {
        return { error: 'Error al añadir entregable: ' + error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}

export async function deleteDeliverable(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const deliverableId = formData.get('deliverable_id') as string

    const { error } = await supabase
        .from('deliverables')
        .delete()
        .eq('id', deliverableId)

    if (error) {
        return { error: 'Error al eliminar: ' + error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}

export async function updateProjectDescription(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const description = formData.get('description') as string

    const { error } = await supabase
        .from('teams')
        .update({ description })
        .eq('id', teamId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}

export async function updateRepoUrl(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const githubUrl = formData.get('github_url') as string
    const challengeId = (formData.get('challenge_id') as string) || null

    if (challengeId) {
        // Repo per challenge registration
        const { error } = await supabase
            .from('challenge_registrations')
            .update({ github_url: githubUrl })
            .eq('team_id', teamId)
            .eq('challenge_id', challengeId)

        if (error) return { error: error.message }
    } else {
        // Legacy: team-level repo
        const { error } = await supabase
            .from('teams')
            .update({ github_url: githubUrl })
            .eq('id', teamId)

        if (error) return { error: error.message }
    }

    revalidatePath('/retos')
    return { success: true }
}
