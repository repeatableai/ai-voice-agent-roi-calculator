# 🚀 Quick Deploy: Vercel Frontend → Render Backend

**Your API keys and secrets are ready! Follow these steps:**

---

## ✅ Step 1: Deploy Backend to Render (5 min)

### Option A: Via Web Interface (Easiest)

1. **Go to:** https://dashboard.render.com
2. **Click:** "New +" → "Web Service"
3. **Connect GitHub** → Select your repo
4. **Configure:**
   - Name: `aiva-backend`
   - Root Directory: `backend` ⚠️
   - Build: `npm install`
   - Start: `npm start`
   - Plan: Free

5. **Add Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   ANTHROPIC_API_KEY=<get-from-backend/.env>
   OPENAI_API_KEY=<get-from-backend/.env>
   SESSION_SECRET=fzL7dkkhM1SSy5u65F8nvpUuvypCnOlDUEJgcbJ9jHg=
   JWT_SECRET=1Gf+9Pcf5xitDX8ZK+N4oiDbv8rnTKkDHsqpiUqXkVw=
   ```

6. **Deploy** → Copy backend URL (e.g., `https://aiva-backend.onrender.com`)

---

## ✅ Step 2: Get Your Vercel URL (30 sec)

1. Go to: https://vercel.com/dashboard
2. Open your AIVA project
3. Copy production URL (e.g., `https://aiva.vercel.app`)

---

## ✅ Step 3: Connect Them (2 min)

### In Render:
1. Backend Service → Environment
2. Add: `CORS_ORIGIN` = `<your-vercel-url>`
3. Save (auto-redeploys)

### In Vercel:
1. Project → Settings → Environment Variables
2. Add: `VITE_API_URL` = `<your-render-backend-url>`
3. Save
4. Deployments → Redeploy ⚠️ **IMPORTANT**

---

## ✅ Done!

**Test:** Open your Vercel URL → Use calculator → Should work!

---

## 📋 Your Values Ready:

**API Keys:** ✅ (copied above)  
**Secrets:** ✅ (generated above)  
**Backend URL:** ⏳ (get after Step 1)  
**Vercel URL:** ⏳ (get from Step 2)

---

**Total time: ~8 minutes**

