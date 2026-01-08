-- Migration: Add Company-Based RBAC System
-- Adds companies table, updates users table, and creates ROI analyses storage
-- Date: 2024

-- ===================================
-- Companies Table
-- ===================================

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255), -- Optional: for email domain matching (e.g., 'example.com')
  industry VARCHAR(100),
  size VARCHAR(50), -- '1-10', '11-50', '51-200', etc.
  website VARCHAR(255),
  subscription_tier VARCHAR(50) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'suspended', 'cancelled')),
  max_users INTEGER DEFAULT 10, -- Max employees allowed
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER REFERENCES users(id) -- Super admin who created it
);

CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_status ON companies(subscription_status);
CREATE INDEX idx_companies_created_by ON companies(created_by);

-- ===================================
-- Update Users Table
-- ===================================

-- Add company relationship and additional fields
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS department VARCHAR(255),
  ADD COLUMN IF NOT EXISTS job_title VARCHAR(255),
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS invited_by INTEGER REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP;

-- Update role constraint to include 'super_admin'
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users 
  ADD CONSTRAINT users_role_check CHECK (role IN ('user', 'admin', 'super_admin'));

-- Add constraint: super_admin cannot have company_id
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_super_admin_no_company;

ALTER TABLE users 
  ADD CONSTRAINT users_super_admin_no_company CHECK (
    (role = 'super_admin' AND company_id IS NULL) OR 
    (role != 'super_admin')
  );

-- Add constraint: admin must have company_id
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_admin_has_company;

ALTER TABLE users 
  ADD CONSTRAINT users_admin_has_company CHECK (
    (role = 'admin' AND company_id IS NOT NULL) OR 
    (role != 'admin')
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_invited_by ON users(invited_by);

-- ===================================
-- ROI Analyses Table
-- Stores all voice impact analyses with persistent data
-- ===================================

CREATE TABLE IF NOT EXISTS roi_analyses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Analysis metadata
  title VARCHAR(255), -- User can name their analysis (e.g., "Q4 Sales Team Analysis")
  job_title VARCHAR(255) NOT NULL,
  industry VARCHAR(100) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  company_website VARCHAR(255),
  company_size VARCHAR(50),
  company_context JSONB, -- Stored company context from jina.ai or other sources
  
  -- Analysis inputs
  hourly_rate DECIMAL(10, 2) NOT NULL,
  biggest_frustration TEXT,
  
  -- Analysis results (full JSONB for flexibility)
  analysis_data JSONB NOT NULL, -- Stores: deliverables, haradaMatrix, metrics, valueAddedSuggestions, etc.
  
  -- Calculated metrics (for easy querying and aggregation)
  total_annual_hours_freed DECIMAL(10, 2),
  total_payroll_freed DECIMAL(12, 2),
  annual_value_created DECIMAL(12, 2),
  payback_days INTEGER,
  productivity_multiplier DECIMAL(5, 2),
  
  -- Status and metadata
  status VARCHAR(50) DEFAULT 'completed' CHECK (status IN ('draft', 'completed', 'archived')),
  is_shared BOOLEAN DEFAULT FALSE, -- If user shared with company admin
  shared_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_viewed_at TIMESTAMP
);

CREATE INDEX idx_roi_analyses_user_id ON roi_analyses(user_id);
CREATE INDEX idx_roi_analyses_company_id ON roi_analyses(company_id);
CREATE INDEX idx_roi_analyses_created ON roi_analyses(created_at DESC);
CREATE INDEX idx_roi_analyses_status ON roi_analyses(status);
CREATE INDEX idx_roi_analyses_shared ON roi_analyses(is_shared);
CREATE INDEX idx_roi_analyses_job_title ON roi_analyses(job_title);
CREATE INDEX idx_roi_analyses_industry ON roi_analyses(industry);

-- Trigger for updated_at
CREATE TRIGGER update_roi_analyses_updated_at BEFORE UPDATE ON roi_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for companies updated_at
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- Analysis Shares Table
-- For sharing analyses with specific users (optional feature)
-- ===================================

CREATE TABLE IF NOT EXISTS analysis_shares (
  id SERIAL PRIMARY KEY,
  analysis_id INTEGER NOT NULL REFERENCES roi_analyses(id) ON DELETE CASCADE,
  shared_with_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  shared_by_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission VARCHAR(50) DEFAULT 'view' CHECK (permission IN ('view', 'comment')),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(analysis_id, shared_with_user_id)
);

CREATE INDEX idx_analysis_shares_analysis ON analysis_shares(analysis_id);
CREATE INDEX idx_analysis_shares_user ON analysis_shares(shared_with_user_id);
CREATE INDEX idx_analysis_shares_shared_by ON analysis_shares(shared_by_user_id);

-- ===================================
-- Invitations Table
-- For inviting users to companies
-- ===================================

CREATE TABLE IF NOT EXISTS invitations (
  id SERIAL PRIMARY KEY,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  invited_by INTEGER NOT NULL REFERENCES users(id),
  expires_at TIMESTAMP NOT NULL,
  accepted_at TIMESTAMP,
  accepted_by_user_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_company_id ON invitations(company_id);
CREATE INDEX idx_invitations_expires_at ON invitations(expires_at);

