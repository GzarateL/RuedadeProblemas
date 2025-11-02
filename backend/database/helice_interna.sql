-- ====================================================================
-- SISTEMA DE REGISTRO HÉLICE INTERNA
-- ====================================================================

-- Tabla principal para tipos de entidades de hélice interna
CREATE TABLE tipos_helice_interna (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE, -- 'docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE
);

-- Insertar tipos de hélice interna
INSERT INTO tipos_helice_interna (nombre, descripcion) VALUES
('docente_investigador', 'Docentes e Investigadores individuales'),
('grupo_centro_instituto', 'Grupos, Centros e Institutos de investigación'),
('laboratorio', 'Laboratorios de investigación'),
('centro_produccion', 'Centros o Unidades de Producción');

-- Tabla principal para registros de hélice interna
CREATE TABLE registros_helice_interna (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipo_id INT NOT NULL,
    usuario_id INT NOT NULL, -- Referencia a tabla Usuarios
    
    -- Información básica (común para todos los tipos)
    nombre_completo VARCHAR(255), -- Para docentes individuales
    nombre_entidad VARCHAR(255), -- Para grupos/centros/institutos/laboratorios
    email_corporativo VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    oficina_departamento VARCHAR(255) NOT NULL,
    
    -- Estado del registro
    estado ENUM('borrador', 'completado', 'aprobado', 'rechazado') DEFAULT 'borrador',
    paso_actual INT DEFAULT 1,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    fecha_aprobacion TIMESTAMP NULL,
    
    -- Índices y constraints
    FOREIGN KEY (tipo_id) REFERENCES tipos_helice_interna(id),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    INDEX idx_tipo (tipo_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- Tabla para áreas OCDE seleccionadas
CREATE TABLE registro_areas_ocde (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    area_id INT, -- Referencia a tabla areas
    sub_area_id INT, -- Referencia a tabla sub_areas
    disciplina_id INT, -- Referencia a tabla disciplinas
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    INDEX idx_registro (registro_id)
);

-- Tabla para ODS seleccionados
CREATE TABLE registro_ods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    objetivo_id INT NOT NULL, -- Referencia a tabla objetivos
    meta_id INT, -- Referencia a tabla metas (opcional)
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    INDEX idx_registro (registro_id)
);

-- Tabla para nivel de aporte
CREATE TABLE registro_nivel_aporte (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL UNIQUE,
    nivel_aporte ENUM('alto', 'medio', 'bajo') NOT NULL,
    descripcion TEXT,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE
);

-- Tabla para información académica y niveles (específico para grupos/centros/institutos/laboratorios)
CREATE TABLE registro_integrantes_cti (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    url_cti_vitae VARCHAR(500) NOT NULL,
    orden INT NOT NULL DEFAULT 1,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    INDEX idx_registro (registro_id)
);

-- Tabla para niveles TRL y CRL
CREATE TABLE registro_niveles_tecnologicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL UNIQUE,
    nivel_trl INT CHECK (nivel_trl BETWEEN 1 AND 9),
    descripcion_trl TEXT,
    nivel_crl INT CHECK (nivel_crl BETWEEN 1 AND 9),
    descripcion_crl TEXT,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE
);

-- Tabla para Producción Intelectual Universitaria (PIU)
CREATE TABLE registro_piu (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL UNIQUE,
    
    -- Artículos científicos
    articulos_q1 INT DEFAULT 0,
    articulos_q2 INT DEFAULT 0,
    articulos_q3 INT DEFAULT 0,
    articulos_q4 INT DEFAULT 0,
    articulos_otros INT DEFAULT 0,
    
    -- Libros y capítulos
    libros_investigacion INT DEFAULT 0,
    capitulos_libro INT DEFAULT 0,
    
    -- Propiedad intelectual
    patentes_otorgadas INT DEFAULT 0,
    patentes_solicitadas INT DEFAULT 0,
    modelos_utilidad INT DEFAULT 0,
    disenos_industriales INT DEFAULT 0,
    
    -- Productos tecnológicos
    software_registrado INT DEFAULT 0,
    prototipos INT DEFAULT 0,
    
    -- Formación de recursos humanos
    tesis_doctorado_dirigidas INT DEFAULT 0,
    tesis_maestria_dirigidas INT DEFAULT 0,
    tesis_pregrado_dirigidas INT DEFAULT 0,
    
    -- Otros productos
    informes_tecnicos INT DEFAULT 0,
    consultoria_especializada INT DEFAULT 0,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE
);

-- Tabla para soluciones que ofrece
CREATE TABLE registro_soluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    problema_descripcion TEXT NOT NULL,
    solucion_propuesta TEXT NOT NULL,
    orden INT NOT NULL DEFAULT 1,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    INDEX idx_registro (registro_id)
);

-- Tabla para palabras clave asociadas al registro
CREATE TABLE registro_keywords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    keyword_id INT NOT NULL,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords_catalog(id),
    INDEX idx_registro (registro_id),
    UNIQUE KEY unique_registro_keyword (registro_id, keyword_id)
);

-- Tabla para archivos adjuntos (opcional)
CREATE TABLE registro_archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registro_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamano_archivo BIGINT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (registro_id) REFERENCES registros_helice_interna(id) ON DELETE CASCADE,
    INDEX idx_registro (registro_id)
);

-- Vista para obtener información completa de un registro
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