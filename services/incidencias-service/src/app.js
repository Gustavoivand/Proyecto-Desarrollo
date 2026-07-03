const express = require('express');
const cors = require('cors');

const incidenciasRoutes = require('./routes/incidencias.routes');
const requireGatewayRequest = require('./middleware/gateway.middleware');
const errorHandler = require('./middleware/error-handler.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    service: 'incidencias-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(requireGatewayRequest);
app.use('/incidencias', incidenciasRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en incidencias-service' });
});

app.use(errorHandler);

module.exports = app;
