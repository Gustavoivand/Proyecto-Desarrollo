const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const tecnicosRoutes = require('./routes/tecnicos.routes');
const requireGatewayRequest = require('./middleware/gateway.middleware');
const errorHandler = require('./middleware/error-handler.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    service: 'usuarios-service',
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.use(requireGatewayRequest);
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/tecnicos', tecnicosRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada en usuarios-service' });
});

app.use(errorHandler);

module.exports = app;
