const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const incidenciasRoutes = require('./routes/incidencias.routes');
const tecnicosRoutes = require('./routes/tecnicos.routes');
const { verifyToken } = require('./middleware/auth.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();

//app.use(cors());
app.use(cors({
  origin: '*', // Permite que cualquier dominio (incluyendo tu Vercel) se conecte
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tecnicos', verifyToken, tecnicosRoutes);
app.use('/api/incidencias', verifyToken, incidenciasRoutes);

app.use(errorHandler);

module.exports = app;
