# Cloudflared Tunnel Setup for CHUCK

This guide explains how to set up a secure Cloudflare Tunnel (cloudflared) to expose your local CHUCK API to the internet through the Cloudflare Workers proxy.

## Overview

The architecture:
```
Local CHUCK API (localhost:5152)
    ↓
Cloudflared Tunnel
    ↓
Cloudflare Edge Network
    ↓
Workers Proxy (chuck-proxy.js)
    ↓
Client Applications
```

## Prerequisites

- A Cloudflare account (free tier works)
- Access to a domain managed by Cloudflare
- CHUCK API running locally on port 5152
- Node.js and npm installed

## Installation

### 1. Install cloudflared

**macOS (Homebrew):**
```bash
brew install cloudflared
```

**Linux:**
```bash
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

**Windows:**
Download from: https://github.com/cloudflare/cloudflared/releases

### 2. Authenticate cloudflared

```bash
cloudflared tunnel login
```

This opens a browser window where you select your domain.

### 3. Create a Tunnel

```bash
cloudflared tunnel create chuck-tunnel
```

This creates:
- A tunnel with UUID
- Credentials file at `~/.cloudflared/<UUID>.json`

Save the tunnel UUID - you'll need it later.

### 4. Configure the Tunnel

Create a configuration file at `~/.cloudflared/config.yml`:

```yaml
tunnel: <YOUR-TUNNEL-UUID>
credentials-file: /home/<USER>/.cloudflared/<UUID>.json

ingress:
  # Route for CHUCK API
  - hostname: chuck.yourdomain.com
    service: http://localhost:5152
  
  # Catch-all rule (required)
  - service: http_status:404
```

Replace:
- `<YOUR-TUNNEL-UUID>` with your tunnel UUID
- `<USER>` with your username
- `chuck.yourdomain.com` with your chosen subdomain

### 5. Create DNS Record

```bash
cloudflared tunnel route dns chuck-tunnel chuck.yourdomain.com
```

This creates a CNAME record pointing your subdomain to the tunnel.

### 6. Run the Tunnel

**Development (foreground):**
```bash
cloudflared tunnel run chuck-tunnel
```

**Production (as a service):**

**Linux (systemd):**
```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

**macOS (LaunchDaemon):**
```bash
sudo cloudflared service install
sudo launchctl load /Library/LaunchDaemons/com.cloudflare.cloudflared.plist
```

**Windows (as service):**
```powershell
cloudflared.exe service install
sc start cloudflared
```

## Verification

### 1. Check Tunnel Status

```bash
cloudflared tunnel list
cloudflared tunnel info chuck-tunnel
```

### 2. Test the Connection

```bash
curl https://chuck.yourdomain.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "chuck-api",
  "version": "1.0.0"
}
```

### 3. Test via Workers Proxy

```bash
curl -X POST https://api.mybonzo.com/chuck/exec \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "toolId": "openai-gpt4",
    "input": { "prompt": "Hello, CHUCK!" }
  }'
```

## Configuration for Workers

Update your Workers environment variables:

```toml
# wrangler.toml
[env.production.vars]
CHUCK_TUNNEL_URL = "https://chuck.yourdomain.com"
```

Or use `wrangler secret put`:
```bash
wrangler secret put CHUCK_TUNNEL_URL
# Enter: https://chuck.yourdomain.com
```

## Security Best Practices

### 1. Enable Access Control (Optional)

Add Cloudflare Access for additional security:

```yaml
# ~/.cloudflared/config.yml
ingress:
  - hostname: chuck.yourdomain.com
    service: http://localhost:5152
    originRequest:
      # Enable Cloudflare Access
      noTLSVerify: false
```

Then configure Access policies in Cloudflare Dashboard:
1. Go to Zero Trust > Access > Applications
2. Create an Application for `chuck.yourdomain.com`
3. Add policies (e.g., email domain, IP ranges)

### 2. Use Environment Variables

Never hardcode tunnel URLs. Use environment variables:

```javascript
// In your application
const CHUCK_URL = process.env.CHUCK_TUNNEL_URL || 'http://localhost:5152';
```

### 3. Monitor Tunnel Health

Set up monitoring:

```bash
# Check tunnel logs
cloudflared tunnel logs chuck-tunnel

# Or via systemd
sudo journalctl -u cloudflared -f
```

### 4. Rotate Credentials

Periodically recreate tunnel credentials:

```bash
cloudflared tunnel delete chuck-tunnel
cloudflared tunnel create chuck-tunnel
# Update config.yml with new UUID
```

## Troubleshooting

### Tunnel Not Connecting

**Check tunnel status:**
```bash
cloudflared tunnel list
```

**Check DNS:**
```bash
dig chuck.yourdomain.com
# Should show CNAME to <UUID>.cfargotunnel.com
```

**Check local service:**
```bash
curl http://localhost:5152/health
```

### 502 Bad Gateway

- Ensure CHUCK API is running on localhost:5152
- Check firewall rules
- Verify config.yml service URL

### 403 Forbidden

- Check Cloudflare Access policies
- Verify authentication tokens
- Review Workers proxy authentication logic

### Rate Limiting Issues

Workers proxy has rate limiting (10 req/min per user). To adjust:

```javascript
// workers/chuck-proxy.js
const RATE_LIMIT_MAX_REQUESTS = 100; // Increase limit
const RATE_LIMIT_WINDOW = 60; // Time window in seconds
```

## Advanced Configuration

### Multiple Services

You can route multiple services through one tunnel:

```yaml
ingress:
  - hostname: chuck.yourdomain.com
    service: http://localhost:5152
  
  - hostname: dashboard.yourdomain.com
    service: http://localhost:3000
  
  - service: http_status:404
```

### Load Balancing

For high availability, create multiple tunnels:

```bash
cloudflared tunnel create chuck-tunnel-1
cloudflared tunnel create chuck-tunnel-2
```

Configure both in DNS for automatic failover.

### Custom Headers

Add custom headers to requests:

```yaml
ingress:
  - hostname: chuck.yourdomain.com
    service: http://localhost:5152
    originRequest:
      httpHostHeader: chuck-api.local
      caPool: /path/to/ca.pem
```

## Production Deployment Checklist

- [ ] Tunnel installed and authenticated
- [ ] Configuration file created and tested
- [ ] DNS record configured
- [ ] Tunnel running as a service
- [ ] Workers proxy deployed with correct CHUCK_TUNNEL_URL
- [ ] Supabase authentication configured
- [ ] KV namespace for rate limiting created
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backup tunnel configured (optional)
- [ ] Documentation updated with actual URLs

## Resources

- [Cloudflare Tunnel Documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps)
- [cloudflared GitHub](https://github.com/cloudflare/cloudflared)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [CHUCK API Documentation](./CHUCK_API.md)

## Support

For issues:
1. Check tunnel logs: `cloudflared tunnel logs chuck-tunnel`
2. Review Cloudflare dashboard analytics
3. Test local CHUCK API independently
4. Verify Workers proxy is deployed correctly
5. Contact support: support@mybonzo.com
