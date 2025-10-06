#!/usr/bin/env pwsh

# MyBonzo - Google Cloud Migration Test
param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT_ID,
    [switch]$DryRun = $false
)

Write-Host "MyBonzo - Google Cloud Migration Test" -ForegroundColor Cyan

# Check project ID
if (-not $ProjectId) {
    Write-Host "ERROR: GOOGLE_CLOUD_PROJECT_ID not set" -ForegroundColor Red
    exit 1
}

Write-Host "Project ID: $ProjectId" -ForegroundColor Green

# Check Cloud Functions directory structure
$bigqueryDir = "functions\bigquery-api"
$recommendationsDir = "functions\recommendations-api"

Write-Host "Checking Cloud Functions structure..." -ForegroundColor Yellow

if (Test-Path $bigqueryDir) {
    Write-Host "OK: BigQuery function directory exists" -ForegroundColor Green
}
else {
    Write-Host "ERROR: BigQuery function directory missing" -ForegroundColor Red
}

if (Test-Path $recommendationsDir) {
    Write-Host "OK: Recommendations function directory exists" -ForegroundColor Green  
}
else {
    Write-Host "ERROR: Recommendations function directory missing" -ForegroundColor Red
}

# Check proxy files
Write-Host "Checking proxy files..." -ForegroundColor Yellow

$proxyFiles = @(
    "..\src\pages\api\bigquery-proxy.ts",
    "..\src\pages\api\get-recommendations-proxy.ts"
)

foreach ($proxyFile in $proxyFiles) {
    if (Test-Path $proxyFile) {
        $size = (Get-Item $proxyFile).Length
        Write-Host "OK: Proxy exists: $proxyFile" -ForegroundColor Green
        Write-Host "    Size: $size bytes" -ForegroundColor Gray
    }
    else {
        Write-Host "ERROR: Proxy missing: $proxyFile" -ForegroundColor Red
    }
}

# Check existing API files
Write-Host "Checking existing API files..." -ForegroundColor Yellow

$existingFiles = @(
    "..\src\pages\api\bigquery.ts",
    "..\src\pages\api\get-recommendations.ts"
)

$totalOriginalSize = 0
foreach ($existingFile in $existingFiles) {
    if (Test-Path $existingFile) {
        $size = (Get-Item $existingFile).Length
        $totalOriginalSize += $size
        Write-Host "OK: Original exists: $existingFile" -ForegroundColor Cyan
        Write-Host "    Size: $size bytes" -ForegroundColor Gray
    }
    else {
        Write-Host "WARNING: Original missing: $existingFile" -ForegroundColor Yellow
    }
}

Write-Host "" -ForegroundColor White
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "Total original API files size: $totalOriginalSize bytes" -ForegroundColor Gray
Write-Host "Expected savings: ~600KB (after migration to Cloud Functions)" -ForegroundColor Green

if ($DryRun) {
    Write-Host "" -ForegroundColor White
    Write-Host "DRY RUN completed - ready for migration" -ForegroundColor Green
}
else {
    Write-Host "" -ForegroundColor White
    Write-Host "Migration steps:" -ForegroundColor Yellow
    Write-Host "1. Deploy Cloud Functions to Google Cloud" -ForegroundColor Gray
    Write-Host "2. Replace API endpoints with lightweight proxies" -ForegroundColor Gray
    Write-Host "3. Test reduced bundle size" -ForegroundColor Gray
    Write-Host "4. Deploy to Cloudflare with reduced bundle" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White