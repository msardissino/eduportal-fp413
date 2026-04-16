import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Users, Award } from 'lucide-react';
import styles from './Landing.module.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <GraduationCap size={24} />
          </div>
          <span className={styles.logoText}>FP 413 <span className={styles.muted}>U.Mu.Pla</span></span>
        </div>
        <div className={styles.navLinks}>
          <a href="#cursos">Cursos</a>
          <a href="#nosotros">Nosotros</a>
          <button 
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Acceso Usuarios
          </button>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>Centro de Formación Profesional</span>
          <h1 className={styles.heroTitle}>
            Tu futuro comienza <br />
            <span className="gradient-text">con formación real.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Brindamos herramientas y conocimientos para el desarrollo profesional de nuestra comunidad. 
            Cursos gratuitos con certificación oficial.
          </p>
          <div className={styles.heroActions}>
            <button className={styles.primaryBtn}>
              Ver Cursos Disponibles
              <ArrowRight size={20} />
            </button>
            <button className={styles.secondaryBtn}>
              Saber más
            </button>
          </div>
        </div>
        <div className={styles.heroImageContainer}>
          <div className={`${styles.glowCircle} ${styles.glow1}`} />
          <div className={`${styles.glowCircle} ${styles.glow2}`} />
          <div className={styles.heroCard}>
             <GraduationCap size={80} className={styles.floatingIcon} />
             <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <strong>+50</strong>
                  <span>Cursos</span>
                </div>
                <div className={styles.stat}>
                  <strong>+2000</strong>
                  <span>Egresados</span>
                </div>
             </div>
          </div>
        </div>
      </section>

      <section id="cursos" className={styles.features}>
        <div className={styles.feature}>
          <BookOpen className={styles.featureIcon} />
          <h3>Variedad Educativa</h3>
          <p>Desde oficios tradicionales hasta tecnología de vanguardia.</p>
        </div>
        <div className={styles.feature}>
          <Users className={styles.featureIcon} />
          <h3>Comunidad Activa</h3>
          <p>Acompañamiento constante durante todo tu trayecto educativo.</p>
        </div>
        <div className={styles.feature}>
          <Award className={styles.featureIcon} />
          <h3>Título Oficial</h3>
          <p>Certificaciones avaladas por el Ministerio de Educación.</p>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2026 FP 413 U.Mu.Pla - Unión de Mujeres Platenses. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Landing;
