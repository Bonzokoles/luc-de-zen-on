#!/bin/bash
# Test script to verify GitHub CLI is properly enabled

echo "🔍 Testing GitHub CLI setup..."
echo ""

# Test 1: Check if gh is installed
echo "1. Checking if GitHub CLI is installed..."
if command -v gh &> /dev/null; then
    echo "   ✅ GitHub CLI is installed"
    gh --version
else
    echo "   ❌ GitHub CLI is not installed"
    exit 1
fi

echo ""

# Test 2: Check authentication status
echo "2. Checking GitHub CLI authentication..."
if gh auth status &> /dev/null; then
    echo "   ✅ GitHub CLI is authenticated"
    gh auth status 2>&1 | head -3
else
    echo "   ⚠️  GitHub CLI is not authenticated (expected in CI without GH_TOKEN)"
    echo "   Note: Set GH_TOKEN environment variable for authentication"
fi

echo ""

# Test 3: Verify workflow file syntax
echo "3. Validating workflow YAML syntax..."
if command -v python3 &> /dev/null; then
    python3 -c "import yaml; yaml.safe_load(open('.github/workflows/deploy.yml'))"
    if [ $? -eq 0 ]; then
        echo "   ✅ Workflow YAML syntax is valid"
    else
        echo "   ❌ Workflow YAML syntax is invalid"
        exit 1
    fi
else
    echo "   ⚠️  Python3 not available, skipping YAML validation"
fi

echo ""

# Test 4: Check for documentation
echo "4. Checking GitHub CLI documentation..."
if [ -f "GITHUB_CLI_GUIDE.md" ]; then
    echo "   ✅ GitHub CLI guide exists ($(wc -l < GITHUB_CLI_GUIDE.md) lines)"
else
    echo "   ❌ GitHub CLI guide not found"
    exit 1
fi

echo ""

# Test 5: Verify README reference
echo "5. Verifying README mentions GitHub CLI..."
if grep -q "GITHUB_CLI_GUIDE" README.md; then
    echo "   ✅ README references GitHub CLI guide"
else
    echo "   ❌ README does not reference GitHub CLI guide"
    exit 1
fi

echo ""
echo "✅ All GitHub CLI tests passed!"
echo ""
echo "📚 Read the guide: GITHUB_CLI_GUIDE.md"
echo "📝 Workflow with GitHub CLI: .github/workflows/deploy.yml"
