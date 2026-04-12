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

export async function updateDashboardSettings(formData: FormData) {
    const { error, supabase } = await requireOrganizador()
    if (error) return { error }

    const pin = (formData.get('pin') as string)?.trim()
    const isOpen = formData.get('is_open') === 'on'

    if (!pin || pin.length < 4) return { error: 'El PIN debe tener al menos 4 caracteres' }

    const { error: updErr } = await supabase
        .from('public_dashboard_settings')
        .update({ pin, is_open: isOpen, updated_at: new Date().toISOString() })
        .eq('id', 1)

    if (updErr) return { error: updErr.message }

    revalidatePath('/admin/dashboard-publico')
    return { success: true }
}
