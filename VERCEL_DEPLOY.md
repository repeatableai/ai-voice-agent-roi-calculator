# 🚀 Vercel Deployment - One Click Deploy

**Deploy everything at once. No separate backend/frontend setup.**

---

## Why Vercel is Easier

✅ **Single deployment** - Backend + Frontend together  
✅ **Automatic** - Detects and configures everything  
✅ **Free tier** - Generous limits  
✅ **One command** - `vercel` and you're done  
✅ **Environment variables** - Set once, works everywhere  

---

## Step 1: Install Vercel CLI (1 minute)

```bash
npm install -g vercel
```

Or use the web interface (no CLI needed!)

---

## Step 2: Deploy via Web (Easiest - 3 minutes)

### 2.1 Connect Repository

1. Go to https://vercel.com
2. Sign up/Login with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import repository: `repeatableai/ai-voice-agent-roi-calculator`
5. Click **"Import"**

### 2.2 Configure Project

Vercel will auto-detect your setup. Verify:

- **Framework Preset**: Vite (for frontend)
- **Root Directory**: `AIVA` (for frontend)
- **Build Command**: `npm install && npm run build`
- **Output Directory**: `dist`

### 2.3 Add Environment Variables

Click **"Environment Variables"** and add:

```
ANTHROPIC_API_KEY=<get-from-backend/.env>
OPENAI_API_KEY=<get-from-backend/.env>
NODE_ENV=production
```

**Get your keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. **Done!** You get a public URL automatically

---

## Step 3: Deploy via CLI (Alternative - 2 minutes)

```bash
cd "/Users/steen/AIVA(2026)/ai-voice-agent-roi-calculator"

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel

# Set environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add OPENAI_API_KEY
vercel env add NODE_ENV production

# Deploy to production
vercel --prod
```

---

## ✅ That's It!

**One deployment. One URL. Everything works.**

Your app will be live at: `https://your-project.vercel.app`

---

## 🔧 Configuration

The `vercel.json` file handles:
- Backend API routes (`/api/*`) → Express server
- Frontend routes (`/*`) → React app
- Automatic routing between them

---

## 🎯 Advantages Over Render

- ✅ **Single deployment** (not two separate services)
- ✅ **Automatic configuration** (detects your setup)
- ✅ **Better for monorepos** (handles multiple apps)
- ✅ **Faster deployments** (optimized build system)
- ✅ **Better developer experience** (preview deployments)

---

## 🐛 Troubleshooting

**Build fails?**
- Check Vercel logs in dashboard
- Verify Root Directory = `AIVA`
- Verify Build Command = `npm install && npm run build`

**API not working?**
- Check environment variables are set
- Verify `vercel.json` routes are correct
- Check function logs in Vercel dashboard

**Need to update?**
- Just push to GitHub - Vercel auto-deploys
- Or run `vercel --prod` from CLI

---

**Much simpler than Render. One deployment. Done.**

