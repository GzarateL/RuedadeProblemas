-- ============================================================================
-- VERIFICAR DATOS DE ODS Y METAS EN LA BASE DE DATOS
-- ============================================================================

-- Seleccionar la base de datos correcta
USE asertiva_ruedadeproblemasdb;

-- 1. Verificar estructura de la tabla Registro_ODS
SELECT 'Estructura de la tabla Registro_ODS:' as info;
DESCRIBE Registro_ODS;

-- 2. Ver todos los registros de ODS con sus objetivos y metas
SELECT 
    'Registros de ODS actuales:' as info,
    COUNT(*) as total_registros
FROM Registro_ODS;

-- 3. Ver detalle de los registros ODS con nombres de objetivos y metas
SELECT 
    r.id,
    r.usuario_id,
    r.registro_id,
    r.tipo,
    r.objetivo_id,
    o.nombre as objetivo_nombre,
    r.meta_id,
    m.codigo as meta_codigo,
    m.descripcion as meta_descripcion
FROM Registro_ODS r
LEFT JOIN objetivos o ON r.objetivo_id = o.id
LEFT JOIN metas m ON r.meta_id = m.id
ORDER BY r.usuario_id, r.registro_id, r.objetivo_id, r.meta_id;

-- 4. Contar registros por tipo
SELECT 
    'Registros por tipo:' as info,
    tipo,
    COUNT(*) as cantidad
FROM Registro_ODS
GROUP BY tipo;

-- 5. Contar registros con y sin metas
SELECT 
    'Registros con/sin metas:' as info,
    CASE 
        WHEN meta_id IS NULL THEN 'Solo Objetivo'
        ELSE 'Objetivo + Meta'
    END as tipo_registro,
    COUNT(*) as cantidad
FROM Registro_ODS
GROUP BY CASE 
    WHEN meta_id IS NULL THEN 'Solo Objetivo'
    ELSE 'Objetivo + Meta'
END;

-- 6. Ver últimos 10 registros insertados
SELECT 
    'Últimos 10 registros ODS:' as info;
    
SELECT 
    r.id,
    r.usuario_id,
    r.registro_id,
    r.tipo,
    o.nombre as objetivo,
    m.codigo as meta_codigo
FROM Registro_ODS r
LEFT JOIN objetivos o ON r.objetivo_id = o.id
LEFT JOIN metas m ON r.meta_id = m.id
ORDER BY r.id DESC
LIMIT 10;
