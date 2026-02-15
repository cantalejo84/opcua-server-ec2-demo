const opcua = require("node-opcua");

// Configuración del servidor OPC UA
const server = new opcua.OPCUAServer({
    port: 4840,
    resourcePath: "/UA/DemoServer",
    buildInfo: {
        productName: "Demo OPC UA Server",
        buildNumber: "1.0.0",
        buildDate: new Date()
    }
});

function post_initialize() {
    console.log("✓ Servidor inicializado");
    
    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();
    
    // Crear carpeta de simulación
    const devicesFolder = namespace.addFolder(addressSpace.rootFolder.objects, {
        browseName: "Simulation"
    });
    
    // ========================================
    // VARIABLES SIMULADAS
    // ========================================
    // Puedes modificar estas variables o añadir más según tus necesidades
    
    // 1. Temperatura (oscila entre 20-30°C)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Temperature",
        displayName: "Temperature (°C)",
        dataType: "Double",
        value: {
            get: function() {
                const baseTemp = 25.0;
                const variation = 5.0 * Math.sin(Date.now() / 5000);
                return new opcua.Variant({
                    dataType: opcua.DataType.Double,
                    value: baseTemp + variation
                });
            }
        }
    });
    
    // 2. Presión (oscila entre 95-105 bar)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Pressure",
        displayName: "Pressure (bar)",
        dataType: "Double",
        value: {
            get: function() {
                const basePressure = 100.0;
                const variation = 5.0 * Math.cos(Date.now() / 7000);
                return new opcua.Variant({
                    dataType: opcua.DataType.Double,
                    value: basePressure + variation
                });
            }
        }
    });
    
    // 3. Velocidad del ventilador (800-1200 RPM)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "FanSpeed",
        displayName: "Fan Speed (RPM)",
        dataType: "Int32",
        value: {
            get: function() {
                const baseSpeed = 1000;
                const variation = Math.floor(200 * Math.sin(Date.now() / 3000));
                return new opcua.Variant({
                    dataType: opcua.DataType.Int32,
                    value: baseSpeed + variation
                });
            }
        }
    });
    
    // 4. Velocidad de la bomba (500-700 RPM)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "PumpSpeed",
        displayName: "Pump Speed (RPM)",
        dataType: "Int32",
        value: {
            get: function() {
                const baseSpeed = 600;
                const variation = Math.floor(100 * Math.cos(Date.now() / 4000));
                return new opcua.Variant({
                    dataType: opcua.DataType.Int32,
                    value: baseSpeed + variation
                });
            }
        }
    });
    
    // 5. Nivel de tanque (40-80%)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "TankLevel",
        displayName: "Tank Level (%)",
        dataType: "Double",
        value: {
            get: function() {
                const baseLevel = 60.0;
                const variation = 20.0 * Math.sin(Date.now() / 10000);
                return new opcua.Variant({
                    dataType: opcua.DataType.Double,
                    value: baseLevel + variation
                });
            }
        }
    });
    
    // 6. Estado de la máquina (cambia cada 15 segundos)
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "MachineState",
        displayName: "Machine State",
        dataType: "String",
        value: {
            get: function() {
                const states = ["Running", "Idle", "Maintenance", "Stopped"];
                const index = Math.floor(Date.now() / 15000) % states.length;
                return new opcua.Variant({
                    dataType: opcua.DataType.String,
                    value: states[index]
                });
            }
        }
    });
    
    // 7. Contador (incrementa cada segundo)
    let counter = 0;
    setInterval(() => { counter++; }, 1000);
    
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "Counter",
        displayName: "Counter",
        dataType: "Int32",
        value: {
            get: function() {
                return new opcua.Variant({
                    dataType: opcua.DataType.Int32,
                    value: counter
                });
            }
        }
    });
    
    // 8. Timestamp del servidor
    namespace.addVariable({
        componentOf: devicesFolder,
        browseName: "ServerTime",
        displayName: "Server Time",
        dataType: "DateTime",
        value: {
            get: function() {
                return new opcua.Variant({
                    dataType: opcua.DataType.DateTime,
                    value: new Date()
                });
            }
        }
    });
    
    console.log("✓ Variables simuladas creadas:");
    console.log("  - Temperature (°C)");
    console.log("  - Pressure (bar)");
    console.log("  - FanSpeed (RPM)");
    console.log("  - PumpSpeed (RPM)");
    console.log("  - TankLevel (%)");
    console.log("  - MachineState");
    console.log("  - Counter");
    console.log("  - ServerTime");
}

// Inicializar y arrancar el servidor
server.initialize(post_initialize);

server.start(function(err) {
    if (err) {
        console.error("❌ Error al iniciar servidor:", err.message);
        process.exit(1);
    }
    
    console.log("");
    console.log("========================================");
    console.log("🚀 Servidor OPC UA iniciado correctamente");
    console.log("========================================");
    console.log("Puerto: 4840");
    console.log("Endpoint: opc.tcp://0.0.0.0:4840/UA/DemoServer");
    console.log("");
    console.log("Esperando conexiones de clientes...");
    console.log("Presiona Ctrl+C para detener");
    console.log("========================================");
    console.log("");
});

// Manejo de cierre graceful
process.on('SIGINT', function() {
    console.log("\n\n🛑 Cerrando servidor...");
    server.shutdown(function() {
        console.log("✓ Servidor cerrado correctamente");
        process.exit(0);
    });
});

process.on('SIGTERM', function() {
    console.log("\n\n🛑 Cerrando servidor...");
    server.shutdown(function() {
        console.log("✓ Servidor cerrado correctamente");
        process.exit(0);
    });
});
