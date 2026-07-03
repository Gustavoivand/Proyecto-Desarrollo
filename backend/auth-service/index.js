const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'softcorp-super-secret-key-2026';

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DB_URL || 'postgres://user_auth:password_auth@localhost:5432/softcorp_auth'
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE LOWER(email) = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Estructura idéntica al monolito para no romper el Frontend
    const payload = {
      email: user.email,
      nombre: user.nombre,
      rol: user.rol,
      tecnicoId: user.tecnico_id || null
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    console.log(`[Auth-Service] Login exitoso para: ${user.email} -> Rol: ${user.rol}, TecnicoId: ${user.tecnico_id}`);
    
    res.json({
      token,
      user: payload
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno en el servidor de autenticación' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Auth Business Service' });
});

app.listen(PORT, () => {
  console.log(`🔒 Microservicio de Autenticación corriendo en el puerto ${PORT}`);
});