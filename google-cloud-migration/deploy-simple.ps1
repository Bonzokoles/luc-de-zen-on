#!/usr/bin/env pwsh

# MyBonzo - Simple Google Cloud Functions Deployment
param(
    [string]$ProjectId = "zenon-project-467918"
)

Write-Host "Deploying Google Cloud Functions for MyBonzo" -ForegroundColor Cyan

# Check gcloud
try {
    $version = gcloud version --format="value(gcloud.version)" 2>$null
    Write-Host "✅ Google Cloud CLI: $version" -ForegroundColor Green
}
catch {
    Write-Host "❌ Google Cloud CLI not found" -ForegroundColor Red
    exit 1
}

# Set project
Write-Host "📋 Setting project: $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Enable APIs
Write-Host "🔧 Enabling Cloud Functions API..." -ForegroundColor Yellow
gcloud services enable cloudfunctions.googleapis.com --quiet

# Deploy BigQuery API function
Write-Host "📦 Deploying BigQuery API function..." -ForegroundColor Yellow
Set-Location "functions/bigquery-api"
gcloud functions deploy mybonzo-bigquery-api `
    --runtime nodejs18 `
    --trigger-http `
    --allow-unauthenticated `
    --memory 256MB `
    --timeout 60s `
    --region europe-west1 `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ BigQuery API deployed successfully" -ForegroundColor Green
    $bigqueryUrl = "https://europe-west1-$ProjectId.cloudfunctions.net/mybonzo-bigquery-api"
    Write-Host "   URL: $bigqueryUrl" -ForegroundColor Gray
}
else {
    Write-Host "❌ BigQuery API deployment failed" -ForegroundColor Red
}

# Deploy Recommendations API function
Write-Host "📦 Deploying Recommendations API function..." -ForegroundColor Yellow
Set-Location "..\recommendations-api"
gcloud functions deploy mybonzo-recommendations-api `
    --runtime nodejs18 `
    --trigger-http `
    --allow-unauthenticated `
    --memory 512MB `
    --timeout 60s `
    --region europe-west1 `
    --quiet

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Recommendations API deployed successfully" -ForegroundColor Green
    $recommendationsUrl = "https://europe-west1-$ProjectId.cloudfunctions.net/mybonzo-recommendations-api"
    Write-Host "   URL: $recommendationsUrl" -ForegroundColor Gray
}
else {
    Write-Host "❌ Recommendations API deployment failed" -ForegroundColor Red
}

# Return to original directory
Set-Location ".."

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Add these URLs to Cloudflare Pages Environment Variables:" -ForegroundColor Gray
Write-Host "   GCP_BIGQUERY_URL = $bigqueryUrl" -ForegroundColor White
Write-Host "   GCP_RECOMMENDATIONS_URL = $recommendationsUrl" -ForegroundColor White
Write-Host "   GCP_FUNCTION_TOKEN = your_secure_token" -ForegroundColor White
Write-Host ""
Write-Host "2. Activate proxy endpoints in Astro" -ForegroundColor Gray
Write-Host "3. Test the integration" -ForegroundColor Gray
Write-Host ""
Write-Host "Deployment completed!" -ForegroundColor Green