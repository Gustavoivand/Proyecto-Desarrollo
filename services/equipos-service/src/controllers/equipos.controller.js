const equiposService = require('../services/equipos.service');

const listarEquipos = async (req, res, next) => {
  try {
    const equipos = await equiposService.listarEquipos();
    res.json(equipos);
  } catch (error) {
    next(error);
  }
};

const obtenerEquipoPorCodigo = async (req, res, next) => {
  try {
    const equipo = await equiposService.obtenerEquipoPorCodigo(req.params.codigo);
    res.json(equipo);
  } catch (error) {
    next(error);
  }
};

const validarEquipo = async (req, res, next) => {
  try {
    const resultado = await equiposService.validarEquipo(req.params.codigo);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarEquipos,
  obtenerEquipoPorCodigo,
  validarEquipo,
};
