import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from '../CourseDetail.module.css';

interface Props {
  students: any[];
  role: string;
}

const AlumnosTab: React.FC<Props> = ({ students, role }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <h3>Alumnos Inscriptos</h3>
        {(role === 'docente' || role === 'administrativo') && (
          <button className={styles.inscribirBtn}>
            <Plus size={16} /> Inscribir Nuevo
          </button>
        )}
      </div>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Estado</th>
              <th>Asistencia</th>
              <th>Nota</th>
              {(role === 'docente' || role === 'administrativo') && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>
                  <div className={styles.studentCell} onClick={() => {
                    const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
                    if (profile) navigate(`/dashboard/perfil/${profile.id}`);
                  }}>
                    <div className={styles.miniAvatar}>
                      {Array.isArray(s.profiles) ? s.profiles[0]?.full_name[0] : s.profiles.full_name[0]}
                    </div>
                    <div>
                      <p className={styles.studentName}>
                        {Array.isArray(s.profiles) ? s.profiles[0]?.full_name : s.profiles.full_name}
                      </p>
                      <p className={styles.studentDni}>
                        {Array.isArray(s.profiles) ? s.profiles[0]?.dni : s.profiles.dni}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[s.estado.toLowerCase()] || styles.cursando}`}>
                    {s.estado}
                  </span>
                </td>
                <td>
                  <div className={styles.progressBox}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{ width: `${s.asistencia_porcentaje}%` }} />
                    </div>
                    <span>{s.asistencia_porcentaje}%</span>
                  </div>
                </td>
                <td><span className={styles.grade}>{s.calificacion_final || '---'}</span></td>
                {(role === 'docente' || role === 'administrativo') && (
                  <td><button className={styles.editBtn}>Calificar</button></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlumnosTab;
