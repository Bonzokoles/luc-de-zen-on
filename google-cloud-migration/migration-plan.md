# Plan Migracji API do Google Cloud Functions

## Największe pliki do przeniesienia (łącznie ~1.2MB)

### 1. BigQuery API (338KB) - PRIORYTET 1
- **Obecny endpoint**: `/api/bigquery.astro`
- **Google Cloud**: Cloud Function + BigQuery natywnie
- **Korzyści**: Bezpośrednia integracja, szybsza wydajność
- **Free Tier**: BigQuery 1TB/miesiąc za darmo

### 2. Recommendations API (273KB) - PRIORYTET 2  
- **Obecny endpoint**: `/api/get-recommendations.astro`
- **Google Cloud**: Cloud Function + Firestore/BigQuery
- **Korzyści**: ML recommendations w Google Cloud AI

### 3. OpenRouter API (15KB) - PRIORYTET 3
- **Obecny endpoint**: `/api/ai-models/openrouter.astro`
- **Google Cloud**: Cloud Function jako proxy
- **Korzyści**: Lepsze cachowanie, rate limiting

### 4. MySecrets API (15KB) - PRIORYTET 4
- **Obecny endpoint**: `/api/my-secrets.astro`
- **Google Cloud**: Cloud Function + Secret Manager
- **Korzyści**: Natywne bezpieczeństwo Google

## Google Cloud Free Tier Limity
- Cloud Functions: 2M wywołań/miesiąc
- Cloud Run: 2M requests/miesiąc  
- BigQuery: 1TB query/miesiąc
- Firestore: 1GB storage + 50k reads/writes dziennie
- Secret Manager: 6 active secrets za darmo

## Plan implementacji

### Krok 1: Przygotowanie środowiska
1. Konfiguracja Google Cloud SDK
2. Utworzenie projektów Cloud Functions
3. Konfiguracja IAM i Service Accounts

### Krok 2: Migracja BigQuery API
1. Cloud Function dla `/api/bigquery`
2. Przekierowanie ruchu przez proxy
3. Test wydajności

### Krok 3: Migracja pozostałych
1. Recommendations API → Cloud Function
2. OpenRouter proxy → Cloud Function  
3. Secrets management → Secret Manager

### Krok 4: Optymalizacja Cloudflare
1. Usunięcie dużych API z bundle
2. Proxy calls do Google Cloud
3. Zmniejszenie bundle do <20MB

## Przewidywane oszczędności rozmiaru
- BigQuery API: -338KB
- Recommendations: -273KB  
- OpenRouter: -15KB
- MySecrets: -15KB
**Łącznie: ~641KB oszczędności**

## Koszty
- **0 PLN/miesiąc** - wszystko mieści się w Free Tier
- BigQuery: 1TB zapytań/miesiąc za darmo
- Cloud Functions: 2M wywołań/miesiąc za darmo