const requireGatewayRequest = (req, res, next) => {
  const mustRequireHeader = process.env.REQUIRE_GATEWAY_HEADER !== 'false';

  if (!mustRequireHeader) {
    return next();
  }

  if (req.get('X-Gateway-Request') !== 'true') {
    return res.status(403).json({ error: 'Acceso directo no permitido. Use api-gateway.' });
  }

  return next();
};

module.exports = requireGatewayRequest;
