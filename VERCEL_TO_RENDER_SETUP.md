# 🔗 Connect Existing Vercel Frontend to Render Backend

**Step-by-step guide to deploy backend to Render and connect to your Vercel frontend.**

---

## ✅ Prerequisites

- ✅ Vercel frontend already deployed (you have this!)
- ✅ GitHub repo with your code
- ✅ API keys ready (Anthropic & OpenAI)

---

## Step 1: Get Your API Keys (30 seconds)

```bash
cd "/Users/steen/AIVA(2026)/ai-voice-agent-roi-calculator/backend"
cat .env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

Copy both keys - you'll paste them into Render.

---

## Step 2: Deploy Backend to Render (5 minutes)

### 2.1 Create Render Account

1. Go to https://render.com
2. Sign up/Login with **GitHub** (same account as Vercel)
3. Click **"New +"** → **"Web Service"**

### 2.2 Connect Repository

1. Connect GitHub if not already connected
2. Select repository: `repeatableai/ai-voice-agent-roi-calculator` (or your repo name)
3. Click **"Connect"**

### 2.3 Configure Backend Service

Fill in these **EXACT** settings:

**Basic Settings:**
- **Name**: `aiva-backend` (or your preferred name)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main` (or your main branch)
- **Root Directory**: `backend` ⚠️ **CRITICAL - Must be `backend`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (or `Starter` for always-on)

### 2.4 Add Environment Variables

Click **"Environment"** tab and add these variables:

```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<paste-your-anthropic-key>
OPENAI_API_KEY=<paste-your-openai-key>
SESSION_SECRET=<generate-random-string>
JWT_SECRET=<generate-random-string>
```

**To generate secrets:**
```bash
# Run this twice (once for SESSION_SECRET, once for JWT_SECRET)
openssl rand -base64 32
```

**Or use online generator:** https://www.random.org/strings/

### 2.5 Deploy Backend

1. Click **"Create Web Service"**
2. Wait 3-5 minutes for deployment
3. **Copy your backend URL** (e.g., `https://aiva-backend.onrender.com`)

**⚠️ IMPORTANT:** Save this URL - you'll need it in Step 3!

### 2.6 Verify Backend is Working

Test the health endpoint:

```bash
curl https://your-backend.onrender.com/health
```

Should return: `{"status":"healthy",...}`

---

## Step 3: Get Your Vercel Frontend URL (30 seconds)

1. Go to https://vercel.com/dashboard
2. Click on your **AIVA project**
3. Go to **Deployments** tab
4. **Copy your production URL** (e.g., `https://aiva.vercel.app`)

**⚠️ IMPORTANT:** Save this URL - you'll need it in Step 4!

---

## Step 4: Connect Backend to Frontend (2 minutes)

### 4.1 Update Render Backend CORS

1. Go back to Render Dashboard → Your **Backend Service**
2. Click **"Environment"** tab
3. Add/Update this variable:

```
CORS_ORIGIN=<your-vercel-frontend-url>
```

**Example:**
```
CORS_ORIGIN=https://aiva.vercel.app
```

**⚠️ IMPORTANT:**
- Include `https://` prefix
- No trailing slash
- Must match your Vercel URL exactly

4. Click **"Save Changes"** (triggers auto-redeploy)

### 4.2 Update Vercel Frontend Environment Variable

1. Go to Vercel Dashboard → Your **AIVA Project**
2. Click **"Settings"** → **"Environment Variables"**
3. Click **"Add New"**
4. Add:

**Key:**
```
VITE_API_URL
```

**Value:**
```
<your-render-backend-url>
```

**Example:**
```
VITE_API_URL=https://aiva-backend.onrender.com
```

**⚠️ IMPORTANT:**
- Include `https://` prefix
- No trailing slash
- Must match your Render backend URL exactly

5. Select **"Production"** environment (and Preview/Development if you want)
6. Click **"Save"**

### 4.3 Redeploy Vercel Frontend

**This is critical!** Environment variables are baked into the build.

1. Go to Vercel Dashboard → Your Project → **"Deployments"** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait 1-2 minutes for redeployment

---

## Step 5: Test Your Setup (1 minute)

1. **Open your Vercel URL** in browser (e.g., `https://aiva.vercel.app`)
2. **Open browser DevTools** (F12) → **Console** tab
3. **Try using the calculator** - fill out the form and submit
4. **Check Console** for errors

**Expected:**
- ✅ No CORS errors
- ✅ API calls go to your Render backend
- ✅ Calculator works normally

**If you see CORS errors:**
- Double-check `CORS_ORIGIN` in Render matches Vercel URL exactly
- Make sure Render backend redeployed after adding `CORS_ORIGIN`

**If API calls fail:**
- Check `VITE_API_URL` in Vercel matches Render backend URL exactly
- Make sure you redeployed Vercel after adding `VITE_API_URL`
- Check Render backend logs for errors

---

## ✅ Done!

**Your setup:**
- **Frontend**: `https://your-app.vercel.app` (Vercel)
- **Backend**: `https://your-backend.onrender.com` (Render)
- **Connected**: ✅

---

## 📋 Quick Reference

### Render Backend Environment Variables:
```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
SESSION_SECRET=<generated>
JWT_SECRET=<generated>
CORS_ORIGIN=https://your-app.vercel.app
```

### Vercel Frontend Environment Variables:
```
VITE_API_URL=https://your-backend.onrender.com
```

---

## 🐛 Troubleshooting

### "CORS error" in browser console

**Fix:**
1. Check `CORS_ORIGIN` in Render matches Vercel URL exactly
2. Make sure Render backend redeployed after adding `CORS_ORIGIN`
3. Check browser console for exact error message

### "Cannot connect to backend"

**Fix:**
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Test backend directly: `curl https://your-backend.onrender.com/health`
3. Make sure you redeployed Vercel after adding `VITE_API_URL`
4. Check Render backend logs for errors

### Backend not responding

**Fix:**
1. Check Render Dashboard → Backend Service → **"Logs"** tab
2. Verify backend is "Live" (not sleeping)
3. Check environment variables are set correctly
4. Verify `PORT=10000` is set

### Frontend still using old backend

**Fix:**
1. Make sure you **redeployed Vercel** after adding `VITE_API_URL`
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Vercel deployment logs to verify `VITE_API_URL` is in build

---

## 🎯 Summary

**What you did:**
1. ✅ Deployed backend to Render
2. ✅ Set `CORS_ORIGIN` in Render (points to Vercel)
3. ✅ Set `VITE_API_URL` in Vercel (points to Render)
4. ✅ Redeployed Vercel frontend

**Total time: ~10 minutes**

**Your public link:** `https://your-app.vercel.app` (now connected to Render backend!)

---

## 💡 Pro Tips

- **Render free tier spins down** after 15 minutes of inactivity
- **First request after spin-down** takes ~30 seconds (cold start)
- **Upgrade to Render Starter ($7/month)** for always-on service
- **Both platforms auto-deploy** when you push to GitHub

---

**You're all set! Your Vercel frontend is now connected to your Render backend.** 🚀

