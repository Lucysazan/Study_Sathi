import 'server-only';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { learningDay, levelInfo, statsSchema } from './stats';
import { getCourseModules, getCourseLessonPath } from '@/lib/course/learning';
import { readCourseOutline } from '@/lib/course/outline';

export async function getStudentDashboard() {
  const user = await requireRole(['student'], '/learn');
  const db = adminDb();
  const account = await db.collection('users').doc(user.uid).get();
  const stats = statsSchema.parse(account.get('stats') ?? {});
  const level = levelInfo(stats.xp);
  const now = new Date();
  const recent = [learningDay(now), learningDay(new Date(now.getTime() - 86400000))];
  const streak =
    stats.lastActiveDate && recent.includes(stats.lastActiveDate) ? stats.streakDays : 0;
  let courseId: unknown = account.get('currentCourseId');
  if (typeof courseId !== 'string') {
    const enrollment = await db
      .collection('courseEnrollments')
      .where('userId', '==', user.uid)
      .limit(1)
      .get();
    courseId = enrollment.docs[0]?.get('courseId');
  }
  let continuing: {
    title: string;
    path: string;
    done: number;
    total: number;
    complete: boolean;
  } | null = null;
  if (
    typeof courseId === 'string' &&
    courseId.length > 0 &&
    courseId.length <= 128 &&
    !courseId.includes('/')
  ) {
    const [course, progress, enrollment] = await Promise.all([
      db.collection('courses').doc(courseId).get(),
      db.collection('courseProgress').doc(`${user.uid}_${courseId}`).get(),
      db.collection('courseEnrollments').doc(`${user.uid}_${courseId}`).get(),
    ]);
    if (course.get('status') === 'published' && enrollment.exists) {
      const lessons = getCourseModules({
        outline: readCourseOutline(course.get('outline')) ?? { modules: [] },
      }).flatMap((part) => part.lessons ?? []);
      const saved: unknown = progress.get('completedLessons');
      const completed = new Set(Array.isArray(saved) ? saved : []);
      const next = lessons.find((lesson) => lesson.id && !completed.has(lesson.id));
      continuing = {
        title: String(course.get('title') ?? 'Your course'),
        path: next?.id ? getCourseLessonPath(courseId, next.id) : `/learn/courses/${courseId}`,
        done: lessons.filter((lesson) => completed.has(lesson.id)).length,
        total: lessons.length,
        complete: !next,
      };
    }
  }
  return {
    stats,
    level,
    streak,
    continuing,
    nickname: String(account.get('nickname') ?? 'learner'),
    avatarId: String(account.get('avatarId') ?? 'leaf'),
  };
}
