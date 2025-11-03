# Solución a Errores de Edición de Registros

## Problemas Identificados

### 1. Error de Keys Duplicadas en React
**Error:** `Encountered two children with the same key, '4'`

**Causa:** Los registros de diferentes tipos (docente_investigador, grupo_centro_instituto, laboratorio) pueden tener el mismo `registro_id` porque cada tipo tiene su propia tabla con IDs independientes.

**Solución:** Cambiar la key del componente para incluir el tipo de registro:
```tsx
// Antes
<Card key={registro.registro_id}>

// Después
<Card key={`${registro.tipo}-${registro.registro_id}`}>
```

**Archivo modificado:** `frontend/src/app/capacidad/page.tsx` (línea 189)

### 2. No Carga Datos al Editar
**Problema:** Al hacer clic en "Editar", el formulario aparece vacío en lugar de mostrar los datos existentes.

**Causa:** Las páginas de edición no tenían implementada la lógica para:
1. Detectar el parámetro `edit` en la URL
2. Cargar los datos del registro desde el backend
3. Mapear los datos al estado del formulario

**Solución Implementada:**

#### A. Importar dependencias necesarias
```tsx
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
```

#### B. Agregar estados y parámetros
```tsx
const searchParams = useSearchParams();
const editId = searchParams.get('edit');
const [isLoadingData, setIsLoadingData] = useState(false);
```

#### C. Agregar useEffect para cargar datos
```tsx
useEffect(() => {
  const cargarDatosRegistro = async () => {
    if (!editId || !user) return;

    setIsLoadingData(true);
    const token = Cookies.get('token');
    if (!token) {
      toast.error('No autenticado');
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}?tipo=TIPO_REGISTRO`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!res.ok) throw new Error('Error al cargar el registro');

      const data = await res.json();
      
      // Mapear datos al formulario
      setFormData({
        // ... mapeo de campos
      });

      setCurrentStep(data.paso_actual || 1);
      toast.success('Datos cargados correctamente');
    } catch (err: any) {
      console.error('Error cargando registro:', err);
      toast.error('Error al cargar el registro');
    } finally {
      setIsLoadingData(false);
    }
  };

  cargarDatosRegistro();
}, [editId, user]);
```

#### D. Actualizar condición de loading
```tsx
if (isLoading || isLoadingData) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
    </div>
  );
}
```

#### E. Actualizar función handleSubmit
```tsx
const handleSubmit = async () => {
  // ... validaciones

  const url = editId 
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros/${editId}`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/helice-interna/registros`;
  
  const method = editId ? 'PUT' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(datosRegistro)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Error al ${editId ? 'actualizar' : 'registrar'}`);
  }

  toast.success(editId ? 'Registro actualizado exitosamente' : 'Registro creado exitosamente');
  router.push('/capacidad');
};
```

## Archivos Modificados

1. ✅ `frontend/src/app/capacidad/page.tsx` - Corregido error de keys duplicadas
2. ✅ `frontend/src/app/registro-helice-interna/grupo_centro_instituto/page.tsx` - Implementada edición completa
3. ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx` - Implementada edición completa

## Archivos Pendientes (Mismo Patrón)

Para completar la funcionalidad en todos los tipos de registro, aplicar el mismo patrón a:
- `frontend/src/app/registro-helice-interna/laboratorio/page.tsx`
- `frontend/src/app/registro-helice-interna/centro_produccion/page.tsx` (si existe)

## Flujo de Edición Completo

1. Usuario ve sus registros en `/capacidad`
2. Hace clic en "Editar" → Redirige a `/registro-helice-interna/TIPO?edit=ID`
3. La página detecta el parámetro `edit` y carga los datos del backend
4. Los datos se mapean al formulario y se muestra el paso actual
5. Usuario modifica los datos y hace clic en "Guardar"
6. Se envía PUT al backend con los datos actualizados
7. Redirige a `/capacidad` con mensaje de éxito

## Beneficios

- ✅ Elimina error de React sobre keys duplicadas
- ✅ Permite editar registros existentes con datos precargados
- ✅ Mantiene el paso actual del registro
- ✅ Usa toast notifications en lugar de alerts
- ✅ Manejo de errores mejorado
- ✅ Experiencia de usuario consistente entre creación y edición
