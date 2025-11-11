# AI Voice Agent System

A comprehensive, secure admin dashboard for managing dynamic AI voice agents with knowledge base integration, powered by Claude AI and ElevenLabs Text-to-Speech.

## 🚀 Features

- **Dynamic Agent Creation**: Create multiple AI voice agents with custom personalities and knowledge bases
- **Knowledge Base Management**: Process documents (PDF, DOCX, TXT, CSV, JSON) and integrate with Google Drive, Dropbox, and Notion
- **Voice Synthesis**: High-quality text-to-speech using ElevenLabs API
- **Multi-language Support**: 12+ languages supported
- **Security**: Authentication, rate limiting, CSRF protection, and input sanitization
- **Performance Optimized**: Caching, lazy loading, virtual scrolling, and request batching
- **Analytics Dashboard**: Track agent performance and user interactions
- **Deployment System**: Deploy agents to specific URLs with auto-injection

## 📋 Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Architecture](#architecture)
- [Security](#security)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)

## 🔧 Installation

### Prerequisites

- Node.js 16+ (for backend)
- Modern browser (Chrome, Firefox, Safari, Edge)
- API Keys:
  - [Anthropic API Key](https://console.anthropic.com/)
  - [ElevenLabs API Key](https://elevenlabs.io/)
  - [OpenAI API Key](https://platform.openai.com/) (for embeddings)

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-voice-agent.git
cd ai-voice-agent

# No build step needed for frontend - it's vanilla JavaScript
# Just serve the files with any static server
```

### Backend Setup (Required for Production)

**⚠️ CRITICAL**: The system REQUIRES a backend for production use. The current client-side code is for development/demo only.

```bash
# Install dependencies
npm install express express-session express-validator bcrypt cors helmet dotenv

# Create .env file
cp .env.example .env

# Edit .env with your API keys
ANTHROPIC_API_KEY=your_key_here
ELEVENLABS_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
SESSION_SECRET=your_random_secret_here
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```env
# API Keys (NEVER commit these)
ANTHROPIC_API_KEY=sk-ant-xxxxx
ELEVENLABS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx

# Session
SESSION_SECRET=random-secret-string-here

# Database (if using)
DATABASE_URL=postgresql://user:pass@localhost/aivoice

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=100

# Environment
NODE_ENV=production
PORT=3000
```

### Client Configuration

```javascript
window.AI_CONFIG = {
  // DO NOT put real API keys here - use backend proxy
  apiEndpoint: 'https://your-backend.com/api',

  // Optional: Custom storage provider
  storageProvider: 'localStorage', // or 'firebase', 'supabase'

  // Optional: Enable debug mode
  debug: false
};
```

## 📖 Usage

### Creating an Agent

```javascript
// Initialize admin dashboard
const dashboard = new AIVoiceAdminDashboard(window.AI_CONFIG);

// Create a knowledge base
const kb = await dashboard.createKnowledgeBase({
  name: 'Product Documentation',
  description: 'All product docs and FAQs',
  folders: ['./docs'],
  googleDriveFolder: 'folder-id-here'
});

// Create an agent
const agent = await dashboard.createAgent({
  name: 'Product Support Agent',
  description: 'Helps customers with product questions',
  knowledgeBaseId: kb.id,
  targetUrls: [
    'https://yourapp.com/support',
    'https://yourapp.com/docs'
  ],
  voiceId: 'EXAVITQu4vr4xnSDxMaL', // ElevenLabs voice
  personality: 'friendly',
  language: 'en',
  enableQuiz: false,
  enableSummaries: true
});

console.log('Agent created:', agent.id);
```

### Programmatic API Usage

```javascript
// Using the Safe API Caller
const apiCaller = new SafeAPICaller(errorHandler);

// Create agent via API
const agent = await apiCaller.post('/api/agents', {
  name: 'Sales Agent',
  description: 'Helps with sales inquiries',
  // ... other config
});

// Get agent info
const agentInfo = await apiCaller.get(`/api/agents/${agent.id}`);

// Update agent
await apiCaller.put(`/api/agents/${agent.id}`, {
  status: 'inactive'
});

// Delete agent
await apiCaller.delete(`/api/agents/${agent.id}`);
```

### UI Integration

```html
<!DOCTYPE html>
<html>
<head>
  <title>Admin Dashboard</title>
</head>
<body>
  <div id="admin-content"></div>

  <!-- Load dependencies -->
  <script src="storage-adapter.js"></script>
  <script src="auth-system.js"></script>
  <script src="rate-limiter.js"></script>
  <script src="error-handler.js"></script>
  <script src="performance-optimizer.js"></script>
  <script src="admin-dashboard-core.js"></script>
  <script src="admin-dashboard-complete.js"></script>

  <script>
    // Initialize
    window.AI_CONFIG = {
      apiEndpoint: 'https://your-backend.com/api'
    };

    const dashboard = new AIVoiceAdminDashboardComplete(window.AI_CONFIG);

    // Show create agent form
    document.getElementById('admin-content').innerHTML =
      dashboard.getCreateAgentForm();
  </script>
</body>
</html>
```

## 🏗️ Architecture

### System Overview

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────────────────────────┐
│       Backend Server             │
│  ┌────────────────────────────┐ │
│  │  Authentication Layer      │ │
│  │  - JWT tokens              │ │
│  │  - Session management      │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  API Proxy Layer           │ │
│  │  - Rate limiting           │ │
│  │  - Input validation        │ │
│  │  - Request batching        │ │
│  └────────────────────────────┘ │
│  ┌────────────────────────────┐ │
│  │  Business Logic            │ │
│  │  - Agent management        │ │
│  │  - Knowledge processing    │ │
│  └────────────────────────────┘ │
└──────┬──────────────────────────┘
       │
       ├─────────────┬──────────────┬──────────────┐
       │             │              │              │
┌──────▼──────┐ ┌───▼────┐  ┌──────▼───────┐ ┌───▼────────┐
│  Anthropic  │ │ElevenLabs│ │   OpenAI     │ │  Database  │
│  (Claude)   │ │  (TTS)   │ │ (Embeddings) │ │            │
└─────────────┘ └──────────┘ └──────────────┘ └────────────┘
```

### File Structure

```
ai-voice-agent/
├── admin-dashboard-core.js        # Core admin functionality
├── admin-dashboard-complete.js    # Complete implementation
├── runtime-engine.js              # Client-side runtime
├── storage-adapter.js             # Storage abstraction
├── auth-system.js                 # Authentication & authorization
├── rate-limiter.js                # Security features
├── error-handler.js               # Error handling
├── performance-optimizer.js       # Performance utilities
├── tests/
│   └── test-suite.js             # Comprehensive tests
├── backend/
│   ├── server.js                 # Express server (to be created)
│   ├── routes/                   # API routes
│   ├── middleware/               # Custom middleware
│   └── db/                       # Database migrations
├── docs/
│   ├── API.md                    # API documentation
│   └── DEPLOYMENT.md             # Deployment guide
├── SECURITY_REVIEW.md            # Security audit
├── README.md                     # This file
├── .env.example                  # Environment template
└── package.json                  # Dependencies
```

### Data Flow

1. **User Request**: User interacts with agent widget
2. **Voice Input** (optional): Speech-to-text via Web Speech API
3. **Context Retrieval**: Search knowledge base for relevant chunks
4. **AI Processing**: Send to Claude via backend proxy
5. **Response Generation**: Claude generates contextual response
6. **Voice Synthesis**: Convert to speech via ElevenLabs
7. **Playback**: Stream audio to user

## 🔒 Security

### Critical Security Measures

✅ **Implemented**:
- Authentication and session management
- Rate limiting
- Input sanitization
- CSRF protection
- XSS prevention
- Error handling

❌ **MUST Implement Before Production**:
- Move API keys to backend (CRITICAL)
- Implement proper password hashing with bcrypt
- Use httpOnly secure cookies
- Add server-side validation
- Implement audit logging
- Set up monitoring and alerts

### Security Checklist

- [ ] All API keys moved to backend environment variables
- [ ] HTTPS enabled with valid certificate
- [ ] Content Security Policy headers configured
- [ ] Rate limiting active on all endpoints
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection (input sanitization)
- [ ] CSRF tokens validated on state-changing requests
- [ ] Authentication required on admin endpoints
- [ ] Session timeouts configured
- [ ] Audit logging implemented
- [ ] Security headers configured
- [ ] File upload validation
- [ ] Dependencies scanned for vulnerabilities

## 📡 API Reference

### Authentication

```javascript
POST /api/auth/register
Body: { email, password, name }
Returns: { user }

POST /api/auth/login
Body: { email, password }
Returns: { token, user }

POST /api/auth/logout
Headers: { Authorization: Bearer token }
Returns: { success: true }
```

### Agents

```javascript
GET /api/agents
Returns: [ { agent } ]

POST /api/agents
Body: { name, description, knowledgeBaseId, ... }
Returns: { agent }

GET /api/agents/:id
Returns: { agent }

PUT /api/agents/:id
Body: { updates }
Returns: { agent }

DELETE /api/agents/:id
Returns: { success: true }
```

### Knowledge Bases

```javascript
GET /api/knowledge-bases
Returns: [ { kb } ]

POST /api/knowledge-bases
Body: { name, description, files }
Returns: { kb }

GET /api/knowledge-bases/:id
Returns: { kb }

DELETE /api/knowledge-bases/:id
Returns: { success: true }
```

### AI Chat

```javascript
POST /api/agents/:id/chat
Body: { message, conversationId }
Returns: { response, audioUrl }
```

## 🚀 Deployment

### Backend Deployment (Required)

#### Option 1: Node.js Server

```bash
# Install production dependencies
npm install --production

# Start server
NODE_ENV=production node backend/server.js
```

#### Option 2: Docker

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "backend/server.js"]
```

```bash
docker build -t ai-voice-agent .
docker run -p 3000:3000 --env-file .env ai-voice-agent
```

#### Option 3: Serverless (Vercel/Netlify)

```javascript
// api/agents/[id].js (Vercel serverless function)
module.exports = async (req, res) => {
  // Handle request
};
```

### Frontend Deployment

```bash
# Build and deploy static files
# No build step needed - just upload files

# Recommended: Use CDN for static assets
# - CloudFlare
# - AWS CloudFront
# - Vercel
# - Netlify
```

### Environment Setup

```bash
# Production
export NODE_ENV=production
export PORT=3000

# SSL/TLS (recommended: Let's Encrypt)
certbot --nginx -d yourdomain.com

# Firewall
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Process manager (PM2)
npm install -g pm2
pm2 start backend/server.js --name ai-voice-agent
pm2 startup
pm2 save
```

### Monitoring

```bash
# Application monitoring
pm2 monit

# Logs
pm2 logs ai-voice-agent

# Error tracking (integrate Sentry)
npm install @sentry/node
```

## 🧪 Testing

### Run Tests

```bash
# In browser console
window.runTests()

# Or in Node.js
node tests/test-suite.js
```

### Test Coverage

- ✅ Storage operations
- ✅ Authentication flows
- ✅ Rate limiting
- ✅ Input validation
- ✅ Error handling
- ✅ Cache management
- ✅ Performance helpers
- ✅ Agent creation

### Manual Testing

```bash
# Test API endpoints
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Test rate limiting
for i in {1..110}; do
  curl http://localhost:3000/api/agents
done
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Run security checks before committing
- Never commit API keys or secrets

## 📝 License

MIT License - see LICENSE file for details

## 🆘 Support

- [Documentation](https://docs.yoursite.com)
- [Issue Tracker](https://github.com/yourusername/ai-voice-agent/issues)
- [Discord Community](https://discord.gg/yourserver)
- Email: support@yoursite.com

## 🙏 Acknowledgments

- [Anthropic](https://www.anthropic.com/) - Claude AI
- [ElevenLabs](https://elevenlabs.io/) - Text-to-Speech
- [OpenAI](https://openai.com/) - Embeddings API

## ⚠️ Important Notes

1. **Production Readiness**: This system requires a secure backend before production use
2. **API Keys**: Never expose API keys in client-side code
3. **Security**: Review SECURITY_REVIEW.md before deployment
4. **Compliance**: Ensure GDPR/CCPA compliance for user data
5. **Voice Laws**: Check regional laws regarding voice recording

## 🗺️ Roadmap

- [ ] Backend API server implementation
- [ ] Database integration (PostgreSQL)
- [ ] Vector database for embeddings (Pinecone/Weaviate)
- [ ] Multi-tenant support
- [ ] Advanced analytics dashboard
- [ ] A/B testing for agent personalities
- [ ] Integration marketplace
- [ ] Mobile app
- [ ] Voice cloning support
- [ ] Real-time streaming responses

---

**Built with ❤️ for creating intelligent, conversational AI experiences**
