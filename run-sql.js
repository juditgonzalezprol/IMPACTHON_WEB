require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY_SUPABASE
);

async function run() {
  const sql = `
    -- 6. Create Events table (Agenda)
    CREATE TABLE public.events (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      start_time TIMESTAMP WITH TIME ZONE NOT NULL,
      end_time TIMESTAMP WITH TIME ZONE NOT NULL,
      location TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

    -- 7. Create Announcements table
    CREATE TABLE public.announcements (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      is_pinned BOOLEAN DEFAULT false NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );
    ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Events are viewable by everyone." ON public.events FOR SELECT USING (true);
    CREATE POLICY "Staff can manage events." ON public.events FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'Staff' OR profiles.role = 'Organizador'))
    );
    
    CREATE POLICY "Announcements are viewable by everyone." ON public.announcements FOR SELECT USING (true);
    CREATE POLICY "Staff can manage announcements." ON public.announcements FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND (profiles.role = 'Staff' OR profiles.role = 'Organizador'))
    );
  `;
  
  // Note: the JS client doesn't support raw SQL by default without an RPC. 
  // Let me just create a quick migration file and instructions, 
  // or test if there's a pg connection I can use.
  console.log("Supabase JS client doesn't support raw DDL query. Please run in dashboard.");
}
run();
