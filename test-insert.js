require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testInsert() {
    console.log("Attempting direct insert...");
    // Try inserting with minimal fields to see if RLS or a missing column throws
    const { data, error } = await supabase.from('profiles').insert([
        { id: '123e4567-e89b-12d3-a456-426614174000', full_name: 'Test' }
    ]);

    if (error) {
        console.error("Insert error:", error.message, error.details, error.hint);
    } else {
        console.log("Insert success:", data);
    }
}

testInsert();
