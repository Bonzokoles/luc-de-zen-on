#!/usr/bin/env python3
"""
✨ Gemini Pro Agent - Advanced Language Model
Agent 1 z Google ADK Suite - Zaawansowany model językowy
"""

import json
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any
from google.adk.agents import Agent

class GeminiProAgent:
    def __init__(self):
        self.agent_id = "gemini_pro_001"
        self.name = "Gemini Pro Agent"
        self.model = "gemini-2.0-flash-exp"
        self.status = "ready"
        self.category = "core"
        self.icon = "✨"
        self.color = "#1be1ff"
        self.priority = "HIGH"
        
        # Konfiguracja ADK
        self.adk_agent = Agent(
            name="gemini_pro_advanced",
            model=self.model,
            description="Zaawansowany asystent AI oparty na Gemini Pro",
            instruction="""Jesteś zaawansowanym asystentem AI Gemini Pro.
            Specjalizujesz się w:
            - Złożonych zadaniach językowych
            - Analizie i generowaniu tekstu
            - Rozumowaniu logicznym
            - Pomocy w problemach technicznych
            - Kreatywnym pisaniu
            
            Zawsze odpowiadaj w języku polskim, chyba że użytkownik specjalnie poprosi o inny język.
            Bądź precyzyjny, pomocny i profesjonalny.""",
            tools=[
                self.text_analysis,
                self.code_explanation,
                self.creative_writing,
                self.logical_reasoning,
                self.technical_help
            ]
        )
        
        # Konfiguracja logowania
        logging.basicConfig(level=logging.INFO)
        self.logger = logging.getLogger(f"ADK_{self.agent_id}")
        
        # Historia konwersacji
        self.conversation_history = []
        self.performance_metrics = {
            "requests_processed": 0,
            "avg_response_time": 0.0,
            "success_rate": 0.0
        }
        
    def text_analysis(self, text: str) -> dict:
        """Analizuje tekst pod kątem sentymentu, tematyki i struktury"""
        try:
            # Symulacja analizy tekstu
            word_count = len(text.split())
            char_count = len(text)
            
            # Podstawowa analiza sentymentu
            positive_words = ['dobry', 'świetny', 'wspaniały', 'pozytywny', 'sukces']
            negative_words = ['zły', 'kiepski', 'negatywny', 'problem', 'błąd']
            
            positive_score = sum(1 for word in positive_words if word.lower() in text.lower())
            negative_score = sum(1 for word in negative_words if word.lower() in text.lower())
            
            if positive_score > negative_score:
                sentiment = "pozytywny"
            elif negative_score > positive_score:
                sentiment = "negatywny"
            else:
                sentiment = "neutralny"
                
            return {
                "status": "success",
                "analysis": {
                    "word_count": word_count,
                    "char_count": char_count,
                    "sentiment": sentiment,
                    "positive_indicators": positive_score,
                    "negative_indicators": negative_score
                }
            }
        except Exception as e:
            return {"status": "error", "error_message": str(e)}
    
    def code_explanation(self, code: str, language: str = "python") -> dict:
        """Wyjaśnia kod i jego funkcjonalność"""
        try:
            lines_count = len(code.split('\n'))
            
            # Podstawowa analiza kodu
            analysis = {
                "language": language,
                "lines_count": lines_count,
                "complexity": "średnia" if lines_count > 10 else "niska",
                "explanation": f"Kod zawiera {lines_count} linii w języku {language}."
            }
            
            # Identyfikacja elementów kodu
            if 'def ' in code:
                analysis["contains_functions"] = True
            if 'class ' in code:
                analysis["contains_classes"] = True
            if 'import ' in code:
                analysis["has_imports"] = True
                
            return {"status": "success", "analysis": analysis}
        except Exception as e:
            return {"status": "error", "error_message": str(e)}
    
    def creative_writing(self, topic: str, style: str = "creative") -> dict:
        """Generuje kreatywny tekst na zadany temat"""
        try:
            prompt_templates = {
                "creative": f"Napisz kreatywny tekst na temat: {topic}",
                "technical": f"Przygotuj techniczny opis dla: {topic}",
                "storytelling": f"Opowiedz historię związaną z: {topic}"
            }
            
            prompt = prompt_templates.get(style, prompt_templates["creative"])
            
            return {
                "status": "success",
                "content": {
                    "topic": topic,
                    "style": style,
                    "prompt": prompt,
                    "generated": f"[Gemini Pro wygenerowałby tutaj kreatywny tekst na temat: {topic} w stylu: {style}]"
                }
            }
        except Exception as e:
            return {"status": "error", "error_message": str(e)}
    
    def logical_reasoning(self, problem: str) -> dict:
        """Rozwiązuje problemy logiczne krok po kroku"""
        try:
            steps = [
                "1. Analiza problemu",
                "2. Identyfikacja kluczowych elementów", 
                "3. Zastosowanie logiki",
                "4. Weryfikacja rozwiązania"
            ]
            
            return {
                "status": "success",
                "reasoning": {
                    "problem": problem,
                    "steps": steps,
                    "approach": "systematyczne rozwiązywanie problemów",
                    "solution": f"[Gemini Pro przeprowadziłby tutaj logiczną analizę problemu: {problem}]"
                }
            }
        except Exception as e:
            return {"status": "error", "error_message": str(e)}
    
    def technical_help(self, question: str, domain: str = "general") -> dict:
        """Udziela pomocy technicznej w różnych dziedzinach"""
        try:
            domains = {
                "programming": "programowanie",
                "web_dev": "rozwój stron internetowych",
                "ai_ml": "sztuczna inteligencja i uczenie maszynowe",
                "general": "ogólne zagadnienia techniczne"
            }
            
            domain_name = domains.get(domain, "ogólne zagadnienia techniczne")
            
            return {
                "status": "success",
                "help": {
                    "question": question,
                    "domain": domain_name,
                    "response": f"[Gemini Pro udzieliłby tutaj szczegółowej pomocy technicznej dla: {question} w dziedzinie: {domain_name}]",
                    "resources": ["dokumentacja", "przykłady kodu", "best practices"]
                }
            }
        except Exception as e:
            return {"status": "error", "error_message": str(e)}
    
    async def process_message(self, message: str) -> Dict[str, Any]:
        """Przetwarza wiadomość przez Gemini Pro"""
        start_time = datetime.now()
        
        try:
            self.logger.info(f"📝 Przetwarzanie wiadomości: {message[:50]}...")
            
            # Dodanie do historii
            self.conversation_history.append({
                "timestamp": start_time.isoformat(),
                "type": "input",
                "content": message
            })
            
            # Symulacja odpowiedzi Gemini Pro
            response = f"[Gemini Pro]: Analizuję Twoje zapytanie: '{message}' i przygotowuję szczegółową odpowiedź..."
            
            # Aktualizacja metryki
            end_time = datetime.now()
            response_time = (end_time - start_time).total_seconds()
            
            prev_total = self.performance_metrics["requests_processed"]
            prev_avg = self.performance_metrics["avg_response_time"]
            prev_success_rate = self.performance_metrics["success_rate"]

            new_total = prev_total + 1
            self.performance_metrics["requests_processed"] = new_total
            self.performance_metrics["avg_response_time"] = (
                prev_avg + (response_time - prev_avg) / new_total
            )
            self.performance_metrics["success_rate"] = (
                prev_success_rate + (1.0 - prev_success_rate) / new_total
            )
            
            # Dodanie odpowiedzi do historii
            self.conversation_history.append({
                "timestamp": end_time.isoformat(),
                "type": "output",
                "content": response,
                "response_time": response_time
            })
            
            return {
                "status": "success",
                "response": response,
                "metadata": {
                    "agent": self.name,
                    "model": self.model,
                    "response_time": response_time,
                    "timestamp": end_time.isoformat()
                }
            }
            
        except Exception as e:
            failure_time = datetime.now()
            response_time = (failure_time - start_time).total_seconds()

            prev_total = self.performance_metrics["requests_processed"]
            prev_avg = self.performance_metrics["avg_response_time"]
            prev_success_rate = self.performance_metrics["success_rate"]

            new_total = prev_total + 1
            self.performance_metrics["requests_processed"] = new_total
            self.performance_metrics["avg_response_time"] = (
                prev_avg + (response_time - prev_avg) / new_total
            )
            self.performance_metrics["success_rate"] = (
                prev_success_rate + (0.0 - prev_success_rate) / new_total
            )

            self.conversation_history.append({
                "timestamp": failure_time.isoformat(),
                "type": "error",
                "content": str(e),
                "response_time": response_time
            })

            self.logger.error(f"❌ Błąd przetwarzania: {str(e)}")
            return {"status": "error", "error_message": str(e)}
    
    async def get_status(self) -> Dict[str, Any]:
        """Zwraca status agenta"""
        return {
            "agent_id": self.agent_id,
            "name": self.name,
            "model": self.model,
            "status": self.status,
            "category": self.category,
            "icon": self.icon,
            "color": self.color,
            "priority": self.priority,
            "performance": self.performance_metrics,
            "conversation_count": len(self.conversation_history),
            "capabilities": [
                "Analiza tekstu",
                "Wyjaśnianie kodu", 
                "Kreatywne pisanie",
                "Rozumowanie logiczne",
                "Pomoc techniczna"
            ]
        }
    
    async def reset(self):
        """Resetuje agenta do stanu początkowego"""
        self.conversation_history.clear()
        self.performance_metrics = {
            "requests_processed": 0,
            "avg_response_time": 0.0,
            "success_rate": 0.0
        }
        self.status = "ready"
        self.logger.info("🔄 Agent zresetowany")

if __name__ == "__main__":
    # Test agenta
    async def test_gemini_pro():
        agent = GeminiProAgent()
        print("🧪 Test Gemini Pro Agent")
        
        # Test analizy tekstu
        result = agent.text_analysis("To jest świetny projekt! Bardzo mi się podoba.")
        print(f"✅ Analiza tekstu: {result}")
        
        # Test pomocy technicznej
        result = agent.technical_help("Jak zoptymalizować bazę danych?", "general")
        print(f"✅ Pomoc techniczna: {result}")
        
        # Test przetwarzania wiadomości
        result = await agent.process_message("Wyjaśnij mi jak działa sztuczna inteligencja")
        print(f"✅ Odpowiedź agenta: {result}")
        
        # Status agenta
        status = await agent.get_status()
        print(f"📊 Status: {status}")
    
    asyncio.run(test_gemini_pro())