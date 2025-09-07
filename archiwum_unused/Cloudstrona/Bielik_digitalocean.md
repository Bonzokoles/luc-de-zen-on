Wdrożenie modelu „Bielik” na DigitalOcean – krok po kroku
1. Utworzenie i konfiguracja dropletu (serwera)
Zaloguj się do panelu DigitalOcean.

Jeśli chcesz, utwórz nowy projekt lub użyj istniejącego.

Utwórz nowy droplet:

Wybierz obraz systemu: Ubuntu 22.04 (LTS).

Wybierz plan z GPU (np. z GPU NVIDIA, jeśli dostępny w DigitalOcean — jeśli nie, rozważ inną platformę lub VPS z GPU).

Wybierz region najbliższy Twojej lokalizacji.

Skonfiguruj klucze SSH, aby bezpiecznie łączyć się z serwerem.

Stwórz droplet i zapisz jego adres IP.

2. Połączenie z serwerem przez SSH
bash
ssh root@IP_SERWERA
3. Instalacja podstawowego oprogramowania
bash
apt update && apt upgrade -y
apt install python3 python3-pip git -y
Jeśli potrzebujesz Dockera:

bash
apt install docker.io -y
systemctl start docker
systemctl enable docker
4. Konfiguracja środowiska Python
bash
pip3 install virtualenv
virtualenv venv
source venv/bin/activate
pip install fastapi uvicorn transformers accelerate torch --upgrade
5. Pobranie i przygotowanie modelu Bielik
Pobierz model 7B najnowszą dostępną wersję z Hugging Face:

bash
pip install huggingface_hub
python3 -c "
from huggingface_hub import snapshot_download
snapshot_download('ścieżka/do/modelu-bielik-7b', cache_dir='./models/bielik-7b')
"
Lub pobierz manualnie pliki i umieść je w folderze ./models/bielik-7b.

6. Przygotowanie i uruchomienie serwera FastAPI (plik: server.py)
Wgraj plik server.py (z wcześniejszej instrukcji) na serwer (np. przez scp):

bash
scp server.py root@IP_SERWERA:/root/
Uruchom serwis:

bash
uvicorn server:app --host 0.0.0.0 --port 8000
7. Testowanie działania mikroserwisu
Na serwerze lub lokalnie spróbuj:

bash
curl -X POST http://IP_SERWERA:8000/api -H "Content-Type: application/json" -d '{"prompt":"Witaj, świecie"}'
8. Automatyzacja uruchomienia (opcjonalnie)
Utwórz plik start.sh:

bash
#!/bin/bash
source venv/bin/activate
uvicorn server:app --host 0.0.0.0 --port 8000
Nadaj prawa i uruchom:

bash
chmod +x start.sh
./start.sh
9. Połączenie z Cloudflare Workers i frontendem
W Cloudflare Workers przygotuj proxy do http://IP_SERWERA:8000/api (zgodnie z wcześniejszymi wskazówkami).

W Astro frontendzie wywołuj API zabezpieczone tokenem.

Całość działa jako bezpieczna, skalowalna warstwa AI.

