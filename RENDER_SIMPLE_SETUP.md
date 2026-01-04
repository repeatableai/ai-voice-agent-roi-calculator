# 🚀 Render Simple Setup - 5 Minutes

**Copy-paste setup. No confusion.**

---

## Your API Keys

**Get them instantly:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

Copy both keys - you'll paste them into Render in Step 1.

---

## Step 1: Deploy Backend (2 min)

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Select repo: `repeatableai/ai-voice-agent-roi-calculator`
4. Click **"Apply"**
5. Go to **aiva-backend** service → **Environment** tab
6. Add these environment variables (get keys from `backend/.env`):

```
ANTHROPIC_API_KEY=<paste-your-key-from-backend/.env>
OPENAI_API_KEY=<paste-your-key-from-backend/.env>
```

**Quick get keys:** Run `cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"` in terminal

7. Click **"Save Changes"**
8. Wait for deployment (2-3 min)
9. **Copy your backend URL** (e.g., `https://aiva-backend-xxxx.onrender.com`)

---

## Step 2: Deploy Frontend (2 min)

1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Select repo: `repeatableai/ai-voice-agent-roi-calculator`
3. Fill in **EXACTLY**:

   - **Name**: `aiva-frontend`
   - **Branch**: `main`
   - **Root Directory**: `AIVA`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

4. Click **"Environment"** tab → Add:

   ```
   VITE_API_URL=<paste-your-backend-url-from-step-1>
   ```

5. Click **"Create Static Site"**
6. Wait for deployment (2-3 min)
7. **Copy your frontend URL** (e.g., `https://aiva-frontend-xxxx.onrender.com`)

---

## Step 3: Connect Them (1 min)

1. Go to **Backend Service** → **Environment** tab
2. Add/Update:

   ```
   CORS_ORIGIN=<paste-your-frontend-url-from-step-2>
   ```

3. Click **"Save Changes"** (auto-redeploys)

---

## ✅ Done!

**Your public link:** `<your-frontend-url>`

Open it - you should see the AIVA ROI Calculator!

---

## 🐛 If Something Goes Wrong

**Wrong app showing?**
- Frontend Root Directory must be `AIVA` (not `public`)
- Delete frontend service and recreate with Root Directory = `AIVA`

**Build fails?**
- Check logs in Render dashboard
- Make sure Root Directory = `AIVA` and Publish Directory = `dist`

**Can't connect?**
- Verify `VITE_API_URL` matches backend URL exactly
- Verify `CORS_ORIGIN` matches frontend URL exactly

---

**That's it. 5 minutes. Done.**

