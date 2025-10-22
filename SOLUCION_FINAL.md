# ✅ Solución Final: Sistema de Auto-Reparación de Perfiles

## 🎯 Problema Resuelto

Los usuarios externos (empresas) obtenían error 403 al intentar acceder a sus matches porque faltaba su registro en la tabla `Participantes_Externos`.

## 🔧 Solución Implementada

### Cambios en el Código

**Archivo modificado**: `backend/src/middleware/authMiddleware.ts`

El middleware `authenticateToken` ahora:

1. **Detecta automáticamente** cuando un usuario no tiene su perfil correspondiente
2. **Crea el perfil automáticamente** con datos por defecto
3. **Permite que el usuario continúe** sin errores

### Características de la Solución

✅ **Sin edición manual de BD**: No necesitas ejecutar scripts SQL
✅ **Transparente**: El usuario solo necesita cerrar sesión y volver a iniciar
✅ **Auto-reparación**: Si falta un perfil, se crea automáticamente
✅ **Seguro para admins**: Los administradores no necesitan perfil y no se les crea uno

## 📋 Instrucciones para Usuarios Afectados

### Para Usuarios Externos (Empresas)

Si ves el error "Error al cargar matches" o error 403:

1. **Cierra sesión** (botón "Salir" en el navbar)
2. **Vuelve a iniciar sesión** con tu email y contraseña
3. **Accede a Matches** (icono ✨ en el navbar)
4. ✅ Ahora deberías ver tus matches sin errores

### Para Usuarios UNSA

El mismo proceso aplica si tienes problemas:

1. Cierra sesión
2. Vuelve a iniciar sesión
3. Accede a tus matches

## 🔍 Verificación del Sistema

### Opción 1: Verificar en phpMyAdmin (Solo Lectura)

Ejecuta el script `VERIFICAR_USUARIOS_SIN_PERFIL.sql` en phpMyAdmin para ver:
- Qué usuarios tienen perfiles
- Qué usuarios necesitan auto-reparación
- Estado general del sistema

**Este script NO modifica nada**, solo consulta.

### Opción 2: Verificar en los Logs del Backend

Cuando un usuario sin perfil inicia sesión, verás en la consola del backend:

```
⚠️ Usuario externo 14 sin perfil. Creando automáticamente...
✅ Perfil creado automáticamente: participante_id=15
```

## 🚀 Reiniciar el Backend

Para aplicar los cambios, reinicia el backend:

```bash
cd backend
npm run dev
```

O si usas PM2:
```bash
pm2 restart backend
```

## 📊 Datos Creados Automáticamente

Cuando se crea un perfil automáticamente, se usan estos valores por defecto:

### Para Usuarios Externos:
- `helice_id`: 2 (Empresas)
- `nombres_apellidos`: "Perfil pendiente"
- `cargo`: "Por completar"
- `organizacion`: "Por completar"
- `telefono`: NULL

### Para Usuarios UNSA:
- `nombres_apellidos`: "Perfil pendiente"
- `cargo`: "Por completar"
- `unidad_academica`: "Por completar"
- `telefono`: NULL

## 🔄 Actualizar Datos del Perfil (Opcional)

Si necesitas actualizar los datos creados automáticamente:

```sql
-- Para usuarios externos
UPDATE Participantes_Externos 
SET 
    nombres_apellidos = 'Nombre Real',
    organizacion = 'Organización Real',
    cargo = 'Cargo Real',
    helice_id = 2  -- 1=Academia, 2=Empresas, 3=Gobierno, 4=Sociedad
WHERE usuario_id = X;  -- Reemplaza X con el usuario_id

-- Para usuarios UNSA
UPDATE Investigadores_UNSA 
SET 
    nombres_apellidos = 'Nombre Real',
    cargo = 'Cargo Real',
    unidad_academica = 'Unidad Real'
WHERE usuario_id = X;  -- Reemplaza X con el usuario_id
```

## 🐛 Solución de Problemas

### Problema: Aún veo error 403 después de cerrar sesión

**Solución**:
1. Verifica que el backend se haya reiniciado correctamente
2. Borra las cookies del navegador (F12 → Application → Cookies)
3. Cierra todas las pestañas de la aplicación
4. Vuelve a abrir e iniciar sesión

### Problema: Error 500 en la agenda

**Causa**: Las tablas `Dias_Evento` y `Sesiones_Evento` están vacías o no existen.

**Solución**: El admin debe crear días y sesiones desde el panel de administración.

### Problema: El perfil se crea pero con la hélice incorrecta

**Solución**: Actualiza manualmente en phpMyAdmin:

```sql
UPDATE Participantes_Externos 
SET helice_id = 1  -- Cambia según corresponda
WHERE usuario_id = X;
```

## ✅ Checklist de Verificación

- [ ] Backend reiniciado con los cambios
- [ ] Usuario cierra sesión
- [ ] Usuario vuelve a iniciar sesión
- [ ] Se verifica en logs que se creó el perfil (si faltaba)
- [ ] Usuario puede acceder a Matches sin error 403
- [ ] Usuario puede ver sus desafíos
- [ ] Admin puede activar/desactivar matching

## 📝 Notas Técnicas

### Flujo de Auto-Reparación

1. Usuario inicia sesión → Token JWT generado
2. Usuario accede a una ruta protegida → `authenticateToken` middleware
3. Middleware verifica si existe perfil:
   - ✅ Existe → Continúa normalmente
   - ❌ No existe → Crea perfil automáticamente → Continúa
4. Controlador recibe `req.profileId` válido
5. Operación se completa exitosamente

### Seguridad

- Solo se crean perfiles para usuarios autenticados
- Los datos por defecto son seguros y no exponen información
- El admin nunca tiene perfil creado (no lo necesita)
- Los perfiles se crean con restricciones de integridad referencial

## 🎉 Resultado Final

**Antes**: 
- ❌ Usuarios sin perfil → Error 403
- ❌ Necesitabas ejecutar scripts SQL manualmente
- ❌ Proceso manual y propenso a errores

**Ahora**:
- ✅ Usuarios sin perfil → Perfil creado automáticamente
- ✅ Solo necesitan cerrar sesión y volver a iniciar
- ✅ Sistema se auto-repara sin intervención manual

---

## 🆘 Soporte

Si después de seguir estos pasos aún tienes problemas:

1. Verifica los logs del backend (consola donde corre `npm run dev`)
2. Ejecuta `VERIFICAR_USUARIOS_SIN_PERFIL.sql` en phpMyAdmin
3. Verifica que el token JWT contenga el `participante_id` en https://jwt.io
4. Revisa la consola del navegador (F12) para ver errores específicos

---

✅ **Sistema funcionando sin necesidad de editar la base de datos manualmente**
