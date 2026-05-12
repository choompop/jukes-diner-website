import crypto from 'node:crypto';

const COOKIE_NAME = 'jukes_dashboard_session';
const TOKEN_TTL_SECONDS = 60 * 60 * 12;

function getSecret() {
  const secret = process.env.DASHBOARD_AUTH_SECRET || process.env.NEXTAUTH_SECRET;
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'DASHBOARD_AUTH_SECRET or NEXTAUTH_SECRET is required in production. ' +
        'Generate a secure secret: openssl rand -base64 32'
      );
    }
    // Development fallback - logged for visibility
    console.warn('[DASHBOARD AUTH] Using insecure fallback secret in development mode. Set DASHBOARD_AUTH_SECRET for production.');
    return 'jukes-local-dashboard-secret-INSECURE-DEV-ONLY';
  }
  
  return secret;
}

function base64url(value) {
  return Buffer.from(value).toString('base64url');
}

function sign(payload) {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function normalizeUsername(username) {
  return String(username || '').toLowerCase().trim();
}

function sessionUsername(user) {
  if (typeof user === 'string') return normalizeUsername(user);
  return normalizeUsername(user?.username || user?.user);
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ''));
  const rightBuffer = Buffer.from(String(right || ''));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function createDashboardSessionToken(user, now = Date.now()) {
  const payload = JSON.stringify({
    user: sessionUsername(user),
    role: typeof user === 'object' && user ? user.role || 'admin' : 'admin',
    iat: Math.floor(now / 1000),
    exp: Math.floor(now / 1000) + TOKEN_TTL_SECONDS,
  });
  const encoded = base64url(payload);
  return `${encoded}.${sign(encoded)}`;
}

export function verifyDashboardSessionToken(token, now = Date.now()) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = sign(encoded);
  const safeSignature = Buffer.from(signature);
  const safeExpected = Buffer.from(expected);
  if (safeSignature.length !== safeExpected.length || !crypto.timingSafeEqual(safeSignature, safeExpected)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    if (!payload.user || !payload.exp || payload.exp < Math.floor(now / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function applyDashboardSessionCookie(response, user) {
  response.cookies.set(COOKIE_NAME, createDashboardSessionToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_TTL_SECONDS,
    path: '/',
  });
  return response;
}

export function clearDashboardSessionCookie(response) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
  });
  return response;
}

export function getDashboardSessionFromRequest(request) {
  const cookieToken = request?.cookies?.get?.(COOKIE_NAME)?.value;
  const session = verifyDashboardSessionToken(cookieToken);
  if (session) return session;

  const auth = request?.headers?.get?.('authorization') || '';
  const bearer = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : '';
  const internalKey = process.env.DASHBOARD_INTERNAL_API_KEY;
  if (internalKey && bearer && safeEqual(bearer, internalKey)) {
    return { user: 'internal-api', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 60 };
  }

  return null;
}

export function isLocalDevelopmentRequest(request) {
  if (process.env.NODE_ENV === 'production') return false;
  const host = request?.headers?.get?.('host') || '';
  return host.startsWith('localhost:') || host.startsWith('127.0.0.1:');
}

export function requireDashboardApiAuth(request, { allowLocalDevelopment = true } = {}) {
  const session = getDashboardSessionFromRequest(request);
  if (session) return { ok: true, session };
  if (allowLocalDevelopment && isLocalDevelopmentRequest(request)) {
    return { ok: true, session: { user: 'local-development' } };
  }
  return { ok: false, status: 401, error: 'Dashboard authentication required.' };
}

export function hashDashboardPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256').toString('base64');
}

export function authenticateDashboardUser(username, password) {
  const normalized = normalizeUsername(username);

  // In production, require either DASHBOARD_ADMIN_USERS or DASHBOARD_ADMIN_PASSWORD_HASH
  if (process.env.NODE_ENV === 'production') {
    const hasAdminUsers = process.env.DASHBOARD_ADMIN_USERS;
    const hasPasswordHash = process.env.DASHBOARD_ADMIN_PASSWORD_HASH;
    const hasPlaintextPassword = process.env.DASHBOARD_ADMIN_PASSWORD;
    
    if (hasPlaintextPassword && !hasPasswordHash && !hasAdminUsers) {
      throw new Error(
        'DASHBOARD_ADMIN_PASSWORD is not allowed in production. ' +
        'Use DASHBOARD_ADMIN_PASSWORD_HASH instead. ' +
        'Generate a hash: node scripts/hash-dashboard-password.mjs "your-password"'
      );
    }
  }

  const adminUsers = process.env.DASHBOARD_ADMIN_USERS;
  if (adminUsers) {
    try {
      const users = JSON.parse(adminUsers);
      const user = users.find((u) => normalizeUsername(u.username) === normalized);
      if (user && user.passwordHash) {
        const salt = `${normalized}-salt`;
        const computed = hashDashboardPassword(password, salt);
        if (safeEqual(computed, user.passwordHash)) {
          return { username: normalized, role: user.role || 'admin' };
        }
      }
    } catch {
      return null;
    }
  }

  const singleUsername = process.env.DASHBOARD_ADMIN_USERNAME;
  const singleHash = process.env.DASHBOARD_ADMIN_PASSWORD_HASH;
  const singlePlaintext = process.env.DASHBOARD_ADMIN_PASSWORD;

  if (singleUsername && normalizeUsername(singleUsername) === normalized) {
    if (singleHash) {
      const salt = 'admin-salt';
      const computed = hashDashboardPassword(password, salt);
      if (safeEqual(computed, singleHash)) {
        return { username: normalized, role: 'admin' };
      }
      // In production, only accept hashed passwords
      if (process.env.NODE_ENV === 'production') {
        return null;
      }
    }

    // Development mode: allow plaintext passwords for convenience
    if (process.env.NODE_ENV !== 'production' && singlePlaintext) {
      if (safeEqual(password, singlePlaintext)) {
        console.warn('[DASHBOARD AUTH] Authenticated via plaintext password (development mode only)');
        return { username: normalized, role: 'admin' };
      }
    }
  }

  return null;
}

export { COOKIE_NAME as DASHBOARD_SESSION_COOKIE };
