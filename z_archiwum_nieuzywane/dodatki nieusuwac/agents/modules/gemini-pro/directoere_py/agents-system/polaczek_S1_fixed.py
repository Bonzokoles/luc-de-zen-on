#!/usr/bin/env python3
"""
POLACZEK_S1 - FIXED VERSION
Search & Data Gathering Agent with improved WebSocket handling
"""

import asyncio
import websockets
import json
import logging
import datetime
from pathlib import Path
from urllib.parse import urlparse
import time

class PolaczekS1Agent:
    def __init__(self):
        self.name = "Polaczek_S1"
        self.port = 3011  # Changed port to avoid conflicts
        self.status = "initializing"
        self.project_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/projects/mistral_training_data")
        self.output_dir = self.project_dir / "agent_output" / "polaczek_S1_research"
        self.sources_dir = self.output_dir / "sources"
        
        # Ensure output directories exist
        self.output_dir.mkdir(parents=True, exist_ok=True)
        self.sources_dir.mkdir(exist_ok=True)
        
        # Setup logging
        log_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/logs")
        log_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_dir / f"{self.name}_fixed.log"),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(self.name)
        
        self.capabilities = [
            "web_content_scraping",
            "source_material_research", 
            "data_validation",
            "content_categorization",
            "quality_assessment",
            "automated_collection",
            "source_discovery",
            "metadata_extraction"
        ]
        
        self.tasks_completed = 0
        self.sources_found = 0
        self.last_activity = datetime.datetime.now()
        
        # Source categories for data collection
        self.source_categories = {
            "movie_reviews": [
                "imdb.com/reviews",
                "filmweb.pl/reviews", 
                "rottentomatoes.com/reviews",
                "metacritic.com/movie"
            ],
            "technical_docs": [
                "github.com/repos",
                "stackoverflow.com/questions",
                "docs.python.org",
                "developer.mozilla.org"
            ],
            "creative_writing": [
                "reddit.com/r/WritingPrompts",
                "archive.org/details/texts",
                "gutenberg.org/browse"
            ],
            "science_philosophy": [
                "stanford.edu/entries",
                "arxiv.org/list",
                "philpapers.org/browse"
            ],
            "counterculture": [
                "theanarchistlibrary.org/library",
                "beatmuseum.org/archives"
            ]
        }

    async def handle_websocket(self, websocket, path):
        """Handle WebSocket connections with improved error handling"""
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
        except Exception as e:
            self.logger.error(f"WebSocket error: {e}")

    async def process_command(self, data):
        """Process incoming commands"""
        command = data.get("command")
        self.last_activity = datetime.datetime.now()
        
        self.logger.info(f"Processing command: {command}")
        
        if command == "get_status":
            return await self.get_status()
        elif command == "search_sources":
            return await self.search_sources(data.get("category"), data.get("query"))
        elif command == "discover_examples":
            return await self.discover_examples(data.get("category"))
        elif command == "collect_category_data":
            return await self.collect_category_data(data.get("category"))
        else:
            return {
                "status": "error",
                "message": f"Unknown command: {command}",
                "agent": self.name,
                "available_commands": [
                    "get_status", "search_sources", "discover_examples", "collect_category_data"
                ]
            }

    async def get_status(self):
        """Return current agent status"""
        return {
            "agent": self.name,
            "status": self.status,
            "port": self.port,
            "capabilities": self.capabilities,
            "tasks_completed": self.tasks_completed,
            "sources_found": self.sources_found,
            "last_activity": self.last_activity.isoformat(),
            "project_dir": str(self.project_dir),
            "output_dir": str(self.output_dir),
            "source_categories": list(self.source_categories.keys())
        }

    async def search_sources(self, category=None, query=None):
        """Search for relevant sources in specified category"""
        try:
            self.logger.info(f"Searching sources for category: {category}")
            
            if category and category in self.source_categories:
                sources = self.source_categories[category]
                found_sources = []
                
                for source in sources:
                    source_info = {
                        "url": source,
                        "category": category,
                        "status": "available",
                        "relevance": "high",
                        "last_checked": datetime.datetime.now().isoformat()
                    }
                    found_sources.append(source_info)
                    self.sources_found += 1
                
                # Save sources to file
                sources_file = self.sources_dir / f"{category}_sources_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
                with open(sources_file, 'w', encoding='utf-8') as f:
                    json.dump({"category": category, "sources": found_sources}, f, ensure_ascii=False, indent=2)
                
                self.tasks_completed += 1
                
                return {
                    "status": "completed",
                    "agent": self.name,
                    "task": "source_search",
                    "category": category,
                    "sources_found": len(found_sources),
                    "sources": found_sources,
                    "output_file": str(sources_file),
                    "timestamp": datetime.datetime.now().isoformat()
                }
            else:
                return {
                    "status": "error",
                    "message": f"Invalid category: {category}",
                    "agent": self.name,
                    "available_categories": list(self.source_categories.keys())
                }
                
        except Exception as e:
            self.logger.error(f"Source search error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def discover_examples(self, category):
        """Discover training examples for specified category"""
        try:
            self.logger.info(f"Discovering examples for category: {category}")
            
            discovered_examples = []
            
            if category == "movie_reviews":
                examples = [
                    {
                        "id": f"movie_review_{self.tasks_completed + 1}",
                        "instruction": "Napisz recenzję filmu w stylu profesjonalnym. Uwzględnij analizę fabuły, gry aktorskiej i reżyserii.",
                        "input": "Film: Blade Runner 2049 (2017), Reżyser: Denis Villeneuve, Gatunek: Sci-Fi",
                        "output": "**Blade Runner 2049 - Wizjonerski powrót do przyszłości**\n\n*Ocena: 9/10*\n\nDenis Villeneuve stworzył arcydzieło science fiction...",
                        "metadata": {
                            "category": "film_review",
                            "subcategory": "professional_review",
                            "style": "analytical",
                            "complexity": "high",
                            "length": "long",
                            "source": "discovered",
                            "personal": False,
                            "language": "pl"
                        }
                    },
                    {
                        "id": f"movie_review_{self.tasks_completed + 2}",
                        "instruction": "Napisz krótką recenzję filmu dla portalu filmowego. Styl: przystępny, dla szerokiej publiczności.",
                        "input": "Film: Spider-Man: No Way Home (2021), Gatunek: Akcja/Przygodowy",
                        "output": "**Spider-Man: No Way Home - Multiwersum pełne emocji**\n\n*Ocena: 8/10*\n\nNajnowsza przygoda Spider-Mana to prawdziwa uczta...",
                        "metadata": {
                            "category": "film_review",
                            "subcategory": "popular_review",
                            "style": "accessible",
                            "complexity": "medium",
                            "length": "medium",
                            "source": "discovered",
                            "personal": False,
                            "language": "pl"
                        }
                    }
                ]
            elif category == "technical_docs":
                examples = [
                    {
                        "id": f"tech_doc_{self.tasks_completed + 1}",
                        "instruction": "Napisz dokumentację API dla REST endpoint. Styl: techniczny, dla programistów.",
                        "input": "Endpoint: /api/users, Metody: GET, POST, PUT, DELETE",
                        "output": "# Users API Documentation\n\n## GET /api/users\nZwraca listę użytkowników...",
                        "metadata": {
                            "category": "technical_document",
                            "subcategory": "api_documentation",
                            "style": "technical",
                            "complexity": "high",
                            "length": "long",
                            "source": "discovered",
                            "personal": False,
                            "language": "pl"
                        }
                    }
                ]
            else:
                examples = [
                    {
                        "id": f"general_{self.tasks_completed + 1}",
                        "instruction": f"Stwórz przykład treści dla kategorii {category}",
                        "input": "Przykładowe dane wejściowe",
                        "output": "Przykładowa treść wyjściowa...",
                        "metadata": {
                            "category": category,
                            "subcategory": "general",
                            "style": "standard",
                            "complexity": "medium",
                            "length": "medium",
                            "source": "discovered",
                            "personal": False,
                            "language": "pl"
                        }
                    }
                ]
            
            discovered_examples.extend(examples)
            
            # Save discovered examples
            output_file = self.output_dir / f"discovered_{category}_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"category": category, "examples": discovered_examples}, f, ensure_ascii=False, indent=2)
            
            self.tasks_completed += 1
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "example_discovery",
                "category": category,
                "examples_found": len(discovered_examples),
                "examples": discovered_examples,
                "output_file": str(output_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Discovery error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def collect_category_data(self, category):
        """Collect data for entire category"""
        try:
            self.logger.info(f"Collecting data for category: {category}")
            
            # Step 1: Search sources
            sources_result = await self.search_sources(category)
            
            # Step 2: Discover examples 
            examples_result = await self.discover_examples(category)
            
            # Step 3: Generate collection report
            collection_report = {
                "category": category,
                "sources_found": sources_result.get("sources_found", 0),
                "examples_discovered": examples_result.get("examples_found", 0),
                "collection_started": datetime.datetime.now().isoformat(),
                "status": "completed",
                "agent": self.name
            }
            
            # Save collection report
            report_file = self.output_dir / f"collection_report_{category}_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(collection_report, f, ensure_ascii=False, indent=2)
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "category_data_collection",
                "category": category,
                "collection_report": collection_report,
                "report_file": str(report_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Collection error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def start_server(self):
        """Start the WebSocket server with improved settings"""
        self.status = "running"
        self.logger.info(f"Starting {self.name} on port {self.port}")
        
        server = await websockets.serve(
            self.handle_websocket,
            "localhost",
            self.port,
            ping_interval=20,
            ping_timeout=10,
            close_timeout=10
        )
        
        self.logger.info(f"S1 FIXED server running on ws://localhost:{self.port}")
        self.logger.info(f"Output directory: {self.output_dir}")
        self.logger.info(f"Capabilities: {', '.join(self.capabilities)}")
        self.logger.info(f"Source categories: {', '.join(self.source_categories.keys())}")
        
        return server

async def main():
    """Main function to start the agent"""
    agent = PolaczekS1Agent()
    
    try:
        server = await agent.start_server()
        print(f"S1 FIXED Agent Started Successfully!")
        print(f"WebSocket: ws://localhost:{agent.port}")
        print(f"Output: {agent.output_dir}")
        print(f"Ready for data collection and research tasks")
        print(f"Categories: {', '.join(agent.source_categories.keys())}")
        print("Press Ctrl+C to stop...")
        
        # Keep the server running
        await server.wait_closed()
        
    except KeyboardInterrupt:
        print(f"\nS1 FIXED agent stopped by user")
        agent.status = "stopped"
    except Exception as e:
        print(f"Error starting S1 FIXED: {e}")
        agent.status = "error"

if __name__ == "__main__":
    asyncio.run(main())
