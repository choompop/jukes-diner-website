const COOKIE_NAME = 'jukes_dashboard_session';
const TOKEN_TTL_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

function getMiddlewareSecret() {
  const secret = process.env.DASHBOARD_AUTH_SECRET || process.env.NEXTAUTH_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('DASHBOARD_AUTH_SECRET or NEXTAUTH_SECRET is required in production.');
    }
    return 'jukes-local-dashboard-secret-INSECURE-DEV-ONLY';
  }

  return secret;
}

function base64urlToBytes(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');

  if (typeof atob === 'function') {
    return Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  }

  return Uint8Array.from(Buffer.from(padded, 'base64'));
}

function bytesToBase64url(bytes) {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64url');
  }

  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function timingSafeEqual(left, right) {
  const leftBytes = encoder.encode(String(left || ''));
  const rightBytes = encoder.encode(String(right || ''));
  if (leftBytes.length !== rightBytes.length) return false;

  let diff = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index];
  }
  return diff === 0;
}

async function signForMiddleware(payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(getMiddlewareSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return bytesToBase64url(new Uint8Array(signature));
}

export function shouldProtectDashboardPath(pathname) {
  const cleanPath = String(pathname || '').replace(/\/+$/, '') || '/';
  return cleanPath === '/dashboard' || (
    cleanPath.startsWith('/dashboard/') && cleanPath !== '/dashboard/login'
  );
}

export function buildDashboardLoginRedirect(url) {
  const redirectUrl = new URL('/dashboard/login', url.origin);
  const nextPath = `${url.pathname}${url.search}`;
  if (nextPath && nextPath !== '/dashboard/login') {
    redirectUrl.searchParams.set('next', nextPath);
  }
  return redirectUrl;
}

export async function verifyDashboardSessionTokenForMiddleware(token, now = Date.now()) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [encoded, signature, ...extraParts] = token.split('.');
  if (!encoded || !signature || extraParts.length > 0) return null;

  const expected = await signForMiddleware(encoded);
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const payloadText = new TextDecoder().decode(base64urlToBytes(encoded));
    const payload = JSON.parse(payloadText);
    const nowSeconds = Math.floor(now / 1000);

    if (!payload.user || !payload.exp || payload.exp < nowSeconds) return null;
    if (payload.iat && payload.iat > nowSeconds + 60) return null;
    if (payload.exp > nowSeconds + TOKEN_TTL_SECONDS + 60) return null;

    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME as DASHBOARD_SESSION_COOKIE };
