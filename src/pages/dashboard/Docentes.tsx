import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, Mail, Fingerprint, DollarSign, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Docentes.module.css';

interface Docente {
  id: string;
  full_name: string;
  email: string;
  dni: string;
  especialidad_tecnica: string;
  valor_hora: number;
}

const Docentes: React.FC = () => {
  const navigate = useNavigate();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    dni: '',
    especialidad_tecnica: '',
    valor_hora: 0,
    role: 'docente'
  });

  useEffect(() => {
    fetchDocentes();
  }, []);

  const fetchDocentes = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'docente');

      if (error) throw error;
      setDocentes(data || []);
    } catch (error) {
      console.error('Error fetching docentes:', error);
      // Mock data
      setDocentes([
        { id: '1', full_name: 'Ing. Carlos Müller', email: 'carlos@fp413.edu.ar', dni: '15926348', especialidad_tecnica: 'Electromecánica', valor_hora: 4500 },
        { id: '2', full_name: 'Lic. Ana Blanco', email: 'ana@fp413.edu.ar', dni: '22883311', especialidad_tecnica: 'Sistemas', valor_hora: 4800 },
      ]);
    }
  };

  const handleCreateDocente = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('profiles')
        .insert([{
          ...formData,
          id: crypto.randomUUID() // Fallback si no hay auth user
        }]);

      if (error) throw error;
      setIsModalOpen(false);
      fetchDocentes();
      setFormData({ full_name: '', email: '', dni: '', especialidad_tecnica: '', valor_hora: 0, role: 'docente' });
    } catch (error) {
      alert('Error: Asegúrate de habilitar permisos en profiles o haber ejecutado el SQL.');
    }
  };

  const filtered = docentes.filter(d => 
    d.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.especialidad_tecnica.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Cuerpo Docente</h1>
          <p className={styles.subtitle}>Gestión de instructores y especialistas técnicos.</p>
        </div>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <UserPlus size={20} />
          Nuevo Docente
        </button>
      </header>

      <div className={styles.searchBar}>
        <Search size={20} />
        <input 
          type="text" 
          placeholder="Buscar por nombre o especialidad..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.grid}>
        {filtered.map(docente => (
          <div key={docente.id} className={`${styles.card} glass`}>
            <div className={styles.cardHeader}>
              <div className={styles.avatar}>{docente.full_name[0]}</div>
              <div className={styles.headerInfo}>
                <h3 className={styles.name}>{docente.full_name}</h3>
                <span className={styles.specialty}>{docente.especialidad_tecnica}</span>
              </div>
            </div>
            
            <div className={styles.stats}>
              <div className={styles.stat}>
                <Mail size={16} />
                <span>{docente.email}</span>
              </div>
              <div className={styles.stat}>
                <Fingerprint size={16} />
                <span>DNI: {docente.dni}</span>
              </div>
              <div className={styles.stat}>
                <DollarSign size={16} className={styles.greenText} />
                <span className={styles.price}>${docente.valor_hora}/hr</span>
              </div>
            </div>

            <button 
              className={styles.profileBtn}
              onClick={() => navigate(`/dashboard/perfil/${docente.id}`)}
            >
              Ver Legajo Completo
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} glass`}>
            <div className={styles.modalHeader}>
              <h2>Registrar Nuevo Docente</h2>
              <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            <form className={styles.form} onSubmit={handleCreateDocente}>
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
                  <label>Email Institucional</label>
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
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Especialidad</label>
                  <input 
                    type="text" required 
                    value={formData.especialidad_tecnica}
                    onChange={(e) => setFormData({...formData, especialidad_tecnica: e.target.value})}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Valor Hora ($)</label>
                  <input 
                    type="number" required 
                    value={formData.valor_hora}
                    onChange={(e) => setFormData({...formData, valor_hora: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Dar de Alta en el Sistema</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Docentes;
