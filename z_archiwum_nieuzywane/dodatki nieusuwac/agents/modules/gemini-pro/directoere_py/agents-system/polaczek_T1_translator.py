#!/usr/bin/env python3
"""
POLACZEK_T1 - Translation & Cultural Content Agent
ZENON SYSTEM - Mistral Training Data Project

Specializes in:
- Personal content translation (blog reviews, biographical fragments)
- Cultural adaptation of text
- Style consistency across languages
- Personal voice preservation
"""

import asyncio
import websockets
import json
import logging
import datetime
from pathlib import Path

class PolaczekT1Agent:
    def __init__(self):
        self.name = "Polaczek_T1"
        self.port = 3008
        self.status = "initializing"
        self.project_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/projects/mistral_training_data")
        self.output_dir = self.project_dir / "agent_output" / "polaczek_T1_translations"
        self.personal_dir = self.project_dir / "personal_content"
        
        # Ensure output directory exists
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        # Setup logging
        log_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/logs")
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / f"{self.name}.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(self.name)
        
        self.capabilities = [
            "personal_content_translation",
            "blog_review_processing", 
            "biographical_fragment_creation",
            "cultural_adaptation",
            "style_preservation",
            "json_formatting"
        ]
        
        self.tasks_completed = 0
        self.last_activity = datetime.datetime.now()
        
    async def handle_websocket(self, websocket, path):
        """Handle WebSocket connections"""
        self.logger.info(f"New connection from {websocket.remote_address}")
        
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    response = await self.process_command(data)
                    await websocket.send(json.dumps(response))
                except json.JSONDecodeError:
                    error_response = {
                        "status": "error",
                        "message": "Invalid JSON format",
                        "agent": self.name
                    }
                    await websocket.send(json.dumps(error_response))
                except Exception as e:
                    self.logger.error(f"Error processing command: {e}")
                    error_response = {
                        "status": "error", 
                        "message": str(e),
                        "agent": self.name
                    }
                    await websocket.send(json.dumps(error_response))
        except websockets.exceptions.ConnectionClosed:
            self.logger.info(f"Connection closed for {websocket.remote_address}")

    async def process_command(self, data):
        """Process incoming commands"""
        command = data.get("command")
        self.last_activity = datetime.datetime.now()
        
        if command == "get_status":
            return await self.get_status()
        elif command == "translate_content":
            return await self.translate_content(data.get("content", {}))
        elif command == "process_blog_reviews":
            return await self.process_blog_reviews()
        elif command == "create_biographical_fragments":
            return await self.create_biographical_fragments()
        elif command == "generate_training_examples":
            return await self.generate_training_examples(data.get("category"))
        else:
            return {
                "status": "error",
                "message": f"Unknown command: {command}",
                "agent": self.name
            }

    async def get_status(self):
        """Return current agent status"""
        return {
            "agent": self.name,
            "status": self.status,
            "port": self.port,
            "capabilities": self.capabilities,
            "tasks_completed": self.tasks_completed,
            "last_activity": self.last_activity.isoformat(),
            "project_dir": str(self.project_dir),
            "output_dir": str(self.output_dir)
        }

    async def translate_content(self, content_data):
        """Translate and adapt content culturally"""
        try:
            # Placeholder for translation logic
            self.logger.info("Processing translation request")
            
            result = {
                "status": "completed",
                "agent": self.name,
                "task": "content_translation",
                "input": content_data,
                "output": "Translation completed - placeholder implementation",
                "timestamp": datetime.datetime.now().isoformat()
            }
            
            # Save to output directory
            output_file = self.output_dir / f"translation_{self.tasks_completed + 1}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
                
            self.tasks_completed += 1
            return result
            
        except Exception as e:
            self.logger.error(f"Translation error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def process_blog_reviews(self):
        """Process blog reviews for training data"""
        try:
            self.logger.info("Processing blog reviews")
            
            # Placeholder - would read from personal_content/blog_reviews
            examples = []
            
            # Example training data structure
            example = {
                "id": f"blog_review_{self.tasks_completed + 1}",
                "instruction": "Napisz recenzję filmu w stylu osobistym i pasjonackim. Uwzględnij osobiste refleksje.",
                "input": "Film: Example Movie (2024), Gatunek: Sci-Fi",
                "output": "**Placeholder blog review content**\n\nThis would be a personal, passionate film review...",
                "metadata": {
                    "category": "film_review",
                    "subcategory": "personal_blog",
                    "style": "personal_passionate",
                    "complexity": "medium",
                    "length": "medium",
                    "source": "personal_blog",
                    "personal": True,
                    "language": "pl"
                }
            }
            examples.append(example)
            
            # Save examples
            output_file = self.output_dir / f"blog_reviews_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"examples": examples}, f, ensure_ascii=False, indent=2)
                
            self.tasks_completed += 1
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "blog_reviews_processing",
                "examples_created": len(examples),
                "output_file": str(output_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Blog processing error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def create_biographical_fragments(self):
        """Create biographical training examples"""
        try:
            self.logger.info("Creating biographical fragments")
            
            # Placeholder for biographical content creation
            examples = []
            
            # Example biographical training data
            example = {
                "id": f"biography_{self.tasks_completed + 1}",
                "instruction": "Napisz fragment autobiografii opisujący ważne doświadczenie życiowe. Styl: osobisty, refleksyjny.",
                "input": "Temat: Pierwsza przygoda z skateboardingiem, Perspektywa: nauka i wzrost osobisty",
                "output": "**Placeholder biographical content**\n\nFirst skateboard experience story...",
                "metadata": {
                    "category": "personal_biography",
                    "subcategory": "life_experience",
                    "style": "personal_reflective",
                    "complexity": "medium",
                    "length": "medium",
                    "source": "personal_experience",
                    "personal": True,
                    "language": "pl"
                }
            }
            examples.append(example)
            
            # Save examples
            output_file = self.output_dir / f"biographical_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"examples": examples}, f, ensure_ascii=False, indent=2)
                
            self.tasks_completed += 1
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "biographical_fragments",
                "examples_created": len(examples),
                "output_file": str(output_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Biographical creation error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def generate_training_examples(self, category=None):
        """Generate training examples for specified category"""
        try:
            if category == "movie_reviews":
                return await self.process_blog_reviews()
            elif category == "biographical":
                return await self.create_biographical_fragments()
            else:
                return {
                    "status": "error",
                    "message": f"Unknown category: {category}",
                    "agent": self.name,
                    "available_categories": ["movie_reviews", "biographical"]
                }
                
        except Exception as e:
            self.logger.error(f"Example generation error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def start_server(self):
        """Start the WebSocket server"""
        self.status = "running"
        self.logger.info(f"Starting {self.name} on port {self.port}")
        
        server = await websockets.serve(
            self.handle_websocket,
            "localhost",
            self.port
        )
        
        self.logger.info(f"🎯 {self.name} server running on ws://localhost:{self.port}")
        self.logger.info(f"📁 Output directory: {self.output_dir}")
        self.logger.info(f"🎨 Capabilities: {', '.join(self.capabilities)}")
        
        return server

async def main():
    """Main function to start the agent"""
    agent = PolaczekT1Agent()
    
    try:
        server = await agent.start_server()
        print(f"🤖 {agent.name} Agent Started Successfully!")
        print(f"🌐 WebSocket: ws://localhost:{agent.port}")
        print(f"📁 Output: {agent.output_dir}")
        print(f"🎯 Ready for translation and content processing tasks")
        print("Press Ctrl+C to stop...")
        
        # Keep the server running
        await server.wait_closed()
        
    except KeyboardInterrupt:
        print(f"\n🛑 {agent.name} agent stopped by user")
        agent.status = "stopped"
    except Exception as e:
        print(f"❌ Error starting {agent.name}: {e}")
        agent.status = "error"

if __name__ == "__main__":
    asyncio.run(main())
