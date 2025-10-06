# MyBonzo - Simple Full Version Deployment
param(
    [string]$Mode = "hybrid",
    [switch]$TestOnly = $false
)

Write-Host "MyBonzo Full Version Deployment - Mode: $Mode" -ForegroundColor Cyan

if ($Mode -eq "hybrid") {
    Write-Host "1. Activating proxy endpoints..." -ForegroundColor Yellow
    
    # Restore disabled APIs
    if (Test-Path "src\pages\api\_qualify-lead.ts.disabled") {
        Move-Item "src\pages\api\_qualify-lead.ts.disabled" "src\pages\api\qualify-lead.ts" -Force
        Write-Host "  - qualify-lead.ts restored" -ForegroundColor Green
    }
    if (Test-Path "src\pages\api\_reminders.ts.disabled") {
        Move-Item "src\pages\api\_reminders.ts.disabled" "src\pages\api\reminders.ts" -Force
        Write-Host "  - reminders.ts restored" -ForegroundColor Green
    }
    if (Test-Path "src\pages\api\_calendar.ts.disabled") {
        Move-Item "src\pages\api\_calendar.ts.disabled" "src\pages\api\calendar.ts" -Force
        Write-Host "  - calendar.ts restored" -ForegroundColor Green
    }
    
    Write-Host "2. Creating optimized BgAnimation..." -ForegroundColor Yellow
    
    # Create optimized BgAnimation component
    $optimizedBg = @"
<!-- Optimized BgAnimation - CDN-based loading -->
<div class="bg-animation-optimized">
  <div class="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10"></div>
  <div class="absolute inset-0 opacity-20">
    <div class="grid-pattern"></div>
  </div>
</div>

<style>
  .bg-animation-optimized {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    animation: subtle-pulse 4s ease-in-out infinite;
  }
  
  .grid-pattern {
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    animation: grid-move 20s linear infinite;
  }
  
  @keyframes subtle-pulse {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @keyframes grid-move {
    0% { transform: translate(0, 0); }
    100% { transform: translate(40px, 40px); }
  }
</style>
"@
    
    Set-Content -Path "src\components\BgAnimation.svelte" -Value $optimizedBg -Encoding UTF8
    Write-Host "  - BgAnimation optimized (CSS-only)" -ForegroundColor Green
}

Write-Host "3. Building project..." -ForegroundColor Yellow
pnpm exec astro build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Check bundle size
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)
Write-Host "Bundle size: $bundleSizeRounded MB" -ForegroundColor $(if ($bundleSize -lt 25) { "Green" } else { "Red" })

if ($bundleSize -gt 25) {
    Write-Host "WARNING: Bundle exceeds 25MB limit" -ForegroundColor Yellow
    if (-not $TestOnly) {
        $continue = Read-Host "Continue anyway? (y/N)"
        if ($continue -ne 'y') { exit 1 }
    }
}
else {
    Write-Host "SUCCESS: Bundle under 25MB limit" -ForegroundColor Green
}

if (-not $TestOnly) {
    Write-Host "4. Deploying to Cloudflare..." -ForegroundColor Yellow
    wrangler pages deploy dist --project-name="luc-de-zen-on"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
    }
}
else {
    Write-Host "Test mode - deployment skipped" -ForegroundColor Yellow
}

Write-Host "Summary - Mode: $Mode, Bundle: $bundleSizeRounded MB" -ForegroundColor Cyan