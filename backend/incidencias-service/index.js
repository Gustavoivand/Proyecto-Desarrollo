const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4002;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'user_incidencias',
  password: process.env.DB_PASSWORD || 'password_incidencias',
  database: process.env.DB_NAME || 'softcorp_incidencias',
  waitForConnections: true,
  connectionLimit: 10
});

const mapIncidencia = (inc, historial = []) => ({
  id: inc.id,
  codigoEquipo: inc.codigo_equipo,
  problema: inc.problema,
  usuarioResponsable: inc.usuario_responsable,
  registradoPor: inc.registrado_por,
  fechaHora: inc.fecha_hora,
  estado: inc.estado,
  tecnicoAsignado: inc.tecnico_asignado,
  informeTecnico: inc.informe_tecnico,
  repuestoSolicitado: inc.repuesto_solicitado,
  historial: historial.map(h => ({ fecha: h.fecha, evento: h.evento }))
});

// ==========================================
// 1. HEALTH CHECK (Estática - DEBE IR PRIMERO)
// ==========================================
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Incidencias MySQL Service' });
});

// ==========================================
// 2. LISTAR INCIDENCIAS (GET /)
// ==========================================
app.get('/', async (req, res) => {
  try {
    const userRol = req.headers['x-user-rol'] || 'jefe';
    const userNombre = req.headers['x-user-nombre'] || '';

    let rows;
    if (userRol === 'tecnico') {
      [rows] = await pool.query('SELECT * FROM incidencias WHERE tecnico_asignado = ? ORDER BY fecha_hora DESC', [userNombre]);
    } else {
      [rows] = await pool.query('SELECT * FROM incidencias ORDER BY fecha_hora DESC');
    }
    res.json(rows.map(r => mapIncidencia(r)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar incidencias' });
  }
});

// ==========================================
// 3. REGISTRAR INCIDENCIA (POST /)
// ==========================================
app.post('/', async (req, res) => {
  const { codigoEquipo, problema, usuarioResponsable } = req.body;
  const registradoPor = req.headers['x-user-nombre'] || 'Jefe de Soporte';
  
  const idTexto = `INC-${Date.now().toString().slice(-5)}`;

  try {
    await pool.query(
      `INSERT INTO incidencias (id, codigo_equipo, problema, usuario_responsable, registrado_por, estado) 
       VALUES (?, ?, ?, ?, ?, 'Pendiente')`,
      [idTexto, codigoEquipo, problema, usuarioResponsable, registradoPor]
    );

    await pool.query(
      'INSERT INTO historial_incidencias (incidencia_id, evento) VALUES (?, ?)',
      [idTexto, `Incidencia registrada por ${registradoPor}`]
    );

    res.status(201).json({ id: idTexto, message: 'Incidencia creada con éxito en MySQL' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar incidencia' });
  }
});

// ==========================================
// 3.5 ASIGNAR TÉCNICO / ACTUALIZAR INCIDENCIA (PATCH /:id)
// ==========================================
app.patch('/:id', async (req, res) => {
  const { id } = req.params;
  
  const tecnicoAsignado = req.body.tecnico || req.body.tecnicoAsignado || req.body.tecnicoId;
  const registradoPor = req.headers['x-user-nombre'] || 'Jefe de Soporte';

  if (!tecnicoAsignado) {
    return res.status(400).json({ error: 'No se proporcionó un técnico válido.' });
  }

  try {
    // 1. Verificar si la incidencia existe
    const [incRows] = await pool.query('SELECT * FROM incidencias WHERE id = ?', [id]);
    if (incRows.length === 0) {
      return res.status(404).json({ error: 'Incidencia no encontrada' });
    }

    // Adaptación para la demo: Mapear ID a Nombre si aplica
    let nombreTecnico = tecnicoAsignado;
    if (tecnicoAsignado === 'T-CARLOS') nombreTecnico = 'Carlos Tecnico';
    if (tecnicoAsignado === 'T-ANA') nombreTecnico = 'Ana Especialista';

    // 2. Actualizar la incidencia en la BD a 'Asignada'
    await pool.query(
      `UPDATE incidencias 
       SET tecnico_asignado = ?, estado = 'Asignada' 
       WHERE id = ?`,
      [nombreTecnico, id]
    );

    // 3. Registrar el evento en el historial
    await pool.query(
      'INSERT INTO historial_incidencias (incidencia_id, evento) VALUES (?, ?)',
      [id, `Asignada a ${nombreTecnico} por ${registradoPor}`]
    );

    // ==========================================
    // 🚀 MEJORA CRÍTICA: OBTENER DATA ACTUALIZADA PARA EL FRONTEND
    // ==========================================
    // Volvemos a consultar la incidencia modificada e historial completo de la BD
    const [updatedIncRows] = await pool.query('SELECT * FROM incidencias WHERE id = ?', [id]);
    const [updatedHistRows] = await pool.query('SELECT * FROM historial_incidencias WHERE incidencia_id = ? ORDER BY fecha ASC', [id]);

    // Devolvemos el JSON estructurado exactamente igual que el método GET /:id usando tu función mapIncidencia
    const incidenciaCompleta = mapIncidencia(updatedIncRows[0], updatedHistRows);
    
    // Respondemos con el objeto completo de la incidencia para que React actualice el estado inmediatamente
    res.json(incidenciaCompleta);

  } catch (err) {
    console.error('Error al asignar técnico:', err);
    res.status(500).json({ error: 'Error interno al actualizar la incidencia' });
  }
});

// ==========================================
// 4. OBTENER DETALLE POR ID (Dinámica - AL FINAL)
// ==========================================
app.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [incRows] = await pool.query('SELECT * FROM incidencias WHERE id = ?', [id]);
    if (incRows.length === 0) return res.status(404).json({ error: 'Incidencia no encontrada' });

    const [histRows] = await pool.query('SELECT * FROM historial_incidencias WHERE incidencia_id = ? ORDER BY fecha ASC', [id]);
    res.json(mapIncidencia(incRows[0], histRows));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener detalle' });
  }
});

app.listen(PORT, () => console.log(`📋 Microservicio de Incidencias corriendo en puerto ${PORT}`));