import { z } from 'zod';
import { safeMediaUrl, videoEmbedUrl } from './media';
import { budgetActivitySchema, sortActivitySchema } from './activities';

export const courseCategories = [
  'digital-skills',
  'digital-safety',
  'literacy',
  'science',
  'math',
  'arts',
  'language',
  'wellbeing',
] as const;

export const courseStatus = ['draft', 'review', 'published'] as const;

export const courseLessonKinds = [
  'text',
  'video',
  'image',
  'resource',
  'quiz',
  'reflection',
  'checkpoint',
  'sort',
  'budget',
] as const;

export const courseBlockSchema = z
  .object({
    id: z.string().min(1),
    title: z.string().trim().min(2, 'Each lesson needs a title.').max(90),
    kind: z.enum(courseLessonKinds),
    duration: z.string().trim().min(1, 'Add a lesson duration.').max(30),
    content: z.string().trim().max(4000).optional(),
    prompt: z.string().trim().max(400).optional(),
    alt: z.string().trim().max(240).optional(),
    mediaUrl: z.string().trim().max(500).optional(),
    resourceTitle: z.string().trim().max(120).optional(),
    question: z.string().trim().max(400).optional(),
    options: z
      .array(z.string().trim().min(1, 'Quiz choices cannot be blank.').max(120))
      .max(6)
      .optional(),
    correctAnswer: z.string().trim().max(120).optional(),
    sortActivity: sortActivitySchema.optional(),
    budgetActivity: budgetActivitySchema.optional(),
  })
  .superRefine((lesson, ctx) => {
    // safeExtend preserves this refinement; stacked lessons validate their child blocks instead.
    if ('blocks' in lesson && Array.isArray(lesson.blocks) && lesson.blocks.length > 0) return;
    if (lesson.kind === 'sort' && !lesson.sortActivity)
      ctx.addIssue({
        code: 'custom',
        path: ['sortActivity'],
        message: 'Add groups and items for this sorting activity.',
      });
    if (lesson.kind === 'budget' && !lesson.budgetActivity)
      ctx.addIssue({
        code: 'custom',
        path: ['budgetActivity'],
        message: 'Add a total and categories for this budget activity.',
      });
    if (lesson.kind === 'text' && (!lesson.content || lesson.content.trim().length < 10)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Add some instructional text for this lesson block.',
        path: ['content'],
      });
    }

    if (
      (lesson.kind === 'reflection' || lesson.kind === 'checkpoint') &&
      (!lesson.prompt || lesson.prompt.trim().length < 6)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'This block needs a prompt or task for learners.',
        path: ['prompt'],
      });
    }

    if (lesson.kind === 'quiz') {
      const options = lesson.options ?? [];
      if (!lesson.question || lesson.question.trim().length < 6) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Add a quiz question.',
          path: ['question'],
        });
      }

      if (options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'A quiz needs at least two answer options.',
          path: ['options'],
        });
      }

      const correctAnswer = lesson.correctAnswer?.trim();
      if (!correctAnswer || !options.some((option) => option.trim() === correctAnswer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Pick the correct answer from the quiz options.',
          path: ['correctAnswer'],
        });
      }
    }
  });

export const courseLessonSchema = courseBlockSchema.safeExtend({
  blocks: z.array(courseBlockSchema).min(1).max(12).optional(),
});

export const courseModuleSchema = z.object({
  id: z.string().min(1),
  title: z.string().trim().min(2, 'Each module needs a title.').max(90),
  lessons: z.array(courseLessonSchema).min(1, 'Add at least one lesson in this module.').max(20),
});

export const courseDraftSchema = z.object({
  title: z.string().trim().min(3, 'Please enter a course title.').max(120),
  category: z.enum(courseCategories),
  summary: z
    .string()
    .trim()
    .min(20, 'Add a short summary so learners can understand the course.')
    .max(500),
  ageRange: z.string().trim().min(2, 'Please choose an age range.').max(30),
  budget: z
    .string()
    .trim()
    .min(2, 'Add a rough time or resource budget.')
    .max(80)
    .default('Flexible'),
  status: z.enum(courseStatus).default('draft'),
});

export const courseOutlineSchema = z
  .object({
    modules: z.array(courseModuleSchema).min(1, 'Add at least one module.').max(12),
  })
  .superRefine((outline, ctx) => {
    const ids = new Set<string>();
    for (const part of outline.modules)
      for (const lesson of part.lessons) {
        if (ids.has(lesson.id))
          ctx.addIssue({ code: 'custom', message: 'Each lesson needs a unique ID.' });
        ids.add(lesson.id);
        for (const block of lesson.blocks ?? []) {
          if (ids.has(block.id))
            ctx.addIssue({ code: 'custom', message: 'Each activity needs a unique ID.' });
          ids.add(block.id);
        }
      }
    if (new TextEncoder().encode(JSON.stringify(outline)).length > 700000)
      ctx.addIssue({
        code: 'custom',
        message: 'This outline is too large. Split it into smaller courses.',
      });
  });

export const courseReadySchema = courseOutlineSchema.superRefine((outline, ctx) => {
  for (const [moduleIndex, part] of outline.modules.entries())
    for (const [lessonIndex, parent] of part.lessons.entries()) {
      for (const [blockIndex, lesson] of (parent.blocks ?? [parent]).entries()) {
        const path = ['modules', moduleIndex, 'lessons', lessonIndex];
        if (parent.blocks) path.push('blocks', blockIndex);
        if (['video', 'image', 'resource'].includes(lesson.kind) && !safeMediaUrl(lesson.mediaUrl))
          ctx.addIssue({
            code: 'custom',
            path: [...path, 'mediaUrl'],
            message: 'Add a valid HTTPS link.',
          });
        if (lesson.kind === 'video' && !videoEmbedUrl(lesson.mediaUrl))
          ctx.addIssue({
            code: 'custom',
            path: [...path, 'mediaUrl'],
            message: 'Use a YouTube or Vimeo video link.',
          });
        if (lesson.kind === 'image' && !lesson.alt?.trim())
          ctx.addIssue({
            code: 'custom',
            path: [...path, 'alt'],
            message: 'Describe the image for learners who cannot see it.',
          });
      }
    }
});

export type CourseDraftInput = z.infer<typeof courseDraftSchema>;
export type CourseLesson = z.infer<typeof courseLessonSchema>;
export type CourseBlock = z.infer<typeof courseBlockSchema>;
export type CourseModule = z.infer<typeof courseModuleSchema>;
export type CourseOutline = z.infer<typeof courseOutlineSchema>;
