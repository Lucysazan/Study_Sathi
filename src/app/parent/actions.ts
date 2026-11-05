'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { fail, invalid, ok, type ActionResult } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { studentEmail } from '@/lib/validation/auth';
import { childSchema, childPasswordSchema } from '@/lib/validation/family';
import { getServerEnv } from '@/lib/env/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function addChild(data: FormData): Promise<ActionResult> {
  const parsed = childSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const parent = await requireRole(['parent'], '/parent');
  const { username, password, nickname, avatarId } = parsed.data;
  const auth = adminAuth();
  let createdUid: string | undefined;
  let committed = false;
  try {
    // Firebase Auth atomically enforces uniqueness for the synthetic username email.
    const child = await auth.createUser({
      email: studentEmail(username, getServerEnv().studentLoginDomain),
      password,
      displayName: nickname,
    });
    createdUid = child.uid;
    await auth.setCustomUserClaims(child.uid, { role: 'student' });
    const db = adminDb();
    await db.runTransaction(async (tx) => {
      const parentRef = db.collection('users').doc(parent.uid);
      const parentDoc = await tx.get(parentRef);
      if (!parentDoc.exists || parentDoc.get('role') !== 'parent')
        throw new Error('Parent unavailable');
      const childUids: unknown = parentDoc.get('childUids');
      if (Array.isArray(childUids) && childUids.length >= 10) throw new Error('Family limit');
      tx.create(db.collection('users').doc(child.uid), {
        role: 'student',
        parentUid: parent.uid,
        username,
        nickname,
        avatarId,
        leaderboardOptIn: false,
        status: 'active',
        createdAt: FieldValue.serverTimestamp(),
        stats: { xp: 0, level: 1, streakDays: 0, lastActiveDate: null, badgeIds: [] },
      });
      tx.update(parentRef, { childUids: FieldValue.arrayUnion(child.uid) });
    });
    committed = true;
  } catch (error) {
    if (createdUid && !committed) {
      try {
        await auth.deleteUser(createdUid);
      } catch {
        /* No password or personal data in logs. */
      }
    }
    const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
    return fail(
      code === 'auth/email-already-exists'
        ? 'That username is taken. Please choose another.'
        : 'We could not create the account. Please try again. Families can have up to 10 learners.',
    );
  }
  revalidatePath('/parent');
  return ok();
}

export async function resetChildPassword(data: FormData): Promise<ActionResult> {
  const parsed = childPasswordSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(parsed.error);
  const parent = await requireRole(['parent'], '/parent');
  try {
    const child = await adminDb().collection('users').doc(parsed.data.childUid).get();
    if (child.get('parentUid') !== parent.uid || child.get('role') !== 'student')
      return fail('This learner is not linked to your family.');
    await adminAuth().updateUser(child.id, { password: parsed.data.password });
    await adminAuth().revokeRefreshTokens(child.id);
    return ok();
  } catch {
    return fail('We could not reset the password. Please try again.');
  }
}
