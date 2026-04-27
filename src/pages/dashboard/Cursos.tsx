import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Book, Clock, GraduationCap, X, Edit2, Trash2 } from 'lucide-react';
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

interface Docente {
  id: string;
  full_name: string;
}

const Cursos: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const role = localStorage.getItem('userRole') || 'alumno';

  // Form State
  const [formData, setFormData] = useState({
    nombre: '',
    nivel: 'Básico',
    carga_horaria_total: 0,
    modalidad: 'Presencial',
    id_docente: ''
  });

  useEffect(() => {
    fetchCourses();
    fetchDocentes();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchDocentes = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .eq('role', 'docente');
      
      if (error) throw error;
      setDocentes(data || []);
    } catch (error) {
      console.error('Error fetching docentes:', error);
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      nombre: '',
      nivel: 'Básico',
      carga_horaria_total: 0,
      modalidad: 'Presencial',
      id_docente: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (course: Course) => {
    setIsEditing(true);
    setEditingId(course.id);
    setFormData({
      nombre: course.nombre,
      nivel: course.nivel,
      carga_horaria_total: course.carga_horaria_total,
      modalidad: course.modalidad,
      id_docente: course.id_docente || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar el curso "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('cursos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCourses();
    } catch (error) {
      alert('Error al eliminar el curso.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        id_docente: formData.id_docente || null
      };

      if (isEditing && editingId) {
        const { error } = await supabase
          .from('cursos')
          .update(payload)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cursos')
          .insert([payload]);
        if (error) throw error;
      }
      
      setIsModalOpen(false);
      fetchCourses();
    } catch (error) {
      alert(isEditing ? 'Error al actualizar el curso.' : 'Error al crear el curso.');
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
          <button className={styles.addBtn} onClick={handleOpenCreate}>
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
                  Ver
                </button>
                {role === 'administrativo' && (
                  <>
                    <button 
                      className={styles.editBtn}
                      title="Editar Curso"
                      onClick={() => handleOpenEdit(course)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      className={styles.deleteBtn}
                      title="Eliminar Curso"
                      onClick={() => handleDeleteCourse(course.id, course.nombre)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Curso (Alta/Edición) */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.modalHeader}>
              <h2>{isEditing ? 'Editar Curso' : 'Crear Nuevo Curso'}</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleSubmit}>
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
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Carga Horaria</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.carga_horaria_total}
                    onChange={(e) => setFormData({...formData, carga_horaria_total: parseInt(e.target.value)})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Docente Asignado</label>
                  <select 
                    value={formData.id_docente}
                    onChange={(e) => setFormData({...formData, id_docente: e.target.value})}
                  >
                    <option value="">Sin asignar</option>
                    {docentes.map(d => (
                      <option key={d.id} value={d.id}>{d.full_name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>
                {isEditing ? 'Guardar Cambios' : 'Publicar Curso'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cursos;
