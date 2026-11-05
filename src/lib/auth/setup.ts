import 'server-only';

import { z } from 'zod';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { setUpAccount } from './accounts';
import type { Role } from './roles';

export type ActionResult<T> = { ok: true; data: T } | { ok: false; error: string };

const setupSchema = z.object({
  idToken: z.string().min(20).max(5000),
  accountType: z.enum(['parent', 'creator']),
  displayName: z
    .string()
    .trim()
    .min(2, 'Please enter your name (at least 2 letters).')
    .max(60, 'Please use a shorter name (60 letters or fewer).'),
});

/**
 * Finish a new adult account: verifies the ID token, then sets the role and user doc on the
 * server. The client then refreshes its token and asks for a new session cookie.
 */
export async function completeSignup(input: unknown): Promise<ActionResult<{ role: Role | null }>> {
  const parsed = setupSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' };
  }
  const { idToken, accountType, displayName } = parsed.data;
  try {
    const decoded = await adminAuth().verifyIdToken(idToken, true);
    const result = await setUpAccount(adminAuth(), adminDb(), decoded.uid, {
      accountType,
      displayName,
    });
    return { ok: true, data: { role: result.role } };
  } catch (error) {
    console.error('completeSignup failed', error);
    return { ok: false, error: 'We could not finish setting up your account. Please try again.' };
  }
}
