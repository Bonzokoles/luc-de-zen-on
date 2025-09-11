# MyBonzo Development Helper PowerShell Scripts

# Kolory dla PowerShell
function Write-Status {
    param($Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param($Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param($Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param($Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Funkcja sprawdzająca status repozytorium
function Check-RepoStatus {
    Write-Status "Sprawdzanie statusu repozytorium..."
    
    $status = git status --porcelain
    if ($status) {
        Write-Warning "Masz niezcommitowane zmiany!"
        git status --short
        return $false
    }
    else {
        Write-Success "Repozytorium jest czyste"
        return $true
    }
}

# Funkcja tworząca nowy feature branch
function New-FeatureBranch {
    param(
        [Parameter(Mandatory = $true)]
        [string]$FeatureName
    )
    
    $branchName = "feature/$FeatureName"
    
    Write-Status "Tworzenie nowego branch: $branchName"
    
    # Sprawdź aktualny branch
    $currentBranch = git branch --show-current
    if ($currentBranch -ne "main") {
        Write-Warning "Nie jesteś na branch main. Przełączam..."
        git checkout main
    }
    
    # Aktualizuj main
    Write-Status "Aktualizowanie main branch..."
    git pull origin main
    
    # Utwórz nowy branch
    git checkout -b $branchName
    
    Write-Success "Branch $branchName utworzony pomyślnie!"
    Write-Status "Możesz teraz rozpocząć pracę nad funkcjonalnością."
}

# Funkcja do szybkiego commitowania
function Invoke-QuickCommit {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Message
    )
    
    Write-Status "Dodawanie zmian..."
    git add .
    
    Write-Status "Commitowanie..."
    git commit -m $Message
    
    Write-Success "Zmiany zostały zacommitowane!"
}

# Funkcja do testowania lokalnego
function Test-Local {
    Write-Status "Uruchamianie testów lokalnych..."
    
    # Build test
    Write-Status "Testowanie build..."
    $buildResult = npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build zakończony pomyślnie!"
    }
    else {
        Write-Error "Build failed!"
        return
    }
    
    # Preview test
    Write-Status "Uruchamianie preview..."
    Write-Warning "Sprawdź aplikację w przeglądarce: http://localhost:4321"
    npm run preview
}

# Funkcja do przygotowania merge
function Invoke-PrepareMerge {
    $currentBranch = git branch --show-current
    
    if ($currentBranch -eq "main") {
        Write-Error "Nie możesz mergować main do siebie!"
        return
    }
    
    Write-Status "Przygotowywanie do merge branch: $currentBranch"
    
    # Sprawdź status
    if (-not (Check-RepoStatus)) {
        Write-Error "Zacommituj lub stash swoje zmiany przed merge!"
        return
    }
    
    # Aktualizuj main
    Write-Status "Aktualizowanie main..."
    git checkout main
    git pull origin main
    
    # Wróć na feature branch i rebase
    git checkout $currentBranch
    Write-Status "Wykonywanie rebase..."
    
    git rebase main
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Rebase zakończony pomyślnie!"
        Write-Status "Możesz teraz push'ować i tworzyć PR"
        Write-Warning "Komenda: git push origin $currentBranch"
    }
    else {
        Write-Error "Konflikt podczas rebase! Rozwiąż konflikty i kontynuuj."
        Write-Warning "Po rozwiązaniu: git rebase --continue"
    }
}

# Funkcja awaryjnego rollback
function Invoke-EmergencyRollback {
    Write-Warning "🚨 AWARYJNY ROLLBACK 🚨"
    Write-Warning "Ta operacja cofnie ostatni commit z main branch!"
    
    $confirm = Read-Host "Czy jesteś pewien? (yes/no)"
    
    if ($confirm -eq "yes") {
        Write-Status "Wykonywanie rollback..."
        git checkout main
        git reset --hard HEAD~1
        
        Write-Warning "Push'owanie rollback..."
        git push --force-with-lease origin main
        
        Write-Success "Rollback wykonany! Sprawdź Cloudflare deployment."
    }
    else {
        Write-Status "Rollback anulowany."
    }
}

# Funkcja pomocy
function Show-Help {
    Write-Host "MyBonzo Development Helper" -ForegroundColor Blue
    Write-Host ""
    Write-Host "Dostępne funkcje:"
    Write-Host "  Check-RepoStatus           - Sprawdź status repozytorium"
    Write-Host "  New-FeatureBranch <nazwa>  - Utwórz nowy feature branch"
    Write-Host "  Invoke-QuickCommit <msg>   - Szybki commit"
    Write-Host "  Test-Local                 - Testuj lokalnie"
    Write-Host "  Invoke-PrepareMerge        - Przygotuj do merge"
    Write-Host "  Invoke-EmergencyRollback   - Awaryjny rollback"
    Write-Host "  Show-Help                  - Pokaż tę pomoc"
    Write-Host ""
    Write-Host "Przykłady:"
    Write-Host "  New-FeatureBranch 'polaczek-docs'"
    Write-Host "  Invoke-QuickCommit 'feat: dodanie nowej funkcjonalności'"
    Write-Host "  Test-Local"
}

# Aliasy dla łatwiejszego użycia
Set-Alias -Name "dev-status" -Value Check-RepoStatus
Set-Alias -Name "dev-new" -Value New-FeatureBranch
Set-Alias -Name "dev-commit" -Value Invoke-QuickCommit
Set-Alias -Name "dev-test" -Value Test-Local
Set-Alias -Name "dev-merge" -Value Invoke-PrepareMerge
Set-Alias -Name "dev-rollback" -Value Invoke-EmergencyRollback
Set-Alias -Name "dev-help" -Value Show-Help

Write-Host "MyBonzo Development Helper załadowany!" -ForegroundColor Green
Write-Host "Użyj 'dev-help' lub 'Show-Help' aby zobaczyć dostępne komendy." -ForegroundColor Blue