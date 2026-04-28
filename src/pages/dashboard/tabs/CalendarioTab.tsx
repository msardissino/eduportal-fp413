import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { es } from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import styles from '../CourseDetail.module.css';
import { Plus, X } from 'lucide-react';

const locales = {
  'es': es,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

interface Props {
  courseId: string;
  role: string;
}

const CalendarioTab: React.FC<Props> = ({ courseId, role }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'clase' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [courseId]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('eventos_calendario')
        .select('*')
        .eq('id_curso', courseId);
      
      if (error) throw error;
      
      const formattedEvents = data.map(ev => ({
        id: ev.id,
        title: ev.titulo,
        start: new Date(ev.fecha_inicio),
        end: new Date(ev.fecha_fin),
        type: ev.tipo
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSlot = (slotInfo: any) => {
    if (role === 'docente' || role === 'administrativo') {
      setNewEvent({ ...newEvent, date: format(slotInfo.start, 'yyyy-MM-dd') });
      setShowModal(true);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.date) return;
    
    const startDate = new Date(newEvent.date);
    startDate.setHours(18, 0, 0, 0); 
    const endDate = new Date(startDate);
    endDate.setHours(20, 0, 0, 0);

    try {
      const { data, error } = await supabase
        .from('eventos_calendario')
        .insert([{
          id_curso: courseId,
          titulo: newEvent.title,
          fecha_inicio: startDate.toISOString(),
          fecha_fin: endDate.toISOString(),
          tipo: newEvent.type
        }])
        .select();

      if (error) throw error;

      if (data) {
        setEvents([...events, {
          id: data[0].id,
          title: data[0].titulo,
          start: new Date(data[0].fecha_inicio),
          end: new Date(data[0].fecha_fin),
          type: data[0].tipo
        }]);
      }
      
      setShowModal(false);
      setNewEvent({ title: '', date: '', type: 'clase' });
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Error al guardar el evento");
    }
  };

  const eventStyleGetter = (event: any) => {
    let backgroundColor = 'var(--primary)'; // Default clase
    if (event.type === 'examen') backgroundColor = '#ef4444'; // Red
    if (event.type === 'entrega') backgroundColor = '#f59e0b'; // Orange
    if (event.type === 'feriado') backgroundColor = '#8b5cf6'; // Purple

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: event.type === 'examen' ? 'white' : 'black',
        border: '0px',
        display: 'block',
        padding: '2px 5px'
      }
    };
  };

  return (
    <div className={styles.section + " glass"} style={{ height: '700px', display: 'flex', flexDirection: 'column' }}>
      <div className={styles.sectionHeader} style={{ marginBottom: '15px' }}>
        <h3>Calendario Académico</h3>
        {(role === 'docente' || role === 'administrativo') && (
          <button 
            className={styles.addBtn} 
            onClick={() => setShowModal(true)}
            style={{ background: 'var(--primary)', color: 'black' }}
          >
            <Plus size={18} /> Nuevo Evento
          </button>
        )}
      </div>

      <div style={{ flex: 1, backgroundColor: 'white', padding: '15px', borderRadius: '8px', color: 'black' }}>
        <style>
          {`
            .rbc-toolbar button { color: black; }
            .rbc-toolbar button.rbc-active { background-color: var(--primary); color: black; border-color: var(--primary); }
            .rbc-toolbar button:active, .rbc-toolbar button:hover { background-color: rgba(163, 230, 53, 0.2); }
          `}
        </style>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          culture="es"
          messages={{
            next: "Sig",
            previous: "Ant",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día"
          }}
          selectable={role === 'docente' || role === 'administrativo'}
          onSelectSlot={handleSelectSlot}
          eventPropGetter={eventStyleGetter}
          defaultView={Views.MONTH}
        />
      </div>

      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal + " glass"}>
            <div className={styles.modalHeader}>
              <h3>Agregar Evento</h3>
              <button onClick={() => setShowModal(false)} className={styles.closeBtn}>
                <X size={24} />
              </button>
            </div>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label>Título del Evento</label>
                <input 
                  type="text" 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  placeholder="Ej: Parcial 1"
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface-light)', color: 'white' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Fecha</label>
                <input 
                  type="date" 
                  value={newEvent.date} 
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface-light)', color: 'white' }}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Tipo de Evento</label>
                <select 
                  value={newEvent.type} 
                  onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                  style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-surface-light)', color: 'white' }}
                >
                  <option value="clase">Clase Especial</option>
                  <option value="examen">Examen / Parcial</option>
                  <option value="entrega">Fecha límite de Entrega (TP)</option>
                  <option value="feriado">Feriado / Sin actividad</option>
                </select>
              </div>
              <button onClick={handleAddEvent} className={styles.submitBtn}>Guardar Evento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarioTab;
