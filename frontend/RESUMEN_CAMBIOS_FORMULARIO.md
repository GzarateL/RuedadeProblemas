# Resumen de Cambios en el Formulario de Registro Hélice Interna

## ✅ Cambios Completados

### 1. Estructura de Datos (FormData interface)
- ✅ Eliminados campos antiguos de PIU (articulosQ1-Q4, etc.)
- ✅ Agregados nuevos campos de PIU según especificación
- ✅ Cambiado `nivelAporte` y `descripcionAporte` por `nivelAporteDEL` y `nivelAporteDS`
- ✅ Agregado campo `palabrasClave: string`
- ✅ Actualizado `initialFormData` con los nuevos campos

### 2. Total de Pasos
- ✅ Cambiado de 8 a 9 pasos totales

### 3. Validación (Paso 4)
- ✅ Actualizada validación para `nivelAporteDEL` y `nivelAporteDS`

### 4. Paso 4 - Nivel de Aporte
- ✅ Completamente rediseñado
- ✅ Dos selectores (DEL y DS) con niveles 1-7
- ✅ Descripciones claras para cada tipo de aporte

### 5. Paso 5 - Niveles TRL/CRL
- ✅ Simplificado: solo selectores, sin textareas de descripción
- ✅ Textos descriptivos mejorados

## ⚠️ Cambios Pendientes (Requieren Edición Manual)

### 6. Paso 6 - PIU (Producción Intelectual)
**Ubicación**: Buscar `case 6:` en el archivo

**Acción**: Reemplazar TODO el contenido del caso 6 con el nuevo formato que incluye:
- Tesis
- Libros
- Capítulos de libro
- Manuscritos publicados
- Manuscritos aceptados para publicación
- Manuscritos en evaluación
- Propiedad intelectual (6 tipos diferentes)

**Código de reemplazo**: Ver archivo `ACTUALIZACION_PIU.md`

### 7. Nuevo Paso 7 - Palabras Clave
**Ubicación**: Después del `case 6:` y antes del caso de soluciones

**Acción**: Agregar un nuevo caso 7 con:
```typescript
      case 7:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Palabras Clave de Soluciones</CardTitle>
              <p className="text-sm text-gray-600">
                De las soluciones que puede otorgar, señale palabras claves. Ej.: nanomateriales, bacterias, dislexia, rotación de personal, biorremediación, estructura civil, etc.
              </p>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="palabrasClave">Palabras clave</Label>
                <Textarea
                  id="palabrasClave"
                  value={formData.palabrasClave}
                  onChange={(e) => updateFormData('palabrasClave', e.target.value)}
                  placeholder="Ingrese las palabras clave separadas por comas"
                  rows={4}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Separe las palabras clave con comas. Ejemplo: nanomateriales, bacterias probióticas, dislexia
                </p>
              </div>
            </CardContent>
          </Card>
        );
```

### 8. Paso 8 - Soluciones (antes era paso 7)
**Ubicación**: Buscar el caso actual de soluciones

**Acción**: Cambiar `case 7:` por `case 8:`

### 9. Validación del Paso 7
**Ubicación**: En la función `validateStep`, después del caso 6

**Acción**: Agregar validación para palabras clave si es necesario (opcional)

### 10. Función handleSubmit
**Ubicación**: Buscar la función que envía los datos al backend

**Acción**: Actualizar el objeto que se envía para incluir los nuevos campos y eliminar los antiguos

## 📋 Checklist de Verificación

- [ ] Paso 4 (Nivel de Aporte) muestra DEL y DS correctamente
- [ ] Paso 5 (TRL/CRL) solo tiene selectores, sin textareas
- [ ] Paso 6 (PIU) tiene los 12 campos nuevos (6 generales + 6 de propiedad intelectual)
- [ ] Paso 7 (Palabras Clave) existe y funciona
- [ ] Paso 8 (Soluciones) funciona correctamente
- [ ] La validación de cada paso funciona
- [ ] El envío de datos incluye todos los campos nuevos
- [ ] Los campos antiguos de PIU (Q1-Q4, etc.) están eliminados

## 🔄 Aplicar Cambios a Otros Formularios

Los mismos cambios deben aplicarse a:
- `laboratorio/page.tsx`
- `grupo_centro_instituto/page.tsx`
- `centro_produccion/page.tsx`

## 🎨 Mejora de Responsividad ODS

El componente `ODSSelector.tsx` ya usa Cards correctamente. Para mejorar la responsividad, asegúrate de que donde se use tenga un contenedor con ancho máximo:

```typescript
<div className="w-full max-w-4xl mx-auto">
  <ODSSelector ... />
</div>
```

## 🗄️ Actualización del Backend

Recuerda actualizar también:
1. El servicio de hélice interna para manejar los nuevos campos
2. La base de datos para almacenar palabras clave
3. Las validaciones del backend

## 📝 Notas Importantes

- Los campos de PIU ahora permiten valores de 0 a 999
- Las palabras clave se almacenan como texto separado por comas
- Los niveles de aporte (DEL y DS) son números del 1 al 7
- Los niveles TRL y CRL ya no tienen campos de descripción
