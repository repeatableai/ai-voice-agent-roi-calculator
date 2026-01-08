# 🔧 Fix Render Deployment - https://aiva-y723.onrender.com

**Your Render deployment exists and is partially working. Let's make it fully functional.**

---

## ✅ Current Status

**What's Working:**
- ✅ Frontend is being served (HTML loads)
- ✅ Backend API responds (`/api/aiva/research-role-deliverables` works)
- ✅ Backend serves frontend correctly

**What Needs Fixing:**
- ⚠️ Health check shows "unhealthy" (database/redis - but AIVA routes don't need them)
- ⚠️ May need environment variables configured (API keys)
- ⚠️ Frontend may not be connecting to backend correctly

---

## 🔧 Step 1: Verify Environment Variables in Render

1. Go to https://dashboard.render.com
2. Click on your **`aiva`** service (or `aiva-y723`)
3. Go to **"Environment"** tab
4. **Verify these are set:**

```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
SESSION_SECRET=<generated>
JWT_SECRET=<generated>
```

**If missing, add them from `RENDER_ENV_VALUES.txt`**

---

## 🔧 Step 2: Ensure Frontend Uses Relative URLs

Your frontend should use **relative URLs** (not absolute) when served by backend:

**Current code:** Uses `import.meta.env.VITE_API_URL || ''`

**For Render (backend serves frontend):**
- **Don't set** `VITE_API_URL` in Render environment variables
- Frontend will use relative URLs (`/api/...`) automatically
- This avoids CORS issues

**If you have `VITE_API_URL` set, remove it** so frontend uses relative URLs.

---

## 🔧 Step 3: Verify Build Configuration

In Render Dashboard → Your Service → **Settings**:

**Build Command:**
```
cd backend && npm install && npm run build
```

**Start Command:**
```
cd backend && npm start
```

**Root Directory:** (leave empty or set to project root)

---

## 🔧 Step 4: Check Render Logs

1. Go to Render Dashboard → Your Service → **"Logs"** tab
2. Look for errors, especially:
   - Path resolution errors
   - Missing environment variables
   - API key errors
   - Frontend build errors

---

## 🔧 Step 5: Redeploy

After fixing environment variables:

1. Go to Render Dashboard → Your Service
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait 3-5 minutes for deployment

---

## ✅ Expected Result

After fixes:
- ✅ Frontend loads at `https://aiva-y723.onrender.com/`
- ✅ API works at `https://aiva-y723.onrender.com/api/aiva/...`
- ✅ Calculator works end-to-end
- ✅ No CORS errors
- ✅ No backend errors

---

## 🐛 Common Issues & Fixes

### "API Error" in Frontend

**Fix:**
- Check Render logs for backend errors
- Verify API keys are set correctly
- Check that `VITE_API_URL` is NOT set (use relative URLs)

### "Cannot connect to backend"

**Fix:**
- Frontend should use relative URLs (`/api/...`) when served by backend
- Remove `VITE_API_URL` environment variable if set
- Verify backend is running (check logs)

### Health Check Shows "Unhealthy"

**This is OK!** AIVA routes don't require database/redis. The health check is just informational.

---

## 📋 Quick Checklist

- [ ] Environment variables set in Render (API keys, secrets)
- [ ] `VITE_API_URL` NOT set (frontend uses relative URLs)
- [ ] Build command: `cd backend && npm install && npm run build`
- [ ] Start command: `cd backend && npm start`
- [ ] Redeployed after changes
- [ ] Checked Render logs for errors

---

## 🎯 Summary

**Your Render deployment is 90% there!** Just need to:
1. Verify environment variables are set
2. Ensure frontend uses relative URLs (remove `VITE_API_URL` if set)
3. Redeploy

**One URL, both frontend and backend working together!** 🚀

