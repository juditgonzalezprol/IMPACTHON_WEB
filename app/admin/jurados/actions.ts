'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function requireOrganizador() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
    if (profile?.role !== 'Organizador') {
        return { error: 'Solo Organizadores.' as const, supabase: null as any }
    }
    return { error: null, supabase }
}

export async function assignJury(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const juryId = formData.get('jury_id') as string
    const challengeId = formData.get('challenge_id') as string
    if (!juryId || !challengeId) return { error: 'jury_id y challenge_id requeridos' }

    const { error: insertErr } = await supabase
        .from('jury_assignments')
        .insert({ jury_id: juryId, challenge_id: challengeId })
    if (insertErr) return { error: insertErr.message }

    revalidatePath('/admin/jurados')
    return { success: true }
}

export async function unassignJury(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const juryId = formData.get('jury_id') as string
    const challengeId = formData.get('challenge_id') as string
    if (!juryId || !challengeId) return { error: 'jury_id y challenge_id requeridos' }

    const { error: delErr } = await supabase
        .from('jury_assignments')
        .delete()
        .eq('jury_id', juryId)
        .eq('challenge_id', challengeId)
    if (delErr) return { error: delErr.message }

    revalidatePath('/admin/jurados')
    return { success: true }
}
