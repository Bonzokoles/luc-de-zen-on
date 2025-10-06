                                path=str(file_path),
                                name=file_path.name,
                                type=file_path.suffix.lower(),
                                category=category,
                                size=stat.st_size,
                                created=datetime.fromtimestamp(stat.st_ctime).isoformat(),
                                modified=datetime.fromtimestamp(stat.st_mtime).isoformat(),
                                metadata={
                                    "directory": str(file_path.parent),
                                    "extension": file_path.suffix,
                                    "stem": file_path.stem
                                },
                                ai_analysis=ai_analysis
                            )
                            
                            art_files.append(art_file)
                            self.log(f"✅ Analyzed: {file_path.name} - {ai_analysis.get('style', 'Unknown')}")
                            
                        except Exception as e:
                            self.log(f"❌ Error processing file {file_path}: {e}", "ERROR")
                            
        except Exception as e:
            self.log(f"❌ Error scanning directory {directory}: {e}", "ERROR")
            
        self.log(f"🎨 Found {len(art_files)} art files with AI analysis in {directory}")
        return art_files
    
    async def discover_all_art_files(self) -> Dict[str, List[ArtFile]]:
        """Enhanced art discovery with AI analysis"""
        self.log("🚀🤖 Starting AI-powered art file discovery...")
        
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
        self.log(f"🎨🤖 AI Discovery complete! Found {total_files} art files across {len(all_files)} categories")
        
        return all_files
    
    async def organize_into_projects(self) -> Dict[str, ArtProject]:
        """Enhanced project organization with AI summaries"""
        self.log("📁🤖 AI-organizing files into smart art projects...")
        
        projects = {}
        
        for category, files in self.discovered_files.items():
            # Smart grouping by directory and style
            directory_groups = {}
            style_groups = {}
            
            for art_file in files:
                directory = str(Path(art_file.path).parent)
                style = art_file.ai_analysis.get('style', 'Unknown')
                
                # Group by directory
                if directory not in directory_groups:
                    directory_groups[directory] = []
                directory_groups[directory].append(art_file)
                
                # Group by AI-detected style
                style_key = f"{category}_{style}"
                if style_key not in style_groups:
                    style_groups[style_key] = []
                style_groups[style_key].append(art_file)
            
            # Create projects from directory groups
            for directory, grouped_files in directory_groups.items():
                if len(grouped_files) >= 1:
                    project_name = f"{category}_{Path(directory).name}"
                    
                    # Generate AI summary for project
                    ai_summary = await self._generate_project_summary(grouped_files, category)
                    
                    # Collect all tags from files
                    all_tags = set([category, "auto-discovered"])
                    for file in grouped_files:
                        all_tags.update(file.ai_analysis.get('tags', []))
                    
                    project = ArtProject(
                        name=project_name,
                        category=category,
                        files=grouped_files,
                        description=f"AI-discovered {category} project from {directory}",
                        created=min(f.created for f in grouped_files),
                        tags=list(all_tags)[:20],  # Limit tags
                        ai_summary=ai_summary
                    )
                    
                    projects[project_name] = project
        
        self.art_projects = projects
        self.log(f"📋🤖 Created {len(projects)} AI-enhanced art projects")
        
        return projects
    
    async def _generate_project_summary(self, files: List[ArtFile], category: str) -> str:
        """Generate AI summary for art project"""
        if not self.ai_available or not files:
            return f"Collection of {len(files)} {category} files"
        
        try:
            # Collect AI descriptions
            descriptions = []
            styles = []
            tags = []
            
            for file in files:
                if file.ai_analysis.get('description'):
                    descriptions.append(file.ai_analysis['description'])
                if file.ai_analysis.get('style'):
                    styles.append(file.ai_analysis['style'])
                tags.extend(file.ai_analysis.get('tags', []))
            
            # Create summary prompt
            prompt = f"""Create a brief project summary for an art collection with these characteristics:

Category: {category}
Number of files: {len(files)}
Styles detected: {list(set(styles))[:5]}
Common tags: {list(set(tags))[:10]}

Sample descriptions:
{chr(10).join(descriptions[:3])}

Write a 2-3 sentence summary describing this art project collection, focusing on the artistic themes, styles, and content."""

            response = requests.post(
                f"{self.ollama_url}/api/generate",
                json={
                    "model": self.ai_model,
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return result.get("response", f"Collection of {len(files)} {category} files")
                
        except Exception as e:
            self.log(f"❌ AI project summary failed: {e}", "ERROR")
            
        return f"AI-discovered collection of {len(files)} {category} files"
    
    async def generate_dashboard_data(self) -> Dict[str, Any]:
        """Generate enhanced dashboard data with AI insights"""
        self.log("📊🤖 Generating AI-enhanced dashboard data...")
        
        dashboard_data = {
            "categories": {},
            "projects": {},
            "ai_insights": {},
            "statistics": {
                "total_files": sum(len(files) for files in self.discovered_files.values()),
                "total_projects": len(self.art_projects),
                "categories_count": len(self.discovered_files),
                "ai_analyzed_files": 0,
                "last_scan": datetime.now().isoformat(),
                "ai_enabled": self.ai_available
            }
        }
        
        # Enhanced category summaries
        for category, files in self.discovered_files.items():
            ai_analyzed_count = sum(1 for f in files if f.ai_analysis.get('ai_generated', False))
            dashboard_data["statistics"]["ai_analyzed_files"] += ai_analyzed_count
            
            # Collect AI insights
            styles = [f.ai_analysis.get('style', 'Unknown') for f in files]
            all_tags = []
            for f in files:
                all_tags.extend(f.ai_analysis.get('tags', []))
            
            dashboard_data["categories"][category] = {
                "count": len(files),
                "total_size": sum(f.size for f in files),
                "latest_file": max(files, key=lambda f: f.modified).name if files else None,
                "file_types": list(set(f.type for f in files)),
                "ai_analyzed": ai_analyzed_count,
                "common_styles": list(set(styles))[:5],
                "popular_tags": [tag for tag, count in 
                               sorted([(tag, all_tags.count(tag)) for tag in set(all_tags)], 
                                     key=lambda x: x[1], reverse=True)][:10]
            }
        
        # Enhanced project summaries
        for project_name, project in self.art_projects.items():
            dashboard_data["projects"][project_name] = {
                "category": project.category,
                "file_count": len(project.files),
                "total_size": sum(f.size for f in project.files),
                "created": project.created,
                "tags": project.tags,
                "ai_summary": project.ai_summary,
                "styles": list(set(f.ai_analysis.get('style', 'Unknown') for f in project.files))
            }
        
        # AI Insights Summary
        dashboard_data["ai_insights"] = {
            "most_common_style": self._get_most_common_style(),
            "style_distribution": self._get_style_distribution(),
            "ai_confidence_average": self._get_average_ai_confidence(),
            "discovery_recommendations": self._get_discovery_recommendations()
        }
        
        return dashboard_data
    
    def _get_most_common_style(self) -> str:
        """Get most common art style across all files"""
        all_styles = []
        for files in self.discovered_files.values():
            for file in files:
                style = file.ai_analysis.get('style', 'Unknown')
                if style != 'Unknown':
                    all_styles.append(style)
        
        if all_styles:
            return max(set(all_styles), key=all_styles.count)
        return "Contemporary"
    
    def _get_style_distribution(self) -> Dict[str, int]:
        """Get distribution of art styles"""
        style_count = {}
        for files in self.discovered_files.values():
            for file in files:
                style = file.ai_analysis.get('style', 'Unknown')
                style_count[style] = style_count.get(style, 0) + 1
        return dict(sorted(style_count.items(), key=lambda x: x[1], reverse=True)[:10])
    
    def _get_average_ai_confidence(self) -> float:
        """Get average AI analysis confidence"""
        confidences = []
        for files in self.discovered_files.values():
            for file in files:
                conf = file.ai_analysis.get('ai_confidence', 0.0)
                if conf > 0:
                    confidences.append(conf)
        
        return round(sum(confidences) / len(confidences), 2) if confidences else 0.0
    
    def _get_discovery_recommendations(self) -> List[str]:
        """Get AI-based discovery recommendations"""
        recommendations = []
        
        # Analyze gaps in collection
        total_files = sum(len(files) for files in self.discovered_files.values())
        
        if total_files < 10:
            recommendations.append("Consider organizing more art files in standard directories")
        
        # Check for underrepresented categories
        category_counts = {cat: len(files) for cat, files in self.discovered_files.items()}
        if category_counts:
            min_category = min(category_counts, key=category_counts.get)
            if category_counts[min_category] < 3:
                recommendations.append(f"Expand your {min_category} collection")
        
        # AI-specific recommendations
        if self.ai_available:
            ai_analyzed = sum(1 for files in self.discovered_files.values() 
                            for f in files if f.ai_analysis.get('ai_generated', False))
            if ai_analyzed < total_files * 0.8:
                recommendations.append("Re-run analysis to get AI insights for more files")
        else:
            recommendations.append("Enable AI models for enhanced analysis and insights")
        
        return recommendations[:5]
    
    async def save_discovery_results(self):
        """Save enhanced discovery results"""
        results_dir = Path("M:/MCPserver/ZENON_AGENTS/POLACZEK_SYSTEM/art_discovery")
        results_dir.mkdir(exist_ok=True)
        
        # Save discovered files with AI analysis
        files_data = {
            category: [asdict(f) for f in files] 
            for category, files in self.discovered_files.items()
        }
        
        async with aiofiles.open(results_dir / "ai_discovered_files.json", "w") as f:
            await f.write(json.dumps(files_data, indent=2))
        
        # Save AI-enhanced projects
        projects_data = {
            name: asdict(project) 
            for name, project in self.art_projects.items()
        }
        
        async with aiofiles.open(results_dir / "ai_art_projects.json", "w") as f:
            await f.write(json.dumps(projects_data, indent=2))
        
        # Save enhanced dashboard data
        dashboard_data = await self.generate_dashboard_data()
        async with aiofiles.open(results_dir / "ai_dashboard_data.json", "w") as f:
            await f.write(json.dumps(dashboard_data, indent=2))
        
        self.log(f"💾🤖 AI-enhanced discovery results saved to {results_dir}")
    
    async def run_full_discovery(self):
        """Run complete AI-enhanced art discovery"""
        self.log("🎨🤖 Starting FULL AI-ENHANCED ART DISCOVERY process...")
        self.status = "running"
        
        try:
            # Step 1: AI-powered file discovery
            await self.discover_all_art_files()
            
            # Step 2: Intelligent project organization
            await self.organize_into_projects()
            
            # Step 3: Generate enhanced dashboard data
            dashboard_data = await self.generate_dashboard_data()
            
            # Step 4: Save comprehensive results
            await self.save_discovery_results()
            
            self.status = "completed"
            self.log("✅🤖 AI-enhanced art discovery completed successfully!")
            
            return dashboard_data
            
        except Exception as e:
            self.status = "error"
            self.log(f"❌ AI art discovery failed: {e}", "ERROR")
            raise

async def main():
    """Main entry point for AI-enhanced art discovery"""
    print("🎨🤖 POLACZEK_ART_AI - AI-Enhanced Art Discovery Agent")
    print("=" * 60)
    
    # Create and run AI art discovery agent
    art_ai_agent = PolaczekArtAI()
    
    try:
        dashboard_data = await art_ai_agent.run_full_discovery()
        
        print("\n📊🤖 AI-ENHANCED DISCOVERY SUMMARY:")
        stats = dashboard_data["statistics"]
        print(f"Total Files: {stats['total_files']}")
        print(f"AI Analyzed: {stats['ai_analyzed_files']}")
        print(f"Total Projects: {stats['total_projects']}")
        print(f"Categories: {stats['categories_count']}")
        print(f"AI Enabled: {stats['ai_enabled']}")
        
        print("\n📁 CATEGORIES WITH AI INSIGHTS:")
        for category, data in dashboard_data["categories"].items():
            print(f"  {category}: {data['count']} files ({data['ai_analyzed']} AI-analyzed)")
            if data['common_styles']:
                print(f"    Styles: {', '.join(data['common_styles'])}")
        
        print("\n🤖 AI INSIGHTS:")
        insights = dashboard_data["ai_insights"]
        print(f"Most Common Style: {insights['most_common_style']}")
        print(f"AI Confidence Average: {insights['ai_confidence_average']}")
        
        if insights['discovery_recommendations']:
            print("\n💡 RECOMMENDATIONS:")
            for rec in insights['discovery_recommendations']:
                print(f"  • {rec}")
            
    except KeyboardInterrupt:
        print("\n🛑 AI Discovery interrupted by user")
    except Exception as e:
        print(f"❌ Fatal error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
