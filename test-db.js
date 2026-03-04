require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testDB() {
  console.log("Checking if profiles table exists and is accessible...");
  const { data, error } = await supabase.from('profiles').select('id').limit(1);

  if (error) {
    console.error("Profiles Table error:", error.message);
  } else {
    console.log("Profiles Table exists and accessible. Data:", data);
  }
}

testDB();
