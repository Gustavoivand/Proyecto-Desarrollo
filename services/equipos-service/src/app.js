const express = require('express');
const cors = require('cors');

const equiposRoutes = require('./routes/equipos.routes');
const requireGatewayRequest = require('./middleware/gateway.middleware');
const errorHandler = require('./middleware/error-handler.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    service: 'equipos-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(requireGatewayRequest);
app.use('/equipos', equiposRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en equipos-service' });
});

app.use(errorHandler);

module.exports = app;
