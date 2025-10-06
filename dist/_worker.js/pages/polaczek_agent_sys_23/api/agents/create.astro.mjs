globalThis.process ??= {}; globalThis.process.env ??= {};
import { a as addAgentToList } from '../../../../chunks/list_Be_Vk5wL.mjs';
export { r as renderers } from '../../../../chunks/_@astro-renderers_CsfOuLCA.mjs';

const POST = async ({ request }) => {
  try {
    const agentData = await request.json();
    const { name, type, description } = agentData;
    if (!name || !type || !description) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields",
        message: "name, type, and description are required",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid agent name",
        message: "Agent name can only contain letters, numbers, underscores and hyphens",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const config = await generateAgentConfig(agentData);
    const agentCode = await generateAgentCode(agentData, config);
    const result = await createAgentFiles(name, type, config, agentCode);
    const listAgent = addAgentToList({
      ...agentData,
      port: config.port,
      version: config.version
    });
    console.log(`[AGENT CREATE] New agent created: ${name} (${type}) and added to list`);
    return new Response(JSON.stringify({
      success: true,
      agent_id: name,
      agent_name: name,
      agent_type: type,
      port: config.port,
      config_file: result.configFile,
      script_file: result.scriptFile,
      message: `Agent ${name} created successfully and added to dashboard`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      next_steps: [
        "Agent configuration has been generated",
        "Agent script has been created",
        "Agent added to dashboard list",
        "You can now start the agent from the dashboard",
        "Check logs for any startup issues"
      ]
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  } catch (error) {
    console.error("Error creating agent:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "Agent creation failed",
      message: error instanceof Error ? error.message : "Unknown error occurred",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
};
async function generateAgentConfig(agentData) {
  const {
    name,
    type,
    description,
    port,
    language = "python",
    ai_model = "gpt-4",
    temperature = 0.7,
    system_prompt,
    capabilities = [],
    max_memory = "512",
    timeout = "30",
    auto_start = false,
    logging_enabled = true,
    monitoring_enabled = true
  } = agentData;
  const finalPort = port || generatePortFromName(name);
  return {
    name,
    type,
    description,
    version: "1.0.0",
    port: finalPort,
    language,
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    // AI Configuration
    ai: {
      model: ai_model,
      temperature: parseFloat(temperature.toString()),
      system_prompt: system_prompt || generateDefaultSystemPrompt(type),
      max_tokens: 2e3,
      timeout: parseInt(timeout.toString())
    },
    // Capabilities and features
    capabilities,
    // Performance settings
    performance: {
      max_memory_mb: parseInt(max_memory.toString()),
      max_concurrent_requests: 10,
      request_timeout_seconds: parseInt(timeout.toString()),
      enable_caching: true
    },
    // Logging and monitoring
    logging: {
      enabled: logging_enabled,
      level: "INFO",
      file_path: `logs/${name.toLowerCase()}.log`,
      max_file_size_mb: 10,
      max_files: 5
    },
    monitoring: {
      enabled: monitoring_enabled,
      metrics_interval_seconds: 60,
      health_check_endpoint: `/health`,
      status_endpoint: `/status`
    },
    // Startup configuration
    startup: {
      auto_start,
      restart_on_failure: true,
      max_restart_attempts: 3,
      restart_delay_seconds: 5
    },
    // WebSocket configuration
    websocket: {
      enabled: true,
      port: finalPort,
      path: "/ws",
      heartbeat_interval: 3e4,
      max_connections: 100
    },
    // Security settings
    security: {
      require_auth: false,
      allowed_origins: ["localhost", "127.0.0.1"],
      rate_limit: {
        enabled: true,
        max_requests: 100,
        window_minutes: 1
      }
    }
  };
}
async function generateAgentCode(agentData, config) {
  const { language, type, name } = agentData;
  if (language === "python") {
    return generatePythonAgent(config);
  } else if (language === "javascript" || language === "typescript") {
    return generateNodeJSAgent(config, language === "typescript");
  }
  throw new Error(`Unsupported language: ${language}`);
}
function generatePythonAgent(config) {
  const separator = Array(51).join("=");
  const capabilitiesList = config.capabilities || [];
  const capabilitiesText = capabilitiesList.map((cap) => `- ${cap.replace("_", " ")}`).join("\n");
  const configJson = JSON.stringify(config, null, 8);
  const systemPrompt = (config.ai?.system_prompt || "").replace(/"/g, '\\"');
  const className = config.name.replace(/[-_]/g, "");
  const pythonCode = [
    "#!/usr/bin/env python3",
    "# -*- coding: utf-8 -*-",
    '"""',
    `${config.name} - ${config.type.toUpperCase()} Agent`,
    separator,
    `ZENON AI System - ${config.description}`,
    `Generated: ${(/* @__PURE__ */ new Date()).toISOString()}`,
    `Version: ${config.version}`,
    "",
    "FUNKCJONALNOŚCI:",
    capabilitiesText,
    '"""',
    "",
    "import json",
    "import time",
    "import asyncio",
    "import websockets",
    "import threading",
    "import sys",
    "import os",
    "import logging",
    "from datetime import datetime",
    "from typing import Dict, List, Optional, Any",
    "from dataclasses import dataclass, asdict",
    "from pathlib import Path",
    "",
    "# Ensure UTF-8 encoding for Windows",
    "if sys.platform.startswith('win'):",
    "    import locale",
    "    sys.stdout.reconfigure(encoding='utf-8')",
    "",
    "@dataclass",
    "class AgentMessage:",
    '    """Message structure for agent communication"""',
    "    id: str",
    "    type: str",
    "    content: str",
    "    timestamp: str",
    "    sender: str",
    "    metadata: Dict[str, Any] = None",
    "",
    `class ${className}:`,
    '    """',
    `    ${config.description}`,
    '    """',
    "    ",
    "    def __init__(self):",
    `        self.name = "${config.name}"`,
    `        self.type = "${config.type}"`,
    `        self.version = "${config.version}"`,
    '        self.status = "initializing"',
    `        self.port = ${config.port}`,
    "        self.websocket_server = None",
    "        ",
    "        # Configuration",
    `        self.config = ${configJson}`,
    "        ",
    "        # Initialize logging",
    "        self.setup_logging()",
    "        ",
    "        # Agent state",
    "        self.active_connections = set()",
    "        self.message_count = 0",
    "        self.error_count = 0",
    "        self.start_time = None",
    "        ",
    '        self.log(f"{self.name} v{self.version} initializing...")',
    "        ",
    "    def setup_logging(self):",
    '        """Setup logging configuration"""',
    "        if self.config.get('logging', {}).get('enabled', True):",
    "            log_dir = Path(self.config['logging']['file_path']).parent",
    "            log_dir.mkdir(exist_ok=True)",
    "            ",
    "            logging.basicConfig(",
    "                level=getattr(logging, self.config['logging'].get('level', 'INFO')),",
    "                format='[%(asctime)s] [%(levelname)s] %(message)s',",
    "                handlers=[",
    "                    logging.FileHandler(self.config['logging']['file_path']),",
    "                    logging.StreamHandler()",
    "                ]",
    "            )",
    "            ",
    "        self.logger = logging.getLogger(self.name)",
    "        ",
    '    def log(self, message: str, level: str = "INFO"):',
    '        """Enhanced logging with timestamps"""',
    '        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")',
    '        log_entry = f"[{timestamp}] [{level}] {message}"',
    "        print(log_entry)",
    "        ",
    "        if hasattr(self, 'logger'):",
    "            getattr(self.logger, level.lower(), self.logger.info)(message)",
    "    ",
    "    async def process_message(self, message: str) -> Dict[str, Any]:",
    '        """Process incoming message and generate response"""',
    "        try:",
    "            self.message_count += 1",
    "            ",
    "            # Parse message",
    "            try:",
    "                data = json.loads(message) if isinstance(message, str) else message",
    "            except json.JSONDecodeError:",
    '                data = {"type": "text", "content": message}',
    "            ",
    "            # System prompt for AI",
    `            system_prompt = "${systemPrompt}"`,
    "            ",
    "            # Generate response based on agent type",
    "            response = await self.generate_response(data, system_prompt)",
    "            ",
    "            return {",
    '                "success": True,',
    '                "response": response,',
    '                "agent": self.name,',
    '                "type": self.type,',
    '                "timestamp": datetime.now().isoformat(),',
    '                "message_id": self.message_count',
    "            }",
    "            ",
    "        except Exception as e:",
    "            self.error_count += 1",
    '            self.log(f"Error processing message: {e}", "ERROR")',
    "            ",
    "            return {",
    '                "success": False,',
    '                "error": str(e),',
    '                "agent": self.name,',
    '                "timestamp": datetime.now().isoformat()',
    "            }",
    "    ",
    "    async def generate_response(self, data: Dict, system_prompt: str) -> str:",
    '        """Generate AI response based on agent type"""',
    "        ",
    "        # Mock AI response generation",
    "        # In production, this would call actual AI APIs",
    '        message_content = data.get("content", "")',
    "        ",
    "        responses = {",
    '            "chatbot": f"Cześć! Jestem {self.name}. Jak mogę Ci pomóc? Otrzymałem: {message_content}",',
    '            "translator": f"Tłumaczenie: {message_content} (symulacja tłumaczenia)",',
    '            "searcher": f"Wyniki wyszukiwania dla: {message_content}\\n- Wynik 1\\n- Wynik 2\\n- Wynik 3",',
    '            "monitor": f"Status monitorowania: System działa prawidłowo. CPU: 15%, RAM: 45%",',
    '            "artist": f"Generuję obraz na podstawie: {message_content}. Link: https://example.com/generated-image.jpg",',
    '            "analyst": f"Analiza danych: {message_content}\\nWnioski:\\n- Wniosek 1\\n- Wniosek 2",',
    '            "writer": f"Wygenerowany tekst na temat: {message_content}\\n\\nLorem ipsum...",',
    '            "coder": f"Kod dla: {message_content}\\n```python\\nprint(\'Hello World\')\\n```",',
    `            "scheduler": f"Zaplanowane zadanie: {message_content} na {datetime.now().strftime('%Y-%m-%d %H:%M')}"`,
    "        }",
    "        ",
    '        return responses.get(self.type, f"Przetwarzam: {message_content}")',
    "    ",
    "    async def handle_websocket_client(self, websocket, path):",
    '        """Handle WebSocket client connection"""',
    "        client_addr = websocket.remote_address",
    '        self.log(f"Client connected: {client_addr}")',
    "        ",
    "        self.active_connections.add(websocket)",
    "        ",
    "        try:",
    "            # Send welcome message",
    "            welcome = {",
    '                "type": "welcome",',
    '                "agent": self.name,',
    '                "version": self.version,',
    `                "capabilities": self.config.get('capabilities', []),`,
    '                "timestamp": datetime.now().isoformat()',
    "            }",
    "            await websocket.send(json.dumps(welcome))",
    "            ",
    "            # Handle messages",
    "            async for message in websocket:",
    "                try:",
    "                    response = await self.process_message(message)",
    "                    await websocket.send(json.dumps(response))",
    "                    ",
    "                except json.JSONDecodeError:",
    "                    error_response = {",
    '                        "success": False,',
    '                        "error": "Invalid JSON",',
    '                        "timestamp": datetime.now().isoformat()',
    "                    }",
    "                    await websocket.send(json.dumps(error_response))",
    "                    ",
    "        except websockets.exceptions.ConnectionClosed:",
    '            self.log(f"Client {client_addr} disconnected")',
    "        except Exception as e:",
    '            self.log(f"WebSocket client error: {e}", "ERROR")',
    "        finally:",
    "            self.active_connections.discard(websocket)",
    "    ",
    "    async def start_websocket_server(self):",
    '        """Start WebSocket server"""',
    "        try:",
    '            self.log(f"Starting WebSocket server on port {self.port}")',
    "            ",
    "            self.websocket_server = await websockets.serve(",
    "                self.handle_websocket_client, ",
    '                "localhost", ',
    "                self.port",
    "            )",
    "            ",
    '            self.log(f"WebSocket server started on ws://localhost:{self.port}")',
    "            ",
    "        except Exception as e:",
    '            self.log(f"Failed to start WebSocket server: {e}", "ERROR")',
    "            raise",
    "    ",
    "    def get_status(self) -> Dict[str, Any]:",
    '        """Get current agent status"""',
    "        uptime = time.time() - self.start_time if self.start_time else 0",
    "        ",
    "        return {",
    '            "name": self.name,',
    '            "type": self.type,',
    '            "version": self.version,',
    '            "status": self.status,',
    '            "port": self.port,',
    '            "uptime_seconds": uptime,',
    '            "active_connections": len(self.active_connections),',
    '            "messages_processed": self.message_count,',
    '            "errors_count": self.error_count,',
    '            "last_activity": datetime.now().isoformat(),',
    `            "capabilities": self.config.get('capabilities', [])`,
    "        }",
    "    ",
    "    async def run(self):",
    '        """Main run method"""',
    "        self.start_time = time.time()",
    '        self.status = "running"',
    '        self.log(f"{self.name} started successfully")',
    "        ",
    "        try:",
    "            await self.start_websocket_server()",
    "            ",
    "            # Keep server running",
    "            while True:",
    "                await asyncio.sleep(1)",
    "                ",
    "                # Periodic status log",
    "                if int(time.time()) % 300 == 0:  # Every 5 minutes",
    "                    status = self.get_status()",
    `                    self.log(f"Status: {status['active_connections']} connections, {status['messages_processed']} messages processed")`,
    "                ",
    "        except KeyboardInterrupt:",
    '            self.log("Shutdown requested by user")',
    "        except Exception as e:",
    '            self.log(f"Runtime error: {e}", "ERROR")',
    "        finally:",
    '            self.status = "stopped"',
    '            self.log(f"{self.name} stopped")',
    "            ",
    "            if self.websocket_server:",
    "                self.websocket_server.close()",
    "",
    "def main():",
    '    """Main entry point"""',
    `    print(f"${config.name} - ${config.type.toUpperCase()} Agent")`,
    '    print("=" * 50)',
    "    ",
    "    # Create and run agent",
    `    agent = ${className}()`,
    "    ",
    "    try:",
    "        asyncio.run(agent.run())",
    "    except KeyboardInterrupt:",
    '        print("\\nAgent shutdown requested")',
    "    except Exception as e:",
    '        print(f"Fatal error: {e}")',
    "",
    'if __name__ == "__main__":',
    "    main()"
  ].join("\n");
  return pythonCode;
}
function generateNodeJSAgent(config, isTypeScript) {
  const typeAnnotations = isTypeScript ? ": string" : "";
  return `${isTypeScript ? "// TypeScript Agent" : "// JavaScript Agent"}
/**
 * ${config.name} - ${config.type.toUpperCase()} Agent
 * ${"=".repeat(50)}
 * ZENON AI System - ${config.description}
 * Generated: ${(/* @__PURE__ */ new Date()).toISOString()}
 * Version: ${config.version}
 */

const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

class ${config.name.replace(/[-_]/g, "")}Agent {
    constructor() {
        this.name = '${config.name}';
        this.type = '${config.type}';
        this.version = '${config.version}';
        this.status = 'initializing';
        this.port = ${config.port};
        
        this.config = ${JSON.stringify(config, null, 8)};
        
        this.activeConnections = new Set();
        this.messageCount = 0;
        this.errorCount = 0;
        this.startTime = null;
        
        this.log(\`\${this.name} v\${this.version} initializing...\`);
    }
    
    log(message${typeAnnotations}, level = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = \`[\${timestamp}] [\${level}] \${message}\`;
        console.log(logEntry);
        
        // Write to log file if enabled
        if (this.config.logging?.enabled) {
            const logDir = path.dirname(this.config.logging.file_path);
            if (!fs.existsSync(logDir)) {
                fs.mkdirSync(logDir, { recursive: true });
            }
            fs.appendFileSync(this.config.logging.file_path, logEntry + '\\n');
        }
    }
    
    async processMessage(message${typeAnnotations}) {
        try {
            this.messageCount++;
            
            let data;
            try {
                data = typeof message === 'string' ? JSON.parse(message) : message;
            } catch {
                data = { type: 'text', content: message };
            }
            
            const response = await this.generateResponse(data);
            
            return {
                success: true,
                response,
                agent: this.name,
                type: this.type,
                timestamp: new Date().toISOString(),
                messageId: this.messageCount
            };
            
        } catch (error) {
            this.errorCount++;
            this.log(\`Error processing message: \${error.message}\`, 'ERROR');
            
            return {
                success: false,
                error: error.message,
                agent: this.name,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    async generateResponse(data${typeAnnotations}) {
        const messageContent = data.content || '';
        
        const responses = {
            chatbot: \`Hello! I'm \${this.name}. How can I help you? Received: \${messageContent}\`,
            translator: \`Translation: \${messageContent} (simulation)\`,
            searcher: \`Search results for: \${messageContent}\\n- Result 1\\n- Result 2\\n- Result 3\`,
            monitor: \`Monitoring status: System running normally. CPU: 15%, RAM: 45%\`,
            artist: \`Generating image for: \${messageContent}. Link: https://example.com/generated-image.jpg\`,
            analyst: \`Data analysis: \${messageContent}\\nConclusions:\\n- Conclusion 1\\n- Conclusion 2\`,
            writer: \`Generated text for: \${messageContent}\\n\\nLorem ipsum...\`,
            coder: \`Code for: \${messageContent}\\n\\n\\\`\\\`\\\`javascript\\nconsole.log('Hello World');\\n\\\`\\\`\\\`\`,
            scheduler: \`Scheduled task: \${messageContent} for \${new Date().toISOString()}\`
        };
        
        return responses[this.type] || \`Processing: \${messageContent}\`;
    }
    
    async startWebSocketServer() {
        try {
            this.log(\`Starting WebSocket server on port \${this.port}\`);
            
            this.wss = new WebSocket.Server({ 
                port: this.port,
                perMessageDeflate: false 
            });
            
            this.wss.on('connection', (ws, req) => {
                const clientAddr = req.socket.remoteAddress;
                this.log(\`Client connected: \${clientAddr}\`);
                
                this.activeConnections.add(ws);
                
                // Send welcome message
                const welcome = {
                    type: 'welcome',
                    agent: this.name,
                    version: this.version,
                    capabilities: this.config.capabilities || [],
                    timestamp: new Date().toISOString()
                };
                ws.send(JSON.stringify(welcome));
                
                ws.on('message', async (message) => {
                    try {
                        const response = await this.processMessage(message.toString());
                        ws.send(JSON.stringify(response));
                    } catch (error) {
                        const errorResponse = {
                            success: false,
                            error: error.message,
                            timestamp: new Date().toISOString()
                        };
                        ws.send(JSON.stringify(errorResponse));
                    }
                });
                
                ws.on('close', () => {
                    this.log(\`Client \${clientAddr} disconnected\`);
                    this.activeConnections.delete(ws);
                });
                
                ws.on('error', (error) => {
                    this.log(\`WebSocket client error: \${error.message}\`, 'ERROR');
                    this.activeConnections.delete(ws);
                });
            });
            
            this.log(\`WebSocket server started on ws://localhost:\${this.port}\`);
            
        } catch (error) {
            this.log(\`Failed to start WebSocket server: \${error.message}\`, 'ERROR');
            throw error;
        }
    }
    
    getStatus() {
        const uptime = this.startTime ? (Date.now() - this.startTime) / 1000 : 0;
        
        return {
            name: this.name,
            type: this.type,
            version: this.version,
            status: this.status,
            port: this.port,
            uptimeSeconds: uptime,
            activeConnections: this.activeConnections.size,
            messagesProcessed: this.messageCount,
            errorsCount: this.errorCount,
            lastActivity: new Date().toISOString(),
            capabilities: this.config.capabilities || []
        };
    }
    
    async run() {
        this.startTime = Date.now();
        this.status = 'running';
        this.log(\`\${this.name} started successfully\`);
        
        try {
            await this.startWebSocketServer();
            
            // Periodic status logging
            setInterval(() => {
                const status = this.getStatus();
                this.log(\`Status: \${status.activeConnections} connections, \${status.messagesProcessed} messages processed\`);
            }, 300000); // Every 5 minutes
            
        } catch (error) {
            this.log(\`Runtime error: \${error.message}\`, 'ERROR');
            this.status = 'error';
            throw error;
        }
    }
}

function main() {
    console.log(\`${config.name} - ${config.type.toUpperCase()} Agent\`);
    console.log('='.repeat(50));
    
    const agent = new ${config.name.replace(/[-_]/g, "")}Agent();
    
    agent.run().catch(error => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
        console.log('\\nAgent shutdown requested');
        agent.status = 'stopped';
        if (agent.wss) {
            agent.wss.close();
        }
        process.exit(0);
    });
}

if (require.main === module) {
    main();
}

module.exports = ${config.name.replace(/[-_]/g, "")}Agent;
`;
}
async function createAgentFiles(name, type, config, code) {
  const configFileName = `${name.toLowerCase()}_config.json`;
  const scriptFileName = `${name.toLowerCase()}.${config.language === "python" ? "py" : "js"}`;
  console.log(`[FILE CREATE] ${configFileName} - ${JSON.stringify(config).length} bytes`);
  console.log(`[FILE CREATE] ${scriptFileName} - ${code.length} bytes`);
  return {
    configFile: configFileName,
    scriptFile: scriptFileName,
    configPath: `/agents/configs/${configFileName}`,
    scriptPath: `/agents/scripts/${scriptFileName}`
  };
}
function generatePortFromName(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return Math.abs(hash % 1e3) + 3e3;
}
function generateDefaultSystemPrompt(type) {
  const prompts = {
    chatbot: "Jesteś przyjaznym i pomocnym asystentem AI. Odpowiadaj w sposób naturalny i profesjonalny.",
    translator: "Jesteś ekspertem w tłumaczeniu języków. Tłumacz tekst dokładnie zachowując kontekst.",
    searcher: "Jesteś specjalistą od wyszukiwania informacji. Znajdź najbardziej aktualne informacje.",
    monitor: "Jesteś agentem monitorującym system. Analizuj metryki i alarmuj o problemach.",
    artist: "Jesteś kreatywnym asystentem AI specjalizującym się w generowaniu obrazów.",
    analyst: "Jesteś analitykiem danych. Analizuj informacje i twórz szczegółowe raporty.",
    writer: "Jesteś profesjonalnym pisarzem. Twórz wysokiej jakości treści.",
    coder: "Jesteś doświadczonym programistą. Pomagaj w pisaniu i debugowaniu kodu.",
    scheduler: "Jesteś zarządcą zadań. Organizuj i planuj działania efektywnie.",
    custom: "Jesteś wszechstronnym agentem AI. Dostosowuj się do różnych zadań."
  };
  return prompts[type] || prompts.custom;
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
