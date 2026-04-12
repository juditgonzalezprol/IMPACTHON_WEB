-- ============================================================
-- Migración: repos y entregables por reto
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Repo por inscripción (un equipo puede tener repos distintos para cada reto)
ALTER TABLE public.challenge_registrations
  ADD COLUMN IF NOT EXISTS github_url TEXT;

-- 2. Etiquetar entregables con reto (NULL = general / visible en todos)
ALTER TABLE public.deliverables
  ADD COLUMN IF NOT EXISTS challenge_id UUID REFERENCES public.challenges(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_deliverables_challenge
  ON public.deliverables(challenge_id);

-- 3. Policy de UPDATE en challenge_registrations (faltaba, necesaria para guardar github_url)
CREATE POLICY "Team members can update their challenge registrations."
  ON public.challenge_registrations FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = challenge_registrations.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- 4. Marcar retos transversales (GDG). Sus jueces ven TODOS los repos y entregables.
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS is_transversal BOOLEAN DEFAULT false NOT NULL;

-- Marcar GDG como transversal
UPDATE public.challenges
  SET is_transversal = true
  WHERE title ILIKE '%Herramientas Cloud%'
    OR title ILIKE '%GDG%';
