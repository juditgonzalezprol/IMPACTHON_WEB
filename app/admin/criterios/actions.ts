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

export async function createCriterion(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const kind = formData.get('kind') as 'specific' | 'general'
    const challengeId = (formData.get('challenge_id') as string) || null
    const name = formData.get('name') as string
    const description = (formData.get('description') as string) || null
    const weight = parseFloat(formData.get('weight') as string) || 1.0
    const orderIndex = parseInt(formData.get('order_index') as string) || 0

    if (!name || !kind) return { error: 'name y kind son obligatorios' }
    if (kind === 'specific' && !challengeId) return { error: 'specific necesita challenge_id' }

    const { error: insertErr } = await supabase.from('evaluation_criteria').insert({
        kind,
        challenge_id: kind === 'specific' ? challengeId : null,
        name,
        description,
        weight,
        order_index: orderIndex,
    })
    if (insertErr) return { error: insertErr.message }

    revalidatePath('/admin/criterios')
    return { success: true }
}

export async function updateCriterion(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const id = formData.get('id') as string
    const name = formData.get('name') as string
    const description = (formData.get('description') as string) || null
    const weight = parseFloat(formData.get('weight') as string) || 1.0
    const orderIndex = parseInt(formData.get('order_index') as string) || 0

    if (!id) return { error: 'id requerido' }

    const { error: updErr } = await supabase
        .from('evaluation_criteria')
        .update({ name, description, weight, order_index: orderIndex })
        .eq('id', id)
    if (updErr) return { error: updErr.message }

    revalidatePath('/admin/criterios')
    return { success: true }
}

export async function deleteCriterion(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const id = formData.get('id') as string
    if (!id) return { error: 'id requerido' }

    const { error: delErr } = await supabase
        .from('evaluation_criteria')
        .delete()
        .eq('id', id)
    if (delErr) return { error: delErr.message }

    revalidatePath('/admin/criterios')
    return { success: true }
}
