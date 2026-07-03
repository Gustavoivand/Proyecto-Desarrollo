const tecnicosService = require('../services/tecnicos.service');

const listarTecnicos = async (req, res, next) => {
  try {
    const tecnicos = await tecnicosService.listarTecnicos();
    res.json(tecnicos);
  } catch (error) {
    next(error);
  }
};

const obtenerTecnicoPorId = async (req, res, next) => {
  try {
    const tecnico = await tecnicosService.obtenerTecnicoPorId(req.params.id);
    res.json(tecnico);
  } catch (error) {
    next(error);
  }
};

const obtenerTecnicoPorNombre = async (req, res, next) => {
  try {
    const tecnico = await tecnicosService.obtenerTecnicoPorNombre(req.params.nombre);
    res.json(tecnico);
  } catch (error) {
    next(error);
  }
};

const actualizarCargaTecnico = async (req, res, next) => {
  try {
    const tecnico = await tecnicosService.actualizarCargaTecnico(req.params.id, req.body);
    res.json(tecnico);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarTecnicos,
  obtenerTecnicoPorId,
  obtenerTecnicoPorNombre,
  actualizarCargaTecnico,
};
