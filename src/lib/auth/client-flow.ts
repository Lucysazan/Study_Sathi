'use client';

import type { User } from 'firebase/auth';
import type { SessionResponse } from '@/app/api/auth/session/route';
import { completeSignup } from './actions';
import type { AccountType } from './accounts';
import { type Role, roleHome, safeNextPath } from './roles';

/** Browser side of sign-in: Firebase user → server session cookie → destination. */

export type SessionResult = { role: Role | null; needsSetup: boolean };

async function postSession(idToken: string): Promise<SessionResult> {
  const res = await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });
  const body = (await res.json().catch(() => null)) as SessionResponse | null;
  if (!body) throw new Error('Could not sign you in. Please try again.');
  if (!body.ok) throw new Error(body.error);
  return { role: body.role, needsSetup: body.needsSetup };
}

/** Exchange the signed-in Firebase user for a session cookie. */
export async function startSession(user: User): Promise<SessionResult> {
  return postSession(await user.getIdToken());
}

/** One-time account setup, then a fresh token (with the new role) and a new session cookie. */
export async function finishSetup(
  user: User,
  accountType: AccountType,
  displayName: string,
): Promise<SessionResult> {
  const result = await completeSignup({
    idToken: await user.getIdToken(),
    accountType,
    displayName,
  });
  if (!result.ok) throw new Error(result.error);
  return postSession(await user.getIdToken(true));
}

/**
 * Full page loads (not router.push) after signing in or out, on purpose: the new cookies must
 * reach the header link, proxy.ts and the portal layouts, and Next keeps visited pages alive.
 */
export function goAfterSignIn(role: Role | null, next: string | null): void {
  window.location.assign(safeNextPath(next) ?? roleHome(role));
}

/** Sign out on the server (revokes tokens, clears cookies), then go home. */
export async function signOutEverywhere(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE' }).catch(() => undefined);
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination -- see above
  window.location.assign('/');
}
