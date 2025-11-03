# 🚀 Inicio Rápido - Solución de Errores 404/401

## ⚡ Aplicar la Solución en 5 Minutos

### 1️⃣ Backup de la Base de Datos (30 segundos)
```bash
mysqldump -u asertiva_ruedadeproblemasdb -p asertiva_ruedadeproblemasdb > backup_$(date +%Y%m%d_%H%M%S).sql
```
**Contraseña**: `aV40P5cGv$`

### 2️⃣ Aplicar Migración (1 minuto)
```bash
mysql -u asertiva_ruedadeproblemasdb -p asertiva_ruedadeproblemasdb < backend/database/APLICAR_MIGRACION.sql
```
**Contraseña**: `aV40P5cGv$`

### 3️⃣ Reiniciar Backend (30 segundos)
```bash
cd backend
npm run dev
```

### 4️⃣ Verificar Frontend (1 minuto)
1. Abrir navegador: `http://localhost:3000`
2. Login como usuario interno
3. Ir a `/capacidad`
4. ✅ Debe cargar sin errores

### 5️⃣ Probar Registro (2 minutos)
1. Click en "Nueva Capacidad"
2. Completar formulario
3. Verificar que aparece en la lista

---

## 🔍 Verificación Rápida

### ¿Funcionó?
```bash
# Ejecutar diagnóstico
mysql -u asertiva_ruedadeproblemasdb -p asertiva_ruedadeproblemasdb < backend/database/DIAGNOSTICO.sql
```

Busca estas líneas en el output:
```
✅ Campo investigador_id existe
✅ Trigger after_registro_aprobado existe
✅ Vista vista_capacidades_activas existe
✅ Campos de nivel de aporte existen
```

---

## ❌ Si Algo Sale Mal

### Restaurar Backup
```bash
mysql -u asertiva_ruedadeproblemasdb -p asertiva_ruedadeproblemasdb < backup_YYYYMMDD_HHMMSS.sql
```

### Ver Logs del Backend
```bash
cd backend
npm run dev
# Observa los errores en la consola
```

### Ver Errores del Frontend
1. Abrir navegador (F12)
2. Pestaña Console
3. Buscar errores en rojo

---

## 📋 Checklist de Verificación

- [ ] Backup creado
- [ ] Migración aplicada sin errores
- [ ] Backend reiniciado
- [ ] Frontend carga sin 404
- [ ] Puedo ver la lista de capacidades
- [ ] Puedo crear una nueva capacidad
- [ ] La capacidad aparece en la lista

---

## 🎯 ¿Qué se Arregló?

### Antes ❌
```
GET /api/capacidades/mis-capacidades → 404 Not Found
GET /api/solicitudes/pendientes/count → 401 Unauthorized
```

### Ahora ✅
```
GET /api/helice-interna/registros → 200 OK
GET /api/solicitudes/pendientes/count → 200 OK
```

---

## 📞 ¿Necesitas Ayuda?

1. **Ejecuta el diagnóstico** y comparte el output
2. **Revisa los logs** del backend
3. **Verifica la consola** del navegador (F12)

---

## 🎉 ¡Listo!

Tu sistema ahora usa un **esquema unificado** que:
- ✅ Elimina la duplicación de tablas
- ✅ Corrige los errores 404 y 401
- ✅ Sincroniza automáticamente los perfiles
- ✅ Permite gestionar capacidades correctamente

**Tiempo total**: ~5 minutos
**Dificultad**: Baja
**Riesgo**: Mínimo (tienes backup)
