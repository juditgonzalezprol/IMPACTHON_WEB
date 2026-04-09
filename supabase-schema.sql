-- SQL Setup for Hackathon Teams and Profiles

-- 1. Create custom enum types for roles
CREATE TYPE user_role AS ENUM ('Asistente', 'Staff', 'Organizador', 'Jurado');

-- 2. Create Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  bio TEXT,
  role user_role DEFAULT 'Asistente'::user_role NOT NULL,
  contact_email TEXT,
  avatar_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  needs_credits BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create Teams table
CREATE TABLE public.teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  github_url TEXT,
  demo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for teams
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

-- 4. Create Team Members junction table
CREATE TABLE public.team_members (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id) -- Ensures a user can only be in one team at a time
);

-- Enable RLS for team members
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5. Create Evaluations table
CREATE TABLE public.evaluations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  jury_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  score_idea INTEGER CHECK (score_idea >= 1 AND score_idea <= 10),
  score_execution INTEGER CHECK (score_execution >= 1 AND score_execution <= 10),
  score_presentation INTEGER CHECK (score_presentation >= 1 AND score_presentation <= 10),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(team_id, jury_id) -- A judge can only evaluate a team once
);

-- Enable RLS for evaluations
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- 6. Create Events table (Agenda)
-- Track types: 'todos' (general), 'emprendimiento', 'programacion'
CREATE TYPE event_track AS ENUM ('todos', 'emprendimiento', 'programacion');

CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  track event_track DEFAULT 'todos'::event_track NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- MIGRATION: Si ya existe la tabla, ejecutar esto en su lugar:
-- CREATE TYPE event_track AS ENUM ('todos', 'emprendimiento', 'programacion');
-- ALTER TABLE public.events ADD COLUMN track event_track DEFAULT 'todos'::event_track NOT NULL;

-- Enable RLS for events
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

-- Enable RLS for announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- PROFILES POLICIES
-- Anyone can view profiles
CREATE POLICY "Profiles are viewable by everyone." 
  ON public.profiles FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile." 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile." 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- TEAMS POLICIES
-- Anyone can view teams
CREATE POLICY "Teams are viewable by everyone." 
  ON public.teams FOR SELECT USING (true);

-- Any authenticated user can create a team
CREATE POLICY "Authenticated users can create teams." 
  ON public.teams FOR INSERT TO authenticated WITH CHECK (true);

-- Only team members can update their team
CREATE POLICY "Team members can update their team." 
  ON public.teams FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

-- Only team members can delete their team
CREATE POLICY "Team members can delete their team." 
  ON public.teams FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.team_members 
      WHERE team_members.team_id = teams.id 
      AND team_members.user_id = auth.uid()
    )
  );

-- TEAM MEMBERS POLICIES
-- Anyone can view team members
CREATE POLICY "Team members are viewable by everyone." 
  ON public.team_members FOR SELECT USING (true);

-- Authenticated users can join a team (insert themselves)
CREATE POLICY "Users can join teams." 
  ON public.team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Authenticated users can leave a team (delete themselves)
CREATE POLICY "Users can leave teams." 
  ON public.team_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- EVALUATIONS POLICIES
-- Anyone can view evaluations
CREATE POLICY "Evaluations are viewable by everyone." 
  ON public.evaluations FOR SELECT USING (true);

-- Only Judges and Organizers can insert/update evaluations
CREATE POLICY "Jury can manage evaluations." 
  ON public.evaluations FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'Jurado' OR profiles.role = 'Organizador')
    )
  );

-- EVENTS POLICIES
-- Anyone can view events
CREATE POLICY "Events are viewable by everyone." 
  ON public.events FOR SELECT USING (true);

-- Only Staff and Organizers can manage events
CREATE POLICY "Staff can manage events." 
  ON public.events FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'Staff' OR profiles.role = 'Organizador')
    )
  );

-- ANNOUNCEMENTS POLICIES
-- Anyone can view announcements
CREATE POLICY "Announcements are viewable by everyone." 
  ON public.announcements FOR SELECT USING (true);

-- Only Staff and Organizers can manage announcements
CREATE POLICY "Staff can manage announcements." 
  ON public.announcements FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND (profiles.role = 'Staff' OR profiles.role = 'Organizador')
    )
  );

-- ==========================================
-- TRIGGERS FOR AUTO-UPDATES
-- ==========================================

-- Function to handle new user signups and automatically create a blank profile
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Usuario Nuevo'),
    'Asistente'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function every time a user is created in auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_teams_modtime
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_evaluations_modtime
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_events_modtime
  BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_announcements_modtime
  BEFORE UPDATE ON public.announcements
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
