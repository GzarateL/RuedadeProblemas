# Guía Paso a Paso: Solución al Problema de ODS

## Problema Detectado

La tabla `Registro_ODS` **no existe** en tu base de datos. Esto significa que las tablas compartidas del sistema de registro de hélice interna no se han creado.

## Causa

Estabas ejecutando las consultas en la base de datos `information_schema` (base de datos del sistema MySQL) en lugar de tu base de datos de aplicación.

---

## Solución Paso a Paso

### PASO 1: Identificar tu Base de Datos

1. Abre phpMyAdmin o tu cliente MySQL
2. Ejecuta el script: `00_SELECT_CORRECT_DATABASE.sql`
3. Busca el nombre de tu base de datos en los resultados (probablemente algo como `asertiva_ruedadeproblemasdb`, `rueda_problemas`, etc.)

**O ejecuta directamente:**
```sql
SELECT 
    SCHEMA_NAME as nombre_base_datos
FROM 
    INFORMATION_SCHEMA.SCHEMATA
WHERE 
    SCHEMA_NAME NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
ORDER BY 
    SCHEMA_NAME;
```

### PASO 2: Seleccionar tu Base de Datos

Una vez identificado el nombre, selecciónala:

```sql
USE nombre_de_tu_base_datos;  -- Reemplaza con el nombre real
```

Por ejemplo:
```sql
USE asertiva_ruedadeproblemasdb;
```

### PASO 3: Verificar que estás en la Base de Datos Correcta

```sql
SELECT DATABASE() as base_datos_actual;
```

Debería mostrar el nombre de tu base de datos de aplicación, NO `information_schema`.

### PASO 4: Verificar qué Tablas Existen

```sql
SHOW TABLES;
```

Deberías ver tablas como:
- `Usuarios`
- `Registro_Docente_Investigador`
- `Registro_Grupo_Centro_Instituto`
- `objetivos`
- `metas`
- etc.

### PASO 5: Verificar si Faltan las Tablas Compartidas

```sql
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = DATABASE()
AND TABLE_NAME LIKE 'Registro_%'
ORDER BY TABLE_NAME;
```

Si **NO** ves estas tablas, necesitas crearlas:
- `Registro_OCDE`
- `Registro_ODS` ← **Esta es la que falta**
- `Registro_Aportes`
- `Registro_CTI_Vitae`
- `Registro_Niveles_Tecnologicos`
- `Registro_PIU`
- `Registro_Keywords`
- `Registro_Soluciones`
- `Registro_Archivos`

### PASO 6: Crear las Tablas Faltantes

**Opción A: Crear todas las tablas compartidas (RECOMENDADO)**

Ejecuta el script completo:
```bash
mysql -u usuario -p nombre_base_datos < backend/database/create_all_shared_tables.sql
```

O desde phpMyAdmin/cliente MySQL:
1. Asegúrate de estar en tu base de datos (USE nombre_base_datos;)
2. Ejecuta el contenido de `create_all_shared_tables.sql`

**Opción B: Crear solo Registro_ODS**

Si solo falta esta tabla:
```bash
mysql -u usuario -p nombre_base_datos < backend/database/create_registro_ods_table.sql
```

### PASO 7: Verificar que las Tablas se Crearon

```sql
DESCRIBE Registro_ODS;
```

Deberías ver estas columnas:
- `id` (INT, PRIMARY KEY)
- `usuario_id` (INT, NOT NULL)
- `registro_id` (INT)
- `tipo` (ENUM)
- `objetivo_id` (INT, NOT NULL)
- `meta_id` (INT, nullable)

### PASO 8: Verificar que Existen Datos de ODS

```sql
-- Verificar objetivos
SELECT COUNT(*) as total_objetivos FROM objetivos;

-- Verificar metas
SELECT COUNT(*) as total_metas FROM metas;
```

Si no hay datos, necesitas poblar estas tablas con los 17 objetivos ODS y sus metas.

### PASO 9: Ejecutar el Diagnóstico Completo

Ahora sí puedes ejecutar el diagnóstico:
```bash
mysql -u usuario -p nombre_base_datos < backend/database/diagnose_ods_problem.sql
```

### PASO 10: Probar el Registro

1. Inicia el backend: `npm run dev` (en la carpeta backend)
2. Inicia el frontend: `npm run dev` (en la carpeta frontend)
3. Completa un formulario de registro de hélice interna
4. Selecciona objetivos ODS y metas específicas
5. Revisa los logs del backend en la consola
6. Verifica en la base de datos:

```sql
SELECT 
    ro.id,
    ro.usuario_id,
    ro.registro_id,
    ro.tipo,
    ro.objetivo_id,
    ro.meta_id,
    o.nombre as objetivo_nombre,
    m.codigo as meta_codigo
FROM Registro_ODS ro
LEFT JOIN objetivos o ON ro.objetivo_id = o.id
LEFT JOIN metas m ON ro.meta_id = m.id
ORDER BY ro.id DESC
LIMIT 10;
```

---

## Resumen de Scripts Disponibles

1. **00_SELECT_CORRECT_DATABASE.sql** - Identifica tu base de datos
2. **check_tables_exist.sql** - Verifica qué tablas existen
3. **create_all_shared_tables.sql** - Crea todas las tablas compartidas (RECOMENDADO)
4. **create_registro_ods_table.sql** - Crea solo la tabla Registro_ODS
5. **diagnose_ods_problem.sql** - Diagnóstico completo del problema
6. **SOLUCION_PROBLEMA_ODS.md** - Documentación técnica del problema

---

## Errores Comunes

### Error: "Unknown table 'REGISTRO_ODS' in information_schema"
**Causa:** Estás en la base de datos `information_schema` en lugar de tu base de datos de aplicación.
**Solución:** Ejecuta `USE nombre_de_tu_base_datos;`

### Error: "Table 'Registro_ODS' doesn't exist"
**Causa:** La tabla no se ha creado.
**Solución:** Ejecuta `create_all_shared_tables.sql`

### Error: "Cannot add foreign key constraint"
**Causa:** Las tablas referenciadas (Usuarios, objetivos, metas) no existen.
**Solución:** Ejecuta primero `database_general.sql` para crear todas las tablas base.

### No se guardan las metas (meta_id es NULL)
**Causa:** La tabla `metas` está vacía.
**Solución:** Pobla la tabla con los datos de las metas ODS.

---

## Contacto y Soporte

Si después de seguir estos pasos el problema persiste:
1. Verifica los logs del backend al guardar un registro
2. Ejecuta el diagnóstico completo
3. Revisa que todas las foreign keys estén correctas
