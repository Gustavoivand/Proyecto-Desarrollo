const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Habilitar CORS para que nuestro Frontend en Vite pueda comunicarse sin restricciones
app.use(cors());

// Definición de las URLs internas de los microservicios (provenientes de Docker o Local)
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:4001';
const INCIDENCIAS_SERVICE = process.env.INCIDENCIAS_SERVICE_URL || 'http://localhost:4002';
const TECNICOS_SERVICE = process.env.TECNICOS_SERVICE_URL || 'http://localhost:4003';

// =========================================================================
// ENRUTAMIENTO DINÁMICO (PROXY REVERSO DE INFRAESTRUCTURA)
// =========================================================================

// 1. Todo lo que vaya a /api/auth se redirige al Microservicio de Autenticación
app.use('/api/auth', proxy(AUTH_SERVICE, {
  proxyReqPathResolver: (req) => {
    console.log(`[Gateway] Redirigiendo Auth -> ${AUTH_SERVICE}${req.url}`);
    return req.url; // Mantiene la ruta interna intacta
  }
}));

// 2. Todo lo que vaya a /api/incidencias se redirige al Microservicio de Incidencias
app.use('/api/incidencias', proxy(INCIDENCIAS_SERVICE, {
  proxyReqPathResolver: (req) => {
    console.log(`[Gateway] Redirigiendo Incidencias -> ${INCIDENCIAS_SERVICE}${req.url}`);
    return req.url;
  }
}));

// 3. Todo lo que vaya a /api/tecnicos se redirige al Microservicio de Técnicos
app.use('/api/tecnicos', proxy(TECNICOS_SERVICE, {
  proxyReqPathResolver: (req) => {
    console.log(`[Gateway] Redirigiendo Técnicos -> ${TECNICOS_SERVICE}${req.url}`);
    return req.url;
  }
}));

// Endpoint de diagnóstico para verificar que el Gateway de infraestructura está vivo
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'SoftCorporation API Gateway' });
});

app.listen(PORT, () => {
  console.log(`🚀 API Gateway de SoftCorporation corriendo en http://localhost:${PORT}`);
});