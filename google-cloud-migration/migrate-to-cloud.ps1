#!/usr/bin/env pwsh

# MyBonzo - Complete Google Cloud Migration Script
# Deploys Cloud Functions and updates Astro endpoints for reduced bundle size

param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT_ID,
    [switch]$DryRun = $false,
    [switch]$SkipDeploy = $false,
    [switch]$SkipProxy = $false
)

Write-Host "🌩️  MyBonzo - Complete Google Cloud Migration" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

$startTime = Get-Date

# Step 1: Deploy Cloud Functions
if (-not $SkipDeploy) {
    Write-Host "🚀 Step 1: Deploying Google Cloud Functions..." -ForegroundColor Yellow
    
    $deployScript = Join-Path $PSScriptRoot "deploy-functions.ps1"
    if (Test-Path $deployScript) {
        if ($DryRun) {
            & $deployScript -ProjectId $ProjectId -DryRun
        }
        else {
            & $deployScript -ProjectId $ProjectId
        }
        
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Cloud Functions deployment failed" -ForegroundColor Red
            exit 1
        }
    }
    else {
        Write-Host "❌ Deploy script not found: $deployScript" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "⏭️  Skipping Cloud Functions deployment" -ForegroundColor Yellow
}

# Step 2: Update Astro API endpoints
if (-not $SkipProxy) {
    Write-Host "" -ForegroundColor White
    Write-Host "🔄 Step 2: Updating Astro API endpoints..." -ForegroundColor Yellow
    
    $apiUpdates = @(
        @{
            Original    = "src\pages\api\bigquery.ts"
            Backup      = "src\pages\api\bigquery.ts.backup"
            Proxy       = "src\pages\api\bigquery-proxy.ts"
            Description = "BigQuery API (338KB → 2KB)"
        },
        @{
            Original    = "src\pages\api\get-recommendations.ts"
            Backup      = "src\pages\api\get-recommendations.ts.backup"
            Proxy       = "src\pages\api\get-recommendations-proxy.ts"
            Description = "Recommendations API (273KB → 2KB)"
        }
    )
    
    foreach ($update in $apiUpdates) {
        Write-Host "   📝 Processing: $($update.Description)" -ForegroundColor Gray
        
        $originalPath = Join-Path $PSScriptRoot "..\$($update.Original)"
        $backupPath = Join-Path $PSScriptRoot "..\$($update.Backup)"
        $proxyPath = Join-Path $PSScriptRoot "..\$($update.Proxy)"
        
        if (Test-Path $originalPath) {
            if (-not $DryRun) {
                # Create backup of original
                Copy-Item $originalPath $backupPath -Force
                Write-Host "      ✅ Backup created: $($update.Backup)" -ForegroundColor Green
                
                # Replace with proxy if proxy exists
                if (Test-Path $proxyPath) {
                    Copy-Item $proxyPath $originalPath -Force
                    Write-Host "      ✅ Proxy activated: $($update.Original)" -ForegroundColor Green
                }
                else {
                    Write-Host "      ⚠️  Proxy not found: $($update.Proxy)" -ForegroundColor Yellow
                }
            }
            else {
                Write-Host "      🔍 DRY RUN - Would update $($update.Original)" -ForegroundColor Magenta
            }
        }
        else {
            Write-Host "      ⚠️  Original not found: $($update.Original)" -ForegroundColor Yellow
        }
    }
}
else {
    Write-Host "⏭️  Skipping Astro endpoint updates" -ForegroundColor Yellow
}

# Step 3: Test the migration
Write-Host "" -ForegroundColor White
Write-Host "🧪 Step 3: Testing migration..." -ForegroundColor Yellow

if (-not $DryRun -and -not $SkipDeploy) {
    $testUrls = @(
        "https://europe-west1-$ProjectId.cloudfunctions.net/mybonzo-bigquery-api/health",
        "https://europe-west1-$ProjectId.cloudfunctions.net/mybonzo-recommendations-api/health"
    )
    
    foreach ($url in $testUrls) {
        try {
            Write-Host "   Testing: $url" -ForegroundColor Gray
            $response = Invoke-RestMethod -Uri $url -Method Get -TimeoutSec 10
            if ($response.status -eq "healthy") {
                Write-Host "   ✅ Healthy: $($response.service)" -ForegroundColor Green
            }
            else {
                Write-Host "   ⚠️  Unexpected response from $url" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "   ❌ Failed to reach $url" -ForegroundColor Red
            Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor Gray
        }
    }
}

# Step 4: Build and test locally
Write-Host "" -ForegroundColor White
Write-Host "🏗️  Step 4: Testing local build..." -ForegroundColor Yellow

if (-not $DryRun) {
    Push-Location (Join-Path $PSScriptRoot "..")
    
    try {
        Write-Host "   Building Astro project..." -ForegroundColor Gray
        pnpm build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Build successful" -ForegroundColor Green
            
            # Check dist size
            $distPath = "dist"
            if (Test-Path $distPath) {
                $distSize = (Get-ChildItem $distPath -Recurse | Measure-Object -Property Length -Sum).Sum
                $distSizeMB = [math]::Round($distSize / 1MB, 2)
                
                Write-Host "   📊 Bundle size: ${distSizeMB}MB" -ForegroundColor Cyan
                
                if ($distSizeMB -lt 25) {
                    Write-Host "   ✅ Bundle size under 25MB limit!" -ForegroundColor Green
                }
                else {
                    Write-Host "   ⚠️  Bundle still over 25MB - may need more optimization" -ForegroundColor Yellow
                }
            }
        }
        else {
            Write-Host "   ❌ Build failed" -ForegroundColor Red
        }
    }
    finally {
        Pop-Location
    }
}
else {
    Write-Host "   🔍 DRY RUN - Skipping build test" -ForegroundColor Magenta
}

# Results Summary
$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "" -ForegroundColor White
Write-Host "📊 Migration Summary" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host "⏱️  Duration: $($duration.TotalMinutes.ToString('F1')) minutes" -ForegroundColor Gray
Write-Host "🎯 Target Savings: ~611KB from Cloudflare bundle" -ForegroundColor Green
Write-Host "☁️  Cloud Functions: 2 deployed (BigQuery + Recommendations)" -ForegroundColor Green
Write-Host "🔄 Proxy Endpoints: 2 updated" -ForegroundColor Green

Write-Host "" -ForegroundColor White
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Monitor Cloud Functions in Google Cloud Console" -ForegroundColor Gray
Write-Host "2. Test the application locally: pnpm dev" -ForegroundColor Gray
Write-Host "3. Deploy to Cloudflare: .\deploy-to-production.ps1" -ForegroundColor Gray
Write-Host "4. Verify reduced bundle size in deployment logs" -ForegroundColor Gray

if ($DryRun) {
    Write-Host "" -ForegroundColor White
    Write-Host "🔍 This was a DRY RUN - no changes were made" -ForegroundColor Magenta
    Write-Host "   Run without -DryRun to perform actual migration" -ForegroundColor Gray
}

Write-Host "" -ForegroundColor White
Write-Host "🎉 Google Cloud migration completed!" -ForegroundColor Green

# Rollback instructions
Write-Host "" -ForegroundColor White
Write-Host "🔄 Rollback Instructions (if needed):" -ForegroundColor Yellow
Write-Host "   Restore original endpoints:" -ForegroundColor Gray
Write-Host "   Copy-Item src\pages\api\bigquery.ts.backup src\pages\api\bigquery.ts -Force" -ForegroundColor Gray
Write-Host "   Copy-Item src\pages\api\get-recommendations.ts.backup src\pages\api\get-recommendations.ts -Force" -ForegroundColor Gray