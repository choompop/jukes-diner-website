# Dashboard Invite & User Access Plan

## Current Architecture (Phase 1: Initial Deployment)

### Access Model
- **Single admin account** configured via environment variables
- **No self-registration** - owner sets credentials before deployment
- **Session-based authentication** with 12-hour cookie TTL

### Limitations
- Can't invite franchisees or staff without redeploying
- No user management UI
- No role differentiation (everyone is admin)
- No audit trail of who did what

## Recommended Evolution (Phase 2: Multi-User)

### Short-term: Multiple Admin Accounts via ENV

**Timeline:** Can be implemented immediately  
**Complexity:** Low (already supported)

Use `DASHBOARD_ADMIN_USERS` JSON array for 2-5 core users:

```bash
DASHBOARD_ADMIN_USERS='[
  {"username":"john","passwordHash":"<hash>","role":"admin"},
  {"username":"tyler","passwordHash":"<hash>","role":"admin"},
  {"username":"ops","passwordHash":"<hash>","role":"admin"}
]'
```

**Pros:**
- No code changes needed
- Works today
- Simple and auditable

**Cons:**
- Adding users requires env var update + redeploy
- No self-service password reset
- No invite links
- Scalability ceiling at ~5 users (env var size limits)

### Medium-term: Database-Backed User Management

**Timeline:** 2-4 weeks development  
**Complexity:** Medium (requires database + UI)

**Features:**
1. **User CRUD via admin UI**
   - Add/edit/disable users without deployment
   - Assign roles: `owner`, `admin`, `franchisee`, `viewer`
   - Track created_at, last_login

2. **Invite system**
   - Generate time-limited invite tokens
   - Email invite links
   - User sets their own password on first login

3. **Role-Based Access Control (RBAC)**
   - `owner` - full access, manage users
   - `admin` - dashboard access, can't manage users
   - `franchisee` - scoped to their location(s)
   - `viewer` - read-only access

4. **Password reset flow**
   - "Forgot password" link
   - Email-based reset tokens (15-min TTL)
   - Force password change on next login

**Implementation Approach:**

#### Database Schema (Supabase or similar)

```sql
-- Users table
CREATE TABLE dashboard_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ,
  created_by UUID REFERENCES dashboard_users(id),
  notes TEXT
);

-- Invite tokens
CREATE TABLE dashboard_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_by UUID REFERENCES dashboard_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  claimed_by UUID REFERENCES dashboard_users(id)
);

-- Password reset tokens
CREATE TABLE dashboard_password_resets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES dashboard_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_at TIMESTAMPTZ
);

-- Audit log
CREATE TABLE dashboard_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES dashboard_users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(255),
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Migration Path

**Step 1: Bootstrap admin from env**
- First deployment: owner logs in via `DASHBOARD_ADMIN_USERNAME` + hash
- On first login, system auto-creates owner record in `dashboard_users` table
- Owner can then invite other users via UI

**Step 2: Dual-mode authentication**
```javascript
export function authenticateDashboardUser(username, password) {
  // Try database first
  const dbUser = await queryDatabaseUser(username);
  if (dbUser && verifyPasswordHash(password, dbUser.password_hash)) {
    await logAudit(dbUser.id, 'login_success');
    return { username: dbUser.username, role: dbUser.role, userId: dbUser.id };
  }
  
  // Fallback to env-based auth (for bootstrap and emergency access)
  return authenticateFromEnv(username, password);
}
```

**Step 3: Deprecate env-based users**
- After all users migrated to database
- Keep `DASHBOARD_ADMIN_USERNAME` + hash as emergency backup only
- Log warning when env-based auth is used

### Long-term: Multi-Tenant Franchise Management

**Timeline:** 2-3 months development  
**Complexity:** High (multi-tenancy, data isolation)

**Features:**
1. **Franchise/location scoping**
   - Each franchisee sees only their data
   - Corporate sees aggregated view across all locations
   - Row-level security (RLS) in database

2. **SSO integration** (optional)
   - Google Workspace for corporate staff
   - SAML/OAuth for enterprise franchisees

3. **Permission management**
   - Fine-grained permissions: `view_financials`, `manage_bookings`, etc.
   - Permission groups/templates
   - Per-location overrides

4. **Session management**
   - View active sessions
   - Force logout (revoke sessions remotely)
   - Concurrent session limits

## Recommended Rollout Timeline

### Immediate (This Deploy)
- ✅ Production-hardened auth with single admin
- ✅ Secure session management
- ✅ Environment variable validation

### Within 1 Month
- Switch to `DASHBOARD_ADMIN_USERS` for 2-3 core team members
- Document emergency access procedures
- Set up credential rotation schedule

### Q3 2026 (if needed)
- Build database-backed user management UI
- Implement invite system
- Add basic RBAC (owner/admin/franchisee/viewer)
- Password reset flow

### Q4 2026 (if scaling)
- Multi-tenant data isolation
- Franchise-scoped dashboards
- Advanced permissions
- SSO integration

## Security Considerations

### Current Mitigations
- ✅ PBKDF2 password hashing (100k iterations)
- ✅ Timing-safe comparison (prevents timing attacks)
- ✅ HttpOnly, Secure, SameSite cookies
- ✅ No plaintext passwords in production
- ✅ Session token HMAC signing

### Future Additions
- [ ] Rate limiting on login attempts (after 5 failures, 15-min lockout)
- [ ] 2FA/MFA support (TOTP or SMS)
- [ ] IP allowlisting for admin accounts
- [ ] Audit logging for all sensitive actions
- [ ] Automated security scanning (OWASP dependency check)
- [ ] Session replay attack prevention (nonce/CSRF tokens)

## Invitation Flow (Future Feature)

### Admin sends invite:
1. Admin enters email + role in dashboard UI
2. System generates unique token, stores in `dashboard_invites`
3. Email sent with link: `https://dashboard.jukesdiner.com/invite/<token>`
4. Token expires in 7 days

### Recipient accepts:
1. Click link, token validated (not expired, not claimed)
2. Show "Set your password" form
3. User chooses username + password
4. Record created in `dashboard_users`
5. Invite marked as claimed
6. User immediately logged in

### Edge cases:
- **Invite expired:** Show "expired" page, offer to request new invite
- **Email already registered:** Reject with friendly error
- **Username taken:** Suggest alternatives
- **Invite revoked:** Admin can delete unused invites

## Emergency Access Procedure

If database goes down or all users locked out:

1. **Use env-based admin account** (bootstrap owner)
   ```bash
   # Set in deployment platform emergency config
   DASHBOARD_ADMIN_USERNAME=emergency
   DASHBOARD_ADMIN_PASSWORD_HASH=<pregenerated-hash>
   ```

2. **Or use internal API key** for server-side access
   ```bash
   curl -H "Authorization: Bearer $DASHBOARD_INTERNAL_API_KEY" \
     https://dashboard.jukesdiner.com/api/admin/reset-user-password \
     -d '{"username":"john","new_password_hash":"..."}'
   ```

3. **Document recovery in runbook** (location TBD)

## Decision Points

Before implementing Phase 2 (database users), answer:

1. **How many users?**
   - Under 5 → stick with env-based `DASHBOARD_ADMIN_USERS`
   - Over 5 → invest in database + UI

2. **How often do users change?**
   - Rarely (annual) → env is fine
   - Frequently (weekly) → need self-service

3. **Need audit trail?**
   - Yes → database required for logging
   - No → env is simpler

4. **Budget/timeline for development?**
   - Limited → env-based approach
   - Flexible → build proper user management

## References

- [DASHBOARD_AUTH_MIGRATION.md](./docs/DASHBOARD_AUTH_MIGRATION.md) - Current auth implementation
- [DEPLOYMENT-CHECKLIST.md](./DEPLOYMENT-CHECKLIST.md) - Production deployment steps
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Document Owner:** Ops/Security Team  
**Last Updated:** 2026-05-08  
**Status:** Phase 1 implemented, Phase 2 planning
