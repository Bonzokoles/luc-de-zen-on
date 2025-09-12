# POLACZEK API Test Script
# Simple test for Polish language improvements

function Test-PolaczekBasic {
    param(
        [string]$BaseUrl = "http://localhost:4321",
        [string]$Prompt = "Czesc! Kim jestes?"
    )
    
    Write-Host "Testing POLACZEK API..." -ForegroundColor Cyan
    Write-Host "Prompt: $Prompt" -ForegroundColor Yellow
    
    $body = @{
        prompt = $Prompt
        model = "qwen"
        language = "pl"
    } | ConvertTo-Json
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/polaczek-chat" -Method POST -Body $body -ContentType "application/json"
        
        Write-Host "SUCCESS! Response:" -ForegroundColor Green
        Write-Host $response.answer
        Write-Host "Model used: $($response.modelUsed)" -ForegroundColor Gray
        
        return $response
    }
    catch {
        Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Test-PolaczekEndpoint {
    param([string]$BaseUrl = "http://localhost:4321")
    
    Write-Host "Checking POLACZEK endpoint..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/polaczek-chat" -Method GET
        Write-Host "Endpoint is working!" -ForegroundColor Green
        Write-Host "Default model: $($response.defaults.model)" -ForegroundColor Gray
        return $true
    }
    catch {
        Write-Host "Endpoint not available: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "POLACZEK Test Script loaded!" -ForegroundColor Green
Write-Host "Usage: Test-PolaczekBasic -Prompt 'Twoj tekst'" -ForegroundColor Yellow
Write-Host "Check endpoint: Test-PolaczekEndpoint" -ForegroundColor Yellow