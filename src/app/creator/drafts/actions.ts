'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { readCourseOutline } from '@/lib/course/outline';
import { FieldValue } from 'firebase-admin/firestore';
import { invalid, ok, fail } from '@/lib/actions';
import { courseOutlineSchema, courseReadySchema } from '@/lib/course/draft';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

export type CourseDraftListItem = {
  id: string;
  title: string;
  summary: string;
  status: 'draft' | 'review' | 'published';
  reviewNote: string | null;
  updatedAt: string | null;
};

export async function listCreatorDrafts(): Promise<CourseDraftListItem[]> {
  const user = await requireRole(['creator'], '/creator');
  const snap = await adminDb().collection('courses').where('createdBy', '==', user.uid).get();

  return snap.docs
    .map((doc) => ({
      id: doc.id,
      title: String(doc.get('title') ?? 'Untitled course'),
      summary: String(doc.get('summary') ?? ''),
      status: (doc.get('status') ?? 'draft') as 'draft' | 'review' | 'published',
      reviewNote: typeof doc.get('reviewNote') === 'string' ? doc.get('reviewNote') : null,
      updatedAt: doc.get('updatedAt')?.toDate ? doc.get('updatedAt').toDate().toISOString() : null,
    }))
    .sort((a, b) => {
      const aTime = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const bTime = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return bTime - aTime;
    });
}

const courseIdSchema = z
  .string()
  .min(1)
  .max(128)
  .regex(/^[^/]+$/);

export async function saveCourseOutline(courseId: string, input: unknown) {
  if (!courseIdSchema.safeParse(courseId).success) return fail('Choose a valid draft.');
  const parsed = courseOutlineSchema.safeParse(input);
  if (!parsed.success) return invalid(parsed.error);
  const user = await requireRole(['creator'], '/creator/drafts');
  try {
    const db = adminDb();
    const ref = db.collection('courses').doc(courseId);
    const result = await db.runTransaction(async (tx) => {
      const current = await tx.get(ref);
      if (
        !current.exists ||
        current.get('createdBy') !== user.uid ||
        current.get('status') !== 'draft'
      )
        return fail('Only your own drafts can be edited.');
      tx.update(ref, { outline: parsed.data, updatedAt: FieldValue.serverTimestamp() });
      return ok({ id: courseId });
    });
    if (result.ok) revalidatePath('/creator/drafts');
    return result;
  } catch {
    return fail('We could not save your draft. Please try again.');
  }
}

export async function submitCourseForReview(courseId: string) {
  if (!courseIdSchema.safeParse(courseId).success) return fail('Choose a valid draft.');
  const user = await requireRole(['creator'], '/creator/drafts');
  try {
    const db = adminDb();
    const ref = db.collection('courses').doc(courseId);
    const result = await db.runTransaction(async (tx) => {
      const current = await tx.get(ref);
      if (
        !current.exists ||
        current.get('createdBy') !== user.uid ||
        current.get('status') !== 'draft'
      )
        return fail('Only your own drafts can be submitted.');
      const title = String(current.get('title') ?? '').trim();
      const summary = String(current.get('summary') ?? '').trim();
      const outline = courseReadySchema.safeParse(readCourseOutline(current.get('outline')));
      if (title.length < 3 || summary.length < 20 || !outline.success)
        return fail('Add a title, summary and complete lessons before submitting.');
      tx.update(ref, {
        status: 'review',
        outline: outline.data,
        updatedAt: FieldValue.serverTimestamp(),
      });
      return ok();
    });
    if (result.ok) revalidatePath('/creator/drafts');
    return result;
  } catch {
    return fail('We could not submit your draft. Please try again.');
  }
}
