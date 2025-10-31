-- Script para verificar y corregir la base de datos
-- Ejecutar después de update_calendar_and_forms.sql

USE RuedaDeProblemasDB;

-- Verificar que las tablas nuevas existen
SHOW TABLES LIKE 'Participantes_Academia';
SHOW TABLES LIKE 'Participantes_Gobierno';
SHOW TABLES LIKE 'Participantes_Empresa';
SHOW TABLES LIKE 'Participantes_Sociedad_Civil';

-- Verificar que los días de evento están correctos
SELECT * FROM Dias_Evento ORDER BY dia_numero;

-- Verificar que las sesiones están creadas
SELECT COUNT(*) as total_sesiones FROM Sesiones_Evento;

-- Verificar el enum de roles en la tabla Usuarios
SHOW COLUMNS FROM Usuarios LIKE 'rol';

-- Si el enum no está actualizado, ejecutar esto:
-- ALTER TABLE Usuarios MODIFY COLUMN rol ENUM('admin', 'externo', 'unsa', 'academia', 'gobierno', 'empresa', 'sociedad_civil') NOT NULL;

-- Verificar que las foreign keys están correctas
SELECT 
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE REFERENCED_TABLE_SCHEMA = 'RuedaDeProblemasDB'
AND TABLE_NAME IN ('Participantes_Academia', 'Participantes_Gobierno', 'Participantes_Empresa', 'Participantes_Sociedad_Civil');

-- Verificar datos migrados
SELECT 
    'Academia' as tipo,
    COUNT(*) as total
FROM Participantes_Academia
UNION ALL
SELECT 
    'Gobierno' as tipo,
    COUNT(*) as total
FROM Participantes_Gobierno
UNION ALL
SELECT 
    'Empresa' as tipo,
    COUNT(*) as total
FROM Participantes_Empresa
UNION ALL
SELECT 
    'Sociedad_Civil' as tipo,
    COUNT(*) as total
FROM Participantes_Sociedad_Civil
UNION ALL
SELECT 
    'UNSA' as tipo,
    COUNT(*) as total
FROM Investigadores_UNSA
UNION ALL
SELECT 
    'Externos_Legacy' as tipo,
    COUNT(*) as total
FROM Participantes_Externos;