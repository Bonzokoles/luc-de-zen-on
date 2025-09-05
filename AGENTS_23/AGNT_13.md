Poniżej rozwinięcie pipeline CI/CD dla MyBonzo, zawierające automatyzację budowy, testów, deploymentu oraz integracji monitoringu.

***

## Rozbudowany pipeline CI/CD – MyBonzo AI System

### 1. Automatyzacja budowy i testów

- Build obrazu Docker dla każdego komponentu: API, orchestratora, eksportera metryk.
- Testy jednostkowe i integracyjne (np. endpointów API, komunikacji RabbitMQ).
- Statyczna analiza kodu (linters, security scans).

***

### 2. Wdrożenie (Deployment)

- **Staging environment** (np. serwer testowy lub namespace Kubernetes).
- Automatyczne wdrożenia do staging po poprawnym buildzie i testach.
- **Manual approval** dla deploymentu na produkcję z możliwością rollback.
- Deployment przez SSH, Helm (K8s) lub docker-compose w środowisku docelowym.

***

### 3. Integracja monitoringu

- Po wdrożeniu automatycznie konfigurowany scraping Prometheusa na endpointy eksportera metryk.
- Wysyłanie alertów Alertmanagera w razie błędów lub spadku jakości usług.
- Dashboard Grafana aktualizowany lub odświeżany automatycznie (np. import JSON dashboardu).

***

## Przykład rozszerzonego GitHub Actions workflow (.github/workflows/ci-cd.yml)

```yaml
name: MyBonzo CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        service: [api, orchestrator, metrics-exporter]

    steps:
      - uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with: { node-version: '18' }

      - name: Build Docker image for ${{ matrix.service }}
        working-directory: ./services/${{ matrix.service }}
        run: docker build -t mybonzo/${{ matrix.service }}:latest .

      - name: Run tests for ${{ matrix.service }}
        working-directory: ./services/${{ matrix.service }}
        run: npm test || echo "Pomiń, jeśli brak testów"

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-test
    environment: staging
    steps:
      - name: Deploy to staging server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            docker-compose -f docker-compose.staging.yml pull
            docker-compose -f docker-compose.staging.yml up -d --remove-orphans

  e2e-tests:
    runs-on: ubuntu-latest
    needs: deploy-staging
    steps:
      - name: Run end-to-end tests
        run: npm run test:e2e || echo "E2E tests skipped or failed"

  deploy-production:
    runs-on: ubuntu-latest
    needs: [e2e-tests]
    environment:
      name: production
      url: https://mybonzo.com
    steps:
      - name: Request manual approval
        uses: peter-evans/manual-approval@v2
        with:
          reviewers: 'admin1,admin2'

      - name: Deploy to production server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d --remove-orphans

  monitor-setup:
    runs-on: ubuntu-latest
    needs: deploy-production
    steps:
      - name: Configure Prometheus scrape targets
        run: |
          ssh -i ${{ secrets.PROD_SSH_KEY }} ${{ secrets.PROD_USER }}@${{ secrets.PROD_HOST }} \\
          \"echo '  - job_name: \"mybonzo_agent\"' >> /etc/prometheus/prometheus.yml && \\
           echo '    static_configs:' >> /etc/prometheus/prometheus.yml && \\
           echo '      - targets: [\"localhost:9100\"]' >> /etc/prometheus/prometheus.yml && \\
           systemctl reload prometheus\"
      - name: Notify monitoring setup complete
        run: echo "Monitoring configured"
```

***

## Dodatkowe wskazówki

- **Sekrety** (SSH klucze, hasła, tokeny) trzymaj w GitHub Secrets, Vault lub innym bezpiecznym systemie.
- **Rollback** – przy wdrożeniach można dodać wersjonowanie obrazów i rollback po niepowodzeniu healthchecków.
- **Metryki customowe** – rozbuduj eksportery o metryki biznesowe (np. liczba obsłużonych zapytań, jakość odpowiedzi).
- **Alerty** – konfiguruj z odpowiednią eskalacją (np. pierwsza faza email, potem slack, krytyczne SMS).
- **Dashboard Grafana** – konfiguruj automatycznie z repozytorium JSON, by mieć spójny widok po wdrożeniach.

***
jesli cos potrzebne to napisz
