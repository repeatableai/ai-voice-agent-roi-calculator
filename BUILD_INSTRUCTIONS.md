# 🔨 Build Instructions - AI Voice Agent System

## ✅ Current Status

**Backend Build Status:**
- ✅ All 19 backend files created
- ✅ Dependencies installed (350 packages)
- ✅ No security vulnerabilities
- ✅ Directories created (logs, uploads)

**What's Ready:**
- ✅ Complete backend API server
- ✅ Frontend admin dashboard
- ✅ All documentation
- ✅ Configuration templates

---

## ⚠️ What You Need to Do

### 1. Install PostgreSQL

PostgreSQL is **required** for the backend. Choose your platform:

#### macOS
```bash
# Using Homebrew (recommended)
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14

# Or start temporarily
pg_ctl -D /usr/local/var/postgresql@14 start
```

#### Windows
1. Download installer: https://www.postgresql.org/download/windows/
2. Run installer (keep default port 5432)
3. Remember the password you set
4. PostgreSQL should start automatically

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Database

After PostgreSQL is installed:

```bash
# Create database
createdb aivoice

# If that doesn't work, use psql:
psql postgres
CREATE DATABASE aivoice;
\q
```

### 3. Run Database Schema

```bash
cd /Users/steen/ai-voice-agent
psql aivoice < backend/db/schema.sql
```

**Verify it worked:**
```bash
psql aivoice
\dt
# You should see 8 tables
\q
```

### 4. Configure Environment Variables

```bash
cd /Users/steen/ai-voice-agent

# Copy template
cp .env.example .env

# Edit with your favorite editor
nano .env
# or
code .env
# or
open -e .env
```

**Required values in .env:**
```env
# Get from: https://console.anthropic.com/
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Get from: https://elevenlabs.io/
ELEVENLABS_API_KEY=xxxxx

# Get from: https://platform.openai.com/
OPENAI_API_KEY=sk-xxxxx

# Generate random strings:
SESSION_SECRET=<run: openssl rand -base64 32>
JWT_SECRET=<run: openssl rand -base64 32>

# Local database (adjust if needed)
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/aivoice
```

### 5. Start the Backend

```bash
cd /Users/steen/ai-voice-agent/backend
npm start
```

**Expected output:**
```
🚀 Server running on port 3000 in development mode
📡 API available at http://localhost:3000/api
💚 Health check at http://localhost:3000/health
Database initialized
```

### 6. Test It!

Open a new terminal:

```bash
# Health check
curl http://localhost:3000/health

# Should return:
# {"status":"healthy","checks":{"database":true,...}}
```

---

## 🚀 Running the Full System

### Terminal 1: Backend
```bash
cd /Users/steen/ai-voice-agent/backend
npm start
```

### Terminal 2: Frontend (optional)
```bash
cd /Users/steen/ai-voice-agent

# Option A: Python
python3 -m http.server 8000

# Option B: Node.js http-server
npx http-server -p 8000

# Option C: PHP
php -S localhost:8000
```

Then open: `http://localhost:8000`

---

## 🔑 Default Login

After the backend is running:

- **URL**: `http://localhost:3000`
- **Email**: `admin@example.com`
- **Password**: `Admin123!`

**⚠️ IMPORTANT:** Change this password immediately!

---

## 🐛 Troubleshooting

### "PostgreSQL not installed"
- Follow installation instructions above for your platform
- Verify: `psql --version`

### "Database connection failed"
- Check PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in .env
- Check password is correct

### "Port 3000 already in use"
```bash
# Find what's using it
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### "API keys invalid"
- Double-check .env file
- No extra spaces or quotes
- Restart backend after changing .env

---

## 📁 File Locations

All files are at: `/Users/steen/ai-voice-agent/`

```
Backend: /Users/steen/ai-voice-agent/backend/
Docs: /Users/steen/ai-voice-agent/*.md
Frontend: /Users/steen/ai-voice-agent/*.js
```

---

## 📚 Next Steps

1. ✅ Install PostgreSQL
2. ✅ Create database
3. ✅ Run schema
4. ✅ Configure .env
5. ✅ Start backend
6. ✅ Test endpoints
7. ✅ Open frontend
8. ✅ Create your first agent!

---

## 🆘 Need Help?

**Documentation:**
- Quick Start: `GETTING_STARTED.md`
- Full Guide: `README.md`
- Backend: `backend/README.md`
- Deploy: `DEPLOYMENT_GUIDE.md`

**Common Issues:**
All addressed in `GETTING_STARTED.md`

---

## ✅ Build Checklist

- [ ] PostgreSQL installed
- [ ] Database created (`aivoice`)
- [ ] Schema loaded (8 tables)
- [ ] Dependencies installed
- [ ] .env file configured
- [ ] Backend starts without errors
- [ ] Health check passes
- [ ] Can create user
- [ ] Can create agent

**When all checked:** You're ready to use the system! 🎉

---

**Status**: Backend built ✅ | Database pending ⏳ | Ready to run! 🚀
