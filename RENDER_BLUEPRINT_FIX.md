# 🔧 Render Blueprint Fix - Static Sites Not Supported

## The Issue

Render Blueprint (render.yaml) **does not support static sites**. The error "unknown type 'static'" occurs because Blueprint only supports `type: web` services.

## The Solution

**Option 1: Use Blueprint for Backend Only (Recommended)**

1. The updated `render.yaml` now only includes the backend service
2. Deploy backend using Blueprint
3. Create frontend manually as a Static Site

**Option 2: Create Both Services Manually**

Skip Blueprint entirely and create both services manually in Render dashboard.

---

## Step-by-Step: Deploy Backend with Blueprint

1. Go to Render Dashboard → **"New +"** → **"Blueprint"**
2. Select your repo: `repeatableai/ai-voice-agent-roi-calculator`
3. Render will detect `render.yaml` and create the backend service
4. Click **"Apply"**
5. Set environment variables:
   - `ANTHROPIC_API_KEY` (your key)
   - `OPENAI_API_KEY` (your key)
   - `CORS_ORIGIN` (set after frontend deploys)
6. Wait for backend to deploy
7. Copy backend URL

---

## Step-by-Step: Deploy Frontend Manually

1. Go to Render Dashboard → **"New +"** → **"Static Site"**
2. Connect GitHub if needed
3. Select repository: `repeatableai/ai-voice-agent-roi-calculator`
4. Configure:
   - **Name**: `aiva-frontend`
   - **Branch**: `main`
   - **Root Directory**: `AIVA`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Add Environment Variable:
   - `VITE_API_URL` = `<your-backend-url>`
6. Click **"Create Static Site"**
7. Copy frontend URL

---

## Connect Frontend to Backend

1. Go to **Backend Service** → **Environment**
2. Set `CORS_ORIGIN` = `<your-frontend-url>`
3. Save (auto-redeploys)

---

## Updated render.yaml

The `render.yaml` now only includes the backend service. This is the correct approach since Blueprint doesn't support static sites.

**Backend will deploy automatically via Blueprint.**  
**Frontend must be created manually as a Static Site.**

---

## Why This Happens

Render Blueprint is designed for web services (Node.js, Python, etc.) but not for static sites. Static sites in Render are a different service type that must be created through the dashboard UI.

---

**This is the correct approach - backend via Blueprint, frontend manually!**


