#!/usr/bin/env python3

import asyncio
import websockets
import json
import logging
import datetime
import inspect
from pathlib import Path

class PolaczekTAgent:

    def __init__(self):
        self.name = "POLACZEK_T"
        self.port = 3008
        self.status = "initializing"
        self.project_dir = Path("T:/LUC_de_ZEN_ON/luc-de-zen-on-ai/23/MY_LUC_ZEN_ON/T_agent")
        self.output_dir = self.project_dir / "translations"
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.logger = self._setup_logger()
        self.capabilities = [
            "translation",
            "context_qa",
            "function_help",
            "system_status",
            "ai_assistance"
        ]
        self.tasks_completed = 0
        self.last_activity = datetime.datetime.now()
        self.bot_persona = "AI Assistant for LUC DE ZEN ON platform - helping users understand system capabilities."
        self.connected_clients = set()

    def _setup_logger(self):
        log_dir = self.output_dir.parent / "logs"
        log_dir.mkdir(exist_ok=True)
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s %(levelname)s: %(message)s",
            handlers=[
                logging.StreamHandler(),
                logging.FileHandler(log_dir / f"{self.name}.log")
            ]
        )
        return logging.getLogger(self.name)

    async def handle_client_wrapper(self, websocket, path=None):
        """
        Wrapper for backward compatibility with different websockets versions
        """
        return await self.handle_client(websocket)

    async def handle_client(self, websocket):
        """
        Handle WebSocket client connections
        Compatible with both old and new websockets versions
        """
        self.connected_clients.add(websocket)
        client_addr = websocket.remote_address
        self.logger.info(f"Client connected: {client_addr}")
        try:
            # Send welcome message
            await websocket.send(json.dumps({
                "type": "welcome",
                "message": f"Połączono z {self.name} - AI Assistant",
                "capabilities": self.capabilities,
                "status": self.status
            }))
            async for message in websocket:
                try:
                    data = json.loads(message)
                    cmd = data.get("command")
                    if cmd == "get_status":
                        await websocket.send(json.dumps({
                            "type": "status",
                            "status": self.status,
                            "tasks_completed": self.tasks_completed,
                            "last_activity": self.last_activity.isoformat(),
                            "connected_clients": len(self.connected_clients)
                        }))
                    elif cmd == "translate_text":
                        text = data.get("text", "")
                        target_lang = data.get("target_lang", "pl")
                        result = await self.translate_text(text, target_lang)
                        await websocket.send(json.dumps({
                            "type": "translation",
                            "result": result,
                            "original": text,
                            "target_language": target_lang
                        }))
                    elif cmd == "ask_help":
                        question = data.get("question", "")
                        answer = await self.answer_question(question)
                        await websocket.send(json.dumps({
                            "type": "answer",
                            "response": answer,
                            "question": question,
                            "timestamp": datetime.datetime.now().isoformat()
                        }))
                    elif cmd == "get_system_info":
                        info = await self.get_system_info()
                        await websocket.send(json.dumps({
                            "type": "system_info",
                            "data": info
                        }))
                    else:
                        await websocket.send(json.dumps({
                            "type": "error",
                            "message": f"Unknown command: {cmd}",
                            "available_commands": ["get_status", "translate_text", "ask_help", "get_system_info"]
                        }))
                except json.JSONDecodeError:
                    await websocket.send(json.dumps({
                        "type": "error",
                        "message": "Invalid JSON format"
                    }))
                except Exception as e:
                    self.logger.error(f"Error processing message: {e}")
                    await websocket.send(json.dumps({
                        "type": "error",
                        "message": str(e)
                    }))
        except websockets.exceptions.ConnectionClosed:
            self.logger.info(f"Client disconnected: {client_addr}")
        except Exception as e:
            self.logger.error(f"Unexpected error: {e}")
        finally:
            self.connected_clients.discard(websocket)

    async def translate_text(self, text: str, target_lang: str = "pl") -> str:
        self.logger.info(f"Translating text to {target_lang}: {text[:40]}...")
        self.last_activity = datetime.datetime.now()
        # Enhanced translation logic - placeholder for real AI translation
        translations = {
            "pl": f"[PL]: {text}",
            "en": f"[EN]: {text}",
            "de": f"[DE]: {text}",
            "fr": f"[FR]: {text}",
            "es": f"[ES]: {text}"
        }
        translated = translations.get(target_lang, f"[{target_lang.upper()}]: {text}")
        self.tasks_completed += 1
        # Save translation record
        output_file = self.output_dir / f"translation_{self.tasks_completed}_{datetime.datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(output_file, "w", encoding="utf-8") as f:
            json.dump({
                "input": text,
                "output": translated,
                "target_language": target_lang,
                "timestamp": datetime.datetime.now().isoformat(),
                "task_id": self.tasks_completed
            }, f, ensure_ascii=False, indent=2)
        return translated

    async def answer_question(self, question: str) -> str:
        self.logger.info(f"Answering question: {question}")
        self.last_activity = datetime.datetime.now()
        # Enhanced AI help system
        help_responses = {
            # System capabilities
            "what can you do": f"Mogę wykonywać następujące zadania: {', '.join(self.capabilities)}. Jestem AI asystentem platformy LUC DE ZEN ON.",
            "help": "Dostępne komendy: 'what can you do', 'system status', 'ai workers', 'translation', 'agents'. Zapytaj o konkretną funkcję!",
            "functions": "Główne funkcje: tłumaczenia, pomoc kontekstowa, status systemu, zarządzanie agentami AI, analityka.",
            # System status
            "system status": f"System aktywny. Wykonane zadania: {self.tasks_completed}. Połączeni klienci: {len(self.connected_clients)}. Status: {self.status}",
            "status": f"Agent {self.name} jest aktywny na porcie {self.port}. Ostatnia aktywność: {self.last_activity.strftime('%H:%M:%S')}",
            # AI Workers
            "ai workers": "Dostępne AI Workers: Generator Obrazów (Flux AI), Chatbot (OpenAI GPT), BigQuery Analytics, Kaggle Datasets, Tavily Search, Status Monitor.",
            "workers": "System zawiera 6 głównych AI Workers plus dodatkowe funkcje zarządzania: Dashboard, Workers Center, Agent Builder, Analytics.",
            # Translation
            "translation": "Obsługuję tłumaczenia na języki: polski (pl), angielski (en), niemiecki (de), francuski (fr), hiszpański (es). Użyj komendy translate_text.",
            "translate": "Aby przetłumaczyć tekst, wyślij komendę: {'command': 'translate_text', 'text': 'twój tekst', 'target_lang': 'pl'}",
            # Agents
            "agents": "Dostępne agenty: POLACZEK_A1 (Analytics), POLACZEK_AI (Art AI), POLACZEK_ART (Art Research), POLACZEK_D (Dashboard), POLACZEK_S1/S2 (Search), POLACZEK_T1 (Translation)",
            "polaczek": "System POLACZEK składa się z 7 wyspecjalizowanych agentów do różnych zadań: analytics, search, dashboard, art AI, itp.",
            # Platform info
            "platform": "LUC DE ZEN ON to platforma AI Workers z integracją Cloudflare, Astro framework, oraz systemem agentów POLACZEK i BIELIK.",
            "luc de zen on": "Platforma oferuje kompleksowe narzędzia AI: generowanie obrazów, chat, analytics, search, tłumaczenia i zarządzanie projektami."
        }

        # Normalize question for matching
        q_normalized = question.strip().lower()
        # Exact match
        if q_normalized in help_responses:
            return help_responses[q_normalized]
        # Partial matching
        for key, response in help_responses.items():
            if key in q_normalized or any(word in q_normalized for word in key.split()):
                return response
        # Fallback AI response
        return f"Interesujące pytanie: '{question}'. Obecnie uczę się jak na nie odpowiedzieć. Spróbuj zapytać o: system status, ai workers, translation, agents, lub platform info."

    async def get_system_info(self) -> dict:
        """Get comprehensive system information"""
        return {
            "agent_name": self.name,
            "port": self.port,
            "status": self.status,
            "capabilities": self.capabilities,
            "statistics": {
                "tasks_completed": self.tasks_completed,
                "connected_clients": len(self.connected_clients),
                "uptime": str(datetime.datetime.now() - self.last_activity),
                "last_activity": self.last_activity.isoformat()
            },
            "platform_info": {
                "name": "LUC DE ZEN ON AI Platform",
                "version": "1.0.0",
                "framework": "Astro + Cloudflare Workers",
                "ai_workers_count": 6,
                "agents_available": ["POLACZEK_A1", "POLACZEK_AI", "POLACZEK_ART", "POLACZEK_D", "POLACZEK_S1", "POLACZEK_S2", "POLACZEK_T1"]
            }
        }

    def get_handler(self):
        """
        Return appropriate handler based on websockets version
        """
        serve_sig = inspect.signature(websockets.serve)
        if 'handler' in serve_sig.parameters:
            # Newer version - check handler signature
            return self.handle_client
        else:
            # Older version - use wrapper
            return self.handle_client_wrapper

    async def start_server(self):
        self.status = "ready"
        self.logger.info(f"{self.name} WebSocket server starting on port {self.port}")
        self.logger.info(f"Capabilities: {', '.join(self.capabilities)}")
        try:
            # Use appropriate handler based on websockets version
            handler = self.get_handler()
            server = await websockets.serve(
                handler,
                "0.0.0.0",
                self.port,
                ping_interval=20,
                ping_timeout=10
            )
            self.logger.info(f"✅ {self.name} server is ready and listening on ws://localhost:{self.port}")
            self.logger.info("Waiting for client connections...")
            await server.wait_closed()
        except Exception as e:
            self.logger.error(f"Failed to start server: {e}")
            self.status = "error"

    def run(self):
        """Run the WebSocket server"""
        try:
            asyncio.run(self.start_server())
        except KeyboardInterrupt:
            self.logger.info("Server stopped by user")
        except Exception as e:
            self.logger.error(f"Server error: {e}")

if __name__ == "__main__":
    print("🚀 Starting POLACZEK_T Agent WebSocket Server...")
    print("📍 This agent provides AI assistance and translation services")
    print("🔗 Connect via WebSocket to ws://localhost:3008")
    print("⏹️ Press Ctrl+C to stop")
    print("-" * 50)
    agent = PolaczekTAgent()
    agent.run()
