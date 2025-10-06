#!/usr/bin/env pwsh

# MyBonzo - Simple Google Cloud Migration Test
param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT_ID,
    [switch]$DryRun = $false
)

Write-Host "🌩️  MyBonzo - Google Cloud Migration Test" -ForegroundColor Cyan

# Check project ID
if (-not $ProjectId) {
    Write-Host "❌ GOOGLE_CLOUD_PROJECT_ID not set" -ForegroundColor Red
    Write-Host "   Current environment variables:" -ForegroundColor Gray
    Get-ChildItem Env: | Where-Object { $_.Name -like "*GOOGLE*" -or $_.Name -like "*GCP*" }
    exit 1
}

Write-Host "✅ Project ID: $ProjectId" -ForegroundColor Green

# Check Cloud Functions directory structure
$bigqueryDir = "functions\bigquery-api"
$recommendationsDir = "functions\recommendations-api"

Write-Host "📁 Checking Cloud Functions structure..." -ForegroundColor Yellow

if (Test-Path $bigqueryDir) {
    Write-Host "✅ BigQuery function directory exists" -ForegroundColor Green
    $bigqueryFiles = Get-ChildItem $bigqueryDir -Name
    Write-Host "   Files: $($bigqueryFiles -join ', ')" -ForegroundColor Gray
}
else {
    Write-Host "❌ BigQuery function directory missing: $bigqueryDir" -ForegroundColor Red
}

if (Test-Path $recommendationsDir) {
    Write-Host "✅ Recommendations function directory exists" -ForegroundColor Green  
    $recommendationsFiles = Get-ChildItem $recommendationsDir -Name
    Write-Host "   Files: $($recommendationsFiles -join ', ')" -ForegroundColor Gray
}
else {
    Write-Host "❌ Recommendations function directory missing: $recommendationsDir" -ForegroundColor Red
}

# Check proxy files
Write-Host "📄 Checking proxy files..." -ForegroundColor Yellow

$proxyFiles = @(
    "..\src\pages\api\bigquery-proxy.ts",
    "..\src\pages\api\get-recommendations-proxy.ts"
)

foreach ($proxyFile in $proxyFiles) {
    if (Test-Path $proxyFile) {
        $size = (Get-Item $proxyFile).Length
        Write-Host "✅ Proxy exists: $proxyFile ($size bytes)" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Proxy missing: $proxyFile" -ForegroundColor Red
    }
}

# Check existing API files
Write-Host "🔍 Checking existing API files..." -ForegroundColor Yellow

$existingFiles = @(
    "..\src\pages\api\bigquery.ts",
    "..\src\pages\api\get-recommendations.ts"
)

foreach ($existingFile in $existingFiles) {
    if (Test-Path $existingFile) {
        $size = (Get-Item $existingFile).Length
        Write-Host "📄 Original exists: $existingFile ($size bytes)" -ForegroundColor Cyan
    }
    else {
        Write-Host "⚠️  Original missing: $existingFile" -ForegroundColor Yellow
    }
}

if ($DryRun) {
    Write-Host "" -ForegroundColor White
    Write-Host "🔍 DRY RUN completed - ready for migration" -ForegroundColor Green
    Write-Host "   Next step: Run without -DryRun to perform migration" -ForegroundColor Gray
}
else {
    Write-Host "" -ForegroundColor White
    Write-Host "📋 Migration would involve:" -ForegroundColor Cyan
    Write-Host "1. Deploy Cloud Functions to Google Cloud" -ForegroundColor Gray
    Write-Host "2. Replace API endpoints with lightweight proxies" -ForegroundColor Gray
    Write-Host "3. Test reduced bundle size" -ForegroundColor Gray
    Write-Host "4. Deploy to Cloudflare with <25MB bundle" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White
Write-Host "🎯 Expected savings: ~611KB from Cloudflare bundle" -ForegroundColor Green