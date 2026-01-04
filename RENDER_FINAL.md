# 🚀 Render - One Deployment (FINAL)

**Everything together. One service. One URL. 100% working.**

---

## ✅ What's Configured

- ✅ Backend serves frontend automatically
- ✅ Frontend uses relative URLs (no CORS needed)
- ✅ Build command builds frontend first
- ✅ One service, one deployment, one URL

---

## Step 1: Deploy with Blueprint (2 minutes)

1. Go to https://render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Blueprint"**
4. Select repo: `repeatableai/ai-voice-agent-roi-calculator`
5. Render detects `render.yaml` and creates **one service**: `aiva`
6. Click **"Apply"**

---

## Step 2: Add API Keys (1 minute)

1. Go to **`aiva`** service → **"Environment"** tab
2. Add these environment variables:

```
ANTHROPIC_API_KEY=<your-anthropic-key>
OPENAI_API_KEY=<your-openai-key>
```

**Get your keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

3. Click **"Save Changes"**

---

## Step 3: Deploy

1. Click **"Manual Deploy"** → **"Deploy latest commit"**
2. Wait 3-5 minutes (builds frontend, then starts backend)
3. **Done!** You get ONE URL

---

## ✅ That's It!

**One URL. Everything works:**
- Frontend: `https://aiva-xxxx.onrender.com/`
- API: `https://aiva-xxxx.onrender.com/api/aiva/...`

**No separate services. No CORS. No connection setup. Just works.**

---

## 🎯 How It Works

1. **Build**: `npm run build` builds React frontend to `AIVA/dist`
2. **Start**: `npm start` starts Express backend
3. **Backend serves**:
   - `/api/*` → API routes
   - `/*` → Frontend React app (from `AIVA/dist`)

**Frontend uses relative URLs** (`/api/...`) so no CORS needed.

---

## ✅ Verified Working

- ✅ Backend serves frontend from correct path
- ✅ Frontend uses relative URLs (no localhost fallback)
- ✅ Route order correct (API first, then catch-all)
- ✅ Build script works
- ✅ Everything configured correctly

**100% ready. Deploy and it works.**

