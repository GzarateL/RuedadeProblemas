-- ====================================================================
-- CALENDARIOS DE EVENTOS
-- ====================================================================

-- DÍA 0: Lanzamiento y Cóctel de Prensa
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 0), '18:00 - 21:00', '18:00:00', '21:00:00', 'Lanzamiento y Cóctel de Prensa', 'Presentación oficial del evento, networking inicial', 'Inauguración del evento');

-- DÍA 1: Martes 2-12 - Talento Universitario y Futuro Profesional
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '08:00 - 10:00', '08:00:00', '10:00:00', 'Talento Universitario y Futuro Profesional (UNSA)', 'Conectar estudiantes y egresados con oportunidades de desarrollo profesional', 'Perfiles de proyectos para el fomento del talento universitario'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '10:30 - 12:30', '10:30:00', '12:30:00', 'Educación Superior (Universidades)', 'Colaboración interuniversitaria y proyectos de investigación conjunta', 'Red de colaboración entre universidades'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '14:00 - 16:00', '14:00:00', '16:00:00', 'Formación Técnica (Institutos)', 'Vinculación de la formación técnica con las necesidades del mercado', 'Programas de capacitación técnica especializada'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 1), '16:30 - 18:30', '16:30:00', '18:30:00', 'Talento Escolar (Colegios)', 'Identificación y desarrollo de talentos desde la educación básica', 'Programas de mentoring escolar');

-- DÍA 2: Miércoles 3-12 - Sector Empresarial
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '08:00 - 10:00', '08:00:00', '10:00:00', 'Innovación Base (Empresarios MYPES)', 'Fomento de la innovación en micro y pequeñas empresas', 'Proyectos de innovación para MYPES'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '10:30 - 12:30', '10:30:00', '12:30:00', 'Escalamiento Empresarial (MEPECOS)', 'Estrategias de crecimiento para medianas y pequeñas empresas', 'Planes de escalamiento empresarial'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '14:00 - 16:00', '14:00:00', '16:00:00', 'I+D Estratégico (PRICOS)', 'Investigación y desarrollo para grandes empresas', 'Proyectos de I+D estratégicos'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 2), '16:30 - 18:30', '16:30:00', '18:30:00', 'Organizaciones Estatales (SUNAT, ADUANAS, OSCE, etc.)', 'Modernización y eficiencia en entidades públicas', 'Propuestas de mejora en servicios públicos');

-- DÍA 3: Jueves 4-12 - Desarrollo Humano
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '08:00 - 10:00', '08:00:00', '10:00:00', 'Desarrollo Humano - Sesión 1 (Colegios Profesionales)', 'Primera sesión de desarrollo profesional continuo', 'Programas de actualización profesional'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '10:30 - 12:30', '10:30:00', '12:30:00', 'Desarrollo Humano - Sesión 2 (Colegios Profesionales)', 'Segunda sesión de desarrollo profesional continuo', 'Certificaciones y especializaciones'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '14:00 - 16:00', '14:00:00', '16:00:00', 'Desarrollo Humano - Sesión 3 (Colegios Profesionales)', 'Tercera sesión de desarrollo profesional continuo', 'Redes profesionales especializadas'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 3), '16:30 - 18:30', '16:30:00', '18:30:00', 'Desarrollo Humano - Sesión 4 (Colegios Profesionales)', 'Cuarta sesión de desarrollo profesional continuo', 'Proyectos de impacto profesional');

-- DÍA 4: Viernes 5-12 - Gestión Pública
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '08:00 - 10:00', '08:00:00', '10:00:00', 'Gestión Local (Municipalidades Distritales)', 'Mejora de servicios municipales a nivel distrital', 'Proyectos de desarrollo local'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '10:30 - 12:30', '10:30:00', '12:30:00', 'Planificación Provincial (Municipalidades Provinciales)', 'Coordinación y planificación a nivel provincial', 'Planes de desarrollo provincial'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '14:00 - 16:00', '14:00:00', '16:00:00', 'Políticas Regionales (Gobierno Regional y Central)', 'Implementación de políticas públicas regionales', 'Propuestas de políticas regionales'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 4), '16:30 - 18:30', '16:30:00', '18:30:00', 'Entidades Públicas Sectoriales y de Control', 'Fortalecimiento institucional y control', 'Sistemas de mejora institucional');

-- DÍA 5: Sábado 6-12 - Sociedad Civil
INSERT INTO Sesiones_Evento (dia_id, horario_display, hora_inicio, hora_fin, bloque_tematico, foco_objetivos, entregable_clave) VALUES
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '08:00 - 10:00', '08:00:00', '10:00:00', 'Organizaciones de Base y Programas Sociales', 'Fortalecimiento de organizaciones comunitarias', 'Proyectos de desarrollo comunitario'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '10:30 - 12:30', '10:30:00', '12:30:00', 'ONGs y Voluntariado', 'Coordinación entre ONGs y programas de voluntariado', 'Red de colaboración civil'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '14:00 - 16:00', '14:00:00', '16:00:00', 'Gremios y Movimientos Ciudadanos', 'Participación ciudadana y representación gremial', 'Propuestas ciudadanas'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '16:30 - 18:00', '16:30:00', '18:00:00', 'Almuerzo de Clausura', 'Networking final y cierre del evento', 'Compromisos de seguimiento'),
((SELECT dia_id FROM Dias_Evento WHERE dia_numero = 5), '18:00 - 19:00', '18:00:00', '19:00:00', 'Plenaria Final', 'Presentación de resultados y próximos pasos', 'Documento de compromisos finales');

-- ====================================================================
-- PALABRAS CLAVE
-- ====================================================================


INSERT INTO keywords_catalog (keyword, category, description) VALUES
-- tecnologia digital
('inteligencia artificial', 'tecnologia_digital', 'machine learning, redes neuronales, ia'),
('internet de las cosas', 'tecnologia_digital', 'iot, sensores conectados, dispositivos inteligentes'),
('blockchain', 'tecnologia_digital', 'cadena de bloques, criptomonedas, contratos inteligentes'),
('big data', 'tecnologia_digital', 'analisis de datos masivos, mineria de datos'),
('ciberseguridad', 'tecnologia_digital', 'seguridad informatica, proteccion de datos'),
('realidad virtual', 'tecnologia_digital', 'vr, inmersion digital, simulacion'),
('robotica', 'tecnologia_digital', 'robots, automatizacion, cobots'),
('impresion 3d', 'tecnologia_digital', 'manufactura aditiva, prototipado rapido'),

-- medio ambiente
('biorremediacion', 'medio_ambiente', 'descontaminacion biologica, fitorremediacion'),
('energias renovables', 'medio_ambiente', 'solar, eolica, energia limpia'),
('economia circular', 'medio_ambiente', 'reciclaje, reutilizacion, sostenibilidad'),
('tratamiento de aguas', 'medio_ambiente', 'purificacion, potabilizacion, saneamiento'),
('gestion de residuos solidos', 'medio_ambiente', 'manejo de basura, reciclaje, compostaje'),
('cambio climatico', 'medio_ambiente', 'calentamiento global, huella de carbono'),
('biodiversidad', 'medio_ambiente', 'conservacion, ecosistemas, especies'),
('contaminacion ambiental', 'medio_ambiente', 'polucion, contaminantes, remediacion'),

-- salud
('telemedicina', 'salud', 'salud digital, consulta remota, e-health'),
('diagnostico molecular', 'salud', 'pcr, analisis genetico, biomarcadores'),
('biomateriales', 'salud', 'implantes, protesis, materiales biocompatibles'),
('bacterias probioticas', 'salud', 'microbioma, flora intestinal, probioticos'),
('epidemiologia', 'salud', 'salud publica, prevencion, vigilancia epidemiologica'),
('nutricion clinica', 'salud', 'dietetica, alimentacion saludable'),
('dispositivos medicos', 'salud', 'equipamiento medico, tecnologia sanitaria'),

-- ingenieria
('estructuras civiles', 'ingenieria', 'diseno estructural, puentes, edificios'),
('sismoresistencia', 'ingenieria', 'diseno antisismico, resistencia sismica'),
('bim', 'ingenieria', 'building information modeling, modelado 3d'),
('geotecnia', 'ingenieria', 'mecanica de suelos, cimentaciones'),
('materiales de construccion', 'ingenieria', 'concreto, acero, materiales estructurales'),
('eficiencia energetica', 'ingenieria', 'ahorro de energia, optimizacion energetica'),

-- industria
('industria 4.0', 'industria', 'smart factory, automatizacion industrial'),
('lean manufacturing', 'industria', 'manufactura esbelta, mejora continua'),
('mantenimiento predictivo', 'industria', 'analisis de vibraciones, prevencion de fallas'),
('control de calidad', 'industria', 'aseguramiento, six sigma, iso'),
('cadena de suministro', 'industria', 'logistica, supply chain, distribucion'),
('seguridad industrial', 'industria', 'prevencion de riesgos, salud ocupacional'),

-- agroindustria
('agricultura de precision', 'agroindustria', 'smart farming, drones agricolas'),
('tecnologia de alimentos', 'agroindustria', 'food tech, procesamiento, conservacion'),
('seguridad alimentaria', 'agroindustria', 'inocuidad, haccp, trazabilidad'),
('control de plagas', 'agroindustria', 'manejo integrado, fitosanitario'),
('acuicultura', 'agroindustria', 'piscicultura, cultivo de peces'),
('agricultura sostenible', 'agroindustria', 'agroecologia, produccion organica'),

-- gestion
('transformacion digital', 'gestion', 'digitalizacion empresarial, change management'),
('emprendimiento', 'gestion', 'startups, innovacion empresarial'),
('politicas publicas', 'gestion', 'gestion publica, gobernanza'),
('rotacion de personal', 'gestion', 'turnover, retencion de talento'),
('gestion del conocimiento', 'gestion', 'knowledge management, capital intelectual'),
('innovacion social', 'gestion', 'impacto social, valor compartido'),

-- educacion
('educacion inclusiva', 'educacion', 'inclusion, diversidad, accesibilidad'),
('dislexia', 'educacion', 'trastornos de aprendizaje, dificultades de lectura'),
('metodologias activas', 'educacion', 'aprendizaje activo, pedagogia'),
('e-learning', 'educacion', 'educacion virtual, plataformas educativas'),

-- materiales
('nanomateriales', 'materiales', 'nanotecnologia, nanoparticulas'),
('polimeros', 'materiales', 'plasticos, biopolimeros'),
('materiales compuestos', 'materiales', 'composites, fibra de carbono');

-- ====================================================================
-- DATOS EN OCDE
-- ====================================================================

-- Insertar Áreas
INSERT INTO areas (codigo, nombre) VALUES
('1.00.00', 'Ciencias naturales'),
('2.00.00', 'Ingeniería, Tecnología'),
('3.00.00', 'Ciencias médicas, Ciencias de la salud'),
('4.00.00', 'Ciencias agrícolas'),
('5.00.00', 'Ciencias sociales'),
('6.00.00', 'Humanidades');

-- Insertar Sub-áreas (1.00.00 - Ciencias naturales)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('1.01.00', 'Matemáticas', 1),
('1.02.00', 'Informática y Ciencias de la Información', 1),
('1.03.00', 'Física y Astronomía', 1),
('1.04.00', 'Química', 1),
('1.05.00', 'Ciencias de la Tierra, Ciencias ambientales', 1),
('1.06.00', 'Biología', 1),
('1.07.00', 'Otras ciencias naturales', 1);

-- Insertar Disciplinas (1.01.00 - Matemáticas)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.01.01', 'Matemáticas puras', 1),
('1.01.02', 'Matemáticas aplicadas', 1),
('1.01.03', 'Estadísticas, Probabilidad', 1);

-- Insertar Disciplinas (1.02.00 - Informática)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.02.00', 'Informática y Ciencias de la Información', 2),
('1.02.01', 'Ciencias de la computación', 2),
('1.02.02', 'Ciencias de la información', 2),
('1.02.03', 'Bioinformática', 2);

-- Insertar Disciplinas (1.03.00 - Física y Astronomía)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.03.01', 'Física atómica, molecular y química', 3),
('1.03.02', 'Física de la materia condensada', 3),
('1.03.03', 'Física de partículas, Campos de la Física', 3),
('1.03.04', 'Física nuclear', 3),
('1.03.05', 'Física de plasmas y fluídos', 3),
('1.03.06', 'Óptica', 3),
('1.03.07', 'Acústica', 3),
('1.03.08', 'Astronomía', 3);

-- Insertar Disciplinas (1.04.00 - Química)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.04.01', 'Química orgánica', 4),
('1.04.02', 'Química inorgánica, Química nuclear', 4),
('1.04.03', 'Química física', 4),
('1.04.04', 'Ciencia de los polímeros', 4),
('1.04.05', 'Electroquímica', 4),
('1.04.06', 'Química coloidal', 4),
('1.04.07', 'Química analítica', 4);

-- Insertar Disciplinas (1.05.00 - Ciencias de la Tierra)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.05.01', 'Geociencias, Multidisciplinar', 5),
('1.05.02', 'Mineralogía', 5),
('1.05.03', 'Paleontología', 5),
('1.05.04', 'Geoquímica, Geofísica', 5),
('1.05.05', 'Geografía física', 5),
('1.05.06', 'Geología', 5),
('1.05.07', 'Vulcanología', 5),
('1.05.08', 'Ciencias del medio ambiente', 5),
('1.05.09', 'Meteorología y ciencias atmosféricas', 5),
('1.05.10', 'Investigación climática', 5),
('1.05.11', 'Oceanografía, Hidrología, Recursos hídricos', 5);

-- Insertar Disciplinas (1.06.00 - Biología)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('1.06.01', 'Biología celular, Microbiología', 6),
('1.06.02', 'Virología', 6),
('1.06.03', 'Bioquímica, Biología molecular', 6),
('1.06.04', 'Métodos de investigación bioquímica', 6),
('1.06.05', 'Micología', 6),
('1.06.06', 'Biofísica', 6),
('1.06.07', 'Genética, Herencia', 6),
('1.06.08', 'Biología reproductiva', 6),
('1.06.09', 'Biología del desarrollo', 6),
('1.06.10', 'Ciencias de las plantas, Botánica', 6),
('1.06.11', 'Zoología, Ornitología, Entomología, ciencias biológicas del comportamiento', 6),
('1.06.12', 'Biología marina, Biología de agua dulce, Limnología', 6),
('1.06.13', 'Ecología', 6),
('1.06.14', 'Biofísica', 6),
('1.06.15', 'Biología (teórica, matemática, térmica, criobiología, ritmo biológico), Biología evolutiva', 6),
('1.06.16', 'Otras temas de Biología', 6);

-- Insertar Sub-áreas (2.00.00 - Ingeniería, Tecnología)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('2.01.00', 'Ingeniería civil', 2),
('2.02.00', 'Ingeniería eléctrica, Ingeniería electrónica', 2),
('2.03.00', 'Ingeniería mecánica', 2),
('2.04.00', 'Ingeniería química', 2),
('2.05.00', 'Ingeniería de materiales', 2),
('2.06.00', 'Ingeniería médica', 2),
('2.07.00', 'Ingeniería ambiental', 2),
('2.08.00', 'Biotecnología ambiental', 2),
('2.09.00', 'Biotecnología industrial', 2),
('2.10.00', 'Nano-tecnología', 2),
('2.11.00', 'Otras ingenierías, Otras tecnologías', 2);

-- Insertar Disciplinas (2.01.00 - Ingeniería civil)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.01.01', 'Ingeniería civil', 8),
('2.01.02', 'Ingeniería arquitectónica', 8),
('2.01.03', 'Ingeniería de la construcción', 8),
('2.01.04', 'Ingeniería estructural y municipal', 8),
('2.01.05', 'Ingeniería del transporte', 8);

-- Insertar Disciplinas (2.02.00 - Ingeniería eléctrica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.02.01', 'Ingeniería eléctrica, Ingeniería electrónica', 9),
('2.02.02', 'Robótica, Control automático', 9),
('2.02.03', 'Sistemas de automatización, Sistemas de control', 9),
('2.02.04', 'Ingeniería de sistemas y comunicaciones', 9),
('2.02.05', 'Telecomunicaciones', 9),
('2.02.06', 'Hardware, Arquitectura de computadoras', 9);

-- Insertar Disciplinas (2.03.00 - Ingeniería mecánica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.03.01', 'Ingeniería mecánica', 10),
('2.03.02', 'Mecánica aplicada', 10),
('2.03.03', 'Termodinámica', 10),
('2.03.04', 'Ingeniería aeroespacial', 10),
('2.03.05', 'Ingeniería relacionada con la energía nuclear', 10),
('2.03.06', 'Ingeniería de audio, Análisis de confiabilidad', 10);

-- Insertar Disciplinas (2.04.00 - Ingeniería química)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.04.01', 'Ingeniería química', 11),
('2.04.02', 'Ingeniería de procesos', 11);

-- Insertar Disciplinas (2.05.00 - Ingeniería de materiales)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.05.01', 'Ingeniería de materiales', 12),
('2.05.02', 'Cerámica', 12),
('2.05.03', 'Recubrimiento, Películas', 12),
('2.05.04', 'Compuestos', 12),
('2.05.05', 'Papel, Madera', 12),
('2.05.06', 'Textiles', 12),
('2.05.07', 'Incluidos colorantes sintéticos, Colores, Fibras', 12);

-- Insertar Disciplinas (2.06.00 - Ingeniería médica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.06.01', 'Ingeniería médica', 13),
('2.06.02', 'Tecnología médica de laboratorio (análisis de muestras, tecnologías para el diagnóstico)', 13);

-- Insertar Disciplinas (2.07.00 - Ingeniería ambiental)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.07.01', 'Ingeniería ambiental y geológica', 14),
('2.07.02', 'Geotecnia', 14),
('2.07.03', 'Ingeniería del Petróleo, (combustibles, aceites), Energía, Combustibles', 14),
('2.07.04', 'Sensores remotos', 14),
('2.07.05', 'Minería, Procesamiento de minerales', 14),
('2.07.06', 'Ingeniería marina, naves', 14),
('2.07.07', 'Ingeniería oceanográfica', 14);

-- Insertar Disciplinas (2.08.00 - Biotecnología ambiental)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.08.01', 'Biotecnología ambiental', 15),
('2.08.02', 'Biorremediación, Biotecnologías de diagnóstico en la gestión ambiental', 15),
('2.08.03', 'Ética relacionada con la biotecnología ambiental', 15);

-- Insertar Disciplinas (2.09.00 - Biotecnología industrial)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.09.01', 'Biotecnología industrial', 16),
('2.09.02', 'Tecnologías de bioprocesamiento, Biocatálisis, Fermentación', 16),
('2.09.03', 'Bioproductos (productos que se manufacturan usando biotecnología), biomateriales, bioplásticos, biocombustibles, materiales nuevos bioderivados, químicos finos bioredivados', 16);

-- Insertar Disciplinas (2.10.00 - Nano-tecnología)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.10.01', 'Nano-materiales', 17),
('2.10.02', 'Nano-procesos', 17);

-- Insertar Disciplinas (2.11.00 - Otras ingenierías)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('2.11.01', 'Alimentos y bebidas', 18),
('2.11.02', 'Otras ingenierías y tecnologías', 18),
('2.11.03', 'Ingeniería de producción', 18),
('2.11.04', 'Ingeniería industrial', 18);

-- Insertar Sub-áreas (3.00.00 - Ciencias médicas)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('3.01.00', 'Medicina básica', 3),
('3.02.00', 'Medicina clínica', 3),
('3.03.00', 'Ciencias de la salud', 3),
('3.04.00', 'Biotecnología médica', 3),
('3.05.00', 'Otras ciencias médicas', 3);

-- Insertar Disciplinas (3.01.00 - Medicina básica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('3.01.01', 'Anatomía, Morfología', 19),
('3.01.02', 'Genética humana', 19),
('3.01.03', 'Inmunología', 19),
('3.01.04', 'Neurociencias', 19),
('3.01.05', 'Farmacología, Farmacia', 19),
('3.01.06', 'Química medicinal', 19),
('3.01.07', 'Toxicología', 19),
('3.01.08', 'Fisiología', 19),
('3.01.09', 'Patología', 19);

-- Insertar Disciplinas (3.02.00 - Medicina clínica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('3.02.01', 'Andrología', 20),
('3.02.02', 'Obstetricia, Ginecología', 20),
('3.02.03', 'Pediatría', 20),
('3.02.04', 'Sistema cardiaco, Sistema cardiovascular', 20),
('3.02.05', 'Enfermedad vascular periférica', 20),
('3.02.06', 'Hematología', 20),
('3.02.07', 'Sistema respiratorio', 20),
('3.02.08', 'Cuidado crítico y de emergencia', 20),
('3.02.09', 'Anestesiología', 20),
('3.02.10', 'Ortopedía', 20),
('3.02.11', 'Cirugía', 20),
('3.02.12', 'Radiología, Medicina nuclear, Imágenes médicas', 20),
('3.02.13', 'Trasplante', 20),
('3.02.14', 'Odontología, Cirugía oral, Medicina oral', 20),
('3.02.15', 'Dermatología, Enfermedades venéreas', 20),
('3.02.16', 'Alergia', 20),
('3.02.17', 'Reumatología', 20),
('3.02.18', 'Endocrinología, Metabolismo (incluyendo diabetes, hormonas)', 20),
('3.02.19', 'Gastroenterología, Hepatología', 20),
('3.02.20', 'Urología, Nefrología', 20),
('3.02.21', 'Oncología', 20),
('3.02.22', 'Oftalmología', 20),
('3.02.23', 'Otorrinolaringología', 20),
('3.02.24', 'Psiquiatría', 20),
('3.02.25', 'Neurología clínica', 20),
('3.02.26', 'Geriatría, Gerontología', 20),
('3.02.27', 'Medicina general, Medicina interna', 20),
('3.02.28', 'Otros temas de medicina clínica', 20),
('3.02.29', 'Medicina integral, Medicina complementaria', 20);

-- Insertar Disciplinas (3.03.00 - Ciencias de la salud)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('3.03.01', 'Ciencias del cuidado de la salud y servicios (administración de hospitales, financiamiento)', 21),
('3.03.02', 'Políticas de salud, Servicios de salud', 21),
('3.03.03', 'Enfermería', 21),
('3.03.04', 'Nutrición, Dietética', 21),
('3.03.05', 'Salud pública, Salud ambiental', 21),
('3.03.06', 'Medicina tropical', 21),
('3.03.07', 'Parasitología', 21),
('3.03.08', 'Enfermedades infecciosas', 21),
('3.03.09', 'Epidemiología', 21),
('3.03.10', 'Salud ocupacional', 21),
('3.03.11', 'Ciencias del deporte y la aptitud física', 21),
('3.03.12', 'Ciencias socio biomédicas (planificación familiar, salud sexual, efectos políticos y sociales de la investigación biomédica)', 21),
('3.03.13', 'Ética', 21),
('3.03.14', 'Abuso de sustancias', 21);

-- Insertar Disciplinas (3.04.00 - Biotecnología médica)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('3.04.01', 'Biotecnología relacionada con la salud', 22),
('3.04.02', 'Tecnologías que implican la manipulación de células, tejidos, órganos o todo el organismo', 22),
('3.04.03', 'Tecnología para la identificación y funcionamiento del ADN, proteínas y enzimas y como influencian la enfermedad)', 22),
('3.04.04', 'Biomateriales', 22),
('3.04.05', 'Ética relacionada con la biotecnología médica', 22);

-- Insertar Disciplinas (3.05.00 - Otras ciencias médicas)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('3.05.01', 'Ciencia forense', 23),
('3.05.02', 'Otras ciencias médicas', 23),
('3.05.03', 'Fonoaudiología', 23);

-- Insertar Sub-áreas (4.00.00 - Ciencias agrícolas)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('4.01.00', 'Agricultura, Silvicultura, Pesquería', 4),
('4.02.00', 'Ciencia animal, Ciencia de productos lácteos', 4),
('4.03.00', 'Ciencia veterinaria', 4),
('4.04.00', 'Biotecnología agrícola', 4),
('4.05.00', 'Otras ciencias agrícolas', 4);

-- Insertar Disciplinas (4.01.00 - Agricultura)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('4.01.01', 'Agricultura', 24),
('4.01.02', 'Forestal', 24),
('4.01.03', 'Pesquería', 24),
('4.01.04', 'Ciencia del suelo', 24),
('4.01.05', 'Horticultura, Viticultura', 24),
('4.01.06', 'Agronomía', 24),
('4.01.07', 'Protección y nutrición de las plantas', 24),
('4.01.08', 'Acuicultura', 24);

-- Insertar Disciplinas (4.02.00 - Ciencia animal)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('4.02.01', 'Ciencia animal, Ciencia de productos lácteos', 25),
('4.02.02', 'Cría', 25),
('4.02.03', 'Mascotas', 25);

-- Insertar Disciplinas (4.03.00 - Ciencia veterinaria)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('4.03.01', 'Ciencia veterinaria', 26);

-- Insertar Disciplinas (4.04.00 - Biotecnología agrícola)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('4.04.01', 'Biotecnología agrícola, Biotecnología alimentaria', 27),
('4.04.02', 'Tecnología de modificación genética', 27),
('4.04.03', 'Ética relacionada con la biotecnología agrícola', 27);

-- Insertar Sub-áreas (5.00.00 - Ciencias sociales)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('5.01.00', 'Psicología', 5),
('5.02.00', 'Economía, Negocios', 5),
('5.03.00', 'Ciencias de la educación', 5),
('5.04.00', 'Sociología', 5),
('5.05.00', 'Derecho', 5),
('5.06.00', 'Ciencias políticas', 5),
('5.07.00', 'Geografía social, Geografía económica', 5),
('5.08.00', 'Comunicación, Medios de comunicación', 5),
('5.09.00', 'Otras ciencias sociales', 5);

-- Insertar Disciplinas (5.01.00 - Psicología)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.01.01', 'Psicología (incluye relaciones hombre-máquina)', 29),
('5.01.02', 'Psicología (incluye terapias de aprendizaje, habla, visual y otras discapacidades físicas y mentales)', 29);

-- Insertar Disciplinas (5.02.00 - Economía)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.02.01', 'Economía', 30),
('5.02.02', 'Econometría', 30),
('5.02.03', 'Relaciones Industriales', 30),
('5.02.04', 'Negocios, Administración', 30);

-- Insertar Disciplinas (5.03.00 - Ciencias de la educación)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.03.01', 'Educación general (incluye capacitación, pedadogía)', 31),
('5.03.02', 'Educacion especial (para estudiantes dotados y aquellos con dificultades del apredizaje)', 31);

-- Insertar Disciplinas (5.04.00 - Sociología)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.04.01', 'Sociología', 32),
('5.04.02', 'Demografía', 32),
('5.04.03', 'Antropología', 32),
('5.04.04', 'Etnología', 32),
('5.04.05', 'Temas sociales', 32);

-- Insertar Disciplinas (5.05.00 - Derecho)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.05.01', 'Derecho', 33),
('5.05.02', 'Derecho penal', 33),
('5.05.03', 'Criminología', 33);

-- Insertar Disciplinas (5.06.00 - Ciencias políticas)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.06.01', 'Ciencia política', 34),
('5.06.02', 'Administración pública', 34),
('5.06.03', 'Teoría organizacional', 34);

-- Insertar Disciplinas (5.07.00 - Geografía social)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.07.01', 'Ciencias ambientales', 35),
('5.07.02', 'Geografía económica y cultural', 35),
('5.07.03', 'Estudios urbanos', 35),
('5.07.04', 'Planificación del transporte y aspectos sociales del transporte', 35);

-- Insertar Disciplinas (5.08.00 - Comunicación)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.08.01', 'Periodismo', 36),
('5.08.02', 'Ciencias de la Información', 36),
('5.08.03', 'Bibliotecología', 36),
('5.08.04', 'Medios de comunicación, Comunicación socio-cultural', 36);

-- Insertar Disciplinas (5.09.00 - Otras ciencias sociales)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('5.09.01', 'Interdisciplinariedad', 37),
('5.09.02', 'Otras ciencias sociales', 37);

-- Insertar Sub-áreas (6.00.00 - Humanidades)
INSERT INTO sub_areas (codigo, nombre, area_id) VALUES
('6.01.00', 'Historia, Arqueología', 6),
('6.02.00', 'Lenguas, Literatura', 6),
('6.03.00', 'Filosofía, Ética, Religión', 6),
('6.04.00', 'Arte', 6),
('6.05.00', 'Otras humanidades', 6);

-- Insertar Disciplinas (6.01.00 - Historia)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('6.01.01', 'Historia', 38),
('6.01.02', 'Arqueología', 38);

-- Insertar Disciplinas (6.02.00 - Lenguas)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('6.02.01', 'Estudios generales de idiomas', 39),
('6.02.02', 'Idiomas específicos', 39),
('6.02.03', 'Estudios de literatura general', 39),
('6.02.04', 'Teoría literaria', 39),
('6.02.05', 'Literaturas específicas', 39),
('6.02.06', 'Lingüística', 39);

-- Insertar Disciplinas (6.03.00 - Filosofía)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('6.03.01', 'Filosofía', 40),
('6.03.02', 'Historia y filosofía de la ciencia y la tecnología', 40),
('6.03.04', 'Ética', 40),
('6.03.05', 'Teología', 40),
('6.03.06', 'Estudios religiosos', 40);

-- Insertar Disciplinas (6.04.00 - Arte)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('6.04.01', 'Arte', 41),
('6.04.02', 'Historia del arte', 41),
('6.04.03', 'Diseño arquitectónico', 41),
('6.04.04', 'Artes de la representación (musicología, ciencias del teatro, dramaturgia)', 41),
('6.04.05', 'Estudio del folklore', 41),
('6.04.06', 'Estudios en cine, Estudios en radio, Estudios en televisión', 41),
('6.04.07', 'Música', 41),
('6.04.08', 'Arquitectura y urbanismo', 41),
('6.04.09', 'Diseño industrial y otros diseños', 41);

-- Insertar Disciplinas (6.05.00 - Otras humanidades)
INSERT INTO disciplinas (codigo, nombre, sub_area_id) VALUES
('6.05.01', 'Otras humanidades', 42);

-- ====================================================================
-- ODS EN LA BASE DE DATOS
-- ====================================================================

-- Insertar Objetivos
INSERT INTO objetivos (id, nombre) VALUES
(1, 'Poner fin a la pobreza en todas sus formas y en todo el mundo'),
(2, 'Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición y promover la agricultura sostenible'),
(3, 'Garantizar una vida sana y promover el bienestar de todos a todas las edades'),
(4, 'Garantizar una educación inclusiva y equitativa de calidad y promover oportunidades de aprendizaje permanente para todos'),
(5, 'Lograr la igualdad de género y empoderar a todas las mujeres y las niñas'),
(6, 'Garantizar la disponibilidad y la gestión sostenible del agua y el saneamiento para todos'),
(7, 'Garantizar el acceso a una energía asequible, fiable, sostenible y moderna para todos'),
(8, 'Promover el crecimiento económico sostenido, inclusivo y sostenible, el empleo pleno y productivo y el trabajo decente para todos'),
(9, 'Construir infraestructuras resilientes, promover la industrialización inclusiva y sostenible y fomentar la innovación'),
(10, 'Reducir la desigualdad en los países y entre ellos'),
(11, 'Lograr que las ciudades y los asentamientos humanos sean inclusivos, seguros, resilientes y sostenibles'),
(12, 'Garantizar modalidades de consumo y producción sostenibles'),
(13, 'Adoptar medidas urgentes para combatir el cambio climático y sus efectos'),
(14, 'Conservar y utilizar sosteniblemente los océanos, los mares y los recursos marinos para el desarrollo sostenible');
(15, 'Proteger, restablecer y promover el uso sostenible de los ecosistemas terrestres, gestionar sosteniblemente los bosques, luchar contra la desertificación, detener e invertir la degradación de las tierras y detener la pérdida de biodiversidad'),
(16, 'Promover sociedades pacíficas e inclusivas para el desarrollo sostenible, facilitar el acceso a la justicia para todos y construir a todos los niveles instituciones eficaces e inclusivas que rindan cuentas'),
(17, 'Fortalecer los medios de implementación y revitalizar la Alianza Mundial para el Desarrollo Sostenible');
-- Insertar Metas del OBJETIVO 1
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(1, '1.1', 'De aquí a 2030, erradicar para todas las personas y en todo el mundo la pobreza extrema (actualmente se considera que sufren pobreza extrema las personas que viven con menos de 1,25 dólares de los Estados Unidos al día)'),
(1, '1.2', 'De aquí a 2030, reducir al menos a la mitad la proporción de hombres, mujeres y niños de todas las edades que viven en la pobreza en todas sus dimensiones con arreglo a las definiciones nacionales'),
(1, '1.3', 'Implementar a nivel nacional sistemas y medidas apropiados de protección social para todos, incluidos niveles mínimos, y, de aquí a 2030, lograr una amplia cobertura de las personas pobres y vulnerables'),
(1, '1.4', 'De aquí a 2030, garantizar que todos los hombres y mujeres, en particular los pobres y los vulnerables, tengan los mismos derechos a los recursos económicos y acceso a los servicios básicos, la propiedad y el control de la tierra y otros bienes, la herencia, los recursos naturales, las nuevas tecnologías apropiadas y los servicios financieros, incluida la microfinanciación'),
(1, '1.5', 'De aquí a 2030, fomentar la resiliencia de los pobres y las personas que se encuentran en situaciones de vulnerabilidad y reducir su exposición y vulnerabilidad a los fenómenos extremos relacionados con el clima y otras perturbaciones y desastres económicos, sociales y ambientales'),
(1, '1.a', 'Garantizar una movilización significativa de recursos procedentes de diversas fuentes, incluso mediante la mejora de la cooperación para el desarrollo, a fin de proporcionar medios suficientes y previsibles a los países en desarrollo, en particular los países menos adelantados, para que implementen programas y políticas encaminados a poner fin a la pobreza en todas sus dimensiones'),
(1, '1.b', 'Crear marcos normativos sólidos en los planos nacional, regional e internacional, sobre la base de estrategias de desarrollo en favor de los pobres que tengan en cuenta las cuestiones de género, a fin de apoyar la inversión acelerada en medidas para erradicar la pobreza');

-- Insertar Metas del OBJETIVO 2
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(2, '2.1', 'De aquí a 2030, poner fin al hambre y asegurar el acceso de todas las personas, en particular los pobres y las personas en situaciones de vulnerabilidad, incluidos los niños menores de 1 año, a una alimentación sana, nutritiva y suficiente durante todo el año'),
(2, '2.2', 'De aquí a 2030, poner fin a todas las formas de malnutrición, incluso logrando, a más tardar en 2025, las metas convenidas internacionalmente sobre el retraso del crecimiento y la emaciación de los niños menores de 5 años, y abordar las necesidades de nutrición de las adolescentes, las mujeres embarazadas y lactantes y las personas de edad'),
(2, '2.3', 'De aquí a 2030, duplicar la productividad agrícola y los ingresos de los productores de alimentos en pequeña escala, en particular las mujeres, los pueblos indígenas, los agricultores familiares, los ganaderos y los pescadores...'),
(2, '2.4', 'De aquí a 2030, asegurar la sostenibilidad de los sistemas de producción de alimentos y aplicar prácticas agrícolas resilientes...'),
(2, '2.5', 'De aquí a 2030, mantener la diversidad genética de las semillas, las plantas cultivadas y los animales de granja...'),
(2, '2.a', 'Aumentar, incluso mediante una mayor cooperación internacional, las inversiones en infraestructura rural...'),
(2, '2.b', 'Corregir y prevenir las restricciones y distorsiones comerciales en los mercados agropecuarios mundiales...'),
(2, '2.c', 'Adoptar medidas para asegurar el buen funcionamiento de los mercados de productos básicos alimentarios...');

-- Insertar Metas del OBJETIVO 3
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(3,'3.1','Para 2030, reducir la tasa mundial de mortalidad materna a menos de 70 por cada 100 000 nacidos vivos.'),
(3,'3.2','Para 2030, poner fin a las muertes evitables de recién nacidos y de niños menores de 5 años, con todos los países tratando de reducir la mortalidad neonatal a por lo menos 12 por cada 1,000 nacidos vivos y la mortalidad de menores de 5 años a por lo menos 25 por cada 1,000 nacidos vivos.'),
(3,'3.3','Para 2030, poner fin a las epidemias de SIDA, tuberculosis, malaria y enfermedades tropicales desatendidas y combatir la hepatitis, las enfermedades transmitidas por el agua y otras enfermedades transmisibles.'),
(3,'3.4','Para 2030, reducir en un tercio la mortalidad prematura por enfermedades no transmisibles mediante la prevención y el tratamiento, y promover la salud mental y el bienestar.'),
(3,'3.5','Fortalecer la prevención y el tratamiento del abuso de sustancias adictivas, incluido el uso indebido de estupefacientes y el consumo nocivo de alcohol.'),
(3,'3.6','Para 2030, reducir a la mitad el número mundial de muertes y lesiones causadas por accidentes de tráfico.'),
(3,'3.7','Para 2030, garantizar el acceso universal a los servicios de salud sexual y reproductiva, incluidos la planificación familiar, la información y la educación, y la integración de la salud reproductiva en las estrategias y programas nacionales.'),
(3,'3.8','Lograr la cobertura sanitaria universal, incluida la protección contra los riesgos financieros, el acceso a servicios de salud esenciales de calidad y a medicamentos y vacunas seguros, eficaces, asequibles y de calidad para todos.'),
(3,'3.9','Para 2030, reducir sustancialmente el número de muertes y enfermedades causadas por productos químicos peligrosos y la contaminación del aire, el agua y el suelo.'),
(3,'3.a','Fortalecer la aplicación del Convenio Marco de la Organización Mundial de la Salud para el Control del Tabaco en todos los países, según proceda.'),
(3,'3.b','Apoyar la investigación y el desarrollo de vacunas y medicamentos para las enfermedades transmisibles y no transmisibles que afectan principalmente a los países en desarrollo, y facilitar el acceso a medicamentos y vacunas esenciales asequibles, de conformidad con la Declaración de Doha relativa al Acuerdo sobre los ADPIC y la Salud Pública.'),
(3,'3.c','Aumentar sustancialmente la financiación de la salud y la contratación, el desarrollo, la capacitación y la retención del personal sanitario en los países en desarrollo, especialmente en los países menos adelantados y los pequeños Estados insulares en desarrollo.'),
(3,'3.d','Reforzar la capacidad de todos los países, en particular los países en desarrollo, para la alerta temprana, la reducción de riesgos y la gestión de riesgos para la salud a nivel nacional y mundial.');

-- Insertar Metas del OBJETIVO 4
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(4,'4.1','Para 2030, asegurar que todas las niñas y todos los niños terminen la enseñanza primaria y secundaria, que ha de ser gratuita, equitativa y de calidad y producir resultados de aprendizaje pertinentes y eficaces.'),
(4,'4.2','Para 2030, asegurar que todas las niñas y todos los niños tengan acceso a servicios de atención y desarrollo en la primera infancia y educación preescolar de calidad, a fin de que estén preparados para la enseñanza primaria.'),
(4,'4.3','Para 2030, asegurar el acceso igualitario de todos los hombres y las mujeres a una formación técnica, profesional y superior de calidad, incluida la enseñanza universitaria.'),
(4,'4.4','Para 2030, aumentar sustancialmente el número de jóvenes y adultos que tienen las competencias, en particular técnicas y profesionales, necesarias para acceder al empleo, trabajo decente y emprendimiento.'),
(4,'4.5','Para 2030, eliminar las disparidades de género en la educación y asegurar el acceso igualitario a todos los niveles de enseñanza y formación profesional para las personas vulnerables.'),
(4,'4.6','Para 2030, asegurar que todos los jóvenes y una proporción considerable de los adultos, tanto hombres como mujeres, tengan competencias de lectura, escritura y aritmética.'),
(4,'4.7','Para 2030, asegurar que todos los alumnos adquieran los conocimientos necesarios para promover el desarrollo sostenible, incluidos los derechos humanos, igualdad de género, cultura de paz y no violencia, ciudadanía global y la valoración de la diversidad cultural.'),
(4,'4.a','Construir y adecuar instalaciones educativas que tengan en cuenta las necesidades de los niños y las personas con discapacidad y las cuestiones de género, así como un entorno de aprendizaje seguro, no violento, inclusivo y eficaz para todos.'),
(4,'4.b','De aquí a 2020, aumentar sustancialmente a nivel mundial el número de becas disponibles para los países en desarrollo, en particular los países menos adelantados, los pequeños Estados insulares en desarrollo y los países africanos, a fin de que puedan matricularse en programas de enseñanza superior, incluidos programas de tecnología de la información y las comunicaciones, ingeniería y ciencias.'),
(4,'4.c','Para 2030, aumentar sustancialmente la oferta de docentes calificados, incluso mediante la cooperación internacional para la formación de docentes en los países en desarrollo, especialmente en los países menos adelantados y los pequeños Estados insulares en desarrollo.');

-- Insertar Metas del OBJETIVO 5
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(5,'5.1','Poner fin a todas las formas de discriminación contra todas las mujeres y las niñas en todo el mundo.'),
(5,'5.2','Eliminar todas las formas de violencia contra todas las mujeres y las niñas en los ámbitos público y privado, incluidas la trata y la explotación sexual y otros tipos de explotación.'),
(5,'5.3','Eliminar todas las prácticas nocivas, como el matrimonio infantil, precoz y forzado y la mutilación genital femenina.'),
(5,'5.4','Reconocer y valorar los cuidados y el trabajo doméstico no remunerados mediante la prestación de servicios públicos, infraestructuras y políticas de protección social, y la promoción de la corresponsabilidad en el hogar y la familia.'),
(5,'5.5','Garantizar la plena y efectiva participación de las mujeres y la igualdad de oportunidades de liderazgo a todos los niveles de la adopción de decisiones en la vida política, económica y pública.'),
(5,'5.6','Garantizar el acceso universal a la salud sexual y reproductiva y los derechos reproductivos, de conformidad con los programas de acción de la Conferencia Internacional sobre la Población y el Desarrollo y la Plataforma de Acción de Beijing.'),
(5,'5.a','Emprender reformas para dar a las mujeres igualdad de derechos a los recursos económicos, así como acceso a la propiedad y el control de la tierra y otros bienes.'),
(5,'5.b','Mejorar el uso de la tecnología instrumental, en particular la tecnología de la información y las comunicaciones, para promover el empoderamiento de las mujeres.'),
(5,'5.c','Aprobar y fortalecer políticas acertadas y leyes aplicables para promover la igualdad de género y el empoderamiento de todas las mujeres y las niñas a todos los niveles.');

-- Insertar Metas del OBJETIVO 6
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(6, '6.1', 'De aquí a 2030, lograr el acceso universal y equitativo al agua potable a un precio asequible para todos'),
(6, '6.2', 'De aquí a 2030, lograr el acceso a servicios de saneamiento e higiene adecuados y equitativos para todos y poner fin a la defecación al aire libre, prestando especial atención a las necesidades de las mujeres y las niñas y las personas en situaciones de vulnerabilidad'),
(6, '6.3', 'De aquí a 2030, mejorar la calidad del agua reduciendo la contaminación, eliminando el vertimiento y minimizando la emisión de productos químicos y materiales peligrosos, reduciendo a la mitad el porcentaje de aguas residuales sin tratar y aumentando considerablemente el reciclado y la reutilización sin riesgos a nivel mundial'),
(6, '6.4', 'De aquí a 2030, aumentar considerablemente el uso eficiente de los recursos hídricos en todos los sectores y asegurar la sostenibilidad de la extracción y el abastecimiento de agua dulce para hacer frente a la escasez de agua y reducir considerablemente el número de personas que sufren falta de agua'),
(6, '6.5', 'De aquí a 2030, implementar la gestión integrada de los recursos hídricos a todos los niveles, incluso mediante la cooperación transfronteriza, según proceda'),
(6, '6.6', 'De aquí a 2020, proteger y restablecer los ecosistemas relacionados con el agua, incluidos los bosques, las montañas, los humedales, los ríos, los acuíferos y los lagos'),
(6, '6.a', 'De aquí a 2030, ampliar la cooperación internacional y el apoyo prestado a los países en desarrollo para la creación de capacidad en actividades y programas relativos al agua y el saneamiento, como los de captación de agua, desalinización, uso eficiente de los recursos hídricos, tratamiento de aguas residuales, reciclado y tecnologías de reutilización'),
(6, '6.b', 'Apoyar y fortalecer la participación de las comunidades locales en la mejora de la gestión del agua y el saneamiento');

-- Insertar Metas del OBJETIVO 7
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(7, '7.1', 'De aquí a 2030, garantizar el acceso universal a servicios energéticos asequibles, fiables y modernos'),
(7, '7.2', 'De aquí a 2030, aumentar considerablemente la proporción de energía renovable en el conjunto de fuentes energéticas'),
(7, '7.3', 'De aquí a 2030, duplicar la tasa mundial de mejora de la eficiencia energética'),
(7, '7.a', 'De aquí a 2030, aumentar la cooperación internacional para facilitar el acceso a la investigación y la tecnología relativas a la energía limpia, incluidas las fuentes renovables, la eficiencia energética y las tecnologías avanzadas y menos contaminantes de combustibles fósiles, y promover la inversión en infraestructura energética y tecnologías limpias'),
(7, '7.b', 'De aquí a 2030, ampliar la infraestructura y mejorar la tecnología para prestar servicios energéticos modernos y sostenibles para todos en los países en desarrollo, en particular los países menos adelantados, los pequeños Estados insulares en desarrollo y los países en desarrollo sin litoral, en consonancia con sus respectivos programas de apoyo');

-- Insertar Metas del OBJETIVO 8
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(8, '8.1', 'Mantener el crecimiento económico per cápita de conformidad con las circunstancias nacionales y, en particular, un crecimiento del producto interno bruto de al menos el 7% anual en los países menos adelantados'),
(8, '8.2', 'Lograr niveles más elevados de productividad económica mediante la diversificación, la modernización tecnológica y la innovación, entre otras cosas centrándose en los sectores con gran valor añadido y un uso intensivo de la mano de obra'),
(8, '8.3', 'Promover políticas orientadas al desarrollo que apoyen las actividades productivas, la creación de puestos de trabajo decentes, el emprendimiento, la creatividad y la innovación, y fomentar la formalización y el crecimiento de las microempresas y las pequeñas y medianas empresas, incluso mediante el acceso a servicios financieros'),
(8, '8.4', 'Mejorar progresivamente, de aquí a 2030, la producción y el consumo eficientes de los recursos mundiales y procurar desvincular el crecimiento económico de la degradación del medio ambiente, conforme al Marco Decenal de Programas sobre Modalidades de Consumo y Producción Sostenibles, empezando por los países desarrollados'),
(8, '8.5', 'De aquí a 2030, lograr el empleo pleno y productivo y el trabajo decente para todas las mujeres y los hombres, incluidos los jóvenes y las personas con discapacidad, así como la igualdad de remuneración por trabajo de igual valor'),
(8, '8.6', 'De aquí a 2020, reducir considerablemente la proporción de jóvenes que no están empleados y no cursan estudios ni reciben capacitación'),
(8, '8.7', 'Adoptar medidas inmediatas y eficaces para erradicar el trabajo forzoso, poner fin a las formas contemporáneas de esclavitud y la trata de personas y asegurar la prohibición y eliminación de las peores formas de trabajo infantil, incluidos el reclutamiento y la utilización de niños soldados, y, de aquí a 2025, poner fin al trabajo infantil en todas sus formas'),
(8, '8.8', 'Proteger los derechos laborales y promover un entorno de trabajo seguro y sin riesgos para todos los trabajadores, incluidos los trabajadores migrantes, en particular las mujeres migrantes y las personas con empleos precarios'),
(8, '8.9', 'De aquí a 2030, elaborar y poner en práctica políticas encaminadas a promover un turismo sostenible que cree puestos de trabajo y promueva la cultura y los productos locales'),
(8, '8.10', 'Fortalecer la capacidad de las instituciones financieras nacionales para fomentar y ampliar el acceso a los servicios bancarios, financieros y de seguros para todos'),
(8, '8.a', 'Aumentar el apoyo a la iniciativa de ayuda para el comercio en los países en desarrollo, en particular los países menos adelantados, incluso mediante el Marco Integrado Mejorado para la Asistencia Técnica a los Países Menos Adelantados en Materia de Comercio'),
(8, '8.b', 'De aquí a 2020, desarrollar y poner en marcha una estrategia mundial para el empleo de los jóvenes y aplicar el Pacto Mundial para el Empleo de la Organización Internacional del Trabajo');

-- Insertar Metas del OBJETIVO 9
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(9, '9.1', 'Desarrollar infraestructuras fiables, sostenibles, resilientes y de calidad, incluidas infraestructuras regionales y transfronterizas, para apoyar el desarrollo económico y el bienestar humano, haciendo especial hincapié en el acceso asequible y equitativo para todos'),
(9, '9.2', 'Promover una industrialización inclusiva y sostenible y, de aquí a 2030, aumentar significativamente la contribución de la industria al empleo y al producto interno bruto, de acuerdo con las circunstancias nacionales, y duplicar esa contribución en los países menos adelantados'),
(9, '9.3', 'Aumentar el acceso de las pequeñas industrias y otras empresas, particularmente en los países en desarrollo, a los servicios financieros, incluidos créditos asequibles, y su integración en las cadenas de valor y los mercados'),
(9, '9.4', 'De aquí a 2030, modernizar la infraestructura y reconvertir las industrias para que sean sostenibles, utilizando los recursos con mayor eficacia y promoviendo la adopción de tecnologías y procesos industriales limpios y ambientalmente racionales, y logrando que todos los países tomen medidas de acuerdo con sus capacidades respectivas'),
(9, '9.5', 'Aumentar la investigación científica y mejorar la capacidad tecnológica de los sectores industriales de todos los países, en particular los países en desarrollo, entre otras cosas fomentando la innovación y aumentando considerablemente, de aquí a 2030, el número de personas que trabajan en investigación y desarrollo por millón de habitantes y los gastos de los sectores público y privado en investigación y desarrollo'),
(9, '9.a', 'Facilitar el desarrollo de infraestructuras sostenibles y resilientes en los países en desarrollo mediante un mayor apoyo financiero, tecnológico y técnico a los países africanos, los países menos adelantados, los países en desarrollo sin litoral y los pequeños Estados insulares en desarrollo'),
(9, '9.b', 'Apoyar el desarrollo de tecnologías, la investigación y la innovación nacionales en los países en desarrollo, incluso garantizando un entorno normativo propicio a la diversificación industrial y la adición de valor a los productos básicos, entre otras cosas'),
(9, '9.c', 'Aumentar significativamente el acceso a la tecnología de la información y las comunicaciones y esforzarse por proporcionar acceso universal y asequible a Internet en los países menos adelantados de aquí a 2020');

-- Insertar Metas del OBJETIVO 10
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(10, '10.1', 'De aquí a 2030, lograr progresivamente y mantener el crecimiento de los ingresos del 40% más pobre de la población a una tasa superior a la media nacional'),
(10, '10.2', 'De aquí a 2030, potenciar y promover la inclusión social, económica y política de todas las personas, independientemente de su edad, sexo, discapacidad, raza, etnia, origen, religión o situación económica u otra condición'),
(10, '10.3', 'Garantizar la igualdad de oportunidades y reducir la desigualdad de resultados, incluso eliminando las leyes, políticas y prácticas discriminatorias y promoviendo legislaciones, políticas y medidas adecuadas a ese respecto'),
(10, '10.4', 'Adoptar políticas, especialmente fiscales, salariales y de protección social, y lograr progresivamente una mayor igualdad'),
(10, '10.5', 'Mejorar la reglamentación y vigilancia de las instituciones y los mercados financieros mundiales y fortalecer la aplicación de esos reglamentos'),
(10, '10.6', 'Asegurar una mayor representación e intervención de los países en desarrollo en las decisiones adoptadas por las instituciones económicas y financieras internacionales para aumentar la eficacia, fiabilidad, rendición de cuentas y legitimidad de esas instituciones'),
(10, '10.7', 'Facilitar la migración y la movilidad ordenadas, seguras, regulares y responsables de las personas, incluso mediante la aplicación de políticas migratorias planificadas y bien gestionadas'),
(10, '10.a', 'Aplicar el principio del trato especial y diferenciado para los países en desarrollo, en particular los países menos adelantados, de conformidad con los acuerdos de la Organización Mundial del Comercio'),
(10, '10.b', 'Fomentar la asistencia oficial para el desarrollo y las corrientes financieras, incluida la inversión extranjera directa, para los Estados con mayores necesidades, en particular los países menos adelantados, los países africanos, los pequeños Estados insulares en desarrollo y los países en desarrollo sin litoral, en consonancia con sus planes y programas nacionales'),
(10, '10.c', 'De aquí a 2030, reducir a menos del 3% los costos de transacción de las remesas de los migrantes y eliminar los corredores de remesas con un costo superior al 5%');

-- Insertar Metas del OBJETIVO 11
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(11, '11.1', 'De aquí a 2030, asegurar el acceso de todas las personas a viviendas y servicios básicos adecuados, seguros y asequibles y mejorar los barrios marginales'),
(11, '11.2', 'De aquí a 2030, proporcionar acceso a sistemas de transporte seguros, asequibles, accesibles y sostenibles para todos y mejorar la seguridad vial, en particular mediante la ampliación del transporte público, prestando especial atención a las necesidades de las personas en situación de vulnerabilidad, las mujeres, los niños, las personas con discapacidad y las personas de edad'),
(11, '11.3', 'De aquí a 2030, aumentar la urbanización inclusiva y sostenible y la capacidad para la planificación y la gestión participativas, integradas y sostenibles de los asentamientos humanos en todos los países'),
(11, '11.4', 'Redoblar los esfuerzos para proteger y salvaguardar el patrimonio cultural y natural del mundo'),
(11, '11.5', 'De aquí a 2030, reducir significativamente el número de muertes causadas por los desastres, incluidos los relacionados con el agua, y de personas afectadas por ellos, y reducir considerablemente las pérdidas económicas directas provocadas por los desastres en comparación con el producto interno bruto mundial, haciendo especial hincapié en la protección de los pobres y las personas en situaciones de vulnerabilidad'),
(11, '11.6', 'De aquí a 2030, reducir el impacto ambiental negativo per cápita de las ciudades, incluso prestando especial atención a la calidad del aire y la gestión de los desechos municipales y de otro tipo'),
(11, '11.7', 'De aquí a 2030, proporcionar acceso universal a zonas verdes y espacios públicos seguros, inclusivos y accesibles, en particular para las mujeres y los niños, las personas de edad y las personas con discapacidad'),
(11, '11.a', 'Apoyar los vínculos económicos, sociales y ambientales positivos entre las zonas urbanas, periurbanas y rurales fortaleciendo la planificación del desarrollo nacional y regional'),
(11, '11.b', 'De aquí a 2020, aumentar considerablemente a nivel mundial el número de ciudades y asentamientos humanos que adoptan e implementan políticas y planes integrados para promover la inclusión, el uso eficiente de los recursos, la mitigación del cambio climático y la adaptación a él y la resiliencia ante los desastres, y desarrollar y poner en práctica, en consonancia con el Marco de Sendái para la Reducción del Riesgo de Desastres 2015-2030, la gestión integral de los riesgos de desastre a todos los niveles'),
(11, '11.c', 'Proporcionar apoyo a los países menos adelantados, incluso mediante asistencia financiera y técnica, para que puedan construir edificios locales sostenibles y resilientes y adoptar políticas de ordenación territorial apropiadas');
-- Insertar Metas del OBJETIVO 12
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(12, '12.1', 'Aplicar el Marco Decenal de Programas sobre Modalidades de Consumo y Producción Sostenibles, con la participación de todos los países y bajo el liderazgo de los países desarrollados, teniendo en cuenta el grado de desarrollo y las capacidades de los países en desarrollo'),
(12, '12.2', 'De aquí a 2030, lograr la gestión sostenible y el uso eficiente de los recursos naturales'),
(12, '12.3', 'De aquí a 2030, reducir a la mitad el desperdicio de alimentos per cápita mundial en la venta al por menor y a nivel de los consumidores y reducir las pérdidas de alimentos en las cadenas de producción y suministro, incluidas las pérdidas posteriores a la cosecha'),
(12, '12.4', 'De aquí a 2020, lograr la gestión ecológicamente racional de los productos químicos y de todos los desechos a lo largo de su ciclo de vida, de conformidad con los marcos internacionales convenidos, y reducir significativamente su liberación a la atmósfera, el agua y el suelo a fin de minimizar sus efectos adversos en la salud humana y el medio ambiente'),
(12, '12.5', 'De aquí a 2030, reducir considerablemente la generación de desechos mediante actividades de prevención, reducción, reciclado y reutilización'),
(12, '12.6', 'Alentar a las empresas, en especial las grandes empresas y las empresas transnacionales, a que adopten prácticas sostenibles e incorporen información sobre la sostenibilidad en su ciclo de presentación de informes'),
(12, '12.7', 'Promover prácticas de adquisición pública que sean sostenibles, de conformidad con las políticas y prioridades nacionales'),
(12, '12.8', 'De aquí a 2030, asegurar que las personas de todo el mundo tengan la información y los conocimientos pertinentes para el desarrollo sostenible y los estilos de vida en armonía con la naturaleza'),
(12, '12.a', 'Ayudar a los países en desarrollo a fortalecer su capacidad científica y tecnológica para avanzar hacia modalidades de consumo y producción más sostenibles'),
(12, '12.b', 'Elaborar y aplicar instrumentos para vigilar los efectos en el desarrollo sostenible, a fin de lograr un turismo sostenible que cree puestos de trabajo y promueva la cultura y los productos locales'),
(12, '12.c', 'Racionalizar los subsidios ineficientes a los combustibles fósiles que fomentan el consumo antieconómico eliminando las distorsiones del mercado, de acuerdo con las circunstancias nacionales, incluso mediante la reestructuración de los sistemas tributarios y la eliminación gradual de los subsidios perjudiciales, cuando existan, para reflejar su impacto ambiental, teniendo plenamente en cuenta las necesidades y condiciones específicas de los países en desarrollo y minimizando los posibles efectos adversos en su desarrollo, de manera que se proteja a los pobres y a las comunidades afectadas');

-- Insertar Metas del OBJETIVO 13
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(13, '13.1', 'Fortalecer la resiliencia y la capacidad de adaptación a los riesgos relacionados con el clima y los desastres naturales en todos los países'),
(13, '13.2', 'Incorporar medidas relativas al cambio climático en las políticas, estrategias y planes nacionales'),
(13, '13.3', 'Mejorar la educación, la sensibilización y la capacidad humana e institucional respecto de la mitigación del cambio climático, la adaptación a él, la reducción de sus efectos y la alerta temprana'),
(13, '13.a', 'Cumplir el compromiso de los países desarrollados que son partes en la Convención Marco de las Naciones Unidas sobre el Cambio Climático de lograr para el año 2020 el objetivo de movilizar conjuntamente 100.000 millones de dólares anuales procedentes de todas las fuentes a fin de atender las necesidades de los países en desarrollo respecto de la adopción de medidas concretas de mitigación y la transparencia de su aplicación, y poner en pleno funcionamiento el Fondo Verde para el Clima capitalizándolo lo antes posible'),
(13, '13.b', 'Promover mecanismos para aumentar la capacidad para la planificación y gestión eficaces en relación con el cambio climático en los países menos adelantados y los pequeños Estados insulares en desarrollo, haciendo particular hincapié en las mujeres, los jóvenes y las comunidades locales y marginadas');

-- Insertar Metas del OBJETIVO 14
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(14, '14.1', 'De aquí a 2025, prevenir y reducir significativamente la contaminación marina de todo tipo, en particular la producida por actividades realizadas en tierra, incluidos los detritos marinos y la polución por nutrientes'),
(14, '14.2', 'De aquí a 2020, gestionar y proteger sosteniblemente los ecosistemas marinos y costeros para evitar efectos adversos importantes, incluso fortaleciendo su resiliencia, y adoptar medidas para restaurarlos a fin de restablecer la salud y la productividad de los océanos'),
(14, '14.3', 'Minimizar y abordar los efectos de la acidificación de los océanos, incluso mediante una mayor cooperación científica a todos los niveles'),
(14, '14.4', 'De aquí a 2020, reglamentar eficazmente la explotación pesquera y poner fin a la pesca excesiva, la pesca ilegal, no declarada y no reglamentada y las prácticas pesqueras destructivas, y aplicar planes de gestión con fundamento científico a fin de restablecer las poblaciones de peces en el plazo más breve posible, al menos alcanzando niveles que puedan producir el máximo rendimiento sostenible de acuerdo con sus características biológicas'),
(14, '14.5', 'De aquí a 2020, conservar al menos el 10% de las zonas costeras y marinas, de conformidad con las leyes nacionales y el derecho internacional y sobre la base de la mejor información científica disponible'),
(14, '14.6', 'De aquí a 2020, prohibir ciertas formas de subvenciones a la pesca que contribuyen a la sobrecapacidad y la pesca excesiva, eliminar las subvenciones que contribuyen a la pesca ilegal, no declarada y no reglamentada y abstenerse de introducir nuevas subvenciones de esa índole, reconociendo que la negociación sobre las subvenciones a la pesca en el marco de la Organización Mundial del Comercio debe incluir un trato especial y diferenciado, apropiado y efectivo para los países en desarrollo y los países menos adelantados'),
(14, '14.7', 'De aquí a 2030, aumentar los beneficios económicos que los pequeños Estados insulares en desarrollo y los países menos adelantados obtienen del uso sostenible de los recursos marinos, en particular mediante la gestión sostenible de la pesca, la acuicultura y el turismo'),
(14, '14.a', 'Aumentar los conocimientos científicos, desarrollar la capacidad de investigación y transferir tecnología marina, teniendo en cuenta los Criterios y Directrices para la Transferencia de Tecnología Marina de la Comisión Oceanográfica Intergubernamental, a fin de mejorar la salud de los océanos y potenciar la contribución de la biodiversidad marina al desarrollo de los países en desarrollo, en particular los pequeños Estados insulares en desarrollo y los países menos adelantados'),
(14, '14.b', 'Facilitar el acceso de los pescadores artesanales a los recursos marinos y los mercados'),
(14, '14.c', 'Mejorar la conservación y el uso sostenible de los océanos y sus recursos aplicando el derecho internacional reflejado en la Convención de las Naciones Unidas sobre el Derecho del Mar, que constituye el marco jurídico para la conservación y la utilización sostenible de los océanos y sus recursos, como se recuerda en el párrafo 158 del documento El futuro que queremos');

-- Insertar Metas del OBJETIVO 15
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(15, '15.1', 'De aquí a 2020, asegurar la conservación, el restablecimiento y el uso sostenible de los ecosistemas terrestres y los ecosistemas interiores de agua dulce y sus servicios, en particular los bosques, los humedales, las montañas y las zonas áridas, en consonancia con las obligaciones contraídas en virtud de acuerdos internacionales'),
(15, '15.2', 'De aquí a 2020, promover la puesta en práctica de la gestión sostenible de todos los tipos de bosques, detener la deforestación, recuperar los bosques degradados y aumentar considerablemente la forestación y la reforestación a nivel mundial'),
(15, '15.3', 'De aquí a 2030, luchar contra la desertificación, rehabilitar las tierras y los suelos degradados, incluidas las tierras afectadas por la desertificación, la sequía y las inundaciones, y procurar lograr un mundo con efecto neutro en la degradación de las tierras'),
(15, '15.4', 'De aquí a 2030, asegurar la conservación de los ecosistemas montañosos, incluida su diversidad biológica, a fin de mejorar su capacidad de proporcionar beneficios esenciales para el desarrollo sostenible'),
(15, '15.5', 'Adoptar medidas urgentes y significativas para reducir la degradación de los hábitats naturales, detener la pérdida de biodiversidad y, de aquí a 2020, proteger las especies amenazadas y evitar su extinción'),
(15, '15.6', 'Promover la participación justa y equitativa en los beneficios derivados de la utilización de los recursos genéticos y promover el acceso adecuado a esos recursos, según lo convenido internacionalmente'),
(15, '15.7', 'Adoptar medidas urgentes para poner fin a la caza furtiva y el tráfico de especies protegidas de flora y fauna y abordar tanto la demanda como la oferta de productos ilegales de flora y fauna silvestres'),
(15, '15.8', 'De aquí a 2020, adoptar medidas para prevenir la introducción de especies exóticas invasoras y reducir significativamente sus efectos en los ecosistemas terrestres y acuáticos y controlar o erradicar las especies prioritarias'),
(15, '15.9', 'De aquí a 2020, integrar los valores de los ecosistemas y la biodiversidad en la planificación, los procesos de desarrollo, las estrategias de reducción de la pobreza y la contabilidad nacionales y locales'),
(15, '15.a', 'Movilizar y aumentar significativamente los recursos financieros procedentes de todas las fuentes para conservar y utilizar de forma sostenible la biodiversidad y los ecosistemas'),
(15, '15.b', 'Movilizar recursos considerables de todas las fuentes y a todos los niveles para financiar la gestión forestal sostenible y proporcionar incentivos adecuados a los países en desarrollo para que promuevan dicha gestión, en particular con miras a la conservación y la reforestación'),
(15, '15.c', 'Aumentar el apoyo mundial a la lucha contra la caza furtiva y el tráfico de especies protegidas, incluso aumentando la capacidad de las comunidades locales para perseguir oportunidades de subsistencia sostenibles');

-- Insertar Metas del OBJETIVO 16
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(16, '16.1', 'Reducir significativamente todas las formas de violencia y las correspondientes tasas de mortalidad en todo el mundo'),
(16, '16.2', 'Poner fin al maltrato, la explotación, la trata y todas las formas de violencia y tortura contra los niños'),
(16, '16.3', 'Promover el estado de derecho en los planos nacional e internacional y garantizar la igualdad de acceso a la justicia para todos'),
(16, '16.4', 'De aquí a 2030, reducir significativamente las corrientes financieras y de armas ilícitas, fortalecer la recuperación y devolución de los activos robados y luchar contra todas las formas de delincuencia organizada'),
(16, '16.5', 'Reducir considerablemente la corrupción y el soborno en todas sus formas'),
(16, '16.6', 'Crear a todos los niveles instituciones eficaces y transparentes que rindan cuentas'),
(16, '16.7', 'Garantizar la adopción en todos los niveles de decisiones inclusivas, participativas y representativas que respondan a las necesidades'),
(16, '16.8', 'Ampliar y fortalecer la participación de los países en desarrollo en las instituciones de gobernanza mundial'),
(16, '16.9', 'De aquí a 2030, proporcionar acceso a una identidad jurídica para todos, en particular mediante el registro de nacimientos'),
(16, '16.10', 'Garantizar el acceso público a la información y proteger las libertades fundamentales, de conformidad con las leyes nacionales y los acuerdos internacionales'),
(16, '16.a', 'Fortalecer las instituciones nacionales pertinentes, incluso mediante la cooperación internacional, para crear a todos los niveles, particularmente en los países en desarrollo, la capacidad de prevenir la violencia y combatir el terrorismo y la delincuencia'),
(16, '16.b', 'Promover y aplicar leyes y políticas no discriminatorias en favor del desarrollo sostenible');

-- Insertar Metas del OBJETIVO 17
INSERT INTO metas (objetivo_id, codigo, descripcion) VALUES
(17, '17.1', 'Fortalecer la movilización de recursos internos, incluso mediante la prestación de apoyo internacional a los países en desarrollo, con el fin de mejorar la capacidad nacional para recaudar ingresos fiscales y de otra índole'),
(17, '17.2', 'Velar por que los países desarrollados cumplan plenamente sus compromisos en relación con la asistencia oficial para el desarrollo, incluido el compromiso de numerosos países desarrollados de alcanzar el objetivo de destinar el 0,7% del ingreso nacional bruto a la asistencia oficial para el desarrollo de los países en desarrollo y entre el 0,15% y el 0,20% del ingreso nacional bruto a la asistencia oficial para el desarrollo de los países menos adelantados; se alienta a los proveedores de asistencia oficial para el desarrollo a que consideren la posibilidad de fijar una meta para destinar al menos el 0,20% del ingreso nacional bruto a la asistencia oficial para el desarrollo de los países menos adelantados'),
(17, '17.3', 'Movilizar recursos financieros adicionales de múltiples fuentes para los países en desarrollo'),
(17, '17.4', 'Ayudar a los países en desarrollo a lograr la sostenibilidad de la deuda a largo plazo con políticas coordinadas orientadas a fomentar la financiación, el alivio y la reestructuración de la deuda, según proceda, y hacer frente a la deuda externa de los países pobres muy endeudados a fin de reducir el endeudamiento excesivo'),
(17, '17.5', 'Adoptar y aplicar sistemas de promoción de las inversiones en favor de los países menos adelantados'),
(17, '17.6', 'Mejorar la cooperación regional e internacional Norte-Sur, Sur-Sur y triangular en materia de ciencia, tecnología e innovación y el acceso a estas, y aumentar el intercambio de conocimientos en condiciones mutuamente convenidas, incluso mejorando la coordinación entre los mecanismos existentes, en particular a nivel de las Naciones Unidas, y mediante un mecanismo mundial de facilitación de la tecnología'),
(17, '17.7', 'Promover el desarrollo de tecnologías ecológicamente racionales y su transferencia, divulgación y difusión a los países en desarrollo en condiciones favorables, incluso en condiciones concesionarias y preferenciales, según lo convenido de mutuo acuerdo'),
(17, '17.8', 'Poner en pleno funcionamiento, a más tardar en 2017, el banco de tecnología y el mecanismo de apoyo a la creación de capacidad en materia de ciencia, tecnología e innovación para los países menos adelantados y aumentar la utilización de tecnologías instrumentales, en particular la tecnología de la información y las comunicaciones'),
(17, '17.9', 'Aumentar el apoyo internacional para realizar actividades de creación de capacidad eficaces y específicas en los países en desarrollo a fin de respaldar los planes nacionales de implementación de todos los objetivos de Desarrollo Sostenible, incluso mediante la cooperación Norte-Sur, Sur-Sur y triangular'),
(17, '17.10', 'Promover un sistema de comercio multilateral universal, basado en normas, abierto, no discriminatorio y equitativo en el marco de la Organización Mundial del Comercio, incluso mediante la conclusión de las negociaciones en el marco del Programa de Doha para el Desarrollo'),
(17, '17.11', 'Aumentar significativamente las exportaciones de los países en desarrollo, en particular con miras a duplicar la participación de los países menos adelantados en las exportaciones mundiales de aquí a 2020'),
(17, '17.12', 'Lograr la consecución oportuna del acceso a los mercados libre de derechos y contingentes de manera duradera para todos los países menos adelantados, conforme a las decisiones de la Organización Mundial del Comercio, incluso velando por que las normas de origen preferenciales aplicables a las importaciones de los países menos adelantados sean transparentes y sencillas y contribuyan a facilitar el acceso a los mercados'),
(17, '17.13', 'Aumentar la estabilidad macroeconómica mundial, incluso mediante la coordinación y coherencia de las políticas'),
(17, '17.14', 'Mejorar la coherencia de las políticas para el desarrollo sostenible'),
(17, '17.15', 'Respetar el margen normativo y el liderazgo de cada país para establecer y aplicar políticas de erradicación de la pobreza y desarrollo sostenible'),
(17, '17.16', 'Mejorar la Alianza Mundial para el Desarrollo Sostenible, complementada por alianzas entre múltiples interesados que movilicen e intercambien conocimientos, especialización, tecnología y recursos financieros, a fin de apoyar el logro de los objetivos de Desarrollo Sostenible en todos los países, particularmente los países en desarrollo'),
(17, '17.17', 'Fomentar y promover la constitución de alianzas eficaces en las esferas pública, público-privada y de la sociedad civil, aprovechando la experiencia y las estrategias de obtención de recursos de las alianzas'),
(17, '17.18', 'De aquí a 2020, mejorar el apoyo a la creación de capacidad prestado a los países en desarrollo, incluidos los países menos adelantados y los pequeños Estados insulares en desarrollo, para aumentar significativamente la disponibilidad de datos oportunos, fiables y de gran calidad desglosados por ingresos, sexo, edad, raza, origen étnico, estatus migratorio, discapacidad, ubicación geográfica y otras características pertinentes en los contextos nacionales'),
(17, '17.19', 'De aquí a 2030, aprovechar las iniciativas existentes para elaborar indicadores que permitan medir los progresos en materia de desarrollo sostenible y complementen el producto interno bruto, y apoyar la creación de capacidad estadística en los países en desarrollo');
