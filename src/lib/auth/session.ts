import 'server-only';
import { connection } from 'next/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getServerEnv } from '@/lib/env/server';
import { adminAuth } from '@/lib/firebase/admin';
import { SESSION_MAX_AGE_SECONDS, SIGNED_IN_HINT_COOKIE } from './constants';
import { isRole, loginUrl, type Role, roleHome } from './roles';

export type CurrentUser = {
  uid: string;
  role: Role | null;
  email: string | null;
  name: string | null;
};

function cookieOptions(httpOnly: boolean) {
  return {
    httpOnly,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

export class SessionError extends Error {}

/**
 * Exchange a fresh Firebase ID token for an httpOnly session cookie.
 * The token's claims (including `role`) are baked into the cookie, so call this again after a
 * role change (the client refreshes its token first).
 */
export async function createSession(idToken: string): Promise<{ uid: string; role: Role | null }> {
  await connection();
  const auth = adminAuth();
  const decoded = await auth.verifyIdToken(idToken, true).catch(() => {
    throw new SessionError('Invalid sign-in. Please try again.');
  });
  // Keep the session gate request-time and avoid `Date.now()` here: the logged-in cookie and
  // `verifySessionCookie(..., true)` are enough for the local emulator flow, and this avoids the
  // Next 16 Cache Components prerender warning on portal routes.
  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_SECONDS * 1000,
  });
  const store = await cookies();
  store.set(getServerEnv().sessionCookieName, sessionCookie, cookieOptions(true));
  store.set(SIGNED_IN_HINT_COOKIE, '1', cookieOptions(false));
  const role: unknown = decoded.role;
  return { uid: decoded.uid, role: isRole(role) ? role : null };
}

/** Sign out: revoke the user's refresh tokens (all devices) and clear both cookies. */
export async function clearSession(): Promise<void> {
  const store = await cookies();
  const name = getServerEnv().sessionCookieName;
  const value = store.get(name)?.value;
  if (value) {
    const decoded = await adminAuth()
      .verifySessionCookie(value)
      .catch(() => null);
    if (decoded) await adminAuth().revokeRefreshTokens(decoded.sub);
  }
  store.delete(name);
  store.delete(SIGNED_IN_HINT_COOKIE);
}

/**
 * The signed-in user, verified with firebase-admin (also checks revoked tokens and disabled
 * accounts), or null. Deduplicated per request. Reads cookies, so callers must sit inside a
 * <Suspense> boundary (Cache Components).
 */
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  await connection();
  const value = (await cookies()).get(getServerEnv().sessionCookieName)?.value;
  if (!value) return null;
  try {
    const decoded = await adminAuth().verifySessionCookie(value, true);
    const role: unknown = decoded.role;
    return {
      uid: decoded.uid,
      role: isRole(role) ? role : null,
      email: decoded.email ?? null,
      name: typeof decoded.name === 'string' ? decoded.name : null,
    };
  } catch {
    return null;
  }
});

/**
 * Real access check for portal layouts and server actions.
 * Not signed in → login (then back to `returnTo`). Wrong role → the user's own home.
 */
export async function requireRole(
  allowed: readonly Role[],
  returnTo: string,
): Promise<CurrentUser> {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect(loginUrl(returnTo));
  if (!user.role || !allowed.includes(user.role)) redirect(roleHome(user.role));
  return user;
}

/** Any signed-in user, with or without a role (used by /account). */
export async function requireUser(returnTo: string): Promise<CurrentUser> {
  await connection();
  const user = await getCurrentUser();
  if (!user) redirect(loginUrl(returnTo));
  return user;
}
