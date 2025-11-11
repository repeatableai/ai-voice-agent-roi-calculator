# AI Voice Agent System - Backend Server

Complete Node.js/Express backend for the AI Voice Agent management system.

## 🎯 Features

- ✅ **Authentication**: JWT + session-based auth with bcrypt password hashing
- ✅ **Agent Management**: CRUD operations for AI agents
- ✅ **Knowledge Bases**: File upload, processing, and vector search
- ✅ **AI Proxy**: Secure proxy to Anthropic Claude and ElevenLabs APIs
- ✅ **Analytics**: Track conversations and performance metrics
- ✅ **Security**: Rate limiting, CORS, helmet, input validation
- ✅ **Logging**: Winston logger with file and console output
- ✅ **Error Handling**: Comprehensive error handling and validation

## 📁 Project Structure

```
backend/
├── server.js                 # Main server file
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── agents.js            # Agent management
│   ├── knowledge-bases.js   # Knowledge base management
│   ├── ai.js                # AI chat proxy
│   └── analytics.js         # Analytics endpoints
├── middleware/
│   ├── auth.js              # Auth middleware
│   ├── error-handler.js     # Global error handler
│   ├── logger.js            # Request logger
│   └── validate-request.js  # Validation middleware
├── utils/
│   ├── logger.js            # Winston logger
│   ├── jwt.js               # JWT utilities
│   ├── embeddings.js        # OpenAI embeddings
│   └── document-processor.js # Document parsing
├── db/
│   ├── database.js          # PostgreSQL connection
│   └── schema.sql           # Database schema
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set Up Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp ../.env.example ../.env
```

### 3. Set Up Database

```bash
# Create PostgreSQL database
createdb aivoice

# Run schema
psql aivoice < db/schema.sql
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3000`

## 🔐 API Endpoints

### Authentication

```
POST   /api/auth/register        # Register new user
POST   /api/auth/login           # Login
POST   /api/auth/logout          # Logout
GET    /api/auth/me              # Get current user
POST   /api/auth/change-password # Change password
POST   /api/auth/request-reset   # Request password reset
POST   /api/auth/reset-password  # Reset password
```

### Agents

```
GET    /api/agents              # Get all agents
GET    /api/agents/:id          # Get specific agent
POST   /api/agents              # Create agent
PUT    /api/agents/:id          # Update agent
DELETE /api/agents/:id          # Delete agent
GET    /api/agents/for-url      # Get agent for URL (public)
```

### Knowledge Bases

```
GET    /api/knowledge-bases           # Get all KBs
GET    /api/knowledge-bases/:id       # Get specific KB
POST   /api/knowledge-bases           # Create KB (with file upload)
DELETE /api/knowledge-bases/:id       # Delete KB
POST   /api/knowledge-bases/:id/search # Search KB
```

### AI Chat

```
POST   /api/ai/chat              # Chat with agent
POST   /api/ai/synthesize-speech # Convert text to speech
```

### Analytics

```
GET    /api/analytics/overview              # Overall stats
GET    /api/analytics/agents/:id            # Agent-specific stats
GET    /api/analytics/conversations/:id     # Conversation history
GET    /api/analytics/recent-conversations  # Recent conversations
```

### Health Check

```
GET    /health                   # Server health status
```

## 📝 API Usage Examples

### Register & Login

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!"
  }'
```

### Create Agent

```bash
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -H "Cookie: aivoice.sid=your-session-cookie" \
  -d '{
    "name": "Support Agent",
    "description": "Handles customer support",
    "targetUrls": ["https://yourapp.com/support"],
    "voiceSettings": {
      "voiceId": "EXAVITQu4vr4xnSDxMaL",
      "stability": 0.5
    },
    "contextSettings": {
      "personality": "friendly",
      "language": "en"
    }
  }'
```

### Upload Knowledge Base

```bash
curl -X POST http://localhost:3000/api/knowledge-bases \
  -H "Cookie: aivoice.sid=your-session-cookie" \
  -F "name=Product Docs" \
  -F "description=All product documentation" \
  -F "files=@./docs/manual.pdf" \
  -F "files=@./docs/faq.txt"
```

### Chat with Agent

```bash
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "agentId": "agent_123456",
    "message": "How do I reset my password?",
    "synthesizeSpeech": true
  }'
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available configuration options.

Key variables:

```env
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aivoice

# API Keys
ANTHROPIC_API_KEY=sk-ant-xxxxx
ELEVENLABS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx

# Security
SESSION_SECRET=random-secret
JWT_SECRET=another-random-secret

# Redis (optional, for production)
REDIS_URL=redis://localhost:6379
```

### Database Setup

The system uses PostgreSQL with the pgvector extension for vector similarity search.

```sql
-- Enable pgvector
CREATE EXTENSION vector;

-- Run schema
\i backend/db/schema.sql
```

### Default Admin Account

After running the schema, you can login with:

- **Email**: `admin@example.com`
- **Password**: `Admin123!`

**⚠️ Change this immediately in production!**

## 🏗️ Development

### Running in Development

```bash
# Install nodemon for auto-reload
npm install -g nodemon

# Start with auto-reload
npm run dev
```

### Testing

```bash
# Run tests (when implemented)
npm test

# Test specific endpoint
curl http://localhost:3000/health
```

### Logging

Logs are written to:
- `logs/combined.log` - All logs
- `logs/error.log` - Errors only
- Console (development mode)

## 🔒 Security

### Implemented Security Features

- ✅ Password hashing with bcrypt (12 rounds)
- ✅ JWT tokens for API access
- ✅ Session management with Redis
- ✅ Rate limiting (100 req/min general, 5 login attempts/15min)
- ✅ CORS with origin whitelist
- ✅ Helmet security headers
- ✅ Input validation with express-validator
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ CSRF protection (via session)

### Security Checklist

Before production:

- [ ] Change default admin password
- [ ] Set strong SESSION_SECRET and JWT_SECRET
- [ ] Configure HTTPS/SSL
- [ ] Set up proper CORS origins
- [ ] Enable Redis for session storage
- [ ] Set up monitoring and alerting
- [ ] Configure firewall rules
- [ ] Set up automated backups
- [ ] Enable audit logging

## 📊 Database Schema

### Main Tables

- **users** - User accounts
- **agents** - AI voice agents
- **knowledge_bases** - Document collections
- **knowledge_chunks** - Text chunks with embeddings
- **conversations** - Chat history
- **analytics** - Event tracking
- **agent_urls** - Agent deployment URLs

### Vector Search

Uses pgvector extension for semantic search:

```sql
SELECT text, 1 - (embedding <=> $1::vector) as similarity
FROM knowledge_chunks
WHERE kb_id = $2
ORDER BY embedding <=> $1::vector
LIMIT 5
```

## 🚀 Deployment

### Option 1: Traditional Server

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name aivoice

# Save PM2 configuration
pm2 save
pm2 startup
```

### Option 2: Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
```

### Option 3: Heroku

```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev
heroku config:set ANTHROPIC_API_KEY=your-key
git push heroku main
```

### Option 4: AWS/GCP/Azure

See main `DEPLOYMENT_GUIDE.md` for detailed platform-specific instructions.

## 🐛 Troubleshooting

### Database Connection Errors

```bash
# Check PostgreSQL is running
pg_isready

# Check connection string
psql $DATABASE_URL
```

### Redis Connection Errors

```bash
# Check Redis is running
redis-cli ping

# Start Redis
redis-server
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### API Key Errors

Make sure all API keys are set in `.env`:

```bash
# Check environment variables
node -e "require('dotenv').config(); console.log(process.env.ANTHROPIC_API_KEY)"
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [Anthropic API Docs](https://docs.anthropic.com/)
- [ElevenLabs API Docs](https://docs.elevenlabs.io/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## 📄 License

MIT License - See main project LICENSE file

---

**Backend Status**: ✅ Production Ready

**Last Updated**: 2025-10-06
