require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY_SUPABASE
);

async function check() {
  const { data: profiles, error } = await supabase.from('profiles').select('*');
  if (error) {
    console.error(error);
  } else {
    console.log(profiles);
  }
}
check();
