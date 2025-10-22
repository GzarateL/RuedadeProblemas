-- ============================================================================
-- SCRIPT DE CORRECCIÓN: Usuarios Externos sin Participante_ID
-- ============================================================================
-- PROBLEMA: Los usuarios con rol='externo' no tienen registro en 
--           Participantes_Externos, por lo tanto no tienen participante_id
--           y no pueden obtener matches.
--
-- SOLUCIÓN: Este script crea automáticamente los registros faltantes.
-- ============================================================================

-- PASO 1: DIAGNÓSTICO - Ver el problema actual
-- ============================================================================
SELECT '========================================' as '';
SELECT 'PASO 1: DIAGNÓSTICO DEL PROBLEMA' as '';
SELECT '========================================' as '';

SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ SIN PERFIL - NECESITA CORRECCIÓN'
        ELSE '✅ PERFIL CORRECTO'
    END as estado,
    pe.nombres_apellidos,
    pe.organizacion,
    h.nombre as helice
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Helices h ON pe.helice_id = h.helice_id
WHERE u.rol = 'externo'
ORDER BY u.usuario_id;

-- PASO 2: CORRECCIÓN - Crear perfiles para usuarios sin participante_id
-- ============================================================================
SELECT '========================================' as '';
SELECT 'PASO 2: CREANDO PERFILES FALTANTES' as '';
SELECT '========================================' as '';

-- Insertar perfiles para todos los usuarios externos que no tienen uno
INSERT INTO Participantes_Externos (
    usuario_id, 
    helice_id, 
    nombres_apellidos, 
    cargo, 
    organizacion, 
    telefono
)
SELECT 
    u.usuario_id,
    2 as helice_id, -- 2 = Empresas (ajusta según tu configuración)
    CONCAT('Usuario ', SUBSTRING_INDEX(u.email, '@', 1)) as nombres_apellidos,
    'Por completar' as cargo,
    'Por completar' as organizacion,
    NULL as telefono
FROM Usuarios u
WHERE u.rol = 'externo' 
  AND u.usuario_id NOT IN (
      SELECT usuario_id FROM Participantes_Externos
  );

-- Mostrar cuántos registros se crearon
SELECT CONCAT('✅ Se crearon ', ROW_COUNT(), ' perfiles nuevos') as resultado;

-- PASO 3: VERIFICACIÓN - Confirmar que todos tienen perfil ahora
-- ============================================================================
SELECT '========================================' as '';
SELECT 'PASO 3: VERIFICACIÓN POST-CORRECCIÓN' as '';
SELECT '========================================' as '';

SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    pe.nombres_apellidos,
    pe.organizacion,
    h.nombre as helice,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ ERROR: AÚN SIN PERFIL'
        ELSE '✅ CORRECTO'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Helices h ON pe.helice_id = h.helice_id
WHERE u.rol = 'externo'
ORDER BY u.usuario_id;

-- PASO 4: VERIFICAR DESAFÍOS - Asegurar que los desafíos tengan participante_id válido
-- ============================================================================
SELECT '========================================' as '';
SELECT 'PASO 4: VERIFICANDO DESAFÍOS' as '';
SELECT '========================================' as '';

SELECT 
    d.desafio_id,
    d.titulo,
    d.participante_id,
    pe.nombres_apellidos as participante,
    pe.organizacion,
    u.email,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ ERROR: Desafío sin participante válido'
        ELSE '✅ OK'
    END as estado
FROM Desafios d
LEFT JOIN Participantes_Externos pe ON d.participante_id = pe.participante_id
LEFT JOIN Usuarios u ON pe.usuario_id = u.usuario_id
ORDER BY d.desafio_id DESC;

-- PASO 5: RESUMEN FINAL DEL SISTEMA
-- ============================================================================
SELECT '========================================' as '';
SELECT 'PASO 5: RESUMEN DEL SISTEMA' as '';
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
    'Total Desafíos' as tipo,
    COUNT(*) as total,
    COUNT(*) as con_perfil,
    0 as sin_perfil
FROM Desafios

UNION ALL

SELECT 
    'Total Capacidades' as tipo,
    COUNT(*) as total,
    COUNT(*) as con_perfil,
    0 as sin_perfil
FROM Capacidades_UNSA;

-- ============================================================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ============================================================================
SELECT '========================================' as '';
SELECT '📋 INSTRUCCIONES IMPORTANTES' as '';
SELECT '========================================' as '';
SELECT '1. Verifica que todos los usuarios externos tengan estado ✅' as instruccion
UNION ALL
SELECT '2. Los usuarios deben CERRAR SESIÓN y volver a INICIAR SESIÓN' as instruccion
UNION ALL
SELECT '3. Esto regenerará el token JWT con el participante_id correcto' as instruccion
UNION ALL
SELECT '4. Después podrán acceder a sus matches sin error 403' as instruccion
UNION ALL
SELECT '5. Si necesitas actualizar datos, usa el UPDATE al final' as instruccion;

-- ============================================================================
-- OPCIONAL: Actualizar datos de perfiles creados automáticamente
-- ============================================================================
-- Descomenta y modifica según necesites:

/*
-- Ejemplo: Actualizar un usuario específico
UPDATE Participantes_Externos 
SET 
    nombres_apellidos = 'Juan Pérez',
    organizacion = 'Empresa XYZ',
    cargo = 'Gerente de Innovación',
    helice_id = 2,  -- 1=Academia, 2=Empresas, 3=Gobierno, 4=Sociedad
    telefono = '999888777'
WHERE usuario_id = 14;  -- Reemplaza con el usuario_id correcto
*/

/*
-- Ejemplo: Actualizar todos los usuarios de una vez (si tienes los datos)
UPDATE Participantes_Externos pe
JOIN Usuarios u ON pe.usuario_id = u.usuario_id
SET 
    pe.nombres_apellidos = 'Nombre a completar',
    pe.organizacion = 'Organización a completar'
WHERE u.rol = 'externo' 
  AND pe.nombres_apellidos LIKE 'Usuario %';
*/

-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
SELECT '========================================' as '';
SELECT '✅ SCRIPT COMPLETADO' as '';
SELECT '========================================' as '';
