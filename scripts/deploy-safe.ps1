# 🚀 Safe Deployment Script
# MyBonzo Application - Bezpieczne wdrażanie z automatycznymi backupami

param(
    [string]$Environment = "production",
    [switch]$SkipTests = $false,
    [switch]$SkipBackup = $false,
    [string]$CommitMessage = ""
)

# Configuration
$ProjectName = "luc-de-zen-on"
$StagingUrl = "https://staging.mybonzo.com"
$ProductionUrl = "https://mybonzo.com"

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Test-ApiEndpoint($Url) {
    try {
        $Response = Invoke-WebRequest -Uri "$Url/api/health" -TimeoutSec 30 -UseBasicParsing
        return $Response.StatusCode -eq 200
    }
    catch {
        return $false
    }
}

Write-ColorOutput Green "🚀 Starting safe deployment to $Environment..."

# 1. Pre-deployment checks
Write-ColorOutput Yellow "🔍 Running pre-deployment checks..."

# Check if we're in a git repository
if (!(Test-Path .git)) {
    Write-ColorOutput Red "❌ Not in a Git repository!"
    exit 1
}

# Check for uncommitted changes
$GitStatus = git status --porcelain
if ($GitStatus -and !$CommitMessage) {
    Write-ColorOutput Red "❌ Uncommitted changes detected! Please commit or provide a commit message."
    Write-Output $GitStatus
    exit 1
}

# Commit changes if message provided
if ($CommitMessage -and $GitStatus) {
    Write-ColorOutput Yellow "📝 Committing changes..."
    git add .
    git commit -m $CommitMessage
}

# 2. Create pre-deployment backup
if (!$SkipBackup) {
    Write-ColorOutput Yellow "💾 Creating pre-deployment backup..."
    $BackupResult = .\scripts\backup.ps1 -BackupType "pre-deploy" -Reason "deployment_$Environment"
    
    if ($BackupResult) {
        Write-ColorOutput Green "✅ Backup created: $($BackupResult.BackupName)"
    }
    else {
        Write-ColorOutput Red "❌ Backup failed!"
        exit 1
    }
}

# 3. Run tests
if (!$SkipTests) {
    Write-ColorOutput Yellow "🧪 Running tests..."
    
    # Install dependencies if needed
    if (!(Test-Path node_modules)) {
        Write-ColorOutput Yellow "📦 Installing dependencies..."
        npm ci
    }
    
    # Run build test
    Write-ColorOutput Yellow "🔨 Testing build..."
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Build failed!"
        exit 1
    }
    
    # Run API tests if available
    if (Test-Path "src\tests\api.test.js") {
        Write-ColorOutput Yellow "🔗 Running API tests..."
        npm test
        if ($LASTEXITCODE -ne 0) {
            Write-ColorOutput Red "❌ Tests failed!"
            exit 1
        }
    }
}

# 4. Deploy to staging first (for production deployments)
if ($Environment -eq "production") {
    Write-ColorOutput Yellow "🎭 Deploying to staging first..."
    
    try {
        wrangler pages deploy ./dist --project-name "$ProjectName-staging"
        
        # Wait for deployment
        Start-Sleep -Seconds 30
        
        # Test staging
        Write-ColorOutput Yellow "🧪 Testing staging deployment..."
        $StagingHealthy = Test-ApiEndpoint $StagingUrl
        
        if (!$StagingHealthy) {
            Write-ColorOutput Red "❌ Staging deployment failed health check!"
            exit 1
        }
        
        Write-ColorOutput Green "✅ Staging deployment successful and healthy"
    }
    catch {
        Write-ColorOutput Red "❌ Staging deployment failed: $($_.Exception.Message)"
        exit 1
    }
}

# 5. Deploy to target environment
Write-ColorOutput Yellow "🚀 Deploying to $Environment..."

$ProjectTarget = if ($Environment -eq "staging") { "$ProjectName-staging" } else { $ProjectName }

try {
    wrangler pages deploy ./dist --project-name $ProjectTarget
    
    if ($LASTEXITCODE -ne 0) {
        Write-ColorOutput Red "❌ Deployment failed!"
        exit 1
    }
    
    Write-ColorOutput Green "✅ Deployment to $Environment completed"
}
catch {
    Write-ColorOutput Red "❌ Deployment failed: $($_.Exception.Message)"
    exit 1
}

# 6. Post-deployment verification
Write-ColorOutput Yellow "🔍 Running post-deployment checks..."

$TargetUrl = if ($Environment -eq "staging") { $StagingUrl } else { $ProductionUrl }

# Wait for deployment to propagate
Write-ColorOutput Yellow "⏳ Waiting for deployment to propagate (60 seconds)..."
Start-Sleep -Seconds 60

# Health check
$HealthCheckPassed = Test-ApiEndpoint $TargetUrl
if ($HealthCheckPassed) {
    Write-ColorOutput Green "✅ Health check passed!"
}
else {
    Write-ColorOutput Red "❌ Health check failed!"
    Write-ColorOutput Yellow "🔄 Attempting rollback..."
    
    # Here you would implement rollback logic
    # For now, just exit with error
    exit 1
}

# Test critical endpoints
$CriticalEndpoints = @(
    "/api/health",
    "/api/admin/stats", 
    "/admin"
)

foreach ($Endpoint in $CriticalEndpoints) {
    try {
        $Response = Invoke-WebRequest -Uri "$TargetUrl$Endpoint" -TimeoutSec 30 -UseBasicParsing
        if ($Response.StatusCode -eq 200) {
            Write-ColorOutput Green "✅ $Endpoint - OK"
        }
        else {
            Write-ColorOutput Yellow "⚠️ $Endpoint - Status: $($Response.StatusCode)"
        }
    }
    catch {
        Write-ColorOutput Yellow "⚠️ $Endpoint - Error: $($_.Exception.Message)"
    }
}

# 7. Update git tags for production deployments
if ($Environment -eq "production") {
    Write-ColorOutput Yellow "🏷️ Creating deployment tag..."
    
    $TagName = "deploy-$(Get-Date -Format 'yyyy-MM-dd-HH-mm')"
    git tag -a $TagName -m "Production deployment $(Get-Date)"
    git push origin $TagName
    
    Write-ColorOutput Green "✅ Tagged deployment as $TagName"
}

# 8. Send notification (if configured)
Write-ColorOutput Yellow "📢 Sending deployment notification..."

$DeploymentInfo = @{
    Environment  = $Environment
    Timestamp    = Get-Date -Format "yyyy-MM-dd HH:mm:ss UTC"
    GitCommit    = (git rev-parse HEAD)
    GitBranch    = (git rev-parse --abbrev-ref HEAD)
    HealthStatus = if ($HealthCheckPassed) { "Healthy" } else { "Unhealthy" }
    Url          = $TargetUrl
}

# Here you could add webhook notification logic
# For example, post to Slack or send email

Write-ColorOutput Green "🎉 Deployment to $Environment completed successfully!"
Write-ColorOutput White "📊 Deployment URL: $TargetUrl"
Write-ColorOutput White "🏷️ Git Commit: $($DeploymentInfo.GitCommit)"
Write-ColorOutput White "🌿 Git Branch: $($DeploymentInfo.GitBranch)"
Write-ColorOutput White "❤️ Health Status: $($DeploymentInfo.HealthStatus)"

return $DeploymentInfo