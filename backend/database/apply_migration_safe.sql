-- ============================================================================
-- APLICAR MIGRACIÓN DE FORMA SEGURA
-- Este script verifica si las columnas ya existen antes de agregarlas
-- ============================================================================

USE asertiva_ruedadeproblemasdb;

-- ============================================================================
-- 1. Registro_ODS
-- ============================================================================

-- Verificar y agregar registro_id
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_ODS' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_ODS ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_ODS" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar tipo
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_ODS' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_ODS ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_ODS" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice si no existe
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_ODS' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_ODS(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_ODS" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 2. Registro_OCDE
-- ============================================================================

-- Verificar y agregar registro_id
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_OCDE' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_OCDE ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_OCDE" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar tipo
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_OCDE' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_OCDE ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_OCDE" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice si no existe
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_OCDE' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_OCDE(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_OCDE" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 3. Registro_Aportes
-- ============================================================================

-- Verificar y agregar registro_id
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Aportes' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Aportes ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_Aportes" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Verificar y agregar tipo
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Aportes' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Aportes ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_Aportes" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar constraint UNIQUE de usuario_id si existe
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Aportes' 
    AND CONSTRAINT_TYPE = 'UNIQUE'
    AND CONSTRAINT_NAME != 'idx_usuario_tipo_registro'
);

SET @sql = IF(@constraint_exists > 0,
    'ALTER TABLE Registro_Aportes DROP INDEX usuario_id',
    'SELECT "No hay constraint UNIQUE en usuario_id de Registro_Aportes" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Crear índice UNIQUE si no existe
SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Aportes' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Aportes(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_Aportes" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 4. Registro_CTI_Vitae
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_CTI_Vitae' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_CTI_Vitae ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_CTI_Vitae" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_CTI_Vitae' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_CTI_Vitae ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_CTI_Vitae" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_CTI_Vitae' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_CTI_Vitae(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_CTI_Vitae" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 5. Registro_Niveles_Tecnologicos
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Niveles_Tecnologicos' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Niveles_Tecnologicos ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_Niveles_Tecnologicos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Niveles_Tecnologicos' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Niveles_Tecnologicos ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_Niveles_Tecnologicos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar constraint UNIQUE de usuario_id si existe
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Niveles_Tecnologicos' 
    AND CONSTRAINT_TYPE = 'UNIQUE'
    AND CONSTRAINT_NAME != 'idx_usuario_tipo_registro'
);

SET @sql = IF(@constraint_exists > 0,
    'ALTER TABLE Registro_Niveles_Tecnologicos DROP INDEX usuario_id',
    'SELECT "No hay constraint UNIQUE en usuario_id de Registro_Niveles_Tecnologicos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Niveles_Tecnologicos' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Niveles_Tecnologicos(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_Niveles_Tecnologicos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 6. Registro_PIU
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_PIU' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_PIU ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_PIU" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_PIU' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_PIU ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_PIU" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Eliminar constraint UNIQUE de usuario_id si existe
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_PIU' 
    AND CONSTRAINT_TYPE = 'UNIQUE'
    AND CONSTRAINT_NAME != 'idx_usuario_tipo_registro'
);

SET @sql = IF(@constraint_exists > 0,
    'ALTER TABLE Registro_PIU DROP INDEX usuario_id',
    'SELECT "No hay constraint UNIQUE en usuario_id de Registro_PIU" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_PIU' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_PIU(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_PIU" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 7. Registro_Keywords
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Keywords' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Keywords ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_Keywords" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Keywords' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Keywords ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_Keywords" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Keywords' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_Keywords(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_Keywords" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 8. Registro_Soluciones
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Soluciones' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Soluciones ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_Soluciones" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Soluciones' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Soluciones ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_Soluciones" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Soluciones' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_Soluciones(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_Soluciones" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- 9. Registro_Archivos
-- ============================================================================

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Archivos' 
    AND COLUMN_NAME = 'registro_id'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Archivos ADD COLUMN registro_id INT AFTER usuario_id',
    'SELECT "Columna registro_id ya existe en Registro_Archivos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Archivos' 
    AND COLUMN_NAME = 'tipo'
);

SET @sql = IF(@column_exists = 0,
    'ALTER TABLE Registro_Archivos ADD COLUMN tipo ENUM(''docente_investigador'', ''grupo_centro_instituto'', ''laboratorio'', ''centro_produccion'') AFTER registro_id',
    'SELECT "Columna tipo ya existe en Registro_Archivos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.STATISTICS 
    WHERE TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_Archivos' 
    AND INDEX_NAME = 'idx_usuario_tipo_registro'
);

SET @sql = IF(@index_exists = 0,
    'CREATE INDEX idx_usuario_tipo_registro ON Registro_Archivos(usuario_id, tipo, registro_id)',
    'SELECT "Índice idx_usuario_tipo_registro ya existe en Registro_Archivos" as mensaje'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- VERIFICACIÓN FINAL
-- ============================================================================

SELECT 'MIGRACIÓN COMPLETADA' as Estado;

-- Verificar estructura de Registro_ODS
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = 'asertiva_ruedadeproblemasdb' 
    AND TABLE_NAME = 'Registro_ODS'
ORDER BY ORDINAL_POSITION;
