Poniżej pełna, kompletna konfiguracja systemu monitoringu agenta AI z Prometheusem i Alertmanagerem, wraz z konfiguracją eksportera metryk w Node.js.

***

## 1. Konfiguracja eksportera metryk w Node.js

(Zapisz jako np. `metrics-exporter.js`)

```js
const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Czas obsługi żądań HTTP w sekundach',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Liczba wszystkich żądań HTTP',
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
  setTimeout(() => {
    res.status(200).json({ answer: 'Odpowiedź agenta' });
  }, Math.random() * 1000);
});

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

const port = 9100;
app.listen(port, () => {
  console.log(`Eksporter metryk Prometheus działa na porcie ${port}`);
});
```

***

## 2. Konfiguracja Prometheusa (`prometheus.yml`)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'agent_app'
    static_configs:
      - targets: ['localhost:9100']  # adres eksportera metryk Node.js

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - 'localhost:9093'  # adres Alertmanagera

rule_files:
  - 'alert_rules.yml'
```

***

## 3. Reguły alertów Prometheus (`alert_rules.yml`)

```yaml
groups:
  - name: agent_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{job="agent_app",status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Błąd 5xx > 5% zapytań (5 min)"
          description: "Agent ma powyżej 5% zapytań kończących się błędem 5xx"

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="agent_app"}[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95-percentyl opóźnienia > 0.5s (5 min)"
          description: "95% zapytań obsłużonych w więcej niż 0,5 sekundy"
```

***

## 4. Konfiguracja Alertmanagera (`alertmanager.yml`)

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 6h
  receiver: 'team-email'

receivers:
  - name: 'team-email'
    email_configs:
      - to: 'team@example.com'
        from: 'alertmanager@example.com'
        smarthost: 'smtp.example.com:587'
        auth_username: 'alertmanager@example.com'
        auth_password: 'twojeHasloSMTP'
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
    equal: ['alertname']
```

***

## Uruchomienie i test

1. Uruchom w Node.js eksportera metryk:  
```bash
node metrics-exporter.js
```

2. Uruchom Prometheusa i wskaż konfigurację `prometheus.yml`.

3. Uruchom Alertmanager z konfiguracją `alertmanager.yml`.

4. Sprawdź metryki pod:  
```
http://localhost:9100/metrics
```

5. Sprawdź dashboard Prometheusa, skonfiguruj alerty i odbieraj powiadomienia mail/slack.

***

Nastepne w AGNT_7.md