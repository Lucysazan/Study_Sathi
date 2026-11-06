import 'server-only';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { levelInfo, statsSchema, visibleActivity } from '@/lib/gamification/stats';
import { summarizeCourseProgress } from '@/lib/course/progress-summary';
import { readCourseOutline } from '@/lib/course/outline';
import { readAcademicProgress } from '@/lib/academic/progress.server';

export async function getChildProgress(childUid: string) {
  const parent = await requireRole(['parent'], '/parent');
  if (!childUid || childUid.length > 128 || childUid.includes('/')) return null;
  const db = adminDb();
  const child = await db.collection('users').doc(childUid).get();
  if (!child.exists || child.get('role') !== 'student' || child.get('parentUid') !== parent.uid)
    return null;
  const academic = await readAcademicProgress(childUid)
    .then((results) => Object.values(results))
    .catch(() => null);
  const stats = statsSchema.parse(child.get('stats') ?? {});
  const activity = visibleActivity(stats, new Date());
  const courseId: unknown = child.get('currentCourseId');
  let course: ReturnType<typeof summarizeCourseProgress> | null = null;
  if (
    typeof courseId === 'string' &&
    courseId.length > 0 &&
    courseId.length <= 128 &&
    !courseId.includes('/')
  ) {
    const enrollment = await db
      .collection('courseEnrollments')
      .doc(`${childUid}_${courseId}`)
      .get();
    if (
      enrollment.exists &&
      enrollment.get('userId') === childUid &&
      enrollment.get('courseId') === courseId
    ) {
      const stored = await db.collection('courses').doc(courseId).get();
      if (stored.get('status') === 'published') {
        const progress = await db.collection('courseProgress').doc(`${childUid}_${courseId}`).get();
        course = summarizeCourseProgress(
          courseId,
          String(stored.get('title') ?? 'Course'),
          {
            outline: readCourseOutline(stored.get('outline')) ?? { modules: [] },
          },
          progress.get('completedLessons'),
        );
      }
    }
  }
  return {
    nickname: String(child.get('nickname') ?? 'Learner'),
    xp: stats.xp,
    level: levelInfo(stats.xp).level,
    lessonCount: stats.lessonCount,
    courseCount: stats.courseCount,
    ...activity,
    course,
    academic,
  };
}
