'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

async function checkStaffRole() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'Staff' && profile?.role !== 'Organizador') {
        return null
    }

    return { user, supabase }
}

// ==========================================
// EVENTS (AGENDA) ACTIONS
// ==========================================

export async function createEvent(formData: FormData) {
    const context = await checkStaffRole()
    if (!context) return { error: "No autorizado" }
    const { supabase } = context

    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const location = formData.get('location') as string
    const start_time = formData.get('start_time') as string
    const end_time = formData.get('end_time') as string
    const track = (formData.get('track') as string) || 'todos'

    const { error } = await supabase
        .from('events')
        .insert({ title, description, location, start_time, end_time, track })

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/home')
    revalidatePath('/staff')
    return { success: true }
}

export async function deleteEvent(formData: FormData) {
    const context = await checkStaffRole()
    if (!context) return { error: "No autorizado" }
    const { supabase } = context

    const id = formData.get('id') as string

    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/staff')
    return { success: true }
}

// ==========================================
// ANNOUNCEMENTS ACTIONS
// ==========================================

export async function createAnnouncement(formData: FormData) {
    const context = await checkStaffRole()
    if (!context) return { error: "No autorizado" }
    const { supabase } = context

    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const is_pinned = formData.get('is_pinned') === 'true'

    const { error } = await supabase
        .from('announcements')
        .insert({ title, content, is_pinned })

    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/noticias')
    revalidatePath('/staff')
    return { success: true }
}

export async function deleteAnnouncement(formData: FormData) {
    const context = await checkStaffRole()
    if (!context) return { error: "No autorizado" }
    const { supabase } = context

    const id = formData.get('id') as string

    const { error } = await supabase.from('announcements').delete().eq('id', id)
    if (error) return { error: error.message }

    revalidatePath('/')
    revalidatePath('/noticias')
    revalidatePath('/staff')
    return { success: true }
}
