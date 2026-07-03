const errorHandler = (err, req, res, next) => {
  console.error('incidencias-service error:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno en incidencias-service',
  });
};

module.exports = errorHandler;
