import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock, AlertTriangle } from 'lucide-react';

const MisTareas = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulando que el usuario logueado es "Carlos Tecnico"
  const currentUser = 'Carlos Tecnico';

  useEffect(() => {
    fetch('http://localhost:3000/api/incidencias')
      .then(res => res.json())
      .then(data => {
        // Filtrar solo las asignadas al técnico actual
        const tareasAssignadas = data.filter(inc => inc.tecnicoAsignado === currentUser);
        setIncidencias(tareasAssignadas);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in delay-300">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-lg" style={{ margin: 0 }}>Mis Tareas Asignadas</h2>
        <span style={{ color: 'var(--text-secondary)' }}>Técnico: <strong>{currentUser}</strong></span>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Cargando tareas...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código Equipo</th>
                <th>Problema (Resumen)</th>
                <th>Fecha/Hora Registro</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <AlertTriangle size={32} opacity={0.5} />
                      <p>No tienes tareas asignadas en este momento.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                incidencias.map((inc) => (
                  <tr key={inc.id}>
                    <td><strong>{inc.id}</strong></td>
                    <td>{inc.codigoEquipo}</td>
                    <td style={{ maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {inc.problema}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <Clock size={14} />
                        {new Date(inc.fechaHora).toLocaleString()}
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${inc.estado === 'Pendiente' ? 'badge-pending' : 'badge-resolved'}`}>
                        {inc.estado}
                      </span>
                    </td>
                    <td>
                      <Link to={`/incidencia/${inc.id}`} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                        Ver Problema <Eye size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MisTareas;
