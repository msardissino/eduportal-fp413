import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, GraduationCap, Users, BookOpen, CheckCircle2, MapPin, Send, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './PublicCourseDetail.module.css';
import infographicImg from '../../assets/course-infographic.png';

interface Course {
  id: string;
  nombre: string;
  nivel: string;
  carga_horaria_total: number;
  modalidad: string;
  dias_cursada: string[];
  turno: string;
  descripcion?: string;
  profiles?: { full_name: string };
}

interface ProspectForm {
  nombre_completo: string;
  email: string;
  whatsapp: string;
  mensaje: string;
}

const PublicCourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState<ProspectForm>({
    nombre_completo: '',
    email: '',
    whatsapp: '',
    mensaje: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select(`*, profiles:id_docente (full_name)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setCourse(data);
    } catch (error) {
      console.error('Error fetching course:', error);
      // Mock data for demonstration
      setCourse({
        id: id || '1',
        nombre: 'Desarrollo Web Fullstack con React',
        nivel: 'Intermedio',
        carga_horaria_total: 160,
        modalidad: 'Híbrida',
        dias_cursada: ['Lunes', 'Miércoles'],
        turno: 'Noche (18:30 a 21:30)',
        descripcion: 'Aprende las tecnologías más demandadas del mercado. Desde HTML5 y CSS3 hasta arquitecturas modernas con React y Node.js. Este curso te prepara para los desafíos del mundo laboral real con proyectos prácticos y tutorías personalizadas.',
        profiles: { full_name: 'Lic. Mariano Ardissino' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('prospectos')
        .insert([{
          ...formData,
          id_curso: id
        }]);

      if (error) throw error;
      setFormSubmitted(true);
      setTimeout(() => {
        setShowModal(false);
        setFormSubmitted(false);
        setFormData({ nombre_completo: '', email: '', whatsapp: '', mensaje: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting prospect:', error);
      alert('Hubo un error al enviar tus datos. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className={styles.container}><div className={styles.content}>Cargando...</div></div>;
  if (!course) return <div className={styles.container}><div className={styles.content}>Curso no encontrado.</div></div>;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Volver al Inicio
        </button>

        <section className={styles.hero}>
          <div className={styles.courseInfo}>
            <span className={styles.badge}>{course.nivel}</span>
            <h1 className="gradient-text">{course.nombre}</h1>
            <p className={styles.description}>
              {course.descripcion || 'Formación técnica de alta calidad diseñada para insertarte en el mercado laboral actual.'}
            </p>

            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}><Clock size={24} /></div>
                <div className={styles.metaContent}>
                  <span>Carga Horaria</span>
                  <p>{course.carga_horaria_total} horas</p>
                </div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}><Calendar size={24} /></div>
                <div className={styles.metaContent}>
                  <span>Días de Cursada</span>
                  <p>{course.dias_cursada?.join(', ') || 'A confirmar'}</p>
                </div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}><Users size={24} /></div>
                <div className={styles.metaContent}>
                  <span>Turno</span>
                  <p>{course.turno || 'Noche'}</p>
                </div>
              </div>
              <div className={styles.metaItem}>
                <div className={styles.metaIcon}><GraduationCap size={24} /></div>
                <div className={styles.metaContent}>
                  <span>Modalidad</span>
                  <p>{course.modalidad}</p>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.enrollBtn} onClick={() => setShowModal(true)}>
                Inscribirme ahora
              </button>
            </div>
          </div>

          <div className={styles.infographicContainer}>
            <img 
              src={infographicImg} 
              alt="Course Infographic" 
              className={styles.infographicImage}
            />
          </div>
        </section>

        <div className={styles.detailsGrid}>
          <div className={styles.mainDetails}>
            <section className={styles.detailSection}>
              <h2><BookOpen size={28} /> Temario del Curso</h2>
              <div className={styles.curriculum}>
                <div className={styles.curriculumItem}>
                  <div>
                    <strong>Módulo 1: Fundamentos</strong>
                    <p>Introducción a la arquitectura y conceptos básicos.</p>
                  </div>
                  <CheckCircle2 size={20} className={styles.primaryText} />
                </div>
                <div className={styles.curriculumItem}>
                  <div>
                    <strong>Módulo 2: Desarrollo Avanzado</strong>
                    <p>Implementación de lógica compleja y optimización.</p>
                  </div>
                  <CheckCircle2 size={20} className={styles.primaryText} />
                </div>
                <div className={styles.curriculumItem}>
                  <div>
                    <strong>Módulo 3: Proyecto Integrador</strong>
                    <p>Desarrollo de un producto real de punta a punta.</p>
                  </div>
                  <CheckCircle2 size={20} className={styles.primaryText} />
                </div>
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={`${styles.sidebarCard} glass`}>
              <h3>Información General</h3>
              <div className={styles.docenteBox}>
                <div className={styles.avatar}>
                  {course.profiles?.full_name?.charAt(0) || 'D'}
                </div>
                <div>
                  <p className={styles.docenteName}>{course.profiles?.full_name || 'Sin asignar'}</p>
                  <p className={styles.docenteRole}>Docente a cargo</p>
                </div>
              </div>
              <div className={styles.metaItem} style={{background: 'none', border: 'none', padding: '0'}}>
                <MapPin size={20} />
                <p style={{fontSize: '0.9rem'}}>Sede Central - San Miguel</p>
              </div>
            </div>

            <div className={`${styles.sidebarCard} glass`}>
              <h3>Certificación</h3>
              <p style={{fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6'}}>
                Al finalizar el curso, recibirás un certificado oficial avalado por el Ministerio de Educación de la Provincia de Buenos Aires.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {/* Pre-Enrollment Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass`}>
            <button className={styles.closeModal} onClick={() => setShowModal(false)}>
              <X size={24} />
            </button>
            
            {!formSubmitted ? (
              <>
                <h2>Inscripción a {course.nombre}</h2>
                <p>Completa tus datos y nos pondremos en contacto contigo a la brevedad.</p>
                
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Nombre Completo</label>
                    <input 
                      type="text" 
                      name="nombre_completo" 
                      value={formData.nombre_completo}
                      onChange={handleInputChange}
                      required 
                      placeholder="Ej: Juan Pérez"
                    />
                  </div>
                  
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label>Email</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email}
                        onChange={handleInputChange}
                        required 
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>WhatsApp</label>
                      <input 
                        type="tel" 
                        name="whatsapp" 
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        required 
                        placeholder="11 1234 5678"
                      />
                    </div>
                  </div>
                  
                  <div className={styles.inputGroup}>
                    <label>Mensaje o consulta (Opcional)</label>
                    <textarea 
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleInputChange}
                      rows={3} 
                      placeholder="Contanos tus dudas..."
                    ></textarea>
                  </div>
                  
                  <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando...' : (
                      <>
                        Enviar Solicitud
                        <Send size={18} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className={styles.successMessage}>
                <CheckCircle2 size={64} className={styles.primaryText} />
                <h2>¡Solicitud Enviada!</h2>
                <p>Gracias por tu interés. Un representante del CFP 413 se contactará contigo muy pronto.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicCourseDetail;
