const opcua = require("node-opcua");

const server = new opcua.OPCUAServer({
    port: 4840,
    resourcePath: "/UA/DemoServer",
    buildInfo: {
        productName: "Demo OPC UA Server",
        buildNumber: "1.0.0",
        buildDate: new Date()
    }
});

server.on("post_initialize", function() {
    console.log("✓ Servidor inicializado");
    
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();
    
    // Usar el método directo para agregar objetos al namespace
    const devicesFolder = namespace.addObject({
        organizedBy: addressSpace.rootFolder.objects,
        browseName: "Simulation"
    });
    
    console.log("✓ Carpeta Simulation creada");
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Temperature",
        dataType: "Double",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Double,
                value: 25.0 + 5.0 * Math.sin(Date.now() / 5000)
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Pressure",
        dataType: "Double",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Double,
                value: 100.0 + 5.0 * Math.cos(Date.now() / 7000)
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "FanSpeed",
        dataType: "Int32",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Int32,
                value: 1000 + Math.floor(200 * Math.sin(Date.now() / 3000))
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "PumpSpeed",
        dataType: "Int32",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Int32,
                value: 600 + Math.floor(100 * Math.cos(Date.now() / 4000))
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "TankLevel",
        dataType: "Double",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Double,
                value: 60.0 + 20.0 * Math.sin(Date.now() / 10000)
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "MachineState",
        dataType: "String",
        value: {
            get: () => {
                const states = ["Running", "Idle", "Maintenance", "Stopped"];
                return new opcua.Variant({
                    dataType: opcua.DataType.String,
                    value: states[Math.floor(Date.now() / 15000) % states.length]
                });
            }
        }
    });
    
    let counter = 0;
    setInterval(() => counter++, 1000);
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Counter",
        dataType: "Int32",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.Int32,
                value: counter
            })
        }
    });
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "ServerTime",
        dataType: "DateTime",
        value: {
            get: () => new opcua.Variant({
                dataType: opcua.DataType.DateTime,
                value: new Date()
            })
        }
    });
    
    console.log("✓ 8 variables creadas exitosamente");
});

server.start(err => {
    if (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
    console.log("🚀 Servidor OPC UA iniciado en puerto 4840");
    console.log("Endpoint: opc.tcp://0.0.0.0:4840/UA/DemoServer");
});

process.on('SIGINT', () => server.shutdown(() => process.exit(0)));
process.on('SIGTERM', () => server.shutdown(() => process.exit(0)));