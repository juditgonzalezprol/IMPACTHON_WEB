'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        return redirect('/login?error=true&message=' + encodeURIComponent(error.message))
    }

    // Comprobar si el perfil está completo
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', user.id)
            .single()

        const emailPrefix = user.email?.split('@')[0] ?? ''
        // A "real" name is one that differs from the auto-generated email prefix
        const hasRealName = profile?.full_name &&
            profile.full_name !== 'Usuario Nuevo' &&
            profile.full_name !== emailPrefix

        revalidatePath('/', 'layout')
        if (hasRealName) {
            redirect('/equipos') // Redirigir al dashboard
        } else {
            redirect('/onboarding') // Redirigir a rellenar el perfil
        }
    }

    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        return redirect('/login?signupError=true&message=' + encodeURIComponent(error.message))
    }

    revalidatePath('/', 'layout')
    redirect('/login?signupSuccess=true') // Tell user to check their email
}
