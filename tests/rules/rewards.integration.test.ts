import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({ requireRole: async () => ({ uid, role: 'student' }) }));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db }));

import { completeLesson } from '@/app/learn/courses/actions';
import { getStudentDashboard } from '@/lib/gamification/dashboard';
import { submitQuiz } from '@/app/learn/courses/quiz';

let app: App;
let db: Firestore;
let uid: string;
let courseId: string;

beforeAll(() => {
  const host = process.env.FIRESTORE_EMULATOR_HOST ?? '';
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host))
    throw new Error('Reward integration tests require a local Firestore emulator.');
  // Dedicated disposable demo project; this code must never use the app's live config.
  app = initializeApp({ projectId: 'demo-studysathi-rewards-tests' }, `rewards-${randomUUID()}`);
  db = getFirestore(app);
});
afterAll(async () => {
  if (app) await deleteApp(app);
});
beforeEach(async () => {
  uid = `learner-${randomUUID()}`;
  courseId = `course-${randomUUID()}`;
  const batch = db.batch();
  batch.set(db.collection('users').doc(uid), { role: 'student', status: 'active', stats: {} });
  batch.set(db.collection('courses').doc(courseId), {
    status: 'published',
    category: 'science',
    outline: {
      modules: [
        {
          id: 'part',
          title: 'Part one',
          lessons: [
            {
              id: 'one',
              title: 'First lesson',
              kind: 'text',
              duration: '2 min',
              content: 'Read this first explanation.',
              blocks: [
                {
                  id: 'check',
                  title: 'Quick check',
                  kind: 'quiz',
                  duration: '2 min',
                  question: 'Which answer is correct?',
                  options: ['Right', 'Wrong'],
                  correctAnswer: 'Right',
                },
              ],
            },
            {
              id: 'two',
              title: 'Second lesson',
              kind: 'text',
              duration: '2 min',
              content: 'Read this second explanation.',
            },
          ],
        },
      ],
    },
  });
  batch.set(db.collection('courseEnrollments').doc(`${uid}_${courseId}`), {
    userId: uid,
    courseId,
  });
  await batch.commit();
});
function input(lessonId: string) {
  const form = new FormData();
  form.set('courseId', courseId);
  form.set('lessonId', lessonId);
  return form;
}

describe('reward and completion transactions against Firestore', () => {
  it('grades a stored child quiz and awards its first successful pass only once across tabs', async () => {
    const answer = { courseId, lessonId: 'one', quizId: 'check', answer: 'Right', xp: 999999 };
    const wrong = await submitQuiz({ ...answer, answer: 'Wrong' });
    expect(wrong).toMatchObject({ ok: true, data: { correct: false, xpAwarded: 0 } });
    const results = await Promise.all([submitQuiz(answer), submitQuiz(answer)]);
    expect(results.every((result) => result.ok && result.data.correct)).toBe(true);
    const account = await db.collection('users').doc(uid).get();
    expect(account.get('stats.xp')).toBe(5);
    expect(account.get('stats.badgeIds')).toContain('sharp-thinker');
    expect(account.get('stats.lessonCount')).toBe(0);
    expect((await account.ref.collection('xpEvents').get()).size).toBe(1);
  });
  it('rejects quiz IDs from outside the selected lesson and unrecognized answers', async () => {
    const answer = { courseId, lessonId: 'two', quizId: 'check', answer: 'Right' };
    expect((await submitQuiz(answer)).ok).toBe(false);
    expect((await submitQuiz({ ...answer, lessonId: 'one', answer: 'Injected answer' })).ok).toBe(
      false,
    );
    expect((await db.collection('users').doc(uid).collection('xpEvents').get()).empty).toBe(true);
  });
  it('requires enrollment and a currently published course for quiz rewards', async () => {
    const answer = { courseId, lessonId: 'one', quizId: 'check', answer: 'Right' };
    const enrollment = db.collection('courseEnrollments').doc(`${uid}_${courseId}`);
    await enrollment.delete();
    expect((await submitQuiz(answer)).ok).toBe(false);
    await enrollment.set({ userId: uid, courseId });
    await db.collection('courses').doc(courseId).update({ status: 'draft' });
    expect((await submitQuiz(answer)).ok).toBe(false);
  });
  it('grades legacy single-activity quizzes without requiring a block migration', async () => {
    await db
      .collection('courses')
      .doc(courseId)
      .update({
        outline: {
          modules: [
            {
              id: 'part',
              title: 'Part one',
              lessons: [
                {
                  id: 'legacy',
                  title: 'A quiz',
                  duration: '2 min',
                  kind: 'quiz',
                  question: 'Choose the correct answer.',
                  options: ['Yes', 'No'],
                  correctAnswer: 'Yes',
                },
              ],
            },
          ],
        },
      });
    expect(
      await submitQuiz({ courseId, lessonId: 'legacy', quizId: 'legacy', answer: 'Yes' }),
    ).toMatchObject({ ok: true, data: { correct: true, xpAwarded: 5 } });
  });
  it('awards one event when two tabs complete the same lesson together', async () => {
    const results = await Promise.all([completeLesson(input('one')), completeLesson(input('one'))]);
    expect(results.every((result) => result.ok)).toBe(true);
    const user = await db.collection('users').doc(uid).get();
    const events = await user.ref.collection('xpEvents').get();
    expect(user.get('stats.xp')).toBe(15);
    expect(user.get('stats.lessonCount')).toBe(1);
    expect(events.size).toBe(1);
  });
  it('preserves both simultaneous completions and gives daily/course bonuses once', async () => {
    const results = await Promise.all([completeLesson(input('one')), completeLesson(input('two'))]);
    expect(results.every((result) => result.ok)).toBe(true);
    const user = await db.collection('users').doc(uid).get();
    const progress = await db.collection('courseProgress').doc(`${uid}_${courseId}`).get();
    const course = await db.collection('courses').doc(courseId).get();
    expect(user.get('stats.xp')).toBe(75);
    expect(user.get('stats.courseCount')).toBe(1);
    expect(new Set(progress.get('completedLessons'))).toEqual(new Set(['one', 'two']));
    expect(course.get('stats.completions')).toBe(1);
    await completeLesson(input('two'));
    expect((await user.ref.get()).get('stats.xp')).toBe(75);
    const dashboard = await getStudentDashboard();
    expect(dashboard.stats.xp).toBe(75);
    expect(dashboard.continuing).toMatchObject({ complete: true, done: 2, total: 2 });
  });
  it('does not give retroactive rewards for previously completed lessons', async () => {
    await db
      .collection('courseProgress')
      .doc(`${uid}_${courseId}`)
      .set({ userId: uid, courseId, completedLessons: ['one'] });
    expect((await completeLesson(input('one'))).ok).toBe(true);
    expect((await db.collection('users').doc(uid).collection('xpEvents').get()).empty).toBe(true);
  });
});
