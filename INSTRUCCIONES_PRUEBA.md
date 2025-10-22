# 🚀 Instrucciones para Probar el Sistema de Matching

## 📋 Paso 1: Configurar la Base de Datos (phpMyAdmin)

1. Abre **phpMyAdmin** en tu navegador (http://localhost/phpmyadmin)
2. Selecciona tu base de datos del proyecto
3. Ve a la pestaña **SQL**
4. Copia y pega el siguiente código:

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

5. Haz clic en **Continuar** para ejecutar el SQL
6. Verifica que la tabla `estado_matching` se haya creado correctamente

## 🔧 Paso 2: Iniciar el Backend

```bash
cd backend
npm run dev
```

Deberías ver:
```
✅ Conexión a la base de datos MySQL exitosa.
🚀 Servidor corriendo en http://localhost:3001
```

## 🎨 Paso 3: Iniciar el Frontend

En otra terminal:

```bash
cd frontend
npm run dev
```

Deberías ver:
```
✓ Ready in X ms
○ Local: http://localhost:3000
```

## ✅ Paso 4: Probar el Sistema

### A. Probar como Administrador

1. Ve a http://localhost:3000/login
2. Inicia sesión con una cuenta de **administrador**
3. Deberías ver en el menú: **Dashboard Admin**
4. Haz clic en **Dashboard Admin**
5. En la parte superior derecha verás:
   - **Botón verde**: "🟢 Iniciar Matching"
   - **Estado**: Inactivo
6. Haz clic en el botón para **activar el matching**
7. El botón debería cambiar a: "🔴 Detener Matching"
8. Deberías ver una notificación de éxito

### B. Probar como Usuario Externo (Empresa/Hélice)

1. Cierra sesión del admin
2. Inicia sesión con una cuenta **externa** (rol: externo)
3. En el menú superior verás:
   - **Mis Desafíos**
   - **Matches** (con icono ✨)
4. Haz clic en **Matches**
5. Si tienes desafíos registrados con palabras clave, verás:
   - Tarjetas con capacidades UNSA que coinciden
   - Número de coincidencias
   - Palabras clave coincidentes
   - Nombre del investigador

**Si no ves matches:**
- Asegúrate de tener desafíos registrados
- Verifica que tus desafíos tengan palabras clave
- Confirma que el matching esté activo (paso A)

### C. Probar como Usuario UNSA (Profesional)

1. Cierra sesión
2. Inicia sesión con una cuenta **UNSA** (rol: unsa)
3. En el menú superior verás:
   - **Mis Capacidades**
   - **Matches** (con icono ✨)
4. Haz clic en **Matches**
5. Si tienes capacidades registradas con palabras clave, verás:
   - Tarjetas con desafíos que coinciden
   - Número de coincidencias
   - Palabras clave coincidentes
   - Nombre del participante y organización

## 🧪 Paso 5: Verificar Funcionalidades

### Verificar Navegación

**Para usuarios externos:**
- Clic en "Mis Desafíos" → Ver lista de desafíos
- Botón "Ver Matches" → Ver matches personalizados
- Botón "Nuevo Desafío" → Registrar nuevo desafío

**Para usuarios UNSA:**
- Clic en "Mis Capacidades" → Ver lista de capacidades
- Botón "Ver Matches" → Ver matches personalizados
- Botón "Nueva Capacidad" → Registrar nueva capacidad

### Verificar el Algoritmo de Matching

El sistema busca coincidencias basándose en **palabras clave**:

1. **Ejemplo para usuario externo:**
   - Tu desafío tiene palabras clave: "inteligencia artificial, machine learning"
   - El sistema buscará capacidades UNSA con esas mismas palabras clave
   - Mostrará las capacidades ordenadas por número de coincidencias

2. **Ejemplo para usuario UNSA:**
   - Tu capacidad tiene palabras clave: "desarrollo web, react, nodejs"
   - El sistema buscará desafíos con esas mismas palabras clave
   - Mostrará los desafíos ordenados por número de coincidencias

## 🐛 Solución de Problemas

### Error: "No autenticado"
- Verifica que hayas iniciado sesión
- Revisa que el token esté guardado en las cookies
- Intenta cerrar sesión y volver a iniciar

### Error: "Sistema de matching no está activo"
- Inicia sesión como administrador
- Ve al Dashboard Admin
- Activa el matching con el botón verde

### No se muestran matches
- Verifica que tengas desafíos/capacidades registrados
- Asegúrate de que tengan palabras clave
- Confirma que existan coincidencias con otros usuarios
- Verifica que el matching esté activo

### Error de conexión a la base de datos
- Verifica que XAMPP esté corriendo
- Confirma que MySQL esté activo
- Revisa las credenciales en `backend/src/config/env.ts`

### Error 500 en el backend
- Revisa los logs en la terminal del backend
- Verifica que la tabla `estado_matching` exista
- Confirma que todas las tablas necesarias estén creadas

## 📊 Verificar en la Base de Datos

Puedes verificar el estado del matching directamente en phpMyAdmin:

```sql
-- Ver el estado actual del matching
SELECT * FROM estado_matching;

-- Ver desafíos con palabras clave
SELECT d.titulo, GROUP_CONCAT(pc.palabra) as palabras_clave
FROM Desafios d
LEFT JOIN Desafios_PalabrasClave dpc ON d.desafio_id = dpc.desafio_id
LEFT JOIN PalabrasClave pc ON dpc.palabra_clave_id = pc.palabra_clave_id
GROUP BY d.desafio_id;

-- Ver capacidades con palabras clave
SELECT c.descripcion_capacidad, GROUP_CONCAT(pc.palabra) as palabras_clave
FROM Capacidades_UNSA c
LEFT JOIN Capacidades_PalabrasClave cpc ON c.capacidad_id = cpc.capacidad_id
LEFT JOIN PalabrasClave pc ON cpc.palabra_clave_id = pc.palabra_clave_id
GROUP BY c.capacidad_id;
```

## 🎯 Flujo Completo de Prueba

1. ✅ Crear tabla en phpMyAdmin
2. ✅ Iniciar backend (puerto 3001)
3. ✅ Iniciar frontend (puerto 3000)
4. ✅ Login como admin → Activar matching
5. ✅ Login como externo → Ver matches de capacidades
6. ✅ Login como UNSA → Ver matches de desafíos
7. ✅ Verificar navegación entre páginas
8. ✅ Probar activar/desactivar matching

## 📝 Notas Importantes

- El matching se calcula en **tiempo real** cada vez que un usuario accede a su página de matches
- Los matches se ordenan por **relevancia** (más coincidencias primero)
- Se muestran hasta **10 matches** por usuario
- El sistema solo funciona cuando está **activo** (botón verde en admin)
- Las palabras clave deben ser **exactamente iguales** para coincidir (no distingue mayúsculas/minúsculas)

## 🎉 ¡Listo!

Si todo funciona correctamente, deberías poder:
- ✅ Activar/desactivar el matching como admin
- ✅ Ver matches personalizados como usuario externo
- ✅ Ver matches personalizados como usuario UNSA
- ✅ Navegar entre las diferentes páginas
- ✅ Ver información detallada de cada match
