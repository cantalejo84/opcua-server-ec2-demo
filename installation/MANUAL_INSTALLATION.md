# Instalación Manual del Servidor OPC UA Demo

Este repositorio ahora utiliza **instalación manual** en lugar de UserData automático, dándote total flexibilidad para modificar el servidor OPC UA según tus necesidades.

## 📋 Requisitos Previos

- Stack de CloudFormation desplegado
- Acceso a la instancia EC2 via AWS Systems Manager (SSM Console)

## 🚀 Pasos de Instalación

### 1. Desplegar la Infraestructura

Despliega el stack usando GitHub Actions o AWS Console. Esto creará:
- ✅ Instancia EC2 (Amazon Linux 2023)
- ✅ Security Group (puerto 4840 abierto)
- ✅ IAM Role para SSM
- ❌ **NO instala el servidor OPC UA automáticamente**

### 2. Conectar via SSM

1. Ve a [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Selecciona tu instancia `opcua-demo-server`
3. Click **Connect** → **Session Manager** → **Connect**

O usa el link `SSMConsoleURL` del output de CloudFormation.

### 3. Descargar Scripts de Instalación

Desde la sesión SSM, descarga los scripts desde tu repositorio GitHub:

```bash
# Crear directorio de trabajo
mkdir -p /tmp/opcua-install
cd /tmp/opcua-install

# Descargar scripts desde GitHub
# Reemplaza TU-USER y TU-REPO con tu información
curl -O https://raw.githubusercontent.com/TU-USER/TU-REPO/main/installation/install-opcua.sh
curl -O https://raw.githubusercontent.com/TU-USER/TU-REPO/main/installation/server.js
curl -O https://raw.githubusercontent.com/TU-USER/TU-REPO/main/installation/create-certificates.sh
curl -O https://raw.githubusercontent.com/TU-USER/TU-REPO/main/installation/setup-service.sh

# Dar permisos de ejecución
chmod +x *.sh
```

**Alternativa:** Si prefieres copiar manualmente, usa `nano` para crear cada archivo.

### 4. Ejecutar Instalación Base

```bash
cd /tmp/opcua-install
sudo bash install-opcua.sh
```

Esto instala:
- Node.js 20
- node-opcua npm package
- Estructura de directorios en `/opt/opcua-server`

### 5. Personalizar el Servidor (OPCIONAL)

Ahora puedes modificar el servidor a tu gusto:

```bash
cd /opt/opcua-server

# Editar el servidor
sudo nano server.js
```

**Ejemplos de modificaciones:**
- Cambiar variables simuladas
- Añadir nuevas variables
- Cambiar rangos de valores
- Modificar frecuencias de actualización
- Añadir lógica personalizada

### 6. Copiar server.js Personalizado

```bash
# Si modificaste server.js localmente, cópialo
sudo cp /tmp/opcua-install/server.js /opt/opcua-server/server.js
sudo chown ec2-user:ec2-user /opt/opcua-server/server.js
```

### 7. Generar Certificados SSL

⚠️ **IMPORTANTE:** Los certificados son **obligatorios** incluso para modo demo. La versión actual de node-opcua (2.119.0) requiere certificados para iniciar el servidor, aunque el cliente pueda conectar sin seguridad (modo None/Anonymous).

```bash
# Como ec2-user (NO root)
su - ec2-user
cd /tmp/opcua-install
bash create-certificates.sh
```

Esto genera certificados autofirmados en:
```
~/.config/node-opcua-default-nodejs/PKI/own/certs/certificate.pem
~/.config/node-opcua-default-nodejs/PKI/own/private/private_key.pem
```

**Nota:** El servidor tendrá certificados, pero aceptará conexiones sin seguridad desde clientes (modo None/Anonymous). El cliente NO necesita tener su propio certificado.

### 8. Configurar Servicio Systemd

```bash
# Volver a root
exit  # o Ctrl+D

cd /tmp/opcua-install
sudo bash setup-service.sh
```

### 9. Iniciar el Servidor

```bash
sudo systemctl start opcua-server

# Verificar estado
sudo systemctl status opcua-server

# Ver logs
sudo journalctl -u opcua-server -f
```

## ✅ Verificación

Si todo está correcto, verás:

```
● opcua-server.service - OPC UA Demo Server
     Loaded: loaded
     Active: active (running)
```

Y en los logs:
```
🚀 Servidor OPC UA iniciado correctamente
Puerto: 4840
Endpoint: opc.tcp://0.0.0.0:4840/UA/DemoServer
```

## 🔌 Conectar desde Cliente OPC UA

Usa tu cliente favorito (UaExpert, Prosys, etc.):

**Endpoint:** `opc.tcp://IP_PUBLICA:4840/UA/DemoServer`

(Obtén IP_PUBLICA del output de CloudFormation)

**Navegar a:** `Objects → Simulation`

## 🛠️ Comandos Útiles

```bash
# Ver estado
sudo systemctl status opcua-server

# Reiniciar
sudo systemctl restart opcua-server

# Detener
sudo systemctl stop opcua-server

# Ver logs en tiempo real
sudo journalctl -u opcua-server -f

# Ver últimas 50 líneas de log
sudo journalctl -u opcua-server -n 50
```

## 📝 Modificar Variables Después de Instalación

Para modificar las variables simuladas:

```bash
# 1. Editar server.js
sudo nano /opt/opcua-server/server.js

# 2. Reiniciar servicio
sudo systemctl restart opcua-server

# 3. Verificar
sudo systemctl status opcua-server
```

## 🎯 Ventajas de Instalación Manual

✅ **Total flexibilidad** - Modifica el servidor como quieras
✅ **Sin redeployments** - Cambia variables sin recrear el stack
✅ **Debugging fácil** - Ejecuta manualmente para ver errores
✅ **Control completo** - Sabes exactamente qué se instala
✅ **Versionado simple** - Commitea tus cambios en server.js

## 📁 Estructura de Archivos

```
/opt/opcua-server/
├── package.json          # Dependencias npm
├── node_modules/         # Librerías instaladas
└── server.js             # Tu servidor OPC UA

~/.config/node-opcua-default-nodejs/PKI/own/
├── certs/
│   └── certificate.pem   # Certificado SSL
└── private/
    └── private_key.pem   # Clave privada
```

## 🆘 Troubleshooting

### El servicio no inicia

```bash
# Ver error exacto
sudo journalctl -u opcua-server -n 50

# Probar manualmente
cd /opt/opcua-server
node server.js
```

### Certificados no encontrados

```bash
# Regenerar como ec2-user
su - ec2-user
bash /tmp/opcua-install/create-certificates.sh
```

### Puerto 4840 ocupado

```bash
# Ver qué está usando el puerto
sudo netstat -tulpn | grep 4840
sudo ss -tulpn | grep 4840
```

## 📚 Recursos

- [node-opcua Documentation](http://node-opcua.github.io/)
- [OPC Foundation](https://opcfoundation.org/)
- [UaExpert Client](https://www.unified-automation.com/products/development-tools/uaexpert.html)