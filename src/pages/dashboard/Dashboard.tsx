import React from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp } from 'lucide-react';
import styles from './Dashboard.module.css';

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className={`${styles.card} glass`}>
    <div className={styles.cardHeader}>
      <div className={styles.cardIcon}>
        <Icon size={24} className={styles.primaryText} />
      </div>
      {trend && <span className={styles.trend}>+{trend}%</span>}
    </div>
    <div className={styles.cardBody}>
      <h3 className={styles.cardValue}>{value}</h3>
      <p className={styles.cardLabel}>{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const role = localStorage.getItem('userRole') || 'alumno';
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Panel de {roleName}</h1>
          <p className={styles.subtitle}>Gestiona tu actividad y progreso educativo.</p>
        </div>
        {role === 'administrativo' && (
          <button className={styles.actionButton}>
            Descargar Reporte Global
          </button>
        )}
      </header>

      <div className={styles.statsGrid}>
        <StatCard icon={Users} label={role === 'alumno' ? "Compañeros" : "Alumnos Activos"} value="1,284" trend="12" />
        <StatCard icon={GraduationCap} label="Cursos Completados" value="452" trend="8" />
        <StatCard icon={BookOpen} label="Cursos en Progreso" value="86" />
        <StatCard icon={TrendingUp} label="Promedio General" value="9.4" trend="3" />
      </div>

      <div className={styles.mainGrid}>
        <div className={`${styles.largeCard} glass`}>
          <h2 className={styles.cardTitle}>Novedades del Centro</h2>
          <div className={styles.placeholderList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.listItem}>
                <div className={styles.itemDot} />
                <div className={styles.itemContent}>
                  <p className={styles.itemTitle}>Inscripciones abiertas para el ciclo 2026</p>
                  <p className={styles.itemTime}>Publicado hace {i} día</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={`${styles.smallCard} glass`}>
          <h2 className={styles.cardTitle}>Mi Agenda</h2>
          <p className={styles.emptyState}>No hay clases programadas para hoy.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
