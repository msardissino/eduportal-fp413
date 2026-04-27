import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Book, Clock, GraduationCap, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Cursos.module.css';

interface Course {
  id: string;
  nombre: string;
  nivel: string;
  carga_horaria_total: number;
  modalidad: string;
  id_docente?: string;
  created_at: string;
}

const Cursos: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('userRole') || 'alumno';

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    nivel: 'Básico',
    carga_horaria_total: 0,
    modalidad: 'Presencial'
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('cursos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      // Fallback a datos mock si falla o no existe la tabla aún
      setCourses([
        { id: '1', nombre: 'Programación Web Fullstack', nivel: 'Intermedio', carga_horaria_total: 240, modalidad: 'Híbrida', created_at: new Date().toISOString() },
        { id: '2', nombre: 'Introducción a la Electrónica', nivel: 'Básico', carga_horaria_total: 120, modalidad: 'Presencial', created_at: new Date().toISOString() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('cursos')
        .insert([formData]);

      if (error) throw error;
      
      setIsModalOpen(false);
      fetchCourses();
      setFormData({ nombre: '', nivel: 'Básico', carga_horaria_total: 0, modalidad: 'Presencial' });
    } catch (error) {
      alert('Error al crear el curso. ¿Ya ejecutaste el script SQL en Supabase?');
    }
  };

  const filteredCourses = courses.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className="gradient-text">Gestión de Cursos</h1>
          <p className={styles.subtitle}>Administra la oferta académica oficial del CFP 413.</p>
        </div>
        {role === 'administrativo' && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Nuevo Curso
          </button>
        )}
      </header>

      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <Search size={20} className={styles.searchIcon} />
          <input 
            type="text" 
            placeholder="Buscar cursos..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filterGroup}>
          <button className={styles.filterBtn}>
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Cargando cursos...</div>
      ) : (
        <div className={styles.grid}>
          {filteredCourses.map(course => (
            <div key={course.id} className={`${styles.courseCard} glass`}>
              <div className={styles.cardHeader}>
                <div className={styles.iconBox}>
                  <Book size={24} />
                </div>
                <span className={`${styles.badge} ${styles[course.nivel.toLowerCase()]}`}>
                  {course.nivel}
                </span>
              </div>
              <h3 className={styles.courseName}>{course.nombre}</h3>
              <div className={styles.cardInfo}>
                <div className={styles.infoItem}>
                  <Clock size={16} />
                  <span>{course.carga_horaria_total}hs</span>
                </div>
                <div className={styles.infoItem}>
                  <GraduationCap size={16} />
                  <span>{course.modalidad}</span>
                </div>
              </div>
              <div className={styles.cardActions}>
                <button 
                  className={styles.viewBtn} 
                  onClick={() => navigate(`/dashboard/cursos/${course.id}`)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Nuevo Curso */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.modalHeader}>
              <h2>Crear Nuevo Curso</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleCreateCourse}>
              <div className={styles.formGroup}>
                <label>Nombre del Curso</label>
                <input 
                  type="text" 
                  required 
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  placeholder="Ej: Programación Avanzada"
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Nivel</label>
                  <select 
                    value={formData.nivel}
                    onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Modalidad</label>
                  <select 
                    value={formData.modalidad}
                    onChange={(e) => setFormData({...formData, modalidad: e.target.value})}
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrida">Híbrida</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Carga Horaria Total</label>
                <input 
                  type="number" 
                  required 
                  value={formData.carga_horaria_total}
                  onChange={(e) => setFormData({...formData, carga_horaria_total: parseInt(e.target.value)})}
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Publicar Curso</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cursos;
