# GitHub Branch Protection Rules Configuration

## Overview
This document provides instructions for configuring branch protection rules on GitHub to enforce the security and workflow standards defined in GITHUB_RULEZ.

## Required Branch Protection Rules

### 1. Main Branch Protection (`main`)
Navigate to: **Settings** → **Branches** → **Add rule**

**Branch name pattern:** `main`

**Settings to enable:**
- ✅ Require a pull request before merging
- ✅ Require approvals (minimum 1 reviewer)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require review from Code Owners
- ✅ Restrict pushes that create matching branches
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Required status checks:**
- `test` (CI tests)
- `security-scan` (Security vulnerability scan)
- `lint` (Code linting)
- `build` (Project build)

### 2. Develop Branch Protection (`develop`)
Navigate to: **Settings** → **Branches** → **Add rule**

**Branch name pattern:** `develop`

**Settings to enable:**
- ✅ Require a pull request before merging
- ✅ Require approvals (minimum 1 reviewer)
- ✅ Dismiss stale pull request approvals when new commits are pushed
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Required status checks:**
- `test` (CI tests)
- `lint` (Code linting)
- `build` (Project build)

### 3. Feature Branch Protection (`feature/*`)
Navigate to: **Settings** → **Branches** → **Add rule**

**Branch name pattern:** `feature/*`

**Settings to enable:**
- ✅ Require a pull request before merging
- ✅ Require approvals (minimum 1 reviewer)
- ✅ Require status checks to pass before merging

**Required status checks:**
- `test` (CI tests)
- `lint` (Code linting)
- `build` (Project build)

## Code Owners Configuration

The `.github/CODEOWNERS` file has been created with the following ownership rules:

```
# Global owners - must review all changes
* @stolarczyk-ams

# Frontend and UI components
/src/ @stolarczyk-ams
/public/ @stolarczyk-ams

# Backend and API
/src/pages/api/ @stolarczyk-ams
/src/workers/ @stolarczyk-ams

# Configuration files
/.github/ @stolarczyk-ams
/wrangler.toml @stolarczyk-ams
```

## Automated Enforcement

The following workflows will help enforce these rules:

1. **Feature Branch CI/CD** (`feature-branch-ci-cd.yml`)
   - Runs tests, linting, and security scans on all branches
   - Deploys preview versions for feature branches
   - Requires all checks to pass before merge

2. **Security Audit** (`security-audit.yml`)
   - Daily automated security scans
   - Dependency vulnerability checks
   - Secrets exposure detection

3. **Branch Management** (`branch-management.yml`)
   - Enforces branch naming conventions
   - Automatic cleanup of merged branches
   - Branch status reporting

## Manual Verification Steps

After configuring branch protection:

1. **Test Branch Protection:**
   - Create a new feature branch: `git checkout -b feature/test-protection`
   - Make a small change and commit
   - Try to push directly to `main` - should be blocked
   - Create a PR and verify all required checks run

2. **Test Code Owners:**
   - Create a PR that modifies files in `.github/`
   - Verify that the code owner is automatically requested for review

3. **Test Security Features:**
   - Run the security audit workflow manually
   - Check that no secrets are exposed in code
   - Verify dependency audit passes

## Troubleshooting

### Common Issues:

1. **"Required status checks" not showing:**
   - Ensure workflows are running and producing the expected check names
   - Check workflow file syntax and job names

2. **Code Owners not working:**
   - Verify `.github/CODEOWNERS` file exists and has correct syntax
   - Check that the code owner username matches exactly

3. **Branch naming enforcement failing:**
   - Ensure the branch management workflow is enabled
   - Check that branch names follow the pattern: `feature/*`, `hotfix/*`, `bugfix/*`

### Getting Help:

If you encounter issues:
1. Check the Actions tab for workflow run details
2. Review the branch protection settings in repository Settings
3. Verify all required files are present and correctly formatted

## Security Benefits

These branch protection rules provide:

- **Code Review Requirements:** All changes must be reviewed
- **Automated Testing:** Prevents broken code from being merged
- **Security Scanning:** Catches vulnerabilities before deployment
- **Access Control:** Limits who can push to critical branches
- **Audit Trail:** Maintains history of all changes and approvals

## Maintenance

- **Monthly Review:** Review and update branch protection rules
- **Workflow Updates:** Keep GitHub Actions workflows current
- **Code Owner Updates:** Update CODEOWNERS as team changes
- **Security Updates:** Regularly update security scanning tools
