# MyBonzo.com Deployment Guide

This guide covers deploying the complete MyBonzo.com B2B platform with CHUCK integration.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    mybonzo.com                          │
│                 (Cloudflare Pages)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │  Dashboard (pages/index.tsx)                     │   │
│  │  - Tools Grid (140+ AI tools)                    │   │
│  │  - Workflow Builder                              │   │
│  │  - Plugin Manager                                │   │
│  │  - Billing                                       │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│           api.mybonzo.com/chuck/*                       │
│          (Cloudflare Workers - chuck-proxy.js)          │
│  ┌──────────────────────────────────────────────────┐   │
│  │  - Supabase Email Auth                           │   │
│  │  - KV Rate Limiting (10 req/min)                 │   │
│  │  - Proxy to CHUCK tunnel                         │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              chuck.yourdomain.com                       │
│              (Cloudflared Tunnel)                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ↓
┌─────────────────────────────────────────────────────────┐
│              localhost:5152                             │
│              (CHUCK API Server)                         │
└─────────────────────────────────────────────────────────┘
```

## Prerequisites

- Cloudflare account with domain
- Supabase project (free tier works)
- GitHub repository
- Node.js 18+ and npm
- CHUCK API running locally

## Step 1: Cloudflare Pages (MyBonzo Dashboard)

### 1.1 Install Dependencies

```bash
npm install
npm install @monaco-editor/react
```

### 1.2 Build the Dashboard

```bash
npm run build
```

This builds the Astro site with the React dashboard at `/pages/index.tsx`.

### 1.3 Deploy to Cloudflare Pages

**Option A: Automatic GitHub Integration**

1. Go to Cloudflare Dashboard → Pages
2. Create a new project
3. Connect to GitHub repository: `Bonzokoles/luc-de-zen-on`
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`

**Option B: Manual via Wrangler**

```bash
npm run build
wrangler pages deploy dist --project-name=mybonzo-new
```

### 1.4 Configure Custom Domain

1. Go to Pages project → Custom domains
2. Add domain: `mybonzo.com`
3. Add subdomain: `jimbo.mybonzo.com`
4. Follow DNS configuration instructions

## Step 2: KV Namespace for Rate Limiting

### 2.1 Create KV Namespace

```bash
# Production
wrangler kv:namespace create "CHUCK_RATE_LIMIT"
# Save the returned namespace ID

# Preview (optional)
wrangler kv:namespace create "CHUCK_RATE_LIMIT" --preview
```

### 2.2 Update wrangler-chuck-proxy.toml

Replace placeholders with actual IDs:

```toml
[[kv_namespaces]]
binding = "CHUCK_RATE_LIMIT"
id = "abc123def456" # Your actual namespace ID
preview_id = "xyz789uvw012" # Your preview namespace ID
```

## Step 3: Supabase Setup

### 3.1 Create Supabase Project

1. Go to https://supabase.com
2. Create new project
3. Save the project URL and anon key

### 3.2 Enable Email Authentication

1. In Supabase Dashboard → Authentication → Settings
2. Enable Email provider
3. Configure email templates (optional)
4. Add your domain to Site URL

### 3.3 Create Users Table (Optional)

```sql
-- Optional: Extended user profile
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free', -- free, pro, enterprise
  api_calls_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);
```

## Step 4: Deploy Workers (CHUCK Proxy)

### 4.1 Set Secrets

```bash
# Supabase URL
wrangler secret put SUPABASE_URL
# Enter: https://your-project.supabase.co

# Supabase Anonymous Key
wrangler secret put SUPABASE_ANON_KEY
# Enter: your-anon-key

# CHUCK Tunnel URL (after setting up cloudflared)
wrangler secret put CHUCK_TUNNEL_URL
# Enter: https://chuck.yourdomain.com
```

### 4.2 Deploy Worker

```bash
wrangler deploy -c wrangler-chuck-proxy.toml
```

### 4.3 Configure Routes

The worker should be accessible at:
- `https://api.mybonzo.com/chuck/exec` - CHUCK execution endpoint
- `https://api.mybonzo.com/health` - Health check

Verify in Cloudflare Dashboard → Workers → Routes.

## Step 5: Cloudflared Tunnel

Follow the [Cloudflared Tunnel Setup Guide](./CLOUDFLARED_TUNNEL_SETUP.md).

Quick steps:
```bash
# Install
brew install cloudflared # or see docs for other OS

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create chuck-tunnel

# Configure (edit ~/.cloudflared/config.yml)
# See CLOUDFLARED_TUNNEL_SETUP.md for details

# Create DNS
cloudflared tunnel route dns chuck-tunnel chuck.yourdomain.com

# Run
cloudflared tunnel run chuck-tunnel
```

## Step 6: Environment Configuration

### 6.1 Update Client Configuration

In `pages/index.tsx`, the CHUCK client uses:
```typescript
const chuckClient = new ChuckClient({
  apiUrl: 'https://api.mybonzo.com/chuck/exec'
});
```

### 6.2 Set Environment Variables

Create `.env` file (for local development):
```bash
PUBLIC_CHUCK_API_URL=http://localhost:8787/chuck/exec
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Step 7: Testing

### 7.1 Test Workers Proxy

```bash
# Health check
curl https://api.mybonzo.com/health

# Test authentication (requires valid JWT)
curl -X POST https://api.mybonzo.com/chuck/exec \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"toolId": "openai-gpt4", "input": {"prompt": "Hello"}}'
```

### 7.2 Test Dashboard

1. Visit `https://mybonzo.com`
2. Sign up/sign in (Supabase auth)
3. Browse tools grid
4. Create a workflow
5. Execute workflow
6. Check plugin manager
7. View billing section

### 7.3 Test Rate Limiting

```bash
# Make 11 requests rapidly (should hit rate limit)
for i in {1..11}; do
  curl -X POST https://api.mybonzo.com/chuck/exec \
    -H "Authorization: Bearer YOUR_JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"toolId": "openai-gpt4"}' &
done
```

Expected: First 10 succeed, 11th returns 429.

## Step 8: Monitoring & Logging

### 8.1 Cloudflare Analytics

- Pages Analytics: Dashboard → Pages → Analytics
- Workers Analytics: Dashboard → Workers → Analytics

### 8.2 KV Usage

```bash
wrangler kv:namespace list
wrangler kv:key list --namespace-id=YOUR_ID
```

### 8.3 Logs

**Worker logs:**
```bash
wrangler tail chuck-proxy
```

**Tunnel logs:**
```bash
cloudflared tunnel logs chuck-tunnel
```

## Step 9: Custom Domain Configuration

### 9.1 Main Domain (mybonzo.com)

Point to Cloudflare Pages:
1. DNS → Add record
2. Type: CNAME
3. Name: @ (or mybonzo.com)
4. Target: your-pages-deployment.pages.dev
5. Proxy status: Proxied

### 9.2 API Subdomain (api.mybonzo.com)

Point to Workers:
1. Workers → chuck-proxy → Routes
2. Add route: `api.mybonzo.com/chuck/*`
3. DNS will be auto-configured

### 9.3 Jimbo Subdomain (jimbo.mybonzo.com)

1. Pages → Custom domains → Add domain
2. Enter: jimbo.mybonzo.com
3. Follow DNS instructions

## Step 10: Production Checklist

### Infrastructure
- [ ] Cloudflare Pages deployed
- [ ] Workers proxy deployed
- [ ] KV namespace created and configured
- [ ] Cloudflared tunnel running as service
- [ ] DNS records configured
- [ ] SSL/TLS enabled (auto via Cloudflare)

### Authentication & Security
- [ ] Supabase project created
- [ ] Email auth enabled
- [ ] Secrets configured in Workers
- [ ] Rate limiting tested
- [ ] CORS headers configured

### Dashboard
- [ ] Tools grid loads 140+ tools
- [ ] Workflow builder functional
- [ ] Plugin manager works
- [ ] Billing integration ready
- [ ] Client authenticated with Supabase

### Testing
- [ ] Health checks passing
- [ ] Authentication flow works
- [ ] Rate limiting works
- [ ] Workflow execution works
- [ ] Error handling tested

### Monitoring
- [ ] Analytics enabled
- [ ] Logging configured
- [ ] Error tracking set up
- [ ] Performance monitoring

## Troubleshooting

### Dashboard Not Loading

1. Check build: `npm run build`
2. Check deployment: `wrangler pages deployment list`
3. Check browser console for errors
4. Verify tools.json path

### Workers 401 Errors

1. Check Supabase secrets: `wrangler secret list`
2. Verify JWT token is valid
3. Check Supabase project status
4. Review worker logs: `wrangler tail chuck-proxy`

### Rate Limit Issues

1. Check KV namespace binding
2. Verify KV data: `wrangler kv:key list --namespace-id=ID`
3. Adjust limits in chuck-proxy.js if needed

### Tunnel Connection Issues

1. Check tunnel status: `cloudflared tunnel list`
2. Check local CHUCK API: `curl http://localhost:5152/health`
3. Review tunnel logs
4. Verify DNS record

## Maintenance

### Update Tools Database

```bash
# Edit lib/tools.json
vim lib/tools.json

# Rebuild and deploy
npm run build
wrangler pages deploy dist
```

### Update Workers

```bash
# Edit workers/chuck-proxy.js
vim workers/chuck-proxy.js

# Deploy
wrangler deploy -c wrangler-chuck-proxy.toml
```

### Update Rate Limits

Edit `workers/chuck-proxy.js`:
```javascript
const RATE_LIMIT_MAX_REQUESTS = 20; // Increase
const RATE_LIMIT_WINDOW = 60;
```

Then redeploy.

## Scaling

### Horizontal Scaling

- Pages: Auto-scales globally
- Workers: Auto-scales (50ms cold start)
- KV: Globally distributed
- Tunnel: Create multiple tunnels for HA

### Performance Optimization

1. **Cache tools.json**: Use Cloudflare Cache API
2. **Optimize bundle**: Code splitting in dashboard
3. **CDN**: Leverage Cloudflare CDN
4. **Database**: Add Supabase pooling

## Support

- Documentation: `/docs`
- Issues: GitHub Issues
- Email: support@mybonzo.com

## Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers)
- [Wrangler CLI Docs](https://developers.cloudflare.com/workers/wrangler)
- [Supabase Docs](https://supabase.com/docs)
- [Cloudflared Tunnel Setup](./CLOUDFLARED_TUNNEL_SETUP.md)
