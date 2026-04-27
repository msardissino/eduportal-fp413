import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Mail, Fingerprint, Briefcase, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Alumnos.module.css';

interface Alumno {
  id: string;
  full_name: string;
  email: string;
  dni: string;
  situacion_laboral: string;
}

const Alumnos: React.FC = () => {
  const navigate = useNavigate();
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    dni: '',
    situacion_laboral: 'Desempleado',
    estudios_previos: '',
    role: 'alumno'
  });

  useEffect(() => {
    fetchAlumnos();
  }, []);

  const fetchAlumnos = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'alumno');

      if (error) throw error;
      setAlumnos(data || []);
    } catch (error) {
      console.error('Error fetching alumnos:', error);
      // Mock data
      setAlumnos([
        { id: '1', full_name: 'Juan Pérez', email: 'juan@example.com', dni: '12345678', situacion_laboral: 'Empleado' },
        { id: '2', full_name: 'María García', email: 'maria@example.com', dni: '87654321', situacion_laboral: 'Desempleado' },
      ]);
    }
  };

  const handleCreateAlumno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          ...formData,
          id: crypto.randomUUID()
        }]);

      if (error) throw error;
      setIsModalOpen(false);
      fetchAlumnos();
      setFormData({ full_name: '', email: '', dni: '', situacion_laboral: 'Desempleado', estudios_previos: '', role: 'alumno' });
    } catch (error) {
      alert('Error al registrar alumno.');
    }
  };
  const filtered = alumnos.filter(a => 
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.dni.includes(searchTerm)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Registro de Alumnos</h1>
          <p className={styles.subtitle}>Base de datos unificada de estudiantes del CFP 413.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} />
          Registrar Alumno
        </button>
      </header>

      <div className={styles.searchBar}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o DNI..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.tableCard + " glass"}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>DNI</th>
              <th>Contacto</th>
              <th>Situación</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(alumno => (
              <tr key={alumno.id}>
                <td>
                  <div className={styles.nameCell}>
                    <div className={styles.avatar}>{alumno.full_name[0]}</div>
                    <span>{alumno.full_name}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.iconInfo}>
                    <Fingerprint size={14} />
                    {alumno.dni}
                  </div>
                </td>
                <td>
                  <div className={styles.iconInfo}>
                    <Mail size={14} />
                    {alumno.email}
                  </div>
                </td>
                <td>
                  <div className={styles.statusBadge}>
                    <Briefcase size={14} />
                    {alumno.situacion_laboral}
                  </div>
                </td>
                <td>
                  <button 
                    className={styles.editBtn}
                    onClick={() => navigate(`/dashboard/perfil/${alumno.id}`)}
                  >
                    Perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.modalHeader}>
              <h2>Registrar Nuevo Alumno</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleCreateAlumno}>
              <div className={styles.formGroup}>
                <label>Nombre Completo</label>
                <input 
                  type="text" required 
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input 
                    type="email" required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>DNI</label>
                  <input 
                    type="text" required 
                    value={formData.dni}
                    onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Situación Laboral</label>
                <select 
                  value={formData.situacion_laboral}
                  onChange={(e) => setFormData({...formData, situacion_laboral: e.target.value})}
                >
                  <option value="Empleado">Empleado</option>
                  <option value="Desempleado">Desempleado</option>
                  <option value="Estudiante">Estudiante</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Estudios Previos</label>
                <textarea 
                  rows={2}
                  value={formData.estudios_previos}
                  onChange={(e) => setFormData({...formData, estudios_previos: e.target.value})}
                  placeholder="Ej: Secundario Completo, Curso de Inglés..."
                />
              </div>
              <button type="submit" className={styles.submitBtn}>Registrar en el Sistema</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumnos;
