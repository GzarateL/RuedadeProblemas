-- Script para verificar y corregir usuarios externos sin participante_id
-- Ejecuta esto en phpMyAdmin

-- 1. VERIFICAR qué usuarios externos NO tienen participante_id
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ FALTA PERFIL - NECESITA CORRECCIÓN'
        ELSE '✅ PERFIL OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo'
ORDER BY u.usuario_id;

-- 2. CREAR perfiles para usuarios externos que no los tienen
-- IMPORTANTE: Ejecuta esto SOLO si la consulta anterior mostró usuarios sin perfil

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
    2, -- Hélice Empresarial por defecto (puedes cambiar: 1=Talento, 2=Empresarial, 3=Desarrollo, 4=Gestión, 5=Sociedad)
    CONCAT('Usuario ', u.email), -- Nombre temporal basado en email
    'Sin especificar',
    'Sin especificar',
    NULL
FROM Usuarios u
WHERE u.rol = 'externo' 
  AND u.usuario_id NOT IN (SELECT usuario_id FROM Participantes_Externos);

-- 3. VERIFICAR NUEVAMENTE que todos los usuarios externos tengan perfil
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    pe.nombres_apellidos,
    pe.organizacion,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ FALTA PERFIL'
        ELSE '✅ PERFIL OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo'
ORDER BY u.usuario_id;

-- 4. Si quieres actualizar los datos del perfil creado automáticamente:
/*
UPDATE Participantes_Externos 
SET 
    nombres_apellidos = 'Nombre Real',
    organizacion = 'Organización Real',
    helice_id = 2,  -- Cambia según corresponda
    cargo = 'Cargo Real'
WHERE usuario_id = X;  -- Reemplaza X con el usuario_id correspondiente
*/
