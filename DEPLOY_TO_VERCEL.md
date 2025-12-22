# Deploy to Vercel - Quick Guide

## Prerequisites
1. Vercel account (https://vercel.com/signup)
2. Git repository pushed to GitHub/GitLab/Bitbucket
3. Environment variables ready

## Step 1: Commit Your Code
```bash
git add .
git commit -m "Migrate to Next.js 15"
git push origin main
```

## Step 2: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect Next.js
4. Click "Deploy"

## Step 3: Add Environment Variables

In Vercel Dashboard → Settings → Environment Variables, add:

### Required Variables:
```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_ID=your-app-id
NEXT_PUBLIC_OAUTH_PORTAL_URL=https://your-oauth-portal
OAUTH_SERVER_URL=https://your-oauth-server
JWT_SECRET=your-jwt-secret
OWNER_OPEN_ID=admin-openid
BUILT_IN_FORGE_API_URL=https://your-forge-api
BUILT_IN_FORGE_API_KEY=your-forge-key
```

### Optional (for Maps):
```
NEXT_PUBLIC_FRONTEND_FORGE_API_KEY=your-api-key
NEXT_PUBLIC_FRONTEND_FORGE_API_URL=https://your-api-url
```

## Step 4: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "Redeploy" on the latest deployment
3. Check "Use existing Build Cache" ✓

## Alternative: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# For production
vercel --prod
```

## Verify Deployment

1. Visit your .vercel.app URL
2. Test these routes:
   - `/` - Home
   - `/shop` - Product listing
   - `/admin/login` - Admin OAuth
   - `/api/products` - API endpoint

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all environment variables are set
- Verify DATABASE_URL is accessible from Vercel

### OAuth Not Working
- Verify NEXT_PUBLIC_OAUTH_PORTAL_URL is correct
- Update OAuth redirect URI in your OAuth provider to:
  `https://your-domain.vercel.app/api/oauth/callback`

### Database Connection Issues
- Ensure Supabase allows connections from Vercel IPs
- Check DATABASE_URL format
- Enable connection pooling if needed

## Custom Domain

1. Go to Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update OAuth redirect URI to new domain

---

**Your app is ready for production! 🚀**
