Oto kompleksowy scenariusz wdrożenia i integracji systemu agentów AI MyBonzo, łączącego dashboard, orchestrator, monitoring oraz CI/CD.

***

## Scenariusz wdrożenia systemu agentów AI MyBonzo

### Etap 1: Przygotowanie środowiska

1. **Przygotuj serwery i usługi potrzebne do wdrożenia:**  
   - Maszyna z systemem Linux (lokalna lub chmurowa)  
   - Zainstaluj Docker i Docker Compose  
   - Uruchom usługę RabbitMQ (może być w kontenerze)  
   - Przygotuj bazę danych (MongoDB Atlas lub lokalna) jeśli potrzebujesz trwałego zapisu danych  

2. **Skonfiguruj klucze SSH i dostęp do serwera**, dodaj je do GitHub Secrets (dla automatyzacji):

   - `STAGING_SSH_KEY`, `STAGING_HOST`, `STAGING_USER`  
   - `PROD_SSH_KEY`, `PROD_HOST`, `PROD_USER`  
   - Dodatkowo zmienne dla usług chmurowych i haseł  

***

### Etap 2: Budowa i testowanie komponentów lokalnie

1. **Skopiuj lub stwórz repozytorium** z podziałem na usługi:  
   - `api-server` – API do dashboardu  
   - `orchestrator` – zarządzanie zadaniami agentów  
   - `metrics-exporter` – eksport metryk Prometheus  
   - `docker-compose.yml` – ogólny stack z RabbitMQ, serwisami  

2. **Uruchom lokalnie** wszystko przez Docker Compose:  
   ```
   docker-compose up --build
   ```
3. **Przetestuj działanie lokalne:**  
   - Endpointy API: `http://localhost:4000/api/mybonzo/agents/status`  
   - Dashboard lokalnie (może jako lokalna aplikacja Astro + React)  
   - Sprawdź połączenia RabbitMQ w logach  
   - Zbadaj metryki pod `http://localhost:9100/metrics`  

***

### Etap 3: Deployment na staging

1. **Skonfiguruj plik `docker-compose.staging.yml`** z adresami i ustawieniami dla testowego środowiska

2. **Załaduj obrazy i uruchom serwisy** za pomocą GitHub Actions lub ręcznie przez SSH:  
   ```
   ssh user@staging-server
   docker-compose -f docker-compose.staging.yml pull
   docker-compose -f docker-compose.staging.yml up -d --remove-orphans
   ```
3. **Sprawdź działanie na staging:**  
   - Dashboards, API i metryki  
   - Monitorowanie logów i RabbitMQ  
   - Testy end-to-end (automatyczne lub manualne)  

***

### Etap 4: Integracja monitoringu

1. **Skonfiguruj Prometheusa**, aby zbierał metryki z eksportera `/metrics` na staging i produkcji.

2. **Urgent alerty:** przetestuj reguły alertów Prometheusa w pliku `alert_rules.yml`.

3. **Skonfiguruj Alertmanager** z powiadomieniami email, Slack, etc.

4. **Ustaw dashboard Grafana** dla monitoringu agentów, ładowane z JSONów.

***

### Etap 5: Deployment produkcyjny

1. **Po zatwierdzeniu na staging** przez team deployment produkcyjny powinien być dokonany przez manualne zatwierdzenie w pipeline CI/CD.

2. **Automatycznie zaktualizuj Prometheusa i Alertmanagera** na produkcji do nowych wersji usług.

3. **Monitoruj bacznie pierwsze godziny działania** – logi, metryki, alerty.

4. **Zapewnij możliwość szybkiego rollbacku** poprzez wersjonowane obrazy Docker.

***

### Etap 6: Utrzymanie i rozwój

- **Cykliczne aktualizacje funkcji agentów i orchestratora** z testami regresji.
- **Analiza logów i metryk** w celu optymalizacji czasu reakcji i poprawności działania.
- **Rozszerzanie dashboardu** o nowe widgety i raporty.
- **Dodanie automatycznych testów integracyjnych oraz load testów** w pipeline.
- **Rozbudowa komunikacji agentów** w systemie event-driven z kolejkowaniem.

***

## Jak sprawdzać i testować?

- Użyj **curl/Postman** do testowania endpointów API (statusy agentów, aktualizacja).
- Sprawdzaj dashboard Grafana na metryki i alerty.
- Monitoruj logi Docker (`docker-compose logs`) i RabbitMQ panel (http://localhost:15672).
- Użyj testów automatycznych (np. Jest/e2e testing).
- Symuluj awarie i sprawdzaj działanie alertów oraz rollbacków.

***

## Podsumowanie

1. **Przygotuj i przetestuj lokalnie pełny system.**  
2. **Wdróż na środowisko staging, przeprowadź pełne testy.**  
3. **Skonfiguruj monitorowanie i alerty.**  
4. **Zdeployuj na produkcję z manualną akceptacją w CI/CD.**  
5. **Regularnie analizuj dane i rozwijaj system.**

Nastepnie idz do AGENT_0.md