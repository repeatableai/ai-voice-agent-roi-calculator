# 🔧 Frontend Deployment Fix

## The Problem

Your Render frontend is serving the **wrong app** - it's showing `/public/index.html` (old AI Voice Agent Platform) instead of `/AIVA` (AIVA ROI Calculator).

## The Solution

### Step 1: Verify Frontend Configuration in Render

1. Go to Render Dashboard
2. Select your **Frontend Service** (aiva-frontend)
3. Go to **Settings**
4. Verify these settings:
   - **Root Directory**: `AIVA` (NOT `public` or empty)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist` (NOT `public`)

### Step 2: Redeploy Frontend

1. Go to your Frontend Service
2. Click **"Manual Deploy"**
3. Check **"Clear build cache"**
4. Click **"Deploy"**

### Step 3: Verify Build Output

After deployment, check the logs. You should see:
```
✓ built in X.XXs
dist/index.html
dist/assets/...
```

If you see `public/` files, the Root Directory is wrong.

---

## Correct Render Frontend Settings

**Service Type:** Static Site  
**Root Directory:** `AIVA`  
**Build Command:** `npm install && npm run build`  
**Publish Directory:** `dist`  
**Environment Variable:**
- `VITE_API_URL` = `<your-backend-url>`

---

## What Should Be Deployed

The frontend should serve files from:
- `AIVA/dist/index.html` ✅ (AIVA ROI Calculator)
- NOT `public/index.html` ❌ (Old AI Voice Agent Platform)

---

## CSP Fix Applied

I've also updated the backend CSP to allow Google Fonts:
- Added `https://fonts.googleapis.com` to `styleSrc`
- Added `https://fonts.gstatic.com` to `fontSrc`

This fix is already pushed to GitHub and will be active on next backend deployment.

---

## Quick Checklist

- [ ] Frontend Root Directory = `AIVA`
- [ ] Build Command = `npm install && npm run build`
- [ ] Publish Directory = `dist`
- [ ] VITE_API_URL environment variable set
- [ ] Clear build cache and redeploy
- [ ] Verify deployed URL shows AIVA ROI Calculator (not login page)

---

**After fixing, your public link should show the AIVA ROI Calculator with the job title dropdown, not the login page!**

