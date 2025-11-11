-- AI Voice Agent System - Database Schema
-- PostgreSQL 12+

-- Enable pgvector extension for embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- ===================================
-- Users Table
-- ===================================

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ===================================
-- Password Resets Table
-- ===================================

CREATE TABLE IF NOT EXISTS password_resets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_password_resets_token ON password_resets(token);
CREATE INDEX idx_password_resets_user_id ON password_resets(user_id);

-- ===================================
-- Knowledge Bases Table
-- ===================================

CREATE TABLE IF NOT EXISTS knowledge_bases (
  id VARCHAR(100) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  total_chunks INTEGER DEFAULT 0,
  processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_kb_user_id ON knowledge_bases(user_id);
CREATE INDEX idx_kb_status ON knowledge_bases(processing_status);

-- ===================================
-- Knowledge Chunks Table
-- ===================================

CREATE TABLE IF NOT EXISTS knowledge_chunks (
  id SERIAL PRIMARY KEY,
  kb_id VARCHAR(100) NOT NULL REFERENCES knowledge_bases(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  embedding vector(1536), -- OpenAI ada-002 embeddings are 1536 dimensions
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_chunks_kb_id ON knowledge_chunks(kb_id);
-- Create index for vector similarity search
CREATE INDEX idx_chunks_embedding ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops);

-- ===================================
-- Agents Table
-- ===================================

CREATE TABLE IF NOT EXISTS agents (
  id VARCHAR(100) PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  knowledge_base_id VARCHAR(100) REFERENCES knowledge_bases(id) ON DELETE SET NULL,
  voice_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  context_settings JSONB NOT NULL DEFAULT '{}'::jsonb,
  features JSONB NOT NULL DEFAULT '{}'::jsonb,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agents_user_id ON agents(user_id);
CREATE INDEX idx_agents_status ON agents(status);
CREATE INDEX idx_agents_kb_id ON agents(knowledge_base_id);

-- ===================================
-- Agent URLs Table (for deployment)
-- ===================================

CREATE TABLE IF NOT EXISTS agent_urls (
  id SERIAL PRIMARY KEY,
  agent_id VARCHAR(100) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  target_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_agent_urls_agent_id ON agent_urls(agent_id);
CREATE INDEX idx_agent_urls_target_url ON agent_urls(target_url);

-- ===================================
-- Conversations Table
-- ===================================

CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  agent_id VARCHAR(100) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_identifier VARCHAR(255), -- Can be user_id, IP, or session ID
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_conversations_user ON conversations(user_identifier);
CREATE INDEX idx_conversations_updated ON conversations(updated_at DESC);

-- ===================================
-- Analytics Table
-- ===================================

CREATE TABLE IF NOT EXISTS analytics (
  id SERIAL PRIMARY KEY,
  agent_id VARCHAR(100) NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_agent_id ON analytics(agent_id);
CREATE INDEX idx_analytics_event_type ON analytics(event_type);
CREATE INDEX idx_analytics_created ON analytics(created_at DESC);

-- ===================================
-- API Keys Table (for programmatic access)
-- ===================================

CREATE TABLE IF NOT EXISTS api_keys (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  key_hash VARCHAR(255) NOT NULL,
  permissions JSONB DEFAULT '[]'::jsonb,
  last_used TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_hash ON api_keys(key_hash);

-- ===================================
-- Functions
-- ===================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kb_updated_at BEFORE UPDATE ON knowledge_bases
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- Sample Data (for development)
-- ===================================

-- Create admin user (password: Admin123!)
-- Password hash for: Admin123!
INSERT INTO users (email, password_hash, name, role)
VALUES (
  'admin@example.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLpJ6jOu',
  'Admin User',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- ===================================
-- Grants (adjust as needed for your setup)
-- ===================================

-- If you have a specific database user, grant permissions:
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_db_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_db_user;
