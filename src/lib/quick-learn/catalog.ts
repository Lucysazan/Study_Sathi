import { z } from 'zod';
export const quickSubjects = [
  'Maths',
  'Science',
  'English',
  'Nepali',
  'Geography',
  'Nature',
  'Technology',
  'Digital safety',
  'Everyday money',
  'Art',
  'Practical knowledge',
] as const;
export const quickVideoSchema = z
  .object({
    videoId: z.string().regex(/^[A-Za-z0-9_-]{11}$/),
    sourceUrl: z.string().url(),
    title: z.string().min(1),
    creator: z.string().min(1),
    language: z.enum(['en', 'ne', 'none']),
    subject: z.enum(quickSubjects),
    minAge: z.number().int().min(10).max(16),
    maxAge: z.number().int().min(10).max(16),
    durationSeconds: z.number().int().positive().max(180),
    objective: z.string().min(1),
    question: z.object({
      prompt: z.string().min(1),
      options: z.array(z.string().min(1)).min(2).max(4),
      answer: z.number().int().nonnegative(),
      explanation: z.string().min(1),
    }),
    related: z.object({ href: z.string(), label: z.string().min(1) }),
    review: z.object({
      status: z.enum(['pending', 'approved', 'rejected']),
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .nullable(),
      reviewer: z.string(),
      basis: z.string(),
      notes: z.string(),
    }),
  })
  .superRefine((v, ctx) => {
    if (v.maxAge < v.minAge) ctx.addIssue({ code: 'custom', message: 'Age range reversed' });
    if (new Set(v.question.options).size !== v.question.options.length)
      ctx.addIssue({ code: 'custom', message: 'Answer options must be distinct' });
    if (v.question.answer >= v.question.options.length)
      ctx.addIssue({ code: 'custom', message: 'Missing answer option' });
    if (v.sourceUrl !== `https://www.youtube.com/shorts/${v.videoId}`)
      ctx.addIssue({ code: 'custom', message: 'Source must identify this exact Short' });
    if (
      !/^\/(?!\/)[A-Za-z0-9/_?=#&%.-]*$/.test(v.related.href) &&
      !/^https:\/\/www\.youtube\.com\/playlist\?list=[A-Za-z0-9_-]+$/.test(v.related.href)
    )
      ctx.addIssue({
        code: 'custom',
        message: 'Use an internal lesson or reviewed YouTube playlist',
      });
    if (
      v.review.status === 'approved' &&
      (!v.review.date || !v.review.reviewer.trim() || !v.review.basis.trim())
    )
      ctx.addIssue({ code: 'custom', message: 'Approved entries require dated review evidence' });
  });
export type QuickVideo = z.infer<typeof quickVideoSchema>;
export type QuickFilters = { language: string; subject: string; age: string; savedOnly?: boolean };
export const quickSaveId = (id: string) => `quick-${id}`;
export function approvedVideos(entries: readonly unknown[]): QuickVideo[] {
  return entries
    .map((e) => quickVideoSchema.safeParse(e))
    .filter((r) => r.success && r.data.review.status === 'approved')
    .map((r) => r.data!);
}
export function filterQuickVideos(
  videos: readonly QuickVideo[],
  f: QuickFilters,
  saved: readonly string[] = [],
) {
  const age = f.age === '10-12' ? [10, 12] : f.age === '13-16' ? [13, 16] : null;
  return videos.filter(
    (v) =>
      v.review.status === 'approved' &&
      (!f.language || v.language === f.language) &&
      (!f.subject || v.subject === f.subject) &&
      (!age || (v.minAge <= age[1]! && v.maxAge >= age[0]!)) &&
      (!f.savedOnly || saved.includes(quickSaveId(v.videoId))),
  );
}
