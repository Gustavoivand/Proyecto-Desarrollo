const express = require('express');
const cors = require('cors');

const app = express();

const PORT = process.env.PORT || 8080;
const REQUEST_TIMEOUT_MS = Number(process.env.REQUEST_TIMEOUT_MS || 5000);

const SERVICES = {
  usuarios: process.env.USUARIOS_SERVICE_URL || 'http://localhost:3001',
  equipos: process.env.EQUIPOS_SERVICE_URL || 'http://localhost:3002',
  incidencias: process.env.INCIDENCIAS_SERVICE_URL || 'http://localhost:3003',
};

const HOP_BY_HOP_HEADERS = new Set([
  'host',
  'content-length',
  'connection',
  'expect',
  'transfer-encoding',
  'upgrade',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
]);

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

function getTargetService(originalUrl) {
  if (originalUrl.startsWith('/api/auth')) return SERVICES.usuarios;
  if (originalUrl.startsWith('/api/usuarios')) return SERVICES.usuarios;
  if (originalUrl.startsWith('/api/tecnicos')) return SERVICES.usuarios;
  if (originalUrl.startsWith('/api/equipos')) return SERVICES.equipos;
  if (originalUrl.startsWith('/api/incidencias')) return SERVICES.incidencias;

  return null;
}

function stripApiPrefix(originalUrl) {
  return originalUrl.replace(/^\/api/, '') || '/';
}

function buildForwardHeaders(req) {
  const headers = {};

  for (const [key, value] of Object.entries(req.headers)) {
    if (!HOP_BY_HOP_HEADERS.has(key.toLowerCase())) {
      headers[key] = value;
    }
  }

  headers['x-gateway-request'] = 'true';

  return headers;
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
}

app.get('/api/health', async (req, res) => {
  const checks = await Promise.allSettled(
    Object.entries(SERVICES).map(async ([name, baseUrl]) => {
      const response = await fetchWithTimeout(`${baseUrl}/health`);

      return {
        name,
        url: baseUrl,
        status: response.ok ? 'ok' : 'unavailable',
        httpStatus: response.status,
      };
    })
  );

  const services = checks.map((result, index) => {
    const [name, baseUrl] = Object.entries(SERVICES)[index];

    if (result.status === 'fulfilled') {
      return result.value;
    }

    return {
      name,
      url: baseUrl,
      status: 'unavailable',
      error: 'service_not_reachable',
    };
  });

  return res.json({
    status: 'ok',
    service: 'api-gateway',
    port: Number(PORT),
    services,
  });
});

app.use('/api', async (req, res) => {
  const targetService = getTargetService(req.originalUrl);

  if (!targetService) {
    return res.status(404).json({
      error: 'Ruta no soportada por el gateway',
      path: req.originalUrl,
    });
  }

  const targetUrl = `${targetService}${stripApiPrefix(req.originalUrl)}`;
  const hasRequestBody = !['GET', 'HEAD'].includes(req.method) && req.body && Object.keys(req.body).length > 0;

  try {
    const response = await fetchWithTimeout(targetUrl, {
      method: req.method,
      headers: buildForwardHeaders(req),
      body: hasRequestBody ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get('content-type') || '';

    res.status(response.status);

    if (contentType.includes('application/json')) {
      const data = await response.json();
      return res.json(data);
    }

    const text = await response.text();
    return res.send(text);
  } catch (error) {
    return res.status(502).json({
      error: 'No se pudo contactar al microservicio',
      detail: error.name === 'AbortError' ? 'request_timeout' : error.message,
    });
  }
});

module.exports = app;
