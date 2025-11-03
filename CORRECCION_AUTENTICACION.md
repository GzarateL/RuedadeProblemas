# Corrección de Autenticación - Registro Hélice Interna

## Problema Identificado

Al intentar registrar un docente investigador en la hélice interna, se presentaban los siguientes errores:

```
Error 403 (Forbidden): Token inválido o expirado
Error 401 (Unauthorized): En solicitudes pendientes
```

## Causas del Problema

### 1. Middleware de Autenticación Incorrecto

**Problema:**
El middleware `authMiddleware.ts` estaba intentando buscar el perfil del usuario en una tabla `registros_helice_interna` que **NO EXISTE** en la base de datos.

**Código Anterior:**
```typescript
const [heliceRecords] = await dbPool.execute<RowDataPacket[]>(
  'SELECT id FROM registros_helice_interna WHERE usuario_id = ? LIMIT 1',
  [req.user.userId]
);
```

**Solución:**
Actualizar el middleware para buscar en las 4 tablas correctas:
- `Registro_Docente_Investigador`
- `Registro_Grupo_Centro_Instituto`
- `Registro_Laboratorio`
- `Registro_Centro_Produccion`

### 2. Token No Se Encontraba Correctamente

**Problema:**
El formulario estaba buscando el token en `localStorage`, pero el sistema lo guarda en **Cookies** usando `js-cookie`.

**Código Anterior:**
```typescript
const token = localStorage.getItem('token');
```

**Solución:**
Usar `Cookies.get('token')` para obtener el token correctamente.

---

## Cambios Realizados

### 1. Backend: `backend/src/middleware/authMiddleware.ts`

```typescript
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ message: 'Token no proporcionado.' });

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { userId: number; rol: string };
    req.user = payload;

    // Buscar perfil en las tablas correctas
    if (req.user.rol === 'interno') {
      const tablas = [
        'Registro_Docente_Investigador',
        'Registro_Grupo_Centro_Instituto',
        'Registro_Laboratorio',
        'Registro_Centro_Produccion'
      ];
      
      for (const tabla of tablas) {
        try {
          const [records] = await dbPool.execute<RowDataPacket[]>(
            `SELECT registro_id FROM ${tabla} WHERE usuario_id = ? LIMIT 1`,
            [req.user.userId]
          );
          if (records.length > 0) {
            req.profileId = records[0].registro_id;
            req.user.investigador_id = records[0].registro_id;
            break;
          }
        } catch (error) {
          // Continuar con la siguiente tabla
        }
      }
    }

    next();
  } catch (err) {
    console.error("Error al verificar token:", err);
    return res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};
```

### 2. Backend: `backend/src/api/auth/auth.service.ts`

Actualizado el método `verify()` para buscar en las tablas correctas:

```typescript
export const verify = async (token: string) => {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const [users] = await dbPool.execute<RowDataPacket[]>(
      'SELECT usuario_id, email, rol, nombres_apellidos FROM Usuarios WHERE usuario_id = ?',
      [payload.userId]
    );
    if (users.length === 0) {
      throw new Error('El usuario del token ya no existe.');
    }
    
    const user = users[0];
    let profileId = null;
    
    if (user.rol === 'interno') {
      const tablas = [
        'Registro_Docente_Investigador',
        'Registro_Grupo_Centro_Instituto',
        'Registro_Laboratorio',
        'Registro_Centro_Produccion'
      ];
      
      for (const tabla of tablas) {
        try {
          const [records] = await dbPool.execute<RowDataPacket[]>(
            `SELECT registro_id FROM ${tabla} WHERE usuario_id = ? LIMIT 1`,
            [user.usuario_id]
          );
          if (records.length > 0) {
            profileId = records[0].registro_id;
            break;
          }
        } catch (error) {
          // Continuar
        }
      }
    }
    
    return {
      ...user,
      investigador_id: user.rol === 'interno' ? profileId : undefined,
      participante_id: user.rol === 'externo' ? profileId : undefined,
    };
  } catch (error) {
    throw new Error('Token inválido o expirado.');
  }
};
```

### 3. Frontend: `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`

**Importar js-cookie:**
```typescript
import Cookies from "js-cookie";
```

**Obtener token correctamente:**
```typescript
const token = Cookies.get('token');

if (!token) {
  throw new Error('No se encontró el token de autenticación. Por favor, inicie sesión nuevamente.');
}

console.log('Token encontrado:', token ? 'Sí' : 'No');

const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(datosRegistro)
});
```

---

## Flujo de Autenticación Correcto

### 1. Registro de Usuario

```
Usuario → /registro-usuario
  ↓
Crear en tabla Usuarios (rol: 'interno')
  ↓
Auto-login
  ↓
Token guardado en Cookies
  ↓
Usuario guardado en localStorage
```

### 2. Registro de Hélice Interna

```
Usuario autenticado → /registro-helice-interna
  ↓
Seleccionar tipo (docente_investigador)
  ↓
Completar formulario
  ↓
Enviar con token de Cookies
  ↓
Backend valida token
  ↓
Crear registro en Registro_Docente_Investigador
  ↓
Crear registros en tablas compartidas
  ↓
Retornar éxito
```

### 3. Validación de Token

```
Request con Authorization: Bearer <token>
  ↓
authMiddleware extrae token
  ↓
jwt.verify(token)
  ↓
Buscar usuario en tabla Usuarios
  ↓
Si rol='interno', buscar en tablas de hélice interna
  ↓
Agregar profileId a req.user
  ↓
next() → Continuar al controlador
```

---

## Verificación

### 1. Verificar que el Token se Guarda Correctamente

Abrir DevTools → Application → Cookies → localhost:3000

Debe aparecer:
```
Name: token
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Verificar que el Usuario se Guarda en localStorage

Abrir DevTools → Application → Local Storage → localhost:3000

Debe aparecer:
```json
{
  "id": 1,
  "email": "usuario@unsa.edu.pe",
  "rol": "interno",
  "nombres_apellidos": "Juan Pérez"
}
```

### 3. Verificar Logs del Backend

Al enviar el formulario, el backend debe mostrar:
```
✅ Token válido
✅ Usuario encontrado: ID 1
✅ Creando registro en Registro_Docente_Investigador
✅ Registro creado exitosamente
```

### 4. Verificar en Base de Datos

```sql
-- Ver usuario
SELECT * FROM Usuarios WHERE email = 'usuario@unsa.edu.pe';

-- Ver registro de docente
SELECT * FROM Registro_Docente_Investigador WHERE usuario_id = 1;

-- Ver datos OCDE
SELECT * FROM Registro_OCDE WHERE usuario_id = 1;

-- Ver datos ODS
SELECT * FROM Registro_ODS WHERE usuario_id = 1;
```

---

## Comandos para Probar

### 1. Reiniciar Backend

```bash
cd backend
npm run dev
```

### 2. Reiniciar Frontend

```bash
cd frontend
npm run dev
```

### 3. Limpiar Cookies y localStorage (Si es necesario)

En DevTools:
- Application → Cookies → Eliminar todas
- Application → Local Storage → Eliminar todas
- Recargar página

### 4. Flujo de Prueba Completo

1. Ir a `http://localhost:3000/registro-usuario`
2. Crear cuenta:
   - Email: `test@unsa.edu.pe`
   - Password: `123456`
   - Nombre: `Test Usuario`
   - Rol: `Hélice Interna`
3. Automáticamente se hace login
4. Ir a `http://localhost:3000/registro-helice-interna`
5. Seleccionar "Docente/Investigador"
6. Completar formulario
7. Enviar
8. Verificar en consola del navegador: "Registro exitoso"
9. Verificar en base de datos

---

## Errores Comunes y Soluciones

### Error: "Token no proporcionado"

**Causa:** El token no se está enviando en el header
**Solución:** Verificar que `Cookies.get('token')` devuelve un valor

### Error: "Token inválido o expirado"

**Causa:** El token ha expirado (1 día) o es inválido
**Solución:** Hacer logout y login nuevamente

### Error: "No se encontró el token de autenticación"

**Causa:** El usuario no está autenticado
**Solución:** Redirigir a `/login`

### Error: "Usuario no autenticado"

**Causa:** El middleware rechazó el token
**Solución:** Verificar que el JWT_SECRET es el mismo en backend

---

## Archivos Modificados

### Backend:
- ✅ `backend/src/middleware/authMiddleware.ts`
- ✅ `backend/src/api/auth/auth.service.ts`

### Frontend:
- ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`

---

## Estado Actual

✅ **Backend:** Completamente corregido y alineado con la BD
✅ **Autenticación:** Token se obtiene correctamente de Cookies
✅ **Middleware:** Busca en las tablas correctas
✅ **Formulario Docente:** Envía datos correctamente al backend

---

**Fecha:** 2 de noviembre de 2025
**Estado:** Correcciones aplicadas y probadas
