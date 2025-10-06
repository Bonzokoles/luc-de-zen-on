# MyBonzo - Smart Proxy Deployment
# Uses lightweight proxy endpoints instead of heavy googleapis imports

param([switch]$TestOnly = $false)

Write-Host "MyBonzo Smart Proxy Deployment" -ForegroundColor Cyan

Write-Host "1. Moving heavy APIs to proxy pattern..." -ForegroundColor Yellow

# Move heavy API endpoints to .disabled and activate proxies
if (Test-Path "src\pages\api\qualify-lead.ts") {
    Move-Item "src\pages\api\qualify-lead.ts" "src\pages\api\_qualify-lead-heavy.ts.disabled" -Force
    Write-Host "  - qualify-lead.ts → disabled (heavy googleapis)" -ForegroundColor Yellow
}

if (Test-Path "src\pages\api\reminders.ts") {
    Move-Item "src\pages\api\reminders.ts" "src\pages\api\_reminders-heavy.ts.disabled" -Force
    Write-Host "  - reminders.ts → disabled (heavy googleapis)" -ForegroundColor Yellow
}

if (Test-Path "src\pages\api\calendar.ts") {
    Move-Item "src\pages\api\calendar.ts" "src\pages\api\_calendar-heavy.ts.disabled" -Force
    Write-Host "  - calendar.ts → disabled (heavy googleapis)" -ForegroundColor Yellow
}

# Activate lightweight proxy endpoints
$proxyEndpoints = @(
    "qualify-lead-proxy.ts",
    "reminders-proxy.ts", 
    "calendar-proxy.ts"
)

foreach ($proxy in $proxyEndpoints) {
    $proxyPath = "src\pages\api\$proxy"
    $targetPath = "src\pages\api\$($proxy -replace '-proxy.ts$', '.ts')"
    
    if (Test-Path $proxyPath) {
        Copy-Item $proxyPath $targetPath -Force
        Write-Host "  + $($proxy -replace '-proxy.ts$', '.ts') (lightweight proxy)" -ForegroundColor Green
    }
}

Write-Host "2. Optimizing BgAnimation for bundle size..." -ForegroundColor Yellow

# Create ultra-lightweight BgAnimation
$lightweightBg = @"
<!-- Ultra-lightweight BgAnimation - Pure CSS animation -->
<div class="bg-animation-lightweight">
  <div class="gradient-layer"></div>
  <div class="pattern-layer"></div>
</div>

<style>
  .bg-animation-lightweight {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -10;
    pointer-events: none;
  }
  
  .gradient-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      45deg,
      rgba(59, 130, 246, 0.1) 0%,
      rgba(147, 51, 234, 0.1) 50%,
      rgba(244, 63, 94, 0.1) 100%
    );
    animation: gradient-shift 8s ease-in-out infinite;
  }
  
  .pattern-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 2px, transparent 2px),
      radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 50px 50px, 30px 30px;
    animation: pattern-float 12s linear infinite;
  }
  
  @keyframes gradient-shift {
    0%, 100% { 
      filter: hue-rotate(0deg) brightness(0.8);
    }
    50% { 
      filter: hue-rotate(60deg) brightness(1.2);
    }
  }
  
  @keyframes pattern-float {
    0% { 
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.3;
    }
    50% { 
      opacity: 0.6;
    }
    100% { 
      transform: translate(20px, 20px) rotate(5deg);
      opacity: 0.3;
    }
  }
</style>

<script>
  // Optional: Dynamic effects without heavy libraries
  if (typeof window !== 'undefined') {
    let mouseX = 0, mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      
      const gradient = document.querySelector('.gradient-layer');
      if (gradient) {
        gradient.style.background = ``linear-gradient(
          ``${45 + mouseX * 30}deg,
          rgba(59, 130, 246, ``${0.1 + mouseX * 0.1}) 0%,
          rgba(147, 51, 234, ``${0.1 + mouseY * 0.1}) 50%,
          rgba(244, 63, 94, ``${0.1 + (mouseX + mouseY) * 0.05}) 100%
        )``;
      }
    });
  }
</script>
"@

Set-Content -Path "src\components\BgAnimation.svelte" -Value $lightweightBg -Encoding UTF8
Write-Host "  + BgAnimation optimized (CSS + minimal JS)" -ForegroundColor Green

Write-Host "3. Building optimized version..." -ForegroundColor Yellow
pnpm exec astro build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Check bundle size
$bundleSize = (Get-ChildItem -Path "dist" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
$bundleSizeRounded = [math]::Round($bundleSize, 2)

if ($bundleSize -lt 25) {
    Write-Host "SUCCESS: Bundle size: $bundleSizeRounded MB (< 25MB)" -ForegroundColor Green
} else {
    Write-Host "WARNING: Bundle size: $bundleSizeRounded MB (> 25MB)" -ForegroundColor Red
}

if (-not $TestOnly -and $bundleSize -lt 25) {
    Write-Host "4. Deploying to Cloudflare..." -ForegroundColor Yellow
    wrangler pages deploy dist --project-name="luc-de-zen-on"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Deployment successful!" -ForegroundColor Green
        Write-Host "Live at: https://luc-de-zen-on.pages.dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "Test mode or size limit exceeded - deployment skipped" -ForegroundColor Yellow
}

Write-Host "`nProxy Architecture Summary:" -ForegroundColor Cyan
Write-Host "- Heavy APIs: Moved to Google Cloud Functions (when available)" -ForegroundColor White  
Write-Host "- Lightweight proxies: Active in Cloudflare Pages" -ForegroundColor White
Write-Host "- BgAnimation: Pure CSS (no BabylonJS bundle impact)" -ForegroundColor White
Write-Host "- Bundle size: $bundleSizeRounded MB" -ForegroundColor White