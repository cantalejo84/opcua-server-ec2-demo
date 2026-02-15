#!/bin/bash
#
# Script de instalación del Servidor OPC UA Demo
# Para Amazon Linux 2023
#
# Uso: sudo bash install-opcua.sh
#

set -e

echo "========================================"
echo "Instalación del Servidor OPC UA Demo"
echo "========================================"
echo ""

# Verificar que se ejecuta como root
if [ "$EUID" -ne 0 ]; then 
   echo "Error: Este script debe ejecutarse como root (usa sudo)"
   exit 1
fi

# Actualizar el sistema
echo "📦 Actualizando sistema..."
yum update -y

# Instalar Node.js
echo "📦 Instalando Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
yum install -y nodejs

# Verificar instalación
echo "✓ Node.js instalado: $(node --version)"
echo "✓ npm instalado: $(npm --version)"

# Instalar OpenSSL (para generar certificados)
echo "📦 Instalando OpenSSL..."
yum install -y openssl

# Crear directorio del proyecto
echo "📁 Creando directorio /opt/opcua-server..."
mkdir -p /opt/opcua-server
cd /opt/opcua-server

# Crear package.json
echo "📝 Creando package.json..."
cat > package.json << 'EOF'
{
  "name": "opcua-demo-server",
  "version": "1.0.0",
  "description": "Servidor OPC UA demo con variables simuladas",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "node-opcua": "^2.119.0"
  }
}
EOF

# Instalar dependencias
echo "📦 Instalando node-opcua (esto puede tardar un momento)..."
npm install

echo ""
echo "✓ Instalación completada"
echo ""
echo "========================================"
echo "Siguientes pasos:"
echo "========================================"
echo ""
echo "1. Edita el servidor OPC UA:"
echo "   nano /opt/opcua-server/server.js"
echo ""
echo "2. Genera certificados SSL (necesario):"
echo "   bash /opt/opcua-server/create-certificates.sh"
echo ""
echo "3. Crea el servicio systemd:"
echo "   bash /opt/opcua-server/setup-service.sh"
echo ""
echo "4. Inicia el servidor:"
echo "   sudo systemctl start opcua-server"
echo ""
