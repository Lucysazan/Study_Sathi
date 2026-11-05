import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { courseChecklist } from '@/lib/course/metadata';
import type { CourseOutline } from '@/lib/course/draft';
import { readCourseOutline } from '@/lib/course/outline';
import { adminDb } from '@/lib/firebase/admin';
import { writeAudit } from './audit';
import { requireAdmin } from './guard';

export type CourseReviewItem = {
  id: string;
  title: string;
  summary: string;
  status: 'draft' | 'review' | 'published';
  creatorUid: string | null;
  creatorName: string | null;
  updatedAt: string | null;
};

export type CourseReviewDetail = CourseReviewItem & {
  outline: CourseOutline | null;
  reviewNote: string | null;
  language: string;
  coverImageUrl: string;
  coverAlt: string;
  checklist: ReturnType<typeof courseChecklist>;
};

export async function listCoursesForReview(): Promise<CourseReviewItem[]> {
  await requireAdmin();
  const snap = await adminDb()
    .collection('courses')
    .where('status', 'in', ['draft', 'review'])
    .orderBy('updatedAt', 'desc')
    .get();

  return snap.docs.map((doc) => ({
    id: doc.id,
    title: String(doc.get('title') ?? 'Untitled course'),
    summary: String(doc.get('summary') ?? ''),
    status: (doc.get('status') ?? 'draft') as 'draft' | 'review' | 'published',
    creatorUid: typeof doc.get('createdBy') === 'string' ? doc.get('createdBy') : null,
    creatorName: typeof doc.get('creatorName') === 'string' ? doc.get('creatorName') : null,
    updatedAt: doc.get('updatedAt')?.toDate ? doc.get('updatedAt').toDate().toISOString() : null,
  }));
}

export async function getCourseForAdmin(id: string): Promise<CourseReviewDetail | null> {
  await requireAdmin();
  const snap = await adminDb().collection('courses').doc(id).get();
  if (!snap.exists) return null;

  const outline = snap.get('outline');
  return {
    id: snap.id,
    title: String(snap.get('title') ?? 'Untitled course'),
    summary: String(snap.get('summary') ?? ''),
    status: (snap.get('status') ?? 'draft') as 'draft' | 'review' | 'published',
    creatorUid: typeof snap.get('createdBy') === 'string' ? snap.get('createdBy') : null,
    creatorName: typeof snap.get('creatorName') === 'string' ? snap.get('creatorName') : null,
    updatedAt: snap.get('updatedAt')?.toDate ? snap.get('updatedAt').toDate().toISOString() : null,
    outline: readCourseOutline(outline),
    reviewNote: typeof snap.get('reviewNote') === 'string' ? snap.get('reviewNote') : null,
    language: typeof snap.get('language') === 'string' ? snap.get('language') : '',
    coverImageUrl: typeof snap.get('coverImageUrl') === 'string' ? snap.get('coverImageUrl') : '',
    coverAlt: typeof snap.get('coverAlt') === 'string' ? snap.get('coverAlt') : '',
    checklist: courseChecklist(snap.data(), readCourseOutline(outline)),
  };
}

export async function countPendingCourseReviews(): Promise<number> {
  await requireAdmin();
  const snap = await adminDb()
    .collection('courses')
    .where('status', 'in', ['draft', 'review'])
    .count()
    .get();
  return snap.data().count;
}

export async function updateCourseReviewStatus(
  courseId: string,
  status: 'draft' | 'review' | 'published',
  actorUid: string,
): Promise<void> {
  await requireAdmin();
  const db = adminDb();
  const ref = db.collection('courses').doc(courseId);
  await db.runTransaction(async (tx) => {
    const current = await tx.get(ref);
    if (!current.exists) throw new Error('Course not found.');
    if (
      status === 'published' &&
      !courseChecklist(current.data(), readCourseOutline(current.get('outline'))).ready
    )
      throw new Error(
        'Complete the course details, cover, language and lessons before publishing.',
      );
    tx.update(ref, { status, updatedAt: FieldValue.serverTimestamp() });
  });

  await writeAudit(adminDb(), {
    actorUid,
    action: 'course.review',
    target: courseId,
    summary: `Course marked as ${status}`,
  });
}

export async function setCourseReviewNote(
  courseId: string,
  note: string,
  actorUid: string,
): Promise<void> {
  await requireAdmin();
  const ref = adminDb().collection('courses').doc(courseId);
  if (!(await ref.get()).exists) throw new Error('Course not found.');

  await ref.set(
    {
      reviewNote: note,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  await writeAudit(adminDb(), {
    actorUid,
    action: 'course.review.note',
    target: courseId,
    summary: 'Added review notes',
  });
}
