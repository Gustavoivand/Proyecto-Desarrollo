const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4003;

app.use(cors());
app.use(express.json());

// Inicialización de la base de datos heterogénea SQLite en memoria dentro del contenedor
const db = new sqlite3.Database(':memory:', (err) => {
  if (err) {
    console.error('❌ Error al abrir SQLite:', err.message);
  } else {
    console.log('📦 Base de datos SQLite inicializada en memoria con éxito para Técnicos.');
    inicializarTablaYData();
  }
});

// Función para recrear la estructura y data semilla EXACTA de tu setup.sql
function inicializarTablaYData() {
  db.serialize(() => {
    // 1. Recreación fiel de la Tabla de Técnicos de tu setup.sql
    db.run(`
      CREATE TABLE IF NOT EXISTS tecnicos (
        id TEXT PRIMARY KEY,
        nombre TEXT NOT NULL,
        especialidad TEXT,
        capacidad_maxima INTEGER DEFAULT 5,
        tareas_actuales INTEGER DEFAULT 0
      )
    `);

    // 2. Preparación de la consulta de inyección (CORREGIDA con 'especialidad' en español)
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO tecnicos (id, nombre, especialidad, capacidad_maxima, tareas_actuales) 
      VALUES (?, ?, ?, ?, ?)
    `);
    
    // 3. Inyección de la data semilla exacta extraída de tu repositorio
    stmt.run('T-CARLOS', 'Carlos Tecnico', 'Hardware & Laptops', 5, 0);
    stmt.run('T-ANA', 'Ana Especialista', 'Sistemas Operativos', 3, 0);
    stmt.run('T-ROBERTO', 'Roberto Redes', 'Conectividad & Redes', 4, 0);
    
    stmt.finalize();
    console.log('✅ Técnicos de tu setup.sql migrados con éxito a SQLite sin errores de tipado.');
  });
}

// 1. ENDPOINT: Listar Técnicos (Mapeado exacto con camelCase que usa tu Frontend en React)
app.get('/', (req, res) => {
  db.all('SELECT id, nombre, especialidad, capacidad_maxima AS capacidadMaxima, tareas_actuales AS tareasActuales FROM tecnicos', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al listar técnicos desde SQLite' });
    }
    
    // Mapeamos los registros resultantes a la estructura que consume el Frontend
    const result = rows.map(r => ({
      id: r.id,
      nombre: r.nombre,
      especialidad: r.especialidad,
      capacidadMaxima: r.capacidadMaxima,
      tareasActuales: r.tareasActuales
    }));
    
    res.json(result);
  });
});

// Endpoint de diagnóstico de salud (Infrastructure Health-Check)
app.get('/health', (req, res) => {
  res.json({ status: 'UP', service: 'Tecnicos SQLite Service' });
});

app.listen(PORT, () => {
  console.log(`👨‍💻 Microservicio de Técnicos corriendo de manera conforme en el puerto ${PORT}`);
});