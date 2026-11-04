import { z } from 'zod';
import { categories, learningPurposes, resourceFormats, resourceLanguages } from '@/lib/filters';
import type { LearningPath, Resource } from '@/types/catalog';

/** Schemas for catalogue data: the admin resource form and documents read from Firestore. */

export const ADULT_AGE_LABEL = 'Parents and Volunteers';
export const MIN_AGE = 5;
export const MAX_AGE = 18;

/** "10–14" for a child range, or the adult label when there is no range. */
export function ageLabel(minAge: number | null, maxAge: number | null): string {
  return minAge === null || maxAge === null ? ADULT_AGE_LABEL : `${minAge}–${maxAge}`;
}

const text = (min: number, max: number, what: string) =>
  z
    .string()
    .trim()
    .min(min, `${what} needs at least ${min} characters.`)
    .max(max, `${what} must be ${max} characters or fewer.`);

const age = z.coerce
  .number({ error: 'Please enter an age.' })
  .int('Please use a whole number.')
  .min(MIN_AGE, `Ages start at ${MIN_AGE}.`)
  .max(MAX_AGE, `Ages go up to ${MAX_AGE}.`);

/** Admin "Add / Edit resource" form. The age label is derived, never typed. */
export const resourceInputSchema = z
  .object({
    title: text(3, 100, 'Title'),
    provider: text(2, 80, 'Provider'),
    category: z.enum(categories, { error: 'Please choose a category.' }),
    topic: text(2, 80, 'Topic'),
    description: text(10, 400, 'Description'),
    language: z.enum(resourceLanguages, { error: 'Please choose a language.' }),
    audience: z.enum(['children', 'adults'], { error: 'Please choose who it is for.' }),
    minAge: z.unknown(),
    maxAge: z.unknown(),
    format: z.enum(resourceFormats, { error: 'Please choose a format.' }),
    purpose: z.enum(learningPurposes, { error: 'Please choose a learning purpose.' }),
    url: z
      .string()
      .trim()
      .pipe(z.url({ protocol: /^https$/, error: 'Please enter a full https:// link.' })),
    note: z.string().trim().max(400, 'Notes must be 400 characters or fewer.').default(''),
    verification: text(10, 400, 'Verification note'),
  })
  .transform((input, ctx) => {
    let minAge: number | null = null;
    let maxAge: number | null = null;
    if (input.audience === 'children') {
      const min = age.safeParse(input.minAge);
      const max = age.safeParse(input.maxAge);
      if (!min.success)
        ctx.addIssue({
          code: 'custom',
          path: ['minAge'],
          message: min.error.issues[0]?.message ?? 'Check the age.',
        });
      if (!max.success)
        ctx.addIssue({
          code: 'custom',
          path: ['maxAge'],
          message: max.error.issues[0]?.message ?? 'Check the age.',
        });
      if (min.success && max.success) {
        if (min.data > max.data) {
          ctx.addIssue({
            code: 'custom',
            path: ['maxAge'],
            message: 'The oldest age must be at least the youngest.',
          });
        }
        minAge = min.data;
        maxAge = max.data;
      }
    }
    return {
      title: input.title,
      provider: input.provider,
      category: input.category,
      topic: input.topic,
      description: input.description,
      language: input.language,
      age: ageLabel(minAge, maxAge),
      minAge,
      maxAge,
      format: input.format,
      purpose: input.purpose,
      url: input.url,
      note: input.note,
      verification: input.verification,
    };
  });

export type ResourceInput = z.output<typeof resourceInputSchema>;

/** A resource document in Firestore (`resources/{id}`); the id comes from the doc path. */
export const resourceDocSchema = z.object({
  title: z.string().min(1),
  provider: z.string().min(1),
  category: z.string().min(1),
  topic: z.string().min(1),
  description: z.string().min(1),
  language: z.string().min(1),
  age: z.string().min(1),
  minAge: z.number().int().nullable(),
  maxAge: z.number().int().nullable(),
  format: z.string().min(1),
  purpose: z.string().min(1),
  url: z.string().url(),
  note: z.string().default(''),
  verification: z.string().default(''),
  order: z.number().default(9999),
});

export function toResource(id: string, data: unknown): (Resource & { order: number }) | null {
  const parsed = resourceDocSchema.safeParse(data);
  return parsed.success ? { id, ...parsed.data } : null;
}

const stepSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  resource: z.string().optional(),
  prompt: z.string().optional(),
  budget: z.boolean().optional(),
});

export const learningPathDocSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  age: z.string().min(1),
  category: z.string().min(1),
  goal: z.string().min(1),
  steps: z.array(stepSchema).min(1),
  order: z.number().default(9999),
});

export function toLearningPath(
  id: string,
  data: unknown,
): (LearningPath & { order: number }) | null {
  const parsed = learningPathDocSchema.safeParse(data);
  return parsed.success ? { id, ...parsed.data } : null;
}

/** URL-friendly id for a new resource, e.g. "Khan Academy Kids" → "khan-academy-kids". */
export function slugify(title: string): string {
  return (
    title
      .normalize('NFKD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60)
      .replace(/-+$/, '') || 'resource'
  );
}
