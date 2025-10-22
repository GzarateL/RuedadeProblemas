# 🔧 Solución: Auto-Reparación de Perfiles Faltantes

## ✅ Problema Resuelto

Los usuarios externos (empresas) no podían acceder a sus matches porque faltaba su registro en `Participantes_Externos`, lo que causaba un error 403.

## 🎯 Solución Implementada

**El sistema ahora se auto-repara automáticamente** sin necesidad de editar la base de datos manualmente.

### ¿Cómo funciona?

Cuando un usuario inicia sesión, el middleware de autenticación (`authMiddleware.ts`) ahora:

1. **Verifica** si el usuario tiene su perfil correspondiente:
   - Usuarios externos → `Participantes_Externos`
   - Usuarios UNSA → `Investigadores_UNSA`

2. **Si NO encuentra el perfil**, lo **crea automáticamente** con datos por defecto:
   - `nombres_apellidos`: "Perfil pendiente"
   - `cargo`: "Por completar"
   - `organizacion`: "Por completar" (solo externos)
   - `helice_id`: 2 (Empresas, por defecto)

3. **Continúa normalmente** con la autenticación, permitiendo al usuario acceder a todas las funcionalidades.

## 📋 Instrucciones para Usuarios Afectados

Si un usuario externo tiene problemas para ver sus matches:

### Paso 1: Cerrar Sesión
- Haz clic en el botón **"Salir"** en el navbar

### Paso 2: Volver a Iniciar Sesión
- Ingresa tu email y contraseña
- El sistema detectará automáticamente que falta tu perfil
- Lo creará en segundo plano (verás un mensaje en los logs del servidor)

### Paso 3: Acceder a Matches
- Ve a la página de **Matches** (icono ✨)
- Ahora deberías ver tus matches sin error 403

### Paso 4 (Opcional): Completar Perfil
- El perfil se crea con datos temporales
- Puedes actualizarlos más tarde desde tu perfil de usuario

## 🔍 Verificación del Sistema

Para verificar qué usuarios tienen perfiles faltantes (sin modificar nada):

1. Abre **phpMyAdmin**
2. Selecciona tu base de datos
3. Ejecuta el script: `VERIFICAR_USUARIOS_SIN_PERFIL.sql`
4. Verás un reporte completo del estado del sistema

Este script **SOLO CONSULTA**, no modifica nada.

## 🛠️ Detalles Técnicos

### Cambios en el Código

**Archivo modificado**: `backend/src/middleware/authMiddleware.ts`

**Antes**:
```typescript
if (profileIdResult.length > 0) {
  req.profileId = profileIdResult[0].participante_id;
  req.user.participante_id = profileIdResult[0].participante_id;
}
// Si no existe, solo muestra un warning pero no hace nada
```

**Ahora**:
```typescript
if (profileIdResult.length > 0) {
  req.profileId = profileIdResult[0].participante_id;
  req.user.participante_id = profileIdResult[0].participante_id;
} else {
  // AUTO-FIX: Crear perfil automáticamente
  const [result] = await dbPool.execute(
    `INSERT INTO Participantes_Externos 
     (usuario_id, helice_id, nombres_apellidos, cargo, organizacion) 
     VALUES (?, 2, 'Perfil pendiente', 'Por completar', 'Por completar')`,
    [req.user.userId]
  );
  req.profileId = result.insertId;
  req.user.participante_id = result.insertId;
}
```

### Logs del Servidor

Cuando se crea un perfil automáticamente, verás en la consola:

```
⚠️ Usuario externo 14 sin perfil. Creando automáticamente...
✅ Perfil creado automáticamente: participante_id=15
```

## 🎯 Ventajas de Esta Solución

✅ **Sin intervención manual**: No necesitas ejecutar scripts SQL manualmente
✅ **Transparente para el usuario**: El usuario solo necesita volver a iniciar sesión
✅ **Previene errores futuros**: Si por alguna razón falta un perfil, se crea automáticamente
✅ **Mantiene la integridad**: Los datos se crean con valores por defecto válidos
✅ **Logs claros**: Puedes ver en el servidor cuándo se crean perfiles automáticamente

## 📊 Casos de Uso

### Caso 1: Usuario Nuevo que se Registra
- ✅ El perfil se crea durante el registro (código existente)
- ✅ No necesita auto-reparación

### Caso 2: Usuario Antiguo sin Perfil
- ⚠️ El perfil falta por alguna razón
- ✅ Se crea automáticamente al hacer login
- ✅ El usuario puede usar el sistema normalmente

### Caso 3: Migración de Datos
- ⚠️ Se importaron usuarios sin sus perfiles
- ✅ Se crean automáticamente cuando cada usuario inicia sesión
- ✅ No necesitas ejecutar scripts de corrección masiva

## 🔄 Reiniciar el Backend

Para aplicar los cambios:

```bash
cd backend
npm run dev
```

O si usas PM2:
```bash
pm2 restart backend
```

## ✅ Prueba de Funcionamiento

1. **Identifica un usuario sin perfil**:
   ```sql
   SELECT u.usuario_id, u.email 
   FROM Usuarios u
   LEFT JOIN Participantes_Externos pe ON u.usuario_id = pe.usuario_id
   WHERE u.rol = 'externo' AND pe.participante_id IS NULL;
   ```

2. **Inicia sesión con ese usuario** en la aplicación web

3. **Verifica en los logs del backend** que aparezca:
   ```
   ⚠️ Usuario externo X sin perfil. Creando automáticamente...
   ✅ Perfil creado automáticamente: participante_id=Y
   ```

4. **Verifica en la BD** que ahora existe el perfil:
   ```sql
   SELECT * FROM Participantes_Externos WHERE usuario_id = X;
   ```

5. **Accede a Matches** y verifica que funcione sin error 403

## 🚨 Notas Importantes

- Los perfiles se crean con `helice_id = 2` (Empresas) por defecto
- Si necesitas otra hélice, puedes actualizar manualmente después:
  ```sql
  UPDATE Participantes_Externos 
  SET helice_id = 1  -- Cambia según corresponda
  WHERE usuario_id = X;
  ```

- Los datos temporales son:
  - `nombres_apellidos`: "Perfil pendiente"
  - `cargo`: "Por completar"
  - `organizacion`: "Por completar"

- Puedes actualizar estos datos más tarde desde el perfil del usuario

## 📝 Resumen

**Antes**: Los usuarios sin perfil obtenían error 403 y necesitabas ejecutar scripts SQL manualmente.

**Ahora**: El sistema detecta y crea automáticamente los perfiles faltantes cuando el usuario inicia sesión.

**Acción requerida**: Solo reiniciar el backend y pedir a los usuarios afectados que cierren sesión y vuelvan a iniciar sesión.

---

✅ **Problema resuelto sin necesidad de editar la base de datos manualmente**
