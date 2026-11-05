import { z } from 'zod';

export const courseReviewNoteSchema = z.object({
  note: z
    .string()
    .trim()
    .min(10, 'Please leave a short note for the creator so they know what to fix.')
    .max(2000, 'Please keep the note under 2,000 characters.'),
});

export type CourseReviewNoteInput = z.infer<typeof courseReviewNoteSchema>;
