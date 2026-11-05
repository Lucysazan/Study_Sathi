'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { fail, ok, type ActionResult } from '@/lib/actions';
import { requireRole } from '@/lib/auth/session';
import { adminDb } from '@/lib/firebase/admin';
import { findLessonById } from '@/lib/course/learning';
import { readCourseOutline } from '@/lib/course/outline';
import { awardQuiz, noReward, type RewardReceipt } from '@/lib/gamification/awards';

const id = z
  .string()
  .min(1)
  .max(128)
  .refine((value) => !value.includes('/') && value !== '.' && value !== '..');
const quizInput = z.object({
  courseId: id,
  lessonId: id,
  quizId: id,
  answer: z.string().min(1).max(120),
});
export type QuizReceipt = RewardReceipt & { correct: boolean };

export async function submitQuiz(input: unknown): Promise<ActionResult<QuizReceipt>> {
  const parsed = quizInput.safeParse(input);
  if (!parsed.success) return fail('Please choose an answer for this quiz.');
  const user = await requireRole(['student'], '/learn/courses');
  const { courseId, lessonId, quizId, answer } = parsed.data;
  const now = new Date();
  try {
    const db = adminDb();
    const result = await db.runTransaction(async (tx) => {
      const course = await tx.get(db.collection('courses').doc(courseId));
      if (!course.exists || course.get('status') !== 'published')
        return fail('This course is not available.');
      const lesson = findLessonById(
        { outline: readCourseOutline(course.get('outline')) ?? undefined },
        lessonId,
      );
      const quiz = lesson?.blocks
        ? lesson.blocks.find((block) => block.id === quizId)
        : lesson?.id === quizId
          ? lesson
          : null;
      if (!quiz || quiz.kind !== 'quiz' || !quiz.correctAnswer || !quiz.options?.includes(answer))
        return fail('This quiz or answer is not available.');
      const enrollment = await tx.get(
        db.collection('courseEnrollments').doc(`${user.uid}_${courseId}`),
      );
      if (!enrollment.exists) return fail('Please enroll before answering this quiz.');
      if (answer !== quiz.correctAnswer) return ok({ correct: false, ...noReward });
      const receipt = await awardQuiz(tx, db, user.uid, { courseId, lessonId, quizId, now });
      return ok({ correct: true, ...receipt });
    });
    if (result.ok && result.data.xpAwarded > 0) revalidatePath('/learn', 'layout');
    return result;
  } catch {
    return fail('We could not check your answer. Please try again.');
  }
}
