# Test Tavily API
Write-Host "=== Test Tavily API ===" -ForegroundColor Green

# Test GET endpoint
Write-Host "`nTesting GET endpoint..." -ForegroundColor Yellow
try {
    $getResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/tavily/search?q=AI&search_depth=basic" -Method GET -UseBasicParsing
    $getJson = $getResponse.Content | ConvertFrom-Json
    Write-Host "GET Success: Status=$($getResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($getJson | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "GET Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test POST endpoint
Write-Host "`nTesting POST endpoint..." -ForegroundColor Yellow
try {
    $postBody = @{
        query = "artificial intelligence"
        searchDepth = "advanced"
        includeImages = $true
        aiInsights = $true
        maxResults = 3
    } | ConvertTo-Json

    $postResponse = Invoke-WebRequest -Uri "http://localhost:5000/api/tavily/search" -Method POST -Body $postBody -ContentType "application/json" -UseBasicParsing
    $postJson = $postResponse.Content | ConvertFrom-Json
    Write-Host "POST Success: Status=$($postResponse.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($postJson | ConvertTo-Json -Depth 2)" -ForegroundColor Cyan
} catch {
    Write-Host "POST Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Test Completed ===" -ForegroundColor Green