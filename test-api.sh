#!/bin/bash

# Script de prueba de endpoints
# Asegúrate de tener un proxy corriendo que redirija /api a tu backend

echo "=== Prueba de Endpoints API ==="
echo ""

# Test 1: Login
echo "TEST 1: Login"
echo "Endpoint: /api/login/acceder"
echo ""

read -p "Usuario: " USUARIO
read -sp "Contraseña: " PASSWORD
echo ""

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5174/api/login/acceder \
  -H "Content-Type: application/json" \
  -d "{\"usuario\":\"$USUARIO\",\"contraseña\":\"$PASSWORD\",\"dispositivo\":\"postman\"}")

echo "Respuesta:"
echo "$LOGIN_RESPONSE" | jq '.'

# Extraer token si el login fue exitoso
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.datos.usuario.token // empty')
VERSION=$(echo "$LOGIN_RESPONSE" | jq -r '.datos.usuario.version // empty')

if [ -z "$TOKEN" ]; then
  echo ""
  echo "❌ Login falló o no se obtuvo token"
  exit 1
fi

echo ""
echo "✅ Login exitoso!"
echo "Token: $TOKEN"
echo ""

# Test 2: Obtener equipos
echo "TEST 2: Obtener equipos"
echo "Endpoint: /api/equipos/obtener"
echo ""

EQUIPOS_RESPONSE=$(curl -s -X GET http://localhost:5174/api/equipos/obtener \
  -H "Content-Type: application/json" \
  -H "token: $TOKEN" \
  -H "usuario: $USUARIO" \
  -H "dispositivo: postman" \
  -H "version: $VERSION" \
  -H "tipo-app: app")

echo "Respuesta:"
echo "$EQUIPOS_RESPONSE" | jq '.'

# Contar equipos
EQUIPOS_COUNT=$(echo "$EQUIPOS_RESPONSE" | jq '.datos | length')

echo ""
if [ "$EQUIPOS_COUNT" -gt 0 ]; then
  echo "✅ Se obtuvieron $EQUIPOS_COUNT equipos correctamente"
else
  echo "❌ No se obtuvieron equipos o hubo un error"
fi

echo ""
echo "=== Pruebas completadas ==="
