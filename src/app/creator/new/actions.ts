'use server';

import { FieldValue } from 'firebase-admin/firestore';
import { invalid, ok } from '@/lib/actions';
import { courseDraftSchema } from '@/lib/course/draft';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

export async function saveCourseDraft(input: unknown) {
  const user = await requireRole(['creator'], '/creator/new');
  const parsed = courseDraftSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);

  const draft = {
    ...parsed.data,
    status: 'draft',
    createdBy: user.uid,
    createdAt: FieldValue.serverTimestamp(),
    updatedAt: FieldValue.serverTimestamp(),
  };

  const ref = adminDb().collection('courses').doc();
  await ref.set(draft, { merge: true });

  return ok({ id: ref.id, status: draft.status });
}
