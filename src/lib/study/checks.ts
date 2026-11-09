import { z } from 'zod';
import { findStudyActivity, studyActivities } from './catalog';
export const studySubmission = z
  .object({
    activityId: z.string().max(60),
    expectedUid: z.string().min(1).max(128).nullable(),
    answers: z.record(z.string().max(30), z.number().int().min(0).max(8)),
  })
  .strict();
export function gradeStudy(input: z.infer<typeof studySubmission>) {
  const activity = findStudyActivity(input.activityId);
  if (
    !activity ||
    Object.keys(input.answers).length !== activity.questions.length ||
    activity.questions.some(
      (q) => !Object.hasOwn(input.answers, q.id) || (input.answers[q.id] ?? 99) >= q.options.length,
    )
  )
    throw new Error('Answer every question.');
  const feedback = activity.questions.map((q) => ({
    id: q.id,
    correct: input.answers[q.id] === q.answer,
    explanation: q.explanation,
    answer: q.options[q.answer],
  }));
  return {
    activityId: activity.id,
    total: feedback.length,
    correct: feedback.filter((q) => q.correct).length,
    feedback,
  };
}
export const studyRecord = z.object({
  best: z.number().int().min(0).max(10),
  last: z.number().int().min(0).max(10),
  total: z.number().int().min(1).max(10),
  attempts: z.number().int().min(1).max(1000000000),
  checkedAt: z.string().datetime(),
  completedAt: z.string().datetime().nullable(),
});
export const studyProgress = z
  .record(z.string().max(60), studyRecord)
  .refine((r) => Object.keys(r).every((id) => studyActivities.some((a) => a.id === id)));
