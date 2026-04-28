import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Users, Award, Sparkles, Menu, X, Clock, Calendar, Star, Quote, Mail, Phone, MapPin, Instagram, Facebook, Twitter, Linkedin } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Landing.module.css';
import heroImage from '../../assets/hero-building.png';
import gallery1 from '../../assets/gallery1.png';
import gallery2 from '../../assets/gallery2.png';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(6);
    
    if (!error && data) {
      setCourses(data);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Background change
      setScrolled(currentScrollY > 20);
      
      // Hide/Show logic
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false); // Scrolling down
      } else {
        setIsVisible(true); // Scrolling up
      }
      
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className={`${styles.landing} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${!isVisible ? styles.hidden : ''}`}>
        <div className={styles.navContainer}>
          <div className={styles.logo} onClick={() => navigate('/')}>
            <div className={styles.logoIcon}>
              <GraduationCap size={24} />
            </div>
            <span className={styles.logoText}>
              EduPortal <span className={styles.muted}>FP 413</span>
            </span>
          </div>

          {/* Desktop Nav */}
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

          {/* Mobile Menu Toggle */}
          <button className={styles.menuToggle} onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.active : ''}`}>
          <div className={styles.mobileLinks}>
            <a href="#cursos" onClick={toggleMenu}>Cursos</a>
            <a href="#nosotros" onClick={toggleMenu}>Nosotros</a>
            <a href="#contacto" onClick={toggleMenu}>Contacto</a>
            <button 
              className={styles.loginBtnMobile}
              onClick={() => {
                toggleMenu();
                navigate('/login');
              }}
            >
              Acceso Usuarios
            </button>
          </div>
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
              <button 
                className={styles.secondaryBtn}
                onClick={() => document.getElementById('cursos')?.scrollIntoView({ behavior: 'smooth' })}
              >
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

        <section id="cursos" className={styles.coursesSection}>
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">Nuestra Oferta Educativa</h2>
            <p>Descubre los cursos que están transformando carreras. Capacitación profesional, gratuita y con certificación oficial.</p>
          </div>

          <div className={styles.courseGrid}>
            {courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className={styles.courseCard} onClick={() => navigate(`/cursos/${course.id}`)}>
                  <div className={styles.courseCardImage}>
                    <BookOpen size={48} />
                    <span className={styles.courseBadge}>{course.nivel}</span>
                  </div>
                  <div className={styles.courseCardContent}>
                    <h3>{course.nombre}</h3>
                    <p>{course.descripcion || 'Capacitación técnica integral diseñada para los desafíos del mercado actual.'}</p>
                    <div className={styles.courseMeta}>
                      <div className={styles.courseMetaItem}>
                        <Clock size={16} />
                        <span>{course.carga_horaria_total}hs</span>
                      </div>
                      <div className={styles.courseMetaItem}>
                        <Calendar size={16} />
                        <span>{course.modalidad}</span>
                      </div>
                    </div>
                    <button className={styles.viewMoreBtn}>Ver Detalles</button>
                  </div>
                </div>
              ))
            ) : (
              // Mock cards for when DB is empty/loading
              [
                { id: 1, nombre: 'Desarrollo Web Fullstack', nivel: 'Intermedio', horas: 200, mod: 'Híbrida', desc: 'Aprende React, Node.js y bases de datos modernas para crear aplicaciones reales.' },
                { id: 2, nombre: 'Diseño Gráfico Digital', nivel: 'Básico', horas: 120, mod: 'Presencial', desc: 'Domina herramientas de diseño y principios de UI/UX para interfaces digitales.' },
                { id: 3, nombre: 'Reparación de PC y Redes', nivel: 'Básico', horas: 160, mod: 'Presencial', desc: 'Mantenimiento de hardware, redes y soporte técnico profesional.' }
              ].map((mock) => (
                <div key={mock.id} className={styles.courseCard}>
                  <div className={styles.courseCardImage}>
                    <BookOpen size={48} />
                    <span className={styles.courseBadge}>{mock.nivel}</span>
                  </div>
                  <div className={styles.courseCardContent}>
                    <h3>{mock.nombre}</h3>
                    <p>{mock.desc}</p>
                    <div className={styles.courseMeta}>
                      <div className={styles.courseMetaItem}><Clock size={16} /><span>{mock.horas}hs</span></div>
                      <div className={styles.courseMetaItem}><Calendar size={16} /><span>{mock.mod}</span></div>
                    </div>
                    <button className={styles.viewMoreBtn} onClick={() => navigate('/login')}>Próximamente</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className={styles.features}>
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
        <section id="nosotros" className={styles.processSection}>
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">¿Cómo empezar?</h2>
            <p>Tu camino hacia la formación profesional es simple y directo.</p>
          </div>

          <div className={styles.processGrid}>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>1</div>
              <h3>Inscribite</h3>
              <p>Elegí el curso que te interesa y completá tus datos en nuestra plataforma digital.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>2</div>
              <h3>Cursá</h3>
              <p>Participá de las clases presenciales o virtuales con docentes expertos en el área.</p>
            </div>
            <div className={styles.processStep}>
              <div className={styles.stepNumber}>3</div>
              <h3>Recibite</h3>
              <p>Obtené tu certificación oficial y empezá a trabajar en lo que te apasiona.</p>
            </div>
          </div>
        </section>
        <section className={styles.gallerySection}>
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">Nuestra Comunidad</h2>
            <p>Conocé nuestras instalaciones y el ambiente de aprendizaje que nos define.</p>
          </div>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryItem}>
              <img src={gallery1} alt="Aula de Informática" />
              <div className={styles.galleryOverlay}>
                <h3>Entornos Modernos</h3>
                <p>Equipamiento de última generación para tu formación.</p>
              </div>
            </div>
            <div className={styles.galleryItem}>
              <img src={gallery2} alt="Proyectos Técnicos" />
              <div className={styles.galleryOverlay}>
                <h3>Práctica Real</h3>
                <p>Aprendizaje basado en proyectos y desafíos del mundo laboral.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.testimonialsSection}>
          <div className={styles.sectionHeader}>
            <h2 className="gradient-text">Historias de Éxito</h2>
            <p>Lo que dicen nuestros egresados sobre su paso por el CFP 413.</p>
          </div>
          <div className={styles.testimonialGrid}>
            <div className={`${styles.testimonialCard} glass`}>
              <Quote className={styles.quoteIcon} size={40} />
              <p className={styles.testimonialText}>
                "Gracias al curso de Desarrollo Web pude conseguir mi primer empleo como junior. Los docentes son excelentes y te acompañan siempre."
              </p>
              <div className={styles.testimonialUser}>
                <div className={styles.userAvatar}>JP</div>
                <div className={styles.userInfo}>
                  <h4>Juan Pablo</h4>
                  <p>Egresado 2025</p>
                </div>
              </div>
            </div>
            <div className={`${styles.testimonialCard} glass`}>
              <Quote className={styles.quoteIcon} size={40} />
              <p className={styles.testimonialText}>
                "La calidad técnica y humana del centro es increíble. Hice el curso de Diseño y hoy trabajo freelance para clientes del exterior."
              </p>
              <div className={styles.testimonialUser}>
                <div className={styles.userAvatar}>MG</div>
                <div className={styles.userInfo}>
                  <h4>María García</h4>
                  <p>Egresada 2024</p>
                </div>
              </div>
            </div>
            <div className={`${styles.testimonialCard} glass`}>
              <Quote className={styles.quoteIcon} size={40} />
              <p className={styles.testimonialText}>
                "Empecé desde cero en Reparación de PC y ahora tengo mi propio taller. El CFP me dio las herramientas que necesitaba."
              </p>
              <div className={styles.testimonialUser}>
                <div className={styles.userAvatar}>RL</div>
                <div className={styles.userInfo}>
                  <h4>Ricardo López</h4>
                  <p>Egresado 2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contacto" className={styles.contactSection}>
          <div className={styles.contactGrid}>
            <div className={styles.contactInfo}>
              <h2 className="gradient-text">Contacto</h2>
              <p>Estamos aquí para ayudarte a dar el siguiente paso en tu carrera profesional. ¡Escribinos!</p>
              
              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}><Phone size={24} /></div>
                <div>
                  <h4>Teléfono / WhatsApp</h4>
                  <p>+54 11 1234 5678</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}><Mail size={24} /></div>
                <div>
                  <h4>Email</h4>
                  <p>contacto@cfp413.edu.ar</p>
                </div>
              </div>
              
              <div className={styles.contactMethod}>
                <div className={styles.methodIcon}><MapPin size={24} /></div>
                <div>
                  <h4>Dirección</h4>
                  <p>Calle Principal 123, San Miguel, Bs. As.</p>
                </div>
              </div>
              
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialBtn}><Instagram size={20} /></a>
                <a href="#" className={styles.socialBtn}><Facebook size={20} /></a>
                <a href="#" className={styles.socialBtn}><Twitter size={20} /></a>
                <a href="#" className={styles.socialBtn}><Linkedin size={20} /></a>
              </div>
            </div>
            
            <div className={styles.mapContainer}>
              <div className={styles.mapPlaceholder}>
                <MapPin size={48} />
                <p>Mapa Interactivo de Google Maps<br/>San Miguel, Provincia de Buenos Aires</p>
                {/* Aquí se integraría el iframe de Google Maps */}
                <div className="glass" style={{padding: '20px', borderRadius: '12px'}}>
                  [Google Maps Iframe Placeholder]
                </div>
              </div>
            </div>
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
