-- ============================================================================
-- CREAR TODAS LAS TABLAS COMPARTIDAS DE REGISTRO HÉLICE INTERNA
-- Incluye las columnas registro_id y tipo de la migración
-- ============================================================================

-- IMPORTANTE: Asegúrate de estar en la base de datos correcta
-- Ejecuta primero: USE nombre_de_tu_base_datos;

SELECT DATABASE() as base_datos_actual;

-- ============================================================================
-- 1. Registro_OCDE
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_OCDE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    area_id INT,
    sub_area_id INT,
    disciplina_id INT,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 2. Registro_ODS
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_ODS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    objetivo_id INT NOT NULL,
    meta_id INT,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 3. Registro_Aportes
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_Aportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    nivel_aporte_del INT CHECK (nivel_aporte_del BETWEEN 1 AND 7) NOT NULL,
    nivel_aporte_ds INT CHECK (nivel_aporte_ds BETWEEN 1 AND 7) NOT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    UNIQUE INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 4. Registro_CTI_Vitae
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_CTI_Vitae (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    url_cti VARCHAR(500) NOT NULL,
    orden INT DEFAULT 1,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 5. Registro_Niveles_Tecnologicos
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_Niveles_Tecnologicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    nivel_trl INT CHECK (nivel_trl BETWEEN 1 AND 9),
    nivel_crl INT CHECK (nivel_crl BETWEEN 1 AND 9),
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    UNIQUE INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 6. Registro_PIU
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_PIU (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    
    -- Tesis
    tesis INT DEFAULT 0,
    
    -- Libros y capítulos
    libros INT DEFAULT 0,
    capitulos_libro INT DEFAULT 0,
    
    -- Manuscritos
    manuscritos_publicados INT DEFAULT 0,
    manuscritos_aceptados INT DEFAULT 0,
    manuscritos_evaluacion INT DEFAULT 0,
    
    -- Propiedad intelectual
    pi_patente_invencion INT DEFAULT 0,
    pi_patente_modalidad_uso INT DEFAULT 0,
    pi_sui_generis INT DEFAULT 0,
    pi_derecho_autor_software INT DEFAULT 0,
    pi_derecho_obras_literarias INT DEFAULT 0,
    pi_otras INT DEFAULT 0,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    UNIQUE INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 7. Registro_Keywords
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_Keywords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    keyword_id BIGINT UNSIGNED NOT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords_catalog(id),
    
    UNIQUE KEY unique_usuario_keyword (usuario_id, keyword_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 8. Registro_Soluciones
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_Soluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    titulo VARCHAR(255) NOT NULL,
    problema TEXT NOT NULL,
    solucion TEXT NOT NULL,
    orden INT DEFAULT 1,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- 9. Registro_Archivos
-- ============================================================================
CREATE TABLE IF NOT EXISTS Registro_Archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion'),
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamano_archivo BIGINT,
    descripcion TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    
    INDEX idx_usuario (usuario_id),
    INDEX idx_usuario_tipo_registro (usuario_id, tipo, registro_id)
);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

-- Mostrar todas las tablas creadas
SELECT 'Tablas compartidas creadas exitosamente' as resultado;

-- Listar las tablas
SELECT TABLE_NAME, TABLE_ROWS 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME LIKE 'Registro_%'
ORDER BY TABLE_NAME;
