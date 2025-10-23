-- 1. CREAR LA BASE DE DATOS
CREATE DATABASE RuedaDeProblemasDB;

-- 2. SELECCIONAR LA BASE DE DATOS PARA USARLA
USE RuedaDeProblemasDB;

/* ====================================================================
   SECCIÓN 1: GESTIÓN DE CUENTAS Y ROLES (El Login)
   (Sin cambios)
==================================================================== 
*/

CREATE TABLE Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'externo', 'unsa') NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/* ====================================================================
   SECCIÓN 2: PERFILES DE USUARIO (El Registro)
   (Sin cambios)
==================================================================== 
*/

-- Tabla para las 4 hélices externas
CREATE TABLE Helices (
    helice_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL UNIQUE -- 'Academia', 'Gobierno', 'Empresas', 'Sociedad'
);

-- Perfil del usuario "Hélice Externa"
CREATE TABLE Participantes_Externos (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    helice_id INT NOT NULL,
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    organizacion VARCHAR(255),
    telefono VARCHAR(50),
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id),
    FOREIGN KEY (helice_id) REFERENCES Helices(helice_id)
);

-- Perfil del usuario "Hélice UNSA"
CREATE TABLE Investigadores_UNSA (
    investigador_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    nombres_apellidos VARCHAR(255) NOT NULL,
    cargo VARCHAR(255),
    telefono VARCHAR(50),
    unidad_academica VARCHAR(255) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id)
);


/* ====================================================================
   SECCIÓN 3: DATOS (PROBLEMAS Y SOLUCIONES)
   (Sin cambios)
==================================================================== 
*/

-- Desafíos (Problemas) registrados por la "Hélice Externa"
CREATE TABLE Desafios (
    desafio_id INT PRIMARY KEY AUTO_INCREMENT,
    participante_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    impacto TEXT,
    intentos_previos TEXT,
    solucion_imaginada TEXT,
    adjunto_url VARCHAR(500),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participante_id) REFERENCES Participantes_Externos(participante_id)
);

-- Capacidades (Soluciones) registradas por la "Hélice UNSA"
CREATE TABLE Capacidades_UNSA (
    capacidad_id INT PRIMARY KEY AUTO_INCREMENT,
    investigador_id INT NOT NULL,
    descripcion_capacidad TEXT NOT NULL,
    problemas_que_resuelven TEXT,
    tipos_proyectos TEXT,
    equipamiento TEXT,
    clave_interna VARCHAR(255),
    FOREIGN KEY (investigador_id) REFERENCES Investigadores_UNSA(investigador_id)
);


/* ====================================================================
   SECCIÓN 4: LÓGICA CENTRAL (MATCH, PRIORIZACIÓN Y EVENTO)
   (*** SECCIÓN ACTUALIZADA ***)
==================================================================== 
*/

-- El "Diccionario Central" de Palabras Clave (El cerebro del Admin)
CREATE TABLE PalabrasClave (
    palabra_clave_id INT PRIMARY KEY AUTO_INCREMENT,
    palabra VARCHAR(100) NOT NULL UNIQUE,
    conteo_desafios INT DEFAULT 0 NOT NULL
);

-- "Puente" que conecta Problemas con Palabras Clave (Muchos-a-Muchos)
CREATE TABLE Desafios_PalabrasClave (
    desafio_id INT NOT NULL,
    palabra_clave_id INT NOT NULL,
    PRIMARY KEY (desafio_id, palabra_clave_id),
    FOREIGN KEY (desafio_id) REFERENCES Desafios(desafio_id) ON DELETE CASCADE,
    FOREIGN KEY (palabra_clave_id) REFERENCES PalabrasClave(palabra_clave_id) ON DELETE CASCADE
);

-- "Puente" que conecta Soluciones con Palabras Clave (Muchos-a-Muchos)
CREATE TABLE Capacidades_PalabrasClave (
    capacidad_id INT NOT NULL,
    palabra_clave_id INT NOT NULL,
    PRIMARY KEY (capacidad_id, palabra_clave_id),
    FOREIGN KEY (capacidad_id) REFERENCES Capacidades_UNSA(capacidad_id) ON DELETE CASCADE,
    FOREIGN KEY (palabra_clave_id) REFERENCES PalabrasClave(palabra_clave_id) ON DELETE CASCADE
);

/*
 * -----------------------------------------------------------------
 * NUEVAS TABLAS PARA EL CRONOGRAMA (GESTIÓN DEL ADMIN)
 * -----------------------------------------------------------------
 */

-- 1. Tabla de Días (Gestionada por el Admin)
-- Aquí el admin crea los 5 días principales del evento.
CREATE TABLE Dias_Evento (
    dia_id INT PRIMARY KEY AUTO_INCREMENT,
    dia_numero INT NOT NULL, -- Ej: 1, 2, 3, 4, 5
    nombre_dia VARCHAR(100) NOT NULL, -- Ej: "Día 1", "Día 2"
    fecha DATE NOT NULL -- La fecha específica de ese día
);

-- 2. Tabla de Sesiones (Gestionada por el Admin)
-- Cada sesión individual (evento) que ocurre dentro de un día.
-- Esto coincide con los campos que pediste.
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

-- 3. Tabla de Interés del Usuario (Se llena en el registro)
-- Almacena qué días seleccionó el participante.
CREATE TABLE Participante_Interes_Dias (
    participante_id INT NOT NULL,
    dia_id INT NOT NULL,
    PRIMARY KEY (participante_id, dia_id),
    FOREIGN KEY (participante_id) REFERENCES Participantes_Externos(participante_id) ON DELETE CASCADE,
    FOREIGN KEY (dia_id) REFERENCES Dias_Evento(dia_id) ON DELETE CASCADE
);

PARTE 22222222222222222

-- Tabla para controlar el estado del sistema de matching
CREATE TABLE IF NOT EXISTS estado_matching (
    id INT PRIMARY KEY DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_activacion DATETIME NULL,
    CONSTRAINT chk_single_row CHECK (id = 1)
);

-- Insertar el registro inicial
INSERT INTO estado_matching (id, activo) VALUES (1, FALSE)
ON DUPLICATE KEY UPDATE id = id;

INSERT INTO Dias_Evento (dia_numero, nombre_dia, fecha) VALUES 
  (0, 'Día 0: Lanzamiento y Cóctel de Prensa', '2025-12-01'), 
  (1, 'Día 1: Talento y Educación', '2025-12-02'), 
  (2, 'Día 2: Sector Empresarial', '2025-12-03'), 
  (3, 'Día 3: Desarrollo Humano', '2025-12-04'), 
  (4, 'Día 4: Gestión Pública', '2025-12-05'), 
  (5, 'Día 5: Sociedad Civil', '2025-12-06');

PARTE 3333333333333333333333333333333333

-- Tabla para gestionar solicitudes entre usuarios
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

PARTE 444444444444444444444444444444444444444444444

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


INSERT INTO Helices (nombre) VALUES 
  ('Academia'), 
  ('Gobierno'), 
  ('Empresas'), 
  ('Sociedad');





