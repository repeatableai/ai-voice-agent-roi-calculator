#!/usr/bin/env node

/**
 * Run Migration 004: Assign Super Admin to Repeatable.AI Company
 * 
 * Usage: node run-migration-004.js
 */

const fs = require('fs');
const path = require('path');
const { query, end } = require('./db/database');
const { logInfo, logError } = require('./utils/logger');

async function runMigration() {
  try {
    logInfo('Starting migration 004: Assign Super Admin to Repeatable.AI Company');

    // Read the migration file
    const migrationPath = path.join(__dirname, 'db', 'migrations', '004_assign_super_admin_to_repeatable_ai.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Execute the migration
    logInfo('Executing migration SQL...');
    const result = await query(migrationSQL);

    logInfo('Migration completed successfully!');
    logInfo('Results:', result);

    // Verify the migration
    const verifyResult = await query(`
      SELECT 
        'Migration complete' as status,
        (SELECT id FROM companies WHERE name = 'Repeatable.AI') as repeatable_ai_company_id,
        (SELECT COUNT(*) FROM users WHERE role = 'super_admin' AND company_id = (SELECT id FROM companies WHERE name = 'Repeatable.AI')) as super_admins_assigned,
        (SELECT COUNT(*) FROM users WHERE role = 'super_admin') as total_super_admins
    `);

    console.log('\n=== Migration Verification ===');
    console.log(JSON.stringify(verifyResult.rows[0], null, 2));
    console.log('\n✅ Migration 004 completed successfully!');

  } catch (error) {
    logError('Migration failed:', error);
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await end();
  }
}

// Run the migration
runMigration();

