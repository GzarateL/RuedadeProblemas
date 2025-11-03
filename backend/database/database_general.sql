-- ====================================================================
-- TABLA DE USUARIOS EN GENERAL - REGISTRO INICIAL - PRESELECCION DE ROL
-- ====================================================================

CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombres_apellidos VARCHAR(255),
    rol ENUM('admin', 'externo', 'interno') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- DIAS Y SESIONES DE INTERES - CALENDARIO
-- ====================================================================

CREATE TABLE Dias_Evento (
    dia_id INT PRIMARY KEY AUTO_INCREMENT,
    dia_numero INT NOT NULL,
    nombre_dia VARCHAR(100) NOT NULL,
    fecha DATE NOT NULL
);
CREATE TABLE Sesiones_Evento (
    sesion_id INT PRIMARY KEY AUTO_INCREMENT,
    dia_id INT NOT NULL,
    horario_display VARCHAR(100) NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    bloque_tematico TEXT NOT NULL,
    foco_objetivos TEXT,
    entregable_clave TEXT,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

-- ====================================================================
-- PALABRAS CLAVE
-- ====================================================================

CREATE TABLE keywords_catalog (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    keyword VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_keyword ON keywords_catalog(keyword);
CREATE INDEX idx_category ON keywords_catalog(category);

-- ====================================================================
-- OCDE EN LA BASE DE DATOS
-- ====================================================================

-- Tabla para Áreas
CREATE TABLE areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla para Sub-áreas
CREATE TABLE sub_areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    area_id INT NOT NULL,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
);

-- Tabla para Disciplinas
CREATE TABLE disciplinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    sub_area_id INT NOT NULL,
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id) ON DELETE CASCADE
);

-- ====================================================================
-- METAS Y OBJETIVOS ODS
-- ====================================================================

-- CRear tabla de Objetivos
CREATE TABLE objetivos (
    id INT PRIMARY KEY,
    nombre TEXT NOT NULL
);

-- Crear tabla de Metas
CREATE TABLE metas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    objetivo_id INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id)
);

-- ====================================================================
-- REGISTRO HÉLICE INTERNA - DOCENTE INVESTIGADOR
-- ====================================================================

CREATE TABLE Registro_Docente_Investigador (
    registro_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    
    -- Datos según Excel - Docente Investigador
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    programa_estudio VARCHAR(255) NOT NULL,
    
    -- CTI Vitae (solo 1 URL para docente individual)
    url_cti_vitae VARCHAR(500),
    
    -- Estado del registro
    estado ENUM('borrador', 'completado', 'en_revision', 'aprobado', 'rechazado') DEFAULT 'borrador',
    paso_actual INT DEFAULT 1,
    observaciones TEXT,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    fecha_aprobacion TIMESTAMP NULL,
    aprobado_por INT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (aprobado_por) REFERENCES Usuarios(usuario_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- ====================================================================
-- REGISTRO HÉLICE INTERNA - GRUPO, CENTRO O INSTITUTO
-- ====================================================================

CREATE TABLE Registro_Grupo_Centro_Instituto (
    registro_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    
    -- Datos según Excel - Grupo/Centro/Instituto
    nombre VARCHAR(255) NOT NULL, -- Nombre del grupo/centro/instituto
    nombre_completo_responsable VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    oficina_departamento_vinculado VARCHAR(255) NOT NULL,
    
    -- Estado del registro
    estado ENUM('borrador', 'completado', 'en_revision', 'aprobado', 'rechazado') DEFAULT 'borrador',
    paso_actual INT DEFAULT 1,
    observaciones TEXT,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    fecha_aprobacion TIMESTAMP NULL,
    aprobado_por INT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (aprobado_por) REFERENCES Usuarios(usuario_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- ====================================================================
-- REGISTRO HÉLICE INTERNA - LABORATORIO
-- ====================================================================

CREATE TABLE Registro_Laboratorio (
    registro_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    
    -- Datos según Excel - Laboratorio
    nombre VARCHAR(255) NOT NULL, -- Nombre del laboratorio
    nombre_completo_responsable VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    oficina_departamento_vinculado VARCHAR(255) NOT NULL,
    
    -- Estado del registro
    estado ENUM('borrador', 'completado', 'en_revision', 'aprobado', 'rechazado') DEFAULT 'borrador',
    paso_actual INT DEFAULT 1,
    observaciones TEXT,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    fecha_aprobacion TIMESTAMP NULL,
    aprobado_por INT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (aprobado_por) REFERENCES Usuarios(usuario_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- ====================================================================
-- REGISTRO HÉLICE INTERNA - CENTRO DE PRODUCCIÓN
-- ====================================================================

CREATE TABLE Registro_Centro_Produccion (
    registro_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    
    -- Datos según Excel - Centro de Producción
    nombre VARCHAR(255) NOT NULL, -- Nombre del centro de producción
    nombre_completo_responsable VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    oficina_departamento_vinculado VARCHAR(255) NOT NULL,
    
    -- Estado del registro
    estado ENUM('borrador', 'completado', 'en_revision', 'aprobado', 'rechazado') DEFAULT 'borrador',
    paso_actual INT DEFAULT 1,
    observaciones TEXT,
    
    -- Timestamps
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fecha_completado TIMESTAMP NULL,
    fecha_aprobacion TIMESTAMP NULL,
    aprobado_por INT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (aprobado_por) REFERENCES Usuarios(usuario_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_estado (estado)
);

-- ====================================================================
-- TABLAS COMPARTIDAS PARA TODOS LOS TIPOS DE HÉLICE INTERNA
-- ====================================================================

-- ────────────────────────────────────────────────────────────────────
-- OCDE (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_OCDE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    area_id INT,
    sub_area_id INT,
    disciplina_id INT,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    INDEX idx_usuario (usuario_id)
);

-- ────────────────────────────────────────────────────────────────────
-- ODS (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_ODS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    objetivo_id INT NOT NULL,
    meta_id INT,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    INDEX idx_usuario (usuario_id)
);

-- ────────────────────────────────────────────────────────────────────
-- APORTES DEL Y DS (Común para todos) - Escala 1-7
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_Aportes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nivel_aporte_del INT CHECK (nivel_aporte_del BETWEEN 1 AND 7) NOT NULL,
    nivel_aporte_ds INT CHECK (nivel_aporte_ds BETWEEN 1 AND 7) NOT NULL,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────────────
-- CTI VITAE (Para grupos/centros/institutos/laboratorios/producción)
-- Múltiples URLs de integrantes
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_CTI_Vitae (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    url_cti VARCHAR(500) NOT NULL,
    orden INT DEFAULT 1,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
);

-- ────────────────────────────────────────────────────────────────────
-- NIVELES TRL Y CRL (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_Niveles_Tecnologicos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nivel_trl INT CHECK (nivel_trl BETWEEN 1 AND 9),
    nivel_crl INT CHECK (nivel_crl BETWEEN 1 AND 9),
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────────────
-- PIU (Producción Intelectual Universitaria) - Común para todos
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_PIU (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    
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
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- ────────────────────────────────────────────────────────────────────
-- PALABRAS CLAVE (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_Keywords (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    keyword_id BIGINT UNSIGNED NOT NULL,  -- Cambiar a BIGINT UNSIGNED
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (keyword_id) REFERENCES keywords_catalog(id),
    UNIQUE KEY unique_usuario_keyword (usuario_id, keyword_id),
    INDEX idx_usuario (usuario_id)
);

-- ────────────────────────────────────────────────────────────────────
-- SOLUCIONES PROPUESTAS (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_Soluciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    problema TEXT NOT NULL,
    solucion TEXT NOT NULL,
    orden INT DEFAULT 1,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
);

-- ────────────────────────────────────────────────────────────────────
-- ARCHIVOS ADJUNTOS (Común para todos)
-- ────────────────────────────────────────────────────────────────────

CREATE TABLE Registro_Archivos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    tipo_archivo VARCHAR(100),
    tamano_archivo BIGINT,
    descripcion TEXT,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id)
);
