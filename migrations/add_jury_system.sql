-- ============================================================
-- Migración: sistema de jurado, criterios, scores y dashboard público
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 0. Marcar challenges con jurado (todos los actuales lo tienen)
ALTER TABLE public.challenges
  ADD COLUMN IF NOT EXISTS has_jury BOOLEAN DEFAULT true NOT NULL;

-- ============================================================
-- 1. Tabla de criterios de evaluación
--    - kind = 'specific' → vinculado a un challenge concreto, define ganador del reto
--    - kind = 'general'  → criterio común a TODOS los retos, define clasificación a la final
-- ============================================================
DO $$ BEGIN
  CREATE TYPE criterion_kind AS ENUM ('specific', 'general');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.evaluation_criteria (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE, -- NULL si kind='general'
  kind         criterion_kind NOT NULL,
  name         TEXT NOT NULL,
  description  TEXT,
  weight       NUMERIC(5,2) NOT NULL DEFAULT 1.0, -- peso relativo dentro de su grupo
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT criterion_specific_needs_challenge
    CHECK ((kind = 'specific' AND challenge_id IS NOT NULL)
        OR (kind = 'general'  AND challenge_id IS NULL))
);

CREATE INDEX IF NOT EXISTS idx_criteria_challenge ON public.evaluation_criteria(challenge_id);
CREATE INDEX IF NOT EXISTS idx_criteria_kind ON public.evaluation_criteria(kind);

ALTER TABLE public.evaluation_criteria ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Criteria viewable by everyone."
  ON public.evaluation_criteria FOR SELECT USING (true);

CREATE POLICY "Organizadores manage criteria."
  ON public.evaluation_criteria FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Organizador'
    )
  );

CREATE TRIGGER update_evaluation_criteria_modtime
  BEFORE UPDATE ON public.evaluation_criteria
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================
-- 2. Asignación de jueces a retos
-- ============================================================
CREATE TABLE IF NOT EXISTS public.jury_assignments (
  jury_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  assigned_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (jury_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_jury_assignments_challenge
  ON public.jury_assignments(challenge_id);

ALTER TABLE public.jury_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Jury assignments viewable by everyone."
  ON public.jury_assignments FOR SELECT USING (true);

CREATE POLICY "Organizadores manage jury assignments."
  ON public.jury_assignments FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Organizador'
    )
  );

-- ============================================================
-- 3. Reescribir tabla de evaluations para que sea (team, jury, challenge)
--    Una "evaluación" = el conjunto de notas que un juez da a un equipo
--    en un reto concreto. Las notas individuales viven en evaluation_scores.
-- ============================================================

-- Conservar datos viejos por si acaso → renombrar tabla anterior
ALTER TABLE IF EXISTS public.evaluations
  RENAME TO evaluations_legacy;

CREATE TABLE public.evaluations (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id      UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  jury_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  feedback     TEXT,
  submitted_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at   TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE (team_id, jury_id, challenge_id)
);

CREATE INDEX IF NOT EXISTS idx_evaluations_challenge ON public.evaluations(challenge_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_team      ON public.evaluations(team_id);
CREATE INDEX IF NOT EXISTS idx_evaluations_jury      ON public.evaluations(jury_id);

ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquiera (necesario para el dashboard público y para que un equipo vea su feedback)
CREATE POLICY "Evaluations viewable by everyone."
  ON public.evaluations FOR SELECT USING (true);

-- Escritura: solo el juez asignado al reto (o un Organizador)
CREATE POLICY "Assigned jury can manage own evaluations."
  ON public.evaluations FOR ALL USING (
    (
      jury_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM public.jury_assignments ja
        WHERE ja.jury_id = auth.uid()
        AND ja.challenge_id = evaluations.challenge_id
      )
    )
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Organizador'
    )
  );

CREATE TRIGGER update_evaluations_modtime
  BEFORE UPDATE ON public.evaluations
  FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- ============================================================
-- 4. Notas individuales por criterio
-- ============================================================
CREATE TABLE IF NOT EXISTS public.evaluation_scores (
  evaluation_id UUID REFERENCES public.evaluations(id) ON DELETE CASCADE NOT NULL,
  criterion_id  UUID REFERENCES public.evaluation_criteria(id) ON DELETE CASCADE NOT NULL,
  score         NUMERIC(4,2) NOT NULL CHECK (score >= 0 AND score <= 10),
  created_at    TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at    TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (evaluation_id, criterion_id)
);

CREATE INDEX IF NOT EXISTS idx_eval_scores_criterion ON public.evaluation_scores(criterion_id);

ALTER TABLE public.evaluation_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Scores viewable by everyone."
  ON public.evaluation_scores FOR SELECT USING (true);

CREATE POLICY "Jury can manage own scores."
  ON public.evaluation_scores FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.evaluations e
      WHERE e.id = evaluation_scores.evaluation_id
      AND (
        e.jury_id = auth.uid()
        OR EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'Organizador'
        )
      )
    )
  );

-- ============================================================
-- 5. Configuración del dashboard público
--    Una sola fila (id=1). PIN guardado en claro porque es de evento, no de seguridad real.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.public_dashboard_settings (
  id          INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  pin         TEXT NOT NULL DEFAULT '0000',
  is_open     BOOLEAN NOT NULL DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.public_dashboard_settings (id, pin, is_open)
VALUES (1, '0000', true)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.public_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- Solo organizadores pueden leer/cambiar el PIN. La validación pública del PIN
-- se hace desde un Server Action con el service role / RPC dedicada.
CREATE POLICY "Organizadores see dashboard settings."
  ON public.public_dashboard_settings FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Organizador'
    )
  );

CREATE POLICY "Organizadores update dashboard settings."
  ON public.public_dashboard_settings FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'Organizador'
    )
  );

-- ============================================================
-- 5b. RPC pública para validar el PIN del dashboard
--     SECURITY DEFINER porque la tabla solo es leíble por organizadores.
--     Solo expone un boolean, no la contraseña.
-- ============================================================
CREATE OR REPLACE FUNCTION public.validate_dashboard_pin(pin_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ok BOOLEAN;
BEGIN
  SELECT (pin = pin_to_check AND is_open = true)
    INTO ok
    FROM public.public_dashboard_settings
   WHERE id = 1;
  RETURN COALESCE(ok, false);
END;
$$;

GRANT EXECUTE ON FUNCTION public.validate_dashboard_pin(TEXT) TO anon, authenticated;

-- ============================================================
-- 6. Seed: criterios generales (compartidos por todos los retos)
-- ============================================================
INSERT INTO public.evaluation_criteria (kind, challenge_id, name, description, weight, order_index)
VALUES
  ('general', NULL, 'Innovación',          'Originalidad y creatividad de la propuesta.',                           1.0, 1),
  ('general', NULL, 'Ejecución técnica',   'Calidad técnica del prototipo: arquitectura, robustez, decisiones.',    1.0, 2),
  ('general', NULL, 'Impacto y viabilidad','Potencial de la solución para tener impacto real y poder evolucionar.', 1.0, 3),
  ('general', NULL, 'Presentación y pitch','Claridad, estructura y capacidad de comunicación durante la demo.',     1.0, 4)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 7. Seed: criterios específicos por reto (sacados de los PDFs de bases)
-- ============================================================
DO $$
DECLARE
  ch_camelia    UUID;
  ch_eurostars  UUID;
  ch_gem        UUID;
  ch_gdg        UUID;
BEGIN
  SELECT id INTO ch_camelia   FROM public.challenges WHERE title ILIKE 'LocalFold%'        LIMIT 1;
  SELECT id INTO ch_eurostars FROM public.challenges WHERE title ILIKE 'Make Me Want%'     LIMIT 1;
  SELECT id INTO ch_gem       FROM public.challenges WHERE title ILIKE 'Por un uso%'       LIMIT 1;
  SELECT id INTO ch_gdg       FROM public.challenges WHERE title ILIKE 'Herramientas Cloud%' LIMIT 1;

  -- CAMELIA: 5 criterios (sin pesos explícitos en bases → equipeso)
  IF ch_camelia IS NOT NULL THEN
    INSERT INTO public.evaluation_criteria (kind, challenge_id, name, description, weight, order_index) VALUES
      ('specific', ch_camelia, 'Usabilidad y UX para biólogos', 'Facilidad de uso para no bioinformáticos. Mensajes claros, explicaciones de pLDDT/PAE/FASTA. Test clave: ¿podría usarlo un biólogo sin ayuda?', 1.0, 1),
      ('specific', ch_camelia, 'Visualización e interpretabilidad', 'Calidad del visor 3D, coloreado pLDDT, heatmap PAE, métricas biológicas presentadas con sentido.', 1.0, 2),
      ('specific', ch_camelia, 'Gestión del ciclo de vida del job', 'Flujo PENDING→RUNNING→COMPLETED comunicado con claridad. Estados intermedios y errores manejados con gracia.', 1.0, 3),
      ('specific', ch_camelia, 'Integración creativa de datos', 'Uso ingenioso de metadata extra (solubilidad, toxicidad, accounting HPC, UniProt/PDB).', 1.0, 4),
      ('specific', ch_camelia, 'Viabilidad para producción', 'Código estructurado para conectarse al CESGA real con cambios mínimos. Auth, errores de red, estados de carga.', 1.0, 5);
  END IF;

  -- EUROSTARS: 4 criterios CON PESOS explícitos del PDF (45/25/15/15)
  IF ch_eurostars IS NOT NULL THEN
    INSERT INTO public.evaluation_criteria (kind, challenge_id, name, description, weight, order_index) VALUES
      ('specific', ch_eurostars, 'Valor de negocio, viabilidad y aplicabilidad', 'La solución responde a un problema real del negocio, aporta valor al equipo de marketing y es realista de aplicar.', 45.0, 1),
      ('specific', ch_eurostars, 'Creatividad y personalización', 'Originalidad y capacidad de adaptar recomendaciones, mensajes y campañas al cliente, destino y contexto.', 25.0, 2),
      ('specific', ch_eurostars, 'Uso de la IA', 'La IA tiene un papel útil, bien integrado y con valor real, más allá de un wrapper de LLM.', 15.0, 3),
      ('specific', ch_eurostars, 'Claridad de exposición', 'Capacidad para explicar problema, lógica, propuesta de valor y demo de forma clara y estructurada.', 15.0, 4);
  END IF;

  -- GEM: 4 criterios (sin pesos explícitos → equipeso)
  IF ch_gem IS NOT NULL THEN
    INSERT INTO public.evaluation_criteria (kind, challenge_id, name, description, weight, order_index) VALUES
      ('specific', ch_gem, 'Creatividad e innovación', 'Originalidad de la idea propuesta y del prototipo creado como solución.', 1.0, 1),
      ('specific', ch_gem, 'Factibilidad', 'Diseño técnico de la solución.', 1.0, 2),
      ('specific', ch_gem, 'Viabilidad', 'Potencial de la solución para convertirse en un proyecto monetizable.', 1.0, 3),
      ('specific', ch_gem, 'Pitch', 'Presentación persuasiva y habilidad de comunicación al mostrar el valor de la propuesta.', 1.0, 4);
  END IF;

  -- GDG + Cloud: PLACEHOLDER. Editar desde /admin/criterios cuando lleguen las bases.
  IF ch_gdg IS NOT NULL THEN
    INSERT INTO public.evaluation_criteria (kind, challenge_id, name, description, weight, order_index) VALUES
      ('specific', ch_gdg, 'Aprovechamiento de herramientas Cloud', 'Uso real y significativo de Google Cloud y créditos provistos.', 1.0, 1),
      ('specific', ch_gdg, 'Integración con herramientas de IA de Google', 'Uso creativo de Gemini, Antigravity y demás herramientas de Google.', 1.0, 2),
      ('specific', ch_gdg, 'Calidad técnica e impacto del uso de la stack', 'Solidez técnica del uso de la stack y valor que aporta al proyecto final.', 1.0, 3);
  END IF;
END $$;
