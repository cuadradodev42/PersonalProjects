#!/bin/bash

echo "🔍 Verificando estado del backend..."

# Verificar si el puerto 3001 está en uso
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "✅ Backend está ejecutándose en puerto 3001"
    
    # Intentar hacer una petición HTTP simple
    if curl -s http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Backend responde correctamente"
    else
        echo "⚠️ Backend está en puerto 3001 pero no responde"
    fi
else
    echo "❌ Backend NO está ejecutándose en puerto 3001"
    echo ""
    echo "Para iniciar el backend:"
    echo "  cd backend && npm run dev"
    echo "  O ejecuta: npm run full-dev"
fi

echo ""
echo "🔍 Verificando procesos en puertos 3000 y 3001..."
lsof -i :3000 -i :3001
