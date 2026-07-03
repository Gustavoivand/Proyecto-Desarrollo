const { requestJson } = require('./http-client');

const baseUrl = (process.env.EQUIPOS_SERVICE_URL || 'http://localhost:3002').replace(/\/+$/, '');

const validarEquipo = (codigoEquipo, authorization) => {
  return requestJson(`${baseUrl}/equipos/${encodeURIComponent(codigoEquipo)}/validar`, {
    authorization,
  });
};

module.exports = {
  validarEquipo,
};
