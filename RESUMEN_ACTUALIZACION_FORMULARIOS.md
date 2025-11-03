# Resumen de Actualización de Formularios de Hélice Interna

## Estado Actual

### ✅ Completados con Componentes Reutilizables

1. **docente_investigador/page.tsx**
   - Usa todos los componentes reutilizables
   - Código reducido en ~40%
   - Sin errores de TypeScript

2. **grupo_centro_instituto/page.tsx**
   - Usa todos los componentes reutilizables
   - Incluye modo edición
   - Componentes OCDE/ODS con auto-expansión

### ⏳ Pendientes de Actualización

3. **laboratorio/page.tsx**
   - Estructura idéntica a grupo_centro_instituto
   - Solo necesita cambios de texto (títulos)
   - Mismo flujo de 9 pasos

4. **centro_produccion/page.tsx** (si existe)
   - Estructura idéntica a grupo_centro_instituto
   - Solo necesita cambios de texto (títulos)
   - Mismo flujo de 9 pasos

## Estructura Común de Formularios

Todos los formularios de hélice interna siguen esta estructura:

### Paso 1: Información Básica
- Nombre (entidad o persona)
- Email corporativo
- Teléfono
- Programa/Oficina/Departamento

### Paso 2: Áreas OCDE
- Componente: `OCDESelector`
- Selección de áreas, sub-áreas y disciplinas

### Paso 3: Objetivos ODS
- Componente: `ODSSelector`
- Selección de objetivos y metas

### Paso 4: Nivel de Aporte
- Componente: `AporteSelector`
- Nivel DEL (1-7)
- Nivel DS (1-7)

### Paso 5: CTI Vitae (solo grupos/laboratorios/centros)
- Múltiples URLs de CTI Vitae de integrantes
- Validación de formato URL

### Paso 6: Niveles Tecnológicos
- Componente: `NivelesSelector`
- Nivel TRL (1-9)
- Nivel CRL (1-9)

### Paso 7: PIU (Producción Intelectual Universitaria)
- Componente: `PIUSelector`
- 12 campos numéricos (0-999)

### Paso 8: Palabras Clave
- Componente: `KeywordSelector`
- Selección múltiple de keywords del catálogo

### Paso 9: Soluciones
- Componente: `SolucionesEditor`
- Título, Problema, Solución
- Agregar/Eliminar soluciones

## Diferencias entre Tipos

### Docente Investigador
- **Paso 1:** Información personal (nombre completo, programa de estudio)
- **Paso 5:** Solo URL CTI Vitae individual (no múltiple)
- **Total pasos:** 9

### Grupo/Centro/Instituto
- **Paso 1:** Información de entidad (nombre entidad, nombre responsable, oficina/departamento)
- **Paso 5:** Múltiples URLs CTI Vitae de integrantes
- **Total pasos:** 9

### Laboratorio
- **Paso 1:** Información de laboratorio (nombre laboratorio, nombre responsable, oficina/departamento)
- **Paso 5:** Múltiples URLs CTI Vitae de integrantes
- **Total pasos:** 9
- **Diferencia:** Solo textos (títulos y descripciones)

### Centro de Producción
- **Paso 1:** Información de centro (nombre centro, nombre responsable, oficina/departamento)
- **Paso 5:** Múltiples URLs CTI Vitae de integrantes
- **Total pasos:** 9
- **Diferencia:** Solo textos (títulos y descripciones)

## Componentes Reutilizables Disponibles

```
frontend/src/app/registro-helice-interna/components/
├── ProgressBar.tsx          - Barra de progreso visual
├── StepNavigation.tsx       - Botones Anterior/Siguiente/Guardar
├── OCDESelector.tsx         - Selector jerárquico de OCDE
├── ODSSelector.tsx          - Selector jerárquico de ODS
├── AporteSelector.tsx       - Selector de niveles DEL/DS
├── NivelesSelector.tsx      - Selector de niveles TRL/CRL
├── PIUSelector.tsx          - Formulario completo de PIU
├── KeywordSelector.tsx      - Selector múltiple de keywords
└── SolucionesEditor.tsx     - Editor de soluciones con CRUD
```

## Patrón de Implementación

### 1. Imports
```typescript
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import ProgressBar from "../components/ProgressBar";
import StepNavigation from "../components/StepNavigation";
import OCDESelector from "../components/OCDESelector";
import ODSSelector from "../components/ODSSelector";
import AporteSelector from "../components/AporteSelector";
import NivelesSelector from "../components/NivelesSelector";
import PIUSelector from "../components/PIUSelector";
import KeywordSelector from "../components/KeywordSelector";
import SolucionesEditor from "../components/SolucionesEditor";
```

### 2. Estado
```typescript
const searchParams = useSearchParams();
const editId = searchParams.get('edit');
const [isLoadingData, setIsLoadingData] = useState(false);
```

### 3. Uso de Componentes
```typescript
// Paso 4: Aportes
<AporteSelector
  data={{
    nivelAporteDEL: formData.nivelAporteDEL,
    nivelAporteDS: formData.nivelAporteDS
  }}
  onChange={(field, value) => updateFormData(field, value)}
  errors={errors}
/>

// Paso 6: Niveles
<NivelesSelector
  data={{
    nivelTRL: formData.nivelTRL,
    nivelCRL: formData.nivelCRL
  }}
  onChange={(field, value) => updateFormData(field, value)}
/>

// Paso 7: PIU
<PIUSelector
  data={{
    tesis: formData.tesis,
    libros: formData.libros,
    // ... resto de campos
  }}
  onChange={(field, value) => updateFormData(field, value)}
/>

// Paso 8: Keywords
<KeywordSelector
  selectedKeywords={formData.palabrasClave}
  onSelectionChange={(keywords) => updateFormData('palabrasClave', keywords)}
/>

// Paso 9: Soluciones
<SolucionesEditor
  soluciones={formData.soluciones}
  onChange={(soluciones) => updateFormData('soluciones', soluciones)}
  errors={errors}
/>
```

## Próximos Pasos

### Para Laboratorio
1. Copiar estructura de grupo_centro_instituto
2. Cambiar textos:
   - "Grupo, Centro o Instituto" → "Laboratorio"
   - Mantener toda la lógica igual
3. Actualizar tipo en backend: `'laboratorio'`

### Para Centro de Producción
1. Copiar estructura de grupo_centro_instituto
2. Cambiar textos:
   - "Grupo, Centro o Instituto" → "Centro de Producción"
   - Mantener toda la lógica igual
3. Actualizar tipo en backend: `'centro_produccion'`

## Beneficios de la Estandarización

1. **Mantenibilidad:** Cambios en un componente afectan a todos los formularios
2. **Consistencia:** UX uniforme en toda la aplicación
3. **Menos Bugs:** Lógica centralizada y probada
4. **Desarrollo Rápido:** Nuevos formularios se crean en minutos
5. **Código Limpio:** ~40% menos líneas de código

## Archivos Modificados

- ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`
- ✅ `frontend/src/app/registro-helice-interna/grupo_centro_instituto/page.tsx`
- ⏳ `frontend/src/app/registro-helice-interna/laboratorio/page.tsx`
- ⏳ `frontend/src/app/registro-helice-interna/centro_produccion/page.tsx` (si existe)

## Componentes Actualizados

- ✅ `frontend/src/app/registro-helice-interna/components/OCDESelector.tsx` - Auto-expansión en modo edición
- ✅ `frontend/src/app/registro-helice-interna/components/ODSSelector.tsx` - Auto-expansión en modo edición
- ✅ Todos los demás componentes ya funcionaban correctamente

## Backend Actualizado

- ✅ `backend/src/api/helice-interna/helice-interna.service.ts` - Eliminación en cascada
