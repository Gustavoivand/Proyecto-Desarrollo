const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data store for early stages
let incidencias = [
  {
    id: 'INC-001',
    codigoEquipo: 'EQ-1001',
    problema: 'La pantalla parpadea de color azul',
    usuarioResponsable: 'Juan Perez',
    registradoPor: 'Soporte Ana',
    fechaHora: new Date().toISOString(),
    estado: 'Pendiente',
    tecnicoAsignado: 'Carlos Tecnico'
  },
  {
    id: 'INC-002',
    codigoEquipo: 'EQ-1002',
    problema: 'No inicia Windows, pantalla en negro',
    usuarioResponsable: 'Maria Gomez',
    registradoPor: 'Soporte Ana',
    fechaHora: new Date().toISOString(),
    estado: 'Pendiente',
    tecnicoAsignado: null
  }
];

// Rutas base
app.get('/api/incidencias', (req, res) => {
  res.json(incidencias);
});

app.get('/api/incidencias/:id', (req, res) => {
  const incidencia = incidencias.find(i => i.id === req.params.id);
  if (incidencia) {
    res.json(incidencia);
  } else {
    res.status(404).json({ error: 'Incidencia no encontrada' });
  }
});

app.post('/api/incidencias', (req, res) => {
  const newId = `INC-${String(incidencias.length + 1).padStart(3, '0')}`;
  const nuevaIncidencia = {
    id: newId,
    fechaHora: new Date().toISOString(),
    estado: 'Pendiente',
    ...req.body
  };
  incidencias.push(nuevaIncidencia);
  res.status(201).json(nuevaIncidencia);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend de soporte técnico inicializado en puerto ${PORT}`);
});
