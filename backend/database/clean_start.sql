-- ============================================================================
-- LIMPIEZA COMPLETA - Empezar de Cero
-- ============================================================================
-- ADVERTENCIA: Esto eliminará TODOS los registros de hélice interna
-- Solo ejecutar si estás seguro y son datos de prueba
-- ============================================================================

-- Deshabilitar verificación de foreign keys temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar tablas compartidas
TRUNCATE TABLE Registro_OCDE;
TRUNCATE TABLE Registro_ODS;
TRUNCATE TABLE Registro_Aportes;
TRUNCATE TABLE Registro_CTI_Vitae;
TRUNCATE TABLE Registro_Niveles_Tecnologicos;
TRUNCATE TABLE Registro_PIU;
TRUNCATE TABLE Registro_Keywords;
TRUNCATE TABLE Registro_Soluciones;
TRUNCATE TABLE Registro_Archivos;

-- Limpiar tablas de registros principales
TRUNCATE TABLE Registro_Docente_Investigador;
TRUNCATE TABLE Registro_Grupo_Centro_Instituto;
TRUNCATE TABLE Registro_Laboratorio;
TRUNCATE TABLE Registro_Centro_Produccion;

-- Reactivar verificación de foreign keys
SET FOREIGN_KEY_CHECKS = 1;

-- Verificar que todo está limpio
SELECT 'Registro_OCDE' as tabla, COUNT(*) as registros FROM Registro_OCDE
UNION ALL
SELECT 'Registro_ODS', COUNT(*) FROM Registro_ODS
UNION ALL
SELECT 'Registro_Aportes', COUNT(*) FROM Registro_Aportes
UNION ALL
SELECT 'Registro_Docente_Investigador', COUNT(*) FROM Registro_Docente_Investigador
UNION ALL
SELECT 'Registro_Grupo_Centro_Instituto', COUNT(*) FROM Registro_Grupo_Centro_Instituto
UNION ALL
SELECT 'Registro_Laboratorio', COUNT(*) FROM Registro_Laboratorio
UNION ALL
SELECT 'Registro_Centro_Produccion', COUNT(*) FROM Registro_Centro_Produccion;

SELECT 'Base de datos limpiada exitosamente. Todos los registros deben mostrar 0.' as Resultado;
