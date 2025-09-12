# 🔒 Backup Script for Windows PowerShell
# MyBonzo Application - Automated Backup System

param(
    [string]$BackupType = "manual",
    [string]$Reason = "user_initiated"
)

# Configuration
$BackupDir = ".\backups"
$ProjectName = "luc-de-zen-on"
$Date = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$BackupName = "backup_$Date"
if ($Reason -ne "user_initiated") { $BackupName += "_$Reason" }

# Colors for output
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

Write-ColorOutput Green "🔄 Starting backup process..."

# Create backup directories
$Dirs = @("$BackupDir\daily", "$BackupDir\manual", "$BackupDir\pre-deploy")
foreach ($Dir in $Dirs) {
    if (!(Test-Path $Dir)) {
        New-Item -ItemType Directory -Force -Path $Dir | Out-Null
    }
}

# Determine backup location based on type
$TargetDir = switch ($BackupType) {
    "daily" { "$BackupDir\daily" }
    "pre-deploy" { "$BackupDir\pre-deploy" }
    default { "$BackupDir\manual" }
}

Write-ColorOutput Yellow "📦 Creating source code backup..."

# Create Git archive if Git is available
if (Get-Command git -ErrorAction SilentlyContinue) {
    try {
        git archive --format=zip --output="$TargetDir\${BackupName}_source.zip" HEAD
        Write-ColorOutput Green "✅ Source code backup created"
    }
    catch {
        Write-ColorOutput Red "⚠️ Git archive failed: $($_.Exception.Message)"
    }
}
else {
    Write-ColorOutput Red "⚠️ Git not found, skipping source code backup"
}

Write-ColorOutput Yellow "🗄️ Backing up KV stores..."

# Backup KV stores if Wrangler is available
if (Get-Command wrangler -ErrorAction SilentlyContinue) {
    $KVStores = @("SESSION", "AGENTS", "AI_AGENTS", "IMAGES")
    
    foreach ($Store in $KVStores) {
        try {
            $Output = wrangler kv:bulk get --binding $Store --preview false 2>&1
            if ($LASTEXITCODE -eq 0 -and $Output) {
                $Output | Out-File -FilePath "$TargetDir\${BackupName}_kv_$($Store.ToLower()).json" -Encoding UTF8
                Write-ColorOutput Green "✅ $Store KV backup created"
            }
            else {
                Write-ColorOutput Yellow "ℹ️ $Store KV not found or empty"
            }
        }
        catch {
            Write-ColorOutput Yellow "ℹ️ $Store KV backup skipped: $($_.Exception.Message)"
        }
    }
}
else {
    Write-ColorOutput Red "⚠️ Wrangler not found, skipping KV backup"
}

Write-ColorOutput Yellow "⚙️ Backing up configuration files..."

# Backup configuration files
$ConfigFiles = @(
    "package.json",
    "package-lock.json", 
    "astro.config.mjs",
    "wrangler.jsonc",
    "tailwind.config.mjs",
    "tsconfig.json",
    ".env.example"
)

$ConfigBackupPath = "$TargetDir\${BackupName}_config.zip"
try {
    $ExistingFiles = $ConfigFiles | Where-Object { Test-Path $_ }
    if ($ExistingFiles) {
        Compress-Archive -Path $ExistingFiles -DestinationPath $ConfigBackupPath -Force
        Write-ColorOutput Green "✅ Configuration backup created"
    }
}
catch {
    Write-ColorOutput Red "⚠️ Configuration backup failed: $($_.Exception.Message)"
}

Write-ColorOutput Yellow "📝 Creating backup manifest..."

# Create backup manifest
$GitCommit = if (Get-Command git -ErrorAction SilentlyContinue) { 
    try { git rev-parse HEAD } catch { "unknown" }
}
else { "unknown" }

$GitBranch = if (Get-Command git -ErrorAction SilentlyContinue) { 
    try { git rev-parse --abbrev-ref HEAD } catch { "unknown" }
}
else { "unknown" }

$ManifestData = @{
    backup_name = $BackupName
    created_at  = (Get-Date -Format "yyyy-MM-ddTHH:mm:ssZ")
    git_commit  = $GitCommit
    git_branch  = $GitBranch
    files       = @(
        "${BackupName}_source.zip",
        "${BackupName}_kv_session.json",
        "${BackupName}_kv_agents.json", 
        "${BackupName}_kv_ai_agents.json",
        "${BackupName}_kv_images.json",
        "${BackupName}_config.zip"
    )
    backup_type = $BackupType
    reason      = $Reason
    project     = $ProjectName
}

$ManifestJson = $ManifestData | ConvertTo-Json -Depth 3
$ManifestJson | Out-File -FilePath "$TargetDir\${BackupName}_manifest.json" -Encoding UTF8

# Calculate backup size
$BackupSize = (Get-ChildItem $TargetDir -Recurse | Measure-Object -Property Length -Sum).Sum
$BackupSizeMB = [math]::Round($BackupSize / 1MB, 2)

Write-ColorOutput Green "✅ Backup completed successfully!"
Write-ColorOutput White "📊 Backup location: $TargetDir"
Write-ColorOutput White "📊 Backup size: $BackupSizeMB MB"
Write-ColorOutput White "🏷️ Backup name: $BackupName"

Write-ColorOutput Yellow "🧹 Cleaning old backups..."

# Clean old backups (keep last 10)
$OldBackups = Get-ChildItem "$TargetDir\backup_*_manifest.json" | Sort-Object LastWriteTime -Descending | Select-Object -Skip 10

foreach ($OldManifest in $OldBackups) {
    $BackupPrefix = $OldManifest.BaseName -replace "_manifest$", ""
    Write-Output "Removing old backup: $BackupPrefix"
    
    Get-ChildItem "$TargetDir\$BackupPrefix*" | Remove-Item -Force
}

Write-ColorOutput Green "🎉 Backup process completed!"

# Return backup info for automation
return @{
    BackupName = $BackupName
    BackupPath = $TargetDir
    BackupSize = $BackupSizeMB
}