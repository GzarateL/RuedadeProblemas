-- ============================================================================
-- SCRIPT DE VERIFICACIÓN (SOLO LECTURA - NO MODIFICA NADA)
-- ============================================================================
-- Este script solo CONSULTA la base de datos para identificar problemas
-- NO realiza ninguna modificación
-- ============================================================================

-- VERIFICACIÓN 1: Usuarios externos sin perfil
-- ============================================================================
SELECT '========================================' as '';
SELECT '🔍 USUARIOS EXTERNOS SIN PERFIL' as '';
SELECT '========================================' as '';

SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ SIN PERFIL (se creará automáticamente al hacer login)'
        ELSE '✅ PERFIL OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo'
ORDER BY u.usuario_id;

-- VERIFICACIÓN 2: Usuarios UNSA sin perfil
-- ============================================================================
SELECT '========================================' as '';
SELECT '🔍 USUARIOS UNSA SIN PERFIL' as '';
SELECT '========================================' as '';

SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    iu.investigador_id,
    CASE 
        WHEN iu.investigador_id IS NULL THEN '❌ SIN PERFIL (se creará automáticamente al hacer login)'
        ELSE '✅ PERFIL OK'
    END as estado
FROM Usuarios u
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
WHERE u.rol = 'unsa'
ORDER BY u.usuario_id;

-- VERIFICACIÓN 3: Desafíos huérfanos (sin participante válido)
-- ============================================================================
SELECT '========================================' as '';
SELECT '🔍 DESAFÍOS SIN PARTICIPANTE VÁLIDO' as '';
SELECT '========================================' as '';

SELECT 
    d.desafio_id,
    d.titulo,
    d.participante_id,
    pe.nombres_apellidos as participante,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ PARTICIPANTE NO EXISTE'
        ELSE '✅ OK'
    END as estado
FROM Desafios d
LEFT JOIN Participantes_Externos pe ON d.participante_id = pe.participante_id
ORDER BY d.desafio_id DESC;

-- VERIFICACIÓN 4: Capacidades huérfanas (sin investigador válido)
-- ============================================================================
SELECT '========================================' as '';
SELECT '🔍 CAPACIDADES SIN INVESTIGADOR VÁLIDO' as '';
SELECT '========================================' as '';

SELECT 
    c.capacidad_id,
    SUBSTRING(c.descripcion_capacidad, 1, 50) as descripcion,
    c.investigador_id,
    iu.nombres_apellidos as investigador,
    CASE 
        WHEN iu.investigador_id IS NULL THEN '❌ INVESTIGADOR NO EXISTE'
        ELSE '✅ OK'
    END as estado
FROM Capacidades_UNSA c
LEFT JOIN Investigadores_UNSA iu ON c.investigador_id = iu.investigador_id
ORDER BY c.capacidad_id DESC;

-- VERIFICACIÓN 5: Resumen general del sistema
-- ============================================================================
SELECT '========================================' as '';
SELECT '📊 RESUMEN GENERAL' as '';
SELECT '========================================' as '';

SELECT 
    'Usuarios Externos' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN pe.participante_id IS NOT NULL THEN 1 ELSE 0 END) as con_perfil,
    SUM(CASE WHEN pe.participante_id IS NULL THEN 1 ELSE 0 END) as sin_perfil
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo'

UNION ALL

SELECT 
    'Usuarios UNSA' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN iu.investigador_id IS NOT NULL THEN 1 ELSE 0 END) as con_perfil,
    SUM(CASE WHEN iu.investigador_id IS NULL THEN 1 ELSE 0 END) as sin_perfil
FROM Usuarios u
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
WHERE u.rol = 'unsa'

UNION ALL

SELECT 
    'Administradores' as tipo,
    COUNT(*) as total,
    COUNT(*) as con_perfil,
    0 as sin_perfil
FROM Usuarios
WHERE rol = 'admin'

UNION ALL

SELECT 
    'Total Desafíos' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN pe.participante_id IS NOT NULL THEN 1 ELSE 0 END) as con_perfil,
    SUM(CASE WHEN pe.participante_id IS NULL THEN 1 ELSE 0 END) as sin_perfil
FROM Desafios d
LEFT JOIN Participantes_Externos pe ON d.participante_id = pe.participante_id

UNION ALL

SELECT 
    'Total Capacidades' as tipo,
    COUNT(*) as total,
    SUM(CASE WHEN iu.investigador_id IS NOT NULL THEN 1 ELSE 0 END) as con_perfil,
    SUM(CASE WHEN iu.investigador_id IS NULL THEN 1 ELSE 0 END) as sin_perfil
FROM Capacidades_UNSA c
LEFT JOIN Investigadores_UNSA iu ON c.investigador_id = iu.investigador_id;

-- ============================================================================
SELECT '========================================' as '';
SELECT '✅ VERIFICACIÓN COMPLETADA' as '';
SELECT '========================================' as '';
SELECT '' as '';
SELECT '📝 NOTAS IMPORTANTES:' as '';
SELECT '- Los perfiles faltantes se crearán AUTOMÁTICAMENTE al hacer login' as nota
UNION ALL
SELECT '- NO necesitas ejecutar ningún script de corrección manual' as nota
UNION ALL
SELECT '- El sistema ahora se auto-repara cuando detecta perfiles faltantes' as nota
UNION ALL
SELECT '- Los usuarios solo necesitan cerrar sesión y volver a iniciar sesión' as nota;
-- ============================================================================
