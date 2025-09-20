#!/usr/bin/env pwsh

# Deploy Voice AI Worker to Cloudflare
# Enhanced deployment script with AI services configuration

param(
    [Parameter()]
    [ValidateSet('development', 'staging', 'production')]
    [string]$Environment = 'development',
    
    [Parameter()]
    [switch]$SetupSecrets,
    
    [Parameter()]
    [switch]$TestAfterDeploy,
    
    [Parameter()]
    [switch]$Verbose
)

# Configuration
$WorkerName = "voice-ai-worker"
$ConfigFile = "voice-ai-wrangler.toml"

Write-Host "🎤 Deploying Voice AI Worker to Cloudflare" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# Check if wrangler is installed
if (-not (Get-Command wrangler -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Wrangler CLI not found. Installing..." -ForegroundColor Red
    npm install -g wrangler
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Wrangler CLI" -ForegroundColor Red
        exit 1
    }
}

# Check authentication
Write-Host "🔐 Checking Cloudflare authentication..." -ForegroundColor Blue
$authCheck = wrangler whoami 2>&1
if ($authCheck -match "not authenticated") {
    Write-Host "❌ Not authenticated with Cloudflare. Run 'wrangler login' first." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Authenticated as: $($authCheck)" -ForegroundColor Green

# Setup secrets if requested
if ($SetupSecrets) {
    Write-Host "🔑 Setting up AI service secrets..." -ForegroundColor Blue
    
    # OpenAI API Key
    $openaiKey = Read-Host -Prompt "Enter OpenAI API Key (or press Enter to skip)" -MaskInput
    if ($openaiKey) {
        wrangler secret put OPENAI_API_KEY --env $Environment
        Write-Host "✅ OpenAI API Key configured" -ForegroundColor Green
    }
    
    # Google Cloud Speech API Key
    $googleKey = Read-Host -Prompt "Enter Google Cloud Speech API Key (or press Enter to skip)" -MaskInput
    if ($googleKey) {
        wrangler secret put GOOGLE_SPEECH_KEY --env $Environment
        Write-Host "✅ Google Speech API Key configured" -ForegroundColor Green
    }
    
    # Azure Cognitive Services Key
    $azureKey = Read-Host -Prompt "Enter Azure Cognitive Services Key (or press Enter to skip)" -MaskInput
    if ($azureKey) {
        wrangler secret put AZURE_COGNITIVE_KEY --env $Environment
        Write-Host "✅ Azure Cognitive Key configured" -ForegroundColor Green
    }
    
    # ElevenLabs API Key
    $elevenLabsKey = Read-Host -Prompt "Enter ElevenLabs API Key (or press Enter to skip)" -MaskInput
    if ($elevenLabsKey) {
        wrangler secret put ELEVENLABS_API_KEY --env $Environment
        Write-Host "✅ ElevenLabs API Key configured" -ForegroundColor Green
    }
}

# Deploy the worker
Write-Host "🚀 Deploying Voice AI Worker..." -ForegroundColor Blue

try {
    if ($Verbose) {
        wrangler deploy --config $ConfigFile --env $Environment --verbose
    }
    else {
        wrangler deploy --config $ConfigFile --env $Environment
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Voice AI Worker deployed successfully!" -ForegroundColor Green
        
        # Get deployment info
        $workerInfo = wrangler deployments list --env $Environment --config $ConfigFile 2>&1
        Write-Host "📊 Deployment Information:" -ForegroundColor Cyan
        Write-Host $workerInfo -ForegroundColor White
        
    }
    else {
        Write-Host "❌ Deployment failed!" -ForegroundColor Red
        exit 1
    }
}
catch {
    Write-Host "❌ Deployment error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test deployment if requested
if ($TestAfterDeploy) {
    Write-Host "🧪 Testing deployed Voice AI Worker..." -ForegroundColor Blue
    
    # Determine worker URL based on environment
    $workerUrl = switch ($Environment) {
        'production' { 'https://voice-ai.mybonzo.com' }
        'staging' { 'https://voice-ai-staging.mybonzo.com' }
        default { "https://mybonzo-voice-ai-dev.karollisson.workers.dev" }
    }
    
    # Test health endpoint
    try {
        $healthResponse = Invoke-RestMethod -Uri "$workerUrl/voice-ai/health" -Method GET -TimeoutSec 30
        
        if ($healthResponse.status -eq 'healthy') {
            Write-Host "✅ Health check passed!" -ForegroundColor Green
            Write-Host "📋 Service Info:" -ForegroundColor Cyan
            Write-Host "  Version: $($healthResponse.version)" -ForegroundColor White
            Write-Host "  Capabilities: $($healthResponse.capabilities -join ', ')" -ForegroundColor White
            Write-Host "  AI Services: $(($healthResponse.aiServices | ConvertTo-Json -Compress))" -ForegroundColor White
        }
        else {
            Write-Host "❌ Health check failed: $($healthResponse | ConvertTo-Json)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Health check error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Test transcription endpoint with mock data
    try {
        Write-Host "🎯 Testing transcription endpoint..." -ForegroundColor Blue
        
        $transcriptionTest = @{
            audioData = "bW9ja19hdWRpb19kYXRh" # base64: "mock_audio_data"
            language  = "pl-PL"
            provider  = "auto"
        } | ConvertTo-Json
        
        $transcriptionResponse = Invoke-RestMethod -Uri "$workerUrl/voice-ai/transcribe" -Method POST -Body $transcriptionTest -ContentType "application/json" -TimeoutSec 30
        
        if ($transcriptionResponse.success) {
            Write-Host "✅ Transcription test passed!" -ForegroundColor Green
            Write-Host "  Provider: $($transcriptionResponse.provider)" -ForegroundColor White
            Write-Host "  Confidence: $($transcriptionResponse.confidence)%" -ForegroundColor White
        }
        else {
            Write-Host "❌ Transcription test failed: $($transcriptionResponse.error)" -ForegroundColor Red
        }
    }
    catch {
        Write-Host "❌ Transcription test error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Display final information
Write-Host "`n🎉 Voice AI Worker Deployment Complete!" -ForegroundColor Green
Write-Host "📍 Worker URL: $workerUrl" -ForegroundColor Cyan
Write-Host "🔧 Management: https://dash.cloudflare.com/" -ForegroundColor Cyan

Write-Host "`n📚 Available Endpoints:" -ForegroundColor Yellow
Write-Host "  GET  /voice-ai/health       - Health check and capabilities" -ForegroundColor White
Write-Host "  POST /voice-ai/transcribe   - Speech-to-text conversion" -ForegroundColor White  
Write-Host "  POST /voice-ai/synthesize   - Text-to-speech synthesis" -ForegroundColor White
Write-Host "  POST /voice-ai/analyze      - Audio analysis and emotion detection" -ForegroundColor White
Write-Host "  POST /voice-ai/command      - Voice command processing" -ForegroundColor White
Write-Host "  WS   /voice-ai/realtime     - Real-time voice processing" -ForegroundColor White

Write-Host "`n🔑 Next Steps:" -ForegroundColor Yellow
Write-Host "  1. Configure AI service API keys if not done: ./deploy-voice-ai.ps1 -SetupSecrets" -ForegroundColor White
Write-Host "  2. Test the deployment: ./deploy-voice-ai.ps1 -TestAfterDeploy" -ForegroundColor White
Write-Host "  3. Monitor logs: wrangler tail --env $Environment" -ForegroundColor White
Write-Host "  4. Update DNS records for custom domains (production/staging)" -ForegroundColor White

exit 0