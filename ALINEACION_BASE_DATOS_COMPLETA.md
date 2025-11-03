# Alineación Completa con la Base de Datos

## Resumen de Cambios Realizados

Se ha realizado una alineación completa del backend y frontend con la estructura real de la base de datos definida en `backend/database/database_general.sql`.

---

## 1. CAMBIOS EN EL BACKEND

### 1.1 Servicio de Hélice Interna (`backend/src/api/helice-interna/helice-interna.service.ts`)

**ANTES:**
- Usaba una tabla unificada `registros_helice_interna` con `tipo_id`
- Campos genéricos que no coincidían con la BD

**DESPUÉS:**
- Usa las 4 tablas separadas según la BD:
  - `Registro_Docente_Investigador`
  - `Registro_Grupo_Centro_Instituto`
  - `Registro_Laboratorio`
  - `Registro_Centro_Produccion`

**Campos Correctos por Tipo:**

#### Docente Investigador:
```sql
- nombre_completo
- email
- telefono
- programa_estudio
- url_cti_vitae
```

#### Grupos/Centros/Institutos/Laboratorios/Producción:
```sql
- nombre (del grupo/centro/laboratorio)
- nombre_completo_responsable
- email
- telefono
- oficina_departamento_vinculado
```

### 1.2 Tablas Compartidas (Usan `usuario_id` directamente)

Todas estas tablas ahora se manejan correctamente:

1. **Registro_OCDE**
   - `usuario_id`, `area_id`, `sub_area_id`, `disciplina_id`
   - Permite múltiples registros por usuario

2. **Registro_ODS**
   - `usuario_id`, `objetivo_id`, `meta_id`
   - Permite múltiples registros por usuario

3. **Registro_Aportes**
   - `usuario_id`, `nivel_aporte_del` (1-7), `nivel_aporte_ds` (1-7)
   - Un registro único por usuario

4. **Registro_CTI_Vitae**
   - `usuario_id`, `url_cti`, `orden`
   - Para múltiples URLs (grupos/centros/institutos)

5. **Registro_Niveles_Tecnologicos**
   - `usuario_id`, `nivel_trl` (1-9), `nivel_crl` (1-9)
   - Un registro único por usuario

6. **Registro_PIU** (Producción Intelectual Universitaria)
   ```sql
   - tesis
   - libros
   - capitulos_libro
   - manuscritos_publicados
   - manuscritos_aceptados
   - manuscritos_evaluacion
   - pi_patente_invencion
   - pi_patente_modalidad_uso
   - pi_sui_generis
   - pi_derecho_autor_software
   - pi_derecho_obras_literarias
   - pi_otras
   ```

7. **Registro_Keywords**
   - `usuario_id`, `keyword_id`
   - Relación con `keywords_catalog`

8. **Registro_Soluciones**
   - `usuario_id`, `titulo`, `problema`, `solucion`, `orden`
   - Múltiples soluciones por usuario

9. **Registro_Archivos**
   - `usuario_id`, `nombre_archivo`, `ruta_archivo`, `tipo_archivo`, `tamano_archivo`, `descripcion`

### 1.3 Controlador de Hélice Interna

**Cambios:**
- Ahora requiere el parámetro `tipo` en las peticiones
- Métodos actualizados:
  - `crearRegistro`: Recibe `tipo` en el body
  - `getRegistro`: Requiere `tipo` en query params
  - `completarRegistro`: Requiere `tipo` en body
  - `eliminarRegistro`: Requiere `tipo` en query params
  - `aprobarRechazarRegistro`: Requiere `tipo` en body

### 1.4 Servicio de Autenticación (`backend/src/api/auth/auth.service.ts`)

**Corrección en `verify()`:**
- Ahora busca correctamente en las 4 tablas de hélice interna
- Ya no intenta buscar en `registros_helice_interna` (que no existe)
- Devuelve `investigador_id` si encuentra un registro

---

## 2. CAMBIOS EN EL FRONTEND

### 2.1 Formulario de Docente Investigador

**Archivo:** `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`

**Cambios en `handleSubmit`:**
- Ahora envía los datos al endpoint `/api/helice-interna/registros`
- Estructura de datos alineada con la BD:

```typescript
{
  tipo: 'docente_investigador',
  nombre_completo: string,
  email: string,
  telefono: string,
  programa_estudio: string,
  url_cti_vitae: string,
  
  ocde: Array<{
    area_id?: number,
    sub_area_id?: number,
    disciplina_id?: number
  }>,
  
  ods: Array<{
    objetivo_id: number,
    meta_id?: number
  }>,
  
  nivel_aporte_del: number (1-7),
  nivel_aporte_ds: number (1-7),
  
  nivel_trl: number (1-9),
  nivel_crl: number (1-9),
  
  piu: {
    tesis: number,
    libros: number,
    capitulos_libro: number,
    manuscritos_publicados: number,
    manuscritos_aceptados: number,
    manuscritos_evaluacion: number,
    pi_patente_invencion: number,
    pi_patente_modalidad_uso: number,
    pi_sui_generis: number,
    pi_derecho_autor_software: number,
    pi_derecho_obras_literarias: number,
    pi_otras: number
  },
  
  keywords: number[],
  soluciones: Array<{
    titulo: string,
    problema: string,
    solucion: string
  }>,
  
  paso_actual: number
}
```

---

## 3. FLUJO DE REGISTRO COMPLETO

### 3.1 Registro Inicial (Usuario Base)

1. Usuario va a `/registro-usuario`
2. Selecciona rol: `interno` o `externo`
3. Se crea registro en tabla `Usuarios`:
   ```sql
   INSERT INTO Usuarios (email, password_hash, rol, nombres_apellidos)
   VALUES (?, ?, ?, ?)
   ```

### 3.2 Registro de Hélice Interna (Solo para rol 'interno')

1. Usuario con rol `interno` va a `/registro-helice-interna`
2. Selecciona tipo:
   - Docente/Investigador
   - Grupo/Centro/Instituto
   - Laboratorio
   - Centro de Producción

3. Completa el formulario multi-paso

4. Al enviar, se crean registros en:
   - Tabla principal según tipo (ej: `Registro_Docente_Investigador`)
   - Tablas compartidas:
     - `Registro_OCDE` (múltiples)
     - `Registro_ODS` (múltiples)
     - `Registro_Aportes` (único)
     - `Registro_CTI_Vitae` (múltiples para grupos)
     - `Registro_Niveles_Tecnologicos` (único)
     - `Registro_PIU` (único)
     - `Registro_Keywords` (múltiples)
     - `Registro_Soluciones` (múltiples)

5. Estado inicial: `borrador`
6. Al completar: `completado`
7. Admin puede aprobar: `aprobado` o `rechazado`

---

## 4. ENDPOINTS DEL API

### 4.1 Públicos (No requieren autenticación)

```
GET  /api/helice-interna/tipos
GET  /api/helice-interna/ocde/areas
GET  /api/helice-interna/ocde/areas/:areaId/sub-areas
GET  /api/helice-interna/ocde/sub-areas/:subAreaId/disciplinas
GET  /api/helice-interna/ods/objetivos
GET  /api/helice-interna/ods/objetivos/:objetivoId/metas
GET  /api/helice-interna/keywords
```

### 4.2 Usuarios Autenticados

```
POST   /api/helice-interna/registros
       Body: { tipo, ...datos }

GET    /api/helice-interna/registros
       Devuelve todos los registros del usuario

GET    /api/helice-interna/registros/:id?tipo=docente_investigador
       Devuelve un registro específico

PUT    /api/helice-interna/registros/:id
       Body: { tipo, ...datos }

DELETE /api/helice-interna/registros/:id?tipo=docente_investigador

POST   /api/helice-interna/registros/:id/completar
       Body: { tipo }
```

### 4.3 Administradores

```
GET    /api/helice-interna/admin/registros
       Devuelve registros pendientes de aprobación

POST   /api/helice-interna/admin/registros/:id/aprobar-rechazar
       Body: { tipo, estado: 'aprobado'|'rechazado', observaciones }
```

---

## 5. COMANDOS PARA PROBAR

### 5.1 Iniciar el Backend

```bash
cd backend
npm install
npm run dev
```

El backend correrá en `http://localhost:4000`

### 5.2 Iniciar el Frontend

```bash
cd frontend
npm install
npm run dev
```

El frontend correrá en `http://localhost:3000`

### 5.3 Probar el Flujo Completo

1. **Registrar Usuario:**
   - Ir a `http://localhost:3000/registro-usuario`
   - Crear cuenta con rol `interno`

2. **Iniciar Sesión:**
   - Ir a `http://localhost:3000/login`
   - Ingresar credenciales

3. **Registrar Hélice Interna:**
   - Ir a `http://localhost:3000/registro-helice-interna`
   - Seleccionar "Docente/Investigador"
   - Completar todos los pasos del formulario
   - Enviar

4. **Verificar en Base de Datos:**
   ```sql
   -- Ver usuario creado
   SELECT * FROM Usuarios WHERE email = 'tu@email.com';
   
   -- Ver registro de docente
   SELECT * FROM Registro_Docente_Investigador WHERE usuario_id = ?;
   
   -- Ver datos OCDE
   SELECT * FROM Registro_OCDE WHERE usuario_id = ?;
   
   -- Ver datos ODS
   SELECT * FROM Registro_ODS WHERE usuario_id = ?;
   
   -- Ver PIU
   SELECT * FROM Registro_PIU WHERE usuario_id = ?;
   ```

---

## 6. VALIDACIONES IMPORTANTES

### 6.1 Campos Obligatorios

**Docente Investigador:**
- nombre_completo ✓
- email ✓
- telefono ✓
- programa_estudio ✓
- url_cti_vitae (opcional)

**Grupos/Centros/Institutos/Laboratorios/Producción:**
- nombre ✓
- nombre_completo_responsable ✓
- email ✓
- telefono ✓
- oficina_departamento_vinculado ✓

### 6.2 Rangos de Valores

- **Nivel Aporte DEL/DS:** 1-7
- **Nivel TRL:** 1-9
- **Nivel CRL:** 1-9
- **PIU:** Todos los campos son números >= 0

---

## 7. PRÓXIMOS PASOS

### 7.1 Formularios Pendientes

Aplicar los mismos cambios a:
- `grupo_centro_instituto/page.tsx`
- `laboratorio/page.tsx`
- `centro_produccion/page.tsx`

### 7.2 Funcionalidades Adicionales

- Subida de archivos (tabla `Registro_Archivos`)
- Edición de registros existentes
- Panel de administración para aprobar/rechazar
- Visualización de perfil completo

---

## 8. NOTAS TÉCNICAS

### 8.1 Transacciones

Todos los registros se crean dentro de transacciones para garantizar consistencia:
- Si falla alguna inserción, se hace rollback completo
- No quedan registros huérfanos

### 8.2 Relaciones

- `usuario_id` es la clave foránea principal
- Todas las tablas compartidas referencian a `Usuarios(usuario_id)`
- Las tablas de registro principal tienen `registro_id` como PK

### 8.3 Estados

```
borrador -> completado -> aprobado/rechazado
```

- `borrador`: Usuario está llenando el formulario
- `completado`: Usuario terminó y envió
- `aprobado`: Admin aprobó el registro
- `rechazado`: Admin rechazó el registro

---

## 9. TROUBLESHOOTING

### Problema: "No se pudo obtener el perfil desde hélice interna"

**Solución:** Este mensaje es normal si el usuario aún no ha completado su registro de hélice interna. El sistema ahora busca correctamente en las 4 tablas.

### Problema: Error al enviar formulario

**Verificar:**
1. Token de autenticación válido
2. Usuario tiene rol `interno`
3. Todos los campos obligatorios están llenos
4. Valores numéricos están en los rangos correctos

### Problema: Datos no se guardan

**Verificar:**
1. Conexión a base de datos activa
2. Tablas existen en la BD
3. Permisos de usuario de BD correctos
4. Logs del backend para ver errores específicos

---

## 10. RESUMEN DE ARCHIVOS MODIFICADOS

### Backend:
- ✅ `backend/src/api/helice-interna/helice-interna.service.ts` (Reescrito completo)
- ✅ `backend/src/api/helice-interna/helice-interna.controller.ts` (Actualizado)
- ✅ `backend/src/api/auth/auth.service.ts` (Corregido método verify)

### Frontend:
- ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx` (Actualizado handleSubmit)

### Pendientes:
- ⏳ `frontend/src/app/registro-helice-interna/grupo_centro_instituto/page.tsx`
- ⏳ `frontend/src/app/registro-helice-interna/laboratorio/page.tsx`
- ⏳ `frontend/src/app/registro-helice-interna/centro_produccion/page.tsx`

---

**Fecha de actualización:** 2 de noviembre de 2025
**Estado:** Backend completamente alineado, Frontend parcialmente actualizado
