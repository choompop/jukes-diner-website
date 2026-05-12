/**
 * @deprecated This file contains plaintext passwords and is DEPRECATED.
 * 
 * DO NOT USE THIS FILE.
 * DO NOT IMPORT FROM THIS FILE.
 * 
 * Use lib/dashboard-auth.mjs instead:
 *   - hashDashboardPassword()
 *   - authenticateDashboardUser()
 *   - Environment-driven configuration
 *   - No plaintext passwords in code
 * 
 * See docs/DASHBOARD_AUTH_MIGRATION.md for migration instructions.
 * 
 * This file is kept temporarily for reference only and will be removed
 * in a future cleanup.
 */

const USERS = {
  john: 'juke2026',
  daniel: 'juke2026',
  justin: 'juke2026',
  tyler: 'juke2026',
};

export function authenticate(username, password) {
  console.warn('lib/auth.js is DEPRECATED. Use lib/dashboard-auth.mjs instead.');
  const lower = (username || '').toLowerCase().trim();
  if (USERS[lower] && USERS[lower] === password) {
    return lower;
  }
  return null;
}
