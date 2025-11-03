-- Verificar que las metas existen en la base de datos
USE asertiva_ruedadeproblemasdb;

-- Ver las metas que el usuario está intentando guardar (según los logs)
SELECT 
    'Verificando metas 61, 70, 62, 63:' as info;

SELECT 
    m.id,
    m.objetivo_id,
    m.codigo,
    m.descripcion,
    o.nombre as objetivo_nombre
FROM metas m
LEFT JOIN objetivos o ON m.objetivo_id = o.id
WHERE m.id IN (61, 70, 62, 63)
ORDER BY m.id;

-- Ver todas las metas del objetivo 8
SELECT 
    'Metas del objetivo 8:' as info;

SELECT 
    m.id,
    m.codigo,
    m.descripcion
FROM metas m
WHERE m.objetivo_id = 8
ORDER BY m.id;

-- Ver todas las metas del objetivo 17
SELECT 
    'Metas del objetivo 17:' as info;

SELECT 
    m.id,
    m.codigo,
    m.descripcion
FROM metas m
WHERE m.objetivo_id = 17
ORDER BY m.id;

-- Contar total de metas por objetivo
SELECT 
    'Total de metas por objetivo:' as info;

SELECT 
    o.id as objetivo_id,
    o.nombre as objetivo_nombre,
    COUNT(m.id) as total_metas
FROM objetivos o
LEFT JOIN metas m ON o.id = m.objetivo_id
GROUP BY o.id, o.nombre
ORDER BY o.id;
