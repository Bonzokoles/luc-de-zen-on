Poniżej gotowe szablony eksportera metryk Prometheus, konfiguracji Prometheusa, Alertmanagera i przykładowej integracji CI/CD z dopiskiem, że należy je dostosować wizualnie i stylistycznie do Twojej strony www.mybonzo.com. Dołączam też szkielet pipeline CI/CD dla GitHub Actions.

***

# UWAGA  
Szablony wymagają **dostosowania stylu, logotypów, kolorystyki, nazw i adresów** do layoutu i stylu Twojej strony www.mybonzo.com oraz środowiska produkcyjnego.

***

## 1. Eksporter metryk Prometheus - Node.js (plik: `metrics-exporter.js`)

```js
// UWAGA: dostosuj style logów i odpowiedzi HTTP pod styl MyBonzo

const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'mybonzo_http_request_duration_seconds',
  help: 'Obsługa HTTP w MyBonzo AI Agent',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
const httpRequestsTotal = new client.Counter({
  name: 'mybonzo_http_requests_total',
  help: 'Liczba zapytań HTTP w MyBonzo AI Agent',
  labelNames: ['method', 'route', 'status_code'],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({
    method: req.method,
    route: req.path,
  });

  res.on('finish', () => {
    end({ status_code: res.statusCode });
    httpRequestsTotal.inc({ method: req.method, route: req.path, status_code: res.statusCode });
  });

  next();
});

app.post('/agent', (req, res) => {
  // Tutaj logika agenta AI, można dodać stylizację odpowiedzi JSON
  setTimeout(() => {
    res.status(200).json({ answer: 'MyBonzo AI Agent - odpowiedź gotowa!' });
  }, Math.random() * 500);
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 9100;
app.listen(PORT, () => {
  console.log(`MyBonzo Prometheus exporter działa na porcie ${PORT}`);
});
```

***

## 2. Prometheus config - `prometheus.yml`

```yaml
# UWAGA! Dostosuj adresy i job_name do swojego środowiska MyBonzo

global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'mybonzo_agent'
    static_configs:
      - targets: ['localhost:9100'] # Adres node.js eksportera

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - 'localhost:9093'  # Adres alertmanagera, zmień na środowiskowy

rule_files:
  - 'alert_rules.yml'
```

***

## 3. Reguły alertów Prometheus - `alert_rules.yml`

```yaml
groups:
  - name: mybonzo_alerts
    rules:
      - alert: MyBonzoHighErrorRate
        expr: rate(mybonzo_http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Błędów 5xx > 5% - MyBonzo AI Agent"
          description: "Więcej niż 5% zapytań zwraca błąd serwera (5xx) w ciągu 5 minut."

      - alert: MyBonzoHighLatency
        expr: histogram_quantile(0.95, rate(mybonzo_http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95-percentyl czasów > 0.5s - MyBonzo AI Agent"
          description: "Czas odpowiedzi w 95% przypadków przekracza 0,5 sekundy."
```

***

## 4. Alertmanager config - `alertmanager.yml`

```yaml
# UWAGA: Dostosuj parametry powiadomień (SMTP, Slack, mail) do MyBonzo i firmowej infrastruktury

global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 6h
  receiver: 'mybonzo_email'

receivers:
  - name: 'mybonzo_email'
    email_configs:
      - to: 'team@mybonzo.com'
        from: 'alertmanager@mybonzo.com'
        smarthost: 'smtp.mybonzo.com:587'
        auth_username: 'alertmanager@mybonzo.com'
        auth_password: 'TwojeBezpieczneHasloSMTP'
        send_resolved: true

  - name: 'mybonzo_slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#mybonzo-alerts'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname']
```

***

## 5. Przykładowa integracja CI/CD z GitHub Actions (`.github/workflows/ci-cd.yml`)

```yaml
name: MyBonzo AI Agent CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repo
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

      - name: Build docker image
        run: docker build -t mybonzo/agent:latest .

      - name: Login to DockerHub
        uses: docker/login-action@v2
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Push Docker image
        run: docker push mybonzo/agent:latest

  deploy-staging:
    runs-on: ubuntu-latest
    needs: build-and-test
    environment: staging

    steps:
      - name: SSH and deploy to staging server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            docker pull mybonzo/agent:latest
            docker-compose -f docker-compose.staging.yml up -d

  deploy-production:
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment: production

    steps:
      - name: Await manual approval
        uses: peter-evans/manual-approval@v2
        with:
          reviewers: 'admin1,admin2'

      - name: SSH and deploy to production server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            docker pull mybonzo/agent:latest
            docker-compose -f docker-compose.prod.yml up -d
```

***

# Podsumowanie  
- **Dostosuj style w Node.js i zgodność nazw metryk pod MyBonzo** dla spójności wizualnej i brandingowej.  
- **W konfiguracjach Prometheus i Alertmanagera** uwzględnij adresację i poświadczenia odpowiednie dla środowiska produkcyjnego MyBonzo.  
- W CI/CD pipeline zapewnij **bezpieczne przechowywanie sekretów** w GitHub Secrets i możliwość manualnej akceptacji wdrożeń produkcyjnych.  

następne w AGNT_9.md