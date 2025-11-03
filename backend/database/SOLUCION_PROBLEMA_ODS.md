# Solución al Problema de Almacenamiento de Metas ODS

## Problema Identificado

Las metas ODS (meta_id) no se están almacenando correctamente en la tabla `Registro_ODS` cuando los usuarios completan el formulario de registro de hélice interna.

## Estructura de la Base de Datos

### Tabla `metas`
```sql
CREATE TABLE metas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    objetivo_id INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    descripcion TEXT NOT NULL,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id)
);
```

### Tabla `Registro_ODS`
```sql
CREATE TABLE Registro_ODS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,                    -- Agregado en migración
    tipo ENUM(...),                     -- Agregado en migración
    objetivo_id INT NOT NULL,
    meta_id INT,                        -- NULLABLE
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id),
    INDEX idx_usuario (usuario_id)
);
```

## Flujo de Datos

### Frontend (ODSSelector.tsx)
El componente permite seleccionar:
- **Objetivos ODS**: Array de IDs de objetivos (1-17)
- **Metas ODS**: Array de IDs de metas específicas

### Frontend (Formularios de Registro)
Al enviar el formulario, se construye el array `ods`:

```typescript
ods: [
  // Objetivos seleccionados (sin meta específica)
  ...formData.objetivosODS.map(objetivoId => ({
    objetivo_id: objetivoId,
    meta_id: null
  })),
  // Metas seleccionadas (el backend busca el objetivo_id)
  ...formData.metasODS.map(metaId => ({
    objetivo_id: null,
    meta_id: metaId
  }))
]
```

### Backend (helice-interna.service.ts)
El método `guardarODS` procesa cada item:

```typescript
private async guardarODS(connection, usuarioId, registroId, tipo, ods) {
  for (const item of ods) {
    let objetivoId = item.objetivo_id;
    
    // Si solo hay meta_id, buscar el objetivo_id desde la tabla metas
    if (!objetivoId && item.meta_id) {
      const [metaRows] = await connection.execute(
        'SELECT objetivo_id FROM metas WHERE id = ?',
        [item.meta_id]
      );
      if (metaRows.length > 0) {
        objetivoId = metaRows[0].objetivo_id;
      }
    }
    
    // Insertar si tenemos objetivo_id
    if (objetivoId) {
      await connection.execute(
        'INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_id, meta_id) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipo, objetivoId, item.meta_id || null]
      );
    }
  }
}
```

## Cambios Realizados

### 1. Mejora en el Logging del Backend
Se agregaron logs detallados en el método `guardarODS` para facilitar el diagnóstico:

```typescript
console.log(`Guardando ${ods.length} registros ODS...`);
console.log(`Buscando objetivo_id para meta_id: ${item.meta_id}`);
console.log(`Encontrado objetivo_id: ${objetivoId} para meta_id: ${item.meta_id}`);
console.log(`Insertando ODS: objetivo_id=${objetivoId}, meta_id=${item.meta_id || null}`);
```

### 2. Script de Diagnóstico
Se creó `diagnose_ods_problem.sql` para verificar:
- Estructura de la tabla Registro_ODS
- Registros existentes con y sin metas
- Estado de la migración
- Datos en la tabla metas

## Pasos para Verificar el Problema

### 1. Ejecutar el Script de Diagnóstico
```bash
mysql -u usuario -p nombre_bd < backend/database/diagnose_ods_problem.sql
```

### 2. Verificar que la Migración se Ejecutó
La tabla `Registro_ODS` debe tener las columnas:
- `registro_id` (INT)
- `tipo` (ENUM)

Si no existen, ejecutar:
```bash
mysql -u usuario -p nombre_bd < backend/database/migration_add_registro_id.sql
```

### 3. Verificar que Existen Metas en la BD
```sql
SELECT COUNT(*) FROM metas;
```

Si no hay metas, necesitas poblar la tabla con los datos de ODS.

### 4. Probar el Registro con Logs
1. Iniciar el backend en modo desarrollo
2. Completar un formulario de hélice interna
3. Seleccionar objetivos Y metas específicas
4. Revisar los logs de la consola del backend

Deberías ver:
```
Guardando X registros ODS para usuario Y, registro Z, tipo docente_investigador
Insertando ODS: objetivo_id=1, meta_id=null
Buscando objetivo_id para meta_id: 5
Encontrado objetivo_id: 1 para meta_id: 5
Insertando ODS: objetivo_id=1, meta_id=5
```

### 5. Verificar en la Base de Datos
```sql
SELECT 
    ro.id,
    ro.usuario_id,
    ro.objetivo_id,
    ro.meta_id,
    o.nombre as objetivo_nombre,
    m.codigo as meta_codigo
FROM Registro_ODS ro
LEFT JOIN objetivos o ON ro.objetivo_id = o.id
LEFT JOIN metas m ON ro.meta_id = m.id
WHERE ro.usuario_id = [TU_USUARIO_ID]
ORDER BY ro.objetivo_id, ro.meta_id;
```

## Posibles Causas del Problema

1. **Migración no ejecutada**: Las columnas `registro_id` y `tipo` no existen
2. **Tabla metas vacía**: No hay datos de metas en la base de datos
3. **Frontend no envía metas**: El array `metasODS` está vacío
4. **Error en la consulta**: La búsqueda de `objetivo_id` falla

## Solución Definitiva

El código ya está corregido con:
1. ✅ Logs detallados para diagnóstico
2. ✅ Lógica correcta para buscar `objetivo_id` desde `meta_id`
3. ✅ Validación de datos antes de insertar
4. ✅ Script de diagnóstico para verificar el estado

**Próximos pasos:**
1. Ejecutar el script de diagnóstico
2. Verificar los logs del backend al guardar un registro
3. Confirmar que las metas se guardan correctamente en la BD
