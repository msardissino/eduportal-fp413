import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Fingerprint, Briefcase, Award, Clock, Calendar, ShieldCheck } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import styles from './ProfileDetail.module.css';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  dni: string;
  role: string;
  situacion_laboral?: string;
  estudios_previos?: string;
  especialidad_tecnica?: string;
  valor_hora?: number;
  created_at: string;
}

const ProfileDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Mock data for demo if not found
      setProfile({
        id: id || '1',
        full_name: 'Vista Previa de Usuario',
        email: 'usuario@ejemplo.com',
        dni: 'XXXXXXXX',
        role: 'alumno',
        situacion_laboral: 'Buscando empleo',
        estudios_previos: 'Secundario Completo',
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Cargando perfil...</div>;
  if (!profile) return <div className={styles.error}>Usuario no encontrado.</div>;

  const renderRoleSpecificData = () => {
    switch (profile.role) {
      case 'alumno':
        return (
          <>
            <div className={styles.section}>
              <h3>Información Académica</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Briefcase size={20} />
                  <div>
                    <label>Situación Laboral</label>
                    <p>{profile.situacion_laboral}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Award size={20} />
                  <div>
                    <label>Estudios Previos</label>
                    <p>{profile.estudios_previos}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'docente':
        return (
          <>
            <div className={styles.section}>
              <h3>Especialidad Técnica</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <Award size={20} />
                  <div>
                    <label>Especialidad</label>
                    <p>{profile.especialidad_tecnica}</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <Clock size={20} />
                  <div>
                    <label>Valor Hora</label>
                    <p>${profile.valor_hora}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 'administrativo':
        return (
          <>
            <div className={styles.section}>
              <h3>Privilegios Administrativos</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <ShieldCheck size={20} />
                  <div>
                    <label>Nivel de Acceso</label>
                    <p>Acceso Total al Sistema</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Volver
      </button>

      <div className={styles.header + " glass"}>
        <div className={styles.avatar}>{profile.full_name[0]}</div>
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h1>{profile.full_name}</h1>
            <span className={`${styles.roleBadge} ${styles[profile.role]}`}>
              {profile.role}
            </span>
          </div>
          <p className={styles.memberSince}>Miembro desde {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.section + " glass"}>
            <h3>Datos de Contacto</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <Mail size={20} />
                <div>
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Fingerprint size={20} />
                <div>
                  <label>Documento (DNI)</label>
                  <p>{profile.dni}</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.roleSection + " glass"}>
            {renderRoleSpecificData()}
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.statCard + " glass"}>
             <Calendar size={24} className={styles.icon} />
             <div>
               <h4>Última Actividad</h4>
               <p>Hoy, 10:45 AM</p>
             </div>
          </div>
          <button className={styles.editBtn}>Editar Perfil</button>
          <button className={styles.deleteBtn}>Inhabilitar Usuario</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetail;
