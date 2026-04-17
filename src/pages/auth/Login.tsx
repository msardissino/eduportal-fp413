import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, User, Briefcase, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Login.module.css';

type Role = 'alumno' | 'docente' | 'administrativo';

const Login: React.FC = () => {
  const [role, setRole] = useState<Role>('alumno');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Intento de Login con Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      // Si el login es exitoso, guardamos el rol seleccionado para la sesión actual
      localStorage.setItem('userRole', role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginContainer}>
        <div className={styles.header}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <GraduationCap size={32} className={styles.logoIcon} />
            <span className={styles.logoText}>EduPortal</span>
          </div>
          <h1>Bienvenido</h1>
          <p>Selecciona tu perfil e ingresa a la plataforma</p>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.roleSelector}>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'alumno' ? styles.active : ''}`}
            onClick={() => setRole('alumno')}
            disabled={loading}
          >
            <User size={20} />
            Alumno
          </button>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'docente' ? styles.active : ''}`}
            onClick={() => setRole('docente')}
            disabled={loading}
          >
            <Briefcase size={20} />
            Docente
          </button>
          <button 
            type="button"
            className={`${styles.roleBtn} ${role === 'administrativo' ? styles.active : ''}`}
            onClick={() => setRole('administrativo')}
            disabled={loading}
          >
            <ShieldCheck size={20} />
            Admin
          </button>
        </div>

        <form className={styles.form} onSubmit={handleLogin}>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input 
              type="password" 
              placeholder="Contraseña" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              disabled={loading}
            />
          </div>
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? (
              <Loader2 className={styles.spinner} size={20} />
            ) : (
              `Ingresar como ${role.charAt(0).toUpperCase() + role.slice(1)}`
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <a href="#">¿Olvidaste tu contraseña?</a>
          <p>¿No tienes cuenta? <a href="#">Solicitar acceso</a></p>
        </div>
      </div>
      
      <div className={styles.decorativeSection}>
        <div className={styles.overlay} />
        <div className={styles.decorContent}>
          <h2 className="gradient-text">Formación Profesional 413</h2>
          <p>Potenciando el talento de nuestra región.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
