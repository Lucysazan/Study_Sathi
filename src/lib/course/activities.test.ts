import { describe, expect, it } from 'vitest';
import { budgetActivitySchema, sortActivitySchema, checkBudget, checkSort } from './activities';
import { courseLessonSchema, courseReadySchema } from './draft';

const sorting = {
  buckets: ['Needs', 'Wants'],
  items: [
    { label: 'School books', bucket: 'Needs' },
    { label: 'A toy', bucket: 'Wants' },
  ],
};
const budget = { total: 500, currency: 'NPR' as const, categories: ['Needs', 'Wants', 'Savings'] };
const lesson = { id: 'activity', title: 'Have a go', duration: '5 min' };

describe('sorting activities', () => {
  it('accepts a complete activity in course submission', () => {
    const content = { ...lesson, kind: 'sort', sortActivity: sorting };
    expect(
      courseReadySchema.safeParse({
        modules: [{ id: 'part', title: 'Practice', lessons: [content] }],
      }).success,
    ).toBe(true);
  });
  it('rejects duplicate groups, ambiguous labels and missing answer groups', () => {
    expect(sortActivitySchema.safeParse({ ...sorting, buckets: ['Needs', 'needs'] }).success).toBe(
      false,
    );
    expect(
      sortActivitySchema.safeParse({ ...sorting, items: [sorting.items[0], sorting.items[0]] })
        .success,
    ).toBe(false);
    expect(
      sortActivitySchema.safeParse({
        ...sorting,
        items: [{ label: 'One', bucket: 'Missing' }, sorting.items[1]],
      }).success,
    ).toBe(false);
  });
  it('reports incomplete, wrong and correct answers without awarding points', () => {
    expect(checkSort(sorting, ['', 'Wants'])).toMatchObject({
      answered: 1,
      correct: 1,
      allCorrect: false,
    });
    expect(checkSort(sorting, ['Wants', 'Needs']).correct).toBe(0);
    expect(checkSort(sorting, ['Needs', 'Wants']).allCorrect).toBe(true);
    expect(checkSort(sorting, ['Needs', 'Wants', 'extra']).allCorrect).toBe(false);
  });
  it('requires activity data and enforces item/group limits', () => {
    expect(courseLessonSchema.safeParse({ ...lesson, kind: 'sort' }).success).toBe(false);
    expect(sortActivitySchema.safeParse({ ...sorting, buckets: ['Only one'] }).success).toBe(false);
    expect(
      sortActivitySchema.safeParse({
        ...sorting,
        items: Array.from({ length: 13 }, (_, index) => ({
          label: `Item ${index}`,
          bucket: 'Needs',
        })),
      }).success,
    ).toBe(false);
  });
});
describe('budget activities', () => {
  it('accepts zero allocations and any fully allocated plan', () => {
    expect(checkBudget(budget, ['500', '0', '0']).balanced).toBe(true);
    expect(checkBudget(budget, ['200', '100', '200']).balanced).toBe(true);
  });
  it('reports spare funds and overspending', () => {
    expect(checkBudget(budget, ['200', '100', '100'])).toMatchObject({
      valid: true,
      remaining: 100,
      balanced: false,
    });
    expect(checkBudget(budget, ['400', '100', '100']).remaining).toBe(-100);
  });
  it('rejects blanks, nonnumbers, negative, fractional and excessive allocations', () => {
    for (const value of ['', 'oops', 'Infinity', '-1', '0.5', '501'])
      expect(checkBudget(budget, [value, '0', '0']).valid).toBe(false);
    expect(checkBudget(budget, ['500', '0']).valid).toBe(false);
  });
  it('rejects invalid totals, currencies and duplicate categories', () => {
    for (const total of [0, -1, 0.5, 1000001])
      expect(budgetActivitySchema.safeParse({ ...budget, total }).success).toBe(false);
    expect(budgetActivitySchema.safeParse({ ...budget, currency: 'USD' }).success).toBe(false);
    expect(
      budgetActivitySchema.safeParse({ ...budget, categories: ['Needs', 'needs'] }).success,
    ).toBe(false);
    expect(courseLessonSchema.safeParse({ ...lesson, kind: 'budget' }).success).toBe(false);
  });
});
