# 🛡️ Security Monitoring Setup
# MyBonzo Application - Monitoring i alerty bezpieczeństwa

param(
    [string]$Action = "setup",
    [string]$AlertWebhook = "",
    [int]$CheckInterval = 300  # 5 minutes
)

# Configuration
$ProjectName = "luc-de-zen-on"
$ProductionUrl = "https://mybonzo.com"
$StagingUrl = "https://staging.mybonzo.com" 
$LogPath = "logs\security-monitor.log"
$AlertsPath = "logs\security-alerts.json"

function Write-Log($Message, $Level = "INFO") {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "$Timestamp [$Level] $Message"
    
    # Create logs directory if it doesn't exist
    $LogDir = Split-Path $LogPath -Parent
    if (!(Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    
    Add-Content -Path $LogPath -Value $LogEntry
    Write-Host $LogEntry -ForegroundColor $(if ($Level -eq "ERROR") { "Red" } elseif ($Level -eq "WARN") { "Yellow" } else { "Green" })
}

function Send-Alert($Title, $Message, $Level = "INFO") {
    $Alert = @{
        Timestamp   = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
        Level       = $Level
        Title       = $Title
        Message     = $Message
        Environment = "production"
        Project     = $ProjectName
    }
    
    # Log alert locally
    Write-Log "ALERT: $Title - $Message" $Level
    
    # Save to alerts file
    if (Test-Path $AlertsPath) {
        $Alerts = Get-Content $AlertsPath | ConvertFrom-Json
    }
    else {
        $Alerts = @()
    }
    
    $Alerts += $Alert
    $Alerts | ConvertTo-Json -Depth 3 | Set-Content $AlertsPath
    
    # Send webhook notification if configured
    if ($AlertWebhook) {
        try {
            $WebhookPayload = @{
                text        = "🚨 $Title"
                attachments = @(
                    @{
                        color  = if ($Level -eq "ERROR") { "danger" } elseif ($Level -eq "WARN") { "warning" } else { "good" }
                        fields = @(
                            @{title = "Message"; value = $Message; short = $false }
                            @{title = "Environment"; value = $Alert.Environment; short = $true }
                            @{title = "Time"; value = $Alert.Timestamp; short = $true }
                        )
                    }
                )
            }
            
            Invoke-RestMethod -Uri $AlertWebhook -Method Post -Body ($WebhookPayload | ConvertTo-Json -Depth 3) -ContentType "application/json"
        }
        catch {
            Write-Log "Failed to send webhook alert: $($_.Exception.Message)" "ERROR"
        }
    }
}

function Test-ApiHealth($Url) {
    try {
        $Response = Invoke-WebRequest -Uri "$Url/api/health" -TimeoutSec 10 -UseBasicParsing
        return @{
            Healthy      = $Response.StatusCode -eq 200
            StatusCode   = $Response.StatusCode
            ResponseTime = (Measure-Command { Invoke-WebRequest -Uri "$Url/api/health" -TimeoutSec 10 -UseBasicParsing }).TotalMilliseconds
        }
    }
    catch {
        return @{
            Healthy      = $false
            Error        = $_.Exception.Message
            ResponseTime = $null
        }
    }
}

function Test-SecurityHeaders($Url) {
    try {
        $Response = Invoke-WebRequest -Uri $Url -TimeoutSec 10 -UseBasicParsing
        $Headers = $Response.Headers
        
        $SecurityHeaders = @{
            "Content-Security-Policy"   = $Headers."Content-Security-Policy"
            "X-Frame-Options"           = $Headers."X-Frame-Options"
            "X-Content-Type-Options"    = $Headers."X-Content-Type-Options"
            "Strict-Transport-Security" = $Headers."Strict-Transport-Security"
            "X-XSS-Protection"          = $Headers."X-XSS-Protection"
        }
        
        $MissingHeaders = @()
        foreach ($Header in $SecurityHeaders.Keys) {
            if (!$SecurityHeaders[$Header]) {
                $MissingHeaders += $Header
            }
        }
        
        return @{
            Headers = $SecurityHeaders
            Missing = $MissingHeaders
            Secure  = $MissingHeaders.Count -eq 0
        }
    }
    catch {
        return @{
            Error  = $_.Exception.Message
            Secure = $false
        }
    }
}

function Test-UnauthorizedChanges() {
    try {
        # Check git status for unauthorized changes
        $GitStatus = git status --porcelain 2>$null
        
        # Check for unusual files
        $SuspiciousFiles = Get-ChildItem -Path . -Recurse -Include "*.php", "*.jsp", "*.exe" -ErrorAction SilentlyContinue
        
        # Check for large files that might be malicious uploads
        $LargeFiles = Get-ChildItem -Path . -Recurse | Where-Object { $_.Length -gt 10MB -and $_.Name -notmatch "\.(zip|tar|gz|mp4|avi)$" }
        
        $Issues = @()
        
        if ($GitStatus) {
            $Issues += "Uncommitted changes detected: $($GitStatus -join ', ')"
        }
        
        if ($SuspiciousFiles) {
            $Issues += "Suspicious files found: $($SuspiciousFiles.FullName -join ', ')"
        }
        
        if ($LargeFiles) {
            $Issues += "Large suspicious files: $($LargeFiles.FullName -join ', ')"
        }
        
        return @{
            Clean  = $Issues.Count -eq 0
            Issues = $Issues
        }
    }
    catch {
        return @{
            Clean = $false
            Error = $_.Exception.Message
        }
    }
}

function Run-SecurityScan() {
    Write-Log "Starting security scan..."
    
    $Results = @{
        Timestamp  = Get-Date
        Production = @{}
        Staging    = @{}
        FileSystem = @{}
    }
    
    # Test production health
    Write-Log "Checking production health..."
    $Results.Production.Health = Test-ApiHealth $ProductionUrl
    
    if (!$Results.Production.Health.Healthy) {
        Send-Alert "Production Health Check Failed" "Production API is not responding correctly. Error: $($Results.Production.Health.Error)" "ERROR"
    }
    
    # Test production security headers
    Write-Log "Checking production security headers..."
    $Results.Production.Security = Test-SecurityHeaders $ProductionUrl
    
    if (!$Results.Production.Security.Secure) {
        Send-Alert "Production Security Headers Missing" "Missing headers: $($Results.Production.Security.Missing -join ', ')" "WARN"
    }
    
    # Test staging health
    Write-Log "Checking staging health..."
    $Results.Staging.Health = Test-ApiHealth $StagingUrl
    
    if (!$Results.Staging.Health.Healthy) {
        Send-Alert "Staging Health Check Failed" "Staging API is not responding correctly. Error: $($Results.Staging.Health.Error)" "WARN"
    }
    
    # Check file system security
    Write-Log "Checking file system security..."
    $Results.FileSystem = Test-UnauthorizedChanges
    
    if (!$Results.FileSystem.Clean) {
        Send-Alert "Unauthorized Changes Detected" "Issues found: $($Results.FileSystem.Issues -join '; ')" "ERROR"
    }
    
    # Save results
    $ResultsPath = "logs\security-scan-$(Get-Date -Format 'yyyy-MM-dd-HH-mm').json"
    $Results | ConvertTo-Json -Depth 5 | Set-Content $ResultsPath
    
    Write-Log "Security scan completed. Results saved to: $ResultsPath"
    
    return $Results
}

function Start-ContinuousMonitoring() {
    Write-Log "Starting continuous security monitoring (interval: $CheckInterval seconds)..."
    
    while ($true) {
        try {
            Run-SecurityScan | Out-Null
            Start-Sleep -Seconds $CheckInterval
        }
        catch {
            Write-Log "Error in monitoring loop: $($_.Exception.Message)" "ERROR"
            Start-Sleep -Seconds 60  # Wait longer on error
        }
    }
}

function Show-SecurityStatus() {
    Write-Host "🛡️ Security Status Dashboard" -ForegroundColor Cyan
    Write-Host "================================" -ForegroundColor Cyan
    
    # Show recent alerts
    if (Test-Path $AlertsPath) {
        $RecentAlerts = Get-Content $AlertsPath | ConvertFrom-Json | Sort-Object Timestamp -Descending | Select-Object -First 5
        
        Write-Host "`n📊 Recent Alerts (Last 5):" -ForegroundColor Yellow
        foreach ($Alert in $RecentAlerts) {
            $Color = if ($Alert.Level -eq "ERROR") { "Red" } elseif ($Alert.Level -eq "WARN") { "Yellow" } else { "Green" }
            Write-Host "  [$($Alert.Level)] $($Alert.Title) - $($Alert.Timestamp)" -ForegroundColor $Color
        }
    }
    
    # Run current scan
    Write-Host "`n🔍 Current Security Scan:" -ForegroundColor Yellow
    $CurrentResults = Run-SecurityScan
    
    # Production status
    $ProdStatus = if ($CurrentResults.Production.Health.Healthy) { "✅ Healthy" } else { "❌ Unhealthy" }
    Write-Host "  Production: $ProdStatus" -ForegroundColor $(if ($CurrentResults.Production.Health.Healthy) { "Green" } else { "Red" })
    
    # Staging status
    $StagingStatus = if ($CurrentResults.Staging.Health.Healthy) { "✅ Healthy" } else { "❌ Unhealthy" }
    Write-Host "  Staging: $StagingStatus" -ForegroundColor $(if ($CurrentResults.Staging.Health.Healthy) { "Green" } else { "Red" })
    
    # File system status
    $FileStatus = if ($CurrentResults.FileSystem.Clean) { "✅ Clean" } else { "❌ Issues Found" }
    Write-Host "  File System: $FileStatus" -ForegroundColor $(if ($CurrentResults.FileSystem.Clean) { "Green" } else { "Red" })
    
    Write-Host "`n📁 Log Files:" -ForegroundColor Yellow
    Write-Host "  Security Log: $LogPath"
    Write-Host "  Alerts Log: $AlertsPath"
}

# Main execution based on action
switch ($Action) {
    "setup" {
        Write-Log "Setting up security monitoring..."
        
        # Create necessary directories
        New-Item -ItemType Directory -Path "logs" -Force | Out-Null
        
        # Create initial configuration
        $Config = @{
            ProjectName   = $ProjectName
            ProductionUrl = $ProductionUrl
            StagingUrl    = $StagingUrl
            CheckInterval = $CheckInterval
            AlertWebhook  = $AlertWebhook
            SetupTime     = Get-Date
        }
        
        $Config | ConvertTo-Json | Set-Content "security-config.json"
        
        Write-Log "Security monitoring setup completed!"
        Write-Host "`n🛡️ Security monitoring configured!" -ForegroundColor Green
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Run 'monitor' to start continuous monitoring"
        Write-Host "2. Run 'status' to check current security status"
        Write-Host "3. Run 'scan' for one-time security scan"
    }
    
    "monitor" {
        Start-ContinuousMonitoring
    }
    
    "scan" {
        Run-SecurityScan | ConvertTo-Json -Depth 5
    }
    
    "status" {
        Show-SecurityStatus
    }
    
    default {
        Write-Host "Usage: .\security-monitor.ps1 -Action <setup|monitor|scan|status>" -ForegroundColor Yellow
        Write-Host "Options:"
        Write-Host "  -AlertWebhook <url>   Webhook URL for alerts"
        Write-Host "  -CheckInterval <sec>  Monitoring interval (default: 300)"
    }
}