'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function saveProfile(formData: FormData) {
    console.log("=== STARTING SAVEPROFILE ACTION ===")

    const supabase = await createClient()

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        console.error("Auth Error or No User:", authError)
        redirect('/login')
    }

    const fullName = formData.get('full_name') as string
    const bio = formData.get('bio') as string
    const linkedinUrl = formData.get('linkedin_url') as string
    const githubUrl = formData.get('github_url') as string
    const needsCredits = formData.get('needs_credits') === 'on'

    console.log("FormData Payload:", { fullName, bio, linkedinUrl, githubUrl, needsCredits })

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            full_name: fullName,
            bio: bio,
            linkedin_url: linkedinUrl,
            github_url: githubUrl,
            needs_credits: needsCredits,
            role: 'Asistente',
        })

    if (error) {
        console.error("Supabase Profiles Update Error:", error)
        return redirect(`/onboarding?error=true&message=${error.message}`)
    }

    console.log("Profile successfully updated for user:", user.id)
    revalidatePath('/', 'layout')
    redirect('/equipos') // Redirigir al dashboard de equipos una vez completado
}
