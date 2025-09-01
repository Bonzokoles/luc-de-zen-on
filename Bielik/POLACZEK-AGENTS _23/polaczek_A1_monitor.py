# -*- coding: utf-8 -*-
#!/usr/bin/env python3
"""
POLACZEK_A1 - Analytics & Monitoring Agent
=========================================
ZENON AI System - Agent monitorujący system i alarmujący o problemach
Author: Jimbo (ZENON AI Coordinator)  
Created: 2025-06-08

FUNKCJONALNOŚCI:
- System monitoring (CPU, Memory, Disk, Network)
- Process analysis i anomaly detection
- Real-time alerts i notifications
- Resource optimization recommendations
- Performance tracking i reporting
"""

import json
import time
import asyncio
import websockets
import psutil
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
class SystemMetrics:
    """System metrics data structure"""
    timestamp: str
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    network_io: Dict[str, int]
    process_count: int
    alert_level: str  # "normal", "warning", "critical"

@dataclass
class ProcessInfo:
    """Process information structure"""
    pid: int
    name: str
    cpu_percent: float
    memory_mb: float
    status: str

@dataclass
class SystemAlert:
    """System alert structure"""
    id: str
    level: str  # "info", "warning", "critical"
    title: str
    message: str
    timestamp: str
    resolved: bool = False

class PolaczekA1Monitor:
    """
    Analytics & Monitoring Agent dla systemu ZENON
    """
    
    def __init__(self):
        self.name = "Polaczek_A1"
        self.type = "analytics"
        self.version = "1.0.0"
        self.status = "initializing"
        self.port = 3007  # Analytics agent port
        self.log_file = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/logs/polaczek_a1.log")
        
        # Monitoring settings
        self.thresholds = {
            "cpu_warning": 70.0,
            "cpu_critical": 85.0,
            "memory_warning": 75.0,
            "memory_critical": 90.0,
            "disk_warning": 85.0,
            "disk_critical": 95.0,
            "process_count_warning": 20,
            "process_count_critical": 30
        }
        
        # Data storage
        self.metrics_history: List[SystemMetrics] = []
        self.active_alerts: List[SystemAlert] = []
        self.top_processes: List[ProcessInfo] = []
        
        # Ensure log directory exists
        self.log_file.parent.mkdir(exist_ok=True)
        
        # Initialize
        self._initialize_logging()
        
    def _initialize_logging(self):
        """Initialize logging system"""
        self.log(f"POLACZEK_A1 v{self.version} initializing...")
        self.log(f"Analytics agent starting on port {self.port}")
        self.log(f"Monitoring thresholds: CPU {self.thresholds['cpu_warning']}%/{self.thresholds['cpu_critical']}%")
        
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
    
    def collect_system_metrics(self) -> SystemMetrics:
        """Collect comprehensive system metrics"""
        try:
            # Basic metrics
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            network = psutil.net_io_counters()
            
            # Process count (focus on Node.js processes)
            node_processes = []
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info']):
                try:
                    if 'node' in proc.info['name'].lower():
                        node_processes.append(proc)
                except:
                    continue
                    
            # Determine alert level
            alert_level = "normal"
            if (cpu_percent > self.thresholds['cpu_critical'] or 
                memory.percent > self.thresholds['memory_critical'] or
                disk.percent > self.thresholds['disk_critical']):
                alert_level = "critical"
            elif (cpu_percent > self.thresholds['cpu_warning'] or 
                  memory.percent > self.thresholds['memory_warning'] or
                  disk.percent > self.thresholds['disk_warning']):
                alert_level = "warning"
            
            metrics = SystemMetrics(
                timestamp=datetime.now().isoformat(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                disk_percent=disk.percent,
                network_io={
                    "bytes_sent": network.bytes_sent,
                    "bytes_recv": network.bytes_recv
                },
                process_count=len(node_processes),
                alert_level=alert_level
            )
            
            # Store metrics
            self.metrics_history.append(metrics)
            
            # Keep only last 100 metrics
            if len(self.metrics_history) > 100:
                self.metrics_history = self.metrics_history[-100:]
                
            return metrics
            
        except Exception as e:
            self.log(f"Error collecting metrics: {e}", "ERROR")
            return None
    
    def analyze_processes(self) -> List[ProcessInfo]:
        """Analyze running processes and identify resource hogs"""
        try:
            processes = []
            
            for proc in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_info', 'status']):
                try:
                    # Focus on Node.js, Python, Chrome processes
                    if any(keyword in proc.info['name'].lower() for keyword in ['node', 'python', 'chrome']):
                        memory_mb = proc.info['memory_info'].rss / 1024 / 1024  # Convert to MB
                        
                        process_info = ProcessInfo(
                            pid=proc.info['pid'],
                            name=proc.info['name'],
                            cpu_percent=proc.info['cpu_percent'] or 0,
                            memory_mb=memory_mb,
                            status=proc.info['status']
                        )
                        processes.append(process_info)
                        
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    continue
            
            # Sort by memory usage
            processes.sort(key=lambda x: x.memory_mb, reverse=True)
            
            # Store top 20 processes
            self.top_processes = processes[:20]
            
            return self.top_processes
            
        except Exception as e:
            self.log(f"Error analyzing processes: {e}", "ERROR")
            return []
    
    def generate_alerts(self, metrics: SystemMetrics) -> List[SystemAlert]:
        """Generate alerts based on system metrics"""
        new_alerts = []
        
        try:
            # CPU alerts
            if metrics.cpu_percent > self.thresholds['cpu_critical']:
                alert = SystemAlert(
                    id=f"cpu_critical_{int(time.time())}",
                    level="critical",
                    title="CPU Usage Critical",
                    message=f"CPU usage at {metrics.cpu_percent:.1f}% (critical threshold: {self.thresholds['cpu_critical']}%)",
                    timestamp=datetime.now().isoformat()
                )
                new_alerts.append(alert)
                
            elif metrics.cpu_percent > self.thresholds['cpu_warning']:
                alert = SystemAlert(
                    id=f"cpu_warning_{int(time.time())}",
                    level="warning", 
                    title="CPU Usage High",
                    message=f"CPU usage at {metrics.cpu_percent:.1f}% (warning threshold: {self.thresholds['cpu_warning']}%)",
                    timestamp=datetime.now().isoformat()
                )
                new_alerts.append(alert)
            
            # Memory alerts
            if metrics.memory_percent > self.thresholds['memory_critical']:
                alert = SystemAlert(
                    id=f"memory_critical_{int(time.time())}",
                    level="critical",
                    title="Memory Usage Critical",
                    message=f"Memory usage at {metrics.memory_percent:.1f}% (critical threshold: {self.thresholds['memory_critical']}%)",
                    timestamp=datetime.now().isoformat()
                )
                new_alerts.append(alert)
            
            # Disk alerts  
            if metrics.disk_percent > self.thresholds['disk_critical']:
                alert = SystemAlert(
                    id=f"disk_critical_{int(time.time())}",
                    level="critical",
                    title="Disk Space Critical",
                    message=f"Disk usage at {metrics.disk_percent:.1f}% (critical threshold: {self.thresholds['disk_critical']}%)",
                    timestamp=datetime.now().isoformat()
                )
                new_alerts.append(alert)
            
            # Node.js process count alerts
            if metrics.process_count > self.thresholds['process_count_critical']:
                alert = SystemAlert(
                    id=f"processes_critical_{int(time.time())}",
                    level="critical",
                    title="Too Many Node.js Processes",
                    message=f"{metrics.process_count} Node.js processes running (critical threshold: {self.thresholds['process_count_critical']})",
                    timestamp=datetime.now().isoformat()
                )
                new_alerts.append(alert)
            
            # Add new alerts to active alerts
            self.active_alerts.extend(new_alerts)
            
            # Keep only last 50 alerts
            if len(self.active_alerts) > 50:
                self.active_alerts = self.active_alerts[-50:]
            
            return new_alerts
            
        except Exception as e:
            self.log(f"Error generating alerts: {e}", "ERROR")
            return []
    
    def get_optimization_recommendations(self) -> List[str]:
        """Generate optimization recommendations"""
        recommendations = []
        
        try:
            latest_metrics = self.metrics_history[-1] if self.metrics_history else None
            if not latest_metrics:
                return recommendations
            
            # High CPU recommendations
            if latest_metrics.cpu_percent > self.thresholds['cpu_warning']:
                recommendations.append("🔥 Consider reducing CPU load by stopping unnecessary Node.js processes")
                recommendations.append("🔧 Check if multiple dashboards are running simultaneously")
            
            # High memory recommendations
            if latest_metrics.memory_percent > self.thresholds['memory_warning']:
                recommendations.append("🧠 Memory usage high - close unused browser tabs")
                recommendations.append("🗂️ Consider restarting some Node.js applications")
            
            # High disk recommendations  
            if latest_metrics.disk_percent > self.thresholds['disk_warning']:
                recommendations.append("💾 Disk space critical - run cleanup operations")
                recommendations.append("🗑️ Clear temporary files and logs")
            
            # Too many processes
            if latest_metrics.process_count > self.thresholds['process_count_warning']:
                recommendations.append(f"⚡ {latest_metrics.process_count} Node.js processes detected - consider consolidating")
                recommendations.append("🎯 Use ZENON master launcher instead of individual processes")
            
            return recommendations
            
        except Exception as e:
            self.log(f"Error generating recommendations: {e}", "ERROR")
            return []
    
    def get_analytics_data(self) -> Dict[str, Any]:
        """Get comprehensive analytics data for dashboard"""
        try:
            latest_metrics = self.metrics_history[-1] if self.metrics_history else None
            
            return {
                "agent_info": {
                    "name": self.name,
                    "type": self.type,
                    "version": self.version,
                    "status": self.status,
                    "port": self.port
                },
                "current_metrics": asdict(latest_metrics) if latest_metrics else None,
                "metrics_history": [asdict(m) for m in self.metrics_history[-20:]],  # Last 20 metrics
                "active_alerts": [asdict(a) for a in self.active_alerts[-10:]],  # Last 10 alerts
                "top_processes": [asdict(p) for p in self.top_processes[:10]],  # Top 10 processes
                "recommendations": self.get_optimization_recommendations(),
                "system_health": {
                    "overall_score": self._calculate_health_score(),
                    "uptime": time.time() - self.start_time if hasattr(self, 'start_time') else 0
                }
            }
            
        except Exception as e:
            self.log(f"Error getting analytics data: {e}", "ERROR")
            return {"error": str(e)}
    
    def _calculate_health_score(self) -> int:
        """Calculate overall system health score (0-100)"""
        try:
            if not self.metrics_history:
                return 50
                
            latest = self.metrics_history[-1]
            
            # Health calculation based on thresholds
            cpu_health = max(0, 100 - (latest.cpu_percent / self.thresholds['cpu_critical'] * 100))
            memory_health = max(0, 100 - (latest.memory_percent / self.thresholds['memory_critical'] * 100))
            disk_health = max(0, 100 - (latest.disk_percent / self.thresholds['disk_critical'] * 100))
            
            # Average health score
            overall_health = (cpu_health + memory_health + disk_health) / 3
            
            return int(overall_health)
            
        except Exception as e:
            self.log(f"Error calculating health score: {e}", "ERROR")
            return 0
    
    async def start_websocket_server(self):
        """Start WebSocket server for analytics communication"""
        try:
            self.log(f"Starting Analytics WebSocket server on port {self.port}")
            
            async def handle_client(websocket, path):
                self.log(f"Analytics client connected: {websocket.remote_address}")
                
                try:
                    # Send initial analytics data
                    initial_data = {
                        "type": "analytics_initial",
                        "data": self.get_analytics_data()
                    }
                    await websocket.send(json.dumps(initial_data))
                    
                    # Handle incoming messages
                    async for message in websocket:
                        try:
                            data = json.loads(message)
                            await self._handle_analytics_message(websocket, data)
                        except json.JSONDecodeError:
                            self.log(f"Invalid JSON from analytics client: {message}", "WARNING")
                            
                except websockets.exceptions.ConnectionClosed:
                    self.log("Analytics client disconnected")
                except Exception as e:
                    self.log(f"WebSocket analytics client error: {e}", "ERROR")
            
            self.websocket_server = await websockets.serve(
                handle_client, "localhost", self.port
            )
            
            self.log(f"Analytics WebSocket server started on ws://localhost:{self.port}")
            
        except Exception as e:
            self.log(f"Failed to start Analytics WebSocket server: {e}", "ERROR")
    
    async def _handle_analytics_message(self, websocket, data: Dict):
        """Handle messages from analytics clients"""
        message_type = data.get("type")
        self.log(f"Analytics message: {message_type}")
        
        try:
            if message_type == "get_analytics":
                response = {
                    "type": "analytics_response", 
                    "data": self.get_analytics_data(),
                    "success": True
                }
                
            elif message_type == "get_metrics":
                response = {
                    "type": "metrics_response",
                    "data": {
                        "current": asdict(self.metrics_history[-1]) if self.metrics_history else None,
                        "history": [asdict(m) for m in self.metrics_history[-10:]]
                    },
                    "success": True
                }
                
            elif message_type == "get_alerts":
                response = {
                    "type": "alerts_response",
                    "data": [asdict(a) for a in self.active_alerts],
                    "success": True
                }
                
            elif message_type == "clear_alerts":
                self.active_alerts = []
                response = {
                    "type": "alerts_cleared",
                    "success": True
                }
                
            else:
                self.log(f"Unknown analytics message type: {message_type}", "WARNING")
                response = {"type": "error", "message": f"Unknown message type: {message_type}"}
            
            await websocket.send(json.dumps(response))
            
        except Exception as e:
            self.log(f"Error handling analytics message: {e}", "ERROR")
            error_response = {"type": "error", "message": str(e)}
            await websocket.send(json.dumps(error_response))
    
    def monitoring_loop(self):
        """Main monitoring loop"""
        self.log("Starting monitoring loop...")
        
        while self.status == "running":
            try:
                # Collect metrics
                metrics = self.collect_system_metrics()
                if metrics:
                    # Analyze processes
                    self.analyze_processes()
                    
                    # Generate alerts
                    new_alerts = self.generate_alerts(metrics)
                    
                    # Log important alerts
                    for alert in new_alerts:
                        self.log(f"ALERT [{alert.level.upper()}]: {alert.title} - {alert.message}", "ALERT")
                
                # Sleep for monitoring interval
                time.sleep(30)  # Monitor every 30 seconds
                
            except Exception as e:
                self.log(f"Error in monitoring loop: {e}", "ERROR")
                time.sleep(10)  # Shorter sleep on error
    
    def run(self):
        """Main run method"""
        self.start_time = time.time()
        self.status = "running"
        self.log(f"{self.name} Analytics Agent started successfully")
        
        # Start monitoring thread
        monitoring_thread = threading.Thread(target=self.monitoring_loop, daemon=True)
        monitoring_thread.start()
        
        # Start WebSocket server
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        try:
            # Initial metrics collection
            self.collect_system_metrics()
            self.analyze_processes()
            
            loop.run_until_complete(self.start_websocket_server())
            loop.run_forever()
        except KeyboardInterrupt:
            self.log("Analytics Agent shutdown requested by user")
        except Exception as e:
            self.log(f"Analytics Agent runtime error: {e}", "ERROR")
        finally:
            self.status = "stopped"
            self.log(f"{self.name} Analytics Agent stopped")
            loop.close()

def main():
    """Main entry point"""
    print("POLACZEK_A1 - Analytics & Monitoring Agent")
    print("=" * 50)
    
    # Create and run analytics agent
    analytics_agent = PolaczekA1Monitor()
    
    try:
        analytics_agent.run()
    except KeyboardInterrupt:
        print("\nAnalytics Agent shutdown requested")
    except Exception as e:
        print(f"Fatal error: {e}")

if __name__ == "__main__":
    main()
