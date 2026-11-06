import { z } from 'zod';
import { findAcademicChapter } from '@/data/academic';
import type { Chapter, PracticeResult } from './types';

export const submissionSchema = z
  .object({
    chapterId: z.string().max(60),
    phase: z.enum(['check', 'follow-up']),
    answers: z.record(z.string().max(60), z.number().int().min(0).max(8)),
    expectedUid: z.string().min(1).max(128).nullable(),
  })
  .strict();

export function gradePractice(input: z.infer<typeof submissionSchema>): PracticeResult {
  const chapter = findAcademicChapter(input.chapterId);
  if (!chapter) throw new Error('Unknown chapter.');
  const questions = input.phase === 'check' ? chapter.questions : chapter.followUp;
  if (
    Object.keys(input.answers).length !== questions.length ||
    questions.some(
      (q) =>
        !Object.hasOwn(input.answers, q.id) ||
        (input.answers[q.id] ?? -1) < 0 ||
        (input.answers[q.id] ?? 99) >= q.options.length,
    )
  )
    throw new Error('Answer every question before checking.');
  const feedback = questions.map((q) => ({
    questionId: q.id,
    correct: input.answers[q.id] === q.answer,
    answer: q.options[q.answer] ?? '',
    explanation: q.explanation,
  }));
  return {
    chapterId: chapter.id,
    phase: input.phase,
    correct: feedback.filter((f) => f.correct).length,
    total: questions.length,
    skills: chapter.skills.map((skill) => {
      const indices = questions
        .map((q, index) => (q.skillId === skill.id ? index : -1))
        .filter((i) => i >= 0);
      return {
        id: skill.id,
        correct: indices.filter((i) => feedback[i]?.correct).length,
        total: indices.length,
      };
    }),
    feedback,
  };
}

export function revisionSkills(chapter: Chapter, result: PracticeResult) {
  return chapter.skills.filter((skill) =>
    result.skills.some((s) => s.id === skill.id && s.correct < s.total),
  );
}

export const savedResultSchema = z.object({
  chapterId: z.string().max(60),
  phase: z.enum(['check', 'follow-up']),
  correct: z.number().int().min(0).max(20),
  total: z.number().int().min(1).max(20),
  skills: z
    .array(
      z.object({
        id: z.string().max(60),
        correct: z.number().int().min(0).max(20),
        total: z.number().int().min(1).max(20),
      }),
    )
    .max(10),
  checkedAt: z.string().datetime(),
  reviewAt: z.string().datetime(),
});
export type SavedAcademicResult = z.infer<typeof savedResultSchema>;
export const academicProgressSchema = z
  .record(z.string().max(80), savedResultSchema)
  .refine((records) => Object.keys(records).length <= 20);

export function savedPractice(result: PracticeResult, now: Date): SavedAcademicResult {
  // One-day review is a transparent pilot rule, not a validated mastery schedule.
  return savedResultSchema.parse({
    ...result,
    checkedAt: now.toISOString(),
    reviewAt: new Date(now.getTime() + 86400000).toISOString(),
  });
}
