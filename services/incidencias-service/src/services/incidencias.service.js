const incidenciasRepository = require('../repositories/incidencias.repository');
const equiposClient = require('../clients/equipos.client');
const usuariosClient = require('../clients/usuarios.client');

const inferTecnicoAsignado = (inc) => {
  if (inc.tecnico_asignado) {
    return inc.tecnico_asignado;
  }

  const historial = [...(inc.historial || [])].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const asignacion = historial.find((evento) => /^Asignada a .+ por .+/.test(evento.evento || ''));

  if (!asignacion) {
    return null;
  }

  return asignacion.evento.replace(/^Asignada a /, '').replace(/ por .+$/, '');
};

const mapIncidencia = (inc) => ({
  id: inc.id,
  codigoEquipo: inc.codigo_equipo,
  problema: inc.problema,
  usuarioResponsable: inc.usuario_responsable,
  registradoPor: inc.registrado_por,
  fechaHora: inc.fecha_hora,
  estado: inc.estado,
  tecnicoAsignado: inferTecnicoAsignado(inc),
  informeTecnico: inc.informe_tecnico,
  repuestoSolicitado: inc.repuesto_solicitado,
  historial: inc.historial
    ? inc.historial.map((h) => ({
        fecha: h.fecha,
        evento: h.evento,
      }))
    : [],
});

const listarIncidencias = async () => {
  const { data, error } = await incidenciasRepository.findAll();

  if (error) {
    throw error;
  }

  return data.map(mapIncidencia);
};

const listarMisIncidencias = async (usuario) => {
  if (!usuario || usuario.rol !== 'tecnico') {
    const error = new Error('Acceso denegado: solo tecnicos pueden consultar sus tareas.');
    error.statusCode = 403;
    throw error;
  }

  const incidencias = await listarIncidencias();
  return incidencias.filter((incidencia) => incidencia.tecnicoAsignado === usuario.nombre);
};

const obtenerIncidenciaPorId = async (id) => {
  const { data, error } = await incidenciasRepository.findById(id);

  if (error || !data) {
    const notFoundError = new Error('Incidencia no encontrada');
    notFoundError.statusCode = 404;
    throw notFoundError;
  }

  if (data.historial) {
    data.historial.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  }

  return mapIncidencia(data);
};

const obtenerHistorialIncidencia = async (id) => {
  const incidencia = await obtenerIncidenciaPorId(id);
  return incidencia.historial;
};

const registrarIncidencia = async (payload, usuario, authorization) => {
  const { codigoEquipo, problema, usuarioResponsable, registradoPor } = payload;
  const validation = await equiposClient.validarEquipo(codigoEquipo, authorization);

  if (!validation.valido) {
    const error = new Error(`El equipo ${codigoEquipo} no existe en el inventario real.`);
    error.statusCode = 400;
    throw error;
  }

  const timestamp = Date.now().toString().slice(-4);
  const newId = `INC-${timestamp}`;

  const nuevaIncidencia = {
    id: newId,
    codigo_equipo: codigoEquipo,
    problema,
    usuario_responsable: usuarioResponsable,
    registrado_por: registradoPor,
  };

  const { data, error } = await incidenciasRepository.createIncidencia(nuevaIncidencia);

  if (error) {
    throw error;
  }

  const creador = usuario ? usuario.nombre : registradoPor || 'Sistema';
  await incidenciasRepository.createHistorialEvento({
    incidencia_id: newId,
    evento: `Incidencia registrada por ${creador}`,
  });

  return mapIncidencia(data);
};

const actualizarIncidencia = async (id, payload, usuario, authorization) => {
  const { tecnicoId, nuevoEstado, informe, repuesto } = payload;
  const { data: incActual } = await incidenciasRepository.findById(id);

  if (!incActual) {
    const error = new Error('Incidencia no encontrada');
    error.statusCode = 404;
    throw error;
  }

  const tecnicoAsignadoActual = inferTecnicoAsignado(incActual);
  const usuarioInfo = usuario ? usuario.nombre : 'Sistema';
  const updateFields = {};
  const logs = [];

  if (tecnicoId) {
    const tecnico = await usuariosClient.obtenerTecnicoPorId(tecnicoId, authorization);

    if (tecnico.tareas_actuales >= tecnico.capacidad_maxima) {
      const error = new Error('Capacidad maxima alcanzada');
      error.statusCode = 400;
      throw error;
    }

    if (tecnicoAsignadoActual) {
      await liberarCargaTecnicoPorNombre(tecnicoAsignadoActual, authorization);
    }

    updateFields.estado = 'Asignada';

    await usuariosClient.actualizarCargaTecnico(tecnico.id, { delta: 1 }, authorization);

    logs.push({
      incidencia_id: id,
      evento: `Asignada a ${tecnico.nombre} por ${usuarioInfo}`,
    });
  }

  if (nuevoEstado) {
    updateFields.estado = nuevoEstado;

    logs.push({
      incidencia_id: id,
      evento: `Estado cambiado a ${nuevoEstado} por ${usuarioInfo}`,
    });

    if ((nuevoEstado === 'Resuelta' || nuevoEstado === 'Cerrada') && tecnicoAsignadoActual) {
      await liberarCargaTecnicoPorNombre(tecnicoAsignadoActual, authorization);
    }
  }

  if (informe) {
    updateFields.informe_tecnico = informe;

    logs.push({
      incidencia_id: id,
      evento: `Informe tecnico registrado por ${usuarioInfo}`,
    });
  }

  if (repuesto) {
    updateFields.repuesto_solicitado = repuesto;
    updateFields.estado = 'En espera de repuesto';

    logs.push({
      incidencia_id: id,
      evento: `Repuesto solicitado: ${repuesto} por ${usuarioInfo}`,
    });
  }

  const { error: updateError } = await incidenciasRepository.updateIncidencia(id, updateFields);

  if (updateError) {
    throw updateError;
  }

  if (logs.length > 0) {
    const { error: historialError } = await incidenciasRepository.createHistorialEventos(logs);

    if (historialError) {
      throw historialError;
    }
  }

  const { data: final, error } = await incidenciasRepository.findById(id);

  if (error) {
    throw error;
  }

  return mapIncidencia(final);
};

const liberarCargaTecnicoPorNombre = async (nombre, authorization) => {
  const tecnico = await usuariosClient.obtenerTecnicoPorNombre(nombre, authorization);
  const currentLoad = Number(tecnico.tareas_actuales || 0);
  await usuariosClient.actualizarCargaTecnico(tecnico.id, {
    tareasActuales: Math.max(currentLoad - 1, 0),
  }, authorization);
};

module.exports = {
  listarIncidencias,
  listarMisIncidencias,
  obtenerIncidenciaPorId,
  obtenerHistorialIncidencia,
  registrarIncidencia,
  actualizarIncidencia,
};
