#!/bin/bash
#
# Script para generar certificados SSL para el servidor OPC UA
# Ejecutar como el usuario que correrá el servidor (ec2-user o root)
#

echo "========================================"
echo "Generando Certificados SSL para OPC UA"
echo "========================================"
echo ""

# Detectar el usuario actual
CURRENT_USER=$(whoami)
echo "Usuario actual: $CURRENT_USER"

# Directorio de certificados
CERT_DIR="$HOME/.config/node-opcua-default-nodejs/PKI/own"

# Crear directorios
echo "📁 Creando directorios..."
mkdir -p "$CERT_DIR/certs"
mkdir -p "$CERT_DIR/private"

# Generar certificados con openssl
echo "🔐 Generando certificado autofirmado..."

openssl req -x509 \
    -newkey rsa:2048 \
    -keyout "$CERT_DIR/private/private_key.pem" \
    -out "$CERT_DIR/certs/certificate.pem" \
    -days 3650 \
    -nodes \
    -subj "/CN=DemoOPCUAServer/O=Demo/C=ES"

# Verificar
if [ -f "$CERT_DIR/certs/certificate.pem" ] && [ -f "$CERT_DIR/private/private_key.pem" ]; then
    echo ""
    echo "✅ Certificados generados exitosamente"
    echo ""
    echo "📂 Ubicación:"
    echo "   Certificado: $CERT_DIR/certs/certificate.pem"
    echo "   Clave privada: $CERT_DIR/private/private_key.pem"
    echo ""
    echo "⚠️  Nota: Estos certificados son autofirmados para demo."
    echo "   Para producción, usa certificados de una CA confiable."
    echo ""
else
    echo ""
    echo "❌ Error: No se pudieron generar los certificados"
    exit 1
fi
