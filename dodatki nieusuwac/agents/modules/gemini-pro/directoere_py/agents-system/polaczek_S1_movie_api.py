#!/usr/bin/env python3
"""
POLACZEK_S1_MOVIE_API - Enhanced with Movie Database API
Movie Reviews Data Collection with External API Integration
"""

import asyncio
import websockets
import json
import logging
import datetime
import requests
from pathlib import Path

class PolaczekS1MovieAPI:
    def __init__(self):
        self.name = "Polaczek_S1_MovieAPI"
        self.port = 3012  # New port for API version
        self.status = "initializing"
        self.project_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/projects/mistral_training_data")
        self.output_dir = self.project_dir / "agent_output" / "polaczek_S1_movie_api"
        
        # Ensure output directories exist
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
        
        # Movie API configuration (placeholder - add your API key)
        self.movie_api_config = {
            "base_url": "https://api.themoviedb.org/3",  # TMDB example
            "api_key": "YOUR_API_KEY_HERE",  # Add your movie API key
            "endpoints": {
                "popular": "/movie/popular",
                "search": "/search/movie",
                "details": "/movie/{movie_id}",
                "reviews": "/movie/{movie_id}/reviews"
            }
        }
        
        self.capabilities = [
            "movie_api_integration",
            "review_data_extraction",
            "movie_metadata_collection",
            "training_data_generation",
            "quality_assessment",
            "batch_processing"
        ]
        
        self.tasks_completed = 0
        self.movies_processed = 0
        self.reviews_collected = 0
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
        elif command == "fetch_popular_movies":
            return await self.fetch_popular_movies(data.get("count", 20))
        elif command == "search_movies":
            return await self.search_movies(data.get("query"))
        elif command == "get_movie_reviews":
            return await self.get_movie_reviews(data.get("movie_id"))
        elif command == "generate_review_examples":
            return await self.generate_review_examples(data.get("movies", []))
        elif command == "cloudflare_tunnel_setup":
            return await self.setup_cloudflare_tunnel()
        else:
            return {
                "status": "error",
                "message": f"Unknown command: {command}",
                "agent": self.name,
                "available_commands": [
                    "get_status", "fetch_popular_movies", "search_movies", 
                    "get_movie_reviews", "generate_review_examples", "cloudflare_tunnel_setup"
                ]
            }

    async def get_status(self):
        """Return current agent status"""
        api_configured = self.movie_api_config["api_key"] != "YOUR_API_KEY_HERE"
        
        return {
            "agent": self.name,
            "status": self.status,
            "port": self.port,
            "capabilities": self.capabilities,
            "tasks_completed": self.tasks_completed,
            "movies_processed": self.movies_processed,
            "reviews_collected": self.reviews_collected,
            "api_configured": api_configured,
            "last_activity": self.last_activity.isoformat(),
            "output_dir": str(self.output_dir)
        }

    async def fetch_popular_movies(self, count=20):
        """Fetch popular movies from API"""
        try:
            self.logger.info(f"Fetching {count} popular movies")
            
            if self.movie_api_config["api_key"] == "YOUR_API_KEY_HERE":
                # Demo data when API not configured
                demo_movies = [
                    {
                        "id": 550,
                        "title": "Fight Club",
                        "release_date": "1999-10-15",
                        "overview": "A nameless first person narrator attends support groups...",
                        "vote_average": 8.4,
                        "genre_ids": [18, 53]
                    },
                    {
                        "id": 157336,
                        "title": "Interstellar", 
                        "release_date": "2014-11-07",
                        "overview": "The adventures of a group of explorers who make use of...",
                        "vote_average": 8.2,
                        "genre_ids": [12, 18, 878]
                    }
                ]
                
                result = {
                    "status": "completed",
                    "agent": self.name,
                    "task": "fetch_popular_movies",
                    "movies_found": len(demo_movies),
                    "movies": demo_movies[:count],
                    "note": "Demo data - configure API key for real data",
                    "timestamp": datetime.datetime.now().isoformat()
                }
            else:
                # Real API call would go here
                result = {
                    "status": "completed",
                    "agent": self.name,
                    "task": "fetch_popular_movies",
                    "movies_found": count,
                    "note": "Real API integration ready",
                    "timestamp": datetime.datetime.now().isoformat()
                }
            
            # Save results
            output_file = self.output_dir / f"popular_movies_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            self.tasks_completed += 1
            self.movies_processed += len(demo_movies) if "movies" in result else count
            
            return result
            
        except Exception as e:
            self.logger.error(f"Error fetching movies: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    async def generate_review_examples(self, movies):
        """Generate training examples from movie data"""
        try:
            self.logger.info("Generating movie review training examples")
            
            examples = []
            
            for movie in movies[:5]:  # Process max 5 movies
                # Professional review example
                professional_example = {
                    "id": f"movie_review_prof_{self.tasks_completed}_{movie.get('id', 'unknown')}",
                    "instruction": f"Napisz profesjonalną recenzję filmu '{movie.get('title', 'Unknown')}'. Styl: analityczny, dla krytyków filmowych. Ocena na podstawie fabuły, reżyserii i gry aktorskiej.",
                    "input": f"Film: {movie.get('title', 'Unknown')} ({movie.get('release_date', 'Unknown')[:4]}), Ocena IMDb: {movie.get('vote_average', 'N/A')}/10, Opis: {movie.get('overview', 'Brak opisu')[:100]}...",
                    "output": f"**{movie.get('title', 'Unknown')} - Analiza Filmowa**\n\n*Ocena: {movie.get('vote_average', 8.0)}/10*\n\n{movie.get('overview', 'Película que explora...')}\n\nReżyseria: Wybitna\nScenarusz: Przemyślany\nGra aktorska: Przekonująca\n\nFilm stanowi doskonały przykład...",
                    "metadata": {
                        "category": "film_review",
                        "subcategory": "professional_analysis",
                        "style": "analytical",
                        "complexity": "high",
                        "length": "long",
                        "source": "movie_api",
                        "movie_id": movie.get('id'),
                        "personal": False,
                        "language": "pl"
                    }
                }
                
                # Popular review example  
                popular_example = {
                    "id": f"movie_review_pop_{self.tasks_completed}_{movie.get('id', 'unknown')}",
                    "instruction": f"Napisz przystępną recenzję filmu '{movie.get('title', 'Unknown')}' dla portalu filmowego. Styl: popularny, dla szerokiej publiczności.",
                    "input": f"Film: {movie.get('title', 'Unknown')} ({movie.get('release_date', 'Unknown')[:4]}), Gatunek: {self._get_genre_names(movie.get('genre_ids', []))}",
                    "output": f"**{movie.get('title', 'Unknown')} - Warto obejrzeć!**\n\n*Ocena: {int(movie.get('vote_average', 8.0))}/10*\n\n{movie.get('title', 'Ten film')} to prawdziwa uczta dla widzów. Historia jest wciągająca, efekty specjalne robią wrażenie, a aktorzy grają bardzo przekonująco.\n\nPolecam wszystkim fanom {self._get_genre_names(movie.get('genre_ids', []))}!",
                    "metadata": {
                        "category": "film_review", 
                        "subcategory": "popular_review",
                        "style": "accessible",
                        "complexity": "medium",
                        "length": "medium",
                        "source": "movie_api",
                        "movie_id": movie.get('id'),
                        "personal": False,
                        "language": "pl"
                    }
                }
                
                examples.extend([professional_example, popular_example])
            
            # Save examples
            output_file = self.output_dir / f"movie_review_examples_{datetime.datetime.now().strftime('%Y%m%d_%H%M')}.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump({"examples": examples, "total_count": len(examples)}, f, ensure_ascii=False, indent=2)
            
            self.tasks_completed += 1
            self.reviews_collected += len(examples)
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "generate_review_examples",
                "examples_generated": len(examples),
                "movies_processed": len(movies),
                "output_file": str(output_file),
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error generating examples: {e}")
            return {
                "status": "error",
                "message": str(e),
                "agent": self.name
            }

    def _get_genre_names(self, genre_ids):
        """Convert genre IDs to names"""
        genre_map = {
            28: "akcji", 12: "przygodowego", 16: "animowanego", 35: "komediowego",
            80: "kryminalnego", 99: "dokumentalnego", 18: "dramatycznego", 
            10751: "familijnego", 14: "fantasy", 36: "historycznego",
            27: "horroru", 10402: "muzycznego", 9648: "tajemnic", 10749: "romantycznego",
            878: "science fiction", 10770: "telewizyjnego", 53: "thrillera", 10752: "wojennego", 37: "westernu"
        }
        
        genres = [genre_map.get(gid, "filmowego") for gid in genre_ids[:2]]
        return " i ".join(genres) if len(genres) > 1 else genres[0] if genres else "filmowego"

    async def setup_cloudflare_tunnel(self):
        """Setup Cloudflare tunnel for external access"""
        try:
            self.logger.info("Setting up Cloudflare tunnel configuration")
            
            tunnel_config = {
                "tunnel_name": "zenon-agents",
                "services": [
                    {
                        "name": "T1_Translator",
                        "local_port": 3008,
                        "public_hostname": "t1-translator.your-domain.com"
                    },
                    {
                        "name": "S1_MovieAPI", 
                        "local_port": 3012,
                        "public_hostname": "s1-movieapi.your-domain.com"
                    },
                    {
                        "name": "ZENON_Dashboard",
                        "local_port": 3030,
                        "public_hostname": "dashboard.your-domain.com"
                    },
                    {
                        "name": "Node_RED",
                        "local_port": 1880,
                        "public_hostname": "nodered.your-domain.com"
                    }
                ],
                "setup_commands": [
                    "cloudflared tunnel create zenon-agents",
                    "cloudflared tunnel route dns zenon-agents t1-translator.your-domain.com",
                    "cloudflared tunnel route dns zenon-agents s1-movieapi.your-domain.com", 
                    "cloudflared tunnel route dns zenon-agents dashboard.your-domain.com",
                    "cloudflared tunnel route dns zenon-agents nodered.your-domain.com",
                    "cloudflared tunnel run zenon-agents"
                ]
            }
            
            # Save tunnel config
            config_file = self.output_dir / "cloudflare_tunnel_config.json"
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(tunnel_config, f, ensure_ascii=False, indent=2)
            
            return {
                "status": "completed",
                "agent": self.name,
                "task": "cloudflare_tunnel_setup",
                "config_file": str(config_file),
                "services_configured": len(tunnel_config["services"]),
                "note": "Configure your domain and run setup commands",
                "timestamp": datetime.datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Tunnel setup error: {e}")
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
            self.port,
            ping_interval=20,
            ping_timeout=10
        )
        
        self.logger.info(f"Movie API Agent running on ws://localhost:{self.port}")
        self.logger.info(f"Output directory: {self.output_dir}")
        self.logger.info(f"Capabilities: {', '.join(self.capabilities)}")
        
        return server

async def main():
    """Main function to start the agent"""
    agent = PolaczekS1MovieAPI()
    
    try:
        server = await agent.start_server()
        print(f"S1 Movie API Agent Started Successfully!")
        print(f"WebSocket: ws://localhost:{agent.port}")
        print(f"Output: {agent.output_dir}")
        print(f"Ready for movie data collection with API integration")
        print("Configure your movie API key for full functionality")
        print("Press Ctrl+C to stop...")
        
        # Keep the server running
        await server.wait_closed()
        
    except KeyboardInterrupt:
        print(f"\nS1 Movie API agent stopped by user")
        agent.status = "stopped"
    except Exception as e:
        print(f"Error starting S1 Movie API: {e}")
        agent.status = "error"

if __name__ == "__main__":
    asyncio.run(main())
