# AWS OPC UA Demo Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CloudFormation](https://img.shields.io/badge/AWS-CloudFormation-orange.svg)](https://aws.amazon.com/cloudformation/)
[![OPC UA](https://img.shields.io/badge/OPC--UA-Enabled-blue.svg)](https://opcfoundation.org/)

CloudFormation template to deploy an OPC UA demo server on AWS EC2 with simulated real-time variables. Perfect for testing, learning, and development.

## 🎯 Features

- **One-Click Deployment** - Single CloudFormation template
- **No Docker Required** - Direct Node.js installation for simplicity
- **8 Simulated Variables** - Temperature, pressure, RPM, tank level, and more
- **Real-Time Data** - Variables update continuously
- **Auto-Start Service** - Runs automatically via systemd
- **Ready to Use** - Connect any OPC UA client immediately

## 📊 Simulated Variables

The server provides 8 industrial-style simulated variables:

| Variable | Type | Range/Values | Update Frequency |
|----------|------|--------------|------------------|
| Temperature | Double | 20-30°C | Continuous |
| Pressure | Double | 95-105 bar | Continuous |
| FanSpeed | Int32 | 800-1200 RPM | Continuous |
| PumpSpeed | Int32 | 500-700 RPM | Continuous |
| TankLevel | Double | 40-80% | Continuous |
| MachineState | String | Running/Idle/Maintenance/Stopped | Every 15s |
| Counter | Int32 | Increments | Every 1s |
| ServerTime | DateTime | Current time | Continuous |

All variables are located under: `Objects/Simulation/`

## 🚀 Quick Start

### Prerequisites

- AWS Account
- EC2 Key Pair (for SSH access)
- AWS CLI configured (optional)

### Deploy via AWS Console

1. Download `opcua-ec2-cloudformation.yaml`
2. Go to [AWS CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
3. Click **Create stack** → **With new resources**
4. Upload the template file
5. Fill in parameters:
   - **Stack name**: `opcua-demo-server`
   - **KeyName**: Your EC2 key pair name
   - **InstanceType**: `t3.small` (recommended)
   - **SSHLocation**: Your IP or `0.0.0.0/0`
6. Review and create

### Deploy via AWS CLI

```bash
aws cloudformation create-stack \
  --stack-name opcua-demo-server \
  --template-body file://opcua-ec2-cloudformation.yaml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=your-key-pair \
    ParameterKey=InstanceType,ParameterValue=t3.small
```

## 🔌 Connect to the Server

After deployment, get the server endpoint from CloudFormation Outputs:

```
opc.tcp://YOUR_PUBLIC_IP:4840/UA/DemoServer
```

### Using UaExpert (Recommended)

1. Download [UaExpert](https://www.unified-automation.com/downloads/opc-ua-clients.html)
2. Add Server → Enter endpoint URL
3. Security: **None**, Policy: **None**
4. Connect and browse to `Objects → Simulation`
5. Subscribe to variables to see real-time updates

### Using Python

```python
from opcua import Client

client = Client("opc.tcp://YOUR_PUBLIC_IP:4840/UA/DemoServer")
client.connect()

# Read temperature
temp_node = client.get_node("ns=1;s=Temperature")
print(f"Temperature: {temp_node.get_value()}°C")

client.disconnect()
```

### Using Node-RED

Install the OPC UA node:
```bash
npm install node-red-contrib-opcua
```

Configure the OPC UA client node with your endpoint and start reading variables.

## 🛠️ Management

### SSH Access

```bash
ssh -i your-key-pair.pem ec2-user@YOUR_PUBLIC_IP
```

### Helper Scripts (on EC2 instance)

```bash
./check-opcua.sh     # Check server status
./logs-opcua.sh      # View real-time logs
./restart-opcua.sh   # Restart the server
```

### Systemd Commands

```bash
# Check status
sudo systemctl status opcua-server

# View logs
sudo journalctl -u opcua-server -f

# Restart
sudo systemctl restart opcua-server

# Stop
sudo systemctl stop opcua-server

# Start
sudo systemctl start opcua-server
```

## 📁 Stack Outputs

The CloudFormation stack provides these outputs:

- **InstanceId** - EC2 instance ID
- **PublicIP** - Server public IP address
- **OPCUAEndpoint** - Full OPC UA endpoint URL
- **SSHCommand** - Ready-to-use SSH command
- **CheckServerStatus** - Command to verify server status

## 💰 Cost Estimate

- **EC2 t3.small**: ~$0.0208/hour (~$15/month)
- **Data transfer**: Variable based on usage
- **EBS storage**: Included in instance cost

> **Note**: Remember to delete the stack when not in use to avoid charges.

## 🧹 Cleanup

### Via AWS Console

1. Go to CloudFormation
2. Select your stack
3. Click **Delete**

### Via AWS CLI

```bash
aws cloudformation delete-stack --stack-name opcua-demo-server
```

## 🔒 Security

⚠️ **This is a DEMO server** - Not configured for production use.

For production environments:

- Enable OPC UA authentication and encryption
- Restrict Security Group to specific IPs
- Use SSL/TLS certificates
- Implement proper security policies
- Use private subnets with VPN/bastion host

## 🐛 Troubleshooting

### Server not responding

```bash
# Check service status
sudo systemctl status opcua-server

# View recent logs
sudo journalctl -u opcua-server -n 50

# Verify Node.js installation
node --version

# Check if port is listening
sudo netstat -tulpn | grep 4840
```

### Cannot connect from client

- Verify Security Group allows port 4840
- Confirm you're using the correct endpoint URL
- Use security mode "None" and policy "None"
- Check EC2 instance public IP hasn't changed

### UserData didn't execute

```bash
# View cloud-init logs
sudo cat /var/log/cloud-init-output.log

# View user-data logs
sudo cat /var/log/user-data.log
```

## 📚 Resources

- [OPC Foundation](https://opcfoundation.org/)
- [node-opcua Documentation](http://node-opcua.github.io/)
- [AWS CloudFormation Documentation](https://docs.aws.amazon.com/cloudformation/)
- [UaExpert Client](https://www.unified-automation.com/products/development-tools/uaexpert.html)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⭐ Support

If you find this project useful, please consider giving it a star!

## 📧 Contact

Have questions or suggestions? Feel free to open an issue.

---

**Note**: This is a demonstration/educational project. For production OPC UA deployments, consult with industrial automation and security experts.