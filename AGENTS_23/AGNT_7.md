Oto gotowa, dopasowana do Twojej strony www.mybonzo.com konfiguracja eksportera metryk, Prometheusa i Alertmanagera z uwzględnieniem wdrożenia na Cloudflare Tunnel.  

***

## 1. Eksporter metryk Prometheus dla agenta AI (Node.js)

```js
// metrics-exporter.js

const express = require('express');
const client = require('prom-client');

const app = express();
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestDuration = new client.Histogram({
  name: 'mybonzo_http_request_duration_seconds',
  help: 'Czas obsługi żądań HTTP w sekundach - MyBonzo Agent',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 2, 5],
});
const httpRequestsTotal = new client.Counter({
  name: 'mybonzo_http_requests_total',
  help: 'Liczba żądań HTTP - MyBonzo Agent',
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
    res.status(200).json({ answer: 'MyBonzo AI Agent odpowiada!' });
  }, Math.random() * 500); // symulacja opóźnienia do 0.5s
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
  console.log(`MyBonzo Prometheus exporter działa na porcie ${port}`);
});
```

***

## 2. Konfiguracja Prometheusa (prometheus.yml)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'mybonzo_agent'
    static_configs:
      - targets: ['localhost:9100']

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - 'localhost:9093'  # Alertmanager host, dostosuj do środowiska
rule_files:
  - 'alert_rules.yml'
```

***

## 3. Reguły alertów Prometheusa (alert_rules.yml)

```yaml
groups:
  - name: mybonzo_agent_alerts
    rules:
      - alert: MyBonzoHighErrorRate
        expr: rate(mybonzo_http_requests_total{status_code=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "MyBonzo AI Agent - Błędy 5xx przekraczają 5%"
          description: "Więcej niż 5% zapytań zwraca błąd 5xx w ciągu 5 minut"

      - alert: MyBonzoHighLatency
        expr: histogram_quantile(0.95, rate(mybonzo_http_request_duration_seconds_bucket[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "MyBonzo AI Agent - 95-percentyl opóźnienia > 0.5s"
          description: "95% odpowiedzi zajmuje więcej niż 0,5 sekundy."
```

***

## 4. Konfiguracja Alertmanagera (alertmanager.yml)

```yaml
global:
  resolve_timeout: 5m

route:
  group_by: ['alertname', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 6h
  receiver: 'mybonzo-team-email'

receivers:
  - name: 'mybonzo-team-email'
    email_configs:
      - to: 'team@mybonzo.com'
        from: 'alertmanager@mybonzo.com'
        smarthost: 'smtp.mybonzo.com:587'
        auth_username: 'alertmanager@mybonzo.com'
        auth_password: 'TwojeBezpieczneHasloSMTP'
        send_resolved: true

  - name: 'mybonzo-slack'
    slack_configs:
      - api_url: 'https://hooks.slack.com/services/xxx/yyy/zzz'
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

## 5. Deployment na Cloudflare (przykład uruchomienia tunelu)

```bash
cloudflared tunnel --url http://localhost:9100 --hostname metrics.mybonzo.com
```

- Ustaw `metrics.mybonzo.com` jako subdomenę Cloudflare dla bezpiecznego dostępu z zewnątrz.
- Tak samo możesz wystawić endpoint `/agent` pod tunel i chronić go JWT lub BasicAuth.

***

## Podsumowanie

- Eksporter metryk monitoruje działanie Twojego agenta AI i udostępnia dane Prometheusowi.
- Prometheus zbiera te metryki i generuje alerty według ustalonych reguł.
- Alertmanager wysyła powiadomienia e-mail, Slack i inne do zespołu MyBonzo.
- Cloudflare Tunnel pozwala na bezpieczne i proste wystawienie usługi na zewnątrz pod domeną Twojej strony www.mybonzo.com.

NASTEPNE w AGNT_8.md