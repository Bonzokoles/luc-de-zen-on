Poniżej masz gotowe szablony konfiguracji Prometheus, przykładowy plik alertów oraz prosty skrypt do fine-tuningu modelu AI (na przykładzie Hugging Face i modelu transformers).

***

## 1. Szablon konfiguracji Prometheus (prometheus.yml)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'agent_app'
    static_configs:
      - targets: ['localhost:9100']  # endpoint metryk Twojego agenta

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - 'alertmanager:9093'

rule_files:
  - 'alert_rules.yml'
```

***

## 2. Przykładowe reguły alertów Prometheus (alert_rules.yml)

```yaml
groups:
  - name: Agent Alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{job="agent_app",status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Błąd 5xx > 5% w ostatnich 5 minutach"
          description: "Więcej niż 5% zapytań do agenta kończy się błędem 5xx."

      - alert: HighLatency
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket{job="agent_app"}[5m])) > 0.5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "95-percentyl opóźnienia przekracza 500ms"
          description: "Czas odpowiedzi agenta przekracza 0,5 sekundy w 95% przypadków."
```

***

## 3. Przykładowy prosty skrypt do fine-tuningu modelu językowego (Transformers, Python)

```python
from transformers import AutoModelForCausalLM, AutoTokenizer, Trainer, TrainingArguments, TextDataset, DataCollatorForLanguageModeling

# Model bazowy i tokenizer
model_name = "gpt2"
model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Przygotuj dataset treningowy - plik tekstowy z domenowym tekstem
def load_dataset(file_path, tokenizer, block_size=128):
    dataset = TextDataset(
        tokenizer=tokenizer,
        file_path=file_path,
        block_size=block_size
    )
    return dataset

train_dataset = load_dataset("dane_treningowe.txt", tokenizer)

# Collator do MLM (tu dla causal LM można pominąć)
data_collator = DataCollatorForLanguageModeling(tokenizer=tokenizer, mlm=False)

# Parametry treningu
training_args = TrainingArguments(
    output_dir="./model_finetuned",
    overwrite_output_dir=True,
    num_train_epochs=3,
    per_device_train_batch_size=4,
    save_steps=500,
    save_total_limit=2,
    logging_steps=100,
)

# Tworzymy trenera
trainer = Trainer(
    model=model,
    args=training_args,
    data_collator=data_collator,
    train_dataset=train_dataset,
)

# Fine-tuning
trainer.train()

# Zapis modelu
trainer.save_model("./model_finetuned")
tokenizer.save_pretrained("./model_finetuned")
```

***

## Wskazówki

- W `prometheus.yml` ustaw właściwy adres i port eksportera metryk w Twojej aplikacji.
- W alertach dopasuj progi np. procent błędów lub czasy odpowiedzi do wymagań SLA.
- Do fine-tuningu przygotuj czysty tekst domenowy (np. dialogi, dokumentację, FAQ).
- Skrypt jest na bazie Hugging Face transformers, można to rozszerzyć o inne tryby trenowania i integracje.
- Dla większej skali stosuj trening na GPU (np. AWS/GCP, lokalne GPU).

Następne instrukcje w AGNT_5.md