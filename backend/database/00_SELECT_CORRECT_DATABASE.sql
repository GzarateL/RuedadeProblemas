-- ============================================================================
-- PASO 1: IDENTIFICAR Y SELECCIONAR LA BASE DE DATOS CORRECTA
-- ============================================================================

-- 1. Listar todas las bases de datos disponibles (excepto las del sistema)
SELECT 
    SCHEMA_NAME as nombre_base_datos,
    DEFAULT_CHARACTER_SET_NAME as charset,
    DEFAULT_COLLATION_NAME as collation
FROM 
    INFORMATION_SCHEMA.SCHEMATA
WHERE 
    SCHEMA_NAME NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
ORDER BY 
    SCHEMA_NAME;

-- ============================================================================
-- PASO 2: SELECCIONAR TU BASE DE DATOS
-- ============================================================================
-- Busca en la lista anterior el nombre de tu base de datos
-- Probablemente sea algo como:
-- - asertiva_ruedadeproblemasdb
-- - rueda_problemas
-- - ruedadeproblemas
-- - etc.

-- Descomenta y ejecuta UNA de estas líneas con el nombre correcto:
-- USE asertiva_ruedadeproblemasdb;
-- USE rueda_problemas;
-- USE ruedadeproblemas;

-- ============================================================================
-- PASO 3: VERIFICAR QUE ESTÁS EN LA BASE DE DATOS CORRECTA
-- ============================================================================
-- Después de ejecutar USE, verifica con:
SELECT DATABASE() as base_datos_actual;

-- ============================================================================
-- PASO 4: LISTAR LAS TABLAS DE TU APLICACIÓN
-- ============================================================================
-- Una vez que estés en la base de datos correcta, ejecuta:
SHOW TABLES;

-- Deberías ver tablas como:
-- - Usuarios
-- - Registro_Docente_Investigador
-- - Registro_Grupo_Centro_Instituto
-- - objetivos
-- - metas
-- - etc.

-- ============================================================================
-- INSTRUCCIONES:
-- ============================================================================
-- 1. Ejecuta la primera consulta para ver todas tus bases de datos
-- 2. Identifica el nombre de tu base de datos de la aplicación
-- 3. Descomenta la línea USE con el nombre correcto
-- 4. Ejecuta las consultas de verificación
-- 5. Luego ejecuta los otros scripts SQL en esta base de datos
-- ============================================================================
