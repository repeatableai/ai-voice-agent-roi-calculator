# 🚀 Render Quick Start Guide

**Fast deployment to get your public link in 10 minutes**

---

## Step 1: Deploy Backend (5 min)

1. Go to [render.com](https://render.com) → Sign up/Login
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select `repeatableai/ai-voice-agent-roi-calculator`
4. Configure:
   - **Name**: `aiva-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
ANTHROPIC_API_KEY=your-anthropic-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
   SESSION_SECRET=<run: openssl rand -base64 32>
   JWT_SECRET=<run: openssl rand -base64 32>
   ```

6. Click **"Create Web Service"**
7. **Copy your backend URL** (e.g., `https://aiva-backend-xxxx.onrender.com`)

---

## Step 2: Deploy Frontend (3 min)

1. Click **"New +"** → **"Static Site"**
2. Select same repository
3. Configure:
   - **Name**: `aiva-frontend`
   - **Root Directory**: `AIVA`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=<your-backend-url-from-step-1>
   ```
   Example: `VITE_API_URL=https://aiva-backend-xxxx.onrender.com`

5. Click **"Create Static Site"**
6. **Copy your frontend URL** (e.g., `https://aiva-frontend-xxxx.onrender.com`)

---

## Step 3: Connect Frontend to Backend (2 min)

1. Go back to **Backend Service** → **Environment**
2. Add/Update:
   ```
   CORS_ORIGIN=<your-frontend-url-from-step-2>
   ```
   Example: `CORS_ORIGIN=https://aiva-frontend-xxxx.onrender.com`

3. Click **"Save Changes"** (auto-redeploys)

---

## ✅ Done!

**Your public link:** `https://aiva-frontend-xxxx.onrender.com`

Test it:
- Open the URL in your browser
- Try the calculator
- Check browser console (F12) for any errors

---

## 🐛 Troubleshooting

**Backend not starting?**
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure `PORT=10000` is set

**Frontend can't connect?**
- Verify `VITE_API_URL` matches backend URL exactly
- Check `CORS_ORIGIN` matches frontend URL exactly
- Look for CORS errors in browser console

**Need help?** See `RENDER_DEPLOYMENT.md` for detailed guide.

