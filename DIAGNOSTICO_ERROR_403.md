# 🔍 Diagnóstico Error 403 - Forbidden

## Error Reportado
```
Failed to load resource: the server responded with a status of 403 (Forbidden)
Error fetching matches: Error: Error al cargar matches
```

## Posibles Causas

### 1. Token no válido o expirado
- El token JWT puede haber expirado
- El token no se está enviando correctamente en el header

### 2. Usuario sin perfil asociado
- Usuario externo sin `participante_id`
- Usuario UNSA sin `investigador_id`

### 3. Problema en el middleware de autenticación
- El middleware no está agregando correctamente el `user` o `profileId`

## 🔧 Pasos para Diagnosticar

### Paso 1: Verificar en la consola del navegador

Abre las **DevTools** (F12) y ve a la pestaña **Network**:

1. Recarga la página de matches
2. Busca la petición a `/api/matches/my-matches`
3. Haz clic en ella
4. Ve a la pestaña **Headers**
5. Verifica que exista el header `Authorization: Bearer [token]`

### Paso 2: Verificar el token

En la consola del navegador, ejecuta:

```javascript
// Ver el token almacenado
document.cookie.split(';').find(c => c.includes('token'))

// O si usas js-cookie
Cookies.get('token')
```

### Paso 3: Verificar los logs del backend

En la terminal donde corre el backend, deberías ver:

```
=== DEBUG getMyMatchesController ===
User: { userId: X, rol: 'externo', participante_id: Y }
ProfileId: Y
Matching activo: true/false
...
```

Si no ves estos logs, el endpoint no se está ejecutando.

### Paso 4: Verificar en la base de datos

Ejecuta en phpMyAdmin:

```sql
-- Verificar que el usuario tenga perfil asociado
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    iu.investigador_id
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
WHERE u.email = 'TU_EMAIL_AQUI';
```

**Resultado esperado:**
- Si eres externo: `participante_id` debe tener un valor
- Si eres UNSA: `investigador_id` debe tener un valor

## 🛠️ Soluciones

### Solución 1: Cerrar sesión y volver a iniciar

1. Haz clic en **Salir** en el navbar
2. Vuelve a iniciar sesión
3. Intenta acceder a matches nuevamente

Esto regenerará el token con la información correcta.

### Solución 2: Verificar que el usuario tenga perfil

Si el usuario no tiene `participante_id` o `investigador_id`:

```sql
-- Para usuario externo sin participante_id
INSERT INTO Participantes_Externos (usuario_id, nombres_apellidos, helice_id)
VALUES (
    (SELECT usuario_id FROM Usuarios WHERE email = 'TU_EMAIL'),
    'Nombre Completo',
    1  -- ID de la hélice correspondiente
);

-- Para usuario UNSA sin investigador_id
INSERT INTO Investigadores_UNSA (usuario_id, nombres_apellidos, unidad_academica)
VALUES (
    (SELECT usuario_id FROM Usuarios WHERE email = 'TU_EMAIL'),
    'Nombre Completo',
    'Unidad Académica'
);
```

### Solución 3: Verificar que la tabla estado_matching exista

```sql
-- Verificar tabla
SELECT * FROM estado_matching;

-- Si no existe, crearla
CREATE TABLE IF NOT EXISTS estado_matching (
    id INT PRIMARY KEY DEFAULT 1,
    activo BOOLEAN NOT NULL DEFAULT FALSE,
    fecha_activacion DATETIME NULL,
    CONSTRAINT chk_single_row CHECK (id = 1)
);

INSERT INTO estado_matching (id, activo) VALUES (1, FALSE)
ON DUPLICATE KEY UPDATE id = id;
```

### Solución 4: Reiniciar el backend

A veces los cambios en el código requieren reiniciar:

```bash
# Detén el servidor (Ctrl+C)
# Vuelve a iniciarlo
cd backend
npm run dev
```

## 📋 Checklist de Verificación

- [ ] El token existe en las cookies
- [ ] El header Authorization se envía en la petición
- [ ] El usuario tiene `participante_id` o `investigador_id` en la BD
- [ ] La tabla `estado_matching` existe
- [ ] El backend está corriendo sin errores
- [ ] Los logs del backend muestran el debug
- [ ] El usuario tiene el rol correcto (externo o unsa)

## 🔍 Información Adicional Necesaria

Para ayudarte mejor, necesito saber:

1. **¿Qué rol tiene tu usuario?** (admin, externo, unsa)
2. **¿Ves los logs de debug en la terminal del backend?**
3. **¿El token aparece en las cookies del navegador?**
4. **¿Qué muestra la consulta SQL de verificación de perfil?**

## 📞 Siguiente Paso

Por favor, ejecuta estos comandos y comparte los resultados:

### En phpMyAdmin:
```sql
-- Reemplaza 'tu_email@ejemplo.com' con tu email real
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    iu.investigador_id
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
LEFT JOIN Investigadores_UNSA iu ON u.usuario_id = iu.usuario_id
WHERE u.email = 'tu_email@ejemplo.com';

-- Verificar estado del matching
SELECT * FROM estado_matching;
```

### En la consola del navegador (F12):
```javascript
// Ver el token
console.log('Token:', Cookies.get('token'));

// Ver si hay usuario en localStorage
console.log('User:', localStorage.getItem('user'));
```

Con esta información podré ayudarte a resolver el problema específico.
