# Dashboard Authentication Migration Guide

## Overview

The dashboard has been migrated from plaintext shared passwords to production-ready hashed authentication using environment variables.

## What Changed

### Before (Insecure)
- Hardcoded plaintext passwords in `lib/auth.js` (`juke2026`)
- Shared credentials across all users
- Passwords committed to source control

### After (Secure)
- No plaintext passwords in code
- Environment-driven authentication
- PBKDF2 password hashing with 100,000 iterations
- Separate development and production modes
- Support for multiple admin users

## Configuration Options

### Option 1: Single Admin (Recommended for Deployment)

Set these environment variables:

```bash
# Production deployment
NODE_ENV=production
DASHBOARD_ADMIN_USERNAME=owner
DASHBOARD_ADMIN_PASSWORD_HASH=<base64-encoded-hash>
```

To generate the password hash, use Node.js:

```javascript
import crypto from 'node:crypto';

function hashDashboardPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('base64');
}

// Always use 'admin-salt' for single admin bootstrap
const hash = hashDashboardPassword('your-secure-password', 'admin-salt');
console.log(hash);
```

Or use the helper script:

```bash
node scripts/hash-dashboard-password.mjs 'your-secure-password'
```

### Option 2: Multiple Admin Users

For environments with multiple administrators:

```bash
NODE_ENV=production
DASHBOARD_ADMIN_USERS='[{"username":"john","passwordHash":"<hash>","role":"admin"},{"username":"tyler","passwordHash":"<hash>","role":"admin"}]'
```

To generate hashes for multiple users:

```javascript
import crypto from 'node:crypto';

function hashDashboardPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('base64');
}

// Use username-specific salt: `${username}-salt`
const johnHash = hashDashboardPassword('john-password', 'john-salt');
const tylerHash = hashDashboardPassword('tyler-password', 'tyler-salt');

const config = JSON.stringify([
  { username: 'john', passwordHash: johnHash, role: 'admin' },
  { username: 'tyler', passwordHash: tylerHash, role: 'admin' },
]);

console.log('DASHBOARD_ADMIN_USERS=' + config);
```

### Option 3: Local Development

For local development only:

```bash
NODE_ENV=development
DASHBOARD_ADMIN_USERNAME=local-admin
DASHBOARD_ADMIN_PASSWORD=developer-owned-secret
```

**Security Note:** Plaintext passwords via `DASHBOARD_ADMIN_PASSWORD` are ONLY accepted when `NODE_ENV !== 'production'`. Production deployments must use password hashes.

## Migration Steps

### For Production Deployments

1. Generate a secure password hash:
   ```bash
   node scripts/hash-dashboard-password.mjs 'your-production-password'
   ```

2. Set environment variables in your deployment platform (Vercel, Railway, etc.):
   ```
   NODE_ENV=production
   DASHBOARD_ADMIN_USERNAME=owner
   DASHBOARD_ADMIN_PASSWORD_HASH=<the-generated-hash>
   ```

3. Deploy the updated code

4. Test login at `/dashboard/login`

5. Remove any old plaintext password environment variables

### For Local Development

1. Create or update `.env.local`:
   ```
   NODE_ENV=development
   DASHBOARD_ADMIN_USERNAME=local-admin
   DASHBOARD_ADMIN_PASSWORD=developer-owned-secret
   ```

2. Start the dev server: `npm run dev`

3. Test login at `http://localhost:3000/dashboard/login`

## Security Features

### Password Hashing
- Algorithm: PBKDF2-SHA256
- Iterations: 100,000
- Key length: 32 bytes
- Encoding: base64

### Session Management
- HttpOnly cookies (prevents XSS access)
- Secure flag in production (HTTPS only)
- SameSite: Lax (CSRF protection)
- 12-hour session lifetime
- HMAC-signed tokens (tampering detection)

### Development Safety
- Localhost requests allowed in development mode
- Production mode rejects plaintext passwords
- No hardcoded fallback credentials

## Authentication Flow

1. User submits username + password to `/dashboard/login`
2. Server checks environment-configured users
3. For hashed passwords: computes PBKDF2 hash and compares
4. For plaintext (dev only): direct comparison
5. On success: creates signed session token
6. Session token stored in HttpOnly cookie
7. Subsequent requests verified via cookie

## Troubleshooting

### "Login failed" in production
- Verify `DASHBOARD_ADMIN_USERNAME` matches the username you're entering (case-insensitive)
- Verify `DASHBOARD_ADMIN_PASSWORD_HASH` was generated with `'admin-salt'`
- Check that `NODE_ENV=production` is set

### "Login failed" in development
- Verify `DASHBOARD_ADMIN_PASSWORD` is set (not `DASHBOARD_ADMIN_PASSWORD_HASH`)
- Check that `NODE_ENV` is NOT set to `'production'`
- Username should match `DASHBOARD_ADMIN_USERNAME`

### Sessions expiring immediately
- Check system clock is correct
- Verify `DASHBOARD_AUTH_SECRET` or `NEXTAUTH_SECRET` is set
- Ensure cookies are enabled in browser

### Hash generation
- Single admin: always use `'admin-salt'` as the salt
- Multiple users: use `'${username}-salt'` (e.g., `'john-salt'`)
- Salt must match the format used during hash generation

## API Authentication

Internal API calls can authenticate via:

1. **Session cookie** (from browser login)
2. **Bearer token** with `DASHBOARD_INTERNAL_API_KEY`:
   ```bash
   curl -H "Authorization: Bearer ${DASHBOARD_INTERNAL_API_KEY}" \
     https://dashboard.jukesdiner.com/api/...
   ```

3. **Localhost bypass** (development only):
   - Requests from `localhost:*` are automatically authenticated in development

## Deprecated Files

The following files are deprecated and should NOT be used:

- `lib/auth.js` - Old plaintext authentication (DO NOT IMPORT)

## Code Examples

### Checking if a user is authenticated (Next.js API route)

```javascript
import { requireDashboardApiAuth } from '@/lib/dashboard-auth.mjs';

export async function GET(request) {
  const auth = requireDashboardApiAuth(request);
  if (!auth.ok) {
    return Response.json({ error: auth.error }, { status: auth.status });
  }

  // auth.session contains: { user, role, iat, exp }
  return Response.json({ user: auth.session.user });
}
```

### Login handler

```javascript
import { authenticateDashboardUser, applyDashboardSessionCookie } from '@/lib/dashboard-auth.mjs';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { username, password } = await request.json();
  
  const user = authenticateDashboardUser(username, password);
  if (!user) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true, user: user.username });
  applyDashboardSessionCookie(response, user);
  return response;
}
```

### Logout handler

```javascript
import { clearDashboardSessionCookie } from '@/lib/dashboard-auth.mjs';
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  clearDashboardSessionCookie(response);
  return response;
}
```

## Security Recommendations

1. **Never commit secrets to git**
   - Use `.env.local` for local development
   - Use platform environment variables for production

2. **Use strong passwords**
   - Minimum 16 characters recommended
   - Mix uppercase, lowercase, numbers, symbols
   - Consider using a password manager

3. **Rotate credentials regularly**
   - Generate new hashes periodically
   - Update environment variables
   - Clear all active sessions after rotation

4. **Monitor authentication logs**
   - Watch for repeated failed login attempts
   - Alert on unusual access patterns

5. **Keep `DASHBOARD_AUTH_SECRET` secure**
   - Generate a random 32+ character secret
   - Rotate if potentially compromised
   - Don't reuse across environments

## Support

For issues or questions:
- Check the test files in `tests/dashboard-auth.test.mjs` for working examples
- Review the implementation in `lib/dashboard-auth.mjs`
- Contact the ops team
