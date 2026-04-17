import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Monitor, User, Clock, CheckCircle } from 'lucide-react';

const DetalleIncidencia = () => {
  const { id } = useParams();
  const [incidencia, setIncidencia] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/incidencias/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Incidencia no encontrada');
        return res.json();
      })
      .then(data => {
        setIncidencia(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '3rem' }}>Cargando detalle...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '3rem', color: '#ef4444' }}>{error}</div>;

  return (
    <div className="animate-fade-in delay-200" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link to="/bandeja" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Volver a la Bandeja
      </Link>

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <div>
            <h2 className="heading-lg" style={{ margin: 0, marginBottom: '0.5rem' }}>Detalle de Incidencia {incidencia.id}</h2>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> Registrado: {new Date(incidencia.fechaHora).toLocaleString()}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} /> Por: {incidencia.registradoPor}</span>
            </div>
          </div>
          <span className={`badge ${incidencia.estado === 'Pendiente' ? 'badge-pending' : 'badge-resolved'}`} style={{ fontSize: '1rem', padding: '0.4rem 1rem' }}>
            {incidencia.estado}
          </span>
        </div>

        <div className="grid grid-cols-2" style={{ gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Monitor size={18} /> Información del Equipo
            </h4>
            <div className="inner-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
              <p><strong>Código:</strong> {incidencia.codigoEquipo}</p>
              <p style={{ marginTop: '0.5rem' }}><strong>Responsable:</strong> {incidencia.usuarioResponsable}</p>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={18} /> Asignación (Técnico)
            </h4>
            <div className="inner-panel" style={{ padding: '1rem', borderRadius: '8px' }}>
              {incidencia.tecnicoAsignado ? (
                <p><strong>Técnico:</strong> {incidencia.tecnicoAsignado}</p>
              ) : (
                <p style={{ color: '#d97706' }}>Aún no asignado</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             Problema Reportado
          </h4>
          <div className="inner-panel" style={{ padding: '1.5rem', borderRadius: '8px', lineHeight: '1.6' }}>
            {incidencia.problema}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleIncidencia;
