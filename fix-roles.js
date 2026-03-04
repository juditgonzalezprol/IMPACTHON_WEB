require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SERVICE_ROLE_KEY_SUPABASE
);

const rolesParams = [
    { email: 'jurado1@hackathon.com', nombre: 'Jurado Uno', rol: 'Jurado' },
    { email: 'jurado2@hackathon.com', nombre: 'Jurado Dos', rol: 'Jurado' },
    { email: 'jurado3@hackathon.com', nombre: 'Jurado Tres', rol: 'Jurado' },
    { email: 'staff1@hackathon.com', nombre: 'Staff Uno', rol: 'Staff' },
    { email: 'staff2@hackathon.com', nombre: 'Staff Dos', rol: 'Staff' },
    { email: 'staff3@hackathon.com', nombre: 'Staff Tres', rol: 'Staff' },
    { email: 'admin@hackathon.com', nombre: 'Admin Supremo', rol: 'Organizador' },
];

async function fix() {
    const { data: { users }, error } = await supabase.auth.admin.listUsers();

    for (const user of users) {
        const config = rolesParams.find(r => r.email === user.email);
        if (config) {
            console.log(`Fixing profile for ${user.email} -> ${config.rol}`);
            // Try to upsert the profile
            const { error: upsertError } = await supabase.from('profiles').upsert({
                id: user.id,
                full_name: config.nombre,
                role: config.rol
            });
            if (upsertError) console.error("Error upserting:", upsertError.message);
            else console.log(`✓ Fixed ${user.email}`);
        }
    }
}
fix();
