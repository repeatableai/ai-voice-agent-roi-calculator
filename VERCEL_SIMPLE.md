# 🚀 Vercel - Super Simple One-Click Deploy

**Deploy everything in 2 minutes. No backend/frontend separation.**

---

## Why Vercel is Better

✅ **One deployment** - Everything together  
✅ **Automatic** - Just connect GitHub  
✅ **Free** - Generous free tier  
✅ **Fast** - Optimized CDN  
✅ **Easy** - No configuration needed  

---

## Step 1: Deploy Frontend to Vercel (2 minutes)

### Option A: Via Web (Easiest)

1. Go to https://vercel.com
2. Sign up/Login with **GitHub**
3. Click **"Add New..."** → **"Project"**
4. Import: `repeatableai/ai-voice-agent-roi-calculator`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `AIVA` ⚠️ **IMPORTANT**
   - **Build Command**: `npm install && npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
6. Click **"Deploy"**
7. **Done!** You get a URL like `https://aiva.vercel.app`

### Option B: Via CLI (Alternative)

```bash
cd "/Users/steen/AIVA(2026)/ai-voice-agent-roi-calculator/AIVA"
npm install -g vercel
vercel
# Follow prompts
vercel --prod
```

---

## Step 2: Deploy Backend to Railway (Even Easier!)

Railway is **MUCH simpler** than Render for backends:

1. Go to https://railway.app
2. Sign up with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: `repeatableai/ai-voice-agent-roi-calculator`
5. Railway auto-detects it's Node.js
6. Set **Root Directory**: `backend`
7. Add environment variables:
   - `ANTHROPIC_API_KEY` = `<your-key>`
   - `OPENAI_API_KEY` = `<your-key>`
8. Click **"Deploy"**
9. **Done!** Railway gives you a URL automatically

**Get your keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

---

## Step 3: Connect Frontend to Backend (30 seconds)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   - `VITE_API_URL` = `<your-railway-backend-url>`
3. Go to **Deployments** → **Redeploy** (latest)

---

## ✅ Done!

**Frontend:** `https://aiva.vercel.app`  
**Backend:** `https://your-app.railway.app`

**Much simpler than Render!**

---

## 🎯 Why This is Better

- **Vercel**: Best for frontends (React/Vite) - automatic, fast, free
- **Railway**: Best for backends (Express) - simpler than Render, auto-detects everything
- **Together**: Two clicks, everything works

---

## 🚀 Even Simpler: Railway for Everything

Want **ONE platform**? Use Railway for both:

1. Deploy backend (as above)
2. Add frontend as second service:
   - New Service → Static Site
   - Root: `AIVA`
   - Build: `npm install && npm run build`
   - Output: `dist`
3. Set `VITE_API_URL` = backend URL
4. **Done!**

**Railway handles monorepos perfectly - one project, multiple services.**

---

## 📝 Summary

**Easiest Option:**
- Frontend → Vercel (2 min)
- Backend → Railway (2 min)  
- Connect them (30 sec)

**Total: 5 minutes, one URL for frontend, one for backend.**

**Much simpler than Render's two-service setup!**


