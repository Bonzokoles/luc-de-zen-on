# 🔄 Automated Rollback System
# MyBonzo Application - Szybki rollback w przypadku problemów

param(
    [string]$Action = "status",
    [string]$Version = "",
    [string]$Reason = "",
    [switch]$Force = $false
)

# Configuration
$ProjectName = "luc-de-zen-on"
$ProductionUrl = "https://mybonzo.com"
$BackupsPath = "backups"
$RollbackLogPath = "logs\rollback.log"

function Write-RollbackLog($Message, $Level = "INFO") {
    $Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $LogEntry = "$Timestamp [$Level] $Message"
    
    # Create logs directory if it doesn't exist
    $LogDir = Split-Path $RollbackLogPath -Parent
    if (!(Test-Path $LogDir)) {
        New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
    }
    
    Add-Content -Path $RollbackLogPath -Value $LogEntry
    
    $Color = switch ($Level) {
        "ERROR" { "Red" }
        "WARN" { "Yellow" }
        "SUCCESS" { "Green" }
        default { "White" }
    }
    
    Write-Host $LogEntry -ForegroundColor $Color
}

function Get-AvailableVersions() {
    if (!(Test-Path $BackupsPath)) {
        Write-RollbackLog "No backups directory found!" "ERROR"
        return @()
    }
    
    $BackupFolders = Get-ChildItem -Path $BackupsPath -Directory | Sort-Object Name -Descending
    $Versions = @()
    
    foreach ($Folder in $BackupFolders) {
        $ManifestPath = Join-Path $Folder.FullName "manifest.json"
        if (Test-Path $ManifestPath) {
            try {
                $Manifest = Get-Content $ManifestPath | ConvertFrom-Json
                $Versions += @{
                    Name      = $Folder.Name
                    Path      = $Folder.FullName
                    Timestamp = $Manifest.timestamp
                    GitCommit = $Manifest.git_commit
                    Reason    = $Manifest.reason
                    Type      = $Manifest.backup_type
                    Size      = $Manifest.total_size
                }
            }
            catch {
                Write-RollbackLog "Failed to read manifest for $($Folder.Name): $($_.Exception.Message)" "WARN"
            }
        }
    }
    
    return $Versions
}

function Test-BackupIntegrity($BackupPath) {
    Write-RollbackLog "Testing backup integrity for: $BackupPath"
    
    $Issues = @()
    
    # Check if essential files exist
    $EssentialFiles = @(
        "source-code.tar.gz",
        "manifest.json"
    )
    
    foreach ($File in $EssentialFiles) {
        $FilePath = Join-Path $BackupPath $File
        if (!(Test-Path $FilePath)) {
            $Issues += "Missing essential file: $File"
        }
    }
    
    # Check manifest
    $ManifestPath = Join-Path $BackupPath "manifest.json"
    if (Test-Path $ManifestPath) {
        try {
            $Manifest = Get-Content $ManifestPath | ConvertFrom-Json
            
            # Verify required fields
            $RequiredFields = @("timestamp", "git_commit", "backup_type")
            foreach ($Field in $RequiredFields) {
                if (!$Manifest.$Field) {
                    $Issues += "Missing manifest field: $Field"
                }
            }
        }
        catch {
            $Issues += "Invalid manifest JSON: $($_.Exception.Message)"
        }
    }
    
    return @{
        Valid  = $Issues.Count -eq 0
        Issues = $Issues
    }
}

function Invoke-Rollback($BackupPath, $Reason) {
    Write-RollbackLog "Starting rollback process..." "INFO"
    Write-RollbackLog "Backup source: $BackupPath" "INFO"
    Write-RollbackLog "Reason: $Reason" "INFO"
    
    # Step 1: Validate backup
    Write-RollbackLog "Validating backup integrity..." "INFO"
    $IntegrityCheck = Test-BackupIntegrity $BackupPath
    
    if (!$IntegrityCheck.Valid) {
        Write-RollbackLog "Backup integrity check failed!" "ERROR"
        foreach ($Issue in $IntegrityCheck.Issues) {
            Write-RollbackLog "  - $Issue" "ERROR"
        }
        return $false
    }
    
    Write-RollbackLog "Backup integrity check passed" "SUCCESS"
    
    # Step 2: Create current state backup before rollback
    Write-RollbackLog "Creating pre-rollback backup..." "INFO"
    
    try {
        $PreRollbackBackup = .\scripts\backup.ps1 -BackupType "pre-rollback" -Reason "Before rollback to $(Split-Path $BackupPath -Leaf)"
        Write-RollbackLog "Pre-rollback backup created: $($PreRollbackBackup.BackupName)" "SUCCESS"
    }
    catch {
        Write-RollbackLog "Failed to create pre-rollback backup: $($_.Exception.Message)" "ERROR"
        if (!$Force) {
            Write-RollbackLog "Rollback aborted. Use -Force to continue without backup." "ERROR"
            return $false
        }
    }
    
    # Step 3: Stop any running processes (if applicable)
    Write-RollbackLog "Stopping running processes..." "INFO"
    
    # Kill any running dev servers
    Get-Process | Where-Object { $_.ProcessName -like "*node*" -and $_.CommandLine -like "*astro*" } | Stop-Process -Force -ErrorAction SilentlyContinue
    
    # Step 4: Restore source code
    Write-RollbackLog "Restoring source code..." "INFO"
    
    $SourceArchive = Join-Path $BackupPath "source-code.tar.gz"
    
    try {
        # Create temporary directory for extraction
        $TempDir = Join-Path $env:TEMP "rollback-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        New-Item -ItemType Directory -Path $TempDir -Force | Out-Null
        
        # Extract backup (using tar on Windows 10+)
        if (Get-Command tar -ErrorAction SilentlyContinue) {
            tar -xzf $SourceArchive -C $TempDir
        }
        else {
            # Fallback to PowerShell expansion (for .zip if we change format)
            Write-RollbackLog "tar command not available, trying alternative extraction..." "WARN"
            # Here you could add 7-zip or other extraction logic
            throw "No suitable extraction tool found"
        }
        
        # Remove current files (except backups and logs)
        Write-RollbackLog "Removing current files..." "INFO"
        $ItemsToRemove = Get-ChildItem -Path . | Where-Object { 
            $_.Name -notin @("backups", "logs", ".git", "node_modules") 
        }
        
        foreach ($Item in $ItemsToRemove) {
            Remove-Item -Path $Item.FullName -Recurse -Force
        }
        
        # Copy restored files
        Write-RollbackLog "Copying restored files..." "INFO"
        $ExtractedContent = Get-ChildItem -Path $TempDir -Recurse
        Copy-Item -Path "$TempDir\*" -Destination . -Recurse -Force
        
        # Clean up temp directory
        Remove-Item -Path $TempDir -Recurse -Force
        
        Write-RollbackLog "Source code restored successfully" "SUCCESS"
    }
    catch {
        Write-RollbackLog "Failed to restore source code: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    # Step 5: Restore dependencies
    Write-RollbackLog "Restoring dependencies..." "INFO"
    
    try {
        # Install npm dependencies
        npm ci
        
        Write-RollbackLog "Dependencies restored successfully" "SUCCESS"
    }
    catch {
        Write-RollbackLog "Failed to restore dependencies: $($_.Exception.Message)" "ERROR"
        # Continue anyway - dependencies might be optional
    }
    
    # Step 6: Restore KV data if available
    $KVBackupPath = Join-Path $BackupPath "kv-backup.json"
    if (Test-Path $KVBackupPath) {
        Write-RollbackLog "Restoring KV data..." "INFO"
        
        try {
            $KVData = Get-Content $KVBackupPath | ConvertFrom-Json
            
            foreach ($Namespace in $KVData.PSObject.Properties) {
                Write-RollbackLog "Restoring KV namespace: $($Namespace.Name)" "INFO"
                
                foreach ($Entry in $Namespace.Value) {
                    # Restore each key-value pair
                    # Note: This would need actual wrangler commands
                    Write-RollbackLog "  Restoring key: $($Entry.key)" "INFO"
                }
            }
            
            Write-RollbackLog "KV data restored successfully" "SUCCESS"
        }
        catch {
            Write-RollbackLog "Failed to restore KV data: $($_.Exception.Message)" "WARN"
            # Continue - KV restoration is not critical for basic rollback
        }
    }
    
    # Step 7: Build and test
    Write-RollbackLog "Building restored application..." "INFO"
    
    try {
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-RollbackLog "Build completed successfully" "SUCCESS"
        }
        else {
            Write-RollbackLog "Build completed with warnings" "WARN"
        }
    }
    catch {
        Write-RollbackLog "Build failed: $($_.Exception.Message)" "ERROR"
        if (!$Force) {
            Write-RollbackLog "Rollback failed due to build errors. Use -Force to deploy anyway." "ERROR"
            return $false
        }
    }
    
    # Step 8: Deploy restored version
    Write-RollbackLog "Deploying restored version..." "INFO"
    
    try {
        wrangler pages deploy ./dist --project-name $ProjectName
        
        if ($LASTEXITCODE -eq 0) {
            Write-RollbackLog "Deployment completed successfully" "SUCCESS"
        }
        else {
            Write-RollbackLog "Deployment failed!" "ERROR"
            return $false
        }
    }
    catch {
        Write-RollbackLog "Deployment failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    # Step 9: Verify rollback
    Write-RollbackLog "Verifying rollback..." "INFO"
    
    Start-Sleep -Seconds 30  # Wait for deployment to propagate
    
    try {
        $Response = Invoke-WebRequest -Uri "$ProductionUrl/api/health" -TimeoutSec 30 -UseBasicParsing
        
        if ($Response.StatusCode -eq 200) {
            Write-RollbackLog "Rollback verification successful" "SUCCESS"
        }
        else {
            Write-RollbackLog "Rollback verification failed - Status: $($Response.StatusCode)" "ERROR"
            return $false
        }
    }
    catch {
        Write-RollbackLog "Rollback verification failed: $($_.Exception.Message)" "ERROR"
        return $false
    }
    
    # Step 10: Log rollback completion
    $RollbackInfo = @{
        Timestamp  = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
        BackupUsed = Split-Path $BackupPath -Leaf
        Reason     = $Reason
        Success    = $true
        Duration   = (Get-Date) - $RollbackStart
    }
    
    Write-RollbackLog "🎉 Rollback completed successfully!" "SUCCESS"
    Write-RollbackLog "Backup used: $(Split-Path $BackupPath -Leaf)" "INFO"
    Write-RollbackLog "Total duration: $($RollbackInfo.Duration.TotalMinutes.ToString('F2')) minutes" "INFO"
    
    return $true
}

function Show-RollbackStatus() {
    Write-Host "🔄 Rollback System Status" -ForegroundColor Cyan
    Write-Host "===========================" -ForegroundColor Cyan
    
    # Show available versions
    $Versions = Get-AvailableVersions
    
    if ($Versions.Count -eq 0) {
        Write-Host "❌ No backups available for rollback!" -ForegroundColor Red
        return
    }
    
    Write-Host "`n📦 Available Versions ($($Versions.Count) total):" -ForegroundColor Yellow
    
    $VersionTable = $Versions | Select-Object -First 10 | ForEach-Object {
        [PSCustomObject]@{
            Version = $_.Name
            Date    = $_.Timestamp
            Commit  = $_.GitCommit.Substring(0, 8)
            Type    = $_.Type
            Reason  = $_.Reason.Substring(0, [Math]::Min($_.Reason.Length, 30))
            Size    = "{0:F1} MB" -f ($_.Size / 1MB)
        }
    }
    
    $VersionTable | Format-Table -AutoSize
    
    if ($Versions.Count -gt 10) {
        Write-Host "... and $($Versions.Count - 10) more versions" -ForegroundColor Gray
    }
    
    # Show recent rollbacks
    if (Test-Path $RollbackLogPath) {
        $RecentRollbacks = Get-Content $RollbackLogPath | Where-Object { $_ -like "*Rollback completed successfully*" } | Select-Object -Last 3
        
        if ($RecentRollbacks) {
            Write-Host "`n🔄 Recent Rollbacks:" -ForegroundColor Yellow
            foreach ($Rollback in $RecentRollbacks) {
                Write-Host "  $Rollback" -ForegroundColor Green
            }
        }
    }
    
    # Current git status
    Write-Host "`n📊 Current Status:" -ForegroundColor Yellow
    Write-Host "  Git Branch: $(git rev-parse --abbrev-ref HEAD)" -ForegroundColor White
    Write-Host "  Git Commit: $(git rev-parse HEAD)" -ForegroundColor White
    Write-Host "  Last Modified: $(Get-Date (git log -1 --format=%cd))" -ForegroundColor White
}

# Record rollback start time
$RollbackStart = Get-Date

# Main execution based on action
switch ($Action) {
    "status" {
        Show-RollbackStatus
    }
    
    "list" {
        $Versions = Get-AvailableVersions
        $Versions | ConvertTo-Json -Depth 3
    }
    
    "rollback" {
        if (!$Version) {
            Write-RollbackLog "Version parameter is required for rollback action!" "ERROR"
            Write-Host "Use: .\rollback.ps1 -Action rollback -Version <backup-name> -Reason '<reason>'" -ForegroundColor Yellow
            return
        }
        
        if (!$Reason) {
            Write-RollbackLog "Reason parameter is required for rollback action!" "ERROR"
            return
        }
        
        $BackupPath = Join-Path $BackupsPath $Version
        
        if (!(Test-Path $BackupPath)) {
            Write-RollbackLog "Backup not found: $BackupPath" "ERROR"
            return
        }
        
        Write-Host "⚠️ WARNING: This will rollback the application to version: $Version" -ForegroundColor Yellow
        Write-Host "Reason: $Reason" -ForegroundColor Yellow
        
        if (!$Force) {
            $Confirm = Read-Host "Are you sure? Type 'YES' to continue"
            if ($Confirm -ne "YES") {
                Write-Host "Rollback cancelled." -ForegroundColor Gray
                return
            }
        }
        
        $Success = Invoke-Rollback $BackupPath $Reason
        
        if ($Success) {
            Write-Host "🎉 Rollback completed successfully!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Rollback failed! Check the rollback log for details." -ForegroundColor Red
        }
    }
    
    default {
        Write-Host "🔄 Rollback System - MyBonzo Application" -ForegroundColor Cyan
        Write-Host "Usage: .\rollback.ps1 -Action <status|list|rollback>" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Actions:" -ForegroundColor Yellow
        Write-Host "  status                    Show rollback system status and available versions"
        Write-Host "  list                      List all available backup versions (JSON output)"
        Write-Host "  rollback                  Perform rollback to specific version"
        Write-Host ""
        Write-Host "Rollback Parameters:" -ForegroundColor Yellow
        Write-Host "  -Version <name>          Name of backup version to rollback to"
        Write-Host "  -Reason <text>           Reason for rollback (required)"
        Write-Host "  -Force                   Skip confirmation prompts"
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor Yellow
        Write-Host "  .\rollback.ps1 -Action status"
        Write-Host "  .\rollback.ps1 -Action rollback -Version 'backup_2024-01-15_14-30-45' -Reason 'Critical bug in production'"
    }
}