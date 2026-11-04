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
  it('blocks reads and writes to unknown collections', async () => {
    await assertFails(asGuest().doc('auditLog/a1').get());
    await assertFails(asUser(student).doc('auditLog/a1').get());
    await assertFails(asUser(student).doc('somethingNew/x').set({ a: 1 }));
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
