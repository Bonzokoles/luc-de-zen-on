#!/usr/bin/env python3
"""
POLACZEK_ART - Art Research & File Discovery Agent
==================================================
ZENON AI System - Specialized art research and file management
Author: Jimbo (ZENON AI Coordinator)
Created: 2025-06-07

FUNKCJONALNOŚCI:
- Art file discovery and categorization
- Online art research and trend analysis
- Integration z dashboard art categories
- Metadata extraction and organization
"""

import os
import json
import asyncio
import aiofiles
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Any
import mimetypes
from dataclasses import dataclass, asdict
from PIL import Image, ExifTags
import base64
import io

@dataclass
class ArtFile:
    """Art file representation"""
    path: str
    name: str
    type: str
    category: str
    size: int
    created: str
    modified: str
    metadata: Dict[str, Any]

@dataclass
class ArtProject:
    """Art project representation"""
    name: str
    category: str
    files: List[ArtFile]
    description: str
    created: str
    tags: List[str]

class PolaczekArt:
    """
    Advanced art discovery and research agent
    """
    
    def __init__(self):
        self.name = "Polaczek_ART"
        self.version = "1.0.0"
        self.status = "initializing"
        
        # Art categories mapping
        self.categories = {
            'digital_art': ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'psd', 'ai', 'svg'],
            'film': ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v'],
            'architecture': ['dwg', 'dxf', 'skp', 'rvt', 'ifc', 'step', '3dm'],
            'photography': ['raw', 'cr2', 'nef', 'arw', 'dng', 'jpg', 'jpeg'],
            'music': ['mp3', 'wav', 'flac', 'aac', 'm4a', 'ogg', 'wma'],
            'literature': ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'],
            'performance': ['mp4', 'avi', 'mov', 'mp3', 'wav'],
            'theater': ['pdf', 'doc', 'docx', 'mp4', 'avi', 'mov']
        }
        
        # Common art directories to scan
        self.scan_directories = [
            "C:/Users/*/Documents",
            "C:/Users/*/Pictures", 
            "C:/Users/*/Videos",
            "C:/Users/*/Music",
            "D:/Art_Projects",
            "M:/Art_Projects",
            "M:/MCPserver/projects"
        ]
        
        # AI Integration
        self.ollama_url = "http://localhost:11434"
        self.ai_model = "llama3:8b"
        self.vision_model = "llava"  # If available
        self.log_file = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/logs/polaczek_art.log")
        
        # Ensure log directory exists
        self.log_file.parent.mkdir(exist_ok=True)
        
        self._initialize_logging()
        
    def _initialize_logging(self):
        """Initialize logging system"""
        self.log(f"🎨 {self.name} v{self.version} initializing...")
        self.log(f"Art categories: {len(self.categories)} types configured")
        
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
            print(f"❌ Logging error: {e}")
    
    def categorize_file(self, file_path: str) -> Optional[str]:
        """Categorize file based on extension"""
        extension = Path(file_path).suffix.lower().lstrip('.')
        
        for category, extensions in self.categories.items():
            if extension in extensions:
                return category
        return None
    
    async def scan_directory(self, directory: str) -> List[ArtFile]:
        """Scan directory for art files"""
        art_files = []
        directory_path = Path(directory)
        
        if not directory_path.exists():
            self.log(f"⚠️ Directory not found: {directory}")
            return art_files
            
        self.log(f"🔍 Scanning directory: {directory}")
        
        try:
            for file_path in directory_path.rglob("*"):
                if file_path.is_file():
                    category = self.categorize_file(str(file_path))
                    
                    if category:
                        try:
                            stat = file_path.stat()
                            
                            art_file = ArtFile(
                                path=str(file_path),
                                name=file_path.name,
                                type=file_path.suffix.lower(),
                                category=category,
                                size=stat.st_size,
                                created=datetime.fromtimestamp(stat.st_ctime).isoformat(),
                                modified=datetime.fromtimestamp(stat.st_mtime).isoformat(),
                                metadata={}
                            )
                            
                            art_files.append(art_file)
                            
                        except Exception as e:
                            self.log(f"❌ Error processing file {file_path}: {e}", "ERROR")
                            
        except Exception as e:
            self.log(f"❌ Error scanning directory {directory}: {e}", "ERROR")
            
        self.log(f"✅ Found {len(art_files)} art files in {directory}")
        return art_files
    
    async def discover_all_art_files(self) -> Dict[str, List[ArtFile]]:
        """Discover all art files across configured directories"""
        self.log("🚀 Starting comprehensive art file discovery...")
        
        all_files = {}
        total_files = 0
        
        for directory in self.scan_directories:
            # Expand user path wildcards
            if '*' in directory:
                import glob
                expanded_dirs = glob.glob(directory)
                for expanded_dir in expanded_dirs:
                    category_files = await self.scan_directory(expanded_dir)
                    for art_file in category_files:
                        category = art_file.category
                        if category not in all_files:
                            all_files[category] = []
                        all_files[category].append(art_file)
                        total_files += 1
            else:
                category_files = await self.scan_directory(directory)
                for art_file in category_files:
                    category = art_file.category
                    if category not in all_files:
                        all_files[category] = []
                    all_files[category].append(art_file)
                    total_files += 1
        
        self.discovered_files = all_files
        self.log(f"🎨 Discovery complete! Found {total_files} art files across {len(all_files)} categories")
        
        return all_files
    
    async def organize_into_projects(self) -> Dict[str, ArtProject]:
        """Organize discovered files into logical art projects"""
        self.log("📁 Organizing files into art projects...")
        
        projects = {}
        
        for category, files in self.discovered_files.items():
            # Group files by directory (potential projects)
            directory_groups = {}
            
            for art_file in files:
                directory = str(Path(art_file.path).parent)
                if directory not in directory_groups:
                    directory_groups[directory] = []
                directory_groups[directory].append(art_file)
            
            # Create projects from directory groups
            for directory, grouped_files in directory_groups.items():
                if len(grouped_files) >= 1:  # At least 1 file to make a project
                    project_name = f"{category}_{Path(directory).name}"
                    
                    project = ArtProject(
                        name=project_name,
                        category=category,
                        files=grouped_files,
                        description=f"Auto-discovered {category} project from {directory}",
                        created=min(f.created for f in grouped_files),
                        tags=[category, "auto-discovered"]
                    )
                    
                    projects[project_name] = project
        
        self.art_projects = projects
        self.log(f"📋 Created {len(projects)} art projects from discovered files")
        
        return projects
    
    async def generate_dashboard_data(self) -> Dict[str, Any]:
        """Generate data for dashboard integration"""
        self.log("📊 Generating dashboard integration data...")
        
        dashboard_data = {
            "categories": {},
            "projects": {},
            "statistics": {
                "total_files": sum(len(files) for files in self.discovered_files.values()),
                "total_projects": len(self.art_projects),
                "categories_count": len(self.discovered_files),
                "last_scan": datetime.now().isoformat()
            }
        }
        
        # Category summaries for dashboard
        for category, files in self.discovered_files.items():
            dashboard_data["categories"][category] = {
                "count": len(files),
                "total_size": sum(f.size for f in files),
                "latest_file": max(files, key=lambda f: f.modified).name if files else None,
                "file_types": list(set(f.type for f in files))
            }
        
        # Project summaries
        for project_name, project in self.art_projects.items():
            dashboard_data["projects"][project_name] = {
                "category": project.category,
                "file_count": len(project.files),
                "total_size": sum(f.size for f in project.files),
                "created": project.created,
                "tags": project.tags
            }
        
        return dashboard_data
    
    async def save_discovery_results(self):
        """Save discovery results to files"""
        results_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/art_discovery")
        results_dir.mkdir(exist_ok=True)
        
        # Save discovered files
        files_data = {
            category: [asdict(f) for f in files] 
            for category, files in self.discovered_files.items()
        }
        
        async with aiofiles.open(results_dir / "discovered_files.json", "w") as f:
            await f.write(json.dumps(files_data, indent=2))
        
        # Save art projects
        projects_data = {
            name: asdict(project) 
            for name, project in self.art_projects.items()
        }
        
        async with aiofiles.open(results_dir / "art_projects.json", "w") as f:
            await f.write(json.dumps(projects_data, indent=2))
        
        # Save dashboard data
        dashboard_data = await self.generate_dashboard_data()
        async with aiofiles.open(results_dir / "dashboard_data.json", "w") as f:
            await f.write(json.dumps(dashboard_data, indent=2))
        
        self.log(f"💾 Discovery results saved to {results_dir}")
    
    async def run_full_discovery(self):
        """Run complete art discovery process"""
        self.log("🎨 Starting FULL ART DISCOVERY process...")
        self.status = "running"
        
        try:
            # Step 1: Discover all art files
            await self.discover_all_art_files()
            
            # Step 2: Organize into projects
            await self.organize_into_projects()
            
            # Step 3: Generate dashboard data
            dashboard_data = await self.generate_dashboard_data()
            
            # Step 4: Save results
            await self.save_discovery_results()
            
            self.status = "completed"
            self.log("✅ Art discovery process completed successfully!")
            
            return dashboard_data
            
        except Exception as e:
            self.status = "error"
            self.log(f"❌ Art discovery failed: {e}", "ERROR")
            raise

async def main():
    """Main entry point"""
    print("🎨 POLACZEK_ART - Art Discovery Agent")
    print("=" * 50)
    
    # Create and run art discovery agent
    art_agent = PolaczekArt()
    
    try:
        dashboard_data = await art_agent.run_full_discovery()
        
        print("\n📊 DISCOVERY SUMMARY:")
        stats = dashboard_data["statistics"]
        print(f"Total Files: {stats['total_files']}")
        print(f"Total Projects: {stats['total_projects']}")
        print(f"Categories: {stats['categories_count']}")
        
        print("\n📁 CATEGORIES:")
        for category, data in dashboard_data["categories"].items():
            print(f"  {category}: {data['count']} files")
            
    except KeyboardInterrupt:
        print("\n🛑 Discovery interrupted by user")
    except Exception as e:
        print(f"❌ Fatal error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
