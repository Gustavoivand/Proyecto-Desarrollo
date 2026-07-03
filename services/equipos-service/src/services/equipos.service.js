const equiposRepository = require('../repositories/equipos.repository');

const listarEquipos = async () => {
  const { data, error } = await equiposRepository.findAll();

  if (error) {
    throw error;
  }

  return data;
};

const obtenerEquipoPorCodigo = async (codigo) => {
  const { data, error } = await equiposRepository.findByCodigo(codigo);

  if (error || !data) {
    const notFoundError = new Error('Equipo no encontrado');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  return data;
};

const validarEquipo = async (codigo) => {
  const { data } = await equiposRepository.findByCodigo(codigo);

  return {
    valido: Boolean(data),
    equipo: data || null,
  };
};

module.exports = {
  listarEquipos,
  obtenerEquipoPorCodigo,
  validarEquipo,
};
