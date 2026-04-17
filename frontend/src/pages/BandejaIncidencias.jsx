import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Clock } from 'lucide-react';

const BandejaIncidencias = () => {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/incidencias')
      .then(res => res.json())
      .then(data => {
        setIncidencias(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching data:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="animate-fade-in delay-100">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="heading-lg" style={{ margin: 0 }}>Bandeja Inicial de Incidencias</h2>
        <span style={{ color: 'var(--text-secondary)' }}>Vista de Jefe de Soporte</span>
      </div>

      <div className="glass-panel table-container">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Cargando incidencias...
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Código Equipo</th>
                <th>Problema</th>
                <th>Fecha/Hora</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {incidencias.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No hay incidencias registradas.</td>
                </tr>
              ) : (
                incidencias.map((inc) => (
                  <tr key={inc.id}>
                    <td><strong>{inc.id}</strong></td>
                    <td>{inc.codigoEquipo}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
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
                      <Link to={`/incidencia/${inc.id}`} className="btn-icon" title="Ver Detalle">
                        <Eye size={18} />
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

export default BandejaIncidencias;
