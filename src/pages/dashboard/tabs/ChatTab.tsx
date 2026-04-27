import React, { useState } from 'react';
import { Send } from 'lucide-react';
import styles from '../CourseDetail.module.css';

interface Props {
  courseId: string;
  role: string;
}

const ChatTab: React.FC<Props> = ({ courseId, role }) => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Prof. Mariano', text: 'Bienvenidos al curso. ¿Alguna duda con el TP 1?', isMine: role === 'docente' },
    { id: '2', sender: 'Alumno Juan', text: 'Profe, no entiendo el punto 3.', isMine: role === 'alumno' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), sender: role === 'docente' ? 'Profesor' : 'Alumno', text: input, isMine: true }]);
    setInput('');
  };

  return (
    <div className={styles.section + " glass"} style={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      <div className={styles.sectionHeader} style={{ marginBottom: '16px' }}>
        <h3>Consultas del Curso</h3>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ alignSelf: msg.isMine ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px', textAlign: msg.isMine ? 'right' : 'left' }}>{msg.sender}</p>
            <div style={{ padding: '12px 16px', borderRadius: '16px', background: msg.isMine ? 'var(--primary)' : 'var(--bg-surface-light)', color: msg.isMine ? 'black' : 'white', borderBottomRightRadius: msg.isMine ? '4px' : '16px', borderBottomLeftRadius: !msg.isMine ? '4px' : '16px' }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu consulta..."
          style={{ flex: 1, padding: '12px 16px', borderRadius: '24px', border: '1px solid var(--border)', background: 'var(--bg-surface-light)', color: 'white' }}
        />
        <button onClick={handleSend} style={{ background: 'var(--primary)', color: 'black', border: 'none', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatTab;
