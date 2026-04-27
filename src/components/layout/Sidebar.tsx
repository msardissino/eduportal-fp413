import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  GraduationCap 
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
          <SidebarItem icon={Settings} label="Configuración" />
          <div onClick={handleLogout} style={{ cursor: 'pointer' }}>
            <SidebarItem icon={LogOut} label="Cerrar Sesión" />
          </div>
        </div>
      </nav>
    </aside>
  );
};
