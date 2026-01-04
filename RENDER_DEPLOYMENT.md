# 🚀 Render Deployment Guide for AIVA ROI Calculator

Complete step-by-step guide to deploy AIVA to Render and get a public link.

---

## 📋 Prerequisites

1. **GitHub Account** - Your code is already on GitHub ✅
2. **Render Account** - Sign up at [render.com](https://render.com) (free tier available)
3. **API Keys Ready** - You have Anthropic and OpenAI API keys ✅

---

## 🎯 Deployment Strategy

We'll deploy **two services**:
1. **Backend API** - Node.js/Express server (handles AI requests)
2. **Frontend** - React/Vite app (user interface)

---

## Step 1: Deploy Backend API

### 1.1 Create New Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account if not already connected
4. Select repository: `repeatableai/ai-voice-agent-roi-calculator`

### 1.2 Configure Backend Service

**Basic Settings:**
- **Name**: `aiva-backend` (or your preferred name)
- **Region**: Choose closest to your users (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: `Free` (or `Starter` for better performance)

### 1.3 Set Environment Variables

Click **"Environment"** tab and add:

```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=your-anthropic-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
SESSION_SECRET=<generate-random-string>
JWT_SECRET=<generate-random-string>
CORS_ORIGIN=https://aiva-frontend.onrender.com
```

**To generate secrets:**
```bash
openssl rand -base64 32
```
Run this twice for SESSION_SECRET and JWT_SECRET.

### 1.4 Deploy Backend

1. Click **"Create Web Service"**
2. Wait for deployment (2-5 minutes)
3. Copy your **service URL** (e.g., `https://aiva-backend.onrender.com`)

### 1.5 Verify Backend

Test the health endpoint:
```bash
curl https://aiva-backend.onrender.com/health
```

Should return: `{"status":"healthy",...}`

---

## Step 2: Deploy Frontend

### 2.1 Create New Static Site

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect GitHub if needed
3. Select repository: `repeatableai/ai-voice-agent-roi-calculator`

### 2.2 Configure Frontend Service

**Basic Settings:**
- **Name**: `aiva-frontend` (or your preferred name)
- **Branch**: `main`
- **Root Directory**: `AIVA`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 2.3 Set Environment Variables

Add one environment variable:

```
VITE_API_URL=https://aiva-backend.onrender.com
```

**⚠️ IMPORTANT:** Replace `aiva-backend.onrender.com` with your actual backend URL from Step 1.4!

### 2.4 Deploy Frontend

1. Click **"Create Static Site"**
2. Wait for deployment (2-3 minutes)
3. Copy your **frontend URL** (e.g., `https://aiva-frontend.onrender.com`)

---

## Step 3: Update CORS Configuration

### 3.1 Update Backend CORS

1. Go back to your **Backend Service** in Render
2. Click **"Environment"** tab
3. Update `CORS_ORIGIN` to your frontend URL:
   ```
   CORS_ORIGIN=https://aiva-frontend.onrender.com
   ```
4. Click **"Save Changes"** - This will trigger a redeploy

### 3.2 Verify Connection

1. Open your frontend URL in a browser
2. Open browser DevTools (F12) → Console tab
3. Try using the calculator
4. Check Network tab for API calls to backend

---

## Step 4: Update Frontend API URL (If Needed)

If your frontend isn't connecting:

1. Go to **Frontend Service** → **Environment**
2. Verify `VITE_API_URL` matches your backend URL exactly
3. Click **"Manual Deploy"** → **"Clear build cache & deploy"**

---

## 🔗 Your Public Links

After deployment, you'll have:

- **Frontend**: `https://aiva-frontend.onrender.com`
- **Backend API**: `https://aiva-backend.onrender.com`
- **Health Check**: `https://aiva-backend.onrender.com/health`

---

## 🐛 Troubleshooting

### Backend won't start

**Check logs:**
1. Go to Backend Service → **"Logs"** tab
2. Look for errors

**Common issues:**
- Missing environment variables → Add them in Environment tab
- Port conflict → Ensure `PORT=10000` is set
- API key errors → Verify keys are correct

### Frontend can't connect to backend

**Check:**
1. Browser Console for CORS errors
2. Network tab for failed requests
3. Backend CORS_ORIGIN matches frontend URL exactly
4. Backend is running (check health endpoint)

### Build fails

**Frontend build issues:**
- Clear build cache: Manual Deploy → Clear build cache
- Check Node version compatibility
- Verify all dependencies in package.json

**Backend build issues:**
- Check logs for missing dependencies
- Verify `backend/package.json` has all required packages

---

## 🔄 Updating Your Deployment

### Automatic Deploys

Render automatically deploys when you push to `main` branch.

### Manual Deploy

1. Go to your service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**

### Rollback

1. Go to service → **"Events"** tab
2. Find previous successful deployment
3. Click **"Redeploy"**

---

## 💰 Render Free Tier Limits

- **750 hours/month** of runtime (enough for 24/7 on one service)
- **100GB bandwidth/month**
- **Services spin down after 15 minutes of inactivity** (free tier)
- **First request after spin-down takes ~30 seconds** (cold start)

**Upgrade to Starter ($7/month)** for:
- Always-on services (no spin-down)
- Faster cold starts
- More bandwidth

---

## 📝 Quick Reference

**Backend Service:**
- Root Directory: `backend`
- Build: `npm install`
- Start: `npm start`
- Port: `10000` (Render sets this automatically)

**Frontend Service:**
- Root Directory: `AIVA`
- Build: `npm install && npm run build`
- Publish: `dist`

**Required Environment Variables:**

**Backend:**
- `ANTHROPIC_API_KEY`
- `OPENAI_API_KEY`
- `SESSION_SECRET`
- `JWT_SECRET`
- `CORS_ORIGIN` (your frontend URL)

**Frontend:**
- `VITE_API_URL` (your backend URL)

---

## ✅ Deployment Checklist

- [ ] Backend deployed and health check works
- [ ] Frontend deployed and accessible
- [ ] CORS_ORIGIN set to frontend URL
- [ ] VITE_API_URL set to backend URL
- [ ] Test calculator functionality
- [ ] Check browser console for errors
- [ ] Verify API calls in Network tab

---

**🎉 Once deployed, share your frontend URL - that's your public link!**

