-- Script para verificar y corregir usuarios sin perfil asociado
-- Ejecuta esto en phpMyAdmin

-- 1. VERIFICAR usuarios sin perfil
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    iu.investigador_id,
    CASE 
        WHEN u.rol = 'externo' AND pe.participante_id IS NULL THEN '❌ FALTA PERFIL EXTERNO'
        WHEN u.rol = 'unsa' AND iu.investigador_id IS NULL THEN '❌ FALTA PERFIL UNSA'
        WHEN u.rol = 'admin' THEN '✅ ADMIN (no necesita perfil)'
        ELSE '✅ PERFIL OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
ORDER BY u.usuario_id;

-- 2. Si encuentras usuarios externos sin perfil, créalos así:
-- (Reemplaza los valores según corresponda)

/*
-- Ejemplo para usuario externo sin perfil:
INSERT INTO Participantes_Externos (
    usuario_id, 
    helice_id, 
    nombres_apellidos, 
    cargo, 
    organizacion, 
    telefono
)
SELECT 
    usuario_id,
    2, -- ID de hélice (1=Talento, 2=Empresarial, 3=Desarrollo, 4=Gestión, 5=Sociedad)
    email, -- Usa el email temporalmente como nombre
    'Sin especificar',
    'Sin especificar',
    NULL
FROM Usuarios
WHERE rol = 'externo' 
  AND usuario_id NOT IN (SELECT usuario_id FROM Participantes_Externos);
*/

-- 3. Si encuentras usuarios UNSA sin perfil, créalos así:

/*
-- Ejemplo para usuario UNSA sin perfil:
INSERT INTO Investigadores_UNSA (
    usuario_id, 
    nombres_apellidos, 
    cargo, 
    telefono, 
    unidad_academica
)
SELECT 
    usuario_id,
    email, -- Usa el email temporalmente como nombre
    'Sin especificar',
    NULL,
    'Sin especificar'
FROM Usuarios
WHERE rol = 'unsa' 
  AND usuario_id NOT IN (SELECT usuario_id FROM Investigadores_UNSA);
*/

-- 4. VERIFICAR NUEVAMENTE después de crear los perfiles
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    iu.investigador_id,
    CASE 
        WHEN u.rol = 'externo' AND pe.participante_id IS NULL THEN '❌ FALTA PERFIL'
        WHEN u.rol = 'unsa' AND iu.investigador_id IS NULL THEN '❌ FALTA PERFIL'
        ELSE '✅ OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
ORDER BY u.usuario_id;
