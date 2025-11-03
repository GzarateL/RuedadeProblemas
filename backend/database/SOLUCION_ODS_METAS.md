# Solución: Problema de Guardado de Metas ODS

## Resumen del Problema
Las metas ODS no se están guardando en la base de datos. Solo se guardan los objetivos con `meta_id: NULL`.

Según los logs del frontend:
- `metasODS: [61, 70, 62, 63]` ✅ Datos presentes
- `objetivosODS: [8, 17]` ✅ Datos presentes

Pero en la base de datos solo aparecen:
- Registro 8: `objetivo_id=8, meta_id=NULL`
- Registro 9: `objetivo_id=17, meta_id=NULL`

## Cambios Implementados

### 1. Logs Agregados para Debugging

#### Frontend (`laboratorio/page.tsx`)
```typescript
console.log('=== DATOS A ENVIAR AL BACKEND ===');
console.log('ODS completo:', JSON.stringify(datosRegistro.ods, null, 2));
console.log('Total items ODS:', datosRegistro.ods.length);
```

#### Backend Controller (`helice-interna.controller.ts`)
```typescript
console.log('=== ACTUALIZAR REGISTRO ===');
console.log('ODS recibido:', JSON.stringify(req.body.ods, null, 2));
console.log('Total items ODS:', req.body.ods?.length || 0);
```

#### Backend Service (`helice-interna.service.ts`)
```typescript
console.log(`=== GUARDAR ODS - INICIO ===`);
console.log(`Total de items ODS a guardar: ${ods.length}`);
// ... logs detallados para cada item
```

### 2. Verificación de Estructura

La estructura del código es correcta:
- ✅ Frontend envía array con objetivos y metas
- ✅ Backend recibe y procesa el array
- ✅ Backend busca objetivo_id para metas
- ✅ Backend inserta en la tabla Registro_ODS

## Próximos Pasos para Resolver

### Paso 1: Reiniciar el Backend
```bash
cd backend
# Detener el proceso actual (Ctrl+C)
npm run dev
```

### Paso 2: Probar la Funcionalidad
1. Abre el navegador con DevTools (F12)
2. Ve a editar un registro existente
3. Selecciona objetivos ODS (ej: 8 y 17)
4. Expande los objetivos y selecciona metas
5. Guarda el registro

### Paso 3: Revisar Logs

#### En el Navegador (Console)
Deberías ver algo como:
```
=== DATOS A ENVIAR AL BACKEND ===
ODS completo: [
  {"objetivo_id": 8, "meta_id": null},
  {"objetivo_id": 17, "meta_id": null},
  {"objetivo_id": null, "meta_id": 61},
  {"objetivo_id": null, "meta_id": 70},
  {"objetivo_id": null, "meta_id": 62},
  {"objetivo_id": null, "meta_id": 63}
]
Total items ODS: 6
```

#### En la Terminal del Backend
Deberías ver:
```
=== ACTUALIZAR REGISTRO ===
Usuario ID: 42
Registro ID: 2
ODS recibido: [...]
Total items ODS: 6

=== GUARDAR ODS - INICIO ===
Total de items ODS a guardar: 6

--- Procesando item 1/6 ---
Item original: {"objetivo_id":8,"meta_id":null}
Insertando en BD: objetivo_id=8, meta_id=null
✓ Insertado con ID: X

--- Procesando item 3/6 ---
Item original: {"objetivo_id":null,"meta_id":61}
Buscando objetivo_id para meta_id: 61
✓ Encontrado objetivo_id: 8 para meta_id: 61
Insertando en BD: objetivo_id=8, meta_id=61
✓ Insertado con ID: Y
```

### Paso 4: Verificar en la Base de Datos
```sql
SELECT 
    r.id,
    r.objetivo_id,
    o.nombre as objetivo,
    r.meta_id,
    m.codigo as meta
FROM Registro_ODS r
LEFT JOIN objetivos o ON r.objetivo_id = o.id
LEFT JOIN metas m ON r.meta_id = m.id
WHERE r.usuario_id = 42 AND r.registro_id = 2
ORDER BY r.id;
```

Deberías ver:
- Registros con `meta_id = NULL` (solo objetivo)
- Registros con `meta_id != NULL` (objetivo + meta)

## Diagnóstico Según los Logs

### Caso A: No aparecen logs en el frontend
**Problema:** El código no se está ejecutando
**Solución:** Recargar la página del frontend

### Caso B: Los logs del frontend muestran array vacío
**Problema:** Los datos no se están construyendo correctamente
**Solución:** Revisar el componente ODSSelector

### Caso C: Los logs del frontend son correctos pero no llegan al backend
**Problema:** Error en la petición HTTP
**Solución:** Verificar la URL del API y el token de autenticación

### Caso D: Los logs del backend muestran array vacío
**Problema:** Los datos se pierden en el camino
**Solución:** Verificar el middleware y el body-parser

### Caso E: El backend no encuentra el objetivo_id para las metas
**Problema:** Las metas no existen en la BD o tienen IDs incorrectos
**Solución:** Ejecutar `check_metas_exist.sql` para verificar

### Caso F: Error al insertar en la BD
**Problema:** Problema con la tabla o las foreign keys
**Solución:** Verificar la estructura de la tabla Registro_ODS

## Scripts de Ayuda

### Verificar metas en la BD
```bash
mysql -u tu_usuario -p < backend/database/check_metas_exist.sql
```

### Verificar datos guardados
```bash
mysql -u tu_usuario -p < backend/database/verify_ods_data.sql
```

## Contacto para Soporte
Una vez que ejecutes los pasos anteriores, comparte:
1. Los logs del navegador (consola)
2. Los logs del backend (terminal)
3. El resultado de la consulta SQL

Con esa información podremos identificar exactamente dónde está el problema.
