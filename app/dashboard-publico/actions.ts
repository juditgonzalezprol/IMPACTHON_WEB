'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const COOKIE_NAME = 'public_dashboard_token'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24h

/**
 * Valida el PIN introducido contra `public_dashboard_settings.pin`.
 * Si coincide, planta una cookie httpOnly que el server component
 * comprueba para renderizar el leaderboard.
 *
 * Nota: usamos el cliente normal de Supabase (anon) porque la fila
 * solo es leíble por Organizadores. Para validar desde aquí necesitamos
 * un RPC público — de momento lo hacemos con SECURITY DEFINER en SQL.
 */
export async function validatePin(formData: FormData) {
    const pin = (formData.get('pin') as string)?.trim()
    if (!pin) return { error: 'Introduce un PIN' }

    const supabase = await createClient()

    // RPC con SECURITY DEFINER que devuelve true/false. Si no existe la
    // función todavía, hacemos fallback comparando contra la fila por
    // service role; aquí asumimos el RPC `validate_dashboard_pin`.
    const { data, error } = await supabase.rpc('validate_dashboard_pin', { pin_to_check: pin })

    if (error) {
        return { error: `No se pudo validar el PIN: ${error.message}` }
    }

    if (data !== true) {
        return { error: 'PIN incorrecto' }
    }

    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, pin, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/',
    })

    redirect('/dashboard-publico')
}

export async function logoutPublicDashboard() {
    const cookieStore = await cookies()
    cookieStore.delete(COOKIE_NAME)
    redirect('/dashboard-publico')
}

/**
 * Llamado desde el server component para saber si el visitante tiene
 * un PIN válido en la cookie.
 */
export async function hasValidPin(): Promise<boolean> {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return false

    const supabase = await createClient()
    const { data, error } = await supabase.rpc('validate_dashboard_pin', { pin_to_check: token })
    if (error) return false
    return data === true
}
