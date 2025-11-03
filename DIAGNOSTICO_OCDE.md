# Diagnóstico: Registros OCDE no se guardan

## Análisis del Flujo

### 1. Frontend - Construcción del Array OCDE
**Archivo:** `frontend/src/app/registro-helice-interna/grupo_centro_instituto/page.tsx`

```typescript
// Línea 319-348
const ocdeArray = [];

// Agregar áreas seleccionadas
for (const areaId of formData.areasOCDE) {
  ocdeArray.push({
    area_id: areaId,
    sub_area_id: null,
    disciplina_id: null
  });
}

// Agregar sub-áreas seleccionadas
for (const subAreaId of formData.subAreasOCDE) {
  ocdeArray.push({
    area_id: null,
    sub_area_id: subAreaId,
    disciplina_id: null
  });
}

// Agregar disciplinas seleccionadas
for (const disciplinaId of formData.disciplinasOCDE) {
  ocdeArray.push({
    area_id: null,
    sub_area_id: null,
    disciplina_id: disciplinaId
  });
}

// Se envía en el body
const datosRegistro = {
  tipo: 'grupo_centro_instituto',
  // ... otros campos
  ocde: ocdeArray,  // ← Aquí se envía
  // ...
};
```

### 2. Backend - Recepción y Guardado
**Archivo:** `backend/src/api/helice-interna/helice-interna.service.ts`

```typescript
// Línea 251-254
if (datos.ocde && datos.ocde.length > 0) {
  console.log('Guardando OCDE:', datos.ocde);
  await this.guardarOCDE(connection, usuarioId, datos.ocde);
}

// Línea 434-442
private async guardarOCDE(connection: PoolConnection, usuarioId: number, ocde: Array<{area_id?: number, sub_area_id?: number, disciplina_id?: number}>) {
  for (const item of ocde) {
    await connection.execute(
      'INSERT INTO Registro_OCDE (usuario_id, area_id, sub_area_id, disciplina_id) VALUES (?, ?, ?, ?)',
      [usuarioId, item.area_id || null, item.sub_area_id || null, item.disciplina_id || null]
    );
  }
}
```

### 3. Base de Datos
**Archivo:** `backend/database/database_general.sql`

```sql
CREATE TABLE Registro_OCDE (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    area_id INT,
    sub_area_id INT,
    disciplina_id INT,
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (sub_area_id) REFERENCES sub_areas(id),
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id),
    INDEX idx_usuario (usuario_id)
);
```

## Posibles Causas del Problema

### 1. ❌ Array OCDE vacío
**Síntoma:** `formData.areasOCDE`, `formData.subAreasOCDE`, y `formData.disciplinasOCDE` están vacíos.

**Verificación:**
- Revisar si el componente `OCDESelector` está actualizando correctamente el estado
- Verificar que `onSelectionChange` se está llamando

### 2. ❌ Datos no llegan al backend
**Síntoma:** El array `ocde` llega vacío o undefined al backend.

**Verificación:**
- Revisar logs del backend: `console.log('Guardando OCDE:', datos.ocde);`
- Si no aparece este log, significa que `datos.ocde` está vacío o undefined

### 3. ❌ Error en la transacción
**Síntoma:** La transacción hace rollback antes de guardar OCDE.

**Verificación:**
- Revisar si hay errores en pasos anteriores que causen rollback
- Verificar logs de errores en el backend

### 4. ❌ Foreign Keys inválidas
**Síntoma:** Los IDs de area_id, sub_area_id o disciplina_id no existen en sus tablas respectivas.

**Verificación:**
```sql
-- Verificar si existen áreas
SELECT * FROM areas LIMIT 5;

-- Verificar si existen sub_areas
SELECT * FROM sub_areas LIMIT 5;

-- Verificar si existen disciplinas
SELECT * FROM disciplinas LIMIT 5;
```

## Solución Propuesta

### Paso 1: Agregar logs detallados en el frontend

```typescript
const handleSubmit = async () => {
  // ... código existente
  
  console.log('=== DEBUG OCDE ===');
  console.log('formData.areasOCDE:', formData.areasOCDE);
  console.log('formData.subAreasOCDE:', formData.subAreasOCDE);
  console.log('formData.disciplinasOCDE:', formData.disciplinasOCDE);
  console.log('ocdeArray construido:', ocdeArray);
  console.log('datosRegistro.ocde:', datosRegistro.ocde);
  
  // ... resto del código
};
```

### Paso 2: Agregar logs detallados en el backend

```typescript
async crearRegistro(usuarioId: number, datos: DatosRegistroCompleto): Promise<any> {
  console.log('=== DEBUG BACKEND OCDE ===');
  console.log('datos.ocde recibido:', JSON.stringify(datos.ocde, null, 2));
  console.log('datos.ocde.length:', datos.ocde?.length);
  
  // ... resto del código
}
```

### Paso 3: Verificar que las tablas OCDE tienen datos

```sql
-- Verificar catálogos OCDE
SELECT COUNT(*) as total_areas FROM areas;
SELECT COUNT(*) as total_subareas FROM sub_areas;
SELECT COUNT(*) as total_disciplinas FROM disciplinas;

-- Si están vacías, necesitas poblarlas
```

### Paso 4: Verificar permisos y foreign keys

```sql
-- Ver estructura de la tabla
DESCRIBE Registro_OCDE;

-- Ver foreign keys
SHOW CREATE TABLE Registro_OCDE;
```

## Comandos de Verificación

### Verificar si hay registros OCDE
```sql
SELECT * FROM Registro_OCDE;
```

### Verificar registros por usuario
```sql
SELECT 
  u.email,
  ro.area_id,
  ro.sub_area_id,
  ro.disciplina_id,
  a.nombre as area_nombre,
  sa.nombre as subarea_nombre,
  d.nombre as disciplina_nombre
FROM Registro_OCDE ro
JOIN Usuarios u ON ro.usuario_id = u.usuario_id
LEFT JOIN areas a ON ro.area_id = a.id
LEFT JOIN sub_areas sa ON ro.sub_area_id = sa.id
LEFT JOIN disciplinas d ON ro.disciplina_id = d.id;
```

### Verificar último registro creado
```sql
SELECT * FROM Registro_Grupo_Centro_Instituto 
ORDER BY fecha_creacion DESC LIMIT 1;
```

## Próximos Pasos

1. ✅ Agregar logs en frontend y backend
2. ✅ Hacer una prueba de registro
3. ✅ Revisar logs de consola del navegador
4. ✅ Revisar logs del servidor backend
5. ✅ Verificar base de datos
6. ✅ Identificar en qué punto se pierden los datos
