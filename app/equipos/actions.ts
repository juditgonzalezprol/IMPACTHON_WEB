'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createTeam(formData: FormData) {
    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) return redirect('/login')

    const name = formData.get('name') as string
    const description = formData.get('description') as string

    // 1. Create the team
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({ name, description })
        .select('id')
        .single()

    if (teamError) {
        return { error: teamError.message }
    }

    // 2. Add the creator as a team member
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({ user_id: user.id, team_id: team.id })

    if (memberError) {
        return { error: memberError.message }
    }

    revalidatePath('/equipos')
    return { success: true }
}

export async function joinTeam(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string

    // Add user to team (RLS policies will allow this insert if authenticated)
    // Also the Primary Key constraint on user_id will fail if they are already in a team
    const { error } = await supabase
        .from('team_members')
        .insert({ user_id: user.id, team_id: teamId })

    if (error) {
        return { error: "Ya estás en un equipo o hubo un error al unirte." }
    }

    revalidatePath('/equipos')
    return { success: true }
}

export async function leaveTeam(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('user_id', user.id)

    if (error) {
        return { error: error.message }
    }

    // Note: if a team becomes empty, we could delete it here or leave it. 
    // Let's leave it for now so users can rejoin.

    revalidatePath('/equipos')
    return { success: true }
}

export async function updateTeam(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return redirect('/login')

    const teamId = formData.get('team_id') as string
    const description = formData.get('description') as string
    const github_url = formData.get('github_url') as string | null
    const demo_url = formData.get('demo_url') as string | null

    const { error } = await supabase
        .from('teams')
        .update({ description, github_url, demo_url })
        .eq('id', teamId)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/equipos')
    return { success: true }
}
