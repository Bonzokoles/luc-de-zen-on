#!/usr/bin/env python3
"""
🎵 Music Control Agent - ADK Agent 2  
Sterowanie odtwarzaniem muzyki i mediów
"""

import json
import asyncio
import os
import pygame
from datetime import datetime
import logging
import random

class MusicControlAgent:
    def __init__(self):
        self.agent_id = "music_control_002"
        self.name = "Music Control Agent" 
        self.status = "ready"
        self.running = False
        
        # Stan odtwarzacza
        self.is_playing = False
        self.current_track = None
        self.volume = 0.7
        self.playlist = []
        self.current_index = 0
        
        # Inicjalizacja pygame mixer
        try:
            pygame.mixer.init()
            self.mixer_available = True
        except Exception as e:
            self.mixer_available = False
            
        # Konfiguracja logowania
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(f"ADK_{self.agent_id}")
        
        # Skanowanie muzyki
        self.music_directories = [
            "Q:\\mybonzo\\luc-de-zen-on\\public\\audio",
            "C:\\Users\\Public\\Music",
            "D:\\Music"
        ]
        
        # Biblioteki R1 i R2
        self.r1_library = {
            "path": "Q:\\ADK_AGEN_ts_zEN\\R1_LIBRARY",
            "tracks": [],
            "metadata": {}
        }
        
        self.r2_library = {
            "path": "Q:\\ADK_AGEN_ts_zEN\\R2_LIBRARY", 
            "tracks": [],
            "metadata": {}
        }
        
        # Operacje na bibliotekach
        self.library_operations = 0
        
    async def start(self):
        """Uruchomienie agenta muzycznego"""
        self.running = True
        self.status = "active"
        self.logger.info(f"🎵 {self.name} uruchomiony")
        
        # Skanowanie dostępnej muzyki
        await self.scan_music_library()
        
        # Inicjalizacja bibliotek R1 i R2
        await self.init_r_libraries()
        
        return {
            "success": True,
            "agent_id": self.agent_id,
            "status": self.status,
            "tracks_found": len(self.playlist),
            "r1_tracks": len(self.r1_library["tracks"]),
            "r2_tracks": len(self.r2_library["tracks"]),
            "mixer_available": self.mixer_available
        }
    
    async def scan_music_library(self):
        """Skanowanie biblioteki muzycznej"""
        self.playlist.clear()
        supported_formats = ['.mp3', '.wav', '.ogg', '.flac', '.m4a']
        
        for music_dir in self.music_directories:
            if os.path.exists(music_dir):
                for root, dirs, files in os.walk(music_dir):
                    for file in files:
                        if any(file.lower().endswith(fmt) for fmt in supported_formats):
                            self.playlist.append(os.path.join(root, file))
        
        self.logger.info(f"Znaleziono {len(self.playlist)} utworów muzycznych")
        
        # Jeśli nie znaleziono muzyki, użyj mock playlist
        if not self.playlist:
            self.playlist = [
                "mock_track_1.mp3",
                "mock_track_2.mp3", 
                "mock_track_3.mp3"
            ]
    
    async def init_r_libraries(self):
        """Inicjalizacja bibliotek R1 i R2"""
        try:
            # Tworzenie katalogów bibliotek jeśli nie istnieją
            for lib in [self.r1_library, self.r2_library]:
                if not os.path.exists(lib["path"]):
                    os.makedirs(lib["path"], exist_ok=True)
                    self.logger.info(f"📁 Utworzono katalog: {lib['path']}")
            
            # Skanowanie bibliotek R1 i R2
            await self.scan_r1_library()
            await self.scan_r2_library()
            
            self.logger.info(f"🎵 R1 Library: {len(self.r1_library['tracks'])} tracks")
            self.logger.info(f"🎵 R2 Library: {len(self.r2_library['tracks'])} tracks")
            
        except Exception as e:
            self.logger.error(f"Błąd inicjalizacji bibliotek R: {e}")
    
    async def scan_r1_library(self):
        """Skanowanie biblioteki R1"""
        try:
            self.r1_library["tracks"].clear()
            r1_path = self.r1_library["path"]
            
            if os.path.exists(r1_path):
                for file in os.listdir(r1_path):
                    if file.lower().endswith(('.mp3', '.wav', '.ogg', '.flac', '.m4a')):
                        track_info = {
                            "filename": file,
                            "path": os.path.join(r1_path, file),
                            "size": os.path.getsize(os.path.join(r1_path, file)),
                            "added": datetime.now().isoformat(),
                            "library": "R1"
                        }
                        self.r1_library["tracks"].append(track_info)
            
            # Mock tracks jeśli puste
            if not self.r1_library["tracks"]:
                mock_r1_tracks = [
                    {"filename": "R1_Ambient_01.mp3", "library": "R1", "mock": True},
                    {"filename": "R1_Beat_Loop_02.wav", "library": "R1", "mock": True},
                    {"filename": "R1_Synthesizer_03.ogg", "library": "R1", "mock": True}
                ]
                self.r1_library["tracks"] = mock_r1_tracks
                
        except Exception as e:
            self.logger.error(f"Błąd skanowania R1: {e}")
    
    async def scan_r2_library(self):
        """Skanowanie biblioteki R2"""
        try:
            self.r2_library["tracks"].clear()
            r2_path = self.r2_library["path"]
            
            if os.path.exists(r2_path):
                for file in os.listdir(r2_path):
                    if file.lower().endswith(('.mp3', '.wav', '.ogg', '.flac', '.m4a')):
                        track_info = {
                            "filename": file,
                            "path": os.path.join(r2_path, file),
                            "size": os.path.getsize(os.path.join(r2_path, file)),
                            "added": datetime.now().isoformat(),
                            "library": "R2"
                        }
                        self.r2_library["tracks"].append(track_info)
            
            # Mock tracks jeśli puste
            if not self.r2_library["tracks"]:
                mock_r2_tracks = [
                    {"filename": "R2_Drum_Kit_01.wav", "library": "R2", "mock": True},
                    {"filename": "R2_Bass_Line_02.mp3", "library": "R2", "mock": True}, 
                    {"filename": "R2_Vocal_Sample_03.flac", "library": "R2", "mock": True},
                    {"filename": "R2_Guitar_Riff_04.ogg", "library": "R2", "mock": True}
                ]
                self.r2_library["tracks"] = mock_r2_tracks
                
        except Exception as e:
            self.logger.error(f"Błąd skanowania R2: {e}")
    
    async def add_to_r1_library(self, file_path, metadata=None):
        """Dodanie utworu do biblioteki R1"""
        try:
            if not os.path.exists(file_path):
                return {"success": False, "error": "Plik nie istnieje"}
            
            filename = os.path.basename(file_path)
            target_path = os.path.join(self.r1_library["path"], filename)
            
            # Kopiowanie pliku do biblioteki R1 (mock)
            self.library_operations += 1
            
            track_info = {
                "filename": filename,
                "path": target_path,
                "original_path": file_path,
                "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                "added": datetime.now().isoformat(),
                "library": "R1",
                "metadata": metadata or {}
            }
            
            self.r1_library["tracks"].append(track_info)
            self.logger.info(f"➕ Dodano do R1: {filename}")
            
            return {
                "success": True,
                "action": "add_to_r1",
                "filename": filename,
                "library_size": len(self.r1_library["tracks"])
            }
            
        except Exception as e:
            self.logger.error(f"Błąd dodawania do R1: {e}")
            return {"success": False, "error": str(e)}
    
    async def add_to_r2_library(self, file_path, metadata=None):
        """Dodanie utworu do biblioteki R2"""
        try:
            if not os.path.exists(file_path):
                return {"success": False, "error": "Plik nie istnieje"}
            
            filename = os.path.basename(file_path)
            target_path = os.path.join(self.r2_library["path"], filename)
            
            # Kopiowanie pliku do biblioteki R2 (mock)
            self.library_operations += 1
            
            track_info = {
                "filename": filename,
                "path": target_path,
                "original_path": file_path,
                "size": os.path.getsize(file_path) if os.path.exists(file_path) else 0,
                "added": datetime.now().isoformat(),
                "library": "R2",
                "metadata": metadata or {}
            }
            
            self.r2_library["tracks"].append(track_info)
            self.logger.info(f"➕ Dodano do R2: {filename}")
            
            return {
                "success": True,
                "action": "add_to_r2",
                "filename": filename,
                "library_size": len(self.r2_library["tracks"])
            }
            
        except Exception as e:
            self.logger.error(f"Błąd dodawania do R2: {e}")
            return {"success": False, "error": str(e)}
    
    async def play_music(self, track_path=None):
        """Odtwarzanie muzyki"""
        try:
            if not self.mixer_available:
                return self.mock_play_response()
                
            if track_path:
                self.current_track = track_path
            elif self.playlist and not self.current_track:
                self.current_track = self.playlist[self.current_index]
            
            if self.current_track and os.path.exists(self.current_track):
                pygame.mixer.music.load(self.current_track)
                pygame.mixer.music.play()
                self.is_playing = True
                self.logger.info(f"▶️ Odtwarzanie: {os.path.basename(self.current_track)}")
            else:
                return self.mock_play_response()
                
            return {
                "success": True,
                "action": "play",
                "track": os.path.basename(self.current_track),
                "playing": self.is_playing
            }
            
        except Exception as e:
            self.logger.error(f"Błąd odtwarzania: {e}")
            return self.mock_play_response()
    
    def mock_play_response(self):
        """Mock response gdy brak prawdziwej muzyki"""
        mock_tracks = ["Synthwave Mix", "Lo-Fi Beats", "Electronic Ambient"]
        self.current_track = random.choice(mock_tracks)
        self.is_playing = True
        
        return {
            "success": True,
            "action": "play_mock",
            "track": self.current_track,
            "playing": True,
            "note": "Mock playback - brak prawdziwych plików audio"
        }
    
    async def pause_music(self):
        """Pauza muzyki"""
        if self.mixer_available and pygame.mixer.music.get_busy():
            pygame.mixer.music.pause()
        
        self.is_playing = False
        self.logger.info("⏸️ Muzyka zatrzymana")
        
        return {
            "success": True,
            "action": "pause",
            "playing": self.is_playing
        }
    
    async def resume_music(self):
        """Wznowienie muzyki"""
        if self.mixer_available:
            pygame.mixer.music.unpause()
        
        self.is_playing = True
        self.logger.info("▶️ Muzyka wznowiona")
        
        return {
            "success": True,
            "action": "resume", 
            "playing": self.is_playing
        }
    
    async def next_track(self):
        """Następny utwór"""
        if self.playlist:
            self.current_index = (self.current_index + 1) % len(self.playlist)
            return await self.play_music()
        else:
            return self.mock_play_response()
    
    async def previous_track(self):
        """Poprzedni utwór"""
        if self.playlist:
            self.current_index = (self.current_index - 1) % len(self.playlist)
            return await self.play_music()
        else:
            return self.mock_play_response()
    
    async def set_volume(self, volume_level):
        """Ustawienie głośności (0.0 - 1.0)"""
        self.volume = max(0.0, min(1.0, volume_level))
        
        if self.mixer_available:
            pygame.mixer.music.set_volume(self.volume)
        
        self.logger.info(f"🔊 Głośność: {int(self.volume * 100)}%")
        
        return {
            "success": True,
            "action": "volume",
            "volume": self.volume,
            "volume_percent": int(self.volume * 100)
        }
    
    async def get_playlist(self):
        """Pobranie listy utworów"""
        return {
            "playlist": [os.path.basename(track) for track in self.playlist],
            "current_index": self.current_index,
            "total_tracks": len(self.playlist)
        }
    
    async def get_r1_library(self):
        """Pobranie biblioteki R1"""
        return {
            "library": "R1",
            "path": self.r1_library["path"],
            "tracks": self.r1_library["tracks"],
            "count": len(self.r1_library["tracks"]),
            "total_size_mb": sum(track.get("size", 0) for track in self.r1_library["tracks"]) / (1024*1024)
        }
    
    async def get_r2_library(self):
        """Pobranie biblioteki R2"""
        return {
            "library": "R2", 
            "path": self.r2_library["path"],
            "tracks": self.r2_library["tracks"],
            "count": len(self.r2_library["tracks"]),
            "total_size_mb": sum(track.get("size", 0) for track in self.r2_library["tracks"]) / (1024*1024)
        }
    
    async def search_r_libraries(self, query):
        """Wyszukiwanie w bibliotekach R1 i R2"""
        results = {
            "query": query,
            "r1_matches": [],
            "r2_matches": []
        }
        
        # Wyszukiwanie w R1
        for track in self.r1_library["tracks"]:
            if query.lower() in track["filename"].lower():
                results["r1_matches"].append(track)
        
        # Wyszukiwanie w R2
        for track in self.r2_library["tracks"]:
            if query.lower() in track["filename"].lower():
                results["r2_matches"].append(track)
        
        results["total_matches"] = len(results["r1_matches"]) + len(results["r2_matches"])
        return results
    
    async def play_from_r1(self, track_name):
        """Odtwarzanie z biblioteki R1"""
        for track in self.r1_library["tracks"]:
            if track["filename"] == track_name:
                if track.get("mock"):
                    return {
                        "success": True,
                        "action": "play_r1_mock",
                        "track": track_name,
                        "library": "R1",
                        "note": "Mock playback - R1 library"
                    }
                else:
                    return await self.play_music(track["path"])
        
        return {"success": False, "error": f"Utwór {track_name} nie znaleziony w R1"}
    
    async def play_from_r2(self, track_name):
        """Odtwarzanie z biblioteki R2"""
        for track in self.r2_library["tracks"]:
            if track["filename"] == track_name:
                if track.get("mock"):
                    return {
                        "success": True,
                        "action": "play_r2_mock",
                        "track": track_name,
                        "library": "R2",
                        "note": "Mock playback - R2 library"
                    }
                else:
                    return await self.play_music(track["path"])
        
        return {"success": False, "error": f"Utwór {track_name} nie znaleziony w R2"}
    
    async def get_status(self):
        """API endpoint - status agenta"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status,
            "running": self.running,
            "is_playing": self.is_playing,
            "current_track": os.path.basename(self.current_track) if self.current_track else None,
            "volume": self.volume,
            "playlist_size": len(self.playlist),
            "r1_library_size": len(self.r1_library["tracks"]),
            "r2_library_size": len(self.r2_library["tracks"]),
            "library_operations": self.library_operations,
            "mixer_available": self.mixer_available,
            "timestamp": datetime.now().isoformat()
        }
    
    async def stop(self):
        """Zatrzymanie agenta"""
        self.running = False
        self.status = "stopped"
        
        if self.mixer_available and pygame.mixer.music.get_busy():
            pygame.mixer.music.stop()
        
        self.logger.info(f"🛑 {self.name} zatrzymany")
        return {"success": True, "message": "Agent zatrzymany"}

# API dla panelu kontrolnego
async def api_test():
    """Test API agenta muzycznego z bibliotekami R1/R2"""
    agent = MusicControlAgent()
    await agent.start()
    
    # Krótki test funkcjonalności
    await agent.play_music()
    await asyncio.sleep(0.5)
    await agent.set_volume(0.5)
    
    # Test bibliotek R1 i R2
    r1_lib = await agent.get_r1_library()
    r2_lib = await agent.get_r2_library()
    search_results = await agent.search_r_libraries("test")
    
    status = await agent.get_status()
    await agent.stop()
    
    return {
        "agent_status": status,
        "r1_library": r1_lib,
        "r2_library": r2_lib,
        "search_test": search_results
    }

if __name__ == "__main__":
    # Uruchomienie agenta jako standalone
    agent = MusicControlAgent()
    
    async def main():
        await agent.start()
        
        # Test komend
        print("Testowanie agenta muzycznego...")
        await agent.play_music()
        await asyncio.sleep(2)
        await agent.pause_music()
        
        try:
            while agent.running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            await agent.stop()
    
    asyncio.run(main())