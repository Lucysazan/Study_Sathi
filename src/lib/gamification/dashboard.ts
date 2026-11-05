import 'server-only';
import { loadStudentAccount } from './account';
import { adminDb } from '@/lib/firebase/admin';
import { levelInfo, visibleActivity } from './stats';
import { summarizeCourseProgress } from '@/lib/course/progress-summary';
import { readCourseOutline } from '@/lib/course/outline';

export async function getStudentDashboard() {
  const { user, account, stats } = await loadStudentAccount();
  const db = adminDb();
  const level = levelInfo(stats.xp);
  const { streak } = visibleActivity(stats, new Date());
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
      continuing = summarizeCourseProgress(
        courseId,
        String(course.get('title') ?? 'Your course'),
        {
          outline: readCourseOutline(course.get('outline')) ?? { modules: [] },
        },
        progress.get('completedLessons'),
      );
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
