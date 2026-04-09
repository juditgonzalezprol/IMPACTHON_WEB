-- Migración: Añadir campo track a eventos para distinguir Emprendimiento/Programación
-- Ejecutar en Supabase SQL Editor

-- 1. Crear el tipo enum para track
CREATE TYPE event_track AS ENUM ('todos', 'emprendimiento', 'programacion');

-- 2. Añadir la columna track a la tabla events
ALTER TABLE public.events
ADD COLUMN track event_track DEFAULT 'todos'::event_track NOT NULL;

-- Listo! Los eventos existentes quedarán marcados como "todos" (general)
