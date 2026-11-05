import { randomUUID } from 'node:crypto';
import { initializeApp, deleteApp, type App } from 'firebase-admin/app';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';
import type { Auth } from 'firebase-admin/auth';
import { beforeAll, beforeEach, afterAll, describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('@/lib/auth/session', () => ({
  requireRole: async (allowed: string[]) => {
    if (!allowed.includes(role)) throw new Error('Wrong role');
    return { uid, role };
  },
}));
vi.mock('@/lib/admin/guard', () => ({ requireAdmin: async () => ({ uid: 'admin' }) }));
vi.mock('@/lib/firebase/admin', () => ({ adminDb: () => db, adminAuth: () => fakeAuth }));

import { setLeaderboardConsent } from '@/app/parent/leaderboard-actions';
import { getLeaderboard } from '@/lib/gamification/leaderboard';
import { awardLesson } from '@/lib/gamification/awards';
import { learningWeek } from '@/lib/gamification/stats';
import { setDisabled } from '@/lib/admin/users';
import { assignRole } from '@/lib/auth/accounts';

let app: App;
let db: Firestore;
let uid: string;
let role: string;
let parentId: string;
let childId: string;
const fakeAuth = {
  updateUser: async (id: string) => ({ uid: id, displayName: 'Learner' }),
  getUser: async (id: string) => ({
    uid: id,
    displayName: 'Learner',
    customClaims: { role: 'student' },
  }),
  setCustomUserClaims: vi.fn(),
  revokeRefreshTokens: vi.fn(),
};
beforeAll(() => {
  if (!/^(127\.0\.0\.1|localhost):\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST ?? ''))
    throw new Error('Local emulator required.');
  app = initializeApp({ projectId: 'demo-studysathi-leaderboard-tests' }, `board-${randomUUID()}`);
  db = getFirestore(app);
});
afterAll(async () => {
  if (app) await deleteApp(app);
});
beforeEach(async () => {
  parentId = `parent-${randomUUID()}`;
  childId = `child-${randomUUID()}`;
  uid = childId;
  role = 'student';
  // Clear only this disposable leaderboard project; user IDs are unique per test.
  for (const period of ['all-time', learningWeek(new Date())]) {
    const existing = await db.collection('leaderboards').doc(period).collection('entries').get();
    const batch = db.batch();
    existing.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
  await db.collection('users').doc(parentId).set({ role: 'parent' });
  await db
    .collection('users')
    .doc(childId)
    .set({
      role: 'student',
      parentUid: parentId,
      nickname: 'Leaf',
      avatarId: 'leaf',
      status: 'active',
      leaderboardOptIn: false,
      displayName: 'Private Full Name',
      privateNote: 'private learner note',
      stats: { xp: 30, weeklyXp: 15, weeklyPeriod: learningWeek(new Date()) },
    });
});
function form(consent: string, childUid = childId) {
  const data = new FormData();
  data.set('childUid', childUid);
  data.set('consent', consent);
  return data;
}
async function consent(value: 'on' | 'off') {
  uid = parentId;
  role = 'parent';
  const result = await setLeaderboardConsent(form(value));
  uid = childId;
  role = 'student';
  return result;
}
const entry = (period: string) =>
  db.collection('leaderboards').doc(period).collection('entries').doc(childId);

describe('parent consent and private leaderboard presentation', () => {
  it('defaults to private and rejects student or unrelated-parent consent changes', async () => {
    expect(await getLeaderboard('week')).toEqual({ optedIn: false, rows: [], you: null });
    await expect(setLeaderboardConsent(form('on'))).rejects.toThrow('Wrong role');
    uid = 'another-parent';
    role = 'parent';
    expect((await setLeaderboardConsent(form('on'))).ok).toBe(false);
    expect((await entry('all-time').get()).exists).toBe(false);
  });
  it('initializes both periods and exposes presentation fields only', async () => {
    expect((await consent('on')).ok).toBe(true);
    const weekly = await getLeaderboard('week');
    expect(weekly.you).toMatchObject({ rank: 1, nickname: 'Leaf', xp: 15 });
    expect((await getLeaderboard('all-time')).you?.xp).toBe(30);
    for (const secret of [
      childId,
      parentId,
      'Private Full Name',
      'private learner note',
      'parentUid',
    ])
      expect(JSON.stringify(weekly)).not.toContain(secret);
  });
  it('removes both current entries on opt-out and never revives them through an in-flight reward', async () => {
    await consent('on');
    uid = parentId;
    role = 'parent';
    const [result] = await Promise.all([
      setLeaderboardConsent(form('off')),
      db.runTransaction((tx) =>
        awardLesson(tx, db, childId, {
          courseId: 'course',
          lessonId: 'lesson',
          now: new Date(),
          category: 'science',
          completedCourse: false,
        }),
      ),
    ]);
    expect(result.ok).toBe(true);
    expect((await entry('all-time').get()).exists).toBe(false);
    expect((await entry(learningWeek(new Date())).get()).exists).toBe(false);
  });
  it('updates both period totals with a new reward after consent', async () => {
    await consent('on');
    await db.runTransaction((tx) =>
      awardLesson(tx, db, childId, {
        courseId: 'course',
        lessonId: 'lesson',
        now: new Date(),
        category: 'science',
        completedCourse: false,
      }),
    );
    expect((await entry('all-time').get()).get('xp')).toBe(45);
    expect((await entry(learningWeek(new Date())).get()).get('xp')).toBe(30);
  });
  it('uses zero for an old weekly total when joining a fresh week', async () => {
    await db
      .collection('users')
      .doc(childId)
      .update({ 'stats.weeklyPeriod': '2000-01-02', 'stats.weeklyXp': 999 });
    await consent('on');
    expect((await getLeaderboard('week')).you?.xp).toBe(0);
  });
  it('includes your rank beyond the top ten and gives tied scores the same rank', async () => {
    await consent('on');
    const batch = db.batch();
    for (let index = 0; index < 11; index++) {
      const id = `peer-${randomUUID()}`;
      batch.set(db.collection('users').doc(id), {
        role: 'student',
        status: 'active',
        leaderboardOptIn: true,
        nickname: 'Sprout',
        avatarId: 'leaf',
      });
      batch.set(db.collection('leaderboards').doc('all-time').collection('entries').doc(id), {
        xp: 100,
      });
    }
    await batch.commit();
    const result = await getLeaderboard('all-time');
    expect(result.rows).toHaveLength(10);
    expect(result.rows.every((row) => row.rank === 1)).toBe(true);
    expect(result.you).toMatchObject({ rank: 12, xp: 30, isYou: true });
  });
  it('withdraws consent and entries when an admin disables or changes the learner role', async () => {
    await consent('on');
    await setDisabled(childId, true, 'admin');
    expect((await entry('all-time').get()).exists).toBe(false);
    expect((await db.collection('users').doc(childId).get()).get('leaderboardOptIn')).toBe(false);
    await setDisabled(childId, false, 'admin');
    await consent('on');
    await assignRole(fakeAuth as unknown as Auth, db, childId, 'creator', 'admin');
    expect((await entry('all-time').get()).exists).toBe(false);
  });
});
