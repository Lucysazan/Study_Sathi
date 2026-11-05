import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import { beforeAll, afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({
  requireRole: async (allowed: string[]) => {
    if (!allowed.includes(role)) throw new Error('Not allowed');
    return { uid, role };
  },
}));
vi.mock('@/lib/admin/guard', () => ({
  requireAdmin: async () => {
    if (role !== 'admin') throw new Error('Not allowed');
    return { uid };
  },
}));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db }));
import { saveCourseOutline, submitCourseForReview } from '@/app/creator/drafts/actions';
import { updateCourseReviewStatus, getCourseForAdmin } from '@/lib/admin/courses';
import { courseChecklist } from '@/lib/course/metadata';
import { readCourseOutline } from '@/lib/course/outline';

let app: App;
let db: Firestore;
let uid: string;
let role: string;
let id: string;
const details = {
  title: 'Explore science',
  category: 'science',
  summary: 'Explore everyday science with simple activities.',
  ageRange: '12-15',
  budget: '2 hours',
  language: 'Nepali',
  coverImageUrl: 'https://example.com/cover.png',
  coverAlt: 'Leaves under a microscope',
};
const outline = {
  modules: [
    {
      id: 'part',
      title: 'Part one',
      lessons: [
        {
          id: 'intro',
          title: 'Introduction',
          kind: 'text',
          duration: '5 min',
          content: 'A short introduction to science.',
        },
      ],
    },
  ],
};
beforeAll(() => {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST ?? ''))
    throw new Error('Local emulator required.');
  app = initializeApp({ projectId: 'demo-studysathi-review-tests' }, randomUUID());
  db = getFirestore(app);
});
afterAll(async () => {
  if (app) await deleteApp(app);
});
beforeEach(async () => {
  id = randomUUID();
  uid = 'creator';
  role = 'creator';
  await db
    .collection('courses')
    .doc(id)
    .set({ ...details, createdBy: uid, status: 'draft', outline });
});
describe('metadata and publication boundary', () => {
  it('saves current details, submits for review and publishes the same ready snapshot', async () => {
    expect(
      (
        await saveCourseOutline(id, outline, {
          ...details,
          language: 'English',
          status: 'published',
          createdBy: 'attacker',
        })
      ).ok,
    ).toBe(true);
    expect((await submitCourseForReview(id)).ok).toBe(true);
    role = 'admin';
    uid = 'admin';
    const preview = await getCourseForAdmin(id);
    expect(preview).toMatchObject({ language: 'English', checklist: { ready: true } });
    await updateCourseReviewStatus(id, 'published', uid);
    const saved = await db.collection('courses').doc(id).get();
    expect(saved.get('status')).toBe('published');
    expect(saved.get('createdBy')).toBe('creator');
  });
  it('rejects incomplete metadata at both submission and publishing', async () => {
    await db
      .collection('courses')
      .doc(id)
      .update({ language: '', coverImageUrl: '', coverAlt: '' });
    expect((await submitCourseForReview(id)).ok).toBe(false);
    role = 'admin';
    uid = 'admin';
    await expect(updateCourseReviewStatus(id, 'published', uid)).rejects.toThrow();
    expect((await db.collection('courses').doc(id).get()).get('status')).toBe('draft');
  });
  it('blocks another creator from editing metadata', async () => {
    uid = 'another-creator';
    expect((await saveCourseOutline(id, outline, details)).ok).toBe(false);
    expect((await db.collection('courses').doc(id).get()).get('createdBy')).toBe('creator');
  });
  it('never publishes invalid metadata when an edit races with publishing', async () => {
    const edit = saveCourseOutline(id, outline, {
      ...details,
      language: '',
      coverImageUrl: '',
      coverAlt: '',
    });
    role = 'admin';
    uid = 'admin';
    await Promise.allSettled([edit, updateCourseReviewStatus(id, 'published', uid)]);
    const saved = await db.collection('courses').doc(id).get();
    if (saved.get('status') === 'published')
      expect(courseChecklist(saved.data(), readCourseOutline(saved.get('outline'))).ready).toBe(
        true,
      );
    else expect(saved.get('status')).toBe('draft');
  });
});
