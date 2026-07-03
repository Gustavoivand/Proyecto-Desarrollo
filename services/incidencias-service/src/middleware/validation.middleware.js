const validateRegistrarIncidencia = (req, res, next) => {
  const { codigoEquipo, problema, usuarioResponsable, registradoPor } = req.body;

  if (!codigoEquipo || typeof codigoEquipo !== 'string' || !/^[A-Za-z0-9-]+$/.test(codigoEquipo.trim())) {
    return res.status(400).json({ error: 'Codigo de equipo invalido o vacio. Solo se permiten letras, numeros y guiones.' });
  }

  if (!problema || typeof problema !== 'string' || problema.trim().length < 5) {
    return res.status(400).json({ error: 'El problema presentado debe tener al menos 5 caracteres.' });
  }

  if (!usuarioResponsable || typeof usuarioResponsable !== 'string' || usuarioResponsable.trim() === '') {
    return res.status(400).json({ error: 'El usuario responsable es obligatorio.' });
  }

  if (!registradoPor || typeof registradoPor !== 'string' || registradoPor.trim() === '') {
    return res.status(400).json({ error: 'El campo registradoPor es obligatorio.' });
  }

  return next();
};

const validateActualizarIncidencia = (req, res, next) => {
  const { tecnicoId, nuevoEstado, informe, repuesto } = req.body;

  if (tecnicoId && (typeof tecnicoId !== 'string' || tecnicoId.trim() === '')) {
    return res.status(400).json({ error: 'El ID del tecnico es invalido.' });
  }

  if (nuevoEstado) {
    const estadosValidos = ['Pendiente', 'Asignada', 'En proceso', 'En espera de repuesto', 'Resuelta', 'Cerrada'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ error: 'Estado de incidencia no valido.' });
    }
  }

  if (informe && (typeof informe !== 'string' || informe.trim().length < 5)) {
    return res.status(400).json({ error: 'El informe tecnico debe tener al menos 5 caracteres.' });
  }

  if (repuesto && (typeof repuesto !== 'string' || repuesto.trim() === '')) {
    return res.status(400).json({ error: 'El repuesto solicitado no puede estar vacio.' });
  }

  return next();
};

module.exports = {
  validateRegistrarIncidencia,
  validateActualizarIncidencia,
};
