-- Script para verificar datos OCDE en la base de datos

-- 1. Verificar si existen áreas OCDE
SELECT 'AREAS' as tabla, COUNT(*) as total FROM areas;
SELECT * FROM areas LIMIT 5;

-- 2. Verificar si existen sub-áreas OCDE
SELECT 'SUB_AREAS' as tabla, COUNT(*) as total FROM sub_areas;
SELECT * FROM sub_areas LIMIT 5;

-- 3. Verificar si existen disciplinas OCDE
SELECT 'DISCIPLINAS' as tabla, COUNT(*) as total FROM disciplinas;
SELECT * FROM disciplinas LIMIT 5;

-- 4. Verificar registros OCDE guardados
SELECT 'REGISTROS_OCDE' as tabla, COUNT(*) as total FROM Registro_OCDE;
SELECT * FROM Registro_OCDE;

-- 5. Verificar registros OCDE con nombres completos
SELECT 
  ro.id,
  u.email as usuario,
  ro.area_id,
  a.nombre as area_nombre,
  ro.sub_area_id,
  sa.nombre as subarea_nombre,
  ro.disciplina_id,
  d.nombre as disciplina_nombre
FROM Registro_OCDE ro
JOIN Usuarios u ON ro.usuario_id = u.usuario_id
LEFT JOIN areas a ON ro.area_id = a.id
LEFT JOIN sub_areas sa ON ro.sub_area_id = sa.id
LEFT JOIN disciplinas d ON ro.disciplina_id = d.id;

-- 6. Verificar últimos registros creados
SELECT 'DOCENTES' as tipo, COUNT(*) as total FROM Registro_Docente_Investigador
UNION ALL
SELECT 'GRUPOS' as tipo, COUNT(*) as total FROM Registro_Grupo_Centro_Instituto
UNION ALL
SELECT 'LABORATORIOS' as tipo, COUNT(*) as total FROM Registro_Laboratorio;

-- 7. Ver último registro de grupo/centro/instituto
SELECT * FROM Registro_Grupo_Centro_Instituto 
ORDER BY fecha_creacion DESC LIMIT 1;

-- 8. Ver registros OCDE del último usuario que registró
SELECT 
  ro.*,
  a.nombre as area,
  sa.nombre as subarea,
  d.nombre as disciplina
FROM Registro_OCDE ro
LEFT JOIN areas a ON ro.area_id = a.id
LEFT JOIN sub_areas sa ON ro.sub_area_id = sa.id
LEFT JOIN disciplinas d ON ro.disciplina_id = d.id
WHERE ro.usuario_id = (
  SELECT usuario_id FROM Registro_Grupo_Centro_Instituto 
  ORDER BY fecha_creacion DESC LIMIT 1
);
