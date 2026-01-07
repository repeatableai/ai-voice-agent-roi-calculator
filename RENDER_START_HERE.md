# 🚀 Render Deployment - Start Here

**Complete step-by-step guide from zero to live app.**

---

## 📋 What You Need

- GitHub account (you have this ✅)
- Render account (sign up at render.com - free)
- 10 minutes

---

## Step 1: Get Your API Keys (30 seconds)

Open terminal and run:

```bash
cd "/Users/steen/AIVA(2026)/ai-voice-agent-roi-calculator"
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

**Copy both keys** - you'll need them in Step 3.

---

## Step 2: Sign Up / Log In to Render (1 minute)

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign In"**
3. Sign in with GitHub (easiest)
4. You're now in the Render Dashboard

---

## Step 3: Deploy Backend (3 minutes)

### 3.1 Create Backend Service

1. In Render Dashboard, click **"New +"** button (top right)
2. Click **"Blueprint"**
3. If asked to connect GitHub:
   - Click **"Connect GitHub"**
   - Authorize Render
   - Select repository: **`repeatableai/ai-voice-agent-roi-calculator`**
4. Render will detect `render.yaml` and show you a service: **`aiva-backend`**
5. Click **"Apply"**

### 3.2 Add API Keys

1. Wait for the service to be created (30 seconds)
2. Click on **`aiva-backend`** service
3. Click **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"** button
5. Add these **one by one**:

   **Variable 1:**
   - Key: `ANTHROPIC_API_KEY`
   - Value: `<paste-your-anthropic-key-from-step-1>`
   - Click **"Save"**

   **Variable 2:**
   - Key: `OPENAI_API_KEY`
   - Value: `<paste-your-openai-key-from-step-1>`
   - Click **"Save"**

6. Click **"Manual Deploy"** → **"Deploy latest commit"**
7. Wait 2-3 minutes for deployment
8. When it says **"Live"**, click on the service name
9. **Copy the URL** at the top (e.g., `https://aiva-backend-xxxx.onrender.com`)
   - This is your **Backend URL** - save it!

---

## Step 4: Deploy Frontend (3 minutes)

### 4.1 Create Frontend Service

1. In Render Dashboard, click **"New +"** button
2. Click **"Static Site"**
3. If asked to connect GitHub:
   - Click **"Connect GitHub"** (or select if already connected)
   - Select repository: **`repeatableai/ai-voice-agent-roi-calculator`**
4. Fill in the form **EXACTLY**:

   - **Name**: `aiva-frontend`
   - **Branch**: `main`
   - **Root Directory**: `AIVA` ⚠️ **MUST BE EXACTLY "AIVA"**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` ⚠️ **MUST BE EXACTLY "dist"**

5. Click **"Advanced"** → **"Add Environment Variable"**
6. Add:

   - Key: `VITE_API_URL`
   - Value: `<paste-your-backend-url-from-step-3>`
   - Example: `https://aiva-backend-xxxx.onrender.com`

7. Click **"Create Static Site"**
8. Wait 2-3 minutes for deployment
9. When it says **"Live"**, click on the service name
10. **Copy the URL** at the top (e.g., `https://aiva-frontend-xxxx.onrender.com`)
    - This is your **Frontend URL** - this is your public link! 🎉

---

## Step 5: Connect Frontend to Backend (1 minute)

1. Go back to **`aiva-backend`** service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add:

   - Key: `CORS_ORIGIN`
   - Value: `<paste-your-frontend-url-from-step-4>`
   - Example: `https://aiva-frontend-xxxx.onrender.com`

5. Click **"Save Changes"**
6. Wait 1-2 minutes for auto-redeploy

---

## ✅ Done!

**Your public link is:** `<your-frontend-url-from-step-4>`

Open it in your browser - you should see the **AIVA ROI Calculator**!

---

## 🎯 Quick Checklist

- [ ] Got API keys from `backend/.env`
- [ ] Created backend service via Blueprint
- [ ] Added `ANTHROPIC_API_KEY` to backend
- [ ] Added `OPENAI_API_KEY` to backend
- [ ] Backend deployed and URL copied
- [ ] Created frontend Static Site
- [ ] Root Directory = `AIVA` ✅
- [ ] Publish Directory = `dist` ✅
- [ ] Added `VITE_API_URL` = backend URL
- [ ] Frontend deployed and URL copied
- [ ] Added `CORS_ORIGIN` = frontend URL to backend
- [ ] Tested public link - shows AIVA ROI Calculator ✅

---

## 🐛 Troubleshooting

### Backend won't start
- Check **Logs** tab in backend service
- Verify API keys are correct (no extra spaces)
- Make sure `PORT=10000` is set (should be automatic)

### Frontend shows wrong app (login page)
- **Root Directory must be `AIVA`** (not `public` or empty)
- Delete frontend service and recreate with Root Directory = `AIVA`

### Frontend can't connect to backend
- Verify `VITE_API_URL` matches backend URL exactly
- Verify `CORS_ORIGIN` matches frontend URL exactly
- Check browser console (F12) for errors

### Build fails
- Check **Logs** tab for error messages
- Make sure Root Directory = `AIVA` and Publish Directory = `dist`
- Try **Manual Deploy** → **Clear build cache** → **Deploy**

---

## 📝 Summary

1. **Backend**: Blueprint → Add API keys → Deploy
2. **Frontend**: Static Site → Root = `AIVA` → Add backend URL → Deploy
3. **Connect**: Add frontend URL to backend CORS → Done

**Total time: ~10 minutes**

---

**That's it! Follow these steps exactly and you'll have your public link.**


