import type { Firestore, DocumentReference } from 'firebase-admin/firestore';
import { learningWeek, type LearnerStats } from './stats';

/** No admin initialization: shared with trusted CLI role changes. Names stay in user docs. */
type EntryWriter = {
  set: (ref: DocumentReference, data: { xp: number }) => unknown;
  delete: (ref: DocumentReference) => unknown;
};
export function syncLeaderboardEntries(
  writer: EntryWriter,
  db: Firestore,
  uid: string,
  stats: LearnerStats | null,
  visible: boolean,
  now: Date,
) {
  const week = learningWeek(now);
  for (const period of ['all-time', week]) {
    const ref = db.collection('leaderboards').doc(period).collection('entries').doc(uid);
    if (!visible || !stats) writer.delete(ref);
    else
      writer.set(ref, {
        xp: period === 'all-time' ? stats.xp : stats.weeklyPeriod === week ? stats.weeklyXp : 0,
      });
  }
}
