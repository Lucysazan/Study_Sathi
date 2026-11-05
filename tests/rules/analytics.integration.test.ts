import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('@/lib/auth/session', () => ({
  requireRole: async (allowed: string[]) => {
    if (!allowed.includes(role)) throw new Error('Not allowed');
    return { uid, role, name: 'Creator' };
  },
}));
vi.mock('@/lib/admin/guard', () => ({
  requireAdmin: async () => {
    if (role !== 'admin') throw new Error('Not allowed');
    return { uid };
  },
}));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db }));

import {
  getCreatorAnalytics,
  getCreatorCourseAnalytics,
  getCreatorWorkspace,
  getAdminLearningMetrics,
} from '@/lib/analytics/courses';

let app: App;
let db: Firestore;
let uid: string;
let role: string;
const outline = {
  modules: [
    {
      id: 'part',
      title: 'A part',
      lessons: [
        {
          id: 'intro',
          title: 'Introduction',
          kind: 'text',
          duration: '2 min',
          content: 'A short introduction to this topic.',
        },
        {
          id: 'practice',
          title: 'Practice',
          kind: 'text',
          duration: '2 min',
          content: 'Try practising what you have learned.',
        },
      ],
    },
  ],
};
beforeEach(async () => {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST ?? ''))
    throw new Error('Local emulator required.');
  // Each case has its own disposable demo database; never import live Firebase config.
  app = initializeApp({ projectId: `demo-analytics-${randomUUID().slice(0, 8)}` }, randomUUID());
  db = getFirestore(app);
  uid = 'creator-a';
  role = 'creator';
  const batch = db.batch();
  batch.set(db.collection('courses').doc('a-sparse'), {
    createdBy: 'creator-a',
    title: 'My course',
    status: 'published',
    stats: { views: 10, lessonCompletions: { intro: 1 } },
    outline,
  });
  batch.set(db.collection('courses').doc('b-sparse'), {
    createdBy: 'creator-a',
    title: 'My draft',
    status: 'draft',
    stats: { enrollments: 4, completions: 1, analyticsEnrollments: 4, analyticsCompletions: 1 },
  });
  batch.set(db.collection('courses').doc('other'), {
    createdBy: 'creator-b',
    title: 'Private course',
    status: 'published',
    stats: { views: 90, enrollments: 9, completions: 9 },
    outline,
  });
  batch.set(db.collection('users').doc('student'), {
    nickname: 'Private nickname',
    privateNote: 'Private reflection',
  });
  await batch.commit();
});
afterEach(async () => {
  if (app) await deleteApp(app);
});

describe('guarded aggregate analytics', () => {
  it('scopes creator totals and independent sums to owned sparse documents', async () => {
    const data = await getCreatorAnalytics();
    expect(data.summary).toMatchObject({
      courses: 2,
      draft: 1,
      published: 1,
      views: 10,
      enrollments: 4,
      completions: 1,
      completionRate: 25,
    });
    expect(data.courses.map((course) => course.id)).toEqual(['a-sparse', 'b-sparse']);
    expect(JSON.stringify(data)).not.toContain('Private course');
    expect(await getCreatorWorkspace()).toMatchObject({ name: 'Creator', draft: 1, published: 1 });
  });
  it('rejects unowned/invalid details and returns only lesson aggregates for an owner', async () => {
    expect(await getCreatorCourseAnalytics('other')).toBeNull();
    expect(await getCreatorCourseAnalytics('../bad')).toBeNull();
    const data = await getCreatorCourseAnalytics('a-sparse');
    expect(data?.lessons).toEqual([
      { title: 'Introduction', completions: 1, width: 100 },
      { title: 'Practice', completions: 0, width: 0 },
    ]);
    expect(JSON.stringify(data)).not.toContain('Private reflection');
    expect(JSON.stringify(data)).not.toContain('student');
  });
  it('checks roles for every analytics entry point and allows only admins global totals', async () => {
    role = 'student';
    await expect(getCreatorAnalytics()).rejects.toThrow('Not allowed');
    await expect(getCreatorCourseAnalytics('a-sparse')).rejects.toThrow('Not allowed');
    await expect(getCreatorWorkspace()).rejects.toThrow('Not allowed');
    await expect(getAdminLearningMetrics()).rejects.toThrow('Not allowed');
    role = 'admin';
    expect(await getAdminLearningMetrics()).toMatchObject({
      courses: 3,
      published: 2,
      views: 100,
      enrollments: 13,
      completions: 10,
    });
  });
  it('paginates without leaking another creator and keeps totals independent of the page', async () => {
    const batch = db.batch();
    for (let index = 0; index < 25; index++)
      batch.set(db.collection('courses').doc(`z-${String(index).padStart(2, '0')}`), {
        createdBy: uid,
        title: 'New course',
        status: 'review',
      });
    await batch.commit();
    const first = await getCreatorAnalytics();
    expect(first.courses).toHaveLength(20);
    expect(first.summary.courses).toBe(27);
    const second = await getCreatorAnalytics(first.next ?? undefined);
    expect(second.courses).toHaveLength(7);
    expect(second.next).toBeNull();
    expect(new Set([...first.courses, ...second.courses].map((course) => course.id)).size).toBe(27);
    expect(second.summary.views).toBe(10);
  });
  it('returns honest empty metrics and validates cursors', async () => {
    uid = 'creator-empty';
    expect(await getCreatorAnalytics()).toMatchObject({
      courses: [],
      next: null,
      summary: { courses: 0, views: 0, completionRate: null },
    });
    await expect(getCreatorAnalytics('../invalid')).rejects.toThrow();
  });
});
