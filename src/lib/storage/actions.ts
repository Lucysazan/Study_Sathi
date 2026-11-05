'use server';

import { getCurrentUser } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { fail, ok, type ActionResult } from '@/lib/actions';
import {
  changeLibrary,
  emptyLibrary,
  libraryChange,
  librarySchema,
  type LibraryData,
} from './library';

export async function loadLibrary(): Promise<
  ActionResult<{ uid: string; data: LibraryData } | null>
> {
  const user = await getCurrentUser();
  if (user?.role !== 'student') return ok(null);
  try {
    const doc = await adminDb()
      .collection('users')
      .doc(user.uid)
      .collection('privateData')
      .doc('library')
      .get();
    return ok({ uid: user.uid, data: librarySchema.parse(doc.exists ? doc.data() : emptyLibrary) });
  } catch {
    return fail('Your saved items could not be loaded. Please refresh to try again.');
  }
}

export async function updateLibrary(expectedUid: string, input: unknown): Promise<ActionResult> {
  const parsed = libraryChange.safeParse(input);
  if (!parsed.success)
    return fail('Please keep notes under 4,000 characters and your collection under 200 items.');
  const user = await getCurrentUser();
  if (user?.role !== 'student' || user.uid !== expectedUid)
    return fail('Please sign in again before saving.');
  try {
    const db = adminDb();
    const ref = db.collection('users').doc(user.uid).collection('privateData').doc('library');
    await db.runTransaction(async (tx) => {
      const current = await tx.get(ref);
      const data = librarySchema.parse(current.exists ? current.data() : emptyLibrary);
      tx.set(ref, changeLibrary(data, parsed.data));
    });
    return ok();
  } catch {
    return fail('Your changes could not be saved to your account. Please try again.');
  }
}
