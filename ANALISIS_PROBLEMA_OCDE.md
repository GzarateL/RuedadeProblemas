# Análisis del Problema: Registros OCDE no se guardan

## Resumen del Problema

Los registros OCDE (Áreas, Sub-áreas y Disciplinas) no se están guardando en la tabla `Registro_OCDE` de la base de datos.

## Flujo Actual del Código

### 1. Frontend (grupo_centro_instituto/page.tsx)

```typescript
// El usuario selecciona áreas OCDE usando el componente OCDESelector
<OCDESelector
  selectedAreas={formData.areasOCDE}
  selectedSubAreas={formData.subAreasOCDE}
  selectedDisciplinas={formData.disciplinasOCDE}
  onSelectionChange={(areas, subAreas, disciplinas) => {
    setFormData(prev => ({
      ...prev,
      areasOCDE: areas,
      subAreasOCDE: subAreas,
      disciplinasOCDE: disciplinas
    }));
  }}
/>

// Al enviar el formulario, se construye el array OCDE
const ocdeArray = [];

// Se agregan las áreas
for (const areaId of formData.areasOCDE) {
  ocdeArray.push({ area_id: areaId, sub_area_id: null, disciplina_id: null });
}

// Se agregan las sub-áreas
for (const subAreaId of formData.subAreasOCDE) {
  ocdeArray.push({ area_id: null, sub_area_id: subAreaId, disciplina_id: null });
}

// Se agregan las disciplinas
for (const disciplinaId of formData.disciplinasOCDE) {
  ocdeArray.push({ area_id: null, sub_area_id: null, disciplina_id: disciplinaId });
}

// Se envía al backend
const datosRegistro = {
  tipo: 'grupo_centro_instituto',
  // ... otros campos
  ocde: ocdeArray,
  // ...
};
```

### 2. Backend (helice-interna.service.ts)

```typescript
async crearRegistro(usuarioId: number, datos: DatosRegistroCompleto) {
  // Se verifica si hay datos OCDE
  if (datos.ocde && datos.ocde.length > 0) {
    console.log('Guardando OCDE:', datos.ocde);
    await this.guardarOCDE(connection, usuarioId, datos.ocde);
  }
}

private async guardarOCDE(connection, usuarioId, ocde) {
  for (const item of ocde) {
    await connection.execute(
      'INSERT INTO Registro_OCDE (usuario_id, area_id, sub_area_id, disciplina_id) VALUES (?, ?, ?, ?)',
      [usuarioId, item.area_id || null, item.sub_area_id || null, item.disciplina_id || null]
    );
  }
}
```

### 3. Base de Datos

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
    FOREIGN KEY (disciplina_id) REFERENCES disciplinas(id)
);
```

## Posibles Causas

### Causa 1: OCDESelector no actualiza el estado ❓
El componente `OCDESelector` podría no estar llamando a `onSelectionChange` correctamente.

**Verificación:**
- Agregar `console.log` en `onSelectionChange`
- Verificar que `formData.areasOCDE`, `formData.subAreasOCDE`, `formData.disciplinasOCDE` tengan valores

### Causa 2: Array OCDE llega vacío al backend ❓
El array `ocdeArray` podría estar vacío cuando se envía al backend.

**Verificación:**
- Logs agregados en frontend: `console.log('ocdeArray construido:', ocdeArray);`
- Logs agregados en backend: `console.log('datos.ocde recibido:', datos.ocde);`

### Causa 3: Tablas OCDE vacías ❓
Las tablas `areas`, `sub_areas`, `disciplinas` podrían estar vacías.

**Verificación:**
```sql
SELECT COUNT(*) FROM areas;
SELECT COUNT(*) FROM sub_areas;
SELECT COUNT(*) FROM disciplinas;
```

### Causa 4: Error en Foreign Keys ❓
Los IDs enviados podrían no existir en las tablas referenciadas.

**Verificación:**
- Verificar que los IDs seleccionados existan en las tablas
- Revisar logs de errores de MySQL

### Causa 5: Transacción hace rollback ❓
Si hay un error en cualquier parte del proceso, la transacción completa hace rollback.

**Verificación:**
- Revisar logs de errores en el backend
- Verificar que no haya errores antes de guardar OCDE

## Logs de Depuración Agregados

### Frontend
```typescript
console.log('=== DEBUG OCDE FRONTEND ===');
console.log('formData.areasOCDE:', formData.areasOCDE);
console.log('formData.subAreasOCDE:', formData.subAreasOCDE);
console.log('formData.disciplinasOCDE:', formData.disciplinasOCDE);
console.log('ocdeArray construido:', ocdeArray);
```

### Backend
```typescript
console.log('=== DEBUG OCDE BACKEND ===');
console.log('datos.ocde recibido:', JSON.stringify(datos.ocde, null, 2));
console.log('datos.ocde?.length:', datos.ocde?.length);

// En guardarOCDE
console.log(`Guardando ${ocde.length} registros OCDE para usuario ${usuarioId}`);
console.log('Insertando OCDE:', { usuarioId, ...item });
console.log('OCDE insertado con ID:', result.insertId);
```

## Pasos para Diagnosticar

1. **Ejecutar el script SQL de verificación**
   ```bash
   mysql -u root -p nombre_bd < verificar_ocde.sql
   ```

2. **Hacer una prueba de registro**
   - Ir a `/registro-helice-interna/grupo_centro_instituto`
   - Seleccionar al menos un área OCDE
   - Completar el formulario
   - Enviar

3. **Revisar logs del navegador**
   - Abrir DevTools → Console
   - Buscar: `=== DEBUG OCDE FRONTEND ===`
   - Verificar que los arrays tengan valores

4. **Revisar logs del backend**
   - Ver la consola del servidor Node.js
   - Buscar: `=== DEBUG OCDE BACKEND ===`
   - Verificar que los datos lleguen correctamente

5. **Verificar la base de datos**
   ```sql
   SELECT * FROM Registro_OCDE ORDER BY id DESC LIMIT 10;
   ```

## Soluciones Potenciales

### Si el problema es en el frontend:
- Verificar que `OCDESelector` llame a `onSelectionChange`
- Asegurar que el estado se actualice correctamente

### Si el problema es en el backend:
- Verificar que `datos.ocde` no sea undefined o vacío
- Asegurar que la transacción no haga rollback

### Si el problema es en la BD:
- Poblar las tablas `areas`, `sub_areas`, `disciplinas` si están vacías
- Verificar que las foreign keys sean correctas

## Archivos Modificados

- ✅ `frontend/src/app/registro-helice-interna/grupo_centro_instituto/page.tsx` - Logs agregados
- ✅ `backend/src/api/helice-interna/helice-interna.service.ts` - Logs agregados
- ✅ `verificar_ocde.sql` - Script de verificación creado
- ✅ `DIAGNOSTICO_OCDE.md` - Documentación detallada
- ✅ `ANALISIS_PROBLEMA_OCDE.md` - Este archivo

## Próximos Pasos

1. Ejecutar el script `verificar_ocde.sql` para ver el estado actual
2. Hacer una prueba de registro y revisar los logs
3. Identificar en qué punto se pierden los datos
4. Aplicar la solución correspondiente
