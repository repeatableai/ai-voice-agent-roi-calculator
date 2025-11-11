// Quick password reset script
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/aivoice'
});

async function resetPassword(email, newPassword) {
  try {
    const hash = await bcrypt.hash(newPassword, 12);
    const result = await pool.query(
      'UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING email',
      [hash, email]
    );

    if (result.rows.length > 0) {
      console.log(`✅ Password updated for ${email}`);
    } else {
      console.log(`❌ User not found: ${email}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: node reset-password.js <email> <password>');
  process.exit(1);
}

resetPassword(email, password);
