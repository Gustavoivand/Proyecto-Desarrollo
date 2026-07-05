CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    rol VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tecnico_id VARCHAR(50)
);

-- Inyeccion de la data del monolito --
-- Jefe de Soporte (rol = 'jefe')
INSERT INTO usuarios (email, password, nombre, rol, tecnico_id) 
VALUES ('jefe@softcorp.com', 'jefe123', 'Jefe de Soporte', 'jefe', NULL)
ON CONFLICT (email) DO NOTHING;

-- Técnico Carlos
INSERT INTO usuarios (email, password, nombre, rol, tecnico_id) 
VALUES ('carlos@softcorp.com', 'carlos123', 'Carlos Tecnico', 'tecnico', 'T-CARLOS')
ON CONFLICT (email) DO NOTHING;

-- Técnico Ana
INSERT INTO usuarios (email, password, nombre, rol, tecnico_id) 
VALUES ('ana@softcorp.com', 'ana123', 'Ana Especialista', 'tecnico', 'T-ANA')
ON CONFLICT (email) DO NOTHING;

-- Técnico Roberto
INSERT INTO usuarios (email, password, nombre, rol, tecnico_id) 
VALUES ('roberto@softcorp.com', 'roberto123', 'Roberto Redes', 'tecnico', 'T-ROBERTO')
ON CONFLICT (email) DO NOTHING;