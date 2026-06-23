/**
 * Minimal single-admin session auth.
 *
 * A login sets an httpOnly cookie holding `<payload>.<signature>` where the
 * signature is HMAC-SHA256(payload, SESSION_SECRET). No DB session table is
 * needed. Both the Node runtime (API routes) and the Edge runtime (middleware)
 * verify the cookie via Web Crypto (`crypto.subtle`), so the same logic runs in
 * both places.
 */

export const SESSION_COOKIE = 'mosque_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('SESSION_SECRET is missing or too short (set it in .env).');
  }
  return secret;
}

// ── base64url helpers (Edge-safe, no Buffer) ──────────────────────────────
function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const b64 = btoa(binary);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(s: string): Uint8Array {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmac(payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toBase64Url(new Uint8Array(sig));
}

/** Constant-time string comparison. */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Creates a signed session token valid for SESSION_TTL_SECONDS. */
export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = toBase64Url(new TextEncoder().encode(JSON.stringify({ sub: 'admin', exp })));
  const sig = await hmac(payload);
  return { token: `${payload}.${sig}`, maxAge: SESSION_TTL_SECONDS };
}

/** Verifies a session token's signature and expiry. */
export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return false;

  const expected = await hmac(payload);
  if (!timingSafeEqual(sig, expected)) return false;

  try {
    const decoded = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      sub: string;
      exp: number;
    };
    return decoded.sub === 'admin' && decoded.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

/** Checks a submitted password against ADMIN_PASSWORD (constant-time). */
export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return timingSafeEqual(submitted, expected);
}
