# 🔧 Solución: Error 403 en Matches de Empresas

## Problema Identificado

✅ **Usuarios UNSA**: Funcionan correctamente
❌ **Usuarios Externos (Empresas)**: Error 403 Forbidden

## Causa del Problema

Los usuarios externos no tienen un registro en la tabla `Participantes_Externos`, por lo tanto no tienen `participante_id`, lo cual es requerido para obtener sus matches.

## 🛠️ Solución Paso a Paso

### Paso 1: Verificar el Problema

Ejecuta en **phpMyAdmin**:

```sql
SELECT 
    u.usuario_id,
    u.email,
    u.rol,
    pe.participante_id,
    CASE 
        WHEN pe.participante_id IS NULL THEN '❌ FALTA PERFIL'
        ELSE '✅ OK'
    END as estado
FROM Usuarios u
LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo';
```

**Si ves usuarios con "❌ FALTA PERFIL"**, continúa con el Paso 2.

### Paso 2: Crear los Perfiles Faltantes

Ejecuta en **phpMyAdmin**:

```sql
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
    2, -- Hélice Empresarial (2)
    CONCAT('Usuario ', u.email),
    'Sin especificar',
    'Sin especificar',
    NULL
FROM Usuarios u
WHERE u.rol = 'externo' 
  AND u.usuario_id NOT IN (SELECT usuario_id FROM Participantes_Externos);
```

### Paso 3: Verificar que se Crearon

```sql
SELECT 
    u.usuario_id,
    u.email,
    pe.participante_id,
    pe.nombres_apellidos,
    pe.organizacion
FROM Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
WHERE u.rol = 'externo';
```

Todos los usuarios externos deberían tener ahora un `participante_id`.

### Paso 4: Cerrar Sesión y Volver a Iniciar

**IMPORTANTE**: Después de crear los perfiles en la base de datos:

1. En la aplicación web, haz clic en **Salir**
2. Vuelve a **Iniciar Sesión** con tu cuenta de empresa
3. Intenta acceder a **Matches** nuevamente

Esto regenerará el token JWT con el `participante_id` correcto.

### Paso 5: Probar los Matches

1. Ve a la página de **Matches** (icono ✨ en el navbar)
2. Deberías ver:
   - Capacidades UNSA que coinciden con tus desafíos
   - Información de cada match
   - Palabras clave coincidentes

## 📋 Verificación Final

Ejecuta este SQL para confirmar que todo está correcto:

```sql
-- Ver todos los usuarios externos con sus perfiles
SELECT 
    u.usuario_id,
    u.email,
    pe.participante_id,
    pe.nombres_apellidos,
    pe.organizacion,
    pe.helice_id,
    h.nombre as helice_nombre
FROM Usuarios u
JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
JOIN Helices h ON pe.helice_id = h.helice_id
WHERE u.rol = 'externo';
```

## 🎯 Resultado Esperado

Después de seguir estos pasos:

✅ Los usuarios externos pueden acceder a `/desafio/mis-matches`
✅ Se muestran las capacidades UNSA que coinciden con sus desafíos
✅ No hay errores 403
✅ Los matches se ordenan por relevancia

## 🔍 Si el Problema Persiste

Si después de seguir estos pasos aún tienes el error 403:

1. **Verifica en la consola del navegador** (F12 → Network):
   - Busca la petición a `/api/matches/my-matches`
   - Verifica que el header `Authorization` esté presente
   - Copia el token y decodifícalo en https://jwt.io

2. **Verifica los logs del backend**:
   - Deberías ver: `=== DEBUG getMyMatchesController ===`
   - Verifica que `participante_id` tenga un valor

3. **Ejecuta esta consulta** con tu email:
   ```sql
   SELECT 
       u.usuario_id,
       u.email,
       u.rol,
       pe.participante_id,
       pe.nombres_apellidos
   FROM Usuarios u
   LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
   WHERE u.email = 'TU_EMAIL_AQUI';
   ```

## 💡 Explicación Técnica

El sistema de matching funciona así:

1. **Usuario inicia sesión** → Se genera un token JWT con `userId` y `rol`
2. **Usuario accede a matches** → El middleware `authenticateToken`:
   - Verifica el token
   - Busca el `participante_id` en la tabla `Participantes_Externos`
   - Lo agrega a `req.user.participante_id` y `req.profileId`
3. **Controlador obtiene matches** → Usa el `participante_id` para buscar coincidencias

Si el usuario no tiene registro en `Participantes_Externos`, el paso 2 falla y no se puede obtener el `participante_id`, resultando en un error 403.

## 📝 Notas Importantes

- Los usuarios externos **deben** tener un registro en `Participantes_Externos`
- Los usuarios UNSA **deben** tener un registro en `Investigadores_UNSA`
- Los administradores **no necesitan** perfil adicional
- Después de cualquier cambio en la BD, **cierra sesión y vuelve a iniciar**

## ✅ Checklist

- [ ] Ejecuté la consulta de verificación
- [ ] Identifiqué usuarios sin perfil
- [ ] Ejecuté el INSERT para crear perfiles
- [ ] Verifiqué que se crearon correctamente
- [ ] Cerré sesión en la aplicación
- [ ] Volví a iniciar sesión
- [ ] Probé acceder a Matches
- [ ] ✅ ¡Funciona!
