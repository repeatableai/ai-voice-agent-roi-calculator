# 🚀 Getting Started - AI Voice Agent System

Complete step-by-step guide to get your AI Voice Agent system running in **under 15 minutes**.

---

## ⏱️ Quick Start Timeline

- **5 minutes**: Install & setup
- **3 minutes**: Configure
- **2 minutes**: Database
- **5 minutes**: Test & verify

**Total: 15 minutes** ⏰

---

## ✅ Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 16+** installed ([Download](https://nodejs.org/))
- [ ] **PostgreSQL 12+** installed ([Download](https://www.postgresql.org/download/))
- [ ] **API Keys** ready:
  - [ ] Anthropic (Claude) - [Get key](https://console.anthropic.com/)
  - [ ] ElevenLabs (TTS) - [Get key](https://elevenlabs.io/)
  - [ ] OpenAI (Embeddings) - [Get key](https://platform.openai.com/)
- [ ] **Git** installed (optional)
- [ ] **Terminal/Command line** access

---

## 📥 Step 1: Installation (2 minutes)

### Option A: Using Git

```bash
# Clone the repository
git clone <your-repository-url>
cd ai-voice-agent

# Install backend dependencies
cd backend
npm install
cd ..
```

### Option B: Manual Download

1. Download ZIP from repository
2. Extract to your desired location
3. Open terminal in the extracted folder
4. Run:
```bash
cd backend
npm install
```

**✅ Verify**: You should see `node_modules` folder created

---

## ⚙️ Step 2: Configuration (3 minutes)

### 2.1 Create Environment File

```bash
# From project root
cp .env.example .env
```

### 2.2 Edit .env File

Open `.env` in your text editor and fill in:

```env
# Required - Get these from API providers
ANTHROPIC_API_KEY=sk-ant-your-key-here
ELEVENLABS_API_KEY=your-elevenlabs-key-here
OPENAI_API_KEY=sk-your-openai-key-here

# Required - Generate random secrets
SESSION_SECRET=your-random-secret-here
JWT_SECRET=another-random-secret-here

# Database (default for local PostgreSQL)
DATABASE_URL=postgresql://postgres:password@localhost:5432/aivoice

# Optional
NODE_ENV=development
PORT=3000
```

### 2.3 Generate Secrets

**macOS/Linux:**
```bash
# Generate SESSION_SECRET
openssl rand -base64 32

# Generate JWT_SECRET
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
# Generate random secrets
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

**✅ Verify**: `.env` file exists with your API keys

---

## 💾 Step 3: Database Setup (2 minutes)

### 3.1 Create Database

**macOS/Linux:**
```bash
# Create database
createdb aivoice

# Verify
psql -l | grep aivoice
```

**Windows:**
```cmd
# Using pgAdmin or command line
psql -U postgres
CREATE DATABASE aivoice;
\q
```

### 3.2 Run Schema

```bash
# From project root
psql aivoice < backend/db/schema.sql

# Or if using specific user
psql -U postgres -d aivoice -f backend/db/schema.sql
```

### 3.3 Verify Database

```bash
# Connect to database
psql aivoice

# List tables
\dt

# You should see:
# users, agents, knowledge_bases, knowledge_chunks, etc.

# Exit
\q
```

**✅ Verify**: Database has 8+ tables

---

## 🚀 Step 4: Start the Server (1 minute)

### Development Mode (with auto-reload)

```bash
cd backend
npm run dev
```

### Production Mode

```bash
cd backend
npm start
```

**Expected Output:**
```
🚀 Server running on port 3000 in development mode
📡 API available at http://localhost:3000/api
💚 Health check at http://localhost:3000/health
Database initialized
Redis connected for session storage (or: using memory store)
```

**✅ Verify**: Server starts without errors

---

## 🧪 Step 5: Test the System (5 minutes)

### 5.1 Health Check

**Browser:**
Open: `http://localhost:3000/health`

**Terminal:**
```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "checks": {
    "database": true,
    "redis": false
  }
}
```

### 5.2 Create Test User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

**Expected Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### 5.3 Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### 5.4 Create Test Agent

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Test Agent",
    "description": "My first AI agent",
    "targetUrls": ["http://localhost:8000"]
  }'
```

**Expected Response:**
```json
{
  "message": "Agent created successfully",
  "agent": {
    "id": "agent_...",
    "name": "Test Agent",
    ...
  }
}
```

**✅ All tests passing? You're ready!** 🎉

---

## 🌐 Step 6: Frontend Setup (2 minutes)

### Option A: Simple HTTP Server

```bash
# Install http-server globally
npm install -g http-server

# From project root
http-server -p 8000
```

### Option B: Python Server

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

### Option C: VS Code Live Server

1. Install "Live Server" extension
2. Right-click `index.html` (if you have one)
3. Select "Open with Live Server"

**Open Browser:**
`http://localhost:8000`

**✅ Verify**: Frontend loads without errors

---

## 🎨 Step 7: Create Your First Agent (5 minutes)

### Using Default Admin Account

1. **Login:**
   - Email: `admin@example.com`
   - Password: `Admin123!`
   - **⚠️ CHANGE THIS IMMEDIATELY!**

2. **Create Agent:**
   - Name: "Support Bot"
   - Description: "Handles customer questions"
   - Voice: Rachel (default)
   - Personality: Friendly
   - Language: English

3. **Upload Knowledge Base:**
   - Create a `.txt` file with your FAQ
   - Upload via Knowledge Base manager
   - Wait for processing

4. **Deploy:**
   - Add target URL: `http://localhost:8000`
   - Save agent
   - Widget appears on your page!

**✅ Verify**: Agent widget appears and responds

---

## 🔧 Troubleshooting

### Problem: "Cannot connect to database"

**Solution:**
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it:
# macOS
brew services start postgresql

# Linux
sudo service postgresql start

# Windows
# Start via Services app
```

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

### Problem: "API key invalid"

**Solution:**
1. Check `.env` file has correct keys
2. No extra spaces or quotes
3. Restart server after changing `.env`

### Problem: "Module not found"

**Solution:**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules
npm install
```

### Problem: "Permission denied" (database)

**Solution:**
```bash
# Grant permissions
psql postgres
GRANT ALL PRIVILEGES ON DATABASE aivoice TO your_username;
\q
```

---

## 📚 Next Steps

### Essential

1. **Change default password:**
   ```bash
   curl -X POST http://localhost:3000/api/auth/change-password \
     -H "Content-Type: application/json" \
     -b cookies.txt \
     -d '{
       "currentPassword": "Admin123!",
       "newPassword": "YourSecurePassword123!"
     }'
   ```

2. **Create your own user:**
   - Register new account
   - Logout of admin
   - Login with your account

3. **Test AI chat:**
   - Create an agent
   - Upload knowledge base
   - Chat with your agent

### Recommended

4. **Set up Redis** (for production):
   ```bash
   # Install Redis
   brew install redis  # macOS
   # or
   sudo apt-get install redis-server  # Linux

   # Start Redis
   redis-server

   # Add to .env
   REDIS_URL=redis://localhost:6379
   ```

5. **Enable HTTPS** (for production):
   - Get SSL certificate
   - Configure reverse proxy (nginx)
   - See `DEPLOYMENT_GUIDE.md`

6. **Set up monitoring:**
   - Sign up for Sentry
   - Add SENTRY_DSN to `.env`
   - See logs in `backend/logs/`

---

## 🎓 Learning Path

### Day 1: Basics
- [x] Complete this guide
- [ ] Read `README.md`
- [ ] Create first agent
- [ ] Test chat interface

### Day 2: Advanced
- [ ] Upload knowledge base
- [ ] Configure voice settings
- [ ] Test analytics
- [ ] Review `backend/README.md`

### Day 3: Deploy
- [ ] Read `DEPLOYMENT_GUIDE.md`
- [ ] Set up production database
- [ ] Configure SSL
- [ ] Deploy to cloud

### Week 1: Production
- [ ] Review `SECURITY_REVIEW.md`
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Load testing

---

## 📞 Getting Help

### Documentation
- `README.md` - Main docs
- `backend/README.md` - API docs
- `DEPLOYMENT_GUIDE.md` - Deployment
- `SECURITY_REVIEW.md` - Security

### Community
- GitHub Issues
- Discord (if available)
- Stack Overflow (tag: ai-voice-agent)

### Direct Support
- Email: support@yoursite.com
- Docs: https://docs.yoursite.com

---

## ✅ Success Checklist

Before moving to production:

**Backend**
- [ ] Server starts without errors
- [ ] Health check responds 200
- [ ] Can register new user
- [ ] Can login/logout
- [ ] Can create agent
- [ ] Can upload files
- [ ] AI chat responds
- [ ] Analytics display

**Frontend**
- [ ] Page loads
- [ ] Admin UI accessible
- [ ] Agent creation works
- [ ] Widget displays
- [ ] Chat interface works
- [ ] Voice input works

**Security**
- [ ] Changed default password
- [ ] Set strong secrets
- [ ] API keys in .env only
- [ ] HTTPS enabled (production)
- [ ] CORS configured
- [ ] Rate limits tested

**Database**
- [ ] All tables created
- [ ] Indexes present
- [ ] Backups configured
- [ ] Monitoring enabled

---

## 🎉 You're Ready!

If all checks passed, congratulations! Your AI Voice Agent system is ready to use.

**What to do next:**
1. Create your first production agent
2. Upload your knowledge base
3. Deploy to your website
4. Monitor and iterate

**Need help?** Check the documentation files or reach out to support.

---

**Happy building!** 🚀

*Last updated: 2025-10-06*
