-- ============================================================================
-- Eliminar restricciones UNIQUE en usuario_id
-- Estas restricciones impiden que un usuario tenga múltiples registros
-- ============================================================================

-- IMPORTANTE: Ejecutar cada comando por separado
-- Si alguno falla, continuar con el siguiente

-- 1. Registro_Aportes
-- Primero verificar si existe el índice
-- SELECT * FROM information_schema.STATISTICS WHERE TABLE_NAME = 'Registro_Aportes' AND INDEX_NAME = 'usuario_id';

-- Eliminar índice UNIQUE en usuario_id (puede fallar si es FK, está bien)
-- ALTER TABLE Registro_Aportes DROP INDEX usuario_id;

-- Crear índice compuesto UNIQUE (solo si no existe)
-- Primero verificar: SELECT * FROM information_schema.STATISTICS WHERE TABLE_NAME = 'Registro_Aportes' AND INDEX_NAME = 'idx_usuario_tipo_registro';
-- Si no existe, ejecutar:
-- CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Aportes(usuario_id, tipo, registro_id);

-- 2. Registro_Niveles_Tecnologicos
-- ALTER TABLE Registro_Niveles_Tecnologicos DROP INDEX usuario_id;
-- CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Niveles_Tecnologicos(usuario_id, tipo, registro_id);

-- 3. Registro_PIU
-- ALTER TABLE Registro_PIU DROP INDEX usuario_id;
-- CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_PIU(usuario_id, tipo, registro_id);

-- ============================================================================
-- SOLUCIÓN ALTERNATIVA: Usar IGNORE en INSERT
-- ============================================================================
-- Si no puedes eliminar los índices UNIQUE, modifica el código del backend
-- para usar INSERT IGNORE o ON DUPLICATE KEY UPDATE

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- Ver todos los índices de Registro_Aportes
SHOW INDEX FROM Registro_Aportes;

-- Ver todos los índices de Registro_Niveles_Tecnologicos
SHOW INDEX FROM Registro_Niveles_Tecnologicos;

-- Ver todos los índices de Registro_PIU
SHOW INDEX FROM Registro_PIU;
