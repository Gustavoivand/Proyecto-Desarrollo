const { requestJson } = require('./http-client');

const baseUrl = (process.env.USUARIOS_SERVICE_URL || 'http://localhost:3001').replace(/\/+$/, '');

const obtenerTecnicoPorId = (id, authorization) => {
  return requestJson(`${baseUrl}/tecnicos/${encodeURIComponent(id)}`, {
    authorization,
  });
};

const obtenerTecnicoPorNombre = (nombre, authorization) => {
  return requestJson(`${baseUrl}/tecnicos/nombre/${encodeURIComponent(nombre)}`, {
    authorization,
  });
};

const actualizarCargaTecnico = (id, payload, authorization) => {
  return requestJson(`${baseUrl}/tecnicos/${encodeURIComponent(id)}/carga`, {
    method: 'PATCH',
    body: payload,
    authorization,
  });
};

module.exports = {
  obtenerTecnicoPorId,
  obtenerTecnicoPorNombre,
  actualizarCargaTecnico,
};
