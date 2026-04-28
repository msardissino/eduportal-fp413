import React from 'react';
import { Plus, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import styles from '../CourseDetail.module.css';

interface Props {
  students: any[];
  role: string;
}

const AlumnosTab: React.FC<Props> = ({ students, role }) => {
  const navigate = useNavigate();

  const exportToExcel = () => {
    const dataToExport = students.map(s => {
      const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
      return {
        'Nombre': profile?.full_name || 'Desconocido',
        'DNI': profile?.dni || '---',
        'Estado': s.estado,
        'Asistencia (%)': s.asistencia_porcentaje,
        'Calificación Final': s.calificacion_final || '0'
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Alumnos");
    
    // Auto-ajustar ancho de columnas
    const wscols = [
      {wch: 30}, // Nombre
      {wch: 15}, // DNI
      {wch: 15}, // Estado
      {wch: 15}, // Asistencia
      {wch: 15}  // Calificación
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, "Planilla_Alumnos.xlsx");
  };

  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <h3>Alumnos Inscriptos</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {(role === 'docente' || role === 'administrativo') && (
            <>
              <button onClick={exportToExcel} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>
                <Download size={16} /> Exportar Excel
              </button>
              <button className={styles.inscribirBtn}>
                <Plus size={16} /> Inscribir Nuevo
              </button>
            </>
          )}
        </div>
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
