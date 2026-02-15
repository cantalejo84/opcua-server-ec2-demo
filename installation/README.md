# Installation Scripts

This folder contains all the scripts needed to manually install the OPC UA server on your EC2 instance.

## 📁 Files

- **MANUAL_INSTALLATION.md** - Complete step-by-step installation guide
- **install-opcua.sh** - Base installation script (Node.js + node-opcua)
- **server.js** - OPC UA server with 8 simulated variables (customizable)
- **create-certificates.sh** - SSL certificate generation script
- **setup-service.sh** - Systemd service configuration script

## 🚀 Quick Start

1. Deploy infrastructure via GitHub Actions
2. Connect to EC2 via SSM Console
3. Download these scripts to the instance
4. Follow [MANUAL_INSTALLATION.md](MANUAL_INSTALLATION.md)

## ⚙️ Customization

The `server.js` file is designed to be easily modified. You can:
- Add/remove variables
- Change simulation logic
- Modify update frequencies
- Add custom OPC UA methods
- Create different folder structures

After any changes, just restart the service:
```bash
sudo systemctl restart opcua-server
```

## 📝 Important Notes

- **Certificates are required** even for demo mode (node-opcua 2.119.0 requirement)
- Clients can connect without certificates using None/Anonymous mode
- All scripts should be run from an SSM session, not from UserData
- The server runs as `ec2-user` by default

## 🔗 Links

- [Main README](../README_GITHUB.md)
- [CloudFormation Template](../opcua-ec2-cloudformation.yaml)
- [GitHub Actions Workflow](../.github/workflows/deploy.yml)