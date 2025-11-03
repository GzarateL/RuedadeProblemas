-- ============================================================================
-- SCRIPT COMPLETO: Limpiar y Corregir Base de Datos
-- ============================================================================

-- PASO 1: Limpiar datos huérfanos y duplicados
-- ============================================================================

-- Eliminar registros en tablas compartidas que no tienen registro_id o tipo
DELETE FROM Registro_OCDE WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_ODS WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_Aportes WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_CTI_Vitae WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_Niveles_Tecnologicos WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_PIU WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_Keywords WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_Soluciones WHERE registro_id IS NULL OR tipo IS NULL;
DELETE FROM Registro_Archivos WHERE registro_id IS NULL OR tipo IS NULL;

-- PASO 2: Verificar duplicados en catálogos ODS
-- ============================================================================

-- Ver si hay IDs duplicados en metas
SELECT meta_id, COUNT(*) as count 
FROM Registro_ODS 
WHERE meta_id IS NOT NULL 
GROUP BY meta_id 
HAVING count > 1;

-- Ver si hay IDs duplicados en objetivos
SELECT objetivo_id, COUNT(*) as count 
FROM Registro_ODS 
GROUP BY objetivo_id 
HAVING count > 1;

-- PASO 3: Eliminar restricciones UNIQUE problemáticas
-- ============================================================================

-- Intentar eliminar UNIQUE en usuario_id de Registro_Aportes
-- Si falla, continuar (puede ser FK)
SET @sql = 'ALTER TABLE Registro_Aportes DROP INDEX usuario_id';
PREPARE stmt FROM @sql;
-- EXECUTE stmt; -- Descomentar para ejecutar
DEALLOCATE PREPARE stmt;

-- Intentar eliminar UNIQUE en usuario_id de Registro_Niveles_Tecnologicos
SET @sql = 'ALTER TABLE Registro_Niveles_Tecnologicos DROP INDEX usuario_id';
PREPARE stmt FROM @sql;
-- EXECUTE stmt; -- Descomentar para ejecutar
DEALLOCATE PREPARE stmt;

-- Intentar eliminar UNIQUE en usuario_id de Registro_PIU
SET @sql = 'ALTER TABLE Registro_PIU DROP INDEX usuario_id';
PREPARE stmt FROM @sql;
-- EXECUTE stmt; -- Descomentar para ejecutar
DEALLOCATE PREPARE stmt;

-- PASO 4: Verificar estructura de tablas
-- ============================================================================

-- Ver estructura de Registro_OCDE
DESCRIBE Registro_OCDE;

-- Ver estructura de Registro_ODS
DESCRIBE Registro_ODS;

-- Ver estructura de Registro_Aportes
DESCRIBE Registro_Aportes;

-- PASO 5: Ver índices actuales
-- ============================================================================

SHOW INDEX FROM Registro_OCDE;
SHOW INDEX FROM Registro_ODS;
SHOW INDEX FROM Registro_Aportes;
SHOW INDEX FROM Registro_Niveles_Tecnologicos;
SHOW INDEX FROM Registro_PIU;

-- PASO 6: Verificar datos actuales
-- ============================================================================

-- Ver registros con datos compartidos
SELECT 
    'Docente' as tipo,
    COUNT(*) as total_registros,
    (SELECT COUNT(*) FROM Registro_OCDE WHERE tipo = 'docente_investigador') as total_ocde,
    (SELECT COUNT(*) FROM Registro_ODS WHERE tipo = 'docente_investigador') as total_ods
FROM Registro_Docente_Investigador
UNION ALL
SELECT 
    'Grupo' as tipo,
    COUNT(*) as total_registros,
    (SELECT COUNT(*) FROM Registro_OCDE WHERE tipo = 'grupo_centro_instituto') as total_ocde,
    (SELECT COUNT(*) FROM Registro_ODS WHERE tipo = 'grupo_centro_instituto') as total_ods
FROM Registro_Grupo_Centro_Instituto
UNION ALL
SELECT 
    'Laboratorio' as tipo,
    COUNT(*) as total_registros,
    (SELECT COUNT(*) FROM Registro_OCDE WHERE tipo = 'laboratorio') as total_ocde,
    (SELECT COUNT(*) FROM Registro_ODS WHERE tipo = 'laboratorio') as total_ods
FROM Registro_Laboratorio;

-- PASO 7: OPCIÓN NUCLEAR - Limpiar todo y empezar de cero
-- ============================================================================
-- SOLO EJECUTAR SI QUIERES ELIMINAR TODOS LOS REGISTROS

-- TRUNCATE TABLE Registro_OCDE;
-- TRUNCATE TABLE Registro_ODS;
-- TRUNCATE TABLE Registro_Aportes;
-- TRUNCATE TABLE Registro_CTI_Vitae;
-- TRUNCATE TABLE Registro_Niveles_Tecnologicos;
-- TRUNCATE TABLE Registro_PIU;
-- TRUNCATE TABLE Registro_Keywords;
-- TRUNCATE TABLE Registro_Soluciones;
-- TRUNCATE TABLE Registro_Archivos;

-- DELETE FROM Registro_Docente_Investigador;
-- DELETE FROM Registro_Grupo_Centro_Instituto;
-- DELETE FROM Registro_Laboratorio;
-- DELETE FROM Registro_Centro_Produccion;

-- ============================================================================
-- INSTRUCCIONES DE USO
-- ============================================================================

/*
1. Ejecutar PASO 1 para limpiar datos huérfanos
2. Ejecutar PASO 2 para ver duplicados
3. Ejecutar PASO 4-6 para verificar estructura
4. Si hay muchos problemas, considerar PASO 7 (opción nuclear)
5. Después de limpiar, crear nuevos registros desde la UI

RECOMENDACIÓN:
- Si tienes pocos registros de prueba, usa PASO 7 (opción nuclear)
- Si tienes datos importantes, usa PASO 1 y corrige manualmente
*/
