const tecnicosRepository = require('../repositories/tecnicos.repository');

const listarTecnicos = async () => {
  const { data, error } = await tecnicosRepository.findAll();

  if (error) {
    throw error;
  }

  return data;
};

const obtenerTecnicoPorId = async (id) => {
  const { data, error } = await tecnicosRepository.findById(id);

  if (error || !data) {
    const notFoundError = new Error('Tecnico no encontrado');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  return data;
};

const obtenerTecnicoPorNombre = async (nombre) => {
  const { data, error } = await tecnicosRepository.findByNombre(nombre);

  if (error || !data) {
    const notFoundError = new Error('Tecnico no encontrado');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  return data;
};

const actualizarCargaTecnico = async (id, payload) => {
  const tecnico = await obtenerTecnicoPorId(id);
  const delta = Number(payload.delta || 0);
  const requestedValue = payload.tareasActuales;
  const nextCarga = requestedValue !== undefined
    ? Number(requestedValue)
    : Number(tecnico.tareas_actuales || 0) + delta;

  if (!Number.isInteger(nextCarga) || nextCarga < 0) {
    const error = new Error('Carga de tecnico invalida');
    error.statusCode = 400;
    throw error;
  }

  const { error } = await tecnicosRepository.updateTareasActuales(id, nextCarga);

  if (error) {
    throw error;
  }

  return {
    ...tecnico,
    tareas_actuales: nextCarga,
  };
};

module.exports = {
  listarTecnicos,
  obtenerTecnicoPorId,
  obtenerTecnicoPorNombre,
  actualizarCargaTecnico,
};
