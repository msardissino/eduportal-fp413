import React, { useState } from 'react';
import { Upload, File, Image as ImageIcon, FileText, Trash2 } from 'lucide-react';
import styles from '../CourseDetail.module.css';

interface Props {
  courseId: string;
  role: string;
}

const MaterialesTab: React.FC<Props> = ({ courseId, role }) => {
  const [files, setFiles] = useState([
    { id: '1', nombre: 'Plan Anual 2026.pdf', tipo: 'Plan Anual', url: '#' },
    { id: '2', nombre: 'TP 1 - Introducción.docx', tipo: 'Trabajo Práctico', url: '#' }
  ]);

  return (
    <div className={styles.section + " glass"}>
      <div className={styles.sectionHeader}>
        <h3>Materiales y Archivos</h3>
        {(role === 'docente' || role === 'administrativo') && (
          <button className={styles.inscribirBtn} style={{ background: 'var(--primary)', color: 'black' }}>
            <Upload size={16} /> Subir Material
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
        {files.map(file => (
          <div key={file.id} style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            {file.tipo === 'Plan Anual' ? <FileText size={24} color="#3b82f6" /> : <File size={24} color="#10b981" />}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{file.nombre}</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{file.tipo}</p>
            </div>
            {(role === 'docente' || role === 'administrativo') && (
              <button style={{ background: 'transparent', border: 'none', color: '#ff4757', cursor: 'pointer' }}>
                <Trash2 size={18} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaterialesTab;
