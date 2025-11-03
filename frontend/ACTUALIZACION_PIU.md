# Actualización del Formulario de Registro Hélice Interna

## Cambios Implementados ✅

1. **Estructura de datos actualizada** - FormData interface
2. **Validación del paso 4 actualizada** - Niveles DEL y DS
3. **Paso 4 (Nivel de Aporte)** - Completamente rediseñado con DEL y DS
4. **Paso 5 (Niveles TRL/CRL)** - Simplificado sin textareas de descripción
5. **Total de pasos actualizado** - De 8 a 9 pasos

## Código para Reemplazar el Paso 6 (PIU)

Buscar `case 6:` en el archivo y reemplazar toda la sección hasta antes de `case 7:` con:

```typescript
      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Producción Intelectual Universitaria (PIU) Alcanzada</CardTitle>
              <p className="text-sm text-gray-600">
                Permite número de 0 a 999. Indique la cantidad de productos de PIU ha logrado
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="tesis">Tesis</Label>
                  <Input
                    id="tesis"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.tesis}
                    onChange={(e) => updateFormData('tesis', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <Label htmlFor="libros">Libros</Label>
                  <Input
                    id="libros"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.libros}
                    onChange={(e) => updateFormData('libros', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <Label htmlFor="capitulosLibro">Capítulos de libro</Label>
                  <Input
                    id="capitulosLibro"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.capitulosLibro}
                    onChange={(e) => updateFormData('capitulosLibro', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <Label htmlFor="manuscritosPublicados">Manuscritos publicados</Label>
                  <Input
                    id="manuscritosPublicados"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.manuscritosPublicados}
                    onChange={(e) => updateFormData('manuscritosPublicados', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <Label htmlFor="manuscritosAceptados">Manuscritos aceptados para publicación</Label>
                  <Input
                    id="manuscritosAceptados"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.manuscritosAceptados}
                    onChange={(e) => updateFormData('manuscritosAceptados', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
                <div>
                  <Label htmlFor="manuscritosEvaluacion">Manuscritos en evaluación</Label>
                  <Input
                    id="manuscritosEvaluacion"
                    type="number"
                    min="0"
                    max="999"
                    value={formData.manuscritosEvaluacion}
                    onChange={(e) => updateFormData('manuscritosEvaluacion', Math.min(999, parseInt(e.target.value) || 0))}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Propiedad Intelectual</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="propiedadIntelectualPatente">Patente de invención</Label>
                    <Input
                      id="propiedadIntelectualPatente"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualPatente}
                      onChange={(e) => updateFormData('propiedadIntelectualPatente', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propiedadIntelectualModalidadUso">Patente modalidad de uso</Label>
                    <Input
                      id="propiedadIntelectualModalidadUso"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualModalidadUso}
                      onChange={(e) => updateFormData('propiedadIntelectualModalidadUso', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propiedadIntelectualSuiGeneris">Sui generis</Label>
                    <Input
                      id="propiedadIntelectualSuiGeneris"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualSuiGeneris}
                      onChange={(e) => updateFormData('propiedadIntelectualSuiGeneris', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propiedadIntelectualSoftware">Derecho de Autor Software</Label>
                    <Input
                      id="propiedadIntelectualSoftware"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualSoftware}
                      onChange={(e) => updateFormData('propiedadIntelectualSoftware', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propiedadIntelectualObrasLiterarias">Derecho de Obras literarias</Label>
                    <Input
                      id="propiedadIntelectualObrasLiterarias"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualObrasLiterarias}
                      onChange={(e) => updateFormData('propiedadIntelectualObrasLiterarias', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="propiedadIntelectualOtras">Propiedad intelectual (otras)</Label>
                    <Input
                      id="propiedadIntelectualOtras"
                      type="number"
                      min="0"
                      max="999"
                      value={formData.propiedadIntelectualOtras}
                      onChange={(e) => updateFormData('propiedadIntelectualOtras', Math.min(999, parseInt(e.target.value) || 0))}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
```

## Código para el Nuevo Paso 7 (Palabras Clave)

Agregar después del caso 6 y antes del caso de soluciones:

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

## Actualizar el Caso de Soluciones

Cambiar `case 7:` por `case 8:` en la sección de soluciones.

## Actualizar la Validación

En la función `validateStep`, cambiar:
- El caso 7 actual debe ser caso 8
- Agregar validación para caso 7 (palabras clave) si es necesario

## Responsividad de ODS

El componente ODSSelector ya usa Cards correctamente. Para mejorar la responsividad, asegúrate de que el contenedor padre tenga:

```typescript
<div className="w-full max-w-4xl mx-auto">
  <ODSSelector ... />
</div>
```
