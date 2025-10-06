#!/usr/bin/env pwsh

# MyBonzo - Google Cloud Functions Deployment Script
# Deploys all API endpoints to Google Cloud to reduce Cloudflare bundle size

param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT_ID,
    [switch]$DryRun = $false,
    [switch]$SkipBuild = $false
)

Write-Host "🚀 MyBonzo - Google Cloud Functions Deployment" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

if (-not $ProjectId) {
    Write-Host "❌ GOOGLE_CLOUD_PROJECT_ID not set" -ForegroundColor Red
    Write-Host "   Set with: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Gray
    exit 1
}

# Check gcloud CLI
try {
    $gcloudVersion = gcloud version --format="value(gcloud.version)" 2>$null
    Write-Host "✅ Google Cloud CLI: $gcloudVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Google Cloud CLI not found" -ForegroundColor Red
    Write-Host "   Install from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Gray
    exit 1
}

# Set project
Write-Host "🎯 Setting project: $ProjectId" -ForegroundColor Blue
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "🔧 Enabling required Google Cloud APIs..." -ForegroundColor Yellow
$apis = @(
    "cloudfunctions.googleapis.com",
    "bigquery.googleapis.com", 
    "firestore.googleapis.com",
    "storage.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "  Enabling $api..." -ForegroundColor Gray
    if (-not $DryRun) {
        gcloud services enable $api --quiet
    }
}

# Define functions to deploy
$functions = @(
    @{
        Name         = "mybonzo-bigquery-api"
        Directory    = "google-cloud-migration\functions\bigquery-api"
        Target       = "mybonzoBigQuery"
        Memory       = "256MB"
        Description  = "BigQuery API proxy (saves 338KB)"
        OriginalSize = "338KB"
    },
    @{
        Name         = "mybonzo-recommendations-api"
        Directory    = "google-cloud-migration\functions\recommendations-api"
        Target       = "mybonzoRecommendations"
        Memory       = "512MB"
        Description  = "AI Recommendations API (saves 273KB)"
        OriginalSize = "273KB"
    }
)

$totalSavings = 0
$deployedFunctions = @()

# Deploy each function
foreach ($func in $functions) {
    Write-Host "" -ForegroundColor White
    Write-Host "📦 Deploying: $($func.Name)" -ForegroundColor Cyan
    Write-Host "   Directory: $($func.Directory)" -ForegroundColor Gray
    Write-Host "   Memory: $($func.Memory)" -ForegroundColor Gray
    Write-Host "   Savings: $($func.OriginalSize)" -ForegroundColor Green

    $functionPath = Join-Path $PSScriptRoot $func.Directory
    
    if (-not (Test-Path $functionPath)) {
        Write-Host "❌ Function directory not found: $functionPath" -ForegroundColor Red
        continue
    }

    # Install dependencies
    if (-not $SkipBuild) {
        Write-Host "   📥 Installing dependencies..." -ForegroundColor Gray
        Push-Location $functionPath
        
        if (-not $DryRun) {
            npm install --production --silent
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ npm install failed for $($func.Name)" -ForegroundColor Red
                Pop-Location
                continue
            }
        }
        
        Pop-Location
    }

    # Deploy function
    if (-not $DryRun) {
        Write-Host "   🚀 Deploying to Google Cloud..." -ForegroundColor Yellow
        
        $deployCmd = @(
            "gcloud", "functions", "deploy", $func.Name,
            "--source", $functionPath,
            "--entry-point", $func.Target,
            "--runtime", "nodejs18",
            "--trigger-http",
            "--allow-unauthenticated",
            "--memory", $func.Memory,
            "--timeout", "60s",
            "--region", "europe-west1",
            "--quiet"
        )
        
        & $deployCmd[0] $deployCmd[1..($deployCmd.Length - 1)]
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Successfully deployed: $($func.Name)" -ForegroundColor Green
            $deployedFunctions += $func
            
            # Extract size number for calculation
            $sizeNumber = [int]($func.OriginalSize -replace '[^\d]', '')
            $totalSavings += $sizeNumber
        }
        else {
            Write-Host "❌ Deployment failed: $($func.Name)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "   🔍 DRY RUN - Would deploy $($func.Name)" -ForegroundColor Magenta
        $deployedFunctions += $func
        $sizeNumber = [int]($func.OriginalSize -replace '[^\d]', '')
        $totalSavings += $sizeNumber
    }
}

# Display results
Write-Host "" -ForegroundColor White
Write-Host "📊 Deployment Summary" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

if ($deployedFunctions.Count -gt 0) {
    Write-Host "✅ Successfully deployed functions:" -ForegroundColor Green
    foreach ($func in $deployedFunctions) {
        $url = "https://europe-west1-$ProjectId.cloudfunctions.net/$($func.Name)"
        Write-Host "   📍 $($func.Name): $url" -ForegroundColor Gray
        Write-Host "      $($func.Description)" -ForegroundColor Gray
    }
    
    Write-Host "" -ForegroundColor White
    Write-Host "Bundle Size Savings: ~$($totalSavings)KB" -ForegroundColor Green
    Write-Host "🎯 Cloudflare Bundle Reduction: $($deployedFunctions.Count) API endpoints migrated" -ForegroundColor Green
    
    if (-not $DryRun) {
        Write-Host "" -ForegroundColor White
        Write-Host "🧪 Test deployments:" -ForegroundColor Yellow
        foreach ($func in $deployedFunctions) {
            $healthUrl = "https://europe-west1-$ProjectId.cloudfunctions.net/$($func.Name)/health"
            Write-Host "   curl $healthUrl" -ForegroundColor Gray
        }
    }
}
else {
    Write-Host "❌ No functions were deployed successfully" -ForegroundColor Red
}

Write-Host "" -ForegroundColor White
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Test the deployed functions" -ForegroundColor Gray
Write-Host "2. Update Astro API endpoints to redirect to Cloud Functions" -ForegroundColor Gray
Write-Host "3. Deploy to Cloudflare with reduced bundle size" -ForegroundColor Gray
Write-Host "4. Monitor function performance and costs" -ForegroundColor Gray

if ($DryRun) {
    Write-Host "" -ForegroundColor White
    Write-Host "🔍 This was a DRY RUN - no actual deployments were made" -ForegroundColor Magenta
    Write-Host "   Run without -DryRun to perform actual deployment" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Google Cloud Functions deployment completed!" -ForegroundColor Green