import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/auth/session', () => ({
  requireRole: async (allowed: string[]) => {
    if (!allowed.includes(role)) throw new Error('Not allowed');
    return { uid: 'parent', role };
  },
}));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db }));
import { getChildProgress } from '@/lib/parent/progress';
import { getCourseRecommendations } from '@/lib/course/recommendations';
let app: App;
let db: Firestore;
let role: string;
beforeEach(async () => {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST ?? ''))
    throw new Error('Local emulator required');
  app = initializeApp({ projectId: `demo-family-${randomUUID().slice(0, 8)}` }, randomUUID());
  db = getFirestore(app);
  role = 'parent';
  await db
    .collection('users')
    .doc('child')
    .set({ parentUid: 'parent', role: 'student', nickname: 'Leaf', currentCourseId: 'course' });
  await db.collection('courses').doc('course').set({ title: 'Published', status: 'published' });
  await db.collection('courses').doc('draft').set({ title: 'Private draft', status: 'draft' });
});
afterEach(async () => {
  await deleteApp(app);
});

it('requires parent role and current ownership', async () => {
  expect(await getChildProgress('child')).toMatchObject({
    nickname: 'Leaf',
    weeklyLessons: 0,
    course: null,
  });
  await db.collection('users').doc('child').update({ parentUid: 'someone-else' });
  expect(await getChildProgress('child')).toBeNull();
  role = 'student';
  await expect(getChildProgress('child')).rejects.toThrow('Not allowed');
});

it('shows academic summaries only to the currently linked parent', async () => {
  await db
    .collection('users')
    .doc('child')
    .collection('privateData')
    .doc('academic')
    .set({
      results: {
        sets_check: {
          chapterId: 'sets',
          phase: 'check',
          correct: 3,
          total: 4,
          skills: [{ id: 'membership', correct: 1, total: 2 }],
          checkedAt: '2026-11-06T06:00:00.000Z',
          reviewAt: '2026-11-07T06:00:00.000Z',
        },
      },
    });
  expect((await getChildProgress('child'))?.academic?.[0]?.correct).toBe(3);
  await db.collection('users').doc('child').update({ parentUid: 'other' });
  expect(await getChildProgress('child')).toBeNull();
});

it('hides course titles without matching enrollment or while unpublished', async () => {
  const enrollment = db.collection('courseEnrollments').doc('child_course');
  await enrollment.set({ userId: 'other', courseId: 'course' });
  expect((await getChildProgress('child'))?.course).toBeNull();
  await enrollment.update({ userId: 'child' });
  expect((await getChildProgress('child'))?.course?.title).toBe('Published');
  await db.collection('courses').doc('course').update({ status: 'draft' });
  expect((await getChildProgress('child'))?.course).toBeNull();
});

it('recommends only published unenrolled courses to students', async () => {
  await expect(getCourseRecommendations()).rejects.toThrow('Not allowed');
  role = 'student';
  expect((await getCourseRecommendations()).map((course) => course.id)).toEqual(['course']);
  await db
    .collection('courseEnrollments')
    .doc('parent_course')
    .set({ userId: 'parent', courseId: 'course' });
  expect(await getCourseRecommendations()).toEqual([]);
});
