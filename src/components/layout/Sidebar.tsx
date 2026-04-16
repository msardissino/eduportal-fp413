import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings, 
  LogOut,
  GraduationCap
} from 'lucide-react';
import styles from './Sidebar.module.css';

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

export const Sidebar: React.FC = () => {
  const role = localStorage.getItem('userRole') || 'alumno';

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", roles: ['alumno', 'docente', 'administrativo'] },
    { icon: Users, label: "Alumnos", roles: ['docente', 'administrativo'] },
    { icon: Users, label: "Docentes", roles: ['administrativo'] },
    { icon: BookOpen, label: "Cursos", roles: ['alumno', 'administrativo'] },
    { icon: Calendar, label: "Asistencia", roles: ['alumno', 'docente', 'administrativo'] },
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
          <SidebarItem 
            key={idx} 
            icon={item.icon} 
            label={item.label} 
            active={item.label === "Dashboard"} 
          />
        ))}
        
        <div className={styles.footer}>
          <SidebarItem icon={Settings} label="Configuración" />
          <div onClick={() => {
            localStorage.removeItem('userRole');
            window.location.href = '/';
          }}>
            <SidebarItem icon={LogOut} label="Cerrar Sesión" />
          </div>
        </div>
      </nav>
    </aside>
  );
};
