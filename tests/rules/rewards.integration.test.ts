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
