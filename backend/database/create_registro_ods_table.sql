-- ============================================================================
-- CREAR TABLA Registro_ODS CON ESTRUCTURA COMPLETA
-- Incluye las columnas registro_id y tipo de la migración
-- ============================================================================

-- IMPORTANTE: Asegúrate de estar en la base de datos correcta
-- Ejecuta primero: USE nombre_de_tu_base_datos;
-- Para verificar: SELECT DATABASE();

-- Verificar que estás en la base de datos correcta
SELECT DATABASE() as base_datos_actual;

-- Verificar si la tabla ya existe
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'ADVERTENCIA: La tabla Registro_ODS ya existe'
        ELSE 'OK: Procediendo a crear la tabla'
    END as estado
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Registro_ODS';

-- Crear la tabla con la estructura completa (incluyendo migración)
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

-- Verificar que la tabla se creó correctamente
DESCRIBE Registro_ODS;

-- Mostrar mensaje de éxito
SELECT 'Tabla Registro_ODS creada exitosamente' as resultado;
