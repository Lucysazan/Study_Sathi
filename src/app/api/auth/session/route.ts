import { z } from 'zod';
import type { Role } from '@/lib/auth/roles';
import { clearSession, createSession, SessionError } from '@/lib/auth/session';
import { sameOrigin } from '@/lib/http/same-origin';
import { adminDb } from '@/lib/firebase/admin';

/**
 * POST { idToken } → sets the httpOnly session cookie. Returns the role and whether the account
 * still needs its one-time setup (e.g. first Google sign-in from the login page).
 * DELETE → signs out (revokes refresh tokens, clears cookies).
 * Both reject cross-site requests (Origin must match this site).
 */

export type SessionResponse =
  { ok: true; role: Role | null; needsSetup: boolean } | { ok: false; error: string };

const bodySchema = z.object({ idToken: z.string().min(20).max(5000) });

function json(body: SessionResponse | { ok: true }, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'Not allowed.' }, 403);
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return json({ ok: false, error: 'Invalid request.' }, 400);
  try {
    const { uid, role } = await createSession(parsed.data.idToken);
    const needsSetup =
      role === null && !(await adminDb().collection('users').doc(uid).get()).exists;
    return json({ ok: true, role, needsSetup });
  } catch (error) {
    if (error instanceof SessionError) return json({ ok: false, error: error.message }, 401);
    console.error('createSession failed', error);
    return json({ ok: false, error: 'Could not sign you in. Please try again.' }, 500);
  }
}

export async function DELETE(request: Request) {
  if (!sameOrigin(request)) return json({ ok: false, error: 'Not allowed.' }, 403);
  await clearSession();
  return json({ ok: true });
}
