-- ============================================
-- Migración: challenges, challenge_registrations, deliverables
-- Ejecutar en Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================

-- 1. Tabla de retos
CREATE TABLE IF NOT EXISTS public.challenges (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  document_url TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Inscripciones a retos (no excluyente: un usuario puede apuntarse a varios)
CREATE TABLE IF NOT EXISTS public.challenge_registrations (
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, challenge_id)
);

-- 3. Entregables del equipo (N por equipo)
CREATE TABLE IF NOT EXISTS public.deliverables (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id     UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================
-- Row Level Security
-- ============================================

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- challenges: lectura pública, escritura solo Organizador/Staff
CREATE POLICY "Challenges are viewable by everyone."
  ON public.challenges FOR SELECT USING (true);

CREATE POLICY "Staff can manage challenges."
  ON public.challenges FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND (profiles.role = 'Organizador' OR profiles.role = 'Staff')
    )
  );

-- challenge_registrations: cada usuario gestiona sus propias inscripciones, lectura pública
CREATE POLICY "Challenge registrations are viewable by everyone."
  ON public.challenge_registrations FOR SELECT USING (true);

CREATE POLICY "Users can register to challenges."
  ON public.challenge_registrations FOR INSERT
  TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can unregister from challenges."
  ON public.challenge_registrations FOR DELETE
  TO authenticated USING (user_id = auth.uid());

-- deliverables: lectura pública (para jurado), escritura solo miembros del equipo
CREATE POLICY "Deliverables are viewable by everyone."
  ON public.deliverables FOR SELECT USING (true);

CREATE POLICY "Team members can create deliverables."
  ON public.deliverables FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = deliverables.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can update deliverables."
  ON public.deliverables FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = deliverables.team_id
      AND team_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can delete deliverables."
  ON public.deliverables FOR DELETE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.team_members
      WHERE team_members.team_id = deliverables.team_id
      AND team_members.user_id = auth.uid()
    )
  );

-- ============================================
-- Triggers
-- ============================================

CREATE TRIGGER update_challenges_modtime
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

CREATE TRIGGER update_deliverables_modtime
  BEFORE UPDATE ON public.deliverables
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================
-- Datos iniciales: 4 retos placeholder
-- (Reemplazar título, descripción y document_url con la info real)
-- ============================================
INSERT INTO public.challenges (title, description, document_url) VALUES
  ('LocalFold — Cátedra Camelia', 'Crea una interfaz web intuitiva para predicción de estructuras de proteínas con AlphaFold2, conectada al supercomputador CESGA Finis Terrae III. El objetivo es hacer accesible la predicción de proteínas a investigadores sin formación técnica, a través de un portal web completo. Contarás con una API simulada del CESGA con 22 proteínas de prueba.', 'https://example.com/reto-camelia'),
  ('Make Me Want to Travel — Eurostars', 'Transforma datos reales de clientes y reservas hoteleras en decisiones de marketing accionables. Eurostars Hotel Company proporciona datasets reales de clientes y hoteles para que construyas soluciones de IA que ayuden al equipo de marketing a tomar decisiones más rápidas y efectivas en un sector con demanda muy variable.', 'https://example.com/reto-eurostars'),
  ('Por un uso responsable del móvil — GEM Galicia', 'Diseña una solución tecnológica que ayude a jóvenes de 10 a 25 años a reducir el uso improductivo del móvil y sus consecuencias: aislamiento social, adicción, problemas de salud mental y bajo rendimiento académico. El Observatorio GEM Galicia busca ideas innovadoras con impacto real en bienestar digital.', 'https://example.com/reto-gem'),
  ('Herramientas Cloud — GDG Santiago', 'Reto transversal: aprovecha créditos de Google Cloud, herramientas de IA de Google y la plataforma Antigravity para potenciar tu proyecto. Todos los equipos reciben créditos cloud y acceso a herramientas que pueden aplicar a cualquiera de los otros retos.', 'https://example.com/reto-gdg');
