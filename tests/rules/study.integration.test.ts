import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { beforeAll, afterAll, beforeEach, it, expect, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db }));
import { saveStudyProgress, readStudyProgress } from '@/lib/study/progress.server';
import { gradeStudy } from '@/lib/study/checks';
let app: App, db: Firestore, uid: string;
const perfect = gradeStudy({
  activityId: 'fractions',
  expectedUid: null,
  answers: { f1: 0, f2: 1, f3: 2 },
});
beforeAll(() => {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || ''))
    throw Error('Local emulator required');
  app = initializeApp({ projectId: 'demo-studysathi-study-tests' }, randomUUID());
  db = getFirestore(app);
});
afterAll(async () => {
  if (app) await deleteApp(app);
});
beforeEach(async () => {
  uid = randomUUID();
  await db
    .collection('users')
    .doc(uid)
    .set({
      role: 'student',
      status: 'active',
      stats: {},
      currentCourseId: 'existing-course',
      leaderboardOptIn: true,
    });
});
it('concurrent perfect checks award once, keep current course and sync consented leaderboard', async () => {
  const rewards = await Promise.all([
    saveStudyProgress(uid, perfect),
    saveStudyProgress(uid, perfect),
  ]);
  expect(rewards.reduce((n, r) => n + r.xpAwarded, 0)).toBe(15);
  const account = await db.collection('users').doc(uid).get();
  expect(account.get('stats.xp')).toBe(15);
  expect(account.get('currentCourseId')).toBe('existing-course');
  expect(account.get('stats.lessonCount')).toBe(1);
  expect((await account.ref.collection('xpEvents').get()).size).toBe(1);
  expect(
    (await db.collection('leaderboards').doc('all-time').collection('entries').doc(uid).get()).get(
      'xp',
    ),
  ).toBe(15);
  expect((await readStudyProgress(uid)).fractions).toMatchObject({
    best: 3,
    attempts: 2,
    completedAt: expect.any(String),
  });
});
it('lower retry preserves best and completion, gives no additional reward', async () => {
  await saveStudyProgress(uid, perfect);
  const lower = gradeStudy({
    activityId: 'fractions',
    expectedUid: null,
    answers: { f1: 1, f2: 0, f3: 0 },
  });
  expect(await saveStudyProgress(uid, lower)).toMatchObject({ xpAwarded: 0 });
  expect((await readStudyProgress(uid)).fractions).toMatchObject({
    best: 3,
    last: 0,
    attempts: 2,
    completedAt: expect.any(String),
  });
});
it('incomplete check saves feedback without XP or leaderboard opt-in', async () => {
  await db.collection('users').doc(uid).update({ leaderboardOptIn: false });
  const lower = gradeStudy({
    activityId: 'fractions',
    expectedUid: null,
    answers: { f1: 1, f2: 0, f3: 0 },
  });
  await saveStudyProgress(uid, lower);
  expect((await db.collection('users').doc(uid).get()).get('stats.xp')).toBeUndefined();
  await saveStudyProgress(uid, perfect);
  expect(
    (await db.collection('leaderboards').doc('all-time').collection('entries').doc(uid).get())
      .exists,
  ).toBe(false);
});
it('disabled or nonstudent accounts cannot save progress or rewards', async () => {
  await db.collection('users').doc(uid).update({ status: 'disabled' });
  await expect(saveStudyProgress(uid, perfect)).rejects.toThrow();
  expect(await readStudyProgress(uid)).toEqual({});
});
