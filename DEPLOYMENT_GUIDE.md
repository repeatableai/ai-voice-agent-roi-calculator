# Deployment Guide - AI Voice Agent System

Complete step-by-step guide for deploying the AI Voice Agent system to production.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Backend Setup](#backend-setup)
3. [Database Setup](#database-setup)
4. [Frontend Deployment](#frontend-deployment)
5. [Platform-Specific Guides](#platform-specific-guides)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Monitoring & Logging](#monitoring--logging)
8. [Scaling Considerations](#scaling-considerations)
9. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Security Review

- [ ] All API keys moved to backend environment variables
- [ ] No sensitive data in client-side code
- [ ] HTTPS/SSL certificate obtained
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] CSRF protection active
- [ ] SQL injection prevention
- [ ] XSS protection enabled
- [ ] Authentication tested
- [ ] Session management secure

### Code Quality

- [ ] All tests passing
- [ ] No console.log in production code
- [ ] Error handling comprehensive
- [ ] Performance optimized
- [ ] Code reviewed
- [ ] Dependencies updated
- [ ] Vulnerability scan completed

### Infrastructure

- [ ] Domain name registered
- [ ] DNS configured
- [ ] CDN setup (optional)
- [ ] Backup strategy defined
- [ ] Monitoring tools configured
- [ ] Error tracking setup (Sentry, etc.)

## Backend Setup

### Step 1: Create Backend Server

Create `backend/server.js`:

```javascript
const express = require('express');
const session = require('express-session');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000, // 1 hour
    sameSite: 'strict'
  }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/agents', require('./routes/agents'));
app.use('/api/knowledge-bases', require('./routes/knowledge-bases'));
app.use('/api/ai', require('./routes/ai'));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Create API Routes

Create `backend/routes/ai.js`:

```javascript
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

// Middleware to check authentication
const authenticate = require('../middleware/auth');

// Proxy to Anthropic API
router.post('/chat', authenticate, async (req, res) => {
  try {
    const { messages, agentId } = req.body;

    // Get agent config from database
    const agent = await getAgentConfig(agentId);

    // Build context from knowledge base
    const context = await getRelevantContext(agent.knowledgeBaseId, messages);

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: agent.contextSettings.maxTokens,
        temperature: agent.contextSettings.temperature,
        messages: [
          {
            role: 'user',
            content: `${agent.contextSettings.systemPrompt}\n\nContext: ${context}\n\nUser: ${messages[messages.length - 1].content}`
          }
        ]
      })
    });

    const data = await response.json();

    // Synthesize speech with ElevenLabs
    const audioBlob = await synthesizeSpeech(
      data.content[0].text,
      agent.voiceSettings
    );

    res.json({
      text: data.content[0].text,
      audio: audioBlob
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// ElevenLabs TTS
async function synthesizeSpeech(text, voiceSettings) {
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voiceSettings.voiceId}`,
    {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': process.env.ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: voiceSettings.stability,
          similarity_boost: voiceSettings.similarityBoost
        }
      })
    }
  );

  return await response.buffer();
}

module.exports = router;
```

### Step 3: Environment Configuration

Create `.env`:

```env
# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://yourdomain.com

# API Keys - NEVER COMMIT
ANTHROPIC_API_KEY=sk-ant-xxxxx
ELEVENLABS_API_KEY=xxxxx
OPENAI_API_KEY=sk-xxxxx

# Session
SESSION_SECRET=generate-random-string-here

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aivoice

# Redis (for session store)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Step 4: Install Dependencies

```bash
npm install express express-session express-validator \
  bcrypt cors helmet dotenv pg redis \
  @anthropic-ai/sdk node-fetch multer
```

## Database Setup

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Agents table
CREATE TABLE agents (
  id VARCHAR(100) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  voice_settings JSONB,
  context_settings JSONB,
  features JSONB,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge bases table
CREATE TABLE knowledge_bases (
  id VARCHAR(100) PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_chunks INTEGER DEFAULT 0,
  processing_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Knowledge chunks table
CREATE TABLE knowledge_chunks (
  id SERIAL PRIMARY KEY,
  kb_id VARCHAR(100) REFERENCES knowledge_bases(id),
  text TEXT NOT NULL,
  embedding vector(1536), -- For pgvector
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Conversations table
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  agent_id VARCHAR(100) REFERENCES agents(id),
  user_identifier VARCHAR(255),
  messages JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Analytics table
CREATE TABLE analytics (
  id SERIAL PRIMARY KEY,
  agent_id VARCHAR(100) REFERENCES agents(id),
  event_type VARCHAR(100),
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_kb_user_id ON knowledge_bases(user_id);
CREATE INDEX idx_chunks_kb_id ON knowledge_chunks(kb_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_analytics_agent_id ON analytics(agent_id);

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;
```

### Database Migrations

```bash
# Install migration tool
npm install -g db-migrate db-migrate-pg

# Create migration
db-migrate create initial-schema --sql-file

# Run migrations
db-migrate up
```

## Frontend Deployment

### Option 1: Static Hosting (Netlify/Vercel)

```bash
# Create netlify.toml
cat > netlify.toml << EOF
[build]
  publish = "."

[[redirects]]
  from = "/api/*"
  to = "https://your-backend.com/api/:splat"
  status = 200
EOF

# Deploy
netlify deploy --prod
```

### Option 2: CDN (CloudFlare)

```bash
# Upload files to CloudFlare Pages
# Configure custom domain
# Set environment variables in dashboard
```

### Option 3: Self-Hosted (Nginx)

```nginx
# /etc/nginx/sites-available/aivoice
server {
    listen 80;
    server_name yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend files
    location / {
        root /var/www/aivoice/frontend;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/aivoice /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Platform-Specific Guides

### Deploy to Heroku

```bash
# Create Procfile
echo "web: node backend/server.js" > Procfile

# Create heroku app
heroku create your-app-name

# Set environment variables
heroku config:set ANTHROPIC_API_KEY=your_key
heroku config:set ELEVENLABS_API_KEY=your_key
heroku config:set SESSION_SECRET=your_secret

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to AWS

```bash
# Install AWS CLI
aws configure

# Create Elastic Beanstalk environment
eb init -p node.js-16 aivoice
eb create aivoice-prod

# Set environment variables
eb setenv ANTHROPIC_API_KEY=your_key ELEVENLABS_API_KEY=your_key

# Deploy
eb deploy

# Configure RDS (PostgreSQL)
# Configure ElastiCache (Redis)
# Configure CloudFront (CDN)
```

### Deploy to Google Cloud Platform

```bash
# Install gcloud CLI
gcloud init

# Create App Engine app
gcloud app create

# Create app.yaml
cat > app.yaml << EOF
runtime: nodejs16
env: standard

env_variables:
  NODE_ENV: production

automatic_scaling:
  min_instances: 1
  max_instances: 10
EOF

# Deploy
gcloud app deploy

# Set secrets
gcloud secrets create anthropic-key --data-file=<(echo -n "your-key")
```

### Deploy to DigitalOcean

```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet
ssh root@your-droplet-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Install Nginx
sudo apt-get install -y nginx

# Clone repo
git clone https://github.com/yourusername/ai-voice-agent.git
cd ai-voice-agent

# Install dependencies
npm install --production

# Setup PM2
npm install -g pm2
pm2 start backend/server.js --name aivoice
pm2 startup
pm2 save

# Configure Nginx (see above)
```

## SSL/TLS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo tee -a /etc/crontab > /dev/null
```

### CloudFlare SSL

```bash
# Enable Full (strict) SSL in CloudFlare dashboard
# Generate Origin Certificate
# Install certificate on server
```

## Monitoring & Logging

### PM2 Monitoring

```bash
# Install PM2
npm install -g pm2

# Start with monitoring
pm2 start backend/server.js --name aivoice

# Monitor
pm2 monit

# Logs
pm2 logs aivoice

# Restart on crashes
pm2 startup
pm2 save
```

### Sentry Integration

```javascript
// backend/server.js
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

### Logging

```javascript
// Use Winston for structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

## Scaling Considerations

### Horizontal Scaling

```bash
# Use load balancer (Nginx, HAProxy, AWS ALB)
# Example Nginx load balancer config

upstream backend {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

### Caching Strategy

```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

async function getCachedResponse(key) {
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  return null;
}

async function cacheResponse(key, data, ttl = 3600) {
  await client.setex(key, ttl, JSON.stringify(data));
}
```

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_conversations_created ON conversations(created_at DESC);

-- Use connection pooling
-- Use read replicas for analytics
```

## Troubleshooting

### Common Issues

**1. CORS Errors**
```javascript
// Ensure CORS is properly configured
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

**2. Session Not Persisting**
```javascript
// Use Redis session store
const RedisStore = require('connect-redis')(session);

app.use(session({
  store: new RedisStore({ client: redisClient }),
  // ... other options
}));
```

**3. High Memory Usage**
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 backend/server.js

# Or in PM2
pm2 start backend/server.js --node-args="--max-old-space-size=4096"
```

**4. Database Connection Issues**
```javascript
// Use connection pooling
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});
```

### Health Check Endpoint

```javascript
app.get('/health', async (req, res) => {
  const checks = {
    database: false,
    redis: false,
    apis: false
  };

  try {
    await pool.query('SELECT 1');
    checks.database = true;
  } catch (e) {}

  try {
    await redisClient.ping();
    checks.redis = true;
  } catch (e) {}

  const allHealthy = Object.values(checks).every(v => v);

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    checks
  });
});
```

## Final Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] SSL certificate installed
- [ ] DNS configured correctly
- [ ] Backups scheduled
- [ ] Monitoring active
- [ ] Error tracking configured
- [ ] Rate limiting tested
- [ ] Security headers verified
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment process

## Support

For deployment issues:
- Check logs: `pm2 logs aivoice`
- Review error tracking dashboard
- Contact: devops@yoursite.com

---

**Ready for production! 🚀**
