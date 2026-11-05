import 'server-only';
import { createHash } from 'node:crypto';
import { FieldValue, type Firestore, type Transaction } from 'firebase-admin/firestore';
import { statsSchema } from './stats';
import { lessonReward, type LessonRewardInput } from './rewards';

export type RewardReceipt = { xpAwarded: number; newBadges: string[] };
export const noReward: RewardReceipt = { xpAwarded: 0, newBadges: [] };

/** Call after reading course/progress and before any transaction writes. */
export async function awardLesson(
  tx: Transaction,
  db: Firestore,
  uid: string,
  input: LessonRewardInput & { courseId: string; lessonId: string },
): Promise<RewardReceipt> {
  const userRef = db.collection('users').doc(uid);
  const key = createHash('sha256')
    .update(JSON.stringify([input.courseId, input.lessonId]))
    .digest('hex');
  const eventRef = userRef.collection('xpEvents').doc(`lesson_${key}`);
  const user = await tx.get(userRef);
  const event = await tx.get(eventRef);
  if (event.exists) return noReward;
  if (!user.exists || user.get('role') !== 'student')
    throw new Error('Learner account unavailable');
  const raw: unknown = user.get('stats');
  const previous = statsSchema.parse(raw ?? {});
  const result = lessonReward(previous, input);
  // Preserve unrelated server-maintained stats while replacing validated reward fields.
  const existing = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  tx.create(eventRef, {
    amount: result.xpAwarded,
    dailyBonus: result.dailyBonus,
    courseBonus: result.courseBonus,
    reason: 'lesson_complete',
    courseId: input.courseId,
    lessonId: input.lessonId,
    createdAt: FieldValue.serverTimestamp(),
  });
  tx.update(userRef, { stats: { ...existing, ...result.stats }, currentCourseId: input.courseId });
  return { xpAwarded: result.xpAwarded, newBadges: result.newBadges };
}
