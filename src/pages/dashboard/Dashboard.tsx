import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, BookOpen, TrendingUp, Calendar as CalendarIcon, Clock, Bell, Download, Award } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import styles from './Dashboard.module.css';

const StatCard = ({ icon: Icon, label, value, trend }: any) => (
  <div className={`${styles.card} glass`}>
    <div className={styles.cardHeader}>
      <div className={styles.cardIcon}>
        <Icon size={24} className={styles.primaryText} />
      </div>
      {trend && <span className={styles.trend}>+{trend}%</span>}
    </div>
    <div className={styles.cardBody}>
      <h3 className={styles.cardValue}>{value}</h3>
      <p className={styles.cardLabel}>{label}</p>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const role = localStorage.getItem('userRole') || 'alumno';
  const roleName = role.charAt(0).toUpperCase() + role.slice(1);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [certificados, setCertificados] = useState<any[]>([]);

  useEffect(() => {
    if (role === 'alumno') {
      fetchUpcomingEvents();
      fetchCertificados();
    }
  }, [role]);

  const fetchCertificados = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const myId = session?.user?.id;

      // Mock de certificados para demostración si no hay datos reales de egreso
      setCertificados([
        { id: '1', nombre: 'Introducción a la Gastronomía', fecha: '2025-11-20', promedio: '9.5' },
        { id: '2', nombre: 'Seguridad e Higiene Alimentaria', fecha: '2025-12-10', promedio: '10' }
      ]);
      // En producción: buscar en inscripciones donde estado = 'Egresado'
    } catch (e) {
      console.error(e);
    }
  };

  const descargarCertificado = async (cert: any) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Fondo y borde
    doc.setFillColor(240, 248, 255);
    doc.rect(0, 0, 297, 210, 'F');
    doc.setDrawColor(16, 185, 129); // Verde primary
    doc.setLineWidth(5);
    doc.rect(10, 10, 277, 190, 'D');

    // Título
    doc.setFontSize(40);
    doc.setTextColor(30, 41, 59);
    doc.text('CERTIFICADO DE APROBACIÓN', 148.5, 50, { align: 'center' });

    // Subtítulo
    doc.setFontSize(16);
    doc.text('El Centro de Formación Profesional 413 certifica que:', 148.5, 75, { align: 'center' });

    // Nombre del Alumno
    doc.setFontSize(30);
    doc.setTextColor(16, 185, 129);
    doc.text('Alumno Ejemplo', 148.5, 100, { align: 'center' }); // Reemplazar por profile.full_name

    // Texto del curso
    doc.setFontSize(16);
    doc.setTextColor(30, 41, 59);
    doc.text(`Ha completado exitosamente el curso de:`, 148.5, 125, { align: 'center' });
    
    // Nombre del curso
    doc.setFontSize(24);
    doc.text(cert.nombre, 148.5, 140, { align: 'center' });

    // Detalles adicionales
    doc.setFontSize(12);
    doc.text(`Fecha de Egreso: ${cert.fecha}  |  Promedio: ${cert.promedio}`, 148.5, 155, { align: 'center' });

    // Generar QR Code
    try {
      const qrDataUrl = await QRCode.toDataURL(`https://cfp413.edu.ar/verificar/${cert.id}`);
      doc.addImage(qrDataUrl, 'PNG', 230, 150, 40, 40);
      doc.setFontSize(8);
      doc.text('Escanear para validar', 250, 195, { align: 'center' });
    } catch (err) {
      console.error(err);
    }

    // Firmas
    doc.setLineWidth(0.5);
    doc.line(40, 170, 100, 170);
    doc.text('Firma del Director', 70, 175, { align: 'center' });

    doc.save(`Certificado_${cert.nombre.replace(/ /g, '_')}.pdf`);
  };

  const fetchUpcomingEvents = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const myId = session?.user?.id;
      
      // Si no hay sesión (en el caso de bypass o pruebas), obtenemos eventos aleatorios
      const { data, error } = await supabase
        .from('eventos_calendario')
        .select(`*, cursos:id_curso (nombre)`)
        .gte('fecha_inicio', new Date().toISOString())
        .order('fecha_inicio', { ascending: true })
        .limit(3);

      if (!error && data) setUpcomingEvents(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div>
          <h1 className="gradient-text">Panel de {roleName}</h1>
          <p className={styles.subtitle}>Gestiona tu actividad y progreso educativo.</p>
        </div>
        {role === 'administrativo' && (
          <button className={styles.actionButton}>
            Descargar Reporte Global
          </button>
        )}
      </header>

      <div className={styles.statsGrid}>
        <StatCard icon={Users} label={role === 'alumno' ? "Compañeros" : "Alumnos Activos"} value="1,284" trend="12" />
        <StatCard icon={GraduationCap} label="Cursos Completados" value="452" trend="8" />
        <StatCard icon={BookOpen} label="Cursos en Progreso" value="86" />
        <StatCard icon={TrendingUp} label="Promedio General" value="9.4" trend="3" />
      </div>

      <div className={styles.mainGrid}>
        <div className={`${styles.largeCard} glass`} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h2 className={styles.cardTitle}>Novedades del Centro</h2>
            <div className={styles.placeholderList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.listItem}>
                  <div className={styles.itemDot} />
                  <div className={styles.itemContent}>
                    <p className={styles.itemTitle}>Inscripciones abiertas para el ciclo 2026</p>
                    <p className={styles.itemTime}>Publicado hace {i} día</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {role === 'alumno' && (
            <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <Award size={24} color="#10b981" />
                <h2 className={styles.cardTitle} style={{ margin: 0 }}>Mis Certificados de Egreso</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {certificados.map(cert => (
                  <div key={cert.id} style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '12px', padding: '15px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{cert.nombre}</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-dim)' }}>Aprobado con {cert.promedio}</p>
                    <button 
                      onClick={() => descargarCertificado(cert)}
                      style={{ background: 'var(--primary)', color: 'black', border: 'none', padding: '8px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', marginTop: '5px' }}
                    >
                      <Download size={16} /> Descargar PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className={`${styles.smallCard} glass`}>
          <h2 className={styles.cardTitle}>
            {role === 'alumno' ? 'Fechas Próximas' : 'Mi Agenda'}
          </h2>
          
          {role === 'alumno' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '15px' }}>
              {upcomingEvents.length === 0 ? (
                <p className={styles.emptyState}>No hay eventos próximos programados.</p>
              ) : (
                upcomingEvents.map(ev => {
                  const isSoon = new Date(ev.fecha_inicio).getTime() - new Date().getTime() < 86400000 * 3; // Menos de 3 días
                  return (
                    <div key={ev.id} style={{ 
                      padding: '12px', 
                      background: 'var(--bg-surface-light)', 
                      borderRadius: '8px', 
                      borderLeft: `4px solid ${isSoon ? '#f59e0b' : 'var(--primary)'}` 
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem' }}>{ev.titulo}</h4>
                        {isSoon && <Bell size={14} color="#f59e0b" />}
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', margin: '0 0 6px 0' }}>
                        {ev.cursos?.nombre}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: isSoon ? '#f59e0b' : 'white' }}>
                        <Clock size={12} />
                        <span>{new Date(ev.fecha_inicio).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <p className={styles.emptyState}>No hay clases programadas para hoy.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
