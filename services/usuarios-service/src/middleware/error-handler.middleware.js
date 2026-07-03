const errorHandler = (err, req, res, next) => {
  console.error('usuarios-service error:', err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || 'Error interno en usuarios-service',
  });
};

module.exports = errorHandler;
