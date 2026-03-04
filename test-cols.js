require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkCols() {
    console.log("Checking profiles columns...");
    const { data, error } = await supabase.from('profiles').select('*').limit(1);

    if (error) {
        console.error("Profiles Table error:", error.message);
    } else {
        console.log("Profiles Table raw data array:", data);
    }
}

checkCols();
