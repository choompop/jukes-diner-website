#!/usr/bin/env node
/**
 * Production Environment Validation for Juke's Dashboard
 * 
 * Run this before deploying to production to ensure all required
 * environment variables are properly configured.
 * 
 * Usage:
 *   NODE_ENV=production node scripts/validate-production-env.mjs
 */

const errors = [];
const warnings = [];

function checkRequired(key, message) {
  if (!process.env[key]) {
    errors.push(`❌ ${key} is required. ${message}`);
    return false;
  }
  return true;
}

function checkRecommended(key, message) {
  if (!process.env[key]) {
    warnings.push(`⚠️  ${key} is recommended. ${message}`);
    return false;
  }
  return true;
}

function checkProhibited(key, message) {
  if (process.env[key]) {
    errors.push(`❌ ${key} must NOT be set in production. ${message}`);
    return false;
  }
  return true;
}

console.log('\n🔒 Dashboard Production Environment Validation\n');

// Check NODE_ENV
if (process.env.NODE_ENV !== 'production') {
  console.log('ℹ️  NODE_ENV is not "production" - running validation in check mode\n');
}

// Auth secrets
checkRequired(
  'DASHBOARD_AUTH_SECRET',
  'Generate with: openssl rand -base64 32'
);

// User credentials - must have one of these setups
const hasAdminUsers = !!process.env.DASHBOARD_ADMIN_USERS;
const hasPasswordHash = !!process.env.DASHBOARD_ADMIN_PASSWORD_HASH;
const hasPlaintextPassword = !!process.env.DASHBOARD_ADMIN_PASSWORD;

if (!hasAdminUsers && !hasPasswordHash) {
  errors.push(
    '❌ Either DASHBOARD_ADMIN_USERS or DASHBOARD_ADMIN_PASSWORD_HASH is required.\n' +
    '   Generate a hash: node scripts/hash-dashboard-password.mjs "your-password"'
  );
}

if (process.env.NODE_ENV === 'production') {
  checkProhibited(
    'DASHBOARD_ADMIN_PASSWORD',
    'Use DASHBOARD_ADMIN_PASSWORD_HASH instead. Generate with: node scripts/hash-dashboard-password.mjs "your-password"'
  );
}

// Username requirement
if (hasPasswordHash || hasPlaintextPassword) {
  checkRequired(
    'DASHBOARD_ADMIN_USERNAME',
    'Required when using single-admin mode'
  );
}

// Validate DASHBOARD_ADMIN_USERS format if present
if (hasAdminUsers) {
  try {
    const users = JSON.parse(process.env.DASHBOARD_ADMIN_USERS);
    if (!Array.isArray(users) || users.length === 0) {
      errors.push('❌ DASHBOARD_ADMIN_USERS must be a non-empty JSON array');
    } else {
      users.forEach((user, idx) => {
        if (!user.username) {
          errors.push(`❌ DASHBOARD_ADMIN_USERS[${idx}] missing "username" field`);
        }
        if (!user.passwordHash) {
          errors.push(`❌ DASHBOARD_ADMIN_USERS[${idx}] missing "passwordHash" field`);
        }
      });
    }
  } catch (err) {
    errors.push(`❌ DASHBOARD_ADMIN_USERS is not valid JSON: ${err.message}`);
  }
}

// Cookie security
if (process.env.NODE_ENV === 'production') {
  if (process.env.DISABLE_SECURE_COOKIES === 'true') {
    warnings.push('⚠️  DISABLE_SECURE_COOKIES is set - cookies will not be HTTPS-only!');
  }
}

// Optional but recommended
checkRecommended(
  'DASHBOARD_INTERNAL_API_KEY',
  'Needed for server-to-server API calls. Generate with: openssl rand -hex 32'
);

// Report results
console.log('─'.repeat(60));

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ All production environment checks passed!\n');
  console.log('Your dashboard is ready to deploy.\n');
  process.exit(0);
}

if (errors.length > 0) {
  console.log('\n🚨 CRITICAL ERRORS - Cannot deploy:\n');
  errors.forEach(err => console.log(err));
}

if (warnings.length > 0) {
  console.log('\n⚠️  WARNINGS - Review before deploying:\n');
  warnings.forEach(warn => console.log(warn));
}

console.log('\n' + '─'.repeat(60) + '\n');

if (errors.length > 0) {
  console.log('Fix the errors above before deploying to production.\n');
  process.exit(1);
} else {
  console.log('Review warnings above. Deploy when ready.\n');
  process.exit(0);
}
