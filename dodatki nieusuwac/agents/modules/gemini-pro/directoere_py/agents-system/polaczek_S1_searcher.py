#!/usr/bin/env python3
"""
POLACZEK_S1 - Search & Data Gathering Agent
ZENON SYSTEM - Mistral Training Data Project

Specializes in:
- Web scraping for training examples
- Content research and source discovery
- Data validation and quality check
- Automated content collection
- Source material organization
"""

import asyncio
import websockets
import json
import logging
import datetime
import requests
import aiohttp
from pathlib import Path
from urllib.parse import urlparse, urljoin
import time
import re

class PolaczekS1Agent:
    def __init__(self):
        self.name = "Polaczek_S1"
        self.port = 3010
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
                logging.FileHandler(log_dir / f"{self.name}.log"),
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
            "technical_docs": [
                "github.com",
                "stackoverflow.com", 
                "docs.python.org",
                "developer.mozilla.org",
                "react.dev"
            ],
            "creative_writing": [
                "reddit.com/r/WritingPrompts",
                "wattpad.com",
                "archive.org",
                "gutenberg.org"
            ],
            "movie_reviews": [
                "imdb.com",
                "filmweb.pl",
                "rottentomatoes.com",
                "metacritic.com"
            ],
            "science_philosophy": [
                "stanford.edu/plato",
                "arxiv.org",
                "jstor.org",
                "philpapers.org"
            ],
            "counterculture": [
                "theanarchistlibrary.org",
                "beatmuseum.org",
                "erowid.org"
            ]
        }

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
        elif command == "search_sources":
            return await self.search_sources(data.get("category"), data.get("query"))
        elif command == "scrape_content":
            return await self.scrape_content(data.get("url"), data.get("content_type"))
        elif command == "discover_examples":
            return await self.discover_examples(data.get("category"))
        elif command == "validate_content":
            return await self.validate_content(data.get("content"))
        elif command == "collect_category_data":
            return await self.collect_category_data(data.get("category"))
        elif command == "generate_source_report":
            return await self.generate_source_report()
        else:
            return {
                "status": "error",
                "message": f"Unknown command: {command}",
                "agent": self.name,
                "available_commands": [
                    "get_status", "search_sources", "scrape_content", 
                    "discover_examples", "validate_content", "collect_category_data",
                    "generate_source_report"
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
            self.logger.info(f"Searching sources for category: {category}, query: {query}")
            
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

    async def scrape_content(self, url, content_type="text"):
        """Scrape content from specified URL"""
        try:
            self.logger.info(f"Scraping content from: {url}")
            
            # Placeholder for actual scraping logic
            # In real implementation, would use aiohttp, BeautifulSoup, etc.
            
            scraped_data = {
                "url": url,
                "content_type": content_type,
                "title": f"Sample content from {urlparse(url).netloc}",
                "content": f"Placeholder scraped content from {url}",
                "metadata": {
                    "scraped_at": datetime.datetime.now().isoformat(),
                    "content_length": 1500,
                    "language": "en",
                    "quality_score": 0.85
                }
            }
            
            # Save scraped content
            filename = f"scraped_{urlparse(url).netloc}_{int(time.time())}.json"
            output_file = self.output_dir / filename
            
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(scraped_data, f, ensure_ascii=False, indent=2)
            
            self.tasks_completed += 1
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "content_scraping",
                "url": url,
                "content_preview": scraped_data["content"][:200] + "...",
                "metadata": scraped_data["metadata"],
                "output_file": str(output_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Scraping error: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def discover_examples(self, category):
        """Discover training examples for specified category"""
        try:
            self.logger.info(f"Discovering examples for category: {category}")
            
            # Example discovery based on category
            discovered_examples = []
            
            if category == "technical_docs":
                examples = [
                    {
                        "id": f"tech_doc_{self.tasks_completed + 1}",
                        "instruction": "Napisz dokumentację API dla REST endpoint. Styl: techniczny, dla programistów.",
                        "input": "Endpoint: /api/users, Metody: GET, POST, PUT, DELETE",
                        "output": "# Users API Documentation\n\n## GET /api/users\nReturns list of users...",
                        "source": "github.com/example",
                        "quality_score": 0.9
                    }
                ]
            elif category == "creative_stories":
                examples = [
                    {
                        "id": f"story_{self.tasks_completed + 1}",
                        "instruction": "Napisz krótkie opowiadanie science fiction. Długość: 800-1200 słów.",
                        "input": "Temat: Pierwsza kolonia na Marsie, Perspektywa: kolonista",
                        "output": "**Czerwona Ziemia**\n\nKiedy pierwszy raz ujrzałem marsjański horyzont...",
                        "source": "reddit.com/r/WritingPrompts",
                        "quality_score": 0.85
                    }
                ]
            else:
                examples = [
                    {
                        "id": f"general_{self.tasks_completed + 1}",
                        "instruction": f"Generate content for {category}",
                        "input": "Sample input",
                        "output": "Sample output content...",
                        "source": "discovered",
                        "quality_score": 0.7
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

    async def validate_content(self, content):
        """Validate content quality for training data"""
        try:
            self.logger.info("Validating content quality")
            
            validation_result = {
                "content_length": len(content.get("output", "")),
                "has_instruction": bool(content.get("instruction")),
                "has_output": bool(content.get("output")),
                "language_detected": "pl",
                "quality_score": 0.85,
                "issues": [],
                "recommendations": []
            }
            
            # Quality checks
            if validation_result["content_length"] < 100:
                validation_result["issues"].append("Content too short")
                validation_result["quality_score"] -= 0.2
                
            if not validation_result["has_instruction"]:
                validation_result["issues"].append("Missing instruction")
                validation_result["quality_score"] -= 0.3
                
            if validation_result["quality_score"] < 0.7:
                validation_result["recommendations"].append("Improve content quality")
                
            return {
                "status": "completed",
                "agent": self.name,
                "task": "content_validation",
                "validation": validation_result,
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Validation error: {e}")
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
                "status": "in_progress",
                "next_steps": [
                    "scrape_identified_sources",
                    "validate_collected_content", 
                    "format_for_training"
                ]
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

    async def generate_source_report(self):
        """Generate comprehensive source discovery report"""
        try:
            self.logger.info("Generating source report")
            
            report = {
                "agent": self.name,
                "report_date": datetime.datetime.now().isoformat(),
                "total_tasks_completed": self.tasks_completed,
                "total_sources_found": self.sources_found,
                "categories_covered": list(self.source_categories.keys()),
                "source_categories": self.source_categories,
                "output_directory": str(self.output_dir),
                "recommendations": [
                    "Start with technical_docs - most structured content",
                    "Focus on creative_writing for personal content",
                    "Prioritize high-quality sources for training data",
                    "Validate all scraped content before training"
                ]
            }
            
            # Save comprehensive report
            report_file = self.output_dir / f"source_discovery_report_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(report_file, 'w', encoding='utf-8') as f:
                json.dump(report, f, ensure_ascii=False, indent=2)
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "source_report_generation",
                "report": report,
                "report_file": str(report_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Report generation error: {e}")
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
        
        self.logger.info(f"🔍 {self.name} server running on ws://localhost:{self.port}")
        self.logger.info(f"📁 Output directory: {self.output_dir}")
        self.logger.info(f"🎯 Capabilities: {', '.join(self.capabilities)}")
        self.logger.info(f"📚 Source categories: {', '.join(self.source_categories.keys())}")
        
        return server

async def main():
    """Main function to start the agent"""
    agent = PolaczekS1Agent()
    
    try:
        server = await agent.start_server()
        print(f"🤖 {agent.name} Agent Started Successfully!")
        print(f"🌐 WebSocket: ws://localhost:{agent.port}")
        print(f"📁 Output: {agent.output_dir}")
        print(f"🔍 Ready for data collection and research tasks")
        print(f"📚 Categories: {', '.join(agent.source_categories.keys())}")
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
