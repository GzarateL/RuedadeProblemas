-- Tabla para controlar el estado del sistema de matching
CREATE TABLE IF NOT EXISTS estado_matching (
    id INT PRIMARY KEY DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_activacion DATETIME NULL,
    CONSTRAINT chk_single_row CHECK (id = 1)
);

-- Insertar el registro inicial
INSERT INTO estado_matching (id, activo) VALUES (1, FALSE)
ON DUPLICATE KEY UPDATE id = id;
