# 🚀 Render Deployment - Exact Step-by-Step Instructions

**Using render.yaml for automatic deployment**

---

## Step 1: Get Your API Keys

Your API keys are in `backend/.env` file. 

**To get them, run this command:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

**Copy both keys - you'll need them in Step 5.**

---

## Step 2: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Sign in (or create account if needed)
3. Click **"New +"** button (top right)
4. Click **"Blueprint"** (this uses render.yaml automatically)

---

## Step 3: Connect GitHub Repository

1. If not connected, click **"Connect GitHub"**
2. Authorize Render to access your repositories
3. Select repository: **`repeatableai/ai-voice-agent-roi-calculator`**
4. Click **"Connect"**

---

## Step 4: Render Will Detect render.yaml

Render will automatically detect `render.yaml` and show you two services:
- **aiva-backend** (Web Service)
- **aiva-frontend** (Static Site)

Click **"Apply"** to proceed.

---

## Step 5: Set Environment Variables

### For Backend Service (aiva-backend):

Click on **"aiva-backend"** service, then go to **"Environment"** tab.

Add these environment variables:

```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<paste-your-key-from-backend/.env>
OPENAI_API_KEY=<paste-your-key-from-backend/.env>
```

**Get your keys by running:** `cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"`

**Generate secrets** (run these commands in terminal):

```bash
openssl rand -base64 32
```

Run it **twice** - once for SESSION_SECRET, once for JWT_SECRET.

Add:
```
SESSION_SECRET=<paste-first-generated-string>
JWT_SECRET=<paste-second-generated-string>
```

**Leave CORS_ORIGIN empty for now** - we'll set it after frontend deploys.

---

### For Frontend Service (aiva-frontend):

Click on **"aiva-frontend"** service, then go to **"Environment"** tab.

**Leave VITE_API_URL empty for now** - we'll set it after backend deploys.

---

## Step 6: Deploy Services

1. Click **"Apply"** or **"Create"** button
2. Render will start deploying both services
3. Wait 3-5 minutes for deployment to complete

---

## Step 7: Get Your Service URLs

After deployment completes:

1. **Backend URL**: Go to **aiva-backend** service → Copy the URL (e.g., `https://aiva-backend-xxxx.onrender.com`)
2. **Frontend URL**: Go to **aiva-frontend** service → Copy the URL (e.g., `https://aiva-frontend-xxxx.onrender.com`)

---

## Step 8: Connect Frontend to Backend

### Update Frontend Environment Variable:

1. Go to **aiva-frontend** service → **Environment** tab
2. Add/Update:
   ```
   VITE_API_URL=<your-backend-url-from-step-7>
   ```
   Example: `VITE_API_URL=https://aiva-backend-xxxx.onrender.com`
3. Click **"Save Changes"** (triggers auto-redeploy)

### Update Backend CORS:

1. Go to **aiva-backend** service → **Environment** tab
2. Add/Update:
   ```
   CORS_ORIGIN=<your-frontend-url-from-step-7>
   ```
   Example: `CORS_ORIGIN=https://aiva-frontend-xxxx.onrender.com`
3. Click **"Save Changes"** (triggers auto-redeploy)

---

## Step 9: Wait for Redeploy

Wait 2-3 minutes for both services to redeploy with new environment variables.

---

## Step 10: Test Your Public Link

1. Open your **Frontend URL** in browser
2. Test the calculator
3. Open browser DevTools (F12) → Console tab
4. Check for any errors

---

## ✅ Done!

**Your public link is:** `https://aiva-frontend-xxxx.onrender.com`

---

## 📋 Quick Reference - All Environment Variables

### Backend (aiva-backend):
```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<get-from-backend/.env>
OPENAI_API_KEY=<get-from-backend/.env>
SESSION_SECRET=<generate-with-openssl-rand-base64-32>
JWT_SECRET=<generate-with-openssl-rand-base64-32>
CORS_ORIGIN=<your-frontend-url>
```

**To get API keys:** Run `cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"`

### Frontend (aiva-frontend):
```
VITE_API_URL=<your-backend-url>
```

---

## 🐛 Troubleshooting

**Backend not starting?**
- Check logs in Render dashboard
- Verify all environment variables are set correctly
- Ensure PORT=10000 is set

**Frontend can't connect?**
- Verify VITE_API_URL matches backend URL exactly
- Check CORS_ORIGIN matches frontend URL exactly
- Look for CORS errors in browser console

**Services not deploying?**
- Check Render logs for build errors
- Verify GitHub repository is connected
- Ensure render.yaml is in root directory

---

**That's it! Follow these steps exactly and you'll have your public link in ~10 minutes.**

