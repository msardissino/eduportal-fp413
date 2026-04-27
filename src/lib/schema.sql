-- SCRIPT DE CONFIGURACIÓN DE BASE DE DATOS - EDUPORTAL CFP 413
-- Ejecutar este script en el SQL Editor de Supabase

-- 1. TIPOS ENUM (Categorías)
CREATE TYPE nivel_curso AS ENUM ('Básico', 'Intermedio', 'Avanzado');
CREATE TYPE modalidad_curso AS ENUM ('Presencial', 'Virtual', 'Híbrida');
CREATE TYPE estado_inscripcion AS ENUM ('Inscripto', 'Cursando', 'Abandonó', 'Egresado');
CREATE TYPE situacion_laboral AS ENUM ('Empleado', 'Desempleado', 'Estudiante');

-- 2. EXTENSIÓN DE PERFILES (profiles)
-- Esta tabla ya existe en algunos casos, añadimos los campos necesarios.
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
  
  -- Regla: Un alumno no puede inscribirse dos veces al mismo curso activamente
  UNIQUE(id_alumno, id_curso)
);

-- 5. TRIGGER PARA ACTUALIZACIÓN AUTOMÁTICA A "EGRESADO"
CREATE OR REPLACE FUNCTION check_egresado_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Regla de Negocio: Egresado si calif >= 6 y asistencia >= 75
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

-- 6. POLÍTICAS DE SEGURIDAD (RLS) - Ejemplos básicos
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE inscripciones ENABLE ROW LEVEL SECURITY;

-- Los usuarios pueden leer su propio perfil
CREATE POLICY "Profiles are viewable by owner" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Los cursos son visibles para todos
CREATE POLICY "Courses are viewable by everyone" ON cursos
  FOR SELECT TO authenticated USING (true);

-- Solo administrativos pueden insertar/editar cursos
-- (Esto asume que el rol se chequea en la tabla profiles)
-- NOTA: Para implementar esto estrictamente se requiere una función que busque el rol.
