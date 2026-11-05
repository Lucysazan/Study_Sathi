import 'server-only';
import { AggregateField, FieldPath, type Query } from 'firebase-admin/firestore';
import { z } from 'zod';
import { adminDb } from '@/lib/firebase/admin';
import { requireRole } from '@/lib/auth/session';
import { requireAdmin } from '@/lib/admin/guard';
import { readCourseOutline } from '@/lib/course/outline';
import { getCourseModules } from '@/lib/course/learning';
import { courseMetrics, lessonMetrics, recordedCount } from './metrics';

export const courseAnalyticsId = z
  .string()
  .min(1)
  .max(128)
  .refine((id) => !id.includes('/') && id !== '.' && id !== '..');
const PAGE_SIZE = 20;

async function totals(query: Query) {
  // Separate sums preserve counters on legacy documents with sparse stats.
  const [
    courses,
    draft,
    review,
    published,
    views,
    enrollments,
    completions,
    analyticsEnrollments,
    analyticsCompletions,
  ] = await Promise.all([
    query.count().get(),
    query.where('status', '==', 'draft').count().get(),
    query.where('status', '==', 'review').count().get(),
    query.where('status', '==', 'published').count().get(),
    ...['views', 'enrollments', 'completions', 'analyticsEnrollments', 'analyticsCompletions'].map(
      (field) => query.aggregate({ total: AggregateField.sum(`stats.${field}`) }).get(),
    ),
  ]);
  return {
    courses: recordedCount(courses?.data().count),
    draft: recordedCount(draft?.data().count),
    review: recordedCount(review?.data().count),
    published: recordedCount(published?.data().count),
    ...courseMetrics({
      views: views?.data().total,
      enrollments: enrollments?.data().total,
      completions: completions?.data().total,
      analyticsEnrollments: analyticsEnrollments?.data().total,
      analyticsCompletions: analyticsCompletions?.data().total,
    }),
  };
}

export async function getCreatorAnalytics(after?: string) {
  const user = await requireRole(['creator'], '/creator/analytics');
  const cursor = after === undefined ? undefined : courseAnalyticsId.parse(after);
  const query = adminDb().collection('courses').where('createdBy', '==', user.uid);
  let list = query
    .orderBy(FieldPath.documentId())
    .select('title', 'status', 'stats')
    .limit(PAGE_SIZE + 1);
  if (cursor) list = list.startAfter(cursor);
  const [summary, page] = await Promise.all([totals(query), list.get()]);
  const selected = page.docs.slice(0, PAGE_SIZE);
  return {
    summary,
    courses: selected.map((course) => ({
      id: course.id,
      title: String(course.get('title') ?? 'Untitled course'),
      status: String(course.get('status') ?? 'draft'),
      ...courseMetrics(course.get('stats')),
    })),
    next: page.docs.length > PAGE_SIZE ? (selected.at(-1)?.id ?? null) : null,
  };
}

export async function getCreatorCourseAnalytics(id: string) {
  const user = await requireRole(['creator'], '/creator/analytics');
  if (!courseAnalyticsId.safeParse(id).success) return null;
  const course = await adminDb().collection('courses').doc(id).get();
  if (!course.exists || course.get('createdBy') !== user.uid) return null;
  const lessons = getCourseModules({
    outline: readCourseOutline(course.get('outline')) ?? undefined,
  }).flatMap((part) => part.lessons ?? []);
  return {
    title: String(course.get('title') ?? 'Untitled course'),
    status: String(course.get('status') ?? 'draft'),
    metrics: courseMetrics(course.get('stats')),
    lessons: lessonMetrics(lessons, course.get('stats')),
  };
}

export async function getAdminLearningMetrics() {
  await requireAdmin();
  return totals(adminDb().collection('courses'));
}

export async function getCreatorWorkspace() {
  const user = await requireRole(['creator'], '/creator');
  const query = adminDb().collection('courses').where('createdBy', '==', user.uid);
  const [draft, review, published] = await Promise.all(
    ['draft', 'review', 'published'].map((status) =>
      query.where('status', '==', status).count().get(),
    ),
  );
  return {
    name: user.name,
    draft: recordedCount(draft?.data().count),
    review: recordedCount(review?.data().count),
    published: recordedCount(published?.data().count),
  };
}
