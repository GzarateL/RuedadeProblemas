-- ============================================================================
-- FIX: Eliminar restricciones UNIQUE en usuario_id que impiden múltiples registros
-- ============================================================================

-- Verificar restricciones actuales
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME IN (
    'Registro_Aportes',
    'Registro_Niveles_Tecnologicos',
    'Registro_PIU'
)
AND CONSTRAINT_TYPE = 'UNIQUE';

-- ============================================================================
-- Registro_Aportes
-- ============================================================================

-- Verificar si existe UNIQUE en usuario_id
SELECT CONSTRAINT_NAME 
FROM information_schema.TABLE_CONSTRAINTS 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'Registro_Aportes' 
AND CONSTRAINT_TYPE = 'UNIQUE'
AND CONSTRAINT_NAME = 'usuario_id';

-- Si existe, eliminarlo (solo si no es FK)
-- Primero verificar si es FK
SELECT CONSTRAINT_NAME, CONSTRAINT_TYPE
FROM information_schema.TABLE_CONSTRAINTS
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME = 'Registro_Aportes'
AND CONSTRAINT_NAME = 'usuario_id';

-- Si es solo UNIQUE (no FK), eliminar
ALTER TABLE Registro_Aportes DROP INDEX usuario_id;

-- Verificar que el índice compuesto existe
SHOW INDEX FROM Registro_Aportes WHERE Key_name = 'idx_usuario_tipo_registro';

-- Si no existe, crearlo
-- CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Aportes(usuario_id, tipo, registro_id);

-- ============================================================================
-- Registro_Niveles_Tecnologicos
-- ============================================================================

-- Eliminar UNIQUE en usuario_id si existe
ALTER TABLE Registro_Niveles_Tecnologicos DROP INDEX usuario_id;

-- Verificar índice compuesto
SHOW INDEX FROM Registro_Niveles_Tecnologicos WHERE Key_name = 'idx_usuario_tipo_registro';

-- ============================================================================
-- Registro_PIU
-- ============================================================================

-- Eliminar UNIQUE en usuario_id si existe
ALTER TABLE Registro_PIU DROP INDEX usuario_id;

-- Verificar índice compuesto
SHOW INDEX FROM Registro_PIU WHERE Key_name = 'idx_usuario_tipo_registro';

-- ============================================================================
-- Verificación Final
-- ============================================================================

-- Mostrar todos los índices de las tablas problemáticas
SHOW INDEX FROM Registro_Aportes;
SHOW INDEX FROM Registro_Niveles_Tecnologicos;
SHOW INDEX FROM Registro_PIU;

-- ============================================================================
-- NOTA: Si algún DROP INDEX falla porque es FK, significa que el índice
--       es necesario para la foreign key y debe mantenerse.
--       En ese caso, el índice compuesto idx_usuario_tipo_registro
--       será suficiente para permitir múltiples registros.
-- ============================================================================
