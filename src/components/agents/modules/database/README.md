# 🗄️ Agent 06 - Database Query

## 📋 Opis
Zaawansowany agent do wykonywania zapytań SQL i NoSQL z wizualizacją wyników.

## ⚡ Funkcjonalności
- Połączenia z wieloma bazami danych (MySQL, PostgreSQL, MongoDB, SQLite)
- Wykonywanie zapytań SQL/NoSQL
- Wizualizacja wyników w tabeli
- Export danych do CSV/JSON
- Historia zapytań
- Podstawowa optymalizacja query

## 🔧 Endpointy API
- `POST /api/agents/agent-06/execute` - Wykonaj zapytanie
- `GET /api/agents/agent-06/connections` - Lista połączeń  
- `POST /api/agents/agent-06/connect` - Nawiąż połączenie
- `GET /api/agents/agent-06/history` - Historia zapytań

## 🎯 Wykorzystanie
- Analiza danych
- Debugging aplikacji  
- Generowanie raportów
- Migration scripts
- Data exploration

## 📊 Status: 🚧 W BUDOWIE
- Implementacja podstawowych funkcji
- Bezpieczne wykonywanie zapytań
- UI dla query builder
