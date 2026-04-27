import React, { useState, useEffect } from 'react';
import { Calendar, User, Book, CheckCircle, TrendingUp, Filter, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Inscripciones.module.css';

interface Inscripcion {
  id: string;
  id_alumno: string;
  id_curso: string;
  estado: string;
  calificacion_final: number;
  asistencia_porcentaje: number;
  profiles?: { full_name: string };
  cursos?: { nombre: string };
}

const Inscripciones: React.FC = () => {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);

  useEffect(() => {
    fetchInscripciones();
  }, []);

  const fetchInscripciones = async () => {
    try {
      // Intento de join relacional
      const { data, error } = await supabase
        .from('inscripciones')
        .select(`
          *,
          profiles:id_alumno (full_name),
          cursos:id_curso (nombre)
        `);

      if (error) throw error;
      setInscripciones(data || []);
    } catch (error) {
      console.error('Error fetching inscripciones:', error);
      // Mock data para visualización
      setInscripciones([
        { 
          id: '1', id_alumno: 'A', id_curso: 'C1', 
          estado: 'Cursando', calificacion_final: 8.5, asistencia_porcentaje: 90,
          profiles: { full_name: 'Juan Pérez' }, 
          cursos: { nombre: 'Programación Web' } 
        },
        { 
          id: '2', id_alumno: 'B', id_curso: 'C2', 
          estado: 'Inscripto', calificacion_final: 0, asistencia_porcentaje: 0,
          profiles: { full_name: 'María García' }, 
          cursos: { nombre: 'Electrónica' } 
        },
      ]);
    }
  };

  const getStatusStyle = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'egresado': return styles.egresado;
      case 'cursando': return styles.cursando;
      case 'abandonó': return styles.abandono;
      default: return styles.inscripto;
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Seguimiento Académico</h1>
          <p className={styles.subtitle}>Control de inscripciones, calificaciones y asistencia.</p>
        </div>
      </header>

      <div className={styles.statsRow}>
        <div className={`${styles.miniCard} glass`}>
          <Calendar size={20} className={styles.icon} />
          <div>
            <h3>24</h3>
            <p>Nuevas hoy</p>
          </div>
        </div>
        <div className={`${styles.miniCard} glass`}>
          <CheckCircle size={20} className={styles.icon + " " + styles.green} />
          <div>
            <h3>152</h3>
            <p>Egresados</p>
          </div>
        </div>
      </div>

      <div className={styles.tableCard + " glass"}>
        <div className={styles.tableHeader}>
          <h2>Listado de Alumnos por Curso</h2>
          <div className={styles.tableActions}>
             <button className={styles.iconBtn}><Search size={18} /></button>
             <button className={styles.iconBtn}><Filter size={18} /></button>
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Estado</th>
              <th>Asistencia</th>
              <th>Calificación</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.map(ins => (
              <tr key={ins.id}>
                <td>
                  <div className={styles.cellWithIcon}>
                    <User size={16} />
                    {ins.profiles?.full_name}
                  </div>
                </td>
                <td>
                  <div className={styles.cellWithIcon}>
                    <Book size={16} />
                    {ins.cursos?.nombre}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusStyle(ins.estado)}`}>
                    {ins.estado}
                  </span>
                </td>
                <td>
                  <div className={styles.progressContainer}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${ins.asistencia_porcentaje}%` }} 
                      />
                    </div>
                    <span>{ins.asistencia_porcentaje}%</span>
                  </div>
                </td>
                <td>
                  <div className={styles.gradeCell}>
                    <TrendingUp size={16} />
                    {ins.calificacion_final || '---'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inscripciones;
