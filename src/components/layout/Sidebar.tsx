import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  GraduationCap,
  Sun,
  Moon,
  X,
  Palette,
  Shield,
  Bell
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onClose?: () => void;
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active }) => (
  <div className={`${styles.sidebarItem} ${active ? styles.active : ''}`}>
    <Icon size={20} />
    <span className={styles.label}>{label}</span>
  </div>
);

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const role = localStorage.getItem('userRole') || 'alumno';
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard", roles: ['alumno', 'docente', 'administrativo'] },
    { icon: Users, label: "Alumnos", path: "/dashboard/alumnos", roles: ['docente', 'administrativo'] },
    { icon: GraduationCap, label: "Docentes", path: "/dashboard/docentes", roles: ['administrativo'] },
    { icon: BookOpen, label: "Cursos", path: "/dashboard/cursos", roles: ['alumno', 'administrativo'] },
    { icon: Calendar, label: "Inscripciones", path: "/dashboard/inscripciones", roles: ['alumno', 'docente', 'administrativo'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>
          <GraduationCap className={styles.iconBlack} size={24} />
        </div>
        <h1 className={`${styles.logoText} gradient-text`}>EduAdmin</h1>
      </div>

      <nav className={styles.nav}>
        {filteredItems.map((item, idx) => (
          <Link 
            key={idx} 
            to={item.path} 
            onClick={() => onClose?.()}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <SidebarItem 
              icon={item.icon} 
              label={item.label} 
              active={location.pathname === item.path} 
            />
          </Link>
        ))}
        
        <div className={styles.footer}>
          <div onClick={() => setIsSettingsOpen(true)} style={{ cursor: 'pointer' }}>
            <SidebarItem icon={Settings} label="Configuración" />
          </div>
          <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <SidebarItem icon={LogOut} label="Cerrar Sesión" />
          </div>
        </div>
      </nav>

      {/* Settings Drawer Overlay */}
      {isSettingsOpen && (
        <div className={styles.drawerOverlay} onClick={() => setIsSettingsOpen(false)} />
      )}

      {/* Settings Drawer */}
      <div className={`${styles.drawer} ${isSettingsOpen ? styles.drawerOpen : ''} glass`}>
        <div className={styles.drawerHeader}>
          <h2>Configuración</h2>
          <button className={styles.closeDrawer} onClick={() => setIsSettingsOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.drawerContent}>
          <div className={styles.settingSection}>
            <h3>Apariencia</h3>
            <div className={styles.settingItem} onClick={toggleTheme}>
              <div className={styles.settingIcon}>
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              </div>
              <div className={styles.settingText}>
                <h4>Tema de la aplicación</h4>
                <p>Modo actual: {theme === 'dark' ? 'Oscuro' : 'Claro'}</p>
              </div>
              <div className={`${styles.toggleSwitch} ${theme === 'dark' ? styles.toggleOn : ''}`}>
                <div className={styles.toggleKnob} />
              </div>
            </div>
            
            <div className={styles.settingItem}>
              <div className={styles.settingIcon}>
                <Palette size={20} />
              </div>
              <div className={styles.settingText}>
                <h4>Color Principal</h4>
                <p>Naranja Institucional</p>
              </div>
            </div>
          </div>

          <div className={styles.settingSection}>
            <h3>Privacidad y Notificaciones</h3>
            <div className={styles.settingItem}>
              <div className={styles.settingIcon}>
                <Bell size={20} />
              </div>
              <div className={styles.settingText}>
                <h4>Notificaciones por Email</h4>
                <p>Activadas para mensajes importantes</p>
              </div>
            </div>
            <div className={styles.settingItem}>
              <div className={styles.settingIcon}>
                <Shield size={20} />
              </div>
              <div className={styles.settingText}>
                <h4>Privacidad del Perfil</h4>
                <p>Público para docentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
