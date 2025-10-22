#!/bin/bash

echo "🔄 Reiniciando el backend con la solución de auto-reparación..."
echo ""

cd backend

# Verificar si hay un proceso corriendo
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null ; then
    echo "⚠️  Deteniendo proceso en puerto 5000..."
    kill $(lsof -t -i:5000) 2>/dev/null
    sleep 2
fi

echo "✅ Iniciando backend..."
npm run dev &

echo ""
echo "✅ Backend reiniciado con éxito"
echo ""
echo "📋 Próximos pasos:"
echo "1. Los usuarios afectados deben cerrar sesión"
echo "2. Volver a iniciar sesión"
echo "3. El sistema creará automáticamente los perfiles faltantes"
echo ""
echo "🔍 Para verificar el estado actual, ejecuta en phpMyAdmin:"
echo "   VERIFICAR_USUARIOS_SIN_PERFIL.sql"
