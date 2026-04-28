import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Menu, X, Bell } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel('public:notificaciones')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notificaciones' }, payload => {
        setNotifications(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const myId = session?.user?.id;
      // Por ahora trae las últimas 5 sin importar el usuario (para demo rápida)
      const { data } = await supabase
        .from('notificaciones')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (data) setNotifications(data);
    } catch (e) {
      console.error(e);
    }
  };

  const unreadCount = notifications.filter(n => !n.leida).length;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          <span className="gradient-text">EduAdmin</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: -5, right: -5, background: '#ef4444', color: 'white', fontSize: '10px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div style={{ position: 'absolute', top: '35px', right: '-10px', width: '300px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: '8px', zIndex: 100, padding: '10px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <h4 style={{ margin: '0 0 10px 0', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>Notificaciones</h4>
                {notifications.length === 0 ? (
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>No tienes notificaciones nuevas.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
                    {notifications.map(n => (
                      <div key={n.id} style={{ background: n.leida ? 'transparent' : 'rgba(163, 230, 53, 0.1)', padding: '10px', borderRadius: '6px' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', fontWeight: 'bold' }}>{n.titulo}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{n.mensaje}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <button className={styles.menuToggle} onClick={toggleSidebar}>
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className={styles.overlay} onClick={toggleSidebar} />}

      <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <main className={styles.main}>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};
