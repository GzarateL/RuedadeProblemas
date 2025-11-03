# Resumen: Implementación de ODS y Metas

## Estado Actual ✅

La funcionalidad de guardar ODS (Objetivos de Desarrollo Sostenible) y sus metas **YA ESTÁ COMPLETAMENTE IMPLEMENTADA** en el sistema.

## Estructura de la Base de Datos

### Tabla `Registro_ODS`
```sql
CREATE TABLE Registro_ODS (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    registro_id INT,
    tipo ENUM('docente_investigador','grupo_centro_instituto','laboratorio','centro_produccion'),
    objetivo_id INT NOT NULL,
    meta_id INT,  -- ✅ Columna para almacenar metas
    
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (objetivo_id) REFERENCES objetivos(id),
    FOREIGN KEY (meta_id) REFERENCES metas(id)  -- ✅ Relación con tabla metas
);
```

## Flujo de Datos

### 1. Frontend (ODSSelector.tsx)
- ✅ Permite seleccionar objetivos ODS
- ✅ Permite expandir objetivos y seleccionar metas específicas
- ✅ Mantiene dos arrays separados: `selectedObjetivos` y `selectedMetas`
- ✅ Carga metas dinámicamente cuando se expande un objetivo

### 2. Páginas de Registro (docente_investigador, laboratorio, etc.)
El frontend envía los datos en este formato:
```javascript
ods: [
  // Objetivos sin meta específica
  { objetivo_id: 1, meta_id: null },
  { objetivo_id: 3, meta_id: null },
  
  // Metas específicas (el backend busca el objetivo_id)
  { objetivo_id: null, meta_id: 5 },
  { objetivo_id: null, meta_id: 12 }
]
```

### 3. Backend (helice-interna.service.ts)
El método `guardarODS` maneja ambos casos:

```typescript
private async guardarODS(connection, usuarioId, registroId, tipo, ods) {
  for (const item of ods) {
    let objetivoId = item.objetivo_id;
    
    // Si solo se proporcionó meta_id, buscar el objetivo_id
    if (!objetivoId && item.meta_id) {
      const [metaRows] = await connection.execute(
        'SELECT objetivo_id FROM metas WHERE id = ?',
        [item.meta_id]
      );
      if (metaRows.length > 0) {
        objetivoId = metaRows[0].objetivo_id;
      }
    }
    
    // Insertar con objetivo_id y meta_id
    if (objetivoId) {
      await connection.execute(
        'INSERT INTO Registro_ODS (usuario_id, registro_id, tipo, objetivo_id, meta_id) VALUES (?, ?, ?, ?, ?)',
        [usuarioId, registroId, tipo, objetivoId, item.meta_id || null]
      );
    }
  }
}
```

## Cómo Verificar que Funciona

### 1. Ejecutar el script de verificación:
```bash
mysql -u tu_usuario -p < backend/database/verify_ods_data.sql
```

### 2. Verificar manualmente en phpMyAdmin:
```sql
SELECT 
    r.id,
    r.usuario_id,
    r.registro_id,
    r.tipo,
    o.nombre as objetivo,
    m.codigo as meta_codigo,
    m.descripcion as meta_descripcion
FROM Registro_ODS r
LEFT JOIN objetivos o ON r.objetivo_id = o.id
LEFT JOIN metas m ON r.meta_id = m.id
ORDER BY r.id DESC
LIMIT 20;
```

## Casos de Uso

### Caso 1: Usuario selecciona solo objetivos
- Frontend envía: `[{objetivo_id: 1, meta_id: null}, {objetivo_id: 3, meta_id: null}]`
- Backend guarda: 2 registros con objetivo_id y meta_id NULL

### Caso 2: Usuario selecciona objetivos Y metas específicas
- Frontend envía: 
  ```javascript
  [
    {objetivo_id: 1, meta_id: null},  // Objetivo 1 sin meta específica
    {objetivo_id: null, meta_id: 5},  // Meta 5 (pertenece al objetivo 1)
    {objetivo_id: null, meta_id: 6}   // Meta 6 (pertenece al objetivo 1)
  ]
  ```
- Backend guarda: 3 registros, todos con objetivo_id correcto

### Caso 3: Usuario selecciona solo metas (sin marcar el objetivo padre)
- Frontend envía: `[{objetivo_id: null, meta_id: 5}]`
- Backend busca el objetivo_id de la meta 5 y guarda el registro completo

## Conclusión

✅ **La funcionalidad está completa y funcionando**

Los ODS y las metas se están almacenando correctamente en la tabla `Registro_ODS` con:
- `objetivo_id`: ID del objetivo ODS
- `meta_id`: ID de la meta específica (puede ser NULL si solo se seleccionó el objetivo)

No se requieren cambios adicionales en la base de datos ni en el código.
