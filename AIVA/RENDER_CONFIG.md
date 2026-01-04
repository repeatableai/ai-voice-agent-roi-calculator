# Render Frontend Configuration

## Required Settings for Static Site

When creating the frontend service in Render, use these **exact** settings:

### Basic Settings
- **Name**: `aiva-frontend`
- **Service Type**: `Static Site` (NOT Web Service)
- **Repository**: `repeatableai/ai-voice-agent-roi-calculator`
- **Branch**: `main`

### Build Settings
- **Root Directory**: `AIVA` ⚠️ **CRITICAL - Must be exactly "AIVA"**
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist` ⚠️ **CRITICAL - Must be exactly "dist"**

### Environment Variables
- **VITE_API_URL**: `<your-backend-url>` (e.g., `https://aiva-backend-xxxx.onrender.com`)

---

## Verification

After deployment, verify:
1. URL shows AIVA ROI Calculator (job title dropdown)
2. NOT the login page from `/public/index.html`
3. Check browser console - should connect to your backend URL, not localhost

---

## If Wrong App Shows

1. Delete the frontend service
2. Recreate with Root Directory = `AIVA` (not `public` or empty)
3. Ensure Publish Directory = `dist`
4. Redeploy

