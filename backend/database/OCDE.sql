-- Tabla para Áreas
CREATE TABLE areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL
);

-- Tabla para Sub-áreas
CREATE TABLE sub_areas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    area_id INT NOT NULL,
    FOREIGN KEY (area_id) REFERENCES areas(id) ON DELETE CASCADE
);

-- Tabla para Disciplinas
CREATE TABLE disciplinas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    sub_area_id INT NOT NULL,
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id) ON DELETE CASCADE
);

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
