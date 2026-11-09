import {
  assertFails,
  assertSucceeds,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import { createRulesEnv, seed } from './setup';

let env: RulesTestEnvironment;

const student = { uid: 'student-1', token: { role: 'student' } };
const otherStudent = { uid: 'student-2', token: { role: 'student' } };
const admin = { uid: 'admin-1', token: { role: 'admin' } };

const asUser = (u: { uid: string; token: Record<string, unknown> }) =>
  env.authenticatedContext(u.uid, u.token).firestore();
const asGuest = () => env.unauthenticatedContext().firestore();

beforeAll(async () => {
  env = await createRulesEnv();
});

afterAll(async () => {
  await env.cleanup();
});

beforeEach(async () => {
  await env.clearFirestore();
  await seed(env, {
    'resources/1': { title: 'OLE Nepal E-Paath' },
    'learningPaths/stay-safe-online': { title: 'Stay Safe Online' },
    'badges/first-lesson': { name: 'First steps' },
    'users/student-1': {
      role: 'student',
      nickname: 'Leaf',
      avatarId: 'panda',
      stats: { xp: 10, level: 1 },
    },
    'users/student-1/xpEvents/lesson:a:b': { amount: 10 },
    'users/student-2': { role: 'student', nickname: 'Peak' },
    'auditLog/a1': { action: 'test' },
  });
});

describe('default deny', () => {
  it('blocks direct game progress and score writes including the owner', async () => {
    await seed(env, { 'users/student-1/privateData/study': { results: {} } });
    await assertFails(asUser(student).doc('users/student-1/privateData/study').get());
    await assertFails(asUser(otherStudent).doc('users/student-1/privateData/study').get());
    await assertFails(
      asUser(student)
        .doc('users/student-1/privateData/study')
        .set({ results: { fractions: { best: 999 } } }),
    );
    await assertFails(asGuest().doc('users/student-1/privateData/study').get());
  });
  it('blocks direct academic result and textbook writes, including forged scores', async () => {
    await seed(env, {
      'users/student-1/privateData/academic': { results: {} },
      'academicSources/grade9-mathematics': { title: 'Book' },
    });
    await assertFails(asUser(student).doc('users/student-1/privateData/academic').get());
    await assertFails(asUser(otherStudent).doc('users/student-1/privateData/academic').get());
    await assertFails(
      asUser(student).doc('users/student-1/privateData/academic').set({ correct: 999 }),
    );
    await assertFails(
      asUser(admin).doc('academicSources/grade9-mathematics').set({ pdfUrl: 'forged' }),
    );
    await assertFails(asGuest().doc('academicSources/grade9-mathematics').get());
  });
  it('prevents forged analytics totals and enrollment cohort markers', async () => {
    await seed(env, {
      'courses/analytics-course': { status: 'published', stats: { views: 1 } },
      'courseEnrollments/student-1_analytics-course': {
        userId: 'student-1',
        courseId: 'analytics-course',
      },
    });
    await assertFails(
      asUser(student)
        .doc('courses/analytics-course')
        .update({ 'stats.lessonCompletions.lesson': 999 }),
    );
    await assertFails(
      asUser(admin).doc('courses/analytics-course').update({ 'stats.analyticsCompletions': 999 }),
    );
    await assertFails(
      asUser(student)
        .doc('courseEnrollments/student-1_analytics-course')
        .update({ analyticsVersion: 1 }),
    );
  });
  it('keeps leaderboard writes and participant records server-only', async () => {
    await seed(env, { 'leaderboards/all-time/entries/student-1': { xp: 100 } });
    await assertFails(asUser(student).doc('leaderboards/all-time/entries/student-1').get());
    await assertFails(
      asUser(student).doc('leaderboards/all-time/entries/student-1').set({ xp: 9999 }),
    );
    await assertFails(
      asUser(admin).doc('leaderboards/all-time/entries/student-1').set({ xp: 9999 }),
    );
  });
  it('keeps private library data and view events inaccessible to other learners', async () => {
    await seed(env, {
      'users/student-1/privateData/library': { notes: { private: 'A private note' } },
    });
    await assertFails(asUser(otherStudent).doc('users/student-1/privateData/library').get());
    await assertFails(asUser(student).doc('courseViews/forged').set({ courseId: 'course' }));
    await assertFails(
      asUser(student)
        .doc('users/student-1/privateData/library')
        .set({ savedIds: ['1'] }),
    );
    await assertFails(
      asUser(student).doc('users/student-1').update({ avatarId: 'external-photo' }),
    );
  });
  it('prevents clients from forging enrollment and lesson progress', async () => {
    for (const user of [student, otherStudent, admin]) {
      await assertFails(
        asUser(user)
          .doc('courseProgress/student-1_course')
          .set({ completedLessons: ['one'], userId: 'student-1' }),
      );
      await assertFails(
        asUser(user).doc('courseEnrollments/student-1_course').set({ userId: 'student-1' }),
      );
    }
  });
  it('blocks reads and writes to unknown collections', async () => {
    await assertFails(asGuest().doc('auditLog/a1').get());
    await assertFails(asUser(student).doc('auditLog/a1').get());
    await assertFails(asUser(student).doc('somethingNew/x').set({ a: 1 }));
  });
});

describe('audit log', () => {
  it('is readable by admins only and never writable from the client', async () => {
    await assertSucceeds(asUser(admin).doc('auditLog/a1').get());
    await assertFails(asUser(student).doc('auditLog/a1').get());
    await assertFails(asUser(admin).doc('auditLog/a2').set({ action: 'fake' }));
    await assertFails(asUser(admin).doc('auditLog/a1').delete());
  });
});

describe('public catalogue', () => {
  it('is readable by guests', async () => {
    await assertSucceeds(asGuest().doc('resources/1').get());
    await assertSucceeds(asGuest().doc('learningPaths/stay-safe-online').get());
    await assertSucceeds(asGuest().doc('badges/first-lesson').get());
  });

  it('cannot be written by anyone through the client, not even admins', async () => {
    await assertFails(asGuest().doc('resources/1').set({ title: 'x' }));
    await assertFails(asUser(student).doc('resources/1').update({ title: 'x' }));
    await assertFails(asUser(admin).doc('resources/2').set({ title: 'x' }));
  });
});

describe('users', () => {
  it('lets a user read only their own doc', async () => {
    await assertSucceeds(asUser(student).doc('users/student-1').get());
    await assertFails(asUser(otherStudent).doc('users/student-1').get());
    await assertFails(asGuest().doc('users/student-1').get());
  });

  it('lets admins read any user', async () => {
    await assertSucceeds(asUser(admin).doc('users/student-1').get());
  });

  it('allows changing nickname and avatar only', async () => {
    await assertSucceeds(
      asUser(student).doc('users/student-1').update({ nickname: 'River', avatarId: 'yak' }),
    );
  });

  it('blocks role, stats and other server-only fields', async () => {
    const me = asUser(student).doc('users/student-1');
    await assertFails(me.update({ role: 'admin' }));
    await assertFails(me.update({ 'stats.xp': 9999 }));
    await assertFails(me.update({ leaderboardOptIn: true }));
    await assertFails(me.update({ nickname: 'Ok', parentUid: 'someone' }));
  });

  it('validates nickname length and type', async () => {
    const me = asUser(student).doc('users/student-1');
    await assertFails(me.update({ nickname: 'x' }));
    await assertFails(me.update({ nickname: 'a'.repeat(21) }));
    await assertFails(me.update({ nickname: 42 }));
  });

  it('blocks editing someone else, creating or deleting user docs', async () => {
    await assertFails(asUser(otherStudent).doc('users/student-1').update({ nickname: 'Hacked' }));
    await assertFails(asUser(student).doc('users/new-user').set({ role: 'parent' }));
    await assertFails(asUser(student).doc('users/student-1').delete());
    await assertFails(asUser(admin).doc('users/student-1').update({ role: 'parent' }));
  });

  it('keeps the XP ledger read-only', async () => {
    await assertSucceeds(asUser(student).doc('users/student-1/xpEvents/lesson:a:b').get());
    await assertFails(asUser(otherStudent).doc('users/student-1/xpEvents/lesson:a:b').get());
    await assertFails(asUser(student).doc('users/student-1/xpEvents/new').set({ amount: 100 }));
  });
});
