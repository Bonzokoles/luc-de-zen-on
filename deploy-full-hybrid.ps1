# MyBonzo - Full Version Deployment Script
# Smart Hybrid Architecture Implementation

param(
    [string]$Mode = "hybrid",  # hybrid, cdn, full
    [string]$GcpProject = $env:GOOGLE_CLOUD_PROJECT_ID,
    [switch]$SkipGcp = $false,
    [switch]$TestOnly = $false
)

Write-Host "🚀 MyBonzo Full Version Deployment" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor Yellow

switch ($Mode.ToLower()) {
    "hybrid" {
        Write-Host "📋 Hybrid Architecture: Cloudflare + Google Cloud" -ForegroundColor Green
        
        # Step 1: Deploy Google Cloud Functions (if not skipped)
        if (-not $SkipGcp -and $GcpProject) {
            Write-Host "1️⃣ Deploying Google Cloud Functions..." -ForegroundColor Yellow
            & ".\google-cloud-migration\deploy-functions.ps1" -ProjectId $GcpProject
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Google Cloud deployment failed" -ForegroundColor Red
                exit 1
            }
        }
        
        # Step 2: Activate proxy endpoints
        Write-Host "2️⃣ Activating proxy endpoints..." -ForegroundColor Yellow
        if (Test-Path "src\pages\api\_qualify-lead.ts.disabled") {
            Move-Item "src\pages\api\_qualify-lead.ts.disabled" "src\pages\api\qualify-lead.ts" -Force
        }
        if (Test-Path "src\pages\api\_reminders.ts.disabled") {
            Move-Item "src\pages\api\_reminders.ts.disabled" "src\pages\api\reminders.ts" -Force
        }
        if (Test-Path "src\pages\api\_calendar.ts.disabled") {
            Move-Item "src\pages\api\_calendar.ts.disabled" "src\pages\api\calendar.ts" -Force
        }
        
        # Step 3: Create CDN-based BabylonJS
        Write-Host "3️⃣ Creating CDN-based BabylonJS..." -ForegroundColor Yellow
        $cdnBabylon = @"
<script>
  // CDN-based BabylonJS loading - reduces bundle by ~11MB
  if (typeof window !== 'undefined') {
    // Load BabylonJS from CDN when needed
    window.loadBabylonJS = async function() {
      if (window.BABYLON) return window.BABYLON;
      
      const script = document.createElement('script');
      script.src = 'https://cdn.babylonjs.com/babylon.js';
      document.head.appendChild(script);
      
      return new Promise((resolve) => {
        script.onload = () => resolve(window.BABYLON);
      });
    };
  }
</script>

<!-- Placeholder for BabylonJS components -->
<div class="bg-animation-placeholder bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-pulse">
  <div class="absolute inset-0 bg-grid-pattern opacity-10"></div>
</div>

<style>
  .bg-grid-pattern {
    background-image: 
      linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 50px 50px;
  }
</style>
"@
        
        Set-Content -Path "src\components\BgAnimation.svelte" -Value $cdnBabylon -Encoding UTF8
    }
    
    "cdn" {
        Write-Host "📋 CDN-Only Mode: External libraries via CDN" -ForegroundColor Green
        
        # Create external config
        $externalConfig = @"
export default {
  build: {
    rollupOptions: {
      external: [
        '@babylonjs/core',
        '@babylonjs/materials', 
        '@babylonjs/loaders',
        'googleapis',
        '@google-cloud/bigquery',
        '@google-cloud/storage'
      ]
    }
  }
}
"@
        Set-Content -Path "external.config.js" -Value $externalConfig -Encoding UTF8
    }
    
    "full" {
        Write-Host "📋 Full Mode: All features included" -ForegroundColor Green
        Write-Host "⚠️  This may exceed 25MB limit" -ForegroundColor Yellow
        
        # Restore all disabled endpoints
        Get-ChildItem "src\pages\api" -Filter "*.disabled" | ForEach-Object {
            $newName = $_.Name -replace '\.disabled$', ''
            $newPath = Join-Path $_.Directory.FullName $newName
            Move-Item $_.FullName $newPath -Force
            Write-Host "✅ Restored: $newName" -ForegroundColor Green
        }
        
        # Restore full BabylonJS
        Move-Item "src\components\_BgAnimation.svelte.disabled" "src\components\BgAnimation.svelte" -Force -ErrorAction SilentlyContinue
    }
}

# Build and test
Write-Host "4️⃣ Building project..." -ForegroundColor Yellow
pnpm exec astro build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# Check bundle size
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)
Write-Host "📊 Bundle size: $bundleSizeRounded MB" -ForegroundColor $(if ($bundleSize -lt 25) { "Green" } else { "Red" })

if ($bundleSize -gt 25) {
    Write-Host "⚠️  Bundle exceeds 25MB limit" -ForegroundColor Yellow
    Write-Host "💡 Consider using 'hybrid' or 'cdn' mode" -ForegroundColor Cyan
    if (-not $TestOnly) {
        $continue = Read-Host "Continue with deployment anyway? (y/N)"
        if ($continue -ne 'y') {
            exit 1
        }
    }
}

# Deploy if not test only
if (-not $TestOnly) {
    Write-Host "5️⃣ Deploying to Cloudflare..." -ForegroundColor Yellow
    wrangler pages deploy dist --project-name="luc-de-zen-on"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Deployment successful!" -ForegroundColor Green
        Write-Host "🌐 Live at: https://luc-de-zen-on.pages.dev" -ForegroundColor Cyan
    }
    else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
    }
}
else {
    Write-Host "🧪 Test mode - skipping deployment" -ForegroundColor Yellow
}

Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "Mode: $Mode" -ForegroundColor White
Write-Host "Bundle: $bundleSizeRounded MB" -ForegroundColor White