import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            // Check if profile is complete
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('full_name')
                    .eq('id', user.id)
                    .single()

                // If the profile has a real name (not auto-generated from email), go to dashboard
                const emailPrefix = user.email?.split('@')[0] ?? ''
                const hasRealName = profile?.full_name && profile.full_name !== emailPrefix && profile.full_name !== 'Usuario Nuevo'

                if (hasRealName) {
                    return NextResponse.redirect(`${origin}/equipos`)
                } else {
                    return NextResponse.redirect(`${origin}/onboarding`)
                }
            }
        }
    }

    // Return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/login?error=true&message=El+enlace+de+confirmación+es+inválido+o+ha+expirado`)
}
