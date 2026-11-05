import 'server-only';
import { cache } from 'react';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { levelInfo, statsSchema } from './stats';

/** React cache shares this read only within a request, never between learners. */
export const loadStudentAccount = cache(async () => {
  const user = await requireRole(['student'], '/learn');
  const account = await adminDb().collection('users').doc(user.uid).get();
  return { user, account, stats: statsSchema.parse(account.get('stats') ?? {}) };
});

export async function getStudentIdentity() {
  const { account, stats } = await loadStudentAccount();
  return {
    nickname: String(account.get('nickname') ?? 'Learner'),
    avatarId: String(account.get('avatarId') ?? 'leaf'),
    xp: stats.xp,
    level: levelInfo(stats.xp).level,
  };
}
