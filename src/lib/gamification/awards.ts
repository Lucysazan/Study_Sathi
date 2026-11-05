import 'server-only';
import { createHash } from 'node:crypto';
import { FieldValue, type Firestore, type Transaction } from 'firebase-admin/firestore';
import { syncLeaderboardEntries } from './entries';
import { statsSchema } from './stats';
import { lessonReward, quizReward, type LessonRewardInput } from './rewards';

export type RewardReceipt = { xpAwarded: number; newBadges: string[] };
export const noReward: RewardReceipt = { xpAwarded: 0, newBadges: [] };

/** Call after reading course/progress and before any transaction writes. */
export async function awardLesson(
  tx: Transaction,
  db: Firestore,
  uid: string,
  input: LessonRewardInput & { courseId: string; lessonId: string },
): Promise<RewardReceipt> {
  return awardActivity(tx, db, uid, input, 'lesson');
}

export async function awardQuiz(
  tx: Transaction,
  db: Firestore,
  uid: string,
  input: { courseId: string; lessonId: string; quizId: string; now: Date },
): Promise<RewardReceipt> {
  return awardActivity(tx, db, uid, { ...input, completedCourse: false, category: '' }, 'quiz');
}

async function awardActivity(
  tx: Transaction,
  db: Firestore,
  uid: string,
  input: LessonRewardInput & { courseId: string; lessonId: string; quizId?: string },
  kind: 'lesson' | 'quiz',
): Promise<RewardReceipt> {
  const userRef = db.collection('users').doc(uid);
  const key = createHash('sha256')
    .update(
      JSON.stringify([input.courseId, input.lessonId, ...(kind === 'quiz' ? [input.quizId] : [])]),
    )
    .digest('hex');
  const eventRef = userRef.collection('xpEvents').doc(`${kind}_${key}`);
  const user = await tx.get(userRef);
  const event = await tx.get(eventRef);
  if (event.exists) return noReward;
  if (!user.exists || user.get('role') !== 'student' || user.get('status') === 'disabled')
    throw new Error('Learner account unavailable');
  const raw: unknown = user.get('stats');
  const previous = statsSchema.parse(raw ?? {});
  const result =
    kind === 'lesson' ? lessonReward(previous, input) : quizReward(previous, input.now);
  // Preserve unrelated server-maintained stats while replacing validated reward fields.
  const existing = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  tx.create(eventRef, {
    amount: result.xpAwarded,
    dailyBonus: result.dailyBonus,
    courseBonus: result.courseBonus,
    reason: kind === 'lesson' ? 'lesson_complete' : 'quiz_pass',
    ...(kind === 'quiz' ? { quizId: input.quizId } : {}),
    courseId: input.courseId,
    lessonId: input.lessonId,
    createdAt: FieldValue.serverTimestamp(),
  });
  tx.update(userRef, { stats: { ...existing, ...result.stats }, currentCourseId: input.courseId });
  if (user.get('leaderboardOptIn') === true)
    syncLeaderboardEntries(tx, db, uid, result.stats, true, input.now);
  return { xpAwarded: result.xpAwarded, newBadges: result.newBadges };
}
