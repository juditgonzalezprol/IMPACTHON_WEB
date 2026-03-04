require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Usamos el SERVICE ROLE KEY para poder saltarnos las reglas de seguridad y crear usuarios a la fuerza
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY_SUPABASE // Leyendo tu nombre de variable personalizado
);

const usuariosTest = [
    { email: 'jurado1@hackathon.com', nombre: 'Jurado Uno', rol: 'Jurado' },
    { email: 'jurado2@hackathon.com', nombre: 'Jurado Dos', rol: 'Jurado' },
    { email: 'jurado3@hackathon.com', nombre: 'Jurado Tres', rol: 'Jurado' },
    { email: 'staff1@hackathon.com', nombre: 'Staff Uno', rol: 'Staff' },
    { email: 'staff2@hackathon.com', nombre: 'Staff Dos', rol: 'Staff' },
    { email: 'staff3@hackathon.com', nombre: 'Staff Tres', rol: 'Staff' },
    { email: 'admin@hackathon.com', nombre: 'Admin Supremo', rol: 'Organizador' },
];

const passwordGenerica = "Hackathon2025!";

async function crearUsuarios() {
    console.log("Creando usuarios...");

    for (const usuario of usuariosTest) {
        // 1. Crear la cuenta en auth.users saltando el email verificado
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email: usuario.email,
            password: passwordGenerica,
            email_confirm: true,
            user_metadata: { full_name: usuario.nombre }
        });

        if (authError) {
            console.error(`❌ Error creando a ${usuario.email}:`, authError.message);
            continue;
        }

        const userId = authData.user.id;

        // 2. Importante: Esperar 1 segundo para que salte el Trigger de la BD que le crea el perfil en blanco
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Forzar el cambio de rol a Staff/Jurado en la tabla perfiles usando la Super Llave
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ role: usuario.rol, full_name: usuario.nombre })
            .eq('id', userId);

        if (profileError) {
            console.error(`❌ Creado en Auth, pero falló al aplicar el rol '${usuario.rol}' a ${usuario.email}:`, profileError.message);
        } else {
            console.log(`✅ Creado con éxito: ${usuario.email} (Contraseña: ${passwordGenerica}) - ROL: ${usuario.rol}`);
        }
    }

    console.log("¡Proceso terminado!");
}

crearUsuarios();
