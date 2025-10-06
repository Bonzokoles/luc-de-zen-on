# MyBonzo BigQuery API - Google Cloud Function

## Opis
Cloud Function obsługująca BigQuery API dla systemu MyBonzo. Zastępuje endpoint `src/pages/api/bigquery.astro` (338KB) w celu zmniejszenia rozmiaru bundla Cloudflare.

## Funkcjonalności
- ✅ Pre-defined safe queries (overview, performance, users, feedback)
- ✅ Custom queries z security validation
- ✅ CORS support dla cross-origin requests
- ✅ Rate limiting i query complexity limits
- ✅ Health check endpoint
- ✅ EU region (europe-west1) dla GDPR compliance

## Deployment

### 1. Setup Google Cloud Project
```bash
# Set project ID
gcloud config set project YOUR_PROJECT_ID

# Enable required APIs
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable bigquery.googleapis.com
```

### 2. Deploy Function
```bash
cd google-cloud-migration/functions/bigquery-api
npm install
npm run deploy
```

### 3. Test Function
```bash
# Health check
curl https://europe-west1-YOUR_PROJECT_ID.cloudfunctions.net/mybonzo-bigquery-api/health

# Overview query
curl "https://europe-west1-YOUR_PROJECT_ID.cloudfunctions.net/mybonzo-bigquery-api?type=overview"
```

## Integracja z MyBonzo

### 1. Update w src/pages/api/bigquery.astro
```javascript
// Redirect to Cloud Function
export async function GET({ request }) {
  const url = new URL(request.url);
  const cloudFunctionUrl = `https://europe-west1-${import.meta.env.GOOGLE_CLOUD_PROJECT_ID}.cloudfunctions.net/mybonzo-bigquery-api${url.search}`;
  
  return Response.redirect(cloudFunctionUrl, 302);
}
```

### 2. Update client-side calls
```javascript
// Before
const response = await fetch('/api/bigquery?type=overview');

// After  
const response = await fetch(`https://europe-west1-${PROJECT_ID}.cloudfunctions.net/mybonzo-bigquery-api?type=overview`);
```

## Bezpieczeństwo
- ✅ SQL injection protection
- ✅ Query length limits (2000 chars)
- ✅ Result limits (1000 rows)
- ✅ Byte processing limits (10MB)
- ✅ Timeout limits (30-60s)
- ✅ Only SELECT operations allowed

## Monitoring
- Function logs: `gcloud functions logs read mybonzo-bigquery-api`
- Metrics: Google Cloud Console > Cloud Functions
- BigQuery usage: Google Cloud Console > BigQuery

## Size Impact
- **Przed**: bigquery.astro.mjs = 338KB w Cloudflare bundle
- **Po**: Redirect endpoint = ~2KB w Cloudflare bundle
- **Oszczędność**: ~336KB (największy impact z wszystkich API)

## Free Tier Limits
- Cloud Functions: 2M wywołań/miesiąc
- BigQuery: 1TB przetwarzania/miesiąc
- Current usage: ~10K wywołań/miesiąc (daleko poniżej limitu)