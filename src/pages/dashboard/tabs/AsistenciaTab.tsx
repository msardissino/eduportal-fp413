import React, { useState } from 'react';
import styles from '../CourseDetail.module.css';

interface Props {
  courseId: string;
  students: any[];
}

const AsistenciaTab: React.FC<Props> = ({ courseId, students }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <h3>Toma de Asistencia</h3>
        <input 
          type="date" 
          value={fecha} 
          onChange={(e) => setFecha(e.target.value)} 
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: 'var(--bg-surface)', color: 'white' }}
        />
      </div>
      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alumno</th>
              <th>DNI</th>
              <th>Presente / Ausente</th>
              <th>Justificación (Si Ausente)</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>
                  <div className={styles.studentName}>
                    {Array.isArray(s.profiles) ? s.profiles[0]?.full_name : s.profiles.full_name}
                  </div>
                </td>
                <td>
                  <div className={styles.studentDni}>
                    {Array.isArray(s.profiles) ? s.profiles[0]?.dni : s.profiles.dni}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button style={{ padding: '6px 12px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Presente</button>
                    <button style={{ padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Ausente</button>
                  </div>
                </td>
                <td>
                  <input type="text" placeholder="Opcional..." style={{ padding: '6px', width: '100%', borderRadius: '4px', border: '1px solid #ccc', background: 'transparent', color: 'white' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
        <button style={{ background: 'var(--primary)', color: 'black', padding: '10px 20px', borderRadius: '4px', fontWeight: 'bold' }}>
          Guardar Asistencia
        </button>
      </div>
    </div>
  );
};

export default AsistenciaTab;
