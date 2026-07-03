const incidenciasService = require('../services/incidencias.service');

const listarIncidencias = async (req, res, next) => {
  try {
    const incidencias = await incidenciasService.listarIncidencias();
    res.json(incidencias);
  } catch (error) {
    next(error);
  }
};

const listarMisIncidencias = async (req, res, next) => {
  try {
    const incidencias = await incidenciasService.listarMisIncidencias(req.user);
    res.json(incidencias);
  } catch (error) {
    next(error);
  }
};

const obtenerIncidenciaPorId = async (req, res, next) => {
  try {
    const incidencia = await incidenciasService.obtenerIncidenciaPorId(req.params.id);
    res.json(incidencia);
  } catch (error) {
    next(error);
  }
};

const obtenerHistorialIncidencia = async (req, res, next) => {
  try {
    const historial = await incidenciasService.obtenerHistorialIncidencia(req.params.id);
    res.json(historial);
  } catch (error) {
    next(error);
  }
};

const registrarIncidencia = async (req, res, next) => {
  try {
    const incidencia = await incidenciasService.registrarIncidencia(
      req.body,
      req.user,
      req.headers.authorization
    );

    res.status(201).json(incidencia);
  } catch (error) {
    next(error);
  }
};

const actualizarIncidencia = async (req, res, next) => {
  try {
    if (req.body.tecnicoId && req.user?.rol !== 'jefe') {
      const error = new Error('Acceso denegado: Solo la jefatura de soporte puede asignar tecnicos.');
      error.statusCode = 403;
      throw error;
    }

    const incidencia = await incidenciasService.actualizarIncidencia(
      req.params.id,
      req.body,
      req.user,
      req.headers.authorization
    );

    res.json(incidencia);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarIncidencias,
  listarMisIncidencias,
  obtenerIncidenciaPorId,
  obtenerHistorialIncidencia,
  registrarIncidencia,
  actualizarIncidencia,
};
