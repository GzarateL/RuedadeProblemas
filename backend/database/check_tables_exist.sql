-- ============================================================================
-- VERIFICAR QUÉ TABLAS EXISTEN EN LA BASE DE DATOS
-- ============================================================================

-- 1. Listar todas las tablas en la base de datos actual
SHOW TABLES;

-- 2. Verificar específicamente las tablas de registro de hélice interna
SELECT 
    TABLE_NAME,
    TABLE_TYPE,
    ENGINE,
    TABLE_ROWS,
    CREATE_TIME
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN (
        'Registro_Docente_Investigador',
        'Registro_Grupo_Centro_Instituto',
        'Registro_Laboratorio',
        'Registro_Centro_Produccion',
        'Registro_OCDE',
        'Registro_ODS',
        'Registro_Aportes',
        'Registro_CTI_Vitae',
        'Registro_Niveles_Tecnologicos',
        'Registro_PIU',
        'Registro_Keywords',
        'Registro_Soluciones',
        'Registro_Archivos'
    )
ORDER BY TABLE_NAME;

-- 3. Verificar tablas relacionadas con ODS
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME IN ('objetivos', 'metas')
ORDER BY TABLE_NAME;

-- 4. Si las tablas no existen, necesitas ejecutar database_general.sql
-- Verifica si al menos existe la tabla Usuarios
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'Base de datos inicializada'
        ELSE 'Base de datos NO inicializada - ejecutar database_general.sql'
    END as estado
FROM 
    INFORMATION_SCHEMA.TABLES 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Usuarios';
