#!/usr/bin/env node
import crypto from 'node:crypto';
import readline from 'node:readline';

/**
 * Generate a PBKDF2 password hash for dashboard authentication.
 * 
 * Usage:
 *   # Secure stdin mode (recommended for production)
 *   node scripts/hash-dashboard-password.mjs --stdin
 *   
 *   # CLI argument mode (convenience for dev, logged in shell history)
 *   node scripts/hash-dashboard-password.mjs 'your-password'
 *   node scripts/hash-dashboard-password.mjs 'your-password' 'custom-salt'
 * 
 * For single admin bootstrap, always use 'admin-salt' (the default).
 * For multi-user JSON config, use '${username}-salt' (e.g., 'john-salt').
 */

function hashDashboardPassword(password, salt = 'admin-salt') {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('base64');
}

function showUsage() {
  console.error('Usage: node scripts/hash-dashboard-password.mjs [--stdin] [<password>] [<salt>]');
  console.error('');
  console.error('Modes:');
  console.error('  --stdin                    Read password interactively (recommended for production)');
  console.error('  <password> [<salt>]        Pass password as argument (WARNING: logged in shell history)');
  console.error('');
  console.error('Examples:');
  console.error('  # Secure mode (password not logged)');
  console.error('  node scripts/hash-dashboard-password.mjs --stdin');
  console.error('');
  console.error('  # Single admin (production) - shell history warning');
  console.error('  node scripts/hash-dashboard-password.mjs "my-secure-password"');
  console.error('');
  console.error('  # Multi-user config (use username-specific salt)');
  console.error('  node scripts/hash-dashboard-password.mjs "john-password" "john-salt"');
  process.exit(1);
}

function displayHash(hash, salt) {
  console.log('');
  console.log('Generated hash:');
  console.log(hash);
  console.log('');
  console.log('Environment variable:');
  if (salt === 'admin-salt') {
    console.log(`DASHBOARD_ADMIN_PASSWORD_HASH="${hash}"`);
  } else {
    console.log(`# For user with salt "${salt}"`);
    console.log(`passwordHash: "${hash}"`);
  }
  console.log('');
}

async function readPasswordFromStdin(salt) {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    // Hide password input
    rl.stdoutMuted = true;
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted && stringToWrite !== '\n' && stringToWrite !== '\r\n') {
        rl.output.write('*');
      } else {
        rl.output.write(stringToWrite);
      }
    };

    const saltPrompt = salt !== 'admin-salt' ? ` (with salt: ${salt})` : '';
    rl.question(`Enter password${saltPrompt}: `, (password) => {
      rl.close();
      console.log(''); // newline after hidden input
      if (!password) {
        reject(new Error('Password cannot be empty'));
      } else {
        resolve(password);
      }
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showUsage();
  }

  let password;
  let salt = 'admin-salt';

  // Check for --stdin mode
  if (args[0] === '--stdin') {
    // Optional second arg is salt
    if (args[1]) {
      salt = args[1];
    }
    
    try {
      password = await readPasswordFromStdin(salt);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  } else {
    // CLI argument mode - show security warning
    console.error('');
    console.error('⚠️  WARNING: Passing passwords via command-line arguments exposes them in shell history.');
    console.error('   For production use, consider using --stdin mode or generate the hash on a secure machine.');
    console.error('');
    
    password = args[0];
    salt = args[1] || 'admin-salt';
    
    if (!password) {
      showUsage();
    }
  }

  const hash = hashDashboardPassword(password, salt);
  displayHash(hash, salt);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
