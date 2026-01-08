-- Migration: Assign Super Admin to Repeatable.AI Company
-- Creates Repeatable.AI company and assigns all super_admin users to it
-- Date: 2024

-- First, drop the constraint that prevents super_admin from having a company
ALTER TABLE users 
  DROP CONSTRAINT IF EXISTS users_super_admin_no_company;

-- Create Repeatable.AI company if it doesn't exist
DO $$
DECLARE
  repeatable_ai_company_id INTEGER;
BEGIN
  -- Check if Repeatable.AI company already exists
  SELECT id INTO repeatable_ai_company_id 
  FROM companies 
  WHERE name = 'Repeatable.AI' 
  LIMIT 1;

  -- Create Repeatable.AI company if it doesn't exist
  IF repeatable_ai_company_id IS NULL THEN
    INSERT INTO companies (
      name, 
      domain, 
      industry, 
      subscription_tier, 
      subscription_status, 
      max_users
    )
    VALUES (
      'Repeatable.AI',
      'repeatable.ai',
      'Technology',
      'enterprise',
      'active',
      10000
    )
    RETURNING id INTO repeatable_ai_company_id;
  END IF;

  -- Assign all super_admin users to Repeatable.AI company
  UPDATE users
  SET company_id = repeatable_ai_company_id
  WHERE role = 'super_admin'
    AND (company_id IS NULL OR company_id != repeatable_ai_company_id);

  RAISE NOTICE 'Repeatable.AI company ID: %', repeatable_ai_company_id;
  RAISE NOTICE 'Super admins assigned to Repeatable.AI';

END $$;

-- Verify migration
SELECT 
  'Migration complete' as status,
  (SELECT id FROM companies WHERE name = 'Repeatable.AI') as repeatable_ai_company_id,
  (SELECT COUNT(*) FROM users WHERE role = 'super_admin' AND company_id = (SELECT id FROM companies WHERE name = 'Repeatable.AI')) as super_admins_assigned,
  (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as total_super_admins;

