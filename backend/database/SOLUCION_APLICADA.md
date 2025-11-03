# Solución Aplicada: Problema de Guardado de Metas ODS

## Problema Identificado
Las metas ODS no se estaban guardando en la base de datos porque **la página de `centro_produccion` no estaba incluyendo las metas en el array que se envía al backend**.

## Evidencia del Problema

### Logs del Frontend
```
metasODS: [70, 62, 61]  ✅ Datos presentes en el estado
objetivosODS: [8]       ✅ Datos presentes en el estado
```

### Logs del Backend
```
Cantidad de items ODS: 1  ❌ Solo llega 1 item
Items ODS: [{"objetivo_id": 8, "meta_id": null}]  ❌ Solo el objetivo, sin metas
```

## Causa Raíz
En `frontend/src/app/registro-helice-interna/centro_produccion/page.tsx`, el código solo estaba mapeando los objetivos:

```typescript
// ❌ CÓDIGO INCORRECTO (ANTES)
ods: formData.objetivosODS.map(objetivoId => ({
  objetivo_id: objetivoId,
  meta_id: null
})),
```

## Solución Aplicada
Se corrigió el código para incluir tanto objetivos como metas:

```typescript
// ✅ CÓDIGO CORRECTO (DESPUÉS)
ods: [
  // Agregar objetivos seleccionados
  ...formData.objetivosODS.map(objetivoId => ({
    objetivo_id: objetivoId,
    meta_id: null
  })),
  // Agregar metas seleccionadas (el backend buscará el objetivo_id)
  ...formData.metasODS.map(metaId => ({
    objetivo_id: null,
    meta_id: metaId
  }))
],
```

## Archivos Modificados
1. ✅ `frontend/src/app/registro-helice-interna/centro_produccion/page.tsx`
   - Corregido el array de ODS para incluir metas
   - Agregados logs para debugging

## Estado de Otras Páginas
- ✅ `docente_investigador/page.tsx` - Ya estaba correcto
- ✅ `grupo_centro_instituto/page.tsx` - Ya estaba correcto
- ✅ `laboratorio/page.tsx` - Ya estaba correcto
- ✅ `centro_produccion/page.tsx` - **CORREGIDO**

## Cómo Probar la Solución

### 1. Recargar la Página del Frontend
Presiona `Ctrl+Shift+R` (o `Cmd+Shift+R` en Mac) para recargar sin caché

### 2. Editar un Registro de Centro de Producción
1. Ve a la página de edición
2. Selecciona un objetivo ODS (ej: ODS 8)
3. Expande el objetivo y selecciona algunas metas
4. Guarda el registro

### 3. Verificar los Logs del Frontend
En la consola del navegador deberías ver:
```
=== DATOS A ENVIAR AL BACKEND (CENTRO PRODUCCION) ===
ODS completo: [
  {"objetivo_id": 8, "meta_id": null},
  {"objetivo_id": null, "meta_id": 70},
  {"objetivo_id": null, "meta_id": 62},
  {"objetivo_id": null, "meta_id": 61}
]
Total items ODS: 4
Objetivos: [8]
Metas: [70, 62, 61]
```

### 4. Verificar los Logs del Backend
En la terminal del backend deberías ver:
```
=== ACTUALIZAR REGISTRO ===
Total items ODS: 4

=== GUARDAR ODS - INICIO ===
Total de items ODS a guardar: 4

--- Procesando item 1/4 ---
Item original: {"objetivo_id":8,"meta_id":null}
✓ Insertado con ID: X

--- Procesando item 2/4 ---
Item original: {"objetivo_id":null,"meta_id":70}
Buscando objetivo_id para meta_id: 70
✓ Encontrado objetivo_id: 8 para meta_id: 70
✓ Insertado con ID: Y

--- Procesando item 3/4 ---
Item original: {"objetivo_id":null,"meta_id":62}
✓ Encontrado objetivo_id: 8 para meta_id: 62
✓ Insertado con ID: Z

--- Procesando item 4/4 ---
Item original: {"objetivo_id":null,"meta_id":61}
✓ Encontrado objetivo_id: 8 para meta_id: 61
✓ Insertado con ID: W
```

### 5. Verificar en la Base de Datos
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
ORDER BY r.id DESC;
```

Deberías ver:
- 1 registro con `meta_id = NULL` (solo objetivo)
- 3 registros con `meta_id != NULL` (objetivo + meta)

## Resultado Esperado
✅ Los objetivos ODS se guardan correctamente
✅ Las metas ODS se guardan correctamente con su `meta_id`
✅ El backend encuentra automáticamente el `objetivo_id` para cada meta
✅ Los datos se pueden visualizar correctamente en la base de datos

## Notas Adicionales
- El problema solo afectaba a la página de `centro_produccion`
- Las demás páginas (docente_investigador, grupo_centro_instituto, laboratorio) ya funcionaban correctamente
- Los logs agregados ayudarán a identificar problemas similares en el futuro
