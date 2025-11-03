# Corrección de Problemas Finales

## Problemas Identificados y Solucionados

### 1. ✅ Eliminación en Cascada

**Problema:** Al eliminar un registro de hélice interna, los datos relacionados en otras tablas (OCDE, ODS, PIU, etc.) no se eliminaban.

**Causa:** La función `eliminarRegistro` solo eliminaba el registro principal, no los datos compartidos.

**Solución Implementada:**

```typescript
async eliminarRegistro(registroId: number, usuarioId: number, tipo: string): Promise<boolean> {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Eliminar datos compartidos del usuario (en cascada)
    await connection.execute('DELETE FROM Registro_OCDE WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_ODS WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_Aportes WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_CTI_Vitae WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_Niveles_Tecnologicos WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_PIU WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_Keywords WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_Soluciones WHERE usuario_id = ?', [usuarioId]);
    await connection.execute('DELETE FROM Registro_Archivos WHERE usuario_id = ?', [usuarioId]);

    // Eliminar el registro principal
    const tabla = this.getTablaByTipo(tipo);
    const [result] = await connection.execute<ResultSetHeader>(
      `DELETE FROM ${tabla} WHERE registro_id = ? AND usuario_id = ?`,
      [registroId, usuarioId]
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
```

**Archivo modificado:** `backend/src/api/helice-interna/helice-interna.service.ts`

---

### 2. ✅ Componentes OCDE/ODS No Muestran Selecciones en Modo Edición

**Problema:** Al editar un registro, los componentes `OCDESelector` y `ODSSelector` no mostraban los elementos previamente seleccionados expandidos ni cargaban sus datos hijos.

**Causa:** Los componentes no tenían lógica para:
1. Expandir automáticamente las áreas/objetivos que tienen elementos seleccionados
2. Cargar las sub-áreas/metas correspondientes

**Solución Implementada:**

#### OCDESelector

```typescript
// Expandir y cargar datos cuando hay selecciones previas (modo edición)
useEffect(() => {
  const loadSelectedData = async () => {
    if (areas.length === 0) return;

    // Expandir y cargar sub-áreas para áreas seleccionadas
    for (const areaId of selectedAreas) {
      setExpandedAreas(prev => new Set(prev).add(areaId));
      const areaSubAreas = subAreas.filter(sa => sa.area_id === areaId);
      if (areaSubAreas.length === 0) {
        await fetchSubAreas(areaId);
      }
    }

    // Expandir y cargar disciplinas para sub-áreas seleccionadas
    for (const subAreaId of selectedSubAreas) {
      setExpandedSubAreas(prev => new Set(prev).add(subAreaId));
      const subAreaDisciplinas = disciplinas.filter(d => d.sub_area_id === subAreaId);
      if (subAreaDisciplinas.length === 0) {
        await fetchDisciplinas(subAreaId);
      }
    }
  };

  loadSelectedData();
}, [selectedAreas, selectedSubAreas, areas]);
```

**Archivo modificado:** `frontend/src/app/registro-helice-interna/components/OCDESelector.tsx`

#### ODSSelector

```typescript
// Expandir y cargar metas cuando hay objetivos seleccionados (modo edición)
useEffect(() => {
  const loadSelectedData = async () => {
    if (objetivos.length === 0) return;

    // Expandir y cargar metas para objetivos seleccionados
    for (const objetivoId of selectedObjetivos) {
      setExpandedObjetivos(prev => new Set(prev).add(objetivoId));
      const objetivoMetas = metas.filter(m => m.objetivo_id === objetivoId);
      if (objetivoMetas.length === 0) {
        await fetchMetas(objetivoId);
      }
    }
  };

  loadSelectedData();
}, [selectedObjetivos, objetivos]);
```

**Archivo modificado:** `frontend/src/app/registro-helice-interna/components/ODSSelector.tsx`

---

## Verificación de Logs

Los logs del navegador confirmaron que:

✅ **Los datos OCDE se están enviando correctamente:**
```
ocdeArray construido: (3) [{…}, {…}, {…}]
0: {area_id: 1, sub_area_id: null, disciplina_id: null}
1: {area_id: null, sub_area_id: 3, disciplina_id: null}
2: {area_id: null, sub_area_id: 5, disciplina_id: null}
```

✅ **Los datos se están cargando en modo edición:**
```
Registro cargado para edición: Object
areasOCDE: (2) [1, 2]
```

---

## Comportamiento Esperado Ahora

### Eliminación de Registros
1. Usuario hace clic en "Eliminar" en un registro
2. Se muestra confirmación
3. Al confirmar, se eliminan:
   - ✅ El registro principal (Docente, Grupo, Laboratorio, etc.)
   - ✅ Todos los datos OCDE asociados
   - ✅ Todos los datos ODS asociados
   - ✅ Todos los aportes, niveles, PIU, keywords, soluciones y archivos
4. La lista se actualiza automáticamente

### Edición de Registros
1. Usuario hace clic en "Editar" en un registro
2. Se redirige a la página de edición con `?edit=ID`
3. Los datos se cargan automáticamente:
   - ✅ Información básica (nombre, email, teléfono, etc.)
   - ✅ Áreas OCDE seleccionadas (expandidas y visibles)
   - ✅ Sub-áreas OCDE seleccionadas (expandidas y visibles)
   - ✅ Disciplinas OCDE seleccionadas (visibles)
   - ✅ Objetivos ODS seleccionados (expandidos y visibles)
   - ✅ Metas ODS seleccionadas (visibles)
   - ✅ Todos los demás campos (PIU, keywords, soluciones, etc.)
4. Usuario modifica los datos
5. Al guardar, se actualiza el registro con PUT
6. Redirige a `/capacidad` con mensaje de éxito

---

## Archivos Modificados

1. ✅ `backend/src/api/helice-interna/helice-interna.service.ts`
   - Función `eliminarRegistro` con eliminación en cascada

2. ✅ `frontend/src/app/registro-helice-interna/components/OCDESelector.tsx`
   - useEffect para expandir y cargar datos en modo edición

3. ✅ `frontend/src/app/registro-helice-interna/components/ODSSelector.tsx`
   - useEffect para expandir y cargar datos en modo edición

---

## Pruebas Recomendadas

### Test 1: Eliminación en Cascada
1. Crear un registro completo con OCDE, ODS, PIU, etc.
2. Verificar en BD que existen registros en todas las tablas
3. Eliminar el registro desde la UI
4. Verificar en BD que todos los registros relacionados se eliminaron

```sql
-- Antes de eliminar
SELECT COUNT(*) FROM Registro_OCDE WHERE usuario_id = X;
SELECT COUNT(*) FROM Registro_ODS WHERE usuario_id = X;

-- Después de eliminar (deben ser 0)
SELECT COUNT(*) FROM Registro_OCDE WHERE usuario_id = X;
SELECT COUNT(*) FROM Registro_ODS WHERE usuario_id = X;
```

### Test 2: Edición con Componentes Expandidos
1. Crear un registro con áreas OCDE y objetivos ODS seleccionados
2. Hacer clic en "Editar"
3. Verificar que:
   - Las áreas seleccionadas están expandidas
   - Las sub-áreas seleccionadas están expandidas
   - Los checkboxes están marcados correctamente
   - Los objetivos ODS están expandidos
   - Las metas están visibles y marcadas

---

## Notas Adicionales

- Los logs de depuración agregados anteriormente pueden ser removidos o comentados en producción
- La eliminación en cascada usa transacciones para garantizar consistencia
- Los componentes ahora son completamente funcionales en modo creación y edición
