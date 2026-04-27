-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS - EDUPORTAL CFP 413
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. TIPOS ENUM (Categorías)
CREATE TYPE nivel_curso AS ENUM ('Básico', 'Intermedio', 'Avanzado');
CREATE TYPE modalidad_curso AS ENUM ('Presencial', 'Virtual', 'Híbrida');
CREATE TYPE estado_inscripcion AS ENUM ('Inscripto', 'Cursando', 'Abandonó', 'Egresado', 'Baja parcial');
CREATE TYPE situacion_laboral AS ENUM ('Empleado', 'Desempleado', 'Estudiante');
CREATE TYPE turno_curso AS ENUM ('Mañana', 'Tarde', 'Noche');
CREATE TYPE tipo_archivo_curso AS ENUM ('Plan Anual', 'Trabajo Práctico', 'Material', 'Galería', 'Encuesta');
CREATE TYPE estado_reinscripcion AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');

-- 2. EXTENSIÓN DE PERFILES (profiles)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  role TEXT CHECK (role IN ('alumno', 'docente', 'administrativo')) DEFAULT 'alumno',
  full_name TEXT NOT NULL,
  email TEXT,
  dni TEXT UNIQUE,
  fecha_nacimiento DATE,
  situacion_laboral situacion_laboral,
  estudios_previos TEXT,
  especialidad_tecnica TEXT, -- Para docentes
  valor_hora DECIMAL(10, 2),  -- Para docentes
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABLA DE CURSOS
CREATE TABLE IF NOT EXISTS cursos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre TEXT NOT NULL,
  nivel nivel_curso DEFAULT 'Básico',
  carga_horaria_total INTEGER,
  modalidad modalidad_curso DEFAULT 'Presencial',
  temario_url TEXT,
  dias_cursada TEXT[] DEFAULT '{}', -- Ej: ['Lunes', 'Miércoles', 'Viernes']
  turno turno_curso DEFAULT 'Noche',
  id_docente UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABLA DE INSCRIPCIONES
CREATE TABLE IF NOT EXISTS inscripciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_alumno UUID REFERENCES profiles(id) ON DELETE CASCADE,
  id_curso UUID REFERENCES cursos(id) ON DELETE CASCADE,
  fecha_inscripcion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  estado estado_inscripcion DEFAULT 'Inscripto',
  calificacion_final DECIMAL(4, 2) DEFAULT 0.00,
  asistencia_porcentaje INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id_alumno, id_curso)
);

-- 5. TABLA DE ASISTENCIAS
CREATE TABLE IF NOT EXISTS asistencias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_inscripcion UUID REFERENCES inscripciones(id) ON DELETE CASCADE,
  fecha DATE NOT NULL DEFAULT CURRENT_DATE,
  presente BOOLEAN DEFAULT FALSE,
  justificacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(id_inscripcion, fecha)
);

-- 6. TABLA DE ARCHIVOS DE CURSO
CREATE TABLE IF NOT EXISTS archivos_curso (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_curso UUID REFERENCES cursos(id) ON DELETE CASCADE,
  tipo tipo_archivo_curso DEFAULT 'Material',
  nombre TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. TABLA DE MENSAJES (CHAT)
CREATE TABLE IF NOT EXISTS mensajes_chat (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_curso UUID REFERENCES cursos(id) ON DELETE CASCADE,
  id_emisor UUID REFERENCES profiles(id) ON DELETE CASCADE,
  id_receptor UUID REFERENCES profiles(id) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  leido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. TABLA DE BAJAS Y JUSTIFICACIONES
CREATE TABLE IF NOT EXISTS bajas_justificaciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_inscripcion UUID REFERENCES inscripciones(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  id_docente UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TABLA DE FORMULARIOS DE REINSCRIPCIÓN
CREATE TABLE IF NOT EXISTS formularios_reinscripcion (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  id_inscripcion UUID REFERENCES inscripciones(id) ON DELETE CASCADE,
  archivo_documento TEXT NOT NULL,
  justificacion_alumno TEXT,
  estado estado_reinscripcion DEFAULT 'Pendiente',
  justificacion_docente TEXT,
  id_docente_resolucion UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA A "EGRESADO"
CREATE OR REPLACE FUNCTION check_egresado_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.calificacion_final >= 6 AND NEW.asistencia_porcentaje >= 75 THEN
    NEW.estado := 'Egresado';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_egresado_trigger
BEFORE INSERT OR UPDATE ON inscripciones
FOR EACH ROW
EXECUTE FUNCTION check_egresado_status();

-- 11. POLÍTICAS DE SEGURIDAD (RLS) - Básicas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE archivos_curso ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE bajas_justificaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE formularios_reinscripcion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by owner" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Courses are viewable by everyone" ON cursos FOR SELECT TO authenticated USING (true);
