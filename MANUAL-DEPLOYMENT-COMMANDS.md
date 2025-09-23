# Manual Deployment Commands for MyBonzo Optimization

## 🚀 Step-by-step Manual Deployment Instructions

### 1. Navigate to Correct Directory
```powershell
# Make sure you're in the project directory
cd "Q:\mybonzo\luc-de-zen-on"

# Verify you're in the right place (should show package.json)
ls package.json
```

### 2. Build the Project
```powershell
# Install dependencies first (if needed)
npm install

# Build the optimized version
npm run build
```

### 3. Deploy to Cloudflare Pages
```powershell
# Option 1: Deploy with optimized config
wrangler pages deploy dist --project-name mybonzo-optimized --config wrangler-ultimate-optimized.jsonc

# Option 2: Deploy with standard config  
wrangler pages deploy dist --project-name mybonzo-optimized --config wrangler-optimized.jsonc

# Option 3: Deploy without specific config (uses wrangler.jsonc)
wrangler pages deploy dist --project-name mybonzo-optimized
```

### 4. Verify Deployment
```powershell
# Check deployment status
wrangler pages deployment list --project-name mybonzo-optimized

# View live logs
wrangler pages deployment tail --project-name mybonzo-optimized
```

### 5. Test the Website
```powershell
# Test main endpoints
curl -I https://www.mybonzo.com/
curl -I https://www.mybonzo.com/admin/
curl -I https://www.mybonzo.com/api/admin/stats
```

## 🔧 Alternative Commands if Above Fails

### Build Troubleshooting

#### NPM Install Error: "Cannot read properties of null (reading 'matches')"
```powershell
# Fix 1: Clear npm cache completely
npm cache clean --force
rm -rf node_modules
rm package-lock.json
npm install

# Fix 2: Use different Node.js registry
npm config set registry https://registry.npmjs.org/
npm install

# Fix 3: Try with pnpm instead (recommended)
npm install -g pnpm
pnpm install
pnpm build

# Fix 4: Use npm with legacy peer deps
npm install --legacy-peer-deps
npm run build

# Fix 5: Nuclear option - reinstall npm
npm cache clean --force
npm config delete registry
npm config delete cache
npm install --force
```

#### Alternative Package Managers
```powershell
# Option 1: Use PNPM (fastest, most reliable)
npm install -g pnpm
pnpm install
pnpm build

# Option 2: Use Yarn
npm install -g yarn
yarn install
yarn build

# Option 3: Use different npm version
npx npm@8 install
npx npm@8 run build
```

### Direct Wrangler Deployment
```powershell
# If pages deploy fails, try direct upload:
wrangler deploy dist/index.js --name mybonzo-optimized

# Or publish as worker:
wrangler publish --name mybonzo-worker
```

## 📊 Verification Commands

### Check Infrastructure
```powershell
# List R2 buckets
wrangler r2 bucket list

# List KV namespaces  
wrangler kv namespace list

# List Workers
wrangler worker list
```

### Test API Endpoints
```powershell
# Test admin stats API (replace with actual URL after deployment)
curl -H "Authorization: Bearer HAOS77" https://your-deployment-url.pages.dev/api/admin/stats

# Test monitoring API
curl -H "Authorization: Bearer HAOS77" https://your-deployment-url.pages.dev/api/admin/monitoring

# Test worker management API
curl -H "Authorization: Bearer HAOS77" https://your-deployment-url.pages.dev/api/admin/workers
```

## 🎯 Quick Deploy Script
```powershell
# Copy and paste this entire block:
cd "Q:\mybonzo\luc-de-zen-on"
npm install
npm run build
wrangler pages deploy dist --project-name mybonzo-optimized --config wrangler-ultimate-optimized.jsonc
```

## 🌐 Admin Panel Access After Deployment

1. **Main Admin**: `https://your-site.pages.dev/admin/`
2. **Dashboard**: `https://your-site.pages.dev/admin/dashboard`  
3. **Monitoring**: `https://your-site.pages.dev/admin/monitoring`
4. **Login**: Use `HAOS77` as the admin password

## 🔍 Troubleshooting Common Issues

### Issue: Package.json not found
**Solution**: Make sure you're in `Q:\mybonzo\luc-de-zen-on` directory

### Issue: Build fails
**Solution**: 
```powershell
rm -rf node_modules
npm install
npm run build
```

### Issue: Wrangler authentication
**Solution**:
```powershell
wrangler login
wrangler whoami
```

### Issue: Deployment fails
**Solution**: Try deploying to different project name:
```powershell
wrangler pages deploy dist --project-name mybonzo-test
```

## 📈 Expected Results After Deployment

- ✅ Website accessible at Cloudflare Pages URL
- ✅ Admin panel working with real Cloudflare data
- ✅ Music player with folder picker functionality
- ✅ R2 storage integration active
- ✅ Multi-tier caching operational
- ✅ Worker management through admin panel
- ✅ Real-time monitoring dashboard

## 🎵 Music Player Test

After deployment, test the music player:
1. Click "MUSIC PLAYER" button (right side)
2. Music widget opens
3. Click "📋" to show playlist
4. Click "📁 Load Folder" to select music library
5. Verify folder picker opens and loads audio files

---

**Note**: Run these commands one by one and verify each step works before proceeding to the next.
