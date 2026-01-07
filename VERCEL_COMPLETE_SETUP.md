# ✅ Vercel Complete Setup - Frontend + Backend

**Yes, Vercel will work! Here's the complete setup.**

---

## ⚠️ Important: Vercel Timeout Limits

Vercel has execution time limits:
- **Free tier**: 10 seconds max
- **Pro tier**: 60 seconds (can extend to 300 seconds with config)

**Your AI routes can take up to 10 minutes**, so we need a hybrid approach:

✅ **Vercel for Frontend** (perfect - fast CDN)  
✅ **Railway/Render for Backend** (handles long AI requests)

**This is the recommended setup and works perfectly!**

---

## 🚀 Option 1: Vercel Frontend + Railway Backend (Recommended)

### Step 1: Deploy Frontend to Vercel (2 minutes)

1. Go to https://vercel.com
2. Sign in with GitHub
3. Click **"Add New..."** → **"Project"**
4. Import: `repeatableai/ai-voice-agent-roi-calculator`
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `AIVA` ⚠️ **IMPORTANT**
   - **Build Command**: `npm install && npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
6. Click **"Deploy"**
7. Copy your Vercel URL (e.g., `https://aiva.vercel.app`)

### Step 2: Deploy Backend to Railway (3 minutes)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select: `repeatableai/ai-voice-agent-roi-calculator`
5. Railway auto-detects Node.js
6. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start` (auto-detected)
7. Go to **Variables** tab, add:
   ```
   ANTHROPIC_API_KEY=<your-key>
   OPENAI_API_KEY=<your-key>
   NODE_ENV=production
   PORT=10000
   CORS_ORIGIN=<your-vercel-url>
   ```
8. Railway auto-deploys
9. Copy your Railway backend URL (e.g., `https://aiva-backend.railway.app`)

**Get your API keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

### Step 3: Connect Frontend to Backend (30 seconds)

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add:
   ```
   VITE_API_URL=<your-railway-backend-url>
   ```
   Example: `VITE_API_URL=https://aiva-backend.railway.app`
3. Go to **Deployments** → Click **"..."** → **"Redeploy"**

### Step 4: Update Backend CORS (30 seconds)

1. Go to Railway Dashboard → Your Backend Service → **Variables**
2. Update:
   ```
   CORS_ORIGIN=<your-vercel-frontend-url>
   ```
   Example: `CORS_ORIGIN=https://aiva.vercel.app`
3. Railway auto-redeploys

---

## ✅ Done!

**Your setup:**
- **Frontend**: `https://aiva.vercel.app` (Vercel - fast CDN)
- **Backend**: `https://aiva-backend.railway.app` (Railway - handles long requests)

**Total time: ~6 minutes**

---

## 🎯 Why This Works Perfectly

✅ **Vercel frontend** - Best-in-class CDN, instant global delivery  
✅ **Railway backend** - No timeout limits, handles 10-minute AI requests  
✅ **Simple connection** - Just set `VITE_API_URL` and `CORS_ORIGIN`  
✅ **Both platforms free** - Generous free tiers  

---

## 🚀 Option 2: Vercel Frontend + Render Backend

If you prefer Render over Railway:

### Backend on Render:

1. Go to https://dashboard.render.com
2. **New +** → **Web Service**
3. Connect GitHub → Select repo
4. Configure:
   - **Name**: `aiva-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Environment Variables:
   ```
   NODE_ENV=production
   PORT=10000
   ANTHROPIC_API_KEY=<your-key>
   OPENAI_API_KEY=<your-key>
   CORS_ORIGIN=<your-vercel-url>
   ```
6. Deploy and copy backend URL

### Connect to Vercel:

Same as Option 1, Step 3 - set `VITE_API_URL` in Vercel.

---

## 🐛 Troubleshooting

### CORS Errors

- ✅ Check `CORS_ORIGIN` in backend matches Vercel URL exactly
- ✅ Make sure backend redeployed after adding `CORS_ORIGIN`
- ✅ Check browser console for exact error

### API Not Responding

- ✅ Verify `VITE_API_URL` is set correctly in Vercel
- ✅ Test backend directly: `curl https://your-backend.railway.app/health`
- ✅ Make sure you redeployed Vercel after adding `VITE_API_URL`

### Timeout Issues

- ✅ Backend on Railway/Render has no timeout limits
- ✅ Only frontend is on Vercel (no timeout issues)
- ✅ AI requests go directly to backend (bypasses Vercel)

---

## 📋 Quick Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] `VITE_API_URL` set in Vercel (points to backend)
- [ ] `CORS_ORIGIN` set in backend (points to Vercel frontend)
- [ ] Both services redeployed
- [ ] Test calculator - should work!

---

## ✅ Summary

**Yes, Vercel works perfectly!**

- ✅ Frontend on Vercel (fast, reliable)
- ✅ Backend on Railway/Render (handles long requests)
- ✅ Simple connection between them
- ✅ Both free tiers available

**This is the best setup for your app!** 🚀

