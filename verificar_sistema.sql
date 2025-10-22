-- Script de verificación del sistema de matching
-- Ejecuta esto en phpMyAdmin para verificar que todo esté correcto

-- 1. Verificar que la tabla estado_matching existe
SELECT 'Verificando tabla estado_matching...' as paso;
SELECT * FROM estado_matching;

-- 2. Verificar usuarios con sus roles
SELECT 'Verificando usuarios...' as paso;
SELECT u.usuario_id, u.email, u.rol,
       COALESCE(pe.nombres_apellidos, iu.nombres_apellidos) as nombre
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
ORDER BY u.rol, u.usuario_id;

-- 3. Verificar desafíos con palabras clave
SELECT 'Verificando desafíos con palabras clave...' as paso;
SELECT 
    d.desafio_id,
    d.titulo,
    p.nombres_apellidos as participante,
    GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') as palabras_clave,
    COUNT(DISTINCT pc.palabra_clave_id) as total_palabras
FROM Desafios d
LEFT JOIN Participantes_Externos p ON d.participante_id = p.participante_id
LEFT JOIN Desafios_PalabrasClave dpc ON d.desafio_id = dpc.desafio_id
LEFT JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
GROUP BY d.desafio_id
ORDER BY d.desafio_id DESC
LIMIT 10;

-- 4. Verificar capacidades con palabras clave
SELECT 'Verificando capacidades con palabras clave...' as paso;
SELECT 
    c.capacidad_id,
    SUBSTRING(c.descripcion_capacidad, 1, 50) as descripcion,
    i.nombres_apellidos as investigador,
    GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') as palabras_clave,
    COUNT(DISTINCT pc.palabra_clave_id) as total_palabras
FROM Capacidades_UNSA c
LEFT JOIN Investigadores_UNSA i ON c.investigador_id = i.investigador_id
LEFT JOIN Capacidades_PalabrasClave cpc ON c.capacidad_id = cpc.capacidad_id
LEFT JOIN PalabrasClave pc ON cpc.palabra_clave_id = pc.palabra_clave_id
GROUP BY c.capacidad_id
ORDER BY c.capacidad_id DESC
LIMIT 10;

-- 5. Verificar posibles matches (ejemplo)
SELECT 'Verificando posibles matches entre desafíos y capacidades...' as paso;
SELECT 
    d.desafio_id,
    d.titulo as desafio,
    c.capacidad_id,
    SUBSTRING(c.descripcion_capacidad, 1, 40) as capacidad,
    COUNT(DISTINCT pc.palabra_clave_id) as coincidencias,
    GROUP_CONCAT(DISTINCT pc.palabra ORDER BY pc.palabra SEPARATOR ', ') as palabras_coincidentes
FROM Desafios d
JOIN Desafios_PalabrasClave dpc ON d.desafio_id = dpc.desafio_id
JOIN Capacidades_PalabrasClave cpc ON dpc.palabra_clave_id = cpc.palabra_clave_id
JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
JOIN Capacidades_UNSA c ON cpc.capacidad_id = c.capacidad_id
GROUP BY d.desafio_id, c.capacidad_id
HAVING coincidencias > 0
ORDER BY coincidencias DESC
LIMIT 20;

-- 6. Resumen del sistema
SELECT 'Resumen del sistema...' as paso;
SELECT 
    (SELECT COUNT(*) FROM Usuarios WHERE rol = 'admin') as total_admins,
    (SELECT COUNT(*) FROM Usuarios WHERE rol = 'externo') as total_externos,
    (SELECT COUNT(*) FROM Usuarios WHERE rol = 'unsa') as total_unsa,
    (SELECT COUNT(*) FROM Desafios) as total_desafios,
    (SELECT COUNT(*) FROM Capacidades_UNSA) as total_capacidades,
    (SELECT COUNT(*) FROM PalabrasClave) as total_palabras_clave,
    (SELECT activo FROM estado_matching WHERE id = 1) as matching_activo;
