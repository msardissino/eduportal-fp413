# 🛠️ Guía Técnica y de Aprendizaje

Esta guía explica las decisiones tecnológicas y la arquitectura detrás de la **Plataforma Educativa FP 413**. Es ideal para entender cómo se construye una aplicación web profesional desde cero.

## 1. Stack Tecnológico

### **Vite + React + TypeScript**
- **Vite**: Es nuestro empaquetador (bundler). Lo elegimos porque es extremadamente rápido en el desarrollo comparado con herramientas antiguas como Webpack.
- **React**: La librería para construir la interfaz. Usamos una arquitectura de componentes para que el código sea reutilizable.
- **TypeScript**: Añade "tipado" a JavaScript. Esto evita errores comunes (como intentar acceder a una propiedad que no existe) y hace que el código sea más fácil de mantener.

### **CSS Modules**
En lugar de usar CSS global, usamos archivos `.module.css`. 
- **¿Por qué?**: Evita que los estilos de un componente afecten accidentalmente a otro (colisión de nombres). Cada clase se vuelve única para su componente.

## 2. Estructura de Carpetas
```text
src/
 ├── components/      # Componentes reutilizables (Sidebar, Layout)
 ├── pages/           # Vistas completas (Landing, Login, Dashboard)
 ├── lib/             # Configuraciones de librerías externas (Supabase)
 ├── styles/          # Variables CSS y estilos globales
 └── App.tsx          # Enrutador principal de la aplicación
```

## 3. Integración con Supabase
**Supabase** es nuestro "Backend as a Service". Nos proporciona:
1. **Auth**: Manejo de usuarios (Login/Registro).
2. **Database**: Una base de datos PostgreSQL para guardar alumnos, notas, etc.
3. **Storage**: Para guardar archivos y fotos si fuera necesario.

### Flujo de Autenticación:
1. El usuario ingresa datos en `Login.tsx`.
2. Usamos el cliente de Supabase (`supabase.auth.signInWithPassword`) para validar.
3. Guardamos el **Rol** del usuario para decidir qué mostrar en el Sidebar.

### Configuración de Base de Datos (SQL):
Para que los roles funcionen correctamente, debes crear una tabla `profiles` en tu SQL Editor de Supabase:
```sql
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('alumno', 'docente', 'administrativo')) default 'alumno',
  full_name text
);
```
Luego, vincula cada usuario de `auth.users` con un registro en `profiles`.

## 4. Mejores Prácticas Aplicadas
- **Variables CSS**: Centralizamos colores y medidas en `:root` dentro de `index.css`. Si queremos cambiar el naranja institucional, lo hacemos en un solo lugar.
- **Enrutamiento Declarativo**: Usamos `react-router-dom` para manejar las URLs de forma limpia.
- **Iconografía con Lucide**: Usamos `lucide-react` por su ligereza y estética moderna.

## 5. Próximos Pasos para Aprender
- Investiga sobre **Hooks** en React (`useState`, `useEffect`).
- Aprende sobre el modelo relacional de base de datos en Supabase.
- Experimenta cambiando los estilos en los archivos `.module.css`.

---
*Desarrollado con pasión por la tecnología y la educación.*
