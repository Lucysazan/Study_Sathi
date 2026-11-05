'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { fail, invalid, ok, type ActionResult } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { statsSchema } from '@/lib/gamification/stats';
import { syncLeaderboardEntries } from '@/lib/gamification/entries';

const consentInput = z.object({
  childUid: z
    .string()
    .min(1)
    .max(128)
    .regex(/^[^/]+$/),
  consent: z.enum(['off', 'on']),
});
export async function setLeaderboardConsent(data: FormData): Promise<ActionResult> {
  const parsed = consentInput.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const parent = await requireRole(['parent'], '/parent');
  const now = new Date();
  try {
    const db = adminDb();
    const result = await db.runTransaction(async (tx) => {
      const ref = db.collection('users').doc(parsed.data.childUid);
      const child = await tx.get(ref);
      if (child.get('parentUid') !== parent.uid || child.get('role') !== 'student')
        return fail('This learner is not linked to your family.');
      const visible = parsed.data.consent === 'on';
      if (visible && child.get('status') === 'disabled') return fail('This account is turned off.');
      const stats = visible ? statsSchema.parse(child.get('stats') ?? {}) : null;
      tx.update(ref, { leaderboardOptIn: visible });
      syncLeaderboardEntries(tx, db, child.id, stats, visible, now);
      return ok();
    });
    if (result.ok) {
      revalidatePath('/parent');
      revalidatePath('/learn/leaderboard');
    }
    return result;
  } catch {
    return fail('We could not save leaderboard visibility. Please try again.');
  }
}
