# Instrucciones para Debuggear el Problema de ODS

## Problema Identificado
Las metas ODS no se están guardando en la base de datos. Solo se guardan los objetivos con `meta_id: NULL`.

## Cambios Realizados

### 1. Backend - Logs Agregados
Se agregaron logs detallados en:
- `helice-interna.controller.ts` - método `actualizarRegistro`
- `helice-interna.service.ts` - métodos `crearRegistro`, `actualizarRegistro` y `guardarODS`

### 2. Frontend - Logs Agregados
Se agregaron logs en:
- `laboratorio/page.tsx` - antes de enviar datos al backend

## Pasos para Debuggear

### Paso 1: Reiniciar el Backend
```bash
cd backend
npm run dev
```

### Paso 2: Abrir la Consola del Navegador
1. Abre Chrome DevTools (F12)
2. Ve a la pestaña "Console"

### Paso 3: Editar un Registro
1. Ve a la página de edición de un registro (laboratorio, grupo, etc.)
2. Selecciona algunos objetivos ODS
3. Expande los objetivos y selecciona algunas metas
4. Guarda el registro

### Paso 4: Revisar los Logs del Frontend
En la consola del navegador deberías ver:
```
=== DATOS A ENVIAR AL BACKEND ===
ODS completo: [
  {
    "objetivo_id": 8,
    "meta_id": null
  },
  {
    "objetivo_id": 17,
    "meta_id": null
  },
  {
    "objetivo_id": null,
    "meta_id": 61
  },
  {
    "objetivo_id": null,
    "meta_id": 70
  },
  ...
]
Total items ODS: 6
```

**VERIFICAR:** ¿Se están enviando las metas con `meta_id` diferente de null?

### Paso 5: Revisar los Logs del Backend
En la terminal del backend deberías ver:
```
=== ACTUALIZAR REGISTRO ===
Usuario ID: 42
Registro ID: 2
Tipo: laboratorio
ODS recibido: [...]
Total items ODS: 6

=== DATOS ODS RECIBIDOS EN ACTUALIZAR REGISTRO ===
Cantidad de items ODS: 6
Items ODS: [...]

=== GUARDAR ODS - INICIO ===
Total de items ODS a guardar: 6
Usuario: 42, Registro: 2, Tipo: laboratorio
Items ODS recibidos: [...]

--- Procesando item 1/6 ---
Item original: {"objetivo_id":8,"meta_id":null}
Insertando en BD: objetivo_id=8, meta_id=null
✓ Insertado con ID: 8

--- Procesando item 3/6 ---
Item original: {"objetivo_id":null,"meta_id":61}
Buscando objetivo_id para meta_id: 61
Resultado de búsqueda: [...]
✓ Encontrado objetivo_id: 8 para meta_id: 61
Insertando en BD: objetivo_id=8, meta_id=61
✓ Insertado con ID: 10
```

**VERIFICAR:** 
1. ¿Llegan los datos ODS al backend?
2. ¿Se están procesando todos los items?
3. ¿Se encuentra el objetivo_id para las metas?
4. ¿Se insertan correctamente en la BD?

### Paso 6: Verificar en la Base de Datos
Ejecuta esta consulta en phpMyAdmin:
```sql
SELECT 
    r.id,
    r.usuario_id,
    r.registro_id,
    r.tipo,
    r.objetivo_id,
    o.nombre as objetivo_nombre,
    r.meta_id,
    m.codigo as meta_codigo,
    m.descripcion as meta_descripcion
FROM Registro_ODS r
LEFT JOIN objetivos o ON r.objetivo_id = o.id
LEFT JOIN metas m ON r.meta_id = m.id
WHERE r.usuario_id = 42 AND r.registro_id = 2
ORDER BY r.id DESC;
```

**VERIFICAR:** ¿Aparecen registros con `meta_id` diferente de NULL?

## Posibles Problemas y Soluciones

### Problema 1: Los datos no llegan al backend
**Síntoma:** No ves logs en el backend
**Solución:** Verifica que el backend esté corriendo y que la URL sea correcta

### Problema 2: Los datos llegan pero el array ODS está vacío
**Síntoma:** `Total items ODS: 0` en el backend
**Solución:** Hay un problema en cómo se construye el array en el frontend

### Problema 3: No se encuentra el objetivo_id para las metas
**Síntoma:** `✗ No se encontró objetivo_id para meta_id: XX`
**Solución:** La tabla `metas` no tiene datos o el `meta_id` es incorrecto

### Problema 4: Error al insertar en la BD
**Síntoma:** Error SQL en los logs
**Solución:** Verificar que la tabla `Registro_ODS` existe y tiene la estructura correcta

## Siguiente Paso
Una vez que identifiques dónde está el problema (frontend, backend o BD), comparte los logs y podemos continuar con la solución específica.
