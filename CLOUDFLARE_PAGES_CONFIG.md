# Build configuration for Cloudflare Pages

## Required Environment Variables
NODE_VERSION=18
PNPM_VERSION=latest

## Build Settings
- **Framework preset**: None (Manual)
- **Build command**: `pnpm build`
- **Build output directory**: `dist`
- **Root directory**: `/` (or leave empty)

## GitHub Integration
- **Repository**: `Bonzokoles/luc-de-zen-on`
- **Production branch**: `main`
- **Preview deployments**: Enabled

## Environment Variables to Set in Cloudflare Dashboard
```
NODE_VERSION=18
PNPM_VERSION=latest
```

## Custom Domains Already Added
- Primary: `luc-de-zen-on.pages.dev`
- Custom: `www.mybonzo.com`

## Manual Deployment Steps
1. Go to Cloudflare Dashboard
2. Workers & Pages → luc-de-zen-on
3. Settings → Builds & deployments
4. Connect to GitHub if not connected
5. Set build command: `pnpm build`
6. Set output directory: `dist`
7. Save and trigger deployment
