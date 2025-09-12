# Cloudflare Secrets Store Configuration Guide

## Overview
This guide provides step-by-step instructions for configuring Cloudflare Secrets Store to securely manage secrets for your MyBonzo platform, following the security standards defined in GITHUB_RULEZ.

## Prerequisites

1. **Cloudflare Account:** Active Cloudflare account with Pages and Workers enabled
2. **Wrangler CLI:** Install Wrangler globally
   ```bash
   npm install -g wrangler
   ```
3. **Cloudflare API Token:** Generate an API token with the following permissions:
   - Account: Cloudflare Pages:Edit
   - Account: Workers:Edit
   - Account: Secrets Store:Edit
   - Zone: Zone:Read (for your domain)

## Step 1: Authenticate Wrangler

```bash
wrangler auth login
```

Or use API token:
```bash
wrangler auth token <YOUR_API_TOKEN>
```

## Step 2: Create Secrets Store

### For Production Environment

```bash
# Create production secrets store
wrangler secrets store create mybonzo-production-secrets

# Add production secrets
wrangler secrets store secret put CLOUDFLARE_API_TOKEN \
  --store mybonzo-production-secrets \
  --value "your_production_api_token"

wrangler secrets store secret put CLOUDFLARE_ACCOUNT_ID \
  --store mybonzo-production-secrets \
  --value "your_production_account_id"

wrangler secrets store secret put DATABASE_URL \
  --store mybonzo-production-secrets \
  --value "your_production_database_url"

wrangler secrets store secret put JWT_SECRET \
  --store mybonzo-production-secrets \
  --value "your_production_jwt_secret"
```

### For Staging Environment

```bash
# Create staging secrets store
wrangler secrets store create mybonzo-staging-secrets

# Add staging secrets
wrangler secrets store secret put CLOUDFLARE_API_TOKEN \
  --store mybonzo-staging-secrets \
  --value "your_staging_api_token"

wrangler secrets store secret put CLOUDFLARE_ACCOUNT_ID \
  --store mybonzo-staging-secrets \
  --value "your_staging_account_id"
```

### For Development Environment

```bash
# Create development secrets store
wrangler secrets store create mybonzo-development-secrets

# Add development secrets
wrangler secrets store secret put CLOUDFLARE_API_TOKEN \
  --store mybonzo-development-secrets \
  --value "your_development_api_token"

wrangler secrets store secret put CLOUDFLARE_ACCOUNT_ID \
  --store mybonzo-development-secrets \
  --value "your_development_account_id"
```

## Step 3: Configure Branch-Specific Secrets

### Update wrangler.toml

Modify your `wrangler.toml` to use secrets store references:

```toml
name = "luc-de-zen-on"
compatibility_date = "2024-12-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"

# Secrets Store configuration
[secrets_store]
production = "mybonzo-production-secrets"
staging = "mybonzo-staging-secrets"
development = "mybonzo-development-secrets"

# Environment-specific variable bindings
[vars]
PUBLIC_SITE_URL = "https://www.mybonzo.com"

# Secrets bound from store based on branch
[secrets]
CLOUDFLARE_API_TOKEN = "CLOUDFLARE_API_TOKEN"
CLOUDFLARE_ACCOUNT_ID = "CLOUDFLARE_ACCOUNT_ID"
DATABASE_URL = "DATABASE_URL"
JWT_SECRET = "JWT_SECRET"
```

## Step 4: Update GitHub Actions Workflows

### Update CI/CD Workflow

Modify `.github/workflows/feature-branch-ci-cd.yml`:

```yaml
# Remove direct secret references
- name: Deploy to Cloudflare Pages (Preview)
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: "mybonzo-platform"
    directory: "./dist"
    branch: ${{ github.head_ref }}

# Replace with Wrangler deployment using secrets store
- name: Deploy with Wrangler
  run: |
    # Wrangler will automatically use the correct secrets store
    # based on the current branch
    wrangler pages deploy ./dist --branch ${{ github.head_ref }}
```

### Update Production Deployment

```yaml
- name: Deploy to Production
  run: |
    # Force production secrets store for main branch
    wrangler secrets store use mybonzo-production-secrets
    wrangler pages deploy ./dist --env production
```

## Step 5: Configure Branch-Specific Secrets Mapping

Create a configuration file for branch-to-secrets mapping:

```bash
# Create branch secrets mapping
cat > .github/branch-secrets-mapping.json << EOF
{
  "main": "mybonzo-production-secrets",
  "develop": "mybonzo-staging-secrets",
  "feature/*": "mybonzo-development-secrets",
  "hotfix/*": "mybonzo-staging-secrets"
}
EOF
```

## Step 6: Update GitHub Repository Secrets

### Remove Direct Secrets from GitHub

Go to **Settings** → **Secrets and variables** → **Actions** and:

1. **Remove these secrets:**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_API_TOKEN_PROD`
   - `CLOUDFLARE_ACCOUNT_ID_PROD`

2. **Keep these secrets:**
   - `GITHUB_TOKEN` (automatically provided)

### Add Secrets Store References

Add these new secrets that reference your secrets stores:

```
CLOUDFLARE_SECRETS_STORE_PROD = mybonzo-production-secrets
CLOUDFLARE_SECRETS_STORE_STAGING = mybonzo-staging-secrets
CLOUDFLARE_SECRETS_STORE_DEV = mybonzo-development-secrets
```

## Step 7: Test Configuration

### Test Secrets Store Access

```bash
# Test production secrets
wrangler secrets store use mybonzo-production-secrets
wrangler secrets store list

# Test staging secrets
wrangler secrets store use mybonzo-staging-secrets
wrangler secrets store list

# Test development secrets
wrangler secrets store use mybonzo-development-secrets
wrangler secrets store list
```

### Test Branch-Specific Deployment

1. Create a feature branch:
   ```bash
   git checkout -b feature/test-secrets-store
   ```

2. Push the branch and create a PR

3. Verify that the CI/CD workflow:
   - Uses the correct secrets store for the branch
   - Deploys successfully with the right secrets
   - Doesn't expose any secrets in logs

## Step 8: Monitoring and Maintenance

### Regular Audits

Set up automated audits:

```bash
# Add to your security audit workflow
- name: Audit Secrets Store
  run: |
    echo "🔍 Auditing secrets stores..."
    wrangler secrets store list --store mybonzo-production-secrets
    wrangler secrets store list --store mybonzo-staging-secrets
    wrangler secrets store list --store mybonzo-development-secrets
```

### Secrets Rotation

Implement regular secrets rotation:

```bash
# Rotate production API token
wrangler secrets store secret put CLOUDFLARE_API_TOKEN \
  --store mybonzo-production-secrets \
  --value "new_rotated_token"
```

### Backup Secrets Configuration

```bash
# Export secrets configuration for backup
wrangler secrets store export mybonzo-production-secrets > production-secrets-backup.json
wrangler secrets store export mybonzo-staging-secrets > staging-secrets-backup.json
wrangler secrets store export mybonzo-development-secrets > development-secrets-backup.json
```

## Security Benefits

Using Cloudflare Secrets Store provides:

- **🔐 Encrypted Storage:** Secrets are encrypted at rest and in transit
- **🔄 Automatic Rotation:** Easy secrets rotation without code changes
- **🌿 Branch Isolation:** Different secrets for different environments
- **📊 Audit Logging:** Track who accesses secrets and when
- **🚫 No Code Exposure:** Secrets never appear in your codebase
- **🔒 Access Control:** Granular permissions for secrets access

## Troubleshooting

### Common Issues:

1. **"Secrets store not found":**
   - Verify the secrets store name is correct
   - Check that you have the right permissions

2. **"Secret not accessible":**
   - Ensure the secret is added to the correct store
   - Check branch-to-store mapping

3. **"Deployment fails":**
   - Verify Wrangler authentication
   - Check that the secrets store is properly linked

### Getting Help:

- Check Wrangler documentation: https://developers.cloudflare.com/workers/wrangler/
- Review Cloudflare Secrets Store docs
- Check GitHub Actions logs for detailed error messages

## Migration Checklist

- [ ] Authenticate Wrangler CLI
- [ ] Create secrets stores for each environment
- [ ] Add secrets to each store
- [ ] Update wrangler.toml configuration
- [ ] Modify GitHub Actions workflows
- [ ] Remove direct secrets from GitHub
- [ ] Test branch-specific deployments
- [ ] Set up monitoring and audits
- [ ] Document backup procedures
