# 🔗 Vercel Frontend + Render Backend Setup

**Quick checklist to ensure your Vercel public link works with Render backend.**

---

## ✅ Step 1: Verify Render Backend is Deployed

1. Go to https://dashboard.render.com
2. Check if you have a backend service (should be named `aiva` or `aiva-backend`)
3. **Copy your backend URL** (e.g., `https://aiva-xxxx.onrender.com`)

**If backend is NOT deployed:**
- Follow instructions in `RENDER_SIMPLE_SETUP.md` or `RENDER_EXACT_STEPS.md`
- Make sure backend is running and healthy

---

## ✅ Step 2: Configure Vercel Frontend Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your **AIVA project**
3. Go to **Settings** → **Environment Variables**
4. Add/Update these variables:

```
VITE_API_URL=<your-render-backend-url>
```

**Example:**
```
VITE_API_URL=https://aiva-xxxx.onrender.com
```

**⚠️ IMPORTANT:**
- Use your **actual Render backend URL** (from Step 1)
- Include `https://` prefix
- No trailing slash

5. Click **"Save"**

---

## ✅ Step 3: Configure Render Backend CORS

1. Go back to Render Dashboard → Your **Backend Service**
2. Go to **Environment** tab
3. Add/Update:

```
CORS_ORIGIN=<your-vercel-frontend-url>
```

**To get your Vercel URL:**
- Go to Vercel Dashboard → Your Project → **Deployments**
- Copy the URL (e.g., `https://aiva.vercel.app`)

**Example:**
```
CORS_ORIGIN=https://aiva.vercel.app
```

4. Click **"Save Changes"** (triggers auto-redeploy)

---

## ✅ Step 4: Redeploy Vercel Frontend

After setting `VITE_API_URL` in Vercel:

1. Go to Vercel Dashboard → Your Project → **Deployments**
2. Click **"..."** on the latest deployment → **"Redeploy"**
3. Wait 1-2 minutes for deployment to complete

**Why redeploy?** Environment variables are baked into the build, so you need to rebuild after adding `VITE_API_URL`.

---

## ✅ Step 5: Test Your Public Link

1. Open your Vercel URL (e.g., `https://aiva.vercel.app`)
2. Open browser DevTools (F12) → **Console** tab
3. Try using the calculator
4. Check for errors in Console

**Expected behavior:**
- ✅ No CORS errors
- ✅ API calls go to your Render backend URL
- ✅ Calculator works normally

**If you see CORS errors:**
- Double-check `CORS_ORIGIN` in Render matches your Vercel URL exactly
- Make sure Render backend redeployed after adding `CORS_ORIGIN`

---

## 🔍 Quick Verification Commands

**Test backend health:**
```bash
curl https://your-backend.onrender.com/health
```

**Test API endpoint:**
```bash
curl -X POST https://your-backend.onrender.com/api/aiva/research-role-deliverables \
  -H "Content-Type: application/json" \
  -d '{"jobTitle":"Test","industry":"Tech","companyName":"Test","hourlyRate":50}'
```

---

## 📋 Environment Variables Summary

### Vercel Frontend:
```
VITE_API_URL=https://your-backend.onrender.com
```

### Render Backend:
```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
SESSION_SECRET=<generated>
JWT_SECRET=<generated>
CORS_ORIGIN=https://your-frontend.vercel.app
```

---

## 🐛 Troubleshooting

### "CORS error" in browser console
- ✅ Check `CORS_ORIGIN` in Render matches Vercel URL exactly
- ✅ Make sure Render backend redeployed after adding `CORS_ORIGIN`
- ✅ Check browser console for exact error message

### "Cannot connect to backend"
- ✅ Verify `VITE_API_URL` is set correctly in Vercel
- ✅ Verify backend URL is accessible: `curl https://your-backend.onrender.com/health`
- ✅ Make sure you redeployed Vercel after adding `VITE_API_URL`

### Backend not responding
- ✅ Check Render dashboard → Backend service → Logs
- ✅ Verify backend is "Live" (not sleeping)
- ✅ Check environment variables are set correctly

---

## ✅ You're Done!

Once both are configured:
- ✅ Vercel frontend has `VITE_API_URL` pointing to Render backend
- ✅ Render backend has `CORS_ORIGIN` pointing to Vercel frontend
- ✅ Both services are redeployed

**Your public link:** `https://your-project.vercel.app`

---

## 💡 Pro Tip

If you change your Vercel domain or Render URL:
1. Update `VITE_API_URL` in Vercel
2. Update `CORS_ORIGIN` in Render
3. Redeploy both services

