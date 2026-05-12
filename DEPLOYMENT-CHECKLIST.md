# Dashboard Production Deployment Checklist

This checklist ensures the dashboard is secure and ready for public exposure at `dashboard.jukesdiner.com`.

## Pre-Deployment Security Review

### ✅ Authentication & Secrets

- [ ] **Generated production secrets**
  ```bash
  # Auth secret (32+ chars)
  openssl rand -base64 32
  
  # Internal API key (if needed)
  openssl rand -hex 32
  ```

- [ ] **Created admin password hash**
  ```bash
  # Recommended: stdin mode (password not logged in shell history)
  node scripts/hash-dashboard-password.mjs --stdin
  
  # Alternative: CLI argument mode (⚠️ logged in shell history)
  node scripts/hash-dashboard-password.mjs "your-secure-password"
  ```

- [ ] **Configured environment variables in deployment platform**
  - `NODE_ENV=production`
  - `DASHBOARD_AUTH_SECRET=<generated-secret>`
  - `DASHBOARD_ADMIN_USERNAME=owner`
  - `DASHBOARD_ADMIN_PASSWORD_HASH=<generated-hash>`
  - `DASHBOARD_INTERNAL_API_KEY=<generated-key>` (if using API)

- [ ] **Verified NO plaintext passwords in production**
  - `DASHBOARD_ADMIN_PASSWORD` must NOT be set
  - Only `DASHBOARD_ADMIN_PASSWORD_HASH` or `DASHBOARD_ADMIN_USERS` allowed

- [ ] **Removed or secured demo credentials**
  - No `admin/test123` or similar in any env files
  - `.env.local` is gitignored and not deployed

### ✅ Session & Cookie Security

- [ ] **Session cookies properly configured**
  - `httpOnly: true` ✓ (prevents XSS)
  - `secure: true` in production ✓ (HTTPS only)
  - `sameSite: 'lax'` ✓ (CSRF protection)
  - 12-hour TTL ✓

- [ ] **Session secret is unique and strong**
  - Not reused from dev/staging
  - At least 32 characters random
  - Never committed to git

### ✅ Environment Validation

- [ ] **Run production environment validator**
  ```bash
  NODE_ENV=production node scripts/validate-production-env.mjs
  ```
  
- [ ] **No validation errors**
  - All required secrets present
  - No prohibited plaintext passwords
  - Admin credentials properly configured

- [ ] **Verify .gitignore coverage**
  ```bash
  cat .gitignore | grep -E '\.env'
  ```
  Expected: `.env`, `.env.local`, `.env.production`, `.env.development`

## Deployment Steps

### 1. Configure Production Environment

In your deployment platform (Vercel, Railway, etc.), set:

```bash
# Required
NODE_ENV=production
DASHBOARD_AUTH_SECRET=<unique-production-secret>
DASHBOARD_ADMIN_USERNAME=owner
DASHBOARD_ADMIN_PASSWORD_HASH=<pbkdf2-hash>

# Recommended
DASHBOARD_INTERNAL_API_KEY=<unique-api-key>

# Optional (add as needed)
# OPENAI_API_KEY=
# STRIPE_SECRET_KEY=
# STRIPE_WEBHOOK_SECRET=
```

### 2. Deploy Code

- [ ] **Push latest code to main/production branch**
- [ ] **Trigger deployment** (auto or manual)
- [ ] **Monitor build logs** for errors

### 3. Post-Deployment Verification

- [ ] **Test login flow**
  - Visit `https://dashboard.jukesdiner.com/dashboard/login`
  - Attempt login with production credentials
  - Verify successful authentication
  - Check session cookie is set with `Secure` flag

- [ ] **Verify security headers** (browser DevTools Network tab)
  - Session cookie has `HttpOnly`
  - Session cookie has `Secure`
  - Session cookie has `SameSite=Lax`

- [ ] **Test protected routes**
  - Access `/dashboard/command-center` when logged in → ✓ works
  - Log out
  - Access `/dashboard/command-center` when logged out → redirects to login

- [ ] **Verify no dev backdoors**
  - Localhost bypass is disabled in production ✓
  - Plaintext passwords rejected ✓
  - No hardcoded credentials ✓

### 4. Monitor & Alert

- [ ] **Set up authentication monitoring**
  - Track failed login attempts
  - Alert on unusual patterns
  - Log successful authentications

- [ ] **Schedule credential rotation**
  - Quarterly password rotation recommended
  - Document rotation procedure
  - Test rotation process in staging first

## DNS & Infrastructure (Out of Scope for This Task)

The following are **NOT** part of this auth hardening task but are required before public exposure:

- [ ] DNS configuration (`dashboard.jukesdiner.com` → deployment)
- [ ] TLS/SSL certificate (HTTPS)
- [ ] Reverse proxy or CDN configuration
- [ ] Rate limiting / DDoS protection
- [ ] Backup and disaster recovery

## Invite/Access Management Plan

### Current State
- Single admin account (owner/john)
- No self-service user registration
- No role-based access control beyond admin

### Recommended Next Steps (Future Work)
1. **Invite system for franchisees**
   - Generate invite tokens
   - Email-based onboarding
   - Role assignment (admin, franchisee, viewer)

2. **Multi-tenant isolation**
   - Separate data by franchise/location
   - Row-level security in Supabase
   - Scoped API permissions

3. **Session management UI**
   - View active sessions
   - Force logout / revoke sessions
   - Audit trail of access

4. **Password reset flow**
   - Email-based reset tokens
   - Time-limited reset links
   - Password strength requirements

## Rollback Plan

If issues arise after deployment:

1. **Quick rollback** - Revert to previous deployment via platform UI
2. **Emergency access** - Use `DASHBOARD_INTERNAL_API_KEY` for server-side admin access
3. **Reset credentials** - Generate new hash, update env vars, redeploy

## Testing Checklist

Run these tests in a staging environment before production:

```bash
# Test production env validation
NODE_ENV=production node scripts/validate-production-env.mjs

# Test hash generation
node scripts/hash-dashboard-password.mjs "test-password"

# Verify .env files are not committed
git status --ignored | grep .env
```

## Sign-Off

- [ ] **Security review completed** by: _________________ Date: _________
- [ ] **Deployment approved** by: _________________ Date: _________
- [ ] **Post-deployment verification passed** by: _________________ Date: _________

---

**Last Updated:** 2026-05-08  
**Document Owner:** Ops/Security Team  
**Next Review:** Before next production deployment
