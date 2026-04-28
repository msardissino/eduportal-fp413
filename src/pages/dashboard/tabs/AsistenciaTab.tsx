import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Check, X, AlertTriangle, Save, Loader2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import styles from '../CourseDetail.module.css';

interface Props {
  courseId: string;
  students: any[];
}

const AsistenciaTab: React.FC<Props> = ({ courseId, students }) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [asistencias, setAsistencias] = useState<Record<string, { presente: boolean, justificacion: string }>>({});
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchExistingAttendance();
  }, [fecha, courseId]);

  const fetchExistingAttendance = async () => {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from('asistencias')
        .select('*')
        .in('id_inscripcion', students.map(s => s.id))
        .eq('fecha', fecha);

      if (error) throw error;

      const map: Record<string, { presente: boolean, justificacion: string }> = {};
      students.forEach(s => {
        map[s.id] = { presente: true, justificacion: '' };
      });

      data?.forEach(record => {
        map[record.id_inscripcion] = { 
          presente: record.presente, 
          justificacion: record.justificacion || '' 
        };
      });

      setAsistencias(map);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleToggle = (studentId: string, value: boolean) => {
    setAsistencias(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], presente: value }
    }));
  };

  const handleJustification = (studentId: string, text: string) => {
    setAsistencias(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], justificacion: text }
    }));
  };

  const saveAttendance = async () => {
    setLoading(true);
    try {
      const records = Object.entries(asistencias).map(([id_inscripcion, val]) => ({
        id_inscripcion,
        fecha,
        presente: val.presente,
        justificacion: val.justificacion
      }));

      const { error } = await supabase
        .from('asistencias')
        .upsert(records, { onConflict: 'id_inscripcion, fecha' });

      if (error) throw error;

      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      const startStr = startOfMonth.toISOString().split('T')[0];

      for (const student of students) {
        const { count, error: countError } = await supabase
          .from('asistencias')
          .select('*', { count: 'exact', head: true })
          .eq('id_inscripcion', student.id)
          .eq('presente', false)
          .gte('fecha', startStr);

        if (countError) continue;

        if (count && count > 3) {
          await supabase
            .from('inscripciones')
            .update({ estado: 'Baja parcial' })
            .eq('id', student.id);
        }
      }

      alert('Asistencia guardada con éxito. Se ha verificado la regularidad de los alumnos.');
    } catch (error) {
      console.error('Error saving attendance:', error);
      alert('Error al guardar la asistencia.');
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  const exportAttendanceToExcel = () => {
    const dataToExport = students.map(s => {
      const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
      const estadoAsistencia = asistencias[s.id]?.presente ? 'Presente' : 'Ausente';
      const justificacion = asistencias[s.id]?.justificacion || '---';

      return {
        'Nombre': profile?.full_name || 'Desconocido',
        'DNI': profile?.dni || '---',
        'Fecha': fecha,
        'Asistencia': estadoAsistencia,
        'Justificación': justificacion
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Asistencia_${fecha}`);
    
    const wscols = [
      {wch: 30}, // Nombre
      {wch: 15}, // DNI
      {wch: 15}, // Fecha
      {wch: 15}, // Asistencia
      {wch: 30}  // Justificación
    ];
    worksheet['!cols'] = wscols;

    XLSX.writeFile(workbook, `Planilla_Asistencia_${fecha}.xlsx`);
  };

  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h3>Control de Asistencia</h3>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            className={styles.dateInput}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '8px', 
              border: '1px solid var(--border)', 
              background: 'var(--bg-surface-light)', 
              color: 'white',
              fontFamily: 'inherit'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={exportAttendanceToExcel} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', border: '1px solid #3b82f6', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}
          >
            <Download size={16} /> Exportar Excel
          </button>
          <button 
            className={styles.addBtn} 
            onClick={saveAttendance}
            disabled={loading || fetching}
          >
            {loading ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
            Guardar
          </button>
        </div>
      </div>

      {fetching ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-dim)' }}>
          Cargando registros...
        </div>
      ) : (
        <div className={styles.tableResponsive}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Alumno</th>
                <th>DNI</th>
                <th>Estado Actual</th>
                <th>Presencia</th>
                <th>Justificación</th>
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
                    <div className={styles.studentDni} style={{ opacity: 0.6 }}>
                      {Array.isArray(s.profiles) ? s.profiles[0]?.dni : s.profiles.dni}
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[s.estado.toLowerCase().replace(' ', '')] || styles.cursando}`}>
                      {s.estado}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => handleToggle(s.id, true)}
                        style={{ 
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: 'none',
                          background: asistencias[s.id]?.presente ? '#10b981' : 'rgba(255,255,255,0.05)',
                          color: asistencias[s.id]?.presente ? 'black' : 'var(--text-dim)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Presente"
                      >
                        <Check size={18} />
                      </button>
                      <button 
                        onClick={() => handleToggle(s.id, false)}
                        style={{ 
                          padding: '8px', 
                          borderRadius: '6px', 
                          border: 'none',
                          background: !asistencias[s.id]?.presente ? '#ef4444' : 'rgba(255,255,255,0.05)',
                          color: !asistencias[s.id]?.presente ? 'white' : 'var(--text-dim)',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        title="Ausente"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="Motivo de falta..." 
                      value={asistencias[s.id]?.justificacion || ''}
                      onChange={(e) => handleJustification(s.id, e.target.value)}
                      style={{ 
                        padding: '8px', 
                        width: '100%', 
                        borderRadius: '6px', 
                        border: '1px solid var(--border)', 
                        background: 'transparent', 
                        color: 'white',
                        fontSize: '0.85rem'
                      }}
                      disabled={asistencias[s.id]?.presente}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '15px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <AlertTriangle size={20} color="#f59e0b" />
        <p style={{ fontSize: '0.85rem', color: '#f59e0b', margin: 0 }}>
          <strong>Regla de Regularidad:</strong> Si un alumno acumula más de 3 inasistencias en el mes calendario actual, su estado cambiará automáticamente a <strong>Baja parcial</strong> y deberá presentar una justificación para ser reinscrito.
        </p>
      </div>
    </div>
  );
};

export default AsistenciaTab;
