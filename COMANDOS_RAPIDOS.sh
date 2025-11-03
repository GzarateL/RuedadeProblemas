#!/bin/bash

# ====================================================================
# COMANDOS RÁPIDOS - Solución de Errores 404/401
# ====================================================================
# Copia y pega estos comandos en tu terminal

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuración de BD
DB_USER="asertiva_ruedadeproblemasdb"
DB_NAME="asertiva_ruedadeproblemasdb"
DB_PASS="aV40P5cGv\$"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  SOLUCIÓN ERRORES 404/401${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# ====================================================================
# 1. BACKUP
# ====================================================================
echo -e "${YELLOW}[1/5] Creando backup...${NC}"
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup creado: $BACKUP_FILE${NC}"
else
    echo -e "${RED}❌ Error al crear backup${NC}"
    exit 1
fi
echo ""

# ====================================================================
# 2. DIAGNÓSTICO PRE-MIGRACIÓN
# ====================================================================
echo -e "${YELLOW}[2/5] Ejecutando diagnóstico...${NC}"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < backend/database/DIAGNOSTICO.sql > diagnostico_pre.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Diagnóstico guardado en: diagnostico_pre.txt${NC}"
else
    echo -e "${RED}❌ Error en diagnóstico${NC}"
fi
echo ""

# ====================================================================
# 3. APLICAR MIGRACIÓN
# ====================================================================
echo -e "${YELLOW}[3/5] Aplicando migración...${NC}"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < backend/database/APLICAR_MIGRACION.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Migración aplicada exitosamente${NC}"
else
    echo -e "${RED}❌ Error al aplicar migración${NC}"
    echo -e "${YELLOW}Restaurando backup...${NC}"
    mysql -u $DB_USER -p$DB_PASS $DB_NAME < $BACKUP_FILE
    exit 1
fi
echo ""

# ====================================================================
# 4. DIAGNÓSTICO POST-MIGRACIÓN
# ====================================================================
echo -e "${YELLOW}[4/5] Verificando migración...${NC}"
mysql -u $DB_USER -p$DB_PASS $DB_NAME < backend/database/DIAGNOSTICO.sql > diagnostico_post.txt

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Verificación guardada en: diagnostico_post.txt${NC}"
else
    echo -e "${RED}❌ Error en verificación${NC}"
fi
echo ""

# ====================================================================
# 5. REINICIAR BACKEND
# ====================================================================
echo -e "${YELLOW}[5/5] Reiniciando backend...${NC}"
echo -e "${YELLOW}Presiona Ctrl+C para detener el servidor cuando termines de probar${NC}"
echo ""

cd backend
npm run dev

# ====================================================================
# FIN
# ====================================================================
