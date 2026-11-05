import { z } from 'zod';

const label = z.string().trim().min(1, 'Please add a label.').max(100);
const unique = (values: string[]) =>
  new Set(values.map((value) => value.toLowerCase())).size === values.length;

export const sortActivitySchema = z
  .object({
    buckets: z.array(label).min(2).max(6),
    items: z
      .array(z.object({ label, bucket: label }))
      .min(2)
      .max(12),
  })
  .superRefine((activity, ctx) => {
    if (!unique(activity.buckets))
      ctx.addIssue({ code: 'custom', path: ['buckets'], message: 'Use different group names.' });
    if (!unique(activity.items.map((item) => item.label)))
      ctx.addIssue({ code: 'custom', path: ['items'], message: 'Use different item labels.' });
    for (const [index, item] of activity.items.entries()) {
      if (!activity.buckets.includes(item.bucket))
        ctx.addIssue({
          code: 'custom',
          path: ['items', index, 'bucket'],
          message: 'Choose an existing group for each item.',
        });
    }
  });

export const budgetActivitySchema = z.object({
  total: z.number().int().min(1).max(1000000),
  currency: z.literal('NPR'),
  categories: z.array(label).min(2).max(6).refine(unique, 'Use different category names.'),
});
export type SortActivity = z.infer<typeof sortActivitySchema>;
export type BudgetActivity = z.infer<typeof budgetActivitySchema>;

export function checkSort(activity: SortActivity, answers: readonly string[]) {
  const answered = activity.items.filter((_, index) =>
    activity.buckets.includes(answers[index] ?? ''),
  ).length;
  const correct = activity.items.filter((item, index) => answers[index] === item.bucket).length;
  return {
    answered,
    correct,
    total: activity.items.length,
    allCorrect: answers.length === activity.items.length && correct === activity.items.length,
  };
}

export function checkBudget(activity: BudgetActivity, values: readonly string[]) {
  const complete =
    values.length === activity.categories.length && values.every((value) => value.trim() !== '');
  const valid =
    complete &&
    values.every(
      (value) =>
        Number.isSafeInteger(Number(value)) &&
        Number(value) >= 0 &&
        Number(value) <= activity.total,
    );
  const total = values.reduce(
    (sum, value) => sum + (Number.isFinite(Number(value)) ? Number(value) : 0),
    0,
  );
  return {
    valid,
    total,
    remaining: activity.total - total,
    balanced: valid && total === activity.total,
  };
}
