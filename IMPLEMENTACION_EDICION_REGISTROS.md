# Implementación de Edición de Registros

## Resumen

Se ha implementado la funcionalidad completa de edición de registros en el formulario de Docente/Investigador. Ahora cuando haces clic en "Editar" desde `/capacidad`, el formulario carga todos los datos existentes del registro.

---

## Cambios Realizados

### 1. Carga de Datos del Registro

**Archivo:** `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`

#### 1.1 Nuevo useEffect para Cargar Datos

```typescript
useEffect(() => {
  const cargarDatosRegistro = async () => {
    // Obtener el parámetro 'edit' de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (!editId || !user) return;

    const token = Cookies.get('token');
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}?tipo=docente_investigador`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar el registro');
      }

      const registro = await response.json();
      
      // Mapear los datos del registro al formulario
      setFormData({
        nombreCompleto: registro.nombre_completo || '',
        emailCorporativo: registro.email || '',
        telefono: registro.telefono || '',
        programaEstudio: registro.programa_estudio || '',
        ctiVitae: registro.url_cti_vitae || '',
        
        // OCDE
        areasOCDE: registro.ocde?.map((o: any) => o.area_id).filter(Boolean) || [],
        subAreasOCDE: registro.ocde?.map((o: any) => o.sub_area_id).filter(Boolean) || [],
        disciplinasOCDE: registro.ocde?.map((o: any) => o.disciplina_id).filter(Boolean) || [],
        
        // ODS
        objetivosODS: registro.ods?.map((o: any) => o.objetivo_id).filter(Boolean) || [],
        metasODS: registro.ods?.map((o: any) => o.meta_id).filter(Boolean) || [],
        
        // Aportes
        nivelAporteDEL: registro.aportes?.nivel_aporte_del || null,
        nivelAporteDS: registro.aportes?.nivel_aporte_ds || null,
        
        // Niveles tecnológicos
        nivelTRL: registro.niveles?.nivel_trl || null,
        nivelCRL: registro.niveles?.nivel_crl || null,
        
        // PIU
        tesis: registro.piu?.tesis || 0,
        libros: registro.piu?.libros || 0,
        capitulosLibro: registro.piu?.capitulos_libro || 0,
        manuscritosPublicados: registro.piu?.manuscritos_publicados || 0,
        manuscritosAceptados: registro.piu?.manuscritos_aceptados || 0,
        manuscritosEvaluacion: registro.piu?.manuscritos_evaluacion || 0,
        propiedadIntelectualPatente: registro.piu?.pi_patente_invencion || 0,
        propiedadIntelectualModalidadUso: registro.piu?.pi_patente_modalidad_uso || 0,
        propiedadIntelectualSuiGeneris: registro.piu?.pi_sui_generis || 0,
        propiedadIntelectualSoftware: registro.piu?.pi_derecho_autor_software || 0,
        propiedadIntelectualObrasLiterarias: registro.piu?.pi_derecho_obras_literarias || 0,
        propiedadIntelectualOtras: registro.piu?.pi_otras || 0,
        
        // Keywords
        palabrasClave: registro.keywords?.map((k: any) => k.keyword_id) || [],
        
        // Soluciones
        soluciones: registro.soluciones?.length > 0 
          ? registro.soluciones.map((s: any) => ({
              titulo: s.titulo || '',
              problema: s.problema || '',
              solucion: s.solucion || ''
            }))
          : [{ titulo: '', problema: '', solucion: '' }]
      });

      // Establecer el paso actual
      setCurrentStep(registro.paso_actual || 1);

    } catch (error) {
      console.error('Error al cargar registro:', error);
      alert('Error al cargar el registro para edición');
    }
  };

  if (user && !isLoading) {
    cargarDatosRegistro();
  }
}, [user, isLoading]);
```

### 2. Modificación del handleSubmit

#### 2.1 Detección de Modo Edición

```typescript
// Verificar si estamos editando
const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get('edit');
const isEditing = !!editId;
```

#### 2.2 Uso de PUT en Lugar de POST

```typescript
const url = isEditing 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}`
  : `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`;

const method = isEditing ? 'PUT' : 'POST';

const response = await fetch(url, {
  method: method,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(datosRegistro)
});
```

#### 2.3 Redirección Diferenciada

```typescript
// Redirigir según el contexto
if (isEditing) {
  alert('Registro actualizado exitosamente');
  router.push('/capacidad');
} else {
  router.push('/registro-helice-interna/confirmacion');
}
```

---

## Flujo de Edición Completo

### 1. Usuario Hace Clic en "Editar"

```
/capacidad → Click "Editar" en registro ID 1
  ↓
Redirige a: /registro-helice-interna/docente_investigador?edit=1
```

### 2. Formulario Detecta Parámetro 'edit'

```
useEffect detecta: ?edit=1
  ↓
Llama a: GET /api/helice-interna/registros/1?tipo=docente_investigador
  ↓
Recibe datos completos del registro
```

### 3. Datos se Mapean al Formulario

```
Registro de BD → FormData
  ↓
nombre_completo → nombreCompleto
email → emailCorporativo
telefono → telefono
programa_estudio → programaEstudio
url_cti_vitae → ctiVitae
ocde[] → areasOCDE[], subAreasOCDE[], disciplinasOCDE[]
ods[] → objetivosODS[], metasODS[]
aportes → nivelAporteDEL, nivelAporteDS
niveles → nivelTRL, nivelCRL
piu → tesis, libros, capitulosLibro, etc.
keywords[] → palabrasClave[]
soluciones[] → soluciones[]
```

### 4. Usuario Modifica Datos

```
Usuario navega por los pasos
  ↓
Modifica campos necesarios
  ↓
Llega al paso final
```

### 5. Usuario Envía el Formulario

```
Click "Enviar"
  ↓
handleSubmit detecta: isEditing = true
  ↓
PUT /api/helice-interna/registros/1
Body: { tipo, ...datosActualizados }
  ↓
Backend actualiza registro
  ↓
Muestra: "Registro actualizado exitosamente"
  ↓
Redirige a: /capacidad
```

---

## Mapeo de Datos

### Estructura del Registro en BD

```json
{
  "registro_id": 1,
  "tipo": "docente_investigador",
  "nombre_completo": "Juan Pérez",
  "email": "juan@unsa.edu.pe",
  "telefono": "+51 999 999 999",
  "programa_estudio": "Ingeniería de Sistemas",
  "url_cti_vitae": "https://ctivitae.concytec.gob.pe/...",
  "estado": "aprobado",
  "paso_actual": 9,
  
  "ocde": [
    {
      "area_id": 1,
      "sub_area_id": 2,
      "disciplina_id": 5
    }
  ],
  
  "ods": [
    {
      "objetivo_id": 4,
      "meta_id": 12
    }
  ],
  
  "aportes": {
    "nivel_aporte_del": 5,
    "nivel_aporte_ds": 6
  },
  
  "niveles": {
    "nivel_trl": 7,
    "nivel_crl": 8
  },
  
  "piu": {
    "tesis": 3,
    "libros": 2,
    "capitulos_libro": 5,
    "manuscritos_publicados": 10,
    "manuscritos_aceptados": 2,
    "manuscritos_evaluacion": 1,
    "pi_patente_invencion": 1,
    "pi_patente_modalidad_uso": 0,
    "pi_sui_generis": 0,
    "pi_derecho_autor_software": 2,
    "pi_derecho_obras_literarias": 0,
    "pi_otras": 1
  },
  
  "keywords": [
    { "keyword_id": 1 },
    { "keyword_id": 5 },
    { "keyword_id": 12 }
  ],
  
  "soluciones": [
    {
      "titulo": "Sistema de IA",
      "problema": "Falta de automatización",
      "solucion": "Implementar ML"
    }
  ]
}
```

### Estructura del FormData

```typescript
{
  nombreCompleto: "Juan Pérez",
  emailCorporativo: "juan@unsa.edu.pe",
  telefono: "+51 999 999 999",
  programaEstudio: "Ingeniería de Sistemas",
  ctiVitae: "https://ctivitae.concytec.gob.pe/...",
  
  areasOCDE: [1],
  subAreasOCDE: [2],
  disciplinasOCDE: [5],
  
  objetivosODS: [4],
  metasODS: [12],
  
  nivelAporteDEL: 5,
  nivelAporteDS: 6,
  
  nivelTRL: 7,
  nivelCRL: 8,
  
  tesis: 3,
  libros: 2,
  capitulosLibro: 5,
  manuscritosPublicados: 10,
  manuscritosAceptados: 2,
  manuscritosEvaluacion: 1,
  propiedadIntelectualPatente: 1,
  propiedadIntelectualModalidadUso: 0,
  propiedadIntelectualSuiGeneris: 0,
  propiedadIntelectualSoftware: 2,
  propiedadIntelectualObrasLiterarias: 0,
  propiedadIntelectualOtras: 1,
  
  palabrasClave: [1, 5, 12],
  
  soluciones: [
    {
      titulo: "Sistema de IA",
      problema: "Falta de automatización",
      solucion: "Implementar ML"
    }
  ]
}
```

---

## Diferencias entre Crear y Editar

### Modo Crear (Nuevo Registro)

| Aspecto | Comportamiento |
|---------|----------------|
| URL | `/registro-helice-interna/docente_investigador` |
| Parámetro | Sin parámetro `?edit` |
| Datos iniciales | Solo auto-rellenado (nombre, email del usuario) |
| Método HTTP | POST |
| Endpoint | `/api/helice-interna/registros` |
| Redirección | `/registro-helice-interna/confirmacion` |
| Mensaje | "Registro exitoso" |

### Modo Editar (Registro Existente)

| Aspecto | Comportamiento |
|---------|----------------|
| URL | `/registro-helice-interna/docente_investigador?edit=1` |
| Parámetro | `?edit={registro_id}` |
| Datos iniciales | Todos los datos del registro cargados |
| Método HTTP | PUT |
| Endpoint | `/api/helice-interna/registros/{id}` |
| Redirección | `/capacidad` |
| Mensaje | "Registro actualizado exitosamente" |

---

## Validaciones

### 1. Verificación de Autenticación

```typescript
const token = Cookies.get('token');
if (!token) return;
```

### 2. Verificación de Parámetro Edit

```typescript
const editId = urlParams.get('edit');
if (!editId || !user) return;
```

### 3. Manejo de Errores

```typescript
try {
  // Cargar datos
} catch (error) {
  console.error('Error al cargar registro:', error);
  alert('Error al cargar el registro para edición');
}
```

---

## Testing

### Caso 1: Editar Registro Existente

**Pasos:**
1. Ir a `/capacidad`
2. Ver lista de registros
3. Click en "Editar" de un registro
4. Verificar que todos los campos están prellenados
5. Modificar algunos campos
6. Navegar por los pasos
7. Click en "Enviar"
8. Verificar mensaje "Registro actualizado exitosamente"
9. Verificar redirección a `/capacidad`
10. Verificar que los cambios se guardaron

**Resultado Esperado:** ✅ Todos los datos se cargan y actualizan correctamente

### Caso 2: Crear Nuevo Registro

**Pasos:**
1. Ir a `/capacidad`
2. Click en "Nuevo Registro"
3. Seleccionar "Docente/Investigador"
4. Verificar que solo nombre y email están prellenados
5. Completar formulario
6. Click en "Enviar"
7. Verificar redirección a confirmación

**Resultado Esperado:** ✅ Se crea un nuevo registro sin problemas

### Caso 3: Editar Sin Parámetro

**Pasos:**
1. Ir directamente a `/registro-helice-interna/docente_investigador`
2. Verificar que funciona como creación normal

**Resultado Esperado:** ✅ Funciona como modo crear

---

## Próximos Pasos

### 1. Implementar en Otros Formularios

Aplicar la misma lógica a:
- `grupo_centro_instituto/page.tsx`
- `laboratorio/page.tsx`
- `centro_produccion/page.tsx`

### 2. Mejorar UX

- Mostrar indicador "Editando registro" en el título
- Botón "Cancelar" que vuelva a `/capacidad`
- Confirmación antes de salir si hay cambios sin guardar

### 3. Optimizaciones

- Cachear datos del registro
- Mostrar loading mientras carga
- Validar que el registro pertenece al usuario

---

## Archivos Modificados

### Frontend:
- ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`
  - Nuevo useEffect para cargar datos
  - handleSubmit modificado para soportar PUT
  - Redirección diferenciada

---

## Comandos para Probar

```bash
# 1. Asegurarse de que backend y frontend estén corriendo
cd backend && npm run dev
cd frontend && npm run dev

# 2. Ir a la página de gestión
http://localhost:3000/capacidad

# 3. Click en "Editar" de cualquier registro

# 4. Verificar que:
- Todos los campos están prellenados
- Puedes navegar por los pasos
- Los cambios se guardan correctamente
```

---

**Fecha:** 2 de noviembre de 2025
**Estado:** Edición completamente funcional para Docente/Investigador
