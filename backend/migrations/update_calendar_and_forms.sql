-- ====================================================================
-- ACTUALIZACIÓN 1: CALENDARIO DE EVENTOS
-- ====================================================================

-- Actualizar los días existentes con las fechas correctas
UPDATE Dias_Evento SET 
    nombre_dia = 'Día 0: Lanzamiento y Cóctel de Prensa',
    fecha = '2024-12-01'
WHERE dia_numero = 0;

UPDATE Dias_Evento SET 
    nombre_dia = 'Día 1: Talento y Educación',
    fecha = '2024-12-02'
WHERE dia_numero = 1;

UPDATE Dias_Evento SET 
    nombre_dia = 'Día 2: Sector Empresarial',
    fecha = '2024-12-03'
WHERE dia_numero = 2;

UPDATE Dias_Evento SET 
    nombre_dia = 'Día 3: Desarrollo Humano',
    fecha = '2024-12-04'
WHERE dia_numero = 3;

UPDATE Dias_Evento SET 
    nombre_dia = 'Día 4: Gestión Pública',
    fecha = '2024-12-05'
WHERE dia_numero = 4;

UPDATE Dias_Evento SET 
    nombre_dia = 'Día 5: Sociedad Civil',
    fecha = '2024-12-06'
WHERE dia_numero = 5;

-- Insertar sesiones para cada día
-- DÍA 0: Lanzamiento y Cóctel de Prensa
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 0), '18:00 - 21:00', '18:00:00', '21:00:00', 'Lanzamiento y Cóctel de Prensa', 'Presentación oficial del evento, networking inicial', 'Inauguración del evento');

-- DÍA 1: Martes 2-12 - Talento Universitario y Futuro Profesional
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '08:00 - 10:00', '08:00:00', '10:00:00', 'Talento Universitario y Futuro Profesional (UNSA)', 'Conectar estudiantes y egresados con oportunidades de desarrollo profesional', 'Perfiles de proyectos para el fomento del talento universitario'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '10:30 - 12:30', '10:30:00', '12:30:00', 'Educación Superior (Universidades)', 'Colaboración interuniversitaria y proyectos de investigación conjunta', 'Red de colaboración entre universidades'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '14:00 - 16:00', '14:00:00', '16:00:00', 'Formación Técnica (Institutos)', 'Vinculación de la formación técnica con las necesidades del mercado', 'Programas de capacitación técnica especializada'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '16:30 - 18:30', '16:30:00', '18:30:00', 'Talento Escolar (Colegios)', 'Identificación y desarrollo de talentos desde la educación básica', 'Programas de mentoring escolar');

-- DÍA 2: Miércoles 3-12 - Sector Empresarial
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '08:00 - 10:00', '08:00:00', '10:00:00', 'Innovación Base (Empresarios MYPES)', 'Fomento de la innovación en micro y pequeñas empresas', 'Proyectos de innovación para MYPES'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '10:30 - 12:30', '10:30:00', '12:30:00', 'Escalamiento Empresarial (MEPECOS)', 'Estrategias de crecimiento para medianas y pequeñas empresas', 'Planes de escalamiento empresarial'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '14:00 - 16:00', '14:00:00', '16:00:00', 'I+D Estratégico (PRICOS)', 'Investigación y desarrollo para grandes empresas', 'Proyectos de I+D estratégicos'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '16:30 - 18:30', '16:30:00', '18:30:00', 'Organizaciones Estatales (SUNAT, ADUANAS, OSCE, etc.)', 'Modernización y eficiencia en entidades públicas', 'Propuestas de mejora en servicios públicos');

-- DÍA 3: Jueves 4-12 - Desarrollo Humano
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '08:00 - 10:00', '08:00:00', '10:00:00', 'Desarrollo Humano - Sesión 1 (Colegios Profesionales)', 'Primera sesión de desarrollo profesional continuo', 'Programas de actualización profesional'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '10:30 - 12:30', '10:30:00', '12:30:00', 'Desarrollo Humano - Sesión 2 (Colegios Profesionales)', 'Segunda sesión de desarrollo profesional continuo', 'Certificaciones y especializaciones'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '14:00 - 16:00', '14:00:00', '16:00:00', 'Desarrollo Humano - Sesión 3 (Colegios Profesionales)', 'Tercera sesión de desarrollo profesional continuo', 'Redes profesionales especializadas'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '16:30 - 18:30', '16:30:00', '18:30:00', 'Desarrollo Humano - Sesión 4 (Colegios Profesionales)', 'Cuarta sesión de desarrollo profesional continuo', 'Proyectos de impacto profesional');

-- DÍA 4: Viernes 5-12 - Gestión Pública
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '08:00 - 10:00', '08:00:00', '10:00:00', 'Gestión Local (Municipalidades Distritales)', 'Mejora de servicios municipales a nivel distrital', 'Proyectos de desarrollo local'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '10:30 - 12:30', '10:30:00', '12:30:00', 'Planificación Provincial (Municipalidades Provinciales)', 'Coordinación y planificación a nivel provincial', 'Planes de desarrollo provincial'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '14:00 - 16:00', '14:00:00', '16:00:00', 'Políticas Regionales (Gobierno Regional y Central)', 'Implementación de políticas públicas regionales', 'Propuestas de políticas regionales'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '16:30 - 18:30', '16:30:00', '18:30:00', 'Entidades Públicas Sectoriales y de Control', 'Fortalecimiento institucional y control', 'Sistemas de mejora institucional');

-- DÍA 5: Sábado 6-12 - Sociedad Civil
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '08:00 - 10:00', '08:00:00', '10:00:00', 'Organizaciones de Base y Programas Sociales', 'Fortalecimiento de organizaciones comunitarias', 'Proyectos de desarrollo comunitario'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '10:30 - 12:30', '10:30:00', '12:30:00', 'ONGs y Voluntariado', 'Coordinación entre ONGs y programas de voluntariado', 'Red de colaboración civil'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '14:00 - 16:00', '14:00:00', '16:00:00', 'Gremios y Movimientos Ciudadanos', 'Participación ciudadana y representación gremial', 'Propuestas ciudadanas'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '16:30 - 18:00', '16:30:00', '18:00:00', 'Almuerzo de Clausura', 'Networking final y cierre del evento', 'Compromisos de seguimiento'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '18:00 - 19:00', '18:00:00', '19:00:00', 'Plenaria Final', 'Presentación de resultados y próximos pasos', 'Documento de compromisos finales');

-- ====================================================================
-- ACTUALIZACIÓN 2: ESTRUCTURA DE FORMULARIOS
-- ====================================================================

-- Crear nuevas tablas para los diferentes tipos de participantes

-- Tabla para participantes de Academia
CREATE TABLE Participantes_Academia (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    institucion VARCHAR(255) NOT NULL,
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    programa_estudio VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    tipo_participacion ENUM('Presencial', 'Virtual') NOT NULL DEFAULT 'Presencial',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabla para participantes de Gobierno
CREATE TABLE Participantes_Gobierno (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    institucion VARCHAR(255) NOT NULL,
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    tipo_gobierno ENUM('CENTRAL', 'REGIONAL', 'PROVINCIAL', 'DISTRITAL') NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    tipo_participacion ENUM('Presencial', 'Virtual') NOT NULL DEFAULT 'Presencial',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabla para participantes de Empresa
CREATE TABLE Participantes_Empresa (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombre_empresa VARCHAR(255) NOT NULL,
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    tipo_empresa ENUM('Natural', 'Jurídica') NOT NULL,
    tamaño_empresa VARCHAR(100),
    clasificacion ENUM('Micro', 'MYPE', 'Mediana', 'Grande') NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    tipo_participacion ENUM('Presencial', 'Virtual') NOT NULL DEFAULT 'Presencial',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabla para participantes de Sociedad Civil
CREATE TABLE Participantes_Sociedad_Civil (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    organizacion_representada VARCHAR(255), -- Puede ser NULL si marca "YO MISMO"
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255), -- Puede ser "YO MISMO"
    tipo_organizacion_civil VARCHAR(255) NOT NULL,
    tamaño_organizacion VARCHAR(100),
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50),
    tipo_participacion ENUM('Presencial', 'Virtual') NOT NULL DEFAULT 'Presencial',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- Tablas para relacionar días de interés con cada tipo de participante
CREATE TABLE Academia_Interes_Dias (
    participante_id INT NOT NULL,
    dia_id INT NOT NULL,
    PRIMARY KEY (participante_id, dia_id),
    FOREIGN KEY (participante_id) REFERENCES Participantes_Academia(participante_id) ON DELETE CASCADE,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

CREATE TABLE Gobierno_Interes_Dias (
    participante_id INT NOT NULL,
    dia_id INT NOT NULL,
    PRIMARY KEY (participante_id, dia_id),
    FOREIGN KEY (participante_id) REFERENCES Participantes_Gobierno(participante_id) ON DELETE CASCADE,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

CREATE TABLE Empresa_Interes_Dias (
    participante_id INT NOT NULL,
    dia_id INT NOT NULL,
    PRIMARY KEY (participante_id, dia_id),
    FOREIGN KEY (participante_id) REFERENCES Participantes_Empresa(participante_id) ON DELETE CASCADE,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

CREATE TABLE Sociedad_Civil_Interes_Dias (
    participante_id INT NOT NULL,
    dia_id INT NOT NULL,
    PRIMARY KEY (participante_id, dia_id),
    FOREIGN KEY (participante_id) REFERENCES Participantes_Sociedad_Civil(participante_id) ON DELETE CASCADE,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

-- ====================================================================
-- MIGRACIÓN DE DATOS EXISTENTES
-- ====================================================================

-- Migrar datos existentes de Participantes_Externos a las nuevas tablas según su hélice
-- Nota: Esta migración asume que los datos existentes se pueden mapear a las nuevas estructuras

-- Migrar Academia (helice_id = 1)
INSERT INTO Participantes_Academia (usuario_id, institucion, nombres_apellidos, cargo, email, telefono, fecha_registro)
SELECT 
    pe.usuario_id,
    COALESCE(pe.organizacion, 'No especificada') as institucion,
    pe.nombres_apellidos,
    pe.cargo,
    u.email,
    pe.telefono,
    u.fecha_registro
FROM Participantes_Externos pe
JOIN Usuarios u ON pe.usuario_id = u.usuario_id
WHERE pe.helice_id = 1;

-- Migrar Gobierno (helice_id = 2)
INSERT INTO Participantes_Gobierno (usuario_id, institucion, nombres_apellidos, cargo, tipo_gobierno, email, telefono, fecha_registro)
SELECT 
    pe.usuario_id,
    COALESCE(pe.organizacion, 'No especificada') as institucion,
    pe.nombres_apellidos,
    pe.cargo,
    'CENTRAL' as tipo_gobierno, -- Valor por defecto, se puede ajustar manualmente
    u.email,
    pe.telefono,
    u.fecha_registro
FROM Participantes_Externos pe
JOIN Usuarios u ON pe.usuario_id = u.usuario_id
WHERE pe.helice_id = 2;

-- Migrar Empresas (helice_id = 3)
INSERT INTO Participantes_Empresa (usuario_id, nombre_empresa, nombres_apellidos, cargo, tipo_empresa, clasificacion, email, telefono, fecha_registro)
SELECT 
    pe.usuario_id,
    COALESCE(pe.organizacion, 'No especificada') as nombre_empresa,
    pe.nombres_apellidos,
    pe.cargo,
    'Jurídica' as tipo_empresa, -- Valor por defecto
    'MYPE' as clasificacion, -- Valor por defecto
    u.email,
    pe.telefono,
    u.fecha_registro
FROM Participantes_Externos pe
JOIN Usuarios u ON pe.usuario_id = u.usuario_id
WHERE pe.helice_id = 3;

-- Migrar Sociedad Civil (helice_id = 4)
INSERT INTO Participantes_Sociedad_Civil (usuario_id, organizacion_representada, nombres_apellidos, cargo, tipo_organizacion_civil, email, telefono, fecha_registro)
SELECT 
    pe.usuario_id,
    pe.organizacion as organizacion_representada,
    pe.nombres_apellidos,
    pe.cargo,
    'ONG' as tipo_organizacion_civil, -- Valor por defecto
    u.email,
    pe.telefono,
    u.fecha_registro
FROM Participantes_Externos pe
JOIN Usuarios u ON pe.usuario_id = u.usuario_id
WHERE pe.helice_id = 4;

-- Migrar intereses de días existentes
-- Academia
INSERT INTO Academia_Interes_Dias (participante_id, dia_id)
SELECT pa.participante_id, pid.dia_id
FROM Participantes_Academia pa
JOIN Participantes_Externos pe ON pa.usuario_id = pe.usuario_id
JOIN Participante_Interes_Dias pid ON pe.participante_id = pid.participante_id;

-- Gobierno
INSERT INTO Gobierno_Interes_Dias (participante_id, dia_id)
SELECT pg.participante_id, pid.dia_id
FROM Participantes_Gobierno pg
JOIN Participantes_Externos pe ON pg.usuario_id = pe.usuario_id
JOIN Participante_Interes_Dias pid ON pe.participante_id = pid.participante_id;

-- Empresa
INSERT INTO Empresa_Interes_Dias (participante_id, dia_id)
SELECT pe_new.participante_id, pid.dia_id
FROM Participantes_Empresa pe_new
JOIN Participantes_Externos pe ON pe_new.usuario_id = pe.usuario_id
JOIN Participante_Interes_Dias pid ON pe.participante_id = pid.participante_id;

-- Sociedad Civil
INSERT INTO Sociedad_Civil_Interes_Dias (participante_id, dia_id)
SELECT psc.participante_id, pid.dia_id
FROM Participantes_Sociedad_Civil psc
JOIN Participantes_Externos pe ON psc.usuario_id = pe.usuario_id
JOIN Participante_Interes_Dias pid ON pe.participante_id = pid.participante_id;

-- ====================================================================
-- ACTUALIZACIÓN DE ROLES
-- ====================================================================

-- Actualizar enum de roles para incluir los nuevos tipos
ALTER TABLE Usuarios MODIFY COLUMN rol ENUM('admin', 'externo', 'unsa', 'academia', 'gobierno', 'empresa', 'sociedad_civil') NOT NULL;

-- Actualizar roles existentes según la hélice
UPDATE Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
SET u.rol = 'academia'
WHERE pe.helice_id = 1;

UPDATE Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
SET u.rol = 'gobierno'
WHERE pe.helice_id = 2;

UPDATE Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
SET u.rol = 'empresa'
WHERE pe.helice_id = 3;

UPDATE Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
SET u.rol = 'sociedad_civil'
WHERE pe.helice_id = 4;