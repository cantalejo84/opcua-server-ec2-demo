#!/bin/bash
#
# Script para crear el servicio systemd del servidor OPC UA
# Debe ejecutarse como root
#

set -e

if [ "$EUID" -ne 0 ]; then 
   echo "Error: Este script debe ejecutarse como root (usa sudo)"
   exit 1
fi

echo "========================================"
echo "Configurando Servicio Systemd"
echo "========================================"
echo ""

# Crear archivo de servicio
echo "📝 Creando /etc/systemd/system/opcua-server.service..."

cat > /etc/systemd/system/opcua-server.service << 'EOF'
[Unit]
Description=OPC UA Demo Server
After=network.target
Documentation=https://github.com/YOUR-REPO

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/opcua-server
ExecStart=/usr/bin/node /opt/opcua-server/server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

# Limites de recursos (opcional)
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target
EOF

# Recargar systemd
echo "🔄 Recargando systemd..."
systemctl daemon-reload

# Habilitar servicio
echo "✅ Habilitando servicio..."
systemctl enable opcua-server

echo ""
echo "✅ Servicio configurado exitosamente"
echo ""
echo "========================================"
echo "Comandos disponibles:"
echo "========================================"
echo ""
echo "Iniciar:    sudo systemctl start opcua-server"
echo "Detener:    sudo systemctl stop opcua-server"
echo "Reiniciar:  sudo systemctl restart opcua-server"
echo "Estado:     sudo systemctl status opcua-server"
echo "Logs:       sudo journalctl -u opcua-server -f"
echo ""
