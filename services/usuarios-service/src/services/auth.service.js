const jwt = require('jsonwebtoken');

const USERS = [
  { email: 'jefe@softcorp.com', password: 'jefe123', nombre: 'Jefe de Soporte', rol: 'jefe' },
  { email: 'carlos@softcorp.com', password: 'carlos123', nombre: 'Carlos Tecnico', rol: 'tecnico', tecnicoId: 'T-CARLOS' },
  { email: 'ana@softcorp.com', password: 'ana123', nombre: 'Ana Especialista', rol: 'tecnico', tecnicoId: 'T-ANA' },
  { email: 'roberto@softcorp.com', password: 'roberto123', nombre: 'Roberto Redes', rol: 'tecnico', tecnicoId: 'T-ROBERTO' },
];

const login = ({ email, password }) => {
  if (!email || !password) {
    const error = new Error('Email y password son obligatorios');
    error.statusCode = 400;
    throw error;
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no configurado');
  }

  const user = USERS.find(
    (candidate) => candidate.email === email.toLowerCase() && candidate.password === password
  );

  if (!user) {
    const error = new Error('Credenciales invalidas');
    error.statusCode = 401;
    throw error;
  }

  const payload = {
    email: user.email,
    nombre: user.nombre,
    rol: user.rol,
    tecnicoId: user.tecnicoId || null,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });

  return {
    token,
    user: payload,
  };
};

module.exports = {
  login,
};
