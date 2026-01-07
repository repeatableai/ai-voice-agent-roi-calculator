# 🔐 Automatic Render Environment Variables Setup

This guide shows you how to automatically set your API keys in Render so you never have to manually enter them again.

---

## Option 1: Using the Setup Script (Recommended)

### Step 1: Get Your Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click your profile → **Account Settings**
3. Go to **API Keys** section
4. Click **"New API Key"**
5. Copy the API key (you'll only see it once!)

### Step 2: Run the Setup Script

**Using Node.js script (recommended):**

```bash
# Set your Render API key
export RENDER_API_KEY=your-render-api-key-here

# Run the script
node scripts/setup-render-env.js
```

**Or using Bash script:**

```bash
# Install Render CLI first
npm install -g render-cli

# Login to Render
render login

# Make script executable
chmod +x scripts/setup-render-env.sh

# Run the script
./scripts/setup-render-env.sh
```

The script will:
- ✅ Read your API keys from `backend/.env` file
- ✅ Automatically set all environment variables in Render
- ✅ Generate secure secrets (SESSION_SECRET, JWT_SECRET)
- ✅ Configure CORS automatically
- ✅ Link frontend to backend

---

## Option 2: Manual Setup (One-Time)

If you prefer to set them manually in Render dashboard:

### Backend Environment Variables

Go to your **Backend Service** → **Environment** tab and add:

```
NODE_ENV=production
PORT=10000
ANTHROPIC_API_KEY=<your-key-from-backend/.env>
OPENAI_API_KEY=<your-key-from-backend/.env>
SESSION_SECRET=<generate-random-string>
JWT_SECRET=<generate-random-string>
CORS_ORIGIN=<your-frontend-url>
```

### Frontend Environment Variables

Go to your **Frontend Service** → **Environment** tab and add:

```
VITE_API_URL=<your-backend-url>
```

**Note:** Once set in Render, these variables persist across all deployments. You only need to set them once!

---

## Option 3: Using Render CLI Directly

```bash
# Install Render CLI
npm install -g render-cli

# Login
render login

# Set environment variables
render env:set ANTHROPIC_API_KEY="your-key" --service aiva-backend
render env:set OPENAI_API_KEY="your-key" --service aiva-backend
render env:set NODE_ENV=production --service aiva-backend
render env:set PORT=10000 --service aiva-backend

# Generate and set secrets
render env:set SESSION_SECRET="$(openssl rand -base64 32)" --service aiva-backend
render env:set JWT_SECRET="$(openssl rand -base64 32)" --service aiva-backend

# Set frontend variables
render env:set VITE_API_URL="https://aiva-backend.onrender.com" --service aiva-frontend

# Set CORS
render env:set CORS_ORIGIN="https://aiva-frontend.onrender.com" --service aiva-backend
```

---

## 🔒 Security Notes

1. **Your `.env` file is NOT committed to GitHub** (it's in `.gitignore`)
2. **Render stores environment variables securely** - they're encrypted at rest
3. **API keys in Render persist** - you set them once and they're saved
4. **Never commit API keys** to your repository

---

## ✅ Verify Setup

After running the script, verify in Render dashboard:

1. Go to your **Backend Service** → **Environment**
2. Check that all variables are set (they'll show as `••••••••` for security)
3. Go to your **Frontend Service** → **Environment**
4. Verify `VITE_API_URL` is set correctly

---

## 🚀 After Setup

Once environment variables are set:

- ✅ They persist across all deployments
- ✅ They're automatically available to your services
- ✅ You never need to re-enter them
- ✅ New deployments automatically use them

---

## 🐛 Troubleshooting

**Script fails to authenticate?**
- Make sure your Render API key is correct
- Check that you have permission to modify the services

**Variables not showing up?**
- Wait a few seconds and refresh the Render dashboard
- Check the service logs for any errors

**Need to update a variable?**
- Just run the script again, or update in Render dashboard
- Changes take effect on next deployment

---

**💡 Pro Tip:** Save your Render API key in a password manager so you can easily run the setup script again if needed!


