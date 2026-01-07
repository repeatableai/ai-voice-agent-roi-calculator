# 🚀 Deploy Now - Ready to Go!

**Everything is configured. Just follow these steps.**

---

## Option 1: Vercel (Easiest - 2 minutes)

### Step 1: Deploy Frontend

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import: `repeatableai/ai-voice-agent-roi-calculator`
5. **IMPORTANT**: Set **Root Directory** to `AIVA`
6. Click **"Deploy"**
7. Copy the URL you get (e.g., `https://aiva.vercel.app`)

### Step 2: Deploy Backend to Railway

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: `repeatableai/ai-voice-agent-roi-calculator`
5. Click **"Add Service"** → **"GitHub Repo"**
6. Select your repo again
7. In service settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
8. Go to **Variables** tab, add:
   - `ANTHROPIC_API_KEY` = `<get-from-backend/.env>`
   - `OPENAI_API_KEY` = `<get-from-backend/.env>`
   - `PORT` = `10000`
   - `NODE_ENV` = `production`
9. Railway auto-deploys
10. Copy the URL (e.g., `https://your-app.railway.app`)

**Get your API keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

### Step 3: Connect Them

1. Go back to Vercel → Your Project → **Settings** → **Environment Variables**
2. Add: `VITE_API_URL` = `<your-railway-backend-url>`
3. Go to **Deployments** → Click **"..."** → **Redeploy**

**Done!** Your frontend URL is live.

---

## Option 2: Railway for Everything (One Platform)

1. Go to https://railway.app
2. Sign in with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Select: `repeatableai/ai-voice-agent-roi-calculator`

### Add Backend Service:
1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select your repo
3. Settings:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`
4. Variables:
   - `ANTHROPIC_API_KEY` = `<your-key>`
   - `OPENAI_API_KEY` = `<your-key>`
   - `PORT` = `10000`
   - `NODE_ENV` = `production`

### Add Frontend Service:
1. Click **"New"** → **"Service"** → **"GitHub Repo"**
2. Select your repo
3. Settings:
   - **Root Directory**: `AIVA`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve dist -s`
4. Variables:
   - `VITE_API_URL` = `<your-backend-service-url>`

**Done!** Both services in one place.

---

## ✅ Everything is Ready

- ✅ `vercel.json` configured
- ✅ `AIVA/vercel.json` configured  
- ✅ Build tested and working
- ✅ All config files in place

**Just deploy using one of the options above!**


