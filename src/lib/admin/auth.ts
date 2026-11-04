export const ADMIN_COOKIE_NAME = 'aesthique_admin_session';
export const ADMIN_SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours

// In-memory rate limiting map for login attempts: ip -> { count, firstAttemptAt, lockedUntil }
const loginAttemptsMap = new Map<string, { count: number; firstAttemptAt: number; lockedUntil?: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes lockout

export interface AdminSessionPayload {
  sub: string;
  email: string;
  role: 'super_admin' | 'manager' | 'support';
  iat: number;
  exp: number;
}

function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    'aesthique-super-secret-hmac-signing-key-2026-production-grade'
  );
}

function getAdminConfiguredPassword(): string {
  return process.env.ADMIN_PASSWORD || 'Aesthique@Admin2026!';
}

function toBase64Url(strOrBytes: string | Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    if (typeof strOrBytes === 'string') {
      return Buffer.from(strOrBytes).toString('base64url');
    }
    return Buffer.from(strOrBytes).toString('base64url');
  }
  // Universal fallback
  const str =
    typeof strOrBytes === 'string'
      ? strOrBytes
      : Array.from(strOrBytes)
          .map((b) => String.fromCharCode(b))
          .join('');
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64UrlToBytes(base64url: string): Uint8Array {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const bin = typeof atob !== 'undefined' ? atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const buffer = new ArrayBuffer(bin.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < bin.length; i++) {
    view[i] = bin.charCodeAt(i);
  }
  return view;
}

function fromBase64UrlToString(base64url: string): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(base64url, 'base64url').toString('utf8');
  }
  const bytes = fromBase64UrlToBytes(base64url);
  const decoder = new TextDecoder();
  return decoder.decode(bytes);
}

async function getHmacCryptoKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Checks rate limiting for an incoming login request by IP
 */
export function checkLoginRateLimit(ip: string): { allowed: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);

  if (!record) {
    return { allowed: true };
  }

  // Check if actively locked
  if (record.lockedUntil && record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remainingMinutes };
  }

  // Check if window has elapsed, reset if so
  if (now - record.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    loginAttemptsMap.delete(ip);
    return { allowed: true };
  }

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + RATE_LIMIT_WINDOW_MS;
    return { allowed: false, remainingMinutes: 15 };
  }

  return { allowed: true };
}

/**
 * Records a failed login attempt
 */
export function recordFailedLoginAttempt(ip: string): void {
  const now = Date.now();
  const record = loginAttemptsMap.get(ip);

  if (!record || now - record.firstAttemptAt > RATE_LIMIT_WINDOW_MS) {
    loginAttemptsMap.set(ip, { count: 1, firstAttemptAt: now });
  } else {
    record.count += 1;
    if (record.count >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + RATE_LIMIT_WINDOW_MS;
    }
  }
}

/**
 * Clears rate limiting on successful login
 */
export function clearLoginRateLimit(ip: string): void {
  loginAttemptsMap.delete(ip);
}

/**
 * Cryptographically verifies an entered password against configured admin secrets
 * Uses constant-time bitwise equality to prevent side-channel timing analysis attacks
 */
export async function verifyAdminPassword(candidatePassword: string): Promise<boolean> {
  if (!candidatePassword || typeof candidatePassword !== 'string') {
    return false;
  }

  const expectedPassword = getAdminConfiguredPassword();
  const enc = new TextEncoder();

  // Hash candidate and expected using SHA-256
  const [candidateBuf, expectedBuf] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(candidatePassword)),
    crypto.subtle.digest('SHA-256', enc.encode(expectedPassword)),
  ]);

  const candidateArray = new Uint8Array(candidateBuf);
  const expectedArray = new Uint8Array(expectedBuf);

  if (candidateArray.length !== expectedArray.length) {
    return false;
  }

  let diff = 0;
  for (let i = 0; i < candidateArray.length; i++) {
    diff |= candidateArray[i] ^ expectedArray[i];
  }

  return diff === 0;
}

/**
 * Generates an HMAC-signed session token for the authenticated administrator
 */
export async function createAdminSessionToken(payload?: Partial<AdminSessionPayload>): Promise<string> {
  const now = Date.now();
  const sessionData: AdminSessionPayload = {
    sub: payload?.sub || 'root_super_admin_001',
    email: payload?.email || 'concierge@aesthique.com',
    role: payload?.role || 'super_admin',
    iat: now,
    exp: now + ADMIN_SESSION_DURATION_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(sessionData));
  const key = await getHmacCryptoKey(getSessionSecret());
  const enc = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, enc.encode(encodedPayload));
  const encodedSignature = toBase64Url(new Uint8Array(signatureBuffer));

  return `${encodedPayload}.${encodedSignature}`;
}

/**
 * Validates an HMAC-signed admin session token
 */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<{
  valid: boolean;
  session?: AdminSessionPayload;
  error?: string;
}> {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'No session token provided' };
  }

  const parts = token.split('.');
  if (parts.length !== 2) {
    return { valid: false, error: 'Malformed session token' };
  }

  const [encodedPayload, encodedSignature] = parts;

  try {
    const key = await getHmacCryptoKey(getSessionSecret());
    const enc = new TextEncoder();
    const sigBytes = fromBase64UrlToBytes(encodedSignature);

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes as any,
      enc.encode(encodedPayload)
    );

    if (!isValid) {
      return { valid: false, error: 'Invalid cryptographic signature' };
    }

    const jsonStr = fromBase64UrlToString(encodedPayload);
    const payload: AdminSessionPayload = JSON.parse(jsonStr);

    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Admin session has expired' };
    }

    if (!payload.role || !['super_admin', 'manager', 'support'].includes(payload.role)) {
      return { valid: false, error: 'Invalid administrative role' };
    }

    return { valid: true, session: payload };
  } catch (err: any) {
    return { valid: false, error: `Invalid session payload: ${err.message}` };
  }
}
