-- ============================================================================
-- MIGRACIÓN ALTERNATIVA: Usar JSON para almacenar arrays de OCDE y ODS
-- ============================================================================
-- Esta es una alternativa a tener múltiples filas por registro.
-- En lugar de múltiples filas, almacenamos arrays JSON en una sola fila.
-- 
-- VENTAJAS:
-- - Una sola fila por registro (más limpio)
-- - No hay duplicados
-- - Más fácil de manejar en el frontend
--
-- DESVENTAJAS:
-- - Más difícil hacer queries complejas (búsquedas por área específica)
-- - Requiere cambios significativos en el backend
--
-- NOTA: Esta migración es OPCIONAL. El sistema actual con múltiples filas
--       funciona correctamente después de aplicar los fixes del frontend.
-- ============================================================================

-- OPCIÓN 1: Modificar tablas existentes para usar JSON
-- ============================================================================

-- Backup de datos actuales (ejecutar antes de la migración)
CREATE TABLE Registro_OCDE_backup AS SELECT * FROM Registro_OCDE;
CREATE TABLE Registro_ODS_backup AS SELECT * FROM Registro_ODS;

-- Eliminar tabla actual y recrear con estructura JSON
DROP TABLE IF EXISTS Registro_OCDE;

CREATE TABLE Registro_OCDE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT NOT NULL,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') NOT NULL,
    
    -- Arrays JSON para almacenar múltiples IDs
    area_ids JSON,          -- Array de IDs de áreas: [2, 3]
    sub_area_ids JSON,      -- Array de IDs de sub-áreas: [8, 9]
    disciplina_ids JSON,    -- Array de IDs de disciplinas: [50, 51, 52]
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_tipo_registro (usuario_id, tipo, registro_id),
    INDEX idx_usuario (usuario_id)
);

-- Ejemplo de inserción con JSON:
-- INSERT INTO Registro_OCDE (usuario_id, registro_id, tipo, area_ids, sub_area_ids, disciplina_ids)
-- VALUES (1, 1, 'centro_produccion', JSON_ARRAY(2), JSON_ARRAY(8), JSON_ARRAY(50, 51, 52, 53, 54));

-- Hacer lo mismo para ODS
DROP TABLE IF EXISTS Registro_ODS;

CREATE TABLE Registro_ODS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT NOT NULL,
    tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') NOT NULL,
    
    -- Arrays JSON para almacenar múltiples IDs
    objetivo_ids JSON,      -- Array de IDs de objetivos: [8, 9]
    meta_ids JSON,          -- Array de IDs de metas: [61, 62, 63]
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    UNIQUE KEY unique_usuario_tipo_registro (usuario_id, tipo, registro_id),
    INDEX idx_usuario (usuario_id)
);

-- Ejemplo de inserción con JSON:
-- INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_ids, meta_ids)
-- VALUES (1, 1, 'centro_produccion', JSON_ARRAY(8, 9), JSON_ARRAY(61, 62, 63, 64));

-- ============================================================================
-- OPCIÓN 2: Mantener estructura actual pero agregar índices únicos
-- ============================================================================
-- Esta es la opción RECOMENDADA si quieres mantener la estructura actual
-- pero evitar duplicados a nivel de base de datos.

-- Agregar índice único compuesto para evitar duplicados
ALTER TABLE Registro_OCDE 
ADD UNIQUE KEY unique_ocde_entry (usuario_id, registro_id, tipo, area_id, sub_area_id, disciplina_id);

ALTER TABLE Registro_ODS 
ADD UNIQUE KEY unique_ods_entry (usuario_id, registro_id, tipo, objetivo_id, meta_id);

-- ============================================================================
-- QUERIES DE EJEMPLO para trabajar con JSON (si usas OPCIÓN 1)
-- ============================================================================

-- Buscar registros que tengan el área 2:
-- SELECT * FROM Registro_OCDE 
-- WHERE JSON_CONTAINS(area_ids, '2');

-- Buscar registros que tengan la disciplina 50:
-- SELECT * FROM Registro_OCDE 
-- WHERE JSON_CONTAINS(disciplina_ids, '50');

-- Obtener todos los IDs de áreas de un registro:
-- SELECT JSON_EXTRACT(area_ids, '$') as areas 
-- FROM Registro_OCDE 
-- WHERE usuario_id = 1 AND registro_id = 1 AND tipo = 'centro_produccion';

-- ============================================================================
-- RECOMENDACIÓN FINAL
-- ============================================================================
-- 
-- Para tu caso, RECOMIENDO mantener la estructura actual (múltiples filas)
-- porque:
-- 
-- 1. Ya está implementada y funcionando
-- 2. Los fixes del frontend eliminan los duplicados en la UI
-- 3. Es más fácil hacer búsquedas y filtros complejos
-- 4. Es el patrón estándar en bases de datos relacionales
-- 
-- Solo considera la OPCIÓN 1 (JSON) si:
-- - Necesitas optimizar el rendimiento (menos filas)
-- - No necesitas hacer búsquedas complejas por área/disciplina específica
-- - Prefieres simplicidad en el modelo de datos
-- 
-- ============================================================================
