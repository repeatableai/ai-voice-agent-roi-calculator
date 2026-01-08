-- Migration: Migrate Existing Users to Default Company
-- Assigns existing users to a default company for backward compatibility
-- Date: 2024

-- Create a default company for existing users
INSERT INTO companies (
  name, domain, industry, subscription_tier, subscription_status, max_users, created_by
)
SELECT 
  'Default Company',
  NULL,
  'General',
  'free',
  'active',
  1000,
  (SELECT id FROM users WHERE role = 'admin' LIMIT 1)
WHERE NOT EXISTS (
  SELECT 1 FROM companies WHERE name = 'Default Company'
)
RETURNING id;

-- Get the default company ID (or use existing if already created)
DO $$
DECLARE
  default_company_id INTEGER;
BEGIN
  -- Get or create default company
  SELECT id INTO default_company_id 
  FROM companies 
  WHERE name = 'Default Company' 
  LIMIT 1;

  IF default_company_id IS NULL THEN
    INSERT INTO companies (
      name, domain, industry, subscription_tier, subscription_status, max_users
    )
    VALUES (
      'Default Company',
      NULL,
      'General',
      'free',
      'active',
      1000
    )
    RETURNING id INTO default_company_id;
  END IF;

  -- Assign all users without a company to the default company
  -- But exclude super_admin users (they shouldn't have a company)
  UPDATE users
  SET company_id = default_company_id
  WHERE company_id IS NULL 
    AND role != 'super_admin'
    AND role != 'admin'; -- Keep existing admins without company for now

  -- For existing admins, assign them to default company and keep admin role
  UPDATE users
  SET company_id = default_company_id
  WHERE company_id IS NULL 
    AND role = 'admin';

  -- Create a super_admin user if none exists
  -- Password: SuperAdmin123! (change this in production!)
  IF NOT EXISTS (SELECT 1 FROM users WHERE role = 'super_admin') THEN
    INSERT INTO users (
      email, password_hash, name, role, company_id
    )
    VALUES (
      'superadmin@aiva.com',
      '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLpJ6jOu', -- SuperAdmin123!
      'Super Admin',
      'super_admin',
      NULL -- Super admin has no company
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;

END $$;

-- Verify migration
SELECT 
  'Migration complete' as status,
  (SELECT COUNT(*) FROM companies) as total_companies,
  (SELECT COUNT(*) FROM users WHERE company_id IS NOT NULL) as users_with_company,
  (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as super_admins,
  (SELECT COUNT(*) FROM users WHERE role = 'admin' AND company_id IS NOT NULL) as admins_with_company;

