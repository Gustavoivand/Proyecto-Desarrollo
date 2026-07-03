const authService = require('../services/auth.service');

const login = (req, res, next) => {
  try {
    const result = authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};
