# 🚀 One Deployment - Everything Together

**Deploy frontend + backend together. One service. One URL. Done.**

---

## How It Works

The backend now serves the frontend automatically:
- ✅ Backend handles API routes (`/api/*`)
- ✅ Backend serves frontend for everything else (`/*`)
- ✅ One deployment, one URL, everything works

---

## Deploy to Railway (Easiest - 3 minutes)

### Step 1: Create Project

1. Go to https://railway.app
2. Sign in with **GitHub**
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select: `repeatableai/ai-voice-agent-roi-calculator`

### Step 2: Configure Service

Railway auto-detects Node.js. Configure:

- **Root Directory**: `backend` ⚠️ **IMPORTANT**
- **Build Command**: `npm run build` (builds frontend first, then backend)
- **Start Command**: `npm start` (starts backend which serves frontend)

### Step 3: Add Environment Variables

Go to **Variables** tab, add:

```
ANTHROPIC_API_KEY=<your-anthropic-key>
OPENAI_API_KEY=<your-openai-key>
NODE_ENV=production
PORT=10000
```

**Get your keys:**
```bash
cat backend/.env | grep -E "ANTHROPIC_API_KEY|OPENAI_API_KEY"
```

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait 3-5 minutes (builds frontend, then starts backend)
3. **Done!** You get ONE URL that serves everything

---

## Deploy to Render (Alternative)

### Step 1: Create Web Service

1. Go to https://render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub → Select repo

### Step 2: Configure

- **Name**: `aiva`
- **Root Directory**: `backend`
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Plan**: Free

### Step 3: Environment Variables

Add:
```
ANTHROPIC_API_KEY=<your-key>
OPENAI_API_KEY=<your-key>
NODE_ENV=production
PORT=10000
```

### Step 4: Deploy

Click **"Create Web Service"** → Wait → **Done!**

---

## ✅ That's It!

**One URL. Everything works:**
- Frontend: `https://your-app.railway.app/`
- API: `https://your-app.railway.app/api/aiva/...`

**No separate services. No CORS issues. No connection setup. Just works.**

---

## How It Works

1. **Build step**: `npm run build` builds the React frontend to `AIVA/dist`
2. **Start step**: `npm start` starts Express backend
3. **Backend serves**: 
   - API routes → `/api/*` → Express routes
   - Everything else → `/*` → Frontend React app

**One service. One deployment. One URL. Simple.**

---

## 🎯 Benefits

✅ **One deployment** - Not two separate services  
✅ **No CORS** - Same origin, no CORS needed  
✅ **Simpler** - One URL, one place to manage  
✅ **Faster** - No network calls between services  
✅ **Easier** - Like every other normal app  

---

**This is how it should be. One deployment. Done.**

