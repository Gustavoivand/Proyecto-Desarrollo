-- 0. Limpieza previa dentro del contenedor
DROP TABLE IF EXISTS historial_incidencias;
DROP TABLE IF EXISTS incidencias;
DROP TABLE IF EXISTS equipos;

-- 1. Tabla de Equipos
CREATE TABLE equipos (
    codigo VARCHAR(50) PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    area VARCHAR(100) NOT NULL
);

-- 2. Tabla de Incidencias (Eliminamos la columna tecnico_asignado y la agregamos para compatibilidad directa con el frontend)
CREATE TABLE incidencias (
    id VARCHAR(50) PRIMARY KEY,
    codigo_equipo VARCHAR(50),
    problema TEXT NOT NULL,
    usuario_responsable VARCHAR(150),
    registrado_por VARCHAR(150),
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(50) DEFAULT 'Pendiente', 
    tecnico_asignado VARCHAR(150) DEFAULT NULL,
    informe_tecnico TEXT DEFAULT NULL,
    repuesto_solicitado TEXT DEFAULT NULL,
    FOREIGN KEY (codigo_equipo) REFERENCES equipos(codigo)
);

-- 3. Tabla de Historial
CREATE TABLE historial_incidencias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incidencia_id VARCHAR(50),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    evento VARCHAR(255) NOT NULL,
    FOREIGN KEY (incidencia_id) REFERENCES incidencias(id) ON DELETE CASCADE
);

-- 4. Inyección de Equipos Reales del Monolito
INSERT INTO equipos (codigo, descripcion, area) VALUES
('SOP-L01', 'MacBook Pro M2 - 16GB RAM', 'Desarrollo'),
('SOP-L02', 'Dell XPS 15 - 32GB RAM', 'Diseño'),
('SOP-D01', 'Workstation HP Z4 - i9', 'Data Science'),
('SOP-I01', 'Impresora Láser Xerox B230', 'Administración'),
('SOP-M01', 'Monitor LG Ultrawide 34"', 'Marketing');

-- 5. Inyección de Incidencia de Prueba Real
INSERT INTO incidencias (id, codigo_equipo, problema, usuario_responsable, registrado_por, estado, tecnico_asignado) 
VALUES ('INC-DEMO', 'SOP-L01', 'Prueba inicial del sistema', 'Admin', 'Sistema', 'Pendiente', NULL);

INSERT INTO historial_incidencias (incidencia_id, evento) 
VALUES ('INC-DEMO', 'Incidencia de de demostración creada');