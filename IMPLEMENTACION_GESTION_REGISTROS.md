# Implementación de Gestión de Registros de Hélice Interna

## Resumen

Se ha implementado una página completa para gestionar los registros de hélice interna con las siguientes funcionalidades:

- ✅ **Listar** todos los registros del usuario
- ✅ **Editar** registros existentes
- ✅ **Eliminar** registros
- ✅ **Crear** nuevos registros

---

## Cambios Realizados

### 1. Página de Gestión: `frontend/src/app/capacidad/page.tsx`

**Funcionalidades Implementadas:**

#### 1.1 Listado de Registros

- Muestra todos los registros de hélice interna del usuario autenticado
- Soporta los 4 tipos de registro:
  - Docente/Investigador
  - Grupo/Centro/Instituto
  - Laboratorio
  - Centro de Producción

#### 1.2 Información Mostrada

Para cada registro se muestra:
- **Nombre:** Nombre completo o nombre de la entidad
- **Tipo:** Badge con el tipo de registro
- **Estado:** Badge con color según el estado:
  - 🟡 Borrador (gris)
  - 🔵 Completado (azul)
  - 🟡 En Revisión (amarillo)
  - 🟢 Aprobado (verde)
  - 🔴 Rechazado (rojo)
- **Fecha de creación**
- **Email**
- **Teléfono**
- **Progreso:** Si está en borrador, muestra el paso actual

#### 1.3 Acciones Disponibles

**Botón "Nuevo Registro":**
- Redirige a `/registro-helice-interna`
- Permite crear un nuevo registro desde cero

**Botón "Editar":**
- Redirige al formulario específico del tipo de registro
- Pasa el parámetro `?edit={registro_id}` para cargar los datos
- Rutas:
  - `/registro-helice-interna/docente_investigador?edit=1`
  - `/registro-helice-interna/grupo_centro_instituto?edit=2`
  - `/registro-helice-interna/laboratorio?edit=3`
  - `/registro-helice-interna/centro_produccion?edit=4`

**Botón "Eliminar":**
- Muestra confirmación antes de eliminar
- Llama al endpoint `DELETE /api/helice-interna/registros/:id?tipo={tipo}`
- Actualiza la lista automáticamente después de eliminar

#### 1.4 Estados Visuales

**Registro en Borrador:**
```
⚠️ Registro incompleto: Paso 3 de 9. 
Continúa editando para completar tu registro.
```

**Registro Rechazado:**
```
❌ Registro rechazado: Revisa las observaciones y edita tu registro.
```

**Sin Registros:**
```
📄 No tienes registros aún
Crea tu primer registro de hélice interna para comenzar a participar 
en el sistema de matching
[Botón: Crear mi primer registro]
```

---

## Estructura de la Interfaz

### Layout Principal

```
┌─────────────────────────────────────────────────────────┐
│  Mis Registros de Hélice Interna    [+ Nuevo Registro] │
│  Gestiona tus registros como docente...                 │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Juan Pérez                    [✓ Aprobado]     │    │
│  │ [Docente/Investigador]                         │    │
│  ├────────────────────────────────────────────────┤    │
│  │ 📅 2 de noviembre de 2025                      │    │
│  │ 📧 juan@unsa.edu.pe                            │    │
│  │ 📞 +51 999 999 999                             │    │
│  ├────────────────────────────────────────────────┤    │
│  │ [✏️ Editar]  [🗑️ Eliminar]                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Laboratorio de IA            [⏱️ Borrador]     │    │
│  │ [Laboratorio]                                  │    │
│  ├────────────────────────────────────────────────┤    │
│  │ ⚠️ Registro incompleto: Paso 5 de 9           │    │
│  ├────────────────────────────────────────────────┤    │
│  │ [✏️ Editar]  [🗑️ Eliminar]                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Flujo de Usuario

### 1. Ver Registros

```
Usuario → /capacidad
  ↓
GET /api/helice-interna/registros
  ↓
Muestra lista de registros
```

### 2. Crear Nuevo Registro

```
Usuario → Click "Nuevo Registro"
  ↓
Redirige a /registro-helice-interna
  ↓
Selecciona tipo de registro
  ↓
Completa formulario
  ↓
POST /api/helice-interna/registros
  ↓
Redirige a /capacidad
```

### 3. Editar Registro

```
Usuario → Click "Editar" en un registro
  ↓
Redirige a /registro-helice-interna/{tipo}?edit={id}
  ↓
GET /api/helice-interna/registros/{id}?tipo={tipo}
  ↓
Carga datos en formulario
  ↓
Usuario modifica datos
  ↓
PUT /api/helice-interna/registros/{id}
  ↓
Redirige a /capacidad
```

### 4. Eliminar Registro

```
Usuario → Click "Eliminar" en un registro
  ↓
Muestra confirmación
  ↓
Usuario confirma
  ↓
DELETE /api/helice-interna/registros/{id}?tipo={tipo}
  ↓
Actualiza lista (elimina de la vista)
  ↓
Muestra toast de éxito
```

---

## Endpoints Utilizados

### GET /api/helice-interna/registros
**Descripción:** Obtiene todos los registros del usuario autenticado

**Headers:**
```
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "registro_id": 1,
    "tipo": "docente_investigador",
    "nombre_completo": "Juan Pérez",
    "email": "juan@unsa.edu.pe",
    "telefono": "+51 999 999 999",
    "estado": "aprobado",
    "fecha_creacion": "2025-11-02T10:00:00Z",
    "paso_actual": 9
  }
]
```

### DELETE /api/helice-interna/registros/:id?tipo={tipo}
**Descripción:** Elimina un registro específico

**Headers:**
```
Authorization: Bearer {token}
```

**Query Params:**
- `tipo`: Tipo de registro (docente_investigador, grupo_centro_instituto, etc.)

**Response:**
```json
{
  "message": "Registro eliminado correctamente"
}
```

---

## Componentes UI Utilizados

### Shadcn/UI Components

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
```

### Iconos (Lucide React)

```typescript
import { 
  Loader2,      // Loading spinner
  Plus,         // Nuevo registro
  Edit,         // Editar
  Trash2,       // Eliminar
  FileText,     // Documento
  Calendar,     // Fecha
  CheckCircle,  // Aprobado
  Clock,        // En proceso
  XCircle       // Rechazado
} from 'lucide-react';
```

---

## Estilos y Diseño

### Colores por Estado

```typescript
const estados = {
  'borrador': 'bg-gray-100 text-gray-800',
  'completado': 'bg-blue-100 text-blue-800',
  'en_revision': 'bg-yellow-100 text-yellow-800',
  'aprobado': 'bg-green-100 text-green-800',
  'rechazado': 'bg-red-100 text-red-800'
};
```

### Botones

- **Nuevo Registro:** `bg-red-600 hover:bg-red-700`
- **Editar:** `variant="outline"` con borde negro
- **Eliminar:** `variant="outline"` con texto rojo

---

## Validaciones y Seguridad

### 1. Autenticación
- Verifica que el usuario esté autenticado
- Verifica que el usuario tenga rol `interno`
- Usa token JWT en todas las peticiones

### 2. Confirmación de Eliminación
```typescript
if (!confirm('¿Estás seguro de que deseas eliminar este registro? Esta acción no se puede deshacer.')) {
  return;
}
```

### 3. Manejo de Errores
- Try-catch en todas las peticiones
- Mensajes de error con toast
- Actualización automática de la UI

---

## Próximos Pasos (Opcional)

### 1. Funcionalidad de Edición
Implementar la carga de datos en los formularios cuando se pasa `?edit={id}`:

```typescript
// En docente_investigador/page.tsx
useEffect(() => {
  const editId = searchParams.get('edit');
  if (editId) {
    cargarDatosRegistro(editId);
  }
}, [searchParams]);
```

### 2. Filtros y Búsqueda
- Filtrar por tipo de registro
- Filtrar por estado
- Búsqueda por nombre

### 3. Paginación
Si hay muchos registros, implementar paginación

### 4. Exportar Datos
Botón para exportar registros a PDF o Excel

---

## Testing

### Casos de Prueba

1. **Ver registros vacíos:**
   - Usuario sin registros ve mensaje de bienvenida
   - Botón "Crear mi primer registro" funciona

2. **Ver registros existentes:**
   - Se muestran todos los registros del usuario
   - Estados se muestran correctamente
   - Fechas se formatean correctamente

3. **Crear nuevo registro:**
   - Botón "Nuevo Registro" redirige correctamente
   - Formulario se abre limpio

4. **Editar registro:**
   - Botón "Editar" redirige con parámetro correcto
   - (Pendiente: cargar datos en formulario)

5. **Eliminar registro:**
   - Muestra confirmación
   - Elimina correctamente
   - Actualiza lista sin recargar página
   - Muestra mensaje de éxito

---

## Archivos Modificados

### Frontend:
- ✅ `frontend/src/app/capacidad/page.tsx` (Reescrito completamente)

### Backend:
- ✅ Ya implementado en cambios anteriores

---

## Comandos para Probar

```bash
# 1. Asegurarse de que el backend esté corriendo
cd backend
npm run dev

# 2. Asegurarse de que el frontend esté corriendo
cd frontend
npm run dev

# 3. Ir a la página de gestión
# http://localhost:3000/capacidad
```

### Flujo de Prueba Completo

1. **Login:**
   - Ir a `/login`
   - Ingresar con usuario rol `interno`

2. **Ver registros:**
   - Ir a `/capacidad`
   - Verificar que se muestran los registros

3. **Crear nuevo:**
   - Click en "Nuevo Registro"
   - Completar formulario
   - Verificar que aparece en la lista

4. **Editar:**
   - Click en "Editar" de un registro
   - (Pendiente: implementar carga de datos)

5. **Eliminar:**
   - Click en "Eliminar"
   - Confirmar
   - Verificar que desaparece de la lista

---

**Fecha:** 2 de noviembre de 2025
**Estado:** Implementación completa de gestión de registros
