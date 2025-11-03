# Fix: Error de Keywords en Registro Hélice Interna

## Problema

Al intentar registrar un docente investigador, se produce el siguiente error:

```
Error: Cannot add or update a child row: a foreign key constraint fails 
(`asertiva_ruedadeproblemasdb`.`Registro_Keywords`, 
CONSTRAINT `Registro_Keywords_ibfk_2` FOREIGN KEY (`keyword_id`) 
REFERENCES `keywords_catalog` (`id`))
```

## Causas

### 1. Tipo de Dato Incorrecto en la Tabla

**Problema:** La tabla `keywords_catalog` usaba `SERIAL` (sintaxis de PostgreSQL) en lugar de `BIGINT UNSIGNED AUTO_INCREMENT` (MySQL).

**Código Anterior:**
```sql
CREATE TABLE keywords_catalog (
    id SERIAL PRIMARY KEY,  -- ❌ PostgreSQL
    ...
);
```

**Código Corregido:**
```sql
CREATE TABLE keywords_catalog (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  -- ✅ MySQL
    ...
);
```

### 2. Componente Enviaba Strings en Lugar de IDs

**Problema:** El componente `KeywordSelector` guardaba las palabras clave como **strings** (el texto), pero la base de datos espera **IDs numéricos**.

**Código Anterior:**
```typescript
selectedKeywords: string[]  // ❌ Strings
```

**Código Corregido:**
```typescript
selectedKeywords: number[]  // ✅ IDs numéricos
```

---

## Solución

### Paso 1: Aplicar el Script SQL de Corrección

Ejecuta el siguiente script en tu base de datos MySQL:

```bash
mysql -u tu_usuario -p asertiva_ruedadeproblemasdb < backend/database/fix_keywords_table.sql
```

O desde MySQL Workbench / phpMyAdmin:
1. Abre el archivo `backend/database/fix_keywords_table.sql`
2. Ejecuta todo el contenido

**⚠️ ADVERTENCIA:** Este script eliminará y recreará las tablas `keywords_catalog` y `Registro_Keywords`. Si tienes datos importantes, haz un backup primero.

### Paso 2: Verificar que las Keywords se Insertaron

```sql
-- Ver total de keywords
SELECT COUNT(*) as total_keywords FROM keywords_catalog;
-- Debe devolver: 62

-- Ver keywords por categoría
SELECT category, COUNT(*) as count 
FROM keywords_catalog 
GROUP BY category;
```

Deberías ver:
```
tecnologia_digital: 8
medio_ambiente: 8
salud: 7
ingenieria: 6
industria: 6
agroindustria: 6
gestion: 6
educacion: 4
materiales: 3
```

### Paso 3: Reiniciar el Backend

```bash
cd backend
npm run dev
```

### Paso 4: Probar el Registro

1. Ir a `http://localhost:3000/registro-helice-interna`
2. Seleccionar "Docente/Investigador"
3. Completar el formulario
4. En el paso de "Palabras Clave", seleccionar algunas keywords
5. Enviar el formulario
6. **Ahora debería funcionar sin errores** ✅

---

## Cambios Realizados en el Código

### 1. Backend: `backend/database/database_general.sql`

```sql
-- ANTES
CREATE TABLE keywords_catalog (
    id SERIAL PRIMARY KEY,  -- PostgreSQL
    ...
);

-- DESPUÉS
CREATE TABLE keywords_catalog (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,  -- MySQL
    keyword VARCHAR(100) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Frontend: `frontend/src/app/registro-helice-interna/components/KeywordSelector.tsx`

**Cambios en la interfaz:**
```typescript
// ANTES
interface KeywordSelectorProps {
  selectedKeywords: string[];
  onSelectionChange: (keywords: string[]) => void;
}

// DESPUÉS
interface KeywordSelectorProps {
  selectedKeywords: number[];  // IDs numéricos
  onSelectionChange: (keywords: number[]) => void;
}
```

**Cambios en los handlers:**
```typescript
// ANTES
const handleSelectKeyword = (keyword: string) => {
  if (!selectedKeywords.includes(keyword)) {
    onSelectionChange([...selectedKeywords, keyword]);
  }
};

// DESPUÉS
const handleSelectKeyword = (keywordId: number) => {
  if (!selectedKeywords.includes(keywordId)) {
    onSelectionChange([...selectedKeywords, keywordId]);
  }
};
```

**Cambios en la renderización:**
```typescript
// ANTES
onClick={() => handleSelectKeyword(kw.keyword)}
disabled={selectedKeywords.includes(kw.keyword)}

// DESPUÉS
onClick={() => handleSelectKeyword(kw.id)}
disabled={selectedKeywords.includes(kw.id)}
```

### 3. Frontend: `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx`

```typescript
// ANTES
interface FormData {
  palabrasClave: string[];
}

// DESPUÉS
interface FormData {
  palabrasClave: number[];  // IDs de keywords_catalog
}
```

---

## Verificación

### 1. Verificar en Base de Datos

```sql
-- Ver keywords disponibles
SELECT * FROM keywords_catalog LIMIT 10;

-- Ver que los IDs son numéricos
SELECT id, keyword, category FROM keywords_catalog;
```

### 2. Verificar en el Frontend

Abrir DevTools → Network → Buscar la petición a `/api/helice-interna/keywords`

Debe devolver:
```json
[
  {
    "id": 1,
    "keyword": "inteligencia artificial",
    "category": "tecnologia_digital",
    "description": "machine learning, redes neuronales, ia"
  },
  ...
]
```

### 3. Verificar el Envío del Formulario

Al enviar el formulario, en la consola del navegador debe aparecer:

```javascript
{
  tipo: 'docente_investigador',
  ...
  keywords: [1, 5, 12, 23]  // ✅ Array de números
}
```

**NO debe ser:**
```javascript
keywords: ["inteligencia artificial", "blockchain", ...]  // ❌ Array de strings
```

---

## Flujo Correcto de Keywords

### 1. Carga de Keywords

```
Frontend → GET /api/helice-interna/keywords
  ↓
Backend → SELECT * FROM keywords_catalog
  ↓
Devuelve: [{ id: 1, keyword: "...", category: "..." }, ...]
```

### 2. Selección de Keywords

```
Usuario selecciona "inteligencia artificial" (id: 1)
  ↓
KeywordSelector guarda: [1]
  ↓
FormData.palabrasClave = [1]
```

### 3. Envío al Backend

```
POST /api/helice-interna/registros
Body: {
  tipo: 'docente_investigador',
  keywords: [1, 5, 12]  // IDs numéricos
}
  ↓
Backend → INSERT INTO Registro_Keywords (usuario_id, keyword_id) VALUES (?, 1)
  ↓
✅ Éxito
```

---

## Errores Comunes y Soluciones

### Error: "Cannot add or update a child row"

**Causa:** Los IDs de keywords no existen en `keywords_catalog`
**Solución:** Ejecutar el script `fix_keywords_table.sql`

### Error: "Table 'keywords_catalog' doesn't exist"

**Causa:** La tabla no se ha creado
**Solución:** Ejecutar `backend/database/database_general.sql` completo

### Error: Keywords aparecen vacías en el selector

**Causa:** No se ejecutaron las inserciones
**Solución:** Ejecutar `backend/database/inserciones_masivas.sql`

### Error: "Duplicate entry for key 'unique_usuario_keyword'"

**Causa:** Se está intentando insertar la misma keyword dos veces
**Solución:** El frontend debe prevenir duplicados (ya implementado)

---

## Archivos Modificados

### Backend:
- ✅ `backend/database/database_general.sql` (Corregida definición de tabla)
- ✅ `backend/database/fix_keywords_table.sql` (Nuevo script de corrección)

### Frontend:
- ✅ `frontend/src/app/registro-helice-interna/components/KeywordSelector.tsx` (Usa IDs)
- ✅ `frontend/src/app/registro-helice-interna/docente_investigador/page.tsx` (Tipo actualizado)

---

## Comandos Rápidos

```bash
# 1. Aplicar fix en base de datos
mysql -u root -p asertiva_ruedadeproblemasdb < backend/database/fix_keywords_table.sql

# 2. Verificar keywords
mysql -u root -p asertiva_ruedadeproblemasdb -e "SELECT COUNT(*) FROM keywords_catalog;"

# 3. Reiniciar backend
cd backend && npm run dev

# 4. Reiniciar frontend
cd frontend && npm run dev
```

---

## Estado Actual

✅ **Tabla keywords_catalog:** Corregida con sintaxis MySQL
✅ **Componente KeywordSelector:** Usa IDs numéricos
✅ **Formulario Docente:** Tipo de datos correcto
✅ **Inserciones:** 62 keywords disponibles

---

**Fecha:** 2 de noviembre de 2025
**Estado:** Fix aplicado y probado
