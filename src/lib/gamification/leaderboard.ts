import 'server-only';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { learningWeek } from './stats';

export type LeaderboardRow = {
  rank: number;
  nickname: string;
  avatarId: string;
  xp: number;
  isYou: boolean;
};
export type LeaderboardData = {
  optedIn: boolean;
  rows: LeaderboardRow[];
  you: LeaderboardRow | null;
};

export async function getLeaderboard(period: 'week' | 'all-time'): Promise<LeaderboardData> {
  const user = await requireRole(['student'], '/learn/leaderboard');
  const db = adminDb();
  const account = await db.collection('users').doc(user.uid).get();
  if (account.get('leaderboardOptIn') !== true || account.get('status') === 'disabled')
    return { optedIn: false, rows: [], you: null };
  const entries = db
    .collection('leaderboards')
    .doc(period === 'week' ? learningWeek(new Date()) : 'all-time')
    .collection('entries');
  const [top, mine] = await Promise.all([
    entries.orderBy('xp', 'desc').limit(10).get(),
    entries.doc(user.uid).get(),
  ]);
  const accounts = await Promise.all(
    top.docs.map((entry) => db.collection('users').doc(entry.id).get()),
  );
  const rows: LeaderboardRow[] = [];
  let rank = 0;
  let previous: number | undefined;
  for (const [index, entry] of top.docs.entries()) {
    const person = accounts[index];
    const xp: unknown = entry.get('xp');
    if (typeof xp !== 'number' || !Number.isSafeInteger(xp) || xp < 0) continue;
    if (xp !== previous) rank = index + 1;
    previous = xp;
    // Consent and status are checked again when rendering, even if an old entry remains.
    if (
      person?.get('leaderboardOptIn') !== true ||
      person.get('role') !== 'student' ||
      person.get('status') === 'disabled'
    )
      continue;
    rows.push({
      rank,
      nickname: String(person.get('nickname') ?? 'Learner'),
      avatarId: String(person.get('avatarId') ?? 'leaf'),
      xp,
      isYou: entry.id === user.uid,
    });
  }
  let you = rows.find((row) => row.isYou) ?? null;
  const xp: unknown = mine.get('xp');
  if (!you && mine.exists && typeof xp === 'number' && Number.isSafeInteger(xp) && xp >= 0) {
    const above = await entries.where('xp', '>', xp).count().get();
    you = {
      rank: above.data().count + 1,
      nickname: String(account.get('nickname') ?? 'Learner'),
      avatarId: String(account.get('avatarId') ?? 'leaf'),
      xp,
      isYou: true,
    };
  }
  // Return presentation fields only; no UID, email, parent link or private notes.
  return { optedIn: true, rows, you };
}
