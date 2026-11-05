'use server';

import { createHash } from 'node:crypto';
import { cookies } from 'next/headers';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { z } from 'zod';
import { fail, ok, type ActionResult } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { getServerEnv } from '@/lib/env/server';

export async function recordCourseView(courseId: string): Promise<ActionResult> {
  if (
    !z
      .string()
      .min(1)
      .max(128)
      .regex(/^[^/]+$/)
      .safeParse(courseId).success
  )
    return fail('Invalid course.');
  await requireRole(['student'], '/learn/courses');
  const session = (await cookies()).get(getServerEnv().sessionCookieName)?.value;
  if (!session) return fail('Please sign in.');
  // Only a one-way digest is stored; repeated tabs and requests share the same event.
  const eventId = createHash('sha256').update(session).update('\0').update(courseId).digest('hex');
  try {
    const db = adminDb();
    await db.runTransaction(async (tx) => {
      const courseRef = db.collection('courses').doc(courseId);
      const viewRef = db.collection('courseViews').doc(eventId);
      const course = await tx.get(courseRef);
      const view = await tx.get(viewRef);
      if (!course.exists || course.get('status') !== 'published' || view.exists) return;
      tx.create(viewRef, { courseId, expiresAt: Timestamp.fromMillis(Date.now() + 8 * 86400000) });
      tx.update(courseRef, { 'stats.views': FieldValue.increment(1) });
    });
    return ok();
  } catch {
    return fail('View count is temporarily unavailable.');
  }
}
