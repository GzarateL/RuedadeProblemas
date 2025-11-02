-- TABLA DE USUARIOS EN GENERAL

CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'externo', 'interno') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE Usuarios 
MODIFY COLUMN rol ENUM('admin', 'interno', 'externo') NOT NULL;

-- TABLA PARA EL MATCHEO

CREATE TABLE IF NOT EXISTS estado_matching (
    id INT PRIMARY KEY DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_activacion DATETIME NULL,
    CONSTRAINT chk_single_row CHECK (id = 1)
);

-- Insertar el registro inicial
INSERT INTO estado_matching (id, activo) VALUES (1, FALSE)
ON DUPLICATE KEY UPDATE id = id;



-- CHATS FUNCIONALIDAD QUE DEJAREMOS DORMIR POR MIENTRAS

CREATE TABLE IF NOT EXISTS Solicitudes (
  solicitud_id INT AUTO_INCREMENT PRIMARY KEY,
  
  -- Usuario que envía la solicitud
  remitente_tipo ENUM('unsa', 'externo') NOT NULL,
  remitente_id INT NOT NULL, -- investigador_id o participante_id
  
  -- Usuario que recibe la solicitud
  destinatario_tipo ENUM('unsa', 'externo') NOT NULL,
  destinatario_id INT NOT NULL, -- investigador_id o participante_id
  
  -- Contexto de la solicitud
  tipo_match ENUM('capacidad', 'desafio') NOT NULL, -- Qué tipo de perfil motivó la solicitud
  match_id INT NOT NULL, -- capacidad_id o desafio_id
  
  -- Estado y mensaje
  estado ENUM('pendiente', 'aceptada', 'rechazada') DEFAULT 'pendiente',
  mensaje TEXT,
  
  -- Timestamps
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_respuesta TIMESTAMP NULL,
  
  -- Índices para búsquedas eficientes
  INDEX idx_remitente (remitente_tipo, remitente_id),
  INDEX idx_destinatario (destinatario_tipo, destinatario_id),
  INDEX idx_estado (estado),
  INDEX idx_fecha_creacion (fecha_creacion),
  
  -- Evitar solicitudes duplicadas
  UNIQUE KEY unique_solicitud (remitente_tipo, remitente_id, destinatario_tipo, destinatario_id, tipo_match, match_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- Tabla para gestionar conversaciones/chats entre usuarios
CREATE TABLE IF NOT EXISTS Chats (
  chat_id INT AUTO_INCREMENT PRIMARY KEY,
  solicitud_id INT NOT NULL UNIQUE, -- Cada chat nace de una solicitud aceptada
  
  -- Participantes del chat
  usuario1_tipo ENUM('unsa', 'externo') NOT NULL,
  usuario1_id INT NOT NULL,
  usuario2_tipo ENUM('unsa', 'externo') NOT NULL,
  usuario2_id INT NOT NULL,
  
  -- Contexto del chat
  tipo_match ENUM('capacidad', 'desafio') NOT NULL,
  match_id INT NOT NULL,
  titulo_chat VARCHAR(255) NOT NULL, -- Título del desafío o descripción de capacidad
  
  -- Estado
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ultima_actividad TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_usuario1 (usuario1_tipo, usuario1_id),
  INDEX idx_usuario2 (usuario2_tipo, usuario2_id),
  INDEX idx_solicitud (solicitud_id),
  INDEX idx_activo (activo),
  
  -- Foreign key
  FOREIGN KEY (solicitud_id) REFERENCES Solicitudes(solicitud_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla para los mensajes del chat
CREATE TABLE IF NOT EXISTS Mensajes (
  mensaje_id INT AUTO_INCREMENT PRIMARY KEY,
  chat_id INT NOT NULL,
  
  -- Remitente del mensaje
  remitente_tipo ENUM('unsa', 'externo') NOT NULL,
  remitente_id INT NOT NULL,
  
  -- Contenido
  contenido TEXT NOT NULL,
  
  -- Estado
  leido BOOLEAN DEFAULT FALSE,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Índices
  INDEX idx_chat (chat_id),
  INDEX idx_remitente (remitente_tipo, remitente_id),
  INDEX idx_fecha (fecha_envio),
  INDEX idx_leido (leido),
  
  -- Foreign key
  FOREIGN KEY (chat_id) REFERENCES Chats(chat_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;




-- DIAS

-- ====================================================================
-- ACTUALIZACIÓN 1: CALENDARIO DE EVENTOS
-- ====================================================================

-- 1. Tabla de Días (Gestionada por el Admin)
-- Aquí el admin crea los 5 días principales del evento.
CREATE TABLE Dias_Evento (
    dia_id INT PRIMARY KEY AUTO_INCREMENT,
    dia_numero INT NOT NULL, -- Ej: 1, 2, 3, 4, 5
    nombre_dia VARCHAR(100) NOT NULL, -- Ej: "Día 1", "Día 2"
    fecha DATE NOT NULL -- La fecha específica de ese día
);

CREATE TABLE Sesiones_Evento (
    sesion_id INT PRIMARY KEY AUTO_INCREMENT,
    dia_id INT NOT NULL, -- Vincula esta sesión a un día (Día 1, Día 2, etc.)
    
    -- Campos para el horario
    horario_display VARCHAR(100) NOT NULL, -- Ej: "08:00 - 10:00"
    hora_inicio TIME, -- Ej: '08:00:00' (para ordenar)
    hora_fin TIME, -- Ej: '10:00:00' (para ordenar)

    -- Campos de contenido (como en el documento)
    bloque_tematico TEXT NOT NULL, -- Ej: "Talento Universitario y Futuro Profesional"
    foco_objetivos TEXT, -- Ej: "Relevancia curricular, investigación..."
    entregable_clave TEXT, -- Ej: "Perfiles de proyectos para el fomento..."
    
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);
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

-- PALABRAS CLAVE 

-- Crear tabla de palabras clave (catálogo)
CREATE TABLE keywords_catalog (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para búsqueda rápida
CREATE INDEX idx_keyword ON keywords_catalog(keyword);
CREATE INDEX idx_category ON keywords_catalog(category);

-- Insertar las 30+ palabras clave base (sin duplicados, todo en minúsculas)
INSERT INTO keywords_catalog (keyword, category, description) VALUES
-- tecnologia digital
('inteligencia artificial', 'tecnologia_digital', 'machine learning, redes neuronales, ia'),
('internet de las cosas', 'tecnologia_digital', 'iot, sensores conectados, dispositivos inteligentes'),
('blockchain', 'tecnologia_digital', 'cadena de bloques, criptomonedas, contratos inteligentes'),
('big data', 'tecnologia_digital', 'analisis de datos masivos, mineria de datos'),
('ciberseguridad', 'tecnologia_digital', 'seguridad informatica, proteccion de datos'),
('realidad virtual', 'tecnologia_digital', 'vr, inmersion digital, simulacion'),
('robotica', 'tecnologia_digital', 'robots, automatizacion, cobots'),
('impresion 3d', 'tecnologia_digital', 'manufactura aditiva, prototipado rapido'),

-- medio ambiente
('biorremediacion', 'medio_ambiente', 'descontaminacion biologica, fitorremediacion'),
('energias renovables', 'medio_ambiente', 'solar, eolica, energia limpia'),
('economia circular', 'medio_ambiente', 'reciclaje, reutilizacion, sostenibilidad'),
('tratamiento de aguas', 'medio_ambiente', 'purificacion, potabilizacion, saneamiento'),
('gestion de residuos solidos', 'medio_ambiente', 'manejo de basura, reciclaje, compostaje'),
('cambio climatico', 'medio_ambiente', 'calentamiento global, huella de carbono'),
('biodiversidad', 'medio_ambiente', 'conservacion, ecosistemas, especies'),
('contaminacion ambiental', 'medio_ambiente', 'polucion, contaminantes, remediacion'),

-- salud
('telemedicina', 'salud', 'salud digital, consulta remota, e-health'),
('diagnostico molecular', 'salud', 'pcr, analisis genetico, biomarcadores'),
('biomateriales', 'salud', 'implantes, protesis, materiales biocompatibles'),
('bacterias probioticas', 'salud', 'microbioma, flora intestinal, probioticos'),
('epidemiologia', 'salud', 'salud publica, prevencion, vigilancia epidemiologica'),
('nutricion clinica', 'salud', 'dietetica, alimentacion saludable'),
('dispositivos medicos', 'salud', 'equipamiento medico, tecnologia sanitaria'),

-- ingenieria
('estructuras civiles', 'ingenieria', 'diseno estructural, puentes, edificios'),
('sismoresistencia', 'ingenieria', 'diseno antisismico, resistencia sismica'),
('bim', 'ingenieria', 'building information modeling, modelado 3d'),
('geotecnia', 'ingenieria', 'mecanica de suelos, cimentaciones'),
('materiales de construccion', 'ingenieria', 'concreto, acero, materiales estructurales'),
('eficiencia energetica', 'ingenieria', 'ahorro de energia, optimizacion energetica'),

-- industria
('industria 4.0', 'industria', 'smart factory, automatizacion industrial'),
('lean manufacturing', 'industria', 'manufactura esbelta, mejora continua'),
('mantenimiento predictivo', 'industria', 'analisis de vibraciones, prevencion de fallas'),
('control de calidad', 'industria', 'aseguramiento, six sigma, iso'),
('cadena de suministro', 'industria', 'logistica, supply chain, distribucion'),
('seguridad industrial', 'industria', 'prevencion de riesgos, salud ocupacional'),

-- agroindustria
('agricultura de precision', 'agroindustria', 'smart farming, drones agricolas'),
('tecnologia de alimentos', 'agroindustria', 'food tech, procesamiento, conservacion'),
('seguridad alimentaria', 'agroindustria', 'inocuidad, haccp, trazabilidad'),
('control de plagas', 'agroindustria', 'manejo integrado, fitosanitario'),
('acuicultura', 'agroindustria', 'piscicultura, cultivo de peces'),
('agricultura sostenible', 'agroindustria', 'agroecologia, produccion organica'),

-- gestion
('transformacion digital', 'gestion', 'digitalizacion empresarial, change management'),
('emprendimiento', 'gestion', 'startups, innovacion empresarial'),
('politicas publicas', 'gestion', 'gestion publica, gobernanza'),
('rotacion de personal', 'gestion', 'turnover, retencion de talento'),
('gestion del conocimiento', 'gestion', 'knowledge management, capital intelectual'),
('innovacion social', 'gestion', 'impacto social, valor compartido'),

-- educacion
('educacion inclusiva', 'educacion', 'inclusion, diversidad, accesibilidad'),
('dislexia', 'educacion', 'trastornos de aprendizaje, dificultades de lectura'),
('metodologias activas', 'educacion', 'aprendizaje activo, pedagogia'),
('e-learning', 'educacion', 'educacion virtual, plataformas educativas'),

-- materiales
('nanomateriales', 'materiales', 'nanotecnologia, nanoparticulas'),
('polimeros', 'materiales', 'plasticos, biopolimeros'),
('materiales compuestos', 'materiales', 'composites, fibra de carbono');


-- UPDATE TABLES
ALTER TABLE registros_helice_interna 
ADD COLUMN programa_estudio VARCHAR(255) AFTER oficina_departamento;
-- ALTER TABLES
DROP VIEW IF EXISTS vista_registros_helice_completa;

CREATE VIEW vista_registros_helice_completa AS
SELECT 
    r.id,
    r.tipo_id,
    t.nombre as tipo_nombre,
    r.usuario_id,
    u.email as usuario_email,
    r.nombre_completo,
    r.nombre_entidad,
    r.email_corporativo,
    r.telefono,
    r.programa_estudio,
    r.oficina_departamento,
    r.estado,
    r.paso_actual,
    r.fecha_creacion,
    r.fecha_actualizacion,
    r.fecha_completado,
    r.fecha_aprobacion
FROM registros_helice_interna r
JOIN tipos_helice_interna t ON r.tipo_id = t.id
JOIN Usuarios u ON r.usuario_id = u.usuario_id;