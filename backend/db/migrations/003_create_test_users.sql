-- Migration: Create Test Users for Each Role Level
-- Creates test users for user, admin, and super_admin roles
-- Date: 2024

-- Note: These password hashes are for demonstration only
-- In production, use proper bcrypt hashing
-- Password: password123
-- Password: Admin123!
-- Password: SuperAdmin123!

-- Ensure we have a default company first
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

  -- Create User (Employee) - password: password123
  INSERT INTO users (email, password_hash, name, role, company_id)
  VALUES (
    'user@example.com',
    '$2b$12$AZiWnMnWcp2GkxPelzdECeJZ7EHnpf9WSmG/HXH/X3LaoZWYpvbYu',
    'Test User',
    'user',
    default_company_id
  )
  ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      company_id = EXCLUDED.company_id;

  -- Create Admin (Company Head) - password: Admin123!
  INSERT INTO users (email, password_hash, name, role, company_id)
  VALUES (
    'admin@example.com',
    '$2b$12$KNDbTnSg/XfGsNS/TJ4EieNicgFNq35m32NVGW9Y/xtc4o1L32rLq',
    'Test Admin',
    'admin',
    default_company_id
  )
  ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      company_id = EXCLUDED.company_id;

  -- Create Super Admin (Platform Owner) - password: SuperAdmin123!
  -- Super admin has no company_id (NULL)
  INSERT INTO users (email, password_hash, name, role, company_id)
  VALUES (
    'superadmin@aiva.com',
    '$2b$12$VkP8kx.GTR2GMjVDaWuStedCdgvH6KhekQjJ3EFRGyjt8f/uwuSfO',
    'Super Admin',
    'super_admin',
    NULL
  )
  ON CONFLICT (email) DO UPDATE
  SET password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role,
      company_id = NULL;

END $$;

-- Verify test users were created
SELECT 
  'Test users created' as status,
  email,
  name,
  role,
  company_id IS NOT NULL as has_company
FROM users
WHERE email IN ('user@example.com', 'admin@example.com', 'superadmin@aiva.com')
ORDER BY role;

