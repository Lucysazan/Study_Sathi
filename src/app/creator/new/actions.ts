'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { invalid, ok, fail } from '@/lib/actions';
import { courseDraftSchema } from '@/lib/course/draft';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

export async function saveCourseDraft(input: unknown) {
  const parsed = courseDraftSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const user = await requireRole(['creator'], '/creator/new');

  const draft = {
    ...parsed.data,
    status: 'draft',
    createdBy: user.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  try {
    const ref = adminDb().collection('courses').doc();
    await ref.set(draft);
    revalidatePath('/creator', 'layout');
    return ok({ id: ref.id, status: draft.status });
  } catch {
    return fail('We could not save your draft. Please try again.');
  }
}
