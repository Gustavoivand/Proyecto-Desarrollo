import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, AlertCircle } from 'lucide-react';

const RegistrarIncidencia = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    codigoEquipo: '',
    problema: '',
    usuarioResponsable: '',
    registradoPor: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/incidencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Error al registrar incidencia');
      navigate('/bandeja');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 className="heading-lg" style={{ textAlign: 'center' }}>Registrar Nueva Incidencia</h2>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Código del Equipo</label>
            <input 
              type="text" 
              name="codigoEquipo" 
              className="form-control" 
              placeholder="Ej: EQ-1054" 
              value={formData.codigoEquipo} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Problema Presentado</label>
            <textarea 
              name="problema" 
              className="form-control" 
              rows="4" 
              placeholder="Describa el problema reportado por el usuario..." 
              value={formData.problema} 
              onChange={handleChange} 
              required 
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Usuario Responsable del Equipo</label>
            <input 
              type="text" 
              name="usuarioResponsable" 
              className="form-control" 
              placeholder="Nombre del usuario del equipo" 
              value={formData.usuarioResponsable} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Registrado Por (Personal de Soporte/Sistemas)</label>
            <input 
              type="text" 
              name="registradoPor" 
              className="form-control" 
              placeholder="Tu nombre (Quien registra)" 
              value={formData.registradoPor} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
            <Save size={18} />
            {loading ? 'Registrando...' : 'Registrar Incidencia'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarIncidencia;
