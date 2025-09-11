# Test POLACZEK API z nowymi polskim modelami

# Funkcja testująca POLACZEK API
function Test-PolaczekAPI {
    param(
        [string]$Prompt = "Opowiedz mi o MyBonzo po polsku",
        [string]$Model = "qwen",
        [string]$BaseUrl = "http://localhost:4321"
    )
    
    Write-Host "🤖 Testowanie POLACZEK API..." -ForegroundColor Cyan
    Write-Host "Model: $Model" -ForegroundColor Yellow
    Write-Host "Prompt: $Prompt" -ForegroundColor Yellow
    Write-Host ""
    
    $body = @{
        prompt      = $Prompt
        model       = $Model
        language    = "pl"
        temperature = 0.6
    } | ConvertTo-Json -Depth 10
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/polaczek-chat" -Method POST -Body $body -ContentType "application/json"
        
        Write-Host "✅ Odpowiedź POLACZEK:" -ForegroundColor Green
        Write-Host $response.answer -ForegroundColor White
        Write-Host ""
        Write-Host "📊 Szczegóły:" -ForegroundColor Magenta
        Write-Host "Model użyty: $($response.modelUsed)" -ForegroundColor Gray
        Write-Host "Język: $($response.language)" -ForegroundColor Gray
        Write-Host "Kontekst: $($response.context)" -ForegroundColor Gray
        Write-Host "Źródło wiedzy: $($response.knowledge_source)" -ForegroundColor Gray
        
        return $response
    }
    catch {
        Write-Host "❌ Błąd podczas testowania API:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $null
    }
}

# Funkcja porównująca odpowiedzi różnych modeli
function Compare-PolaczekModels {
    param(
        [string]$Prompt = "Jakie usługi oferuje MyBonzo?",
        [string]$BaseUrl = "http://localhost:4321"
    )
    
    $models = @("qwen", "gemma", "fast")
    
    Write-Host "🔄 Porównanie modeli dla prompt: '$Prompt'" -ForegroundColor Cyan
    Write-Host "=" * 80
    
    foreach ($model in $models) {
        Write-Host ""
        Write-Host "🎯 MODEL: $model" -ForegroundColor Blue
        Write-Host "-" * 40
        Test-PolaczekAPI -Prompt $Prompt -Model $model -BaseUrl $BaseUrl
        Write-Host ""
    }
}

# Test sprawdzający API endpoint
function Test-PolaczekEndpoint {
    param([string]$BaseUrl = "http://localhost:4321")
    
    Write-Host "🔍 Sprawdzanie endpointu POLACZEK..." -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/polaczek-chat" -Method GET
        
        Write-Host "✅ Endpoint działa!" -ForegroundColor Green
        Write-Host "Status: $($response.status)" -ForegroundColor Gray
        Write-Host "Domyślny model: $($response.defaults.model)" -ForegroundColor Gray
        Write-Host "Funkcje: $($response.features -join ', ')" -ForegroundColor Gray
        Write-Host "Dostępne metody: $($response.methods -join ', ')" -ForegroundColor Gray
        
        return $true
    }
    catch {
        Write-Host "❌ Endpoint nie odpowiada:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        return $false
    }
}

# Przykłady testów
function Start-PolaczekTestSuite {
    param([string]$BaseUrl = "http://localhost:4321")
    
    Write-Host "🚀 POLACZEK API Test Suite" -ForegroundColor Green
    Write-Host "=" * 50
    
    # Test 1: Sprawdź endpoint
    if (-not (Test-PolaczekEndpoint -BaseUrl $BaseUrl)) {
        Write-Host "❌ Endpoint nie działa. Sprawdź czy serwer jest uruchomiony." -ForegroundColor Red
        return
    }
    
    # Test 2: Podstawowy test polskiego
    Write-Host ""
    Test-PolaczekAPI -Prompt "Cześć! Kim jesteś?" -Model "qwen" -BaseUrl $BaseUrl
    
    # Test 3: Test wiedzy o MyBonzo
    Write-Host ""
    Test-PolaczekAPI -Prompt "Jakie funkcje ma MyBonzo?" -Model "qwen" -BaseUrl $BaseUrl
    
    # Test 4: Test generowania obrazów
    Write-Host ""
    Test-PolaczekAPI -Prompt "Jak mogę wygenerować obraz?" -Model "qwen" -BaseUrl $BaseUrl
    
    # Test 5: Porównanie modeli
    Write-Host ""
    Compare-PolaczekModels -Prompt "Opowiedz o AI agentach MyBonzo" -BaseUrl $BaseUrl
}

# Eksportuj funkcje
Export-ModuleMember -Function Test-PolaczekAPI, Compare-PolaczekModels, Test-PolaczekEndpoint, Start-PolaczekTestSuite

Write-Host "🎯 POLACZEK Test Module załadowany!" -ForegroundColor Green
Write-Host "Dostępne funkcje:" -ForegroundColor Yellow
Write-Host "• Test-PolaczekAPI -Prompt 'tekst' -Model 'qwen'" -ForegroundColor Gray
Write-Host "• Compare-PolaczekModels -Prompt 'tekst'" -ForegroundColor Gray  
Write-Host "• Test-PolaczekEndpoint" -ForegroundColor Gray
Write-Host "• Start-PolaczekTestSuite" -ForegroundColor Gray
Write-Host ""
Write-Host "Przykład: Test-PolaczekAPI -Prompt 'Cześć, jak działasz?'" -ForegroundColor Cyan