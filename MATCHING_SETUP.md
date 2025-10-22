# Sistema de Matching - Instrucciones de Configuración

## Descripción

Se ha implementado un sistema de matching automático que permite:

- **Para Administradores**: Activar/desactivar el sistema de matching desde el dashboard
- **Para Usuarios Externos (Empresas/Hélice)**: Ver capacidades UNSA que coinciden con sus desafíos
- **Para Usuarios UNSA (Profesionales)**: Ver desafíos que coinciden con sus capacidades

## Instalación

### 1. Ejecutar la migración de base de datos

Ejecuta el siguiente script SQL en tu base de datos MySQL:

```bash
mysql -u tu_usuario -p tu_base_de_datos < backend/migrations/create_estado_matching.sql
```

O ejecuta manualmente el siguiente SQL:

```sql
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
```

### 2. Reiniciar el servidor backend

```bash
cd backend
npm run dev
```

### 3. Reiniciar el servidor frontend

```bash
cd frontend
npm run dev
```

## Uso

### Para Administradores

1. Inicia sesión como administrador
2. Ve al Dashboard Admin
3. Verás un botón "🟢 Iniciar Matching" en la parte superior derecha
4. Haz clic para activar el sistema de matching
5. El botón cambiará a "🔴 Detener Matching" cuando esté activo
6. Los usuarios ahora podrán ver sus matches personalizados

### Para Usuarios Externos (Empresas)

1. Inicia sesión con tu cuenta externa
2. Registra desafíos con palabras clave relevantes
3. En el menú superior, haz clic en "Matches" (icono de estrella ✨)
4. Verás tarjetas con capacidades UNSA que coinciden con tus desafíos
5. Cada tarjeta muestra:
   - Descripción de la capacidad
   - Nombre del investigador
   - Número de coincidencias
   - Palabras clave que coinciden

### Para Usuarios UNSA (Profesionales)

1. Inicia sesión con tu cuenta UNSA
2. Registra capacidades con palabras clave relevantes
3. En el menú superior, haz clic en "Matches" (icono de estrella ✨)
4. Verás tarjetas con desafíos que coinciden con tus capacidades
5. Cada tarjeta muestra:
   - Título del desafío
   - Nombre del participante y organización
   - Descripción breve
   - Número de coincidencias
   - Palabras clave que coinciden

## Características Técnicas

### Backend

- **Nuevos endpoints**:
  - `GET /api/matches/status` - Obtiene el estado del matching (admin)
  - `POST /api/matches/toggle` - Activa/desactiva el matching (admin)
  - `GET /api/matches/my-matches` - Obtiene matches personalizados para el usuario actual

- **Algoritmo de matching**:
  - Basado en coincidencias de palabras clave
  - Ordenado por número de coincidencias (más relevantes primero)
  - Límite de 10 matches por usuario
  - Solo funciona cuando el sistema está activo

### Frontend

- **Nuevas páginas**:
  - `/desafio/mis-matches` - Matches para usuarios externos
  - `/capacidad/mis-matches` - Matches para usuarios UNSA
  - `/desafio` - Lista de desafíos del usuario
  - `/capacidad` - Lista de capacidades del usuario

- **Componentes actualizados**:
  - Dashboard Admin: Botón de activación de matching
  - Navbar: Enlaces a matches y páginas de gestión

## Notas Importantes

- El sistema de matching debe estar activo para que los usuarios vean sus matches
- Los matches se calculan en tiempo real basándose en las palabras clave
- Se recomienda que los usuarios registren palabras clave descriptivas y relevantes
- Los administradores pueden ver el estado del matching en el dashboard

## Solución de Problemas

### Los usuarios no ven matches

1. Verifica que el sistema de matching esté activo (botón verde en dashboard admin)
2. Asegúrate de que los usuarios hayan registrado desafíos/capacidades con palabras clave
3. Verifica que la tabla `estado_matching` exista en la base de datos

### Error al activar el matching

1. Verifica que la migración de base de datos se haya ejecutado correctamente
2. Revisa los logs del servidor backend
3. Asegúrate de que el usuario tenga rol de administrador

### Matches vacíos

1. Los usuarios deben tener desafíos/capacidades registrados con palabras clave
2. Debe haber coincidencias entre las palabras clave de desafíos y capacidades
3. El sistema de matching debe estar activo
