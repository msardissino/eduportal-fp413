-- SCRIPT PARA NUEVAS FUNCIONALIDADES: CALENDARIO Y NOTIFICACIONES

-- 1. Crear tabla para Eventos del Calendario
CREATE TABLE IF NOT EXISTS eventos_calendario (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_curso UUID REFERENCES cursos(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  fecha_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
  fecha_fin TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo TEXT CHECK (tipo IN ('clase', 'examen', 'entrega', 'feriado')) DEFAULT 'clase',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Crear tabla para Notificaciones In-App
CREATE TABLE IF NOT EXISTS notificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_usuario UUID REFERENCES profiles(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensaje TEXT NOT NULL,
  leida BOOLEAN DEFAULT FALSE,
  tipo TEXT CHECK (tipo IN ('sistema', 'curso', 'tramite')) DEFAULT 'sistema',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS
ALTER TABLE eventos_calendario ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow All for testing eventos" ON eventos_calendario FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for testing notificaciones" ON notificaciones FOR ALL TO public USING (true) WITH CHECK (true);

-- 4. Activar Realtime para Notificaciones
alter publication supabase_realtime add table notificaciones;
