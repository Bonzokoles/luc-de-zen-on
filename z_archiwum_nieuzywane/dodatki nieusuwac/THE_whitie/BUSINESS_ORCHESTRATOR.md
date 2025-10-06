BUSINESS_ORCHESTRATOR – Architektura i zakres endpointów
1. routeTask /api/business-orchestrator/route-task
Funkcja:
Przyjmuje dowolne zadanie/komendę (np. od użytkownika, systemu, agenta)
Analizuje komendę (np. przez model Bielik)
Tworzy plan workflow: wybór agentów, rozdzielenie sub-zadań, ustalenie kolejności, zależności
Przekazuje zadania do wskazanych agentów (np. crm-agent, bigquery-agent, vertexai-agent itd.)
Zbiera wyniki od agentów, agreguje, zwraca całościową odpowiedź
Zakres:
Parametry wejściowe: { command: string, context?: object, data?: object }
Wyjście: { success: true, agentResponses: [], plan: {} }
Obsługa błędów: zwrot błędów związanych z routingiem, dostępnością agentów, interpretacją polecenia
Logowanie przebiegu orkiestracji (audit trail)
2. aggregateStatus /api/business-orchestrator/aggregate-status
Funkcja:
Odpytuje status wszystkich agentów (np. test, health, busy/idle, wersja)
Zbiera, agreguje, normalizuje statusy w jednym miejscu
Umożliwia globalny monitoring systemu agentowego (np. panel statusów, alerty)
Zakres:
Parametry wejściowe: brak / { filter?: string }
Wyjście: { statuses: [ {agent: string, status: string, details: object}, ... ] }
Obsługa błędów: agent niedostępny, timeout, niepoprawny status
Integracja z UI dashboard
3. decision /api/business-orchestrator/decision
Funkcja:
Podejmuje decyzje biznesowe/systemowe na podstawie danych z agentów
Może używać modelu Bielik (LLM) do analizy, rekomendacji, generowania odpowiedzi
Przykład: rekomendacja działania, wybór optymalnej ścieżki, automatyczne podjęcie akcji
Zakres:
Parametry wejściowe: { inputs: object, context?: object }
Wyjście: { decision: object/string, explanation?: string }
Obsługa błędów: niepoprawne dane, brak wystarczającego kontekstu
Audyt i logika decyzyjna (do analizy)
4. audit /api/business-orchestrator/audit
Funkcja:
Zwraca logi działań orchestratora (systemu agentowego)
Pozwala śledzić historię zadań, workflow, decyzji, błędów, połączeń agentów
Umożliwia monitoring bezpieczeństwa, zgodności, wydajności
Zakres:
Parametry wejściowe: { filter?: string, range?: string, agent?: string }
Wyjście: { logs: [ {timestamp, agent, action, status, details}, ... ] }
Obsługa błędów: brak logów, niepoprawny filtr, niedostępność danych
Integracja z UI panel audit/logs
Podsumowanie:
routeTask: Orkiestracja zadań – centrum przepływu poleceń, integracja wszystkich agentów, workflow
aggregateStatus: Monitoring systemu – zbiorczy stan agentów, szybka diagnostyka
decision: Decyzje biznesowe/systemowe – automatyzacja, rekomendacje, AI-driven actions
audit: Audyt – pełna historia działań, bezpieczeństwo, raportowanie
Każdy endpoint posiada jasny zakres, typowe parametry wejściowe/wyjściowe, obsługę błędów oraz potencjał do rozwoju (np. integracja z UI, automatyczne akcje, logika AI, panel administracyjny).