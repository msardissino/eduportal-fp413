# EduPortal - CFP 413

Plataforma de gestión académica para el Centro de Formación Profesional 413.

## Tecnologías
- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: CSS Modules (Aesthetic Premium/Glassmorphism)
- **Backend**: Supabase (Base de Datos + Auth)
- **Iconos**: Lucide React

## Configuración Local

1. Clona el repositorio.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` en la raíz con tus credenciales de Supabase:
   ```env
   VITE_SUPABASE_URL=tu_url_de_supabase
   VITE_SUPABASE_ANON_KEY=tu_anon_key
   ```
4. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Base de Datos
El esquema de la base de datos se encuentra en `src/lib/schema.sql`. Para nuevos proyectos de Supabase, copia y pega el contenido de este archivo en el **SQL Editor** de Supabase y ejecútalo.

## Prevención de Pausa (Keep Alive)
Para evitar que Supabase pause el proyecto por inactividad, hemos configurado un GitHub Action que realiza un ping diario.

**IMPORTANTE**: Para que esto funcione, debes configurar los siguientes **Secrets** en tu repositorio de GitHub (Settings > Secrets and variables > Actions):
- `SUPABASE_URL`: La URL de tu proyecto.
- `SUPABASE_ANON_KEY`: La clave anónima de tu proyecto.

## Estructura del Proyecto
- `/src/components`: Componentes reutilizables.
- `/src/pages`: Vistas principales (Landing, Login, Dashboard).
- `/src/lib`: Configuraciones (Supabase client, Schema SQL).
- `/src/assets`: Recursos estáticos.
