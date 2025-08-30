Poniżej znajduje się zestaw gotowych skryptów do wdrożenia modelu „Bielik” na DigitalOcean, uruchomienia mikroserwisu AI, automatyzacji deployu oraz integracji z Cloudflare i frontendem Astro.

1. Plik serwera FastAPI – server.py
python
from fastapi import FastAPI, Request
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

app = FastAPI()

tokenizer = AutoTokenizer.from_pretrained("./models/bielik-7b")
model = AutoModelForCausalLM.from_pretrained("./models/bielik-7b").to('cuda')

@app.post("/api")
async def run_model(request: Request):
    data = await request.json()
    prompt = data.get("prompt", "")

    inputs = tokenizer(prompt, return_tensors="pt").to('cuda')
    outputs = model.generate(**inputs, max_length=512)

    response_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"result": response_text}
2. Skrypt startowy – start.sh
bash
#!/bin/bash
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000
Nadaj prawa wykonania:

bash
chmod +x start.sh
3. Dockerfile (opcjonalnie, jeśli chcesz używać Dockera)
text
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
4. Plik requirements.txt
text
fastapi
uvicorn
transformers
torch
accelerate
huggingface_hub
5. Skrypt do pobrania modelu z Hugging Face – download_model.py
python
from huggingface_hub import snapshot_download

snapshot_download(repo_id="ścieżka-do-modelu-bielik-7b", cache_dir="./models/bielik-7b")
Uruchom w środowisku Python:

bash
python3 download_model.py
6. Skrypt testowy mikroserwisu – test.js
js
const fetch = require('node-fetch')

async function testModel() {
  const response = await fetch('http://IP_SERWERA:8000/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt: 'Test pytania do modelu Bielik' }),
  })
  const data = await response.json()
  console.log('Odpowiedź modelu:', data)
}

testModel()
Uruchom:

bash
node test.js
7. Skrypt CI/CD dla GitHub Actions – .github/workflows/deploy.yml
text
name: Deploy Bielik Model

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up Python and dependencies
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'

      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt

      - name: Copy files to server and restart service
        uses: appleboy/scp-action@v0.1.2
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          source: "."
          target: "/home/${{ secrets.VPS_USER }}/bielik"

      - name: Restart Bielik service on server via SSH
        uses: appleboy/ssh-action@v0.1.7
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/${{ secrets.VPS_USER }}/bielik
            pkill -f "uvicorn server:app"
            nohup ./start.sh > bielik.log 2>&1 &
8. Plik API Astro – src/pages/api/ai.js
js
export async function post({ request }) {
  const authHeader = request.headers.get('Authorization')
  const VALID_TOKEN = 'twoj-sekretny-token'

  if (authHeader !== `Bearer ${VALID_TOKEN}`) {
    return {
      status: 401,
      body: JSON.stringify({ error: 'Unauthorized' }),
      headers: { 'Content-Type': 'application/json' }
    }
  }

  const body = await request.json()
  const apiUrl = 'http://IP_SERWERA:8000/api'

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  return {
    status: response.status,
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  }
}
Uwagi końcowe
Zamień w skryptach IP_SERWERA na adres Twojego dropleta DigitalOcean.

Ustaw wartości tokenów i kluczy w bezpiecznych zmiennych środowiskowych GitHub i Cloudflare.

Monitoruj zużycie zasobów, logi i odpowiedzi API.

Chętnie pomogę w kolejnych elementach integracji oraz zabezpieczeń.