-- ============================================================================
-- MIGRACIÓN: Agregar registro_id y tipo a tablas compartidas
-- Problema: Un usuario puede tener múltiples registros (docente, grupo, lab, etc.)
--           y los datos se sobrescriben porque solo usan usuario_id
-- Solución: Agregar registro_id y tipo para diferenciar registros
-- ============================================================================

-- 1. Registro_OCDE
ALTER TABLE Registro_OCDE 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_OCDE(usuario_id, tipo, registro_id);

-- 2. Registro_ODS
ALTER TABLE Registro_ODS 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_ODS(usuario_id, tipo, registro_id);

-- 3. Registro_Aportes
ALTER TABLE Registro_Aportes 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice UNIQUE compuesto (mantener el índice usuario_id por la FK)
CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Aportes(usuario_id, tipo, registro_id);

-- 4. Registro_CTI_Vitae
ALTER TABLE Registro_CTI_Vitae 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_CTI_Vitae(usuario_id, tipo, registro_id);

-- 5. Registro_Niveles_Tecnologicos
ALTER TABLE Registro_Niveles_Tecnologicos 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice UNIQUE compuesto (mantener el índice usuario_id por la FK)
CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_Niveles_Tecnologicos(usuario_id, tipo, registro_id);

-- 6. Registro_PIU
ALTER TABLE Registro_PIU 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice UNIQUE compuesto (mantener el índice usuario_id por la FK)
CREATE UNIQUE INDEX idx_usuario_tipo_registro ON Registro_PIU(usuario_id, tipo, registro_id);

-- 7. Registro_Keywords
ALTER TABLE Registro_Keywords 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_Keywords(usuario_id, tipo, registro_id);

-- 8. Registro_Soluciones
ALTER TABLE Registro_Soluciones 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_Soluciones(usuario_id, tipo, registro_id);

-- 9. Registro_Archivos
ALTER TABLE Registro_Archivos 
ADD COLUMN registro_id INT AFTER usuario_id,
ADD COLUMN tipo ENUM('docente_investigador', 'grupo_centro_instituto', 'laboratorio', 'centro_produccion') AFTER registro_id;

-- Crear nuevo índice compuesto (el índice idx_usuario se mantiene por la FK)
CREATE INDEX idx_usuario_tipo_registro ON Registro_Archivos(usuario_id, tipo, registro_id);

-- ============================================================================
-- NOTA: Después de ejecutar esta migración, actualizar el código del backend
--       para incluir registro_id y tipo en todas las operaciones
-- ============================================================================
