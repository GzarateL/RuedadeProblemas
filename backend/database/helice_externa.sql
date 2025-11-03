CREATE TABLE Registros_Participantes (
    registro_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    tipo_participante ENUM('gobierno', 'colegio_profesional', 'empresa', 'sociedad_civil') NOT NULL,
    tipo_participacion ENUM('presencial', 'virtual') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_tipo (usuario_id, tipo_participante)
);

-- ====================================================================
-- TABLA DE DÍAS DE INTERÉS (RELACIÓN MUCHOS A MUCHOS CON SESIONES)
-- ====================================================================

CREATE TABLE Registro_Dias_Interes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    sesion_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (sesion_id) REFERENCES Sesiones_Evento(sesion_id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_sesion (usuario_id, sesion_id),
    INDEX idx_usuario (usuario_id),
    INDEX idx_sesion (sesion_id)
);

-- ====================================================================
-- FORMULARIO 1: GOBIERNO (Entidades Públicas)
-- ====================================================================

CREATE TABLE Registro_Gobierno (
    registro_gobierno_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombre_institucion VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    tipo_gobierno ENUM('central', 'regional', 'provincial', 'distrital') NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_tipo_gobierno (tipo_gobierno)
);

-- ====================================================================
-- FORMULARIO 2: COLEGIO PROFESIONAL
-- ====================================================================

CREATE TABLE Registro_Colegio_Profesional (
    registro_colegio_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombre_institucion VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    programa_estudio VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_programa (programa_estudio)
);

-- ====================================================================
-- FORMULARIO 3: EMPRESA
-- ====================================================================

CREATE TABLE Registro_Empresa (
    registro_empresa_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombre_empresa VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    tipo_empresa ENUM('persona_natural_con_negocio', 'persona_juridica') NOT NULL,
    tamano_empresa ENUM('menos_de_4', 'de_4_a_10', 'de_11_a_20', 'de_21_a_50', 'mas_de_50') NOT NULL,
    clasificacion_empresa ENUM('microempresa', 'mype', 'mediana', 'gran_empresa') NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_clasificacion (clasificacion_empresa)
);

-- ====================================================================
-- FORMULARIO 4: SOCIEDAD CIVIL
-- ====================================================================

CREATE TABLE Registro_Sociedad_Civil (
    registro_sociedad_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombre_organizacion VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(255) NOT NULL,
    tipo_organizacion ENUM(
        'gremio_sindical',
        'sociedad_civil_sin_fines_lucro',
        'sociedad_civil_con_fines_lucro',
        'ong',
        'colegio_profesional',
        'gremio_empresarial',
        'persona_natural',
        'junta_vecinal',
        'comedor_popular',
        'asociacion_civil',
        'asociacion_militar',
        'otro'
    ) NOT NULL,
    tamano_organizacion ENUM('menos_de_4', 'de_4_a_10', 'de_11_a_20', 'de_21_a_50', 'mas_de_50') NOT NULL,
    email VARCHAR(255) NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_tipo_org (tipo_organizacion)
);

-- ====================================================================
-- TABLA COMÚN: DESCRIPCIÓN DEL DESAFÍO (PROBLEMA)
-- Simplificada - Las relaciones OCDE, ODS y Keywords van por tablas compartidas
-- ====================================================================

CREATE TABLE Desafios (
    desafio_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    titulo VARCHAR(500) NOT NULL,
    descripcion TEXT NOT NULL,
    impacto ENUM('microlocal', 'local', 'distrital', 'provincial', 'regional') NOT NULL,
    intentos_previos TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    INDEX idx_usuario (usuario_id),
    INDEX idx_impacto (impacto)
);
