# AWS OPC UA Demo Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CloudFormation](https://img.shields.io/badge/AWS-CloudFormation-orange.svg)](https://aws.amazon.com/cloudformation/)
[![OPC UA](https://img.shields.io/badge/OPC--UA-Enabled-blue.svg)](https://opcfoundation.org/)
[![GitHub Actions](https://img.shields.io/badge/Deploy-GitHub%20Actions-blue.svg)](https://github.com/features/actions)

Automated deployment of an OPC UA demo server on AWS EC2 using **GitHub Actions**. Features simulated real-time variables for testing, learning, and development.

**Operating System:** Amazon Linux 2023

## 🎯 Features

- **GitHub Actions Deployment** - Automated infrastructure deployment
- **Manual Installation** - Full control over OPC UA server configuration
- **AWS Systems Manager (SSM)** - Console-only access (no SSH keys needed)
- **8 Simulated Variables** - Temperature, pressure, RPM, tank level, and more (customizable)
- **Real-Time Data** - Variables update continuously
- **Easy Customization** - Modify variables without redeploying infrastructure

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
- GitHub Account (this repository)
- AWS credentials with CloudFormation and EC2 permissions

**Note:** This project uses **manual installation** after infrastructure deployment, giving you full flexibility to customize the OPC UA server.

### Step 1: Deploy Infrastructure via GitHub Actions

This project deploys **infrastructure only** through GitHub Actions. The OPC UA server must be installed manually afterward.

#### Initial Setup:

1. **Fork or clone this repository**

2. **Configure AWS secrets in GitHub:**
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add the following secrets:
     - `AWS_ACCESS_KEY_ID`: Your AWS Access Key
     - `AWS_SECRET_ACCESS_KEY`: Your AWS Secret Key
     - `AWS_REGION`: AWS Region (e.g., `us-east-1`)

3. **Run the workflow:**
   - Go to the "Actions" tab in your repository
   - Select the "Deploy OPC UA Server" workflow
   - Click "Run workflow"
   - Select the branch (usually `main`)
   - Click "Run workflow"

4. **Monitor deployment:**
   - The workflow will create the CloudFormation stack (EC2, Security Group, IAM Role)
   - Upon completion, you'll see outputs (public IP, SSM Console URL)

### Step 2: Install OPC UA Server Manually

After infrastructure deployment, follow the detailed installation guide:

**📖 [Complete Installation Guide →](installation/MANUAL_INSTALLATION.md)**

Quick overview:
1. Connect to EC2 via SSM Console
2. Run installation script
3. Customize `server.js` as needed
4. Generate certificates
5. Start the service

This manual approach gives you **full control** to modify variables, add custom logic, and iterate quickly without infrastructure changes.

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

### Connect via AWS Systems Manager (SSM) - Console Only

**Access exclusively through AWS Console. No SSH keys or CLI needed.**

**Steps to connect:**
1. Go to [EC2 Console](https://console.aws.amazon.com/ec2/)
2. Select your instance `opcua-demo-server`
3. Click **Connect** → **Session Manager**
4. Click **Connect**

Or use the direct link from CloudFormation Outputs: `SSMConsoleURL`

**Benefits of SSM Console Access:**
- ✅ No SSH key management
- ✅ No need to open port 22
- ✅ Session logging and auditing
- ✅ Works from any browser
- ✅ IAM-based authentication


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

The CloudFormation stack provides these outputs (visible in GitHub Actions logs and CloudFormation Console):

- **InstanceId** - EC2 instance ID
- **PublicIP** - Server public IP address
- **OPCUAEndpoint** - Full OPC UA endpoint URL
- **SSMConsoleURL** - Direct link to connect via AWS Console
- **CheckServerStatus** - Command to verify server status (after SSM connection)

## 💰 Cost Estimate

- **EC2 t3.small**: ~$0.0208/hour (~$15/month)
- **Data transfer**: Variable based on usage
- **EBS storage**: Included in instance cost

> **Note**: Remember to delete the stack when not in use to avoid charges.

## 🧹 Cleanup

### Via AWS Console

1. Go to [CloudFormation Console](https://console.aws.amazon.com/cloudformation/)
2. Select your stack `opcua-demo-server`
3. Click **Delete**
4. Confirm deletion

## 🔒 Security

⚠️ **This is a DEMO server** - Not configured for production use.

**Current Security Features:**
- ✅ No SSH port exposed (port 22 closed)
- ✅ SSM access with IAM authentication
- ✅ Only OPC UA port (4840) open to internet
- ✅ Egress traffic allowed for SSM communication

For production environments, additionally implement:

- Enable OPC UA authentication and encryption
- Restrict Security Group to specific IPs for OPC UA port
- Use SSL/TLS certificates
- Implement proper security policies
- Deploy in private subnets with VPN/bastion host
- Enable VPC endpoints for SSM (no internet access needed)

## 🐛 Troubleshooting

### SSM Agent shows "Offline" or "Not connected"

This is the most common issue. **Possible causes:**

1. **Instance has no internet access:**
   - VPC needs an **Internet Gateway** and a route to internet in the route table
   - Check: EC2 Console → VPC → Route Tables → Look for `0.0.0.0/0` route pointing to Internet Gateway
   - **Solution:** Ensure your default VPC or create a VPC with internet access

2. **Wait for agent registration:**
   - SSM Agent can take **2-5 minutes** to register after deployment
   - Wait a few minutes and refresh the page

3. **Verify IAM Role:**
   - Instance must have `opcua-server-ec2-ssm-role` attached
   - Check: EC2 → Instance → Security tab → IAM Role

4. **Alternative - Use VPC Endpoints (no Internet Gateway needed):**
   - Create these VPC endpoints in your VPC:
     - `com.amazonaws.REGION.ssm`
     - `com.amazonaws.REGION.ssmmessages`
     - `com.amazonaws.REGION.ec2messages`
   - This allows SSM to work without internet access

**Quick verification (if you have SSH access for debugging):**
```bash
sudo systemctl status amazon-ssm-agent
sudo systemctl restart amazon-ssm-agent

# View SSM logs
sudo tail -f /var/log/amazon/ssm/amazon-ssm-agent.log
```

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