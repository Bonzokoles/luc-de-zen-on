# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""
POLACZEK_D - Dashboard Integration Agent
========================================
ZENON AI System - Agent zarządzający integracją z dashboard
Author: Jimbo (ZENON AI Coordinator)
Created: 2025-06-07

FUNKCJONALNOŚCI:
- Dashboard API bridge
- Agent status monitoring
- Button integration system  
- Real-time communication
- Control center dla systemu agentów
"""

import json
import time
import asyncio
import websockets
import threading
import sys
import os
from datetime import datetime
from typing import Dict, List, Optional, Any
from dataclasses import dataclass, asdict
from pathlib import Path

# Ensure UTF-8 encoding for Windows
if sys.platform.startswith('win'):
    import locale
    sys.stdout.reconfigure(encoding='utf-8')

@dataclass
class AgentStatus:
    """Status agenta w systemie"""
    name: str
    type: str
    status: str  # "running", "stopped", "error", "unknown"
    last_activity: str
    pid: Optional[int] = None
    memory_usage: Optional[float] = None
    cpu_usage: Optional[float] = None
    messages_processed: int = 0
    errors_count: int = 0

class PolaczekDashboard:
    """
    Główny agent zarządzający integracją z dashboard ZENON
    """
    
    def __init__(self):
        self.name = "Polaczek_D"
        self.version = "1.0.0"
        self.status = "initializing"
        self.agents: Dict[str, AgentStatus] = {}
        self.websocket_server = None
        self.dashboard_port = 3002
        self.log_file = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/logs/polaczek_d.log")
        
        # Ensure log directory exists
        self.log_file.parent.mkdir(exist_ok=True)
        
        # Initialize system
        self._initialize_logging()
        self._register_known_agents()
        
    def _initialize_logging(self):
        """Initialize logging system"""
        self.log(f"POLACZEK_D v{self.version} initializing...")
        self.log(f"Dashboard port: {self.dashboard_port}")
        
    def log(self, message: str, level: str = "INFO"):
        """Enhanced logging with timestamps"""
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        log_entry = f"[{timestamp}] [{level}] {message}"
        print(log_entry)
        
        # Write to log file
        try:
            with open(self.log_file, "a", encoding="utf-8") as f:
                f.write(log_entry + "\n")
        except Exception as e:
            print(f"Logging error: {e}")
    
    def _register_known_agents(self):
        """Register known agents in system"""
        known_agents = [
            ("Polaczek_T", "translator"),
            ("Polaczek_P", "programmer"), 
            ("Polaczek_S", "searcher"),
            ("Polaczek_D", "dashboard")
        ]
        
        for name, agent_type in known_agents:
            self.agents[name] = AgentStatus(
                name=name,
                type=agent_type,
                status="stopped",
                last_activity=datetime.now().isoformat()
            )
            
        self.log(f"Registered {len(known_agents)} known agents")
    
    def get_agent_status(self, agent_name: str) -> Optional[AgentStatus]:
        """Get status of specific agent"""
        return self.agents.get(agent_name)
    
    def update_agent_status(self, agent_name: str, status: str, **kwargs):
        """Update agent status"""
        if agent_name in self.agents:
            agent = self.agents[agent_name]
            agent.status = status
            agent.last_activity = datetime.now().isoformat()
            
            # Update additional fields
            for key, value in kwargs.items():
                if hasattr(agent, key):
                    setattr(agent, key, value)
                    
            self.log(f"Agent {agent_name} status updated: {status}")
            
            # Broadcast to dashboard
            self._broadcast_agent_update(agent_name, agent)
        else:
            self.log(f"Unknown agent: {agent_name}", "WARNING")
    
    def _broadcast_agent_update(self, agent_name: str, agent: AgentStatus):
        """Broadcast agent update to dashboard"""
        update_data = {
            "type": "agent_update",
            "agent_name": agent_name,
            "agent_data": asdict(agent),
            "timestamp": datetime.now().isoformat()
        }
        
        self.log(f"Broadcasting update for {agent_name}")
    
    def get_all_agents_status(self) -> Dict[str, Dict]:
        """Get status of all agents"""
        return {name: asdict(agent) for name, agent in self.agents.items()}
    
    def start_agent(self, agent_name: str) -> bool:
        """Start specific agent"""
        try:
            self.log(f"Starting agent: {agent_name}")
            
            # TODO: Implement actual agent starting logic
            # For now, simulate starting
            self.update_agent_status(agent_name, "running")
            
            return True
        except Exception as e:
            self.log(f"Error starting agent {agent_name}: {e}", "ERROR")
            self.update_agent_status(agent_name, "error")
            return False
    
    def stop_agent(self, agent_name: str) -> bool:
        """Stop specific agent"""
        try:
            self.log(f"Stopping agent: {agent_name}")
            
            # TODO: Implement actual agent stopping logic
            self.update_agent_status(agent_name, "stopped")
            
            return True
        except Exception as e:
            self.log(f"Error stopping agent {agent_name}: {e}", "ERROR")
            return False
    
    def restart_agent(self, agent_name: str) -> bool:
        """Restart specific agent"""
        self.log(f"Restarting agent: {agent_name}")
        return self.stop_agent(agent_name) and self.start_agent(agent_name)
    
    def get_system_status(self) -> Dict[str, Any]:
        """Get overall system status"""
        running_count = sum(1 for agent in self.agents.values() if agent.status == "running")
        total_count = len(self.agents)
        
        return {
            "dashboard_agent": self.name,
            "dashboard_version": self.version,
            "dashboard_status": self.status,
            "agents_total": total_count,
            "agents_running": running_count,
            "agents_stopped": total_count - running_count,
            "last_update": datetime.now().isoformat(),
            "uptime": time.time() - self.start_time if hasattr(self, 'start_time') else 0
        }
    
    async def start_websocket_server(self):
        """Start WebSocket server for dashboard communication"""
        try:
            self.log(f"Starting WebSocket server on port {self.dashboard_port}")
            
            async def handle_client(websocket, path):
                self.log(f"Dashboard client connected: {websocket.remote_address}")
                
                try:
                    # Send initial status
                    initial_data = {
                        "type": "initial_status",
                        "system_status": self.get_system_status(),
                        "agents_status": self.get_all_agents_status()
                    }
                    await websocket.send(json.dumps(initial_data))
                    
                    # Handle incoming messages
                    async for message in websocket:
                        try:
                            data = json.loads(message)
                            await self._handle_dashboard_message(websocket, data)
                        except json.JSONDecodeError:
                            self.log(f"Invalid JSON from dashboard: {message}", "WARNING")
                            
                except websockets.exceptions.ConnectionClosed:
                    self.log("Dashboard client disconnected")
                except Exception as e:
                    self.log(f"WebSocket client error: {e}", "ERROR")
            
            self.websocket_server = await websockets.serve(
                handle_client, "localhost", self.dashboard_port
            )
            
            self.log(f"WebSocket server started on ws://localhost:{self.dashboard_port}")
            self.log("Connect dashboard to: ws://localhost:3002")
            self.log("Main dashboard running on: http://localhost:3003")
            
        except Exception as e:
            self.log(f"Failed to start WebSocket server: {e}", "ERROR")
    
    async def _handle_dashboard_message(self, websocket, data: Dict):
        """Handle messages from dashboard"""
        message_type = data.get("type")
        self.log(f"Dashboard message: {message_type}")
        
        response = {"type": "response", "success": False}
        
        try:
            if message_type == "start_agent":
                agent_name = data.get("agent_name")
                success = self.start_agent(agent_name)
                response = {"type": "agent_start_response", "agent_name": agent_name, "success": success}
                
            elif message_type == "stop_agent":
                agent_name = data.get("agent_name")
                success = self.stop_agent(agent_name)
                response = {"type": "agent_stop_response", "agent_name": agent_name, "success": success}
                
            elif message_type == "restart_agent":
                agent_name = data.get("agent_name")
                success = self.restart_agent(agent_name)
                response = {"type": "agent_restart_response", "agent_name": agent_name, "success": success}
                
            elif message_type == "get_status":
                response = {
                    "type": "status_response",
                    "system_status": self.get_system_status(),
                    "agents_status": self.get_all_agents_status(),
                    "success": True
                }
                
            else:
                self.log(f"Unknown message type: {message_type}", "WARNING")
                response = {"type": "error", "message": f"Unknown message type: {message_type}"}
            
            await websocket.send(json.dumps(response))
            
        except Exception as e:
            self.log(f"Error handling dashboard message: {e}", "ERROR")
            error_response = {"type": "error", "message": str(e)}
            await websocket.send(json.dumps(error_response))
    
    def run(self):
        """Main run method"""
        self.start_time = time.time()
        self.status = "running"
        self.log(f"{self.name} started successfully")
        
        # Update own status
        self.update_agent_status("Polaczek_D", "running", pid=os.getpid())
        
        # Start WebSocket server in background
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            loop.run_until_complete(self.start_websocket_server())
            loop.run_forever()
        except KeyboardInterrupt:
            self.log("Shutdown requested by user")
        except Exception as e:
            self.log(f"Runtime error: {e}", "ERROR")
        finally:
            self.status = "stopped"
            self.log(f"{self.name} stopped")
            loop.close()

def main():
    """Main entry point"""
    print("POLACZEK_D - Dashboard Integration Agent")
    print("=" * 50)
    
    # Create and run dashboard agent
    dashboard = PolaczekDashboard()
    
    try:
        dashboard.run()
    except KeyboardInterrupt:
        print("\nShutdown requested")
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()
