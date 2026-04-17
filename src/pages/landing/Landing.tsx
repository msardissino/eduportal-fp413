import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Users, Award, Sparkles } from 'lucide-react';
import styles from './Landing.module.css';
import heroImage from '../../assets/hero-building.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.landing}>
      <nav className={styles.navbar}>
        <div className={styles.logo} onClick={() => navigate('/')}>
          <div className={styles.logoIcon}>
            <GraduationCap size={24} />
          </div>
          <span className={styles.logoText}>
            EduPortal <span className={styles.muted}>FP 413</span>
          </span>
        </div>
        <div className={styles.navLinks}>
          <a href="#cursos">Cursos</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
          <button 
            className={styles.loginBtn}
            onClick={() => navigate('/login')}
          >
            Acceso Usuarios
          </button>
        </div>
      </nav>

      <main>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <Sparkles size={16} />
              <span>Centro de Formación Profesional N° 413</span>
            </div>
            <h1 className={styles.heroTitle}>
              Forjando el futuro <br />
              <span className="gradient-text">con excelencia técnica.</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Capacitación gratuita y oficial para potenciar tu carrera profesional. 
              Únete a la comunidad educativa más grande de la región.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.primaryBtn} onClick={() => navigate('/login')}>
                Comenzar ahora
                <ArrowRight size={20} />
              </button>
              <button className={styles.secondaryBtn}>
                Explorar cursos
              </button>
            </div>
          </div>

          <div className={styles.heroImageContainer}>
            <img 
              src={heroImage} 
              alt="FP 413 Building" 
              className={styles.mainHeroImage}
            />
            <div className={styles.floatingCard}>
              <div className={styles.statGrid}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>+50</span>
                  <span className={styles.statLabel}>Cursos</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>2.5k</span>
                  <span className={styles.statLabel}>Alumnos</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="cursos" className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <BookOpen size={28} />
            </div>
            <h3>Formación Integral</h3>
            <p>Programas diseñados para responder a las demandas del mercado laboral actual.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Users size={28} />
            </div>
            <h3>Soporte Académico</h3>
            <p>Docentes especializados que te acompañan en cada etapa de tu aprendizaje.</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <Award size={28} />
            </div>
            <h3>Certificación Oficial</h3>
            <p>Títulos avalados que garantizan la calidad y validez de tu formación.</p>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <GraduationCap size={24} className={styles.primaryText} />
            <span className={styles.logoText}>EduPortal</span>
          </div>
          <p className={styles.copyright}>
            © 2026 FP 413 U.Mu.Pla. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
