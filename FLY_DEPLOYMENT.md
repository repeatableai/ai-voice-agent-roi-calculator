# 🚀 Fly.io Deployment Guide

**Deploy your AIVA ROI Calculator to Fly.io - Simple, reliable, and free!**

---

## Why Fly.io?

✅ **Runs Express like localhost** - No serverless complexity  
✅ **Free tier** - 3 shared VMs, 3GB storage  
✅ **Simple deployment** - Connect GitHub and deploy  
✅ **No path resolution issues** - Docker provides predictable environment  
✅ **Monorepo-friendly** - Handles your structure perfectly  

---

## Prerequisites

1. **Fly.io account** - Sign up at https://fly.io (free)
2. **Fly CLI installed** - See Step 1 below
3. **GitHub repo** - Your code should be pushed to GitHub

---

## Step 1: Install Fly CLI

**macOS:**
```bash
curl -L https://fly.io/install.sh | sh
```

**Or use Homebrew:**
```bash
brew install flyctl
```

**Verify installation:**
```bash
fly version
```

---

## Step 2: Login to Fly.io

```bash
fly auth login
```

This will open a browser for authentication.

---

## Step 3: Initialize Fly.io App

```bash
cd "/Users/steen/AIVA(2026)/ai-voice-agent-roi-calculator"
fly launch
```

**When prompted:**
- **App name**: `aiva-roi-calculator` (or choose your own - must be unique)
- **Region**: Choose closest to you (e.g., `iad` for US East, `sjc` for US West)
- **Postgres**: **No** (you don't need it for AIVA routes)
- **Redis**: **No** (optional, not required)

This creates the `fly.toml` file (already created, but Fly will update it).

---

## Step 4: Set Environment Variables

Set your API keys as Fly secrets:

```bash
fly secrets set ANTHROPIC_API_KEY=<your-anthropic-api-key>
fly secrets set OPENAI_API_KEY=<your-openai-api-key>
fly secrets set NODE_ENV=production
fly secrets set PORT=8080
```

**Get your API keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

**Note**: Secrets are encrypted and only available at runtime.

---

## Step 5: Deploy

```bash
fly deploy
```

This will:
1. Build the Docker image
2. Build the frontend (AIVA/dist)
3. Deploy to Fly.io
4. Give you a URL

**First deployment takes 3-5 minutes** (building Docker image).

---

## Step 6: Open Your App

```bash
fly open
```

Or visit: `https://aiva-roi-calculator.fly.dev`

---

## ✅ That's It!

Your app should now be live and working!

---

## How It Works

1. **Dockerfile** builds the frontend during image build
2. **Express server** runs from `/app/backend` directory
3. **Path resolution**: `__dirname/../AIVA/dist` = `/app/AIVA/dist` ✓
4. **Static files** are served correctly
5. **API routes** work as expected

---

## Troubleshooting

### Check Logs

```bash
fly logs
```

Look for:
- `[PATH] ✓ Found:` - Path resolution successful
- `[STATIC]` entries - Static file serving
- Any error messages

### Check Status

```bash
fly status
```

### SSH into VM

```bash
fly ssh console
```

Then check:
```bash
ls -la /app/AIVA/dist
ls -la /app/backend
```

### Redeploy

```bash
fly deploy
```

### View App Info

```bash
fly info
```

---

## Environment Variables

View secrets:
```bash
fly secrets list
```

Update a secret:
```bash
fly secrets set KEY_NAME=new_value
```

Remove a secret:
```bash
fly secrets unset KEY_NAME
```

---

## Scaling (Optional)

Free tier includes 3 shared VMs. To scale:

```bash
fly scale count 1  # Number of instances
```

---

## Custom Domain (Optional)

```bash
fly certs add yourdomain.com
```

Then update your DNS to point to Fly.io.

---

## Monitoring

View metrics:
```bash
fly dashboard
```

Or visit: https://fly.io/dashboard

---

## Rollback

If something goes wrong:

```bash
fly releases
fly releases rollback <release-id>
```

---

## Success Criteria

After deployment, verify:

✅ App loads at `https://aiva-roi-calculator.fly.dev`  
✅ Frontend displays correctly (no blank screen)  
✅ CSS/JS files load (check browser console)  
✅ API routes work (`/api/aiva/...`)  
✅ No 500 errors  

---

## Why This Works

1. **Docker provides predictable environment** - No path resolution issues
2. **Frontend built during Docker build** - Files are guaranteed to exist
3. **Express runs traditionally** - No serverless complexity
4. **Path resolution is simple** - `__dirname/../AIVA/dist` always works

---

## Next Steps

1. Deploy using the steps above
2. Test your app
3. Share the URL with users!

**Much simpler than Render. Should work on first try!**

