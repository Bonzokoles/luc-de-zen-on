#!/usr/bin/env python3
"""
🎤 Voice Command Agent - ADK Agent 1
Obsługuje polecenia głosowe i sterowanie aplikacjami
"""

import json
import asyncio
import time
from datetime import datetime
import speech_recognition as sr
import pyttsx3
import threading
import logging

class VoiceCommandAgent:
    def __init__(self):
        self.agent_id = "voice_command_001"
        self.name = "Voice Command Agent"
        self.status = "ready"
        self.commands_processed = 0
        self.last_command = None
        self.running = False
        
        # Inicjalizacja TTS i STT
        self.tts_engine = pyttsx3.init()
        self.recognizer = sr.Recognizer()
        self.microphone = sr.Microphone()
        
        # Konfiguracja logowania
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(f"ADK_{self.agent_id}")
        
        # Słownik komend
        self.voice_commands = {
            "otwórz muzykę": self.open_music,
            "uruchom panel": self.open_panel,
            "sprawdź system": self.check_system,
            "zamknij aplikację": self.close_app,
            "status agentów": self.check_agents_status,
            "synchronizuj adk": self.sync_adk,
            "raport bezpieczeństwa": self.security_report,
            "test mikrofonu": self.microphone_test
        }
    
    async def start(self):
        """Uruchomienie agenta głosowego"""
        self.running = True
        self.status = "active"
        self.logger.info(f"🎤 {self.name} uruchomiony - nasłuchuję poleceń...")
        
        # Uruchom nasłuchiwanie w osobnym wątku
        listen_thread = threading.Thread(target=self.listen_continuously)
        listen_thread.daemon = True
        listen_thread.start()
        
        return {
            "success": True,
            "agent_id": self.agent_id,
            "status": self.status,
            "message": "Agent głosowy aktywny"
        }
    
    def listen_continuously(self):
        """Ciągłe nasłuchiwanie komend głosowych"""
        with self.microphone as source:
            self.recognizer.adjust_for_ambient_noise(source)
        
        while self.running:
            try:
                with self.microphone as source:
                    audio = self.recognizer.listen(source, timeout=1, phrase_time_limit=5)
                
                try:
                    command = self.recognizer.recognize_google(audio, language='pl-PL').lower()
                    asyncio.run(self.process_voice_command(command))
                except sr.UnknownValueError:
                    pass  # Nie rozpoznano komendy
                except sr.RequestError as e:
                    self.logger.error(f"Błąd rozpoznawania mowy: {e}")
                    
            except sr.WaitTimeoutError:
                pass  # Timeout - kontynuuj nasłuchiwanie
            except Exception as e:
                self.logger.error(f"Błąd nasłuchiwania: {e}")
                time.sleep(1)
    
    async def process_voice_command(self, command):
        """Przetwarzanie rozpoznanej komendy głosowej"""
        self.logger.info(f"Rozpoznano komendę: '{command}'")
        self.last_command = command
        self.commands_processed += 1
        
        # Znajdź najbliższą komendę
        for cmd_key, cmd_func in self.voice_commands.items():
            if cmd_key in command:
                result = await cmd_func()
                self.speak(f"Wykonano: {cmd_key}")
                return result
        
        # Jeśli nie znaleziono komendy
        self.speak("Nie rozpoznano komendy")
        return {"success": False, "message": "Nieznana komenda"}
    
    def speak(self, text):
        """Wypowiedzenie tekstu przez TTS"""
        try:
            self.tts_engine.say(text)
            self.tts_engine.runAndWait()
        except Exception as e:
            self.logger.error(f"Błąd TTS: {e}")
    
    # Implementacja komend głosowych
    async def open_music(self):
        return {"action": "open_music", "message": "Otwieranie aplikacji muzycznej"}
    
    async def open_panel(self):
        return {"action": "open_panel", "message": "Otwieranie panelu kontrolnego"}
    
    async def check_system(self):
        return {"action": "system_check", "message": "Sprawdzanie stanu systemu"}
    
    async def close_app(self):
        return {"action": "close_app", "message": "Zamykanie aplikacji"}
    
    async def check_agents_status(self):
        return {"action": "agents_status", "message": "Sprawdzanie statusu agentów"}
    
    async def sync_adk(self):
        return {"action": "sync_adk", "message": "Synchronizacja ADK w toku"}
    
    async def security_report(self):
        return {"action": "security_report", "message": "Generowanie raportu bezpieczeństwa"}
    
    async def microphone_test(self):
        self.speak("Test mikrofonu - słyszysz mnie wyraźnie?")
        return {"action": "mic_test", "message": "Test mikrofonu wykonany"}
    
    async def get_status(self):
        """API endpoint - pobierz status agenta"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "status": self.status,
            "running": self.running,
            "commands_processed": self.commands_processed,
            "last_command": self.last_command,
            "timestamp": datetime.now().isoformat()
        }
    
    async def stop(self):
        """Zatrzymanie agenta"""
        self.running = False
        self.status = "stopped"
        self.logger.info(f"🛑 {self.name} zatrzymany")
        return {"success": True, "message": "Agent zatrzymany"}

# API dla panelu kontrolnego
async def api_test():
    """Test API agenta głosowego"""
    agent = VoiceCommandAgent()
    await agent.start()
    await asyncio.sleep(1)  # Krótki test
    status = await agent.get_status()
    await agent.stop()
    return status

if __name__ == "__main__":
    # Uruchomienie agenta jako standalone
    agent = VoiceCommandAgent()
    
    async def main():
        await agent.start()
        
        try:
            while agent.running:
                await asyncio.sleep(1)
        except KeyboardInterrupt:
            await agent.stop()
    
    asyncio.run(main())