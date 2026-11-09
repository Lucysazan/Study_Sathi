import 'server-only';
import { adminDb } from '@/lib/firebase/admin';
import { awardStudy, noReward } from '@/lib/gamification/awards';
import { studyProgress, type gradeStudy } from './checks';
export async function readStudyProgress(uid: string) {
  const doc = await adminDb()
    .collection('users')
    .doc(uid)
    .collection('privateData')
    .doc('study')
    .get();
  return studyProgress.parse(doc.exists ? doc.get('results') || {} : {});
}
export async function saveStudyProgress(uid: string, result: ReturnType<typeof gradeStudy>) {
  const db = adminDb(),
    ref = db.collection('users').doc(uid).collection('privateData').doc('study');
  return db.runTransaction(async (tx) => {
    // Perfect checks validate the account in awardStudy; avoid reading that document twice.
    if (result.correct !== result.total) {
      const account = await tx.get(db.collection('users').doc(uid));
      if (
        !account.exists ||
        account.get('role') !== 'student' ||
        account.get('status') === 'disabled'
      )
        throw new Error('Learner account unavailable');
    }
    const doc = await tx.get(ref),
      current = studyProgress.parse(doc.exists ? doc.get('results') || {} : {}),
      old = current[result.activityId],
      now = new Date();
    const reward =
      result.correct === result.total
        ? await awardStudy(tx, db, uid, result.activityId, now)
        : noReward;
    const record = {
      best: Math.max(old?.best || 0, result.correct),
      last: result.correct,
      total: result.total,
      attempts: (old?.attempts || 0) + 1,
      checkedAt: now.toISOString(),
      completedAt: old?.completedAt || (result.correct === result.total ? now.toISOString() : null),
    };
    tx.set(ref, { results: studyProgress.parse({ ...current, [result.activityId]: record }) });
    return reward;
  });
}
