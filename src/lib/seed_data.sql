-- SCRIPT PARA AGREGAR DATOS DE EJEMPLO - EDUPORTAL CFP 413
-- Copia y pega esto en el SQL Editor de tu proyecto de Supabase

-- Primero, nos aseguramos de que los campos existan
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cursos' AND column_name='descripcion') THEN
    ALTER TABLE cursos ADD COLUMN descripcion TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cursos' AND column_name='imagen_url') THEN
    ALTER TABLE cursos ADD COLUMN imagen_url TEXT;
  END IF;
END $$;

-- Limpiar datos previos si lo deseas (opcional)
-- DELETE FROM cursos;

-- Insertar Cursos de Ejemplo
INSERT INTO cursos (nombre, nivel, carga_horaria_total, modalidad, dias_cursada, turno, descripcion)
VALUES 
(
  'Desarrollo Web Fullstack con React', 
  'Intermedio', 
  200, 
  'Híbrida', 
  ARRAY['Lunes', 'Miércoles'], 
  'Noche', 
  'Domina las tecnologías más demandadas del desarrollo moderno. Aprenderás React, Node.js, Express y bases de datos NoSQL. Ideal para quienes buscan una salida laboral rápida en el mundo IT.'
),
(
  'Diseño Gráfico y UI/UX', 
  'Básico', 
  120, 
  'Presencial', 
  ARRAY['Martes', 'Jueves'], 
  'Tarde', 
  'Aprendé a crear interfaces visuales impactantes y experiencias de usuario memorables. Uso intensivo de Figma, Adobe Illustrator y principios de diseño centrados en el humano.'
),
(
  'Reparación de PC y Redes', 
  'Básico', 
  160, 
  'Presencial', 
  ARRAY['Viernes'], 
  'Mañana', 
  'Capacitación técnica práctica en mantenimiento preventivo y correctivo de hardware, configuración de redes locales y seguridad informática básica.'
),
(
  'Marketing Digital y Redes Sociales', 
  'Básico', 
  80, 
  'Virtual', 
  ARRAY['Sábado'], 
  'Mañana', 
  'Potenciá emprendimientos o marcas personales. Estrategias de contenido, pauta publicitaria en Meta/Google Ads y analítica de datos para toma de decisiones.'
),
(
  'Programación de Videojuegos con Unity', 
  'Avanzado', 
  240, 
  'Híbrida', 
  ARRAY['Lunes', 'Viernes'], 
  'Noche', 
  'Entrá en la industria del gaming. Creación de mecánicas, scripts en C#, animaciones y publicación en plataformas móviles y PC.'
);
