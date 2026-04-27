import React, { useState } from 'react';
import { FileWarning, CheckCircle, XCircle } from 'lucide-react';
import styles from '../CourseDetail.module.css';

interface Props {
  courseId: string;
  role: string;
}

const TramitesTab: React.FC<Props> = ({ courseId, role }) => {
  const [tramites, setTramites] = useState([
    { id: '1', alumno: 'Juan Pérez', estado: 'Pendiente', documento: 'certificado_medico.pdf', justificacion: 'Estuve enfermo 2 semanas.' },
  ]);

  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <h3>Gestión de Reinscripciones (Baja Parcial)</h3>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {tramites.length === 0 ? (
          <p style={{ color: 'var(--text-dim)' }}>No hay trámites pendientes de revisión.</p>
        ) : (
          tramites.map(t => (
            <div key={t.id} style={{ padding: '20px', background: 'var(--bg-surface-light)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{t.alumno}</h4>
                  <span style={{ fontSize: '0.8rem', color: '#f59e0b', fontWeight: 'bold' }}>{t.estado}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={16} /> Aprobar
                  </button>
                  <button style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <XCircle size={16} /> Rechazar
                  </button>
                </div>
              </div>
              
              <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '4px', marginBottom: '12px' }}>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}><strong>Justificación:</strong> {t.justificacion}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', fontSize: '0.9rem', cursor: 'pointer' }}>
                  <FileWarning size={16} />
                  <u>Ver Documento Adjunto ({t.documento})</u>
                </div>
              </div>

              <div>
                <input type="text" placeholder="Observaciones / Justificación de la decisión (Obligatorio)..." style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--border)', background: 'transparent', color: 'white' }} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TramitesTab;
