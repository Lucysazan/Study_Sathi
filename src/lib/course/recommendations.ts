import 'server-only';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';

/** A small deterministic discovery list, not AI personalization or a claim of suitability. */
export async function getCourseRecommendations() {
  const user = await requireRole(['student'], '/learn');
  const db = adminDb();
  const candidates = await db
    .collection('courses')
    .where('status', '==', 'published')
    .select('title', 'summary', 'category', 'language', 'coverImageUrl', 'coverAlt')
    .limit(6)
    .get();
  if (candidates.empty) return [];
  const enrollments = await db.getAll(
    ...candidates.docs.map((course) =>
      db.collection('courseEnrollments').doc(`${user.uid}_${course.id}`),
    ),
  );
  return candidates.docs
    .filter((_, index) => !enrollments[index]?.exists)
    .slice(0, 3)
    .map((course) => ({
      id: course.id,
      title: String(course.get('title') ?? 'Untitled course'),
      summary: String(course.get('summary') ?? ''),
      category: String(course.get('category') ?? ''),
      language: String(course.get('language') ?? ''),
      coverImageUrl: String(course.get('coverImageUrl') ?? ''),
      coverAlt: String(course.get('coverAlt') ?? ''),
    }));
}
