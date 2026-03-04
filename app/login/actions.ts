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
        return redirect('/login?error=true&message=' + error.message)
    }

    // Comprobar si el perfil está completo
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, bio, role')
            .eq('id', user.id)
            .single()

        // Si tiene perfil y el full_name es diferente de "Usuario Nuevo"
        if (profile && profile.full_name !== 'Usuario Nuevo') {
            revalidatePath('/', 'layout')
            redirect('/equipos') // Redirigir al dashboard
        } else {
            revalidatePath('/', 'layout')
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
        return redirect('/login?signupError=true&message=' + error.message)
    }

    revalidatePath('/', 'layout')
    redirect('/onboarding') // Tras el signup siempre van al onboarding
}
