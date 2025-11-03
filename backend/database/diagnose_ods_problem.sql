-- ============================================================================
-- DIAGNÓSTICO DEL PROBLEMA DE ODS/METAS
-- ============================================================================

-- IMPORTANTE: Asegúrate de estar en la base de datos correcta
-- Ejecuta primero: USE nombre_de_tu_base_datos;
-- Para verificar: SELECT DATABASE();

-- Verificar que estás en la base de datos correcta
SELECT DATABASE() as base_datos_actual;

-- 1. Verificar estructura de la tabla Registro_ODS
SELECT 
    COLUMN_NAME, 
    DATA_TYPE, 
    IS_NULLABLE, 
    COLUMN_KEY,
    COLUMN_DEFAULT
FROM 
    INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Registro_ODS'
ORDER BY ORDINAL_POSITION;

-- 2. Verificar si existen registros en Registro_ODS
SELECT 
    COUNT(*) as total_registros,
    COUNT(DISTINCT usuario_id) as usuarios_unicos,
    COUNT(DISTINCT objetivo_id) as objetivos_unicos,
    COUNT(meta_id) as registros_con_meta,
    COUNT(*) - COUNT(meta_id) as registros_sin_meta
FROM Registro_ODS;

-- 3. Ver todos los registros ODS actuales
SELECT 
    id,
    usuario_id,
    registro_id,
    tipo,
    objetivo_id,
    meta_id,
    o.nombre as objetivo_nombre,
    m.codigo as meta_codigo,
    m.descripcion as meta_descripcion
FROM Registro_ODS ro
LEFT JOIN objetivos o ON ro.objetivo_id = o.id
LEFT JOIN metas m ON ro.meta_id = m.id
ORDER BY usuario_id, objetivo_id, meta_id;

-- 4. Verificar si hay metas en la base de datos
SELECT 
    COUNT(*) as total_metas,
    COUNT(DISTINCT objetivo_id) as objetivos_con_metas
FROM metas;

-- 5. Ver algunos ejemplos de metas
SELECT 
    m.id as meta_id,
    m.objetivo_id,
    m.codigo,
    LEFT(m.descripcion, 100) as descripcion_preview,
    o.nombre as objetivo_nombre
FROM metas m
JOIN objetivos o ON m.objetivo_id = o.id
LIMIT 10;

-- 6. Verificar registros de hélice interna
SELECT 
    'Docente Investigador' as tipo,
    COUNT(*) as total
FROM Registro_Docente_Investigador
UNION ALL
SELECT 
    'Grupo/Centro/Instituto' as tipo,
    COUNT(*) as total
FROM Registro_Grupo_Centro_Instituto
UNION ALL
SELECT 
    'Laboratorio' as tipo,
    COUNT(*) as total
FROM Registro_Laboratorio
UNION ALL
SELECT 
    'Centro Producción' as tipo,
    COUNT(*) as total
FROM Registro_Centro_Produccion;

-- 7. Verificar si las columnas registro_id y tipo existen en Registro_ODS
SELECT 
    CASE 
        WHEN COUNT(*) > 0 THEN 'SÍ - Migración aplicada'
        ELSE 'NO - Necesita ejecutar migration_add_registro_id.sql'
    END as estado_migracion
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE 
    TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Registro_ODS' 
    AND COLUMN_NAME = 'registro_id';

-- ============================================================================
-- SOLUCIÓN SI NO HAY METAS GUARDADAS:
-- ============================================================================

-- Si los registros ODS no tienen meta_id, verificar:
-- 1. ¿Se ejecutó la migración? (query #7)
-- 2. ¿Hay metas en la tabla metas? (query #4)
-- 3. ¿El frontend está enviando selectedMetas correctamente?
-- 4. ¿El backend está recibiendo y procesando los meta_id?

-- Para ver los logs del backend, revisar la consola cuando se guarda un registro
-- Buscar mensajes como:
-- "Guardando X registros ODS..."
-- "Buscando objetivo_id para meta_id: X"
-- "Encontrado objetivo_id: X para meta_id: Y"
-- "Insertando ODS: objetivo_id=X, meta_id=Y"
