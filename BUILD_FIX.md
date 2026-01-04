# 🔧 Build Fix Guide

## Common Build Issues & Solutions

### Issue 1: Frontend Build Fails

**Problem:** `render.yaml` had incorrect service type for frontend.

**Fixed:** Changed `type: web` to `type: static` for frontend service.

**If build still fails:**
1. Check Render logs for specific error
2. Verify Node version (should be 18+)
3. Clear build cache: Render Dashboard → Service → Manual Deploy → Clear build cache

### Issue 2: Backend Build Fails

**Common causes:**
- Missing dependencies
- Node version mismatch
- Environment variables not set

**Solutions:**
1. Check `backend/package.json` has all dependencies
2. Verify Node version in `package.json` engines field
3. Ensure all environment variables are set in Render dashboard

### Issue 3: Static Site Not Found

**Problem:** `staticPublishPath` incorrect or build output not found.

**Solution:** Verify build creates `dist` folder:
```bash
cd AIVA
npm run build
ls -la dist
```

### Issue 4: Environment Variables Not Available

**Problem:** Vite environment variables not accessible during build.

**Solution:** Ensure `VITE_API_URL` is set in Render dashboard BEFORE building.

---

## Quick Fixes

### Clear Build Cache
1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy"
4. Check "Clear build cache"
5. Click "Deploy"

### Verify Build Locally
```bash
# Test backend build
cd backend
npm install
npm start

# Test frontend build
cd AIVA
npm install
npm run build
ls -la dist
```

### Check Render Logs
1. Go to Render Dashboard
2. Select service
3. Click "Logs" tab
4. Look for error messages

---

## Updated render.yaml

The render.yaml has been fixed. If you're still having issues:

1. **Delete existing services** in Render
2. **Redeploy using Blueprint** (it will use the fixed render.yaml)
3. **Or manually update** the service type to `static` for frontend

---

## Still Having Issues?

Share the exact error message from Render logs and I'll help fix it!

