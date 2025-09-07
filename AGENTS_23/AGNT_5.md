Poniżej masz gotowe, proste szablony do:

1. Eksportera metryk Prometheus w Node.js (np. dla agenta AI),
2. Konfiguracji Alertmanagera do obsługi alertów i ich powiadomień.

***

## 1. Szablon eksportera metryk Prometheus w Node.js

Zainstaluj najpierw bibliotekę:

```bash
npm install prom-client
```

### Przykład serwera z eksportem metryk

```js
const express = require('express');
const client = require('prom-client');

const app = express();

// Ustawiamy rejestr globalny
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Definicja metryk
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Czas obsługi żądań HTTP w sekundach',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
register.registerMetric(httpRequestDuration);

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Liczba wszystkich żądań HTTP',
  labelNames: ['method', 'route', 'status_code'],
});
register.registerMetric(httpRequestsTotal);

// Middleware do mierzenia czasu i liczenia żądań
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

// Przykładowy endpoint agenta
app.post('/agent', (req, res) => {
  // symulacja opóźnienia i odpowiedzi
  setTimeout(() => {
    res.status(200).json({ answer: 'Odpowiedź agenta' });
  }, Math.random() * 1000);
});

// Endpoint z metrykami dla Prometheus
app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

app.listen(9100, () => {
  console.log('Eksporter metryk Prometheus działa na porcie 9100');
});
```

***

## 2. Przykładowa konfiguracja Alertmanagera (alertmanager.yml)

```yaml
global:
  resolve_timeout: 5m
  smtp_smarthost: 'smtp.example.com:587'
  smtp_from: 'alertmanager@example.com'
  smtp_auth_username: 'alertmanager@example.com'
  smtp_auth_password: 'TwojeHasloSMTP'

route:
  receiver: 'team-email'
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 6h

receivers:
  - name: 'team-email'
    email_configs:
      - to: 'team@example.com'
        send_resolved: true

  - name: 'slack-notifications'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/XXX/YYY/ZZZ'
        channel: '#alerts'
        send_resolved: true

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname', 'dev', 'instance']
```

***

## Objaśnienia

- W Node.js eksporcie, endpoint `/metrics` udostępnia promieniowanie do Prometheusa.
- Metryki `http_request_duration_seconds` mierzy czas obsługi każdego zapytania HTTP.
- `http_requests_total` liczy sumę zapytań według metody, trasy i kodu statusu.
- Alertmanager wysyła powiadomienia emailem i Slackiem, dla zespołu podanych w konfiguracji.
- Można rozbudować o webhooki, SMS, Microsoft Teams, itp.

***

następne w AGNT_6.md
