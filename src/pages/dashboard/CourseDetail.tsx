import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Clock, GraduationCap, Users, FileText, Plus } from 'lucide-react';
import AlumnosTab from './tabs/AlumnosTab';
import AsistenciaTab from './tabs/AsistenciaTab';
import MaterialesTab from './tabs/MaterialesTab';
import ChatTab from './tabs/ChatTab';
import TramitesTab from './tabs/TramitesTab';
import CalendarioTab from './tabs/CalendarioTab';
import { supabase } from '../../lib/supabase';
import styles from './CourseDetail.module.css';

interface Course {
  id: string;
  nombre: string;
  nivel: string;
  carga_horaria_total: number;
  modalidad: string;
  temario_url?: string;
  id_docente?: string;
  profiles?: { full_name: string };
}

interface EnrolledStudent {
  id: string;
  estado: string;
  calificacion_final: number;
  asistencia_porcentaje: number;
  profiles: { id: string, full_name: string, dni: string } | { id: string, full_name: string, dni: string }[];
}

const CourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [students, setStudents] = useState<EnrolledStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('alumnos');
  const role = localStorage.getItem('userRole') || 'alumno';

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      // Get Course Info
      const { data: courseData, error: courseError } = await supabase
        .from('cursos')
        .select(`*, profiles:id_docente (full_name)`)
        .eq('id', id)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Get Enrolled Students
      const { data: studentsData, error: studentsError } = await supabase
        .from('inscripciones')
        .select(`
          id, estado, calificacion_final, asistencia_porcentaje,
          profiles:id_alumno (id, full_name, dni)
        `)
        .eq('id_curso', id);

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);
    } catch (error) {
      console.error('Error fetching course details:', error);
      // Mock data for preview
      setCourse({
        id: id || '1', nombre: 'Desarrollo Frontend React', nivel: 'Intermedio',
        carga_horaria_total: 180, modalidad: 'Híbrida',
        profiles: { full_name: 'Lic. Mariano Ardissino' }
      });
      setStudents([
        { id: 'ia1', estado: 'Cursando', calificacion_final: 7, asistencia_porcentaje: 85, profiles: { id: 'p1', full_name: 'Juan Pérez', dni: '1234' } },
        { id: 'ia2', estado: 'Egresado', calificacion_final: 9, asistencia_porcentaje: 95, profiles: { id: 'p2', full_name: 'Ana García', dni: '5678' } }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando información del curso...</div>;
  if (!course) return <div className={styles.error}>Curso no encontrado.</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver a Cursos
      </button>

      <div className={styles.header + " glass"}>
        <div className={styles.headerMain}>
           <div className={styles.iconBox}>
             <Book size={40} />
           </div>
           <div>
             <span className={styles.label}>Curso de Formación</span>
             <h1>{course.nombre}</h1>
           </div>
        </div>
        <div className={styles.headerStats}>
           <div className={styles.stat}>
             <Clock size={16} />
             <span>{course.carga_horaria_total} horas</span>
           </div>
           <div className={styles.stat}>
             <GraduationCap size={16} />
             <span>{course.modalidad}</span>
           </div>
           <div className={styles.stat}>
             <Users size={16} />
             <span>{students.length} Inscriptos</span>
           </div>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabList}>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'alumnos' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('alumnos')}
          >
            Alumnos
          </button>
          {(role === 'docente' || role === 'administrativo') && (
            <button 
              className={`${styles.tabBtn} ${activeTab === 'asistencia' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('asistencia')}
            >
              Asistencia
            </button>
          )}
          <button 
            className={`${styles.tabBtn} ${activeTab === 'calendario' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('calendario')}
          >
            Calendario
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'materiales' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('materiales')}
          >
            Materiales
          </button>
          <button 
            className={`${styles.tabBtn} ${activeTab === 'chat' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            Chat
          </button>
          {(role === 'docente' || role === 'administrativo') && (
            <button 
              className={`${styles.tabBtn} ${activeTab === 'tramites' ? styles.activeTab : ''}`}
              onClick={() => setActiveTab('tramites')}
            >
              Trámites
            </button>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.mainContent}>
          {activeTab === 'alumnos' && <AlumnosTab students={students} role={role} />}
          {activeTab === 'asistencia' && <AsistenciaTab courseId={id!} students={students} />}
          {activeTab === 'calendario' && <CalendarioTab courseId={id!} role={role} />}
          {activeTab === 'materiales' && <MaterialesTab courseId={id!} role={role} />}
          {activeTab === 'chat' && <ChatTab courseId={id!} role={role} />}
          {activeTab === 'tramites' && <TramitesTab courseId={id!} role={role} />}
        </div>

        <div className={styles.sidebar}>
          <div className={styles.sideCard + " glass"}>
            <h3>Docente Titular</h3>
            <div className={styles.docenteBox}>
              <div className={styles.avatarSmall}>D</div>
              <div>
                <p className={styles.docenteName}>{course.profiles?.full_name || 'Sin asignar'}</p>
                <p className={styles.docenteRole}>Instructor Senior</p>
              </div>
            </div>
            <button className={styles.contactBtn}>Contactar Docente</button>
          </div>

          <div className={styles.sideCard + " glass"}>
             <h3>Recursos</h3>
             <div className={styles.resourceItem}>
               <FileText size={18} />
               <span>Programa del Curso.pdf</span>
             </div>
             <button className={styles.resourceBtn}>Subir Temario</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
