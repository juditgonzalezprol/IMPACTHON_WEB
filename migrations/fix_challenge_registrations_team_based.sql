-- Migrar challenge_registrations de user_id a team_id
-- Ejecutar en Supabase SQL Editor

DROP TABLE IF EXISTS public.challenge_registrations;

CREATE TABLE public.challenge_registrations (
  team_id      UUID REFERENCES public.teams(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (team_id, challenge_id)
);

ALTER TABLE public.challenge_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Challenge registrations are viewable by everyone."
  ON public.challenge_registrations FOR SELECT USING (true);

CREATE POLICY "Team members can register their team."
  ON public.challenge_registrations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = challenge_registrations.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can unregister their team."
  ON public.challenge_registrations FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = challenge_registrations.team_id
      AND team_members.user_id = auth.uid()
    )
  );
