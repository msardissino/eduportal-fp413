import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import Landing from './pages/landing/Landing';
import PublicCourseDetail from './pages/landing/PublicCourseDetail';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import Cursos from './pages/dashboard/Cursos';
import CourseDetail from './pages/dashboard/CourseDetail';
import Alumnos from './pages/dashboard/Alumnos';
import Docentes from './pages/dashboard/Docentes';
import ProfileDetail from './pages/dashboard/ProfileDetail';
import Inscripciones from './pages/dashboard/Inscripciones';

import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cursos/:id" element={<PublicCourseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/cursos" 
          element={
            <ProtectedRoute>
              <Layout>
                <Cursos />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/alumnos" 
          element={
            <ProtectedRoute>
              <Layout>
                <Alumnos />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/inscripciones" 
          element={
            <ProtectedRoute>
              <Layout>
                <Inscripciones />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/docentes" 
          element={
            <ProtectedRoute>
              <Layout>
                <Docentes />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/cursos/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <CourseDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard/perfil/:id" 
          element={
            <ProtectedRoute>
              <Layout>
                <ProfileDetail />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
